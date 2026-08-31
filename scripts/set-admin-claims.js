#!/usr/bin/env node
/**
 * LearnHub Firebase Administrator Custom Claims & Profile Provisioning Script
 * 
 * Usage:
 *   node scripts/set-admin-claims.js <USER_EMAIL>
 * 
 * Example:
 *   node scripts/set-admin-claims.js jrahmanansari@gmail.com
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// 1. Resolve Target User Email from CLI arguments
const targetEmail = process.argv[2] ? process.argv[2].trim().toLowerCase() : null;

if (!targetEmail || !targetEmail.includes('@')) {
  console.error('\n❌ ERROR: Please provide a valid email address.');
  console.error('Usage: node scripts/set-admin-claims.js <USER_EMAIL>');
  console.error('Example: node scripts/set-admin-claims.js jrahmanansari@gmail.com\n');
  process.exit(1);
}

// 2. Automatically Detect the Existing Firebase Service Account JSON File
function findServiceAccountKey(searchDir) {
  const candidates = [];
  try {
    const files = fs.readdirSync(searchDir);
    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('package') && !file.includes('manifest') && !file.includes('composer') && !file.includes('firebase.json')) {
        const fullPath = path.join(searchDir, file);
        try {
          const raw = fs.readFileSync(fullPath, 'utf8');
          if (raw.includes('"service_account"') || (raw.includes('"project_id"') && raw.includes('"private_key"'))) {
            const parsed = JSON.parse(raw);
            if (parsed.type === 'service_account' && parsed.project_id && parsed.private_key) {
              candidates.push({ fullPath, filename: file, parsed });
            }
          }
        } catch(e) {}
      }
    }
  } catch(e) {}
  return candidates;
}

const projectRoot = path.resolve(__dirname, '..');
const detectedKeys = findServiceAccountKey(projectRoot);

if (detectedKeys.length === 0) {
  console.error('\n❌ ERROR: No valid Firebase Service Account JSON file detected in project root:');
  console.error('  Directory:', projectRoot);
  console.error('  Please ensure your service account key JSON file is present in the project.\n');
  process.exit(1);
}

// Select matching service account file for studio-5305763939-bdcf7
let selectedKey = detectedKeys.find(k => k.parsed.project_id === 'studio-5305763939-bdcf7') || detectedKeys[0];

console.log('----------------------------------------------------');
console.log('🔑 DETECTED SERVICE ACCOUNT FILE');
console.log('  File Name   :', selectedKey.filename);
console.log('  Project ID  :', selectedKey.parsed.project_id);
console.log('  Client Email:', selectedKey.parsed.client_email);
console.log('----------------------------------------------------');

// 3. Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(selectedKey.parsed),
    projectId: selectedKey.parsed.project_id
  });
} catch(e) {
  if (!admin.apps.length) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', e.message);
    process.exit(1);
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function setAdminClaims() {
  try {
    console.log(`\n🔍 Searching for user with email: ${targetEmail}...`);
    
    let userRecord = null;
    try {
      userRecord = await auth.getUserByEmail(targetEmail);
    } catch(err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`ℹ️ User not found in Firebase Auth. Creating new user account for ${targetEmail}...`);
        userRecord = await auth.createUser({
          email: targetEmail,
          emailVerified: true,
          displayName: targetEmail.split('@')[0],
          disabled: false
        });
        console.log(`✨ Created Firebase Auth user with UID: ${userRecord.uid}`);
      } else {
        throw err;
      }
    }

    const uid = userRecord.uid;
    console.log(`👤 Found Firebase Auth UID: ${uid}`);

    // 4. Set Custom Claims: admin: true, role: 'administrator'
    const customClaims = {
      admin: true,
      role: 'administrator'
    };

    await auth.setCustomUserClaims(uid, customClaims);
    console.log('🛡️ Custom claims successfully applied to Firebase Auth token.');

    // 5. Update/Create Firestore User Profile at canonical /users/{uid}
    const userDocRef = db.collection('users').doc(uid);
    const existingDoc = await userDocRef.get();
    
    const adminDocPayload = {
      id: uid,
      uid: uid,
      email: targetEmail,
      name: userRecord.displayName || (targetEmail === 'jrahmanansari@gmail.com' ? 'جمیل رحمن انصاری' : targetEmail.split('@')[0]),
      displayName: userRecord.displayName || (targetEmail === 'jrahmanansari@gmail.com' ? 'جمیل رحمن انصاری' : targetEmail.split('@')[0]),
      role: 'administrator',
      admin: true,
      isAdmin: true,
      status: 'active',
      emailVerified: true,
      headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
      bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!existingDoc.exists) {
      adminDocPayload.createdAt = admin.firestore.FieldValue.serverTimestamp();
      await userDocRef.set(adminDocPayload);
      console.log(`📄 Created canonical Firestore document at /users/${uid}`);
    } else {
      await userDocRef.set(adminDocPayload, { merge: true });
      console.log(`📄 Updated canonical Firestore document at /users/${uid}`);
    }

    // Output formatted verification result
    console.log('\n====================================================');
    console.log('✅ ADMIN SUCCESSFULLY CREATED');
    console.log('');
    console.log(`Email : ${targetEmail}`);
    console.log('Role  : administrator');
    console.log('Claim : admin = true');
    console.log(`UID   : ${uid}`);
    console.log('====================================================\n');
    console.log('💡 Note: The user should log out and log back in (or refresh their ID token) to apply the new Custom Claims in the browser session.\n');

  } catch(error) {
    console.error('\n❌ ERROR applying admin claims:', error.message);
    if (error.code) console.error('  Error Code:', error.code);
    process.exit(1);
  }
}

setAdminClaims();
