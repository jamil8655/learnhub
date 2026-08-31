const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}

const db = admin.firestore();

async function runAuditAndVerification() {
  console.log('================================================================');
  console.log('🏛️ LEARNHUB — FIRESTORE COMPREHENSIVE PIPELINE VERIFICATION');
  console.log('================================================================');

  const testResults = [];

  const collectionsToTest = [
    { name: 'admins', id: 'sg2AS7ho1EVO3hSsRFpiO4J19M13', data: { role: 'administrator', verified: true } },
    { name: 'courses', id: 'crs-audit-test', data: { title: 'فہمِ قرآن و تجوید معائنہ', category: 'قرآنی علوم', price: 0, status: 'published' } },
    { name: 'lessons', id: 'les-audit-test', data: { courseId: 'crs-audit-test', title: 'مخارج الحروف', duration: '15 mins', status: 'published' } },
    { name: 'quizzes', id: 'qz-audit-test', data: { title: 'تجوید و مخارج ٹیسٹ', duration: 15, passingScore: 80, status: 'published' } },
    { name: 'questions', id: 'qq-audit-test', data: { quizId: 'qz-audit-test', questionText: 'حروفِ حلقی کتنے ہیں؟', options: ['6', '4', '8'] } },
    { name: 'quizAnswerKeys', id: 'qq-audit-test', data: { correctAnswerIndex: 0, explanation: 'حروفِ حلقی 6 ہیں: ء، ہ، ع، ح، غ، خ' } },
    { name: 'enrollments', id: 'enr-audit-test', data: { courseId: 'crs-audit-test', userId: 'sg2AS7ho1EVO3hSsRFpiO4J19M13', status: 'active' } },
    { name: 'certificates', id: 'cert-audit-test', data: { serialNumber: 'LH-CERT-2026-9999', recipientName: 'حافظ جمیل الرحمن', grade: 'ممتاز' } },
    { name: 'books', id: 'bk-audit-test', data: { title: 'اربعین نووی مترجم و مشروح', author: 'امام نووی', category: 'hadith' } },
    { name: 'hadiths', id: 'hd-audit-test', data: { book: 'Sahih Bukhari', hadithNumber: 1, chapter: 'کتاب بدء الوحی' } },
    { name: 'articles', id: 'art-audit-test', data: { title: 'تجوید کی شرعی اہمیت', author: 'ایڈمن', status: 'published' } },
    { name: 'notifications', id: 'notif-audit-test', data: { title: 'خوش آمدید', message: 'لرن ہب پر خوش آمدید', userId: 'all' } },
    { name: 'orders', id: 'ord-audit-test', data: { total: 0, status: 'completed', paymentMethod: 'Free Enrollment' } },
    { name: 'gameProgress', id: 'sg2AS7ho1EVO3hSsRFpiO4J19M13', data: { level: 5, totalXp: 2500, coins: 450, hearts: 5 } },
    { name: 'auditLogs', id: 'log-audit-test', data: { action: 'SYSTEM_AUDIT_COMPLETED', actorName: 'Hafiz Jamilurrahman', timestamp: new Date().toISOString() } },
    { name: 'adminSettings', id: 'system_core', data: { siteName: 'LearnHub', maintenanceMode: false, version: '202.0.0' } },
    { name: 'publicSettings', id: 'cms_general', data: { heroTitle: 'دینی و جدید علوم میں کمال حاصل کریں', bannerActive: true } }
  ];

  for (const item of collectionsToTest) {
    try {
      // 1. Write document
      await db.collection(item.name).doc(item.id).set({
        ...item.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 2. Read back document
      const docSnap = await db.collection(item.name).doc(item.id).get();
      if (docSnap.exists) {
        testResults.push({ collection: item.name, status: '✅ PASS', docId: item.id });
        console.log(`✅ [${item.name}] Document ${item.id} successfully written & verified in Firestore.`);
      } else {
        testResults.push({ collection: item.name, status: '❌ FAILED', docId: item.id });
      }
    } catch(err) {
      testResults.push({ collection: item.name, status: '❌ ERROR: ' + err.message, docId: item.id });
      console.error(`❌ [${item.name}] Error:`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log('📋 AUDIT SUMMARY TABLE');
  console.log('================================================================');
  console.table(testResults);
  console.log('================================================================\n');
}

runAuditAndVerification().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});
