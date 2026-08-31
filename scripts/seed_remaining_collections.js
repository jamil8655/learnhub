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

// Load data sources
const dbJsContent = fs.readFileSync(path.resolve(__dirname, '../js/data/db.js'), 'utf8');
const match = dbJsContent.match(/const\s+SEED_DATA\s*=\s*(\{[\s\S]*?\n\};)/);
const fn = new Function('return ' + match[1]);
const seed = fn();

async function seedRemaining() {
  console.log('Seeding questions, categories, instructors, and hadiths...');

  // 1. Questions & quizAnswerKeys
  const questions = seed.quizQuestions || [];
  if (questions.length) {
    const batch = db.batch();
    questions.forEach(q => {
      const qRef = db.collection('questions').doc(String(q.id));
      batch.set(qRef, {
        id: q.id,
        quizId: q.quizId,
        order: q.order || 1,
        type: q.type || 'multiple_choice',
        marks: q.marks || 10,
        questionText: q.questionText,
        options: q.options,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      const kRef = db.collection('quizAnswerKeys').doc(String(q.id));
      batch.set(kRef, {
        id: q.id,
        quizId: q.quizId,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || '',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
    console.log(`✅ Seeded ${questions.length} items to [questions] and [quizAnswerKeys]`);
  }

  // 2. Categories
  const categories = seed.categories || [];
  if (categories.length) {
    const batch = db.batch();
    categories.forEach(c => {
      const cRef = db.collection('categories').doc(String(c.id));
      batch.set(cRef, { ...c, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    console.log(`✅ Seeded ${categories.length} items to [categories]`);
  }

  // 3. Instructors
  const instructors = seed.instructors || [];
  if (instructors.length) {
    const batch = db.batch();
    instructors.forEach(inst => {
      const instRef = db.collection('instructors').doc(String(inst.id));
      batch.set(instRef, { ...inst, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    console.log(`✅ Seeded ${instructors.length} items to [instructors]`);
  }

  // 4. Hadiths
  const hadiths = [
    { id: 'hd-1', book: 'صحیح بخاری', hadithNumber: 1, chapter: 'کتاب بدء الوحی', textArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', textUrdu: 'اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔', narrator: 'حضرت عمر بن الخطاب رضی اللہ عنہ', grade: 'صحیح متفق علیہ' },
    { id: 'hd-2', book: 'صحیح مسلم', hadithNumber: 1, chapter: 'کتاب الایمان', textArabic: 'الإِسْلامُ أَنْ تَشْهَدَ أَنْ لا إِلَهَ إِلا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', textUrdu: 'اسلام یہ ہے کہ تم گواہی دو کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں۔', narrator: 'حضرت عبد اللہ بن عمر رضی اللہ عنہما', grade: 'صحیح' },
    { id: 'hd-3', book: 'جامع ترمذی', hadithNumber: 1987, chapter: 'کتاب البر والصلة', textArabic: 'الْبِرُّ حُسْنُ الْخُلُقِ', textUrdu: 'نیکی اچھے اخلاق کا نام ہے۔', narrator: 'حضرت نواس بن سمعان رضی اللہ عنہ', grade: 'صحیح' },
    { id: 'hd-4', book: 'اربعین نووی', hadithNumber: 2, chapter: 'حدیث جبرائیل', textArabic: 'الإِحْسَانُ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ', textUrdu: 'احسان یہ ہے کہ تم اللہ کی عبادت اس طرح کرو گویا تم اسے دیکھ رہے ہو۔', narrator: 'حضرت عمر بن الخطاب رضی اللہ عنہ', grade: 'صحیح' }
  ];
  const hBatch = db.batch();
  hadiths.forEach(h => {
    const hRef = db.collection('hadiths').doc(h.id);
    hBatch.set(hRef, { ...h, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
  await hBatch.commit();
  console.log(`✅ Seeded ${hadiths.length} items to [hadiths]`);

  // Final Summary
  console.log('\n====================================================');
  console.log('🏛️ COMPLETE FIRESTORE COLLECTIONS DIRECTORY');
  console.log('====================================================');
  const allCols = [
    'admins', 'courses', 'lessons', 'quizzes', 'questions', 'quizAnswerKeys',
    'categories', 'instructors', 'books', 'hadiths', 'articles',
    'gameWorlds', 'gameStages', 'notifications', 'adminSettings', 'publicSettings'
  ];

  for (const c of allCols) {
    const s = await db.collection(c).get();
    console.log(`📁 ${c.padEnd(16, ' ')} : ${s.size} documents physically present in Firebase Console.`);
  }
  console.log('====================================================\n');
}

seedRemaining().catch(e => {
  console.error(e);
  process.exit(1);
});
