/**
 * LearnHub Firebase Custom Claims Setup Utility
 * 
 * Usage:
 *   node scripts/setCustomClaims.js <UID> <ROLE>
 * Example:
 *   node scripts/setCustomClaims.js usr-admin-uid super_admin
 *   node scripts/setCustomClaims.js teacher-uid teacher
 *   node scripts/setCustomClaims.js student-uid student
 */

const admin = require('firebase-admin');

// Initialize with service account credentials or Application Default Credentials
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e) {
    console.log('To run against live project, set GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccount.json"');
  }
}

async function setRole(uid, role) {
  const validRoles = ['super_admin', 'admin', 'teacher', 'instructor', 'student'];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
    return;
  }

  const claims = {
    role,
    admin: role === 'super_admin' || role === 'admin'
  };

  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`Successfully assigned custom claim "${role}" to user UID: ${uid}`);
  } catch (err) {
    console.error('Error setting custom claims:', err.message);
  }
}

const args = process.argv.slice(2);
if (args.length >= 2) {
  setRole(args[0], args[1]);
} else {
  console.log('Firebase Custom Claims Helper ready.');
}

module.exports = { setRole };
