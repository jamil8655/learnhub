const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}

const db = admin.firestore();

async function seedUsersCollection() {
  console.log('====================================================');
  console.log('👥 SEEDING USERS COLLECTION IN FIRESTORE');
  console.log('====================================================');

  const studentUsers = [
    {
      id: 'usr-student-1',
      uid: 'usr-student-1',
      name: 'محمد عثمان علی',
      displayName: 'محمد عثمان علی',
      email: 'student.usman@learnhub.com',
      role: 'student',
      status: 'active',
      emailVerified: true,
      headline: 'طالبِ علم علوم القرآن و تجوید • لرن ہب',
      bio: 'قرآنی تجوید، فہمِ قرآن اور بنیادی فقہ کا باقاعدہ طالب علم۔',
      learningStreak: 7,
      longestStreak: 15,
      totalPoints: 1450,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'usr-student-2',
      uid: 'usr-student-2',
      name: 'زینب بی بی',
      displayName: 'زینب بی بی',
      email: 'student.zainab@learnhub.com',
      role: 'student',
      status: 'active',
      emailVerified: true,
      headline: 'طالبہ علوم الحدیث و فقہ العبادات • لرن ہب',
      bio: 'صحیح بخاری، اربعین نووی اور فقہ السنہ کے مطالعہ کی شوقین۔',
      learningStreak: 12,
      longestStreak: 20,
      totalPoints: 2350,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  const batch = db.batch();
  for (const u of studentUsers) {
    const docRef = db.collection('users').doc(u.id);
    batch.set(docRef, u, { merge: true });
  }
  await batch.commit();

  console.log(`✅ Successfully created ${studentUsers.length} documents in [users] collection.`);

  // Verify
  const snap = await db.collection('users').get();
  console.log('\n=== CURRENT FIRESTORE /users COLLECTION ===');
  snap.forEach(d => {
    console.log(`  📄 users/${d.id} -> Name: ${d.data().name} | Role: ${d.data().role} | Email: ${d.data().email}`);
  });
  console.log('====================================================\n');
}

seedUsersCollection().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
