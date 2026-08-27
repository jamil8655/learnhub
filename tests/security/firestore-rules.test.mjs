import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const RULES = process.argv[2] || '../../firestore.rules';
const LABEL = process.argv[3] || RULES;

const testEnv = await initializeTestEnvironment({
  projectId: 'learnhub-rules-test',
  firestore: { rules: readFileSync(RULES, 'utf8'), host: '127.0.0.1', port: 8080 }
});

const results = [];
async function check(name, expect, fn) {
  try {
    await (expect === 'DENY' ? assertFails(fn()) : assertSucceeds(fn()));
    results.push({ name, expect, outcome: 'as expected' });
  } catch (e) {
    results.push({ name, expect, outcome: 'UNEXPECTED — ' + (e.message || '').split('\n')[0].slice(0, 90) });
  }
}

const student = testEnv.authenticatedContext('student1', { email: 's1@test.com' }).firestore();
const attacker = testEnv.authenticatedContext('attacker', { email: 'evil@test.com' }).firestore();
const teacher = testEnv.authenticatedContext('teacher1', { email: 't1@test.com', role: 'instructor' }).firestore();
const anon = testEnv.unauthenticatedContext().firestore();

// Seed docs bypassing rules
await testEnv.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'gameProgress/student1'), { userId: 'student1', total_xp: 100, level: 2, streak: 3 });
  await setDoc(doc(db, 'enrollments/enr1'), { userId: 'student1', courseId: 'c1' });
  await setDoc(doc(db, 'sunnahTrackers/tr1'), { userId: 'student1', fajr: true });
  await setDoc(doc(db, 'courses/c1'), { instructorId: 'teacher1', title: 'Tajweed' });
});

// ---- ATTACK 1: forge XP on own gameProgress ----
await check('A1  student inflates own total_xp to 999999999', 'DENY', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { total_xp: 999999999 }));

await check('A2  student inflates own streak', 'DENY', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { streak: 500 }));

// gameEngine.js stores the player's score as camelCase `totalXp` while the
// Cloud Functions write snake_case `total_xp`. Guarding one spelling leaves
// the other wide open, so both are exercised here.
await check('A2b student inflates camelCase totalXp (the field the client uses)', 'DENY', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { totalXp: 999999999 }));

await check('A2c student wipes server-owned stageAwards to re-farm a stage', 'DENY', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { stageAwards: {} }));

await check('A2d student raises own level directly', 'DENY', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { level: 99 }));

await check('A3  student syncs NON-scoring progress (must still work)', 'ALLOW', () =>
  updateDoc(doc(student, 'gameProgress/student1'), { currentStage: 7 }));

await check('A4  new player creates progress starting at zero', 'ALLOW', () =>
  setDoc(doc(attacker, 'gameProgress/attacker'), { userId: 'attacker', total_xp: 0, level: 1, streak: 0 }));

await check('A5  new player self-creates progress pre-loaded with XP', 'DENY', () =>
  setDoc(doc(attacker, 'gameProgress/attacker2'), { userId: 'attacker2', total_xp: 50000, level: 1, streak: 0 }));

// ---- ATTACK 2: IDOR - hijack another user's docs ----
await check('A6  attacker hijacks victim enrollment by rewriting userId', 'DENY', () =>
  updateDoc(doc(attacker, 'enrollments/enr1'), { userId: 'attacker' }));

await check('A7  attacker hijacks victim sunnahTracker', 'DENY', () =>
  updateDoc(doc(attacker, 'sunnahTrackers/tr1'), { userId: 'attacker' }));

await check('A8  owner updates their own enrollment (must still work)', 'ALLOW', () =>
  updateDoc(doc(student, 'enrollments/enr1'), { progress: 40 }));

// ---- ATTACK 3: donations spam ----
await check('A9  anonymous writes to donations collection', 'DENY', () =>
  setDoc(doc(anon, 'donations/d1'), { amount: 1, userId: 'x' }));

// ---- ATTACK 4: quiz attempts / certificates forgery ----
await check('A10 student forges a passed quizAttempt', 'DENY', () =>
  setDoc(doc(student, 'quizAttempts/fake1'), { userId: 'student1', passed: true, percentage: 100 }));

await check('A11 student self-issues a certificate', 'DENY', () =>
  setDoc(doc(student, 'certificates/fake1'), { userId: 'student1', grade: 'Distinction' }));

// ---- ATTACK 5: privilege escalation ----
await check('A12 student self-grants admin role on own user doc', 'DENY', () =>
  setDoc(doc(student, 'users/student1'), { role: 'admin' }, { merge: true }));

// ---- ATTACK 6: instructor scoping ----
await check('A13 instructor creates own course (must work)', 'ALLOW', () =>
  setDoc(doc(teacher, 'courses/c2'), { instructorId: 'teacher1', title: 'New' }));

await check('A14 instructor files course under ANOTHER instructor', 'DENY', () =>
  setDoc(doc(teacher, 'courses/c3'), { instructorId: 'someone-else', title: 'X' }));

await check('A15 instructor edits a course they do not own', 'DENY', () =>
  updateDoc(doc(attacker, 'courses/c1'), { title: 'Hijacked' }));

console.log(`\n═══ ${LABEL} ═══`);
let unexpected = 0;
for (const r of results) {
  const bad = r.outcome !== 'as expected';
  if (bad) unexpected++;
  console.log(`${bad ? '  ✗' : '  ✓'} [${r.expect.padEnd(5)}] ${r.name}${bad ? '  →  ' + r.outcome : ''}`);
}
console.log(`  ${results.length - unexpected}/${results.length} behaved as expected\n`);
await testEnv.cleanup();
process.exit(0);
