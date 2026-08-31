const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');
const path = require('path');
const fs = require('fs');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}

const db = admin.firestore();

async function seedCompleteSuite() {
  console.log('================================================================');
  console.log('🌟 SEEDING COMPLETE DOMAIN SUITE TO GOOGLE CLOUD FIRESTORE');
  console.log('================================================================');

  // 1. Coupons Collection
  const coupons = [
    { id: 'LEARN20', code: 'LEARN20', discountType: 'percentage', discountValue: 20, maxUses: 1000, currentUses: 42, minOrderAmount: 0, expiresAt: '2027-12-31', status: 'active', description: '20% Welcome Discount for All Learners' },
    { id: 'RAMADAN50', code: 'RAMADAN50', discountType: 'percentage', discountValue: 50, maxUses: 500, currentUses: 110, minOrderAmount: 0, expiresAt: '2027-12-31', status: 'active', description: '50% Special Ramadan Blessing Discount' },
    { id: 'TALIB100', code: 'TALIB100', discountType: 'percentage', discountValue: 100, maxUses: 200, currentUses: 15, minOrderAmount: 0, expiresAt: '2027-12-31', status: 'active', description: '100% Full Scholarship for Deserving Students' }
  ];
  const couponBatch = db.batch();
  coupons.forEach(c => couponBatch.set(db.collection('coupons').doc(c.id), { ...c, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await couponBatch.commit();
  console.log(`✅ Seeded ${coupons.length} coupons to [coupons]`);

  // 2. Badges & Achievements Collection
  const badges = [
    { id: 'badge-tajweed-master', title: 'سلطانِ تجوید', category: 'quran', icon: 'crown', description: 'تجوید و ترتیل کے تمام 10 مراحل میں 100% درستگی حاصل کرنے پر۔', xpReward: 500 },
    { id: 'badge-hadith-scholar', title: 'محققِ حدیث', category: 'hadith', icon: 'sparkles', description: 'اربعین نووی اور صحاح ستہ کے 100 امتحانات میں اعلیٰ کارکردگی۔', xpReward: 600 },
    { id: 'badge-fiqh-expert', title: 'فقیہ العبادات', category: 'fiqh', icon: 'shield-check', description: 'فقہ الطہارة و الصلوٰة کے تمام احکام میں مہارتِ تامہ۔', xpReward: 550 },
    { id: 'badge-streak-30', title: 'استقامتِ علم (30 Days)', category: 'streak', icon: 'flame', description: 'مسلسل 30 دن تک روزانہ لرننگ اسٹریک برقرار رکھنے پر۔', xpReward: 1000 },
    { id: 'badge-class-10-grandmaster', title: 'گرینڈ ماسٹر فارغ التحصیل', category: 'general', icon: 'award', description: 'کلاس 1 تا 10 کے تمام 43 مراحل کامیابی سے مکمل کرنے پر شاہی اعزاز۔', xpReward: 2000 }
  ];
  const badgeBatch = db.batch();
  badges.forEach(b => badgeBatch.set(db.collection('badges').doc(b.id), { ...b, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await badgeBatch.commit();
  console.log(`✅ Seeded ${badges.length} badges to [badges]`);

  // 3. Downloadable Resources Collection
  const resources = [
    { id: 'res-tajweed-chart', title: 'جامع مخارج و صفات الحروف چارٹ (PDF)', category: 'تجوید', fileType: 'pdf', fileSize: '2.4 MB', downloadUrl: 'https://learnhubplatform.com/resources/tajweed-chart.pdf', downloadsCount: 1420 },
    { id: 'res-hadith-sanad', title: 'شجرۂ اسنادِ حدیث و ائمہ رجال (PDF)', category: 'حدیث', fileType: 'pdf', fileSize: '4.1 MB', downloadUrl: 'https://learnhubplatform.com/resources/hadith-sanad.pdf', downloadsCount: 980 },
    { id: 'res-fiqh-summary', title: 'خلاصۂ فقہ العبادات و احکامِ میت (PDF)', category: 'فقہ', fileType: 'pdf', fileSize: '1.8 MB', downloadUrl: 'https://learnhubplatform.com/resources/fiqh-summary.pdf', downloadsCount: 1650 },
    { id: 'res-mirath-tables', title: 'جدولِ تقسیمِ وراثت و حصصِ شرعیہ (PDF)', category: 'وراثت', fileType: 'pdf', fileSize: '3.0 MB', downloadUrl: 'https://learnhubplatform.com/resources/mirath-tables.pdf', downloadsCount: 2100 }
  ];
  const resBatch = db.batch();
  resources.forEach(r => resBatch.set(db.collection('resources').doc(r.id), { ...r, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await resBatch.commit();
  console.log(`✅ Seeded ${resources.length} resources to [resources]`);

  // 4. Daily Azkar Collection
  const dailyAzkar = [
    { id: 'zkr-morning-1', category: 'morning', title: 'دعائے صبح', textArabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', textUrdu: 'ہم نے صبح کی اور اللہ کے سارے ملک نے صبح کی، اور تمام تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں۔', count: 1, benefit: 'دن بھر کی حفاظت اور برکت' },
    { id: 'zkr-evening-1', category: 'evening', title: 'دعائے شام', textArabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', textUrdu: 'ہم نے شام کی اور اللہ کے سارے ملک نے شام کی، اور تمام تعریف اللہ کے لیے ہے۔', count: 1, benefit: 'رات بھر کی حفاظت اور سلامتی' },
    { id: 'zkr-sayyidul-istighfar', category: 'general', title: 'سید الاستغفار', textArabic: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', textUrdu: 'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔', count: 1, benefit: 'جنت کی بشارت والی عظیم دعا' }
  ];
  const zkrBatch = db.batch();
  dailyAzkar.forEach(z => zkrBatch.set(db.collection('dailyAzkar').doc(z.id), { ...z, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await zkrBatch.commit();
  console.log(`✅ Seeded ${dailyAzkar.length} azkar to [dailyAzkar]`);

  // 5. Game Missions Collection
  const gameMissions = [
    { id: 'msn-daily-1', title: 'روزانہ کا پہلا سبق مکمل کریں', type: 'daily', goal: 1, current: 0, rewardXp: 100, rewardCoins: 30, icon: 'book-open' },
    { id: 'msn-daily-2', title: 'کسی بھی کوئز میں 80%+ اسکور حاصل کریں', type: 'daily', goal: 1, current: 0, rewardXp: 150, rewardCoins: 50, icon: 'target' },
    { id: 'msn-weekly-1', title: 'ایڈونچر گیم کے 5 لیولز مکمل کریں', type: 'weekly', goal: 5, current: 0, rewardXp: 500, rewardCoins: 150, icon: 'trophy' }
  ];
  const msnBatch = db.batch();
  gameMissions.forEach(m => msnBatch.set(db.collection('gameMissions').doc(m.id), { ...m, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await msnBatch.commit();
  console.log(`✅ Seeded ${gameMissions.length} game missions to [gameMissions]`);

  // 6. Asma-ul-Husna (99 Names of Allah) Collection
  const asmaSample = [
    { id: 'asma-1', number: 1, nameArabic: 'الرَّحْمٰنُ', nameUrdu: 'بہت رحم فرمانے والا', benefit: 'جو شخص روزانہ 100 بار پڑھے گا دل میں رقت اور شفقت پیدا ہوگی۔' },
    { id: 'asma-2', number: 2, nameArabic: 'الرَّحِيمُ', nameUrdu: 'نہایت مہربان', benefit: 'ہر نماز کے بعد 100 بار پڑھنے سے آفات و بلیات سے حفاظت رہتی ہے۔' },
    { id: 'asma-3', number: 3, nameArabic: 'الْمَلِكُ', nameUrdu: 'حقیقی بادشاہ', benefit: 'زوال کے بعد کثرت سے پڑھنے سے غنا اور خود اعتمادی نصیب ہوتی ہے۔' },
    { id: 'asma-4', number: 4, nameArabic: 'الْقُدُّوسُ', nameUrdu: 'نہایت پاک ذات', benefit: 'دل کی کدورتوں اور وسوسوں سے نجات کے لیے اکسیر ہے۔' },
    { id: 'asma-5', number: 5, nameArabic: 'السَّلَامُ', nameUrdu: 'سلامتی دینے والا', benefit: 'مریض پر 160 بار پڑھ کر دم کرنے سے شفا حاصل ہوتی ہے۔' }
  ];
  const asmaBatch = db.batch();
  asmaSample.forEach(a => asmaBatch.set(db.collection('asmaulHusna').doc(a.id), { ...a, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
  await asmaBatch.commit();
  console.log(`✅ Seeded ${asmaSample.length} names to [asmaulHusna]`);

  // Final Comprehensive Collections Audit
  console.log('\n================================================================');
  console.log('🏛️ ULTIMATE FIRESTORE ARCHITECTURE — ALL COLLECTIONS DIRECTORY');
  console.log('================================================================');
  
  const allCollections = [
    'admins', 'courses', 'lessons', 'quizzes', 'questions', 'quizAnswerKeys',
    'categories', 'instructors', 'books', 'hadiths', 'articles',
    'gameWorlds', 'gameStages', 'gameMissions', 'badges', 'dailyAzkar',
    'asmaulHusna', 'resources', 'coupons', 'notifications',
    'adminSettings', 'publicSettings'
  ];

  for (const c of allCollections) {
    const snap = await db.collection(c).get();
    console.log(`📁 ${c.padEnd(18, ' ')} : ${String(snap.size).padStart(3, ' ')} documents live in Firebase Console.`);
  }
  console.log('================================================================\n');
}

seedCompleteSuite().catch(e => {
  console.error(e);
  process.exit(1);
});
