const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}

const auth = admin.auth();
const db = admin.firestore();

const SOLE_ADMIN_EMAIL = 'jrahmanansari132@gmail.com';

async function enforceSoleAdmin() {
  console.log('====================================================');
  console.log('🔒 ENFORCING SOLE ADMINISTRATOR:', SOLE_ADMIN_EMAIL);
  console.log('====================================================');

  // 1. List all users in Firebase Auth
  const listUsersResult = await auth.listUsers(1000);
  console.log(`Found ${listUsersResult.users.length} user(s) in Firebase Authentication.`);

  for (const user of listUsersResult.users) {
    const userEmail = (user.email || '').toLowerCase().trim();
    if (userEmail === SOLE_ADMIN_EMAIL) {
      console.log(`\n👑 Found Target Administrator Account:`);
      console.log(`  UID   : ${user.uid}`);
      console.log(`  Email : ${userEmail}`);
      
      // Set Sole Administrator Custom Claims
      await auth.setCustomUserClaims(user.uid, {
        admin: true,
        role: 'administrator'
      });
      console.log('  ✅ Applied Custom Claims: { admin: true, role: "administrator" }');

      // Ensure Firestore Document is Pristine at /users/{user.uid}
      await db.collection('users').doc(user.uid).set({
        id: user.uid,
        uid: user.uid,
        email: userEmail,
        name: user.displayName || 'جمیل رحمن انصاری',
        displayName: user.displayName || 'جمیل رحمن انصاری',
        role: 'administrator',
        admin: true,
        isAdmin: true,
        status: 'active',
        emailVerified: true,
        headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
        bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✅ Synced Firestore Profile: /users/${user.uid}`);

    } else {
      console.log(`\n🧹 Removing other user/admin account: ${userEmail} (UID: ${user.uid})...`);
      
      // Delete other test user from Auth
      try {
        await auth.deleteUser(user.uid);
        console.log(`  🗑️ Deleted Auth account: ${userEmail}`);
      } catch (e) {
        console.warn(`  Note on deleting auth user:`, e.message);
      }

      // Delete corresponding user doc from Firestore
      try {
        await db.collection('users').doc(user.uid).delete();
        console.log(`  🗑️ Deleted Firestore document: /users/${user.uid}`);
      } catch (e) {
        console.warn(`  Note on deleting firestore doc:`, e.message);
      }
    }
  }

  // Also clean up any loose documents in /users that don't match the sole admin UID
  let soleUserRecord = null;
  try {
    soleUserRecord = await auth.getUserByEmail(SOLE_ADMIN_EMAIL);
  } catch(e) {}

  if (soleUserRecord) {
    const usersSnapshot = await db.collection('users').get();
    for (const doc of usersSnapshot.docs) {
      if (doc.id !== soleUserRecord.uid) {
        console.log(`🧹 Removing orphaned Firestore user document: ${doc.id}`);
        await doc.ref.delete();
      }
    }
  }

  console.log('\n====================================================');
  console.log('✅ SOLE ADMINISTRATOR ENFORCED SUCCESSFULLY');
  console.log(`Email : ${SOLE_ADMIN_EMAIL}`);
  if (soleUserRecord) console.log(`UID   : ${soleUserRecord.uid}`);
  console.log('Role  : administrator');
  console.log('Claim : admin = true');
  console.log('All other test users and documents have been completely removed.');
  console.log('====================================================\n');
}

enforceSoleAdmin().catch(err => {
  console.error('Error enforcing sole admin:', err);
  process.exit(1);
});
