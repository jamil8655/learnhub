const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Per-user call throttle, backed by Firestore so it holds across the many
 * short-lived function instances a callable runs on. Without it these
 * endpoints can be called in a loop — cheap abuse today, and directly a
 * billing problem once a paid model sits behind askAiScholar.
 *
 * Fails open on an unexpected error: a throttle outage should not take the
 * platform's quiz submission down with it.
 */
async function enforceRateLimit(userId, action, minIntervalSeconds) {
  const ref = db.collection('rateLimits').doc(`${userId}_${action}`);
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();

      if (snap.exists) {
        const last = snap.data().lastCallMs || 0;
        const waited = (now - last) / 1000;
        if (waited < minIntervalSeconds) {
          throw new functions.https.HttpsError(
            'resource-exhausted',
            `براہِ کرم ${Math.ceil(minIntervalSeconds - waited)} سیکنڈ بعد دوبارہ کوشش کریں۔`
          );
        }
      }

      tx.set(ref, { userId, action, lastCallMs: now }, { merge: true });
    });
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    console.warn('[rateLimit] check skipped:', err && err.message);
  }
}

/**
 * CANONICAL VERIFIED QUIZ BANK
 * Used for authoritative server-side evaluation and secret answer key lookup.
 */
const CANONICAL_QUIZ_KEYS = {
  'quiz-tajweed-01': {
    passPercentage: 75,
    xpReward: 150,
    questions: [
      { id: 'q-tj-1', correctOption: 1, explanation: 'حروف حلقی 6 ہیں: ء، ہ، ع، ح، غ، خ۔ ان پر اظہار ہوتا ہے۔' },
      { id: 'q-tj-2', correctOption: 2, explanation: 'حروف قلقلہ 5 ہیں: ق، ط، ب، ج، د (مجموعہ: قُطْبُ جَدٍّ)۔' },
      { id: 'q-tj-3', correctOption: 0, explanation: 'حرف را پر زبر یا پیش ہو تو اسے پُر (موٹا) پڑھا جاتا ہے۔' },
      { id: 'q-tj-4', correctOption: 3, explanation: 'ادغام مع الغنہ کے 4 حروف ہیں: ی، ن، م، و (مجموعہ: یَنْمُو)۔' }
    ]
  },
  'quiz-hadith-01': {
    passPercentage: 70,
    xpReward: 200,
    questions: [
      { id: 'q-hd-1', correctOption: 0, explanation: 'پہلی حدیث "إنما الأعمال بالنيات" ہے جس کے راوی حضرت عمر بن الخطاب رضی اللہ عنہ ہیں۔' },
      { id: 'q-hd-2', correctOption: 1, explanation: 'حدیث جبریل میں اسلام، ایمان، اور احسان کے بنیادی ارکان کی تعلیم دی گئی ہے۔' },
      { id: 'q-hd-3', correctOption: 2, explanation: 'امام نووی رحمہ اللہ نے اس مجموعے میں 42 جامع احادیث جمع فرمائیں۔' }
    ]
  },
  'quiz-seerah-01': {
    passPercentage: 75,
    xpReward: 250,
    questions: [
      { id: 'q-sr-1', correctOption: 0, explanation: 'غزوہ بدر 2 ہجری 17 رمضان المبارک کو پیش آیا۔' },
      { id: 'q-sr-2', correctOption: 1, explanation: 'صلح حدیبیہ 6 ہجری میں واقع ہوئی جسے قرآن نے "فتح مبین" قرار دیا۔' },
      { id: 'q-sr-3', correctOption: 2, explanation: 'فتح مکہ 8 ہجری 20 رمضان المبارک کو بلا جنگ حاصل ہوئی۔' }
    ]
  },
  'quiz-aqeedah-01': {
    passPercentage: 80,
    xpReward: 300,
    questions: [
      { id: 'q-aq-1', correctOption: 0, explanation: 'توحید کی 3 اقسام ہیں: توحید ربوبیت، توحید الوہیت، اور توحید اسماء و صفات۔' },
      { id: 'q-aq-2', correctOption: 2, explanation: 'ایمان زبان کے اقرار، دل کے یقین اور اعضاء کے اعمال کا نام ہے جو اطاعت سے بڑھتا ہے اور نافرمانی سے گھٹتا ہے۔' }
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTHORITATIVE SERVER-SIDE QUIZ SUBMISSION & GRADING CLOUD FUNCTION
 * ═══════════════════════════════════════════════════════════════════════════
 */
exports.submitQuizAttempt = functions.https.onCall(async (data, context) => {
  // 1. Mandatory Authentication Check
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'صرف لاگ ان شدہ طلباء ہی امتحانی جوابات جمع کروا سکتے ہیں۔ (Authentication required)'
    );
  }

  const userId = context.auth.uid;
  const userEmail = context.auth.token.email || '';
  const userName = context.auth.token.name || 'طالب علم';

  await enforceRateLimit(userId, 'submitQuizAttempt', 20);

  const { quizId, answers, timeTakenSeconds } = data;

  if (!quizId || typeof answers !== 'object') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'کوئز آئی ڈی اور جوابات کا ہونا ضروری ہے۔ (Missing quizId or answers)'
    );
  }

  // 2. Load Secret Quiz / Question Key
  let quizKey = CANONICAL_QUIZ_KEYS[quizId];

  // If not in static canonical table, check Firestore secret question bank
  if (!quizKey) {
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'مطلوبہ کوئز ریکارڈ میں موجود نہیں ہے۔ (Quiz not found)');
    }
    const quizData = quizDoc.data();
    
    // Fetch private questions
    const qSnap = await db.collection('quizzes').doc(quizId).collection('secretQuestions').get();
    if (!qSnap.empty) {
      quizKey = {
        passPercentage: quizData.passPercentage || 75,
        xpReward: quizData.xpReward || 150,
        questions: qSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      };
    } else {
      // Fallback: answer key stored on the quiz document itself.
      //
      // WARNING — the `quizzes` collection is world-readable (`allow read: if
      // true`), so any quiz whose questions carry `correctOption` here is
      // handing out its own answer key to anyone who fetches the document.
      // Grading still proceeds so existing quizzes keep working, but the
      // condition is recorded so it can be found and migrated into the
      // secretQuestions subcollection, which no client can read.
      const inlineQuestions = quizData.questions || [];
      const leaksAnswers = inlineQuestions.some((q) => q && q.correctOption !== undefined);

      if (leaksAnswers) {
        console.warn(
          `[SECURITY] Quiz ${quizId} stores its answer key on a publicly readable ` +
          `document. Migrate these questions to quizzes/${quizId}/secretQuestions.`
        );
        await db.collection('securityEvents').add({
          type: 'public_answer_key',
          quizId: quizId,
          questionCount: inlineQuestions.length,
          detectedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      quizKey = {
        passPercentage: quizData.passPercentage || 75,
        xpReward: quizData.xpReward || 150,
        questions: inlineQuestions
      };
    }
  }

  const questions = quizKey.questions || [];
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    throw new functions.https.HttpsError('failed-precondition', 'اس کوئز میں کوئی سوالات موجود نہیں ہیں۔');
  }

  // 3. Authoritative Grading Algorithm (Zero Client Trust)
  let correctCount = 0;
  const detailedBreakdown = [];

  for (const q of questions) {
    const selectedOption = answers[q.id] !== undefined ? parseInt(answers[q.id], 10) : null;
    const isCorrect = selectedOption !== null && selectedOption === q.correctOption;

    if (isCorrect) {
      correctCount++;
    }

    detailedBreakdown.push({
      questionId: q.id,
      selectedOption: selectedOption,
      correctOption: q.correctOption,
      isCorrect: isCorrect,
      explanation: q.explanation || ''
    });
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercentage >= quizKey.passPercentage;
  const pointsEarned = correctCount * 10;
  const xpEarned = passed ? quizKey.xpReward : Math.round(quizKey.xpReward * 0.25);

  const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowTimestamp = admin.firestore.FieldValue.serverTimestamp();

  // 4. Write Authoritative Quiz Attempt to Firestore (Admin SDK)
  const attemptRecord = {
    id: attemptId,
    userId: userId,
    userEmail: userEmail,
    userName: userName,
    quizId: quizId,
    score: correctCount,
    totalQuestions: totalQuestions,
    percentage: scorePercentage,
    passed: passed,
    timeTakenSeconds: parseInt(timeTakenSeconds || 0, 10),
    breakdown: detailedBreakdown,
    xpAwarded: xpEarned,
    isAuthoritativeServerGraded: true,
    completedAt: nowTimestamp
  };

  await db.collection('quizAttempts').doc(attemptId).set(attemptRecord);

  // 5. Update Student XP & Streak in gameProgress (Admin SDK)
  const progressRef = db.collection('gameProgress').doc(userId);
  const progressSnap = await progressRef.get();
  
  if (progressSnap.exists) {
    await progressRef.update({
      total_xp: admin.firestore.FieldValue.increment(xpEarned),
      total_quizzes_completed: admin.firestore.FieldValue.increment(1),
      lastActiveAt: nowTimestamp
    });
  } else {
    await progressRef.set({
      userId: userId,
      total_xp: xpEarned,
      level: 1,
      streak: 1,
      total_quizzes_completed: 1,
      lastActiveAt: nowTimestamp
    });
  }

  // 6. Return Verified Secure Scorecard to Student
  return {
    success: true,
    attemptId: attemptId,
    score: correctCount,
    totalQuestions: totalQuestions,
    percentage: scorePercentage,
    passed: passed,
    passPercentage: quizKey.passPercentage,
    xpEarned: xpEarned,
    breakdown: detailedBreakdown,
    verifiedBy: 'LearnHub Server Authority v2.0'
  };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROLE ASSIGNMENT — FIREBASE CUSTOM CLAIMS
 * ═══════════════════════════════════════════════════════════════════════════
 * Roles were held in localStorage. Two consequences followed: approving an
 * instructor in the admin panel set u.role on the approver's own machine and
 * granted the instructor nothing, because firestore.rules reads
 * request.auth.token.role; and any user could hand themselves the admin UI by
 * editing localStorage in DevTools.
 *
 * This is the authoritative path. A claim set here is minted into the user's
 * ID token by Firebase, is not editable from the browser, and is what the
 * rules already check.
 */

// Bootstrap only: these accounts can assign the first role before any claim
// exists, and mirror the addresses already hard-coded in firestore.rules.
// Once the owner has granted themselves an admin claim, this list and its
// counterpart in the rules should both be removed.
const BOOTSTRAP_ADMIN_EMAILS = [
  'jrahmanansari@gmail.com',
  'jrahmanansari132@gmail.com',
  'jrahmanansari133@gmail.com'
];

const ASSIGNABLE_ROLES = ['student', 'instructor', 'admin', 'super_admin'];

function callerIsAdmin(context) {
  const token = (context.auth && context.auth.token) || {};
  return (
    token.admin === true ||
    token.role === 'admin' ||
    token.role === 'super_admin' ||
    BOOTSTRAP_ADMIN_EMAILS.includes(token.email || '')
  );
}

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'لاگ ان درکار ہے۔');
  }
  if (!callerIsAdmin(context)) {
    throw new functions.https.HttpsError('permission-denied', 'صرف ایڈمن رول تفویض کر سکتا ہے۔');
  }

  const role = String((data && data.role) || '').trim();
  const targetEmail = String((data && data.email) || '').trim().toLowerCase();
  let targetUid = String((data && data.uid) || '').trim();

  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `رول ان میں سے ہونا چاہیے: ${ASSIGNABLE_ROLES.join(', ')}`
    );
  }
  if (!targetUid && !targetEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'صارف کی uid یا ای میل درکار ہے۔');
  }

  let targetUser;
  try {
    targetUser = targetUid
      ? await admin.auth().getUser(targetUid)
      : await admin.auth().getUserByEmail(targetEmail);
    targetUid = targetUser.uid;
  } catch (e) {
    throw new functions.https.HttpsError('not-found', 'یہ صارف Firebase میں موجود نہیں ہے۔');
  }

  // Losing your own admin rights mid-session can leave a project with no way
  // back in, so self-demotion is refused; another admin must do it.
  const isDemotion = role !== 'admin' && role !== 'super_admin';
  if (targetUid === context.auth.uid && isDemotion) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'اپنا ہی ایڈمن رول ختم نہیں کیا جا سکتا۔ کسی دوسرے ایڈمن سے کروائیں۔'
    );
  }

  const existingClaims = targetUser.customClaims || {};
  await admin.auth().setCustomUserClaims(targetUid, {
    ...existingClaims,
    role: role,
    admin: role === 'admin' || role === 'super_admin'
  });

  // Mirrored onto the user document so admin listings can show the role
  // without a lookup. The claim above stays the authority.
  await db.collection('users').doc(targetUid).set(
    { role: role, roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  await db.collection('auditLogs').add({
    action: 'ROLE_ASSIGNED',
    actorUid: context.auth.uid,
    actorEmail: context.auth.token.email || '',
    targetUid: targetUid,
    targetEmail: targetUser.email || '',
    previousRole: existingClaims.role || 'student',
    newRole: role,
    at: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    uid: targetUid,
    email: targetUser.email || '',
    role: role,
    // The claim only reaches the browser on the next token refresh.
    note: 'صارف کو اگلی بار ٹوکن ریفریش یا دوبارہ لاگ اِن پر نیا رول ملے گا۔'
  };
});

/**
 * Lets a signed-in user read their own verified role straight from the token.
 * Useful for a UI that must not trust localStorage.
 */
exports.getMyRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'لاگ ان درکار ہے۔');
  }
  const token = context.auth.token || {};
  return {
    uid: context.auth.uid,
    role: token.role || 'student',
    admin: token.admin === true,
    bootstrapAdmin: BOOTSTRAP_ADMIN_EMAILS.includes(token.email || '')
  };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADVENTURE GAME — SERVER-SIDE XP AWARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Firestore rules no longer let a client write total_xp, so stage rewards are
 * granted here instead.
 *
 * SCOPE — read this before trusting it further than it goes. Adventure-game
 * questions are generated on the client (see gameEngine.js), so the server
 * cannot re-grade the answers the way submitQuizAttempt does. A determined
 * client can still claim a perfect run on a stage it played badly. What this
 * does remove is unbounded forgery: the reward comes from a server-held stage
 * record, every award is capped, and replaying a stage only ever pays the
 * improvement over what that stage already paid out — so XP cannot be farmed
 * by looping one stage, and total_xp: 999999999 is no longer expressible.
 *
 * Closing the remaining gap means moving question generation server-side.
 */
const GAME_XP_HARD_CAP = 250;      // absolute ceiling for one stage completion
const GAME_XP_DEFAULT_BASE = 150;  // used when a stage has no server record yet
const GAME_MAX_QUESTIONS = 100;

exports.recordGameStageCompletion = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'لاگ ان درکار ہے۔');
  }

  const userId = context.auth.uid;
  await enforceRateLimit(userId, 'recordGameStageCompletion', 10);

  const stageId = String((data && data.stageId) || '').trim();
  const worldId = String((data && data.worldId) || '').trim();
  const correctCount = parseInt((data && data.correctCount) || 0, 10);
  const wrongCount = parseInt((data && data.wrongCount) || 0, 10);

  if (!stageId) {
    throw new functions.https.HttpsError('invalid-argument', 'مرحلے کی شناخت درکار ہے۔');
  }
  if (
    !Number.isInteger(correctCount) || !Number.isInteger(wrongCount) ||
    correctCount < 0 || wrongCount < 0
  ) {
    throw new functions.https.HttpsError('invalid-argument', 'جوابات کی گنتی درست نہیں۔');
  }

  const totalAnswered = correctCount + wrongCount;
  if (totalAnswered === 0 || totalAnswered > GAME_MAX_QUESTIONS) {
    throw new functions.https.HttpsError('invalid-argument', 'سوالات کی تعداد درست نہیں۔');
  }

  // Reward comes from the server's stage record, never from the request body.
  let baseRewardXp = GAME_XP_DEFAULT_BASE;
  const stageDoc = await db.collection('gameStages').doc(stageId).get();
  if (stageDoc.exists) {
    baseRewardXp = Number(stageDoc.data().rewardXp) || GAME_XP_DEFAULT_BASE;
  }
  baseRewardXp = Math.max(0, Math.min(baseRewardXp, GAME_XP_HARD_CAP));

  const accuracy = Math.round((correctCount / totalAnswered) * 100);
  let stars = 0;
  if (accuracy >= 90) stars = 3;
  else if (accuracy >= 75) stars = 2;
  else if (accuracy >= 60) stars = 1;

  const grossXp = Math.min(
    Math.round(baseRewardXp * (accuracy / 100)) + (stars === 3 ? 50 : 0),
    GAME_XP_HARD_CAP
  );

  const progressRef = db.collection('gameProgress').doc(userId);

  // stageAwards is server-owned (clients are blocked from it in firestore.rules)
  // and records what each stage has already paid, so a replay can only earn the
  // difference rather than the full reward again.
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(progressRef);
    const current = snap.exists ? snap.data() : {};
    const awards = current.stageAwards || {};
    const alreadyAwarded = Number(awards[stageId] || 0);

    const xpDelta = Math.max(0, grossXp - alreadyAwarded);
    // Take the higher of the two historical XP fields so reconciling the
    // spellings can never reduce a player's existing score.
    const existingXp = Math.max(Number(current.total_xp || 0), Number(current.totalXp || 0));
    const newTotalXp = existingXp + xpDelta;

    // Level N requires N^2 * 100 total XP, matching gameEngine.js.
    const newLevel = Math.max(1, Math.floor(Math.sqrt(newTotalXp / 100)) + 1);

    // Written under both spellings on purpose: gameEngine.js reads `totalXp`,
    // the quiz function writes `total_xp`, and the two had drifted apart in the
    // same document. Keeping them equal means the player's game profile and
    // their quiz XP finally agree.
    const payload = {
      userId: userId,
      total_xp: newTotalXp,
      totalXp: newTotalXp,
      level: newLevel,
      stageAwards: Object.assign({}, awards, { [stageId]: Math.max(alreadyAwarded, grossXp) }),
      lastActiveAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (!snap.exists) {
      payload.streak = 1;
      payload.total_quizzes_completed = 0;
    }

    tx.set(progressRef, payload, { merge: true });

    return { xpAwarded: xpDelta, grossXp: grossXp, totalXp: newTotalXp, level: newLevel };
  });

  // Attempt history, written server-side so it cannot be back-dated or forged.
  await db.collection('gameAttempts').add({
    userId: userId,
    stageId: stageId,
    worldId: worldId,
    correctCount: correctCount,
    wrongCount: wrongCount,
    accuracy: accuracy,
    stars: stars,
    xpAwarded: result.xpAwarded,
    isServerAwarded: true,
    completedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    accuracy: accuracy,
    stars: stars,
    xpAwarded: result.xpAwarded,
    alreadyEarnedForStage: result.grossXp - result.xpAwarded,
    totalXp: result.totalXp,
    level: result.level,
    verifiedBy: 'LearnHub Server Authority v2.0'
  };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTHORITATIVE CERTIFICATE ISSUANCE & VERIFICATION CLOUD FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * Grade is derived from the server-graded percentage, never from client input.
 */
function gradeFromPercentage(percentage) {
  const pct = Number(percentage) || 0;
  if (pct >= 90) return 'ممتاز (Distinction)';
  if (pct >= 80) return 'بہت اچھا (Very Good)';
  if (pct >= 70) return 'اچھا (Good)';
  return 'کامیاب (Pass)';
}

exports.issueCertificate = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'لاگ ان درکار ہے۔');
  }

  const userId = context.auth.uid;
  const attemptId = data && data.attemptId;

  // SECURITY: attemptId is MANDATORY. It was previously optional, so a client
  // could mint an unearned certificate simply by omitting the field.
  if (!attemptId || typeof attemptId !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'سند کے اجرا کے لیے کامیاب امتحان کا حوالہ (attemptId) لازمی ہے۔'
    );
  }

  const attDoc = await db.collection('quizAttempts').doc(attemptId).get();
  if (!attDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'امتحانی ریکارڈ موجود نہیں ہے۔');
  }
  const attempt = attDoc.data();

  // Ownership, a genuine pass, and proof the attempt was graded by this server.
  if (
    attempt.userId !== userId ||
    attempt.passed !== true ||
    attempt.isAuthoritativeServerGraded !== true
  ) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'سند کے لیے امتحان میں کامیابی لازمی ہے۔'
    );
  }

  // Idempotent: one certificate per attempt, so retries cannot mint duplicates.
  const certId = `cert-${attemptId}`;
  const certRef = db.collection('certificates').doc(certId);
  const existing = await certRef.get();
  if (existing.exists) {
    return { success: true, alreadyIssued: true, certificate: existing.data() };
  }

  // Title and name come from server-held records, not from the request body.
  const studentName = context.auth.token.name || attempt.userName || 'طالب علم';
  let courseTitle = attempt.quizTitle || '';
  if (!courseTitle) {
    const quizDoc = await db.collection('quizzes').doc(attempt.quizId).get();
    courseTitle = (quizDoc.exists && quizDoc.data().title) || 'علومِ اسلامیہ و قرآنی تجوید';
  }

  const year = new Date().getFullYear();
  const counterRef = db.collection('counters').doc('certificates');

  // Atomic serial allocation. The previous count()+1 approach raced under
  // concurrent issuance and could emit duplicate serial numbers.
  const serialNumber = await db.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const next = ((counterSnap.exists && counterSnap.data().count) || 0) + 1;
    const serial = `LH-CERT-${year}-${String(next).padStart(4, '0')}`;

    tx.set(counterRef, { count: next }, { merge: true });
    tx.set(certRef, {
      id: certId,
      serialNumber: serial,
      certificateNumber: serial,
      userId: userId,
      attemptId: attemptId,
      quizId: attempt.quizId,
      percentage: attempt.percentage,
      studentName: studentName,
      courseTitle: courseTitle,
      grade: gradeFromPercentage(attempt.percentage),
      status: 'active', // active | revoked
      issuedAt: admin.firestore.FieldValue.serverTimestamp(),
      issuedBy: 'مجلسِ امتحانات لرن ہب اکیڈمی',
      verificationUrl: `https://learnhubplatform.com/#/verify-cert/${serial}`
    });

    return serial;
  });

  const saved = await certRef.get();
  return { success: true, certificate: saved.data(), serialNumber: serialNumber };
});

/**
 * Certificate revocation — admin authority only.
 */
exports.revokeCertificate = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'صرف ایڈمن سند منسوخ کر سکتا ہے۔');
  }

  const { serialNumber, reason } = data || {};
  if (!serialNumber) {
    throw new functions.https.HttpsError('invalid-argument', 'سیریل نمبر فراہم کریں۔');
  }

  const qSnap = await db.collection('certificates')
    .where('serialNumber', '==', String(serialNumber).trim().toUpperCase())
    .limit(1)
    .get();

  if (qSnap.empty) {
    throw new functions.https.HttpsError('not-found', 'سند ریکارڈ میں موجود نہیں ہے۔');
  }

  await qSnap.docs[0].ref.update({
    status: 'revoked',
    revokedReason: reason || '',
    revokedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

exports.verifyCertificate = functions.https.onCall(async (data) => {
  const { serialNumber } = data;
  if (!serialNumber) {
    throw new functions.https.HttpsError('invalid-argument', 'سیریل نمبر فراہم کریں۔');
  }

  const searchSerial = String(serialNumber).trim().toUpperCase();
  const qSnap = await db.collection('certificates')
    .where('serialNumber', '==', searchSerial)
    .limit(1)
    .get();

  if (qSnap.empty) {
    return { found: false, message: 'یہ سند ریکارڈ میں موجود نہیں ہے۔' };
  }

  const cert = qSnap.docs[0].data();
  return {
    found: true,
    status: cert.status || 'active',
    isValid: cert.status !== 'revoked',
    certificate: {
      serialNumber: cert.serialNumber,
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      grade: cert.grade,
      issuedAt: cert.issuedAt,
      issuedBy: cert.issuedBy,
      status: cert.status || 'active'
    }
  };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AI SCHOLAR — STATIC SAFE RESPONDER
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTE: This is NOT a RAG implementation. There is no retrieval step, no
 * knowledge base and no language model behind this endpoint — it returns a
 * fixed, reviewed Urdu template. It is deliberately safe (it cannot generate
 * a fatwa), but do not describe it as RAG anywhere until retrieval and an
 * admin-approved source corpus actually exist.
 */
exports.askAiScholar = functions.https.onCall(async (data, context) => {
  // Authentication: the other callables require it, this one did not. Keeping
  // it open would become an unauthenticated, unmetered cost centre the moment
  // a real model is wired in behind it.
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'لاگ ان درکار ہے۔');
  }

  await enforceRateLimit(context.auth.uid, 'askAiScholar', 5);

  const query = String((data && data.query) || '').trim();
  if (!query) {
    throw new functions.https.HttpsError('invalid-argument', 'سوال درج کریں۔');
  }
  if (query.length > 500) {
    throw new functions.https.HttpsError('invalid-argument', 'سوال بہت طویل ہے۔');
  }

  // The query is echoed into the response below, so strip markup to avoid
  // rendering injected content in the client.
  const safeQuery = query.replace(/[<>{}[\]`]/g, '').substring(0, 50);

  return {
    title: `علمی تحقیق: "${safeQuery}"`,
    content: `اس مسئلے کے متعلق قرآن و سنت کی روشنی میں بنیادی رہنمائی:

1. **قرآنی اصول**: قرآن مجید کی آیات اور سنتِ مطہرہ کا اتباع دین کی بنیاد ہے۔
2. **حدیث نبوی**: رسول اللہ ﷺ نے ہر معاملے میں عدل، اخلاص اور اتباعِ سنت کی تاکید فرمائی ہے۔

> [!NOTE]
> **⚠️ اہم شرعی تنبیہ:** یہ علمی و تعلیمی معلومات ہیں، فتویٰ نہیں۔ مخصوص اور ذاتی مسائل کے لیے مستند دار الافتاء اور جید علمائے کرام سے براہِ راست رجوع فرمائیں۔`,
    references: ['قرآن مجید', 'صحیح بخاری', 'صحیح مسلم']
  };
});

