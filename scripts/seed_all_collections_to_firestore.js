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

// Safely extract SEED_DATA from db.js
let seedData = null;
try {
  const seedMatch = dbJsContent.match(/const\s+SEED_DATA\s*=\s*(\{[\s\S]*?\n\};)/);
  if (seedMatch) {
    const fn = new Function('return ' + seedMatch[1]);
    seedData = fn();
  }
} catch(e) {
  console.error('Failed to parse SEED_DATA:', e.message);
}

// Also check libraryData.js for authentic books
let libraryBooks = [];
try {
  const libJsContent = fs.readFileSync(path.resolve(__dirname, '../js/data/libraryData.js'), 'utf8');
  const libMatch = libJsContent.match(/window\.ISLAMIC_LIBRARY_BOOKS\s*=\s*(\[[\s\S]*?\n\];)/);
  if (libMatch) {
    const fn = new Function('return ' + libMatch[1]);
    libraryBooks = fn();
  }
} catch(e) {}

async function seedAllToFirestore() {
  console.log('====================================================');
  console.log('🚀 MIGRATING & SEEDING ALL COLLECTIONS TO FIRESTORE');
  console.log('====================================================');

  if (!seedData) {
    console.error('❌ SEED_DATA could not be loaded.');
    return;
  }

  const collections = [
    { name: 'courses', items: seedData.courses || [] },
    { name: 'lessons', items: seedData.lessons || [] },
    { name: 'quizzes', items: seedData.quizzes || [] },
    { name: 'questions', items: seedData.questions || [] },
    { name: 'books', items: (libraryBooks.length ? libraryBooks : seedData.books) || [] },
    { name: 'hadiths', items: seedData.hadiths || [] },
    { name: 'articles', items: seedData.articles || seedData.announcements || [] },
    { name: 'gameWorlds', items: seedData.gameWorlds || [] },
    { name: 'gameStages', items: seedData.gameStages || [] },
    { name: 'notifications', items: seedData.notifications || [] }
  ];

  // 1. Write Courses, Lessons, Quizzes, Questions, Books, Hadith, Articles, Games, Notifications
  for (const col of collections) {
    if (!col.items || !col.items.length) {
      console.log(`ℹ️ [${col.name}] No seed items found.`);
      continue;
    }

    console.log(`\n📦 Writing collection: [${col.name}] (${col.items.length} documents)...`);
    let count = 0;
    
    // Batch write in chunks of 400
    const chunkSize = 400;
    for (let i = 0; i < col.items.length; i += chunkSize) {
      const chunk = col.items.slice(i, i + chunkSize);
      const batch = db.batch();

      for (const item of chunk) {
        if (!item.id) continue;
        const docRef = db.collection(col.name).doc(String(item.id));
        
        // Clean undefined fields
        const cleanItem = JSON.parse(JSON.stringify(item));
        cleanItem.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        
        batch.set(docRef, cleanItem, { merge: true });
        count++;

        // For questions, also populate secure server-only answer keys
        if (col.name === 'questions' && (item.correctAnswerIndex !== undefined || item.correctAnswer !== undefined)) {
          const keyRef = db.collection('quizAnswerKeys').doc(String(item.id));
          batch.set(keyRef, {
            id: String(item.id),
            quizId: item.quizId || null,
            correctAnswerIndex: item.correctAnswerIndex !== undefined ? item.correctAnswerIndex : item.correctAnswer,
            explanation: item.explanation || '',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }

      await batch.commit();
    }
    console.log(`  ✅ Successfully committed ${count} documents to [${col.name}]`);
  }

  // 2. Write Admin Settings
  if (seedData.settings) {
    console.log('\n⚙️ Writing collection: [adminSettings]...');
    await db.collection('adminSettings').doc('system_core').set({
      ...seedData.settings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('  ✅ Successfully committed [adminSettings/system_core]');
  }

  // 3. Write Public CMS Settings
  if (seedData.cmsContent) {
    console.log('\n🌐 Writing collection: [publicSettings]...');
    await db.collection('publicSettings').doc('cms_general').set({
      ...seedData.cmsContent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('  ✅ Successfully committed [publicSettings/cms_general]');
  }

  // 4. Ensure Admin Document is in /admins
  console.log('\n👑 Ensuring Administrator document in /admins...');
  const adminUid = 'sg2AS7ho1EVO3hSsRFpiO4J19M13';
  await db.collection('admins').doc(adminUid).set({
    id: adminUid,
    uid: adminUid,
    email: 'jrahmanansari132@gmail.com',
    name: 'Hafiz Jamilurrahman',
    displayName: 'Hafiz Jamilurrahman',
    role: 'administrator',
    admin: true,
    isAdmin: true,
    status: 'active',
    emailVerified: true,
    headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
    bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocJ2kYNWyqiK0pDxA0x3fZlCkzd0WH7C3QRWqEnZczJ6zpCEbsqMqA=s96-c',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJ2kYNWyqiK0pDxA0x3fZlCkzd0WH7C3QRWqEnZczJ6zpCEbsqMqA=s96-c',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  console.log(`  ✅ Successfully committed [admins/${adminUid}]`);

  // 5. Final Firestore Collection Summary
  console.log('\n====================================================');
  console.log('📊 FIRESTORE COLLECTIONS VERIFICATION SUMMARY');
  console.log('====================================================');
  
  const checkCols = ['admins', 'courses', 'lessons', 'quizzes', 'questions', 'quizAnswerKeys', 'books', 'gameWorlds', 'gameStages', 'notifications', 'adminSettings', 'publicSettings'];
  for (const cName of checkCols) {
    const s = await db.collection(cName).get();
    console.log(`📁 Collection [${cName.padEnd(16, ' ')}] : ${s.size} documents physically present.`);
  }
  console.log('====================================================\n');
}

seedAllToFirestore().catch(e => {
  console.error('Error seeding to Firestore:', e);
  process.exit(1);
});
