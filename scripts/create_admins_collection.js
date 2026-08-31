const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}

const db = admin.firestore();
const uid = 'sg2AS7ho1EVO3hSsRFpiO4J19M13';
const email = 'jrahmanansari132@gmail.com';

async function createAdminDoc() {
  const adminData = {
    id: uid,
    uid: uid,
    email: email,
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  // Write to /admins/{uid}
  await db.collection('admins').doc(uid).set(adminData, { merge: true });
  console.log('✅ Successfully created /admins/' + uid);

  // Verify
  const snap = await db.collection('admins').get();
  console.log('\n=== CURRENT FIRESTORE /admins COLLECTION ===');
  snap.forEach(d => {
    console.log('Document ID: admins/' + d.id);
    console.log('Data:', d.data());
  });
}

createAdminDoc().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
