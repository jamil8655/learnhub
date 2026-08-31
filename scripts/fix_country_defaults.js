const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json.json');

// 1. Search and clean in codebase
const root = path.resolve(__dirname, '..');

function cleanFiles(dir) {
  const list = fs.readdirSync(dir);
  for (const f of list) {
    if (f === 'node_modules' || f === '.git' || f === 'build' || f === '.gradle' || f === 'package-lock.json') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      cleanFiles(full);
    } else if (f.endsWith('.js') || f.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;

      if (content.includes("country: 'IN'") || content.includes('country: 'IN'')) {
        content = content.replace(/country:\s*['"]PK['"]/g, "country: 'IN'");
        changed = true;
      }
      if (content.includes("+91 98765 43210") || content.includes("+91 98765 43210")) {
        content = content.replace(/\+92\s*300\s*1234567/g, "+91 98765 43210");
        content = content.replace(/\+91 98765 43210/g, "+919876543210");
        changed = true;
      }
      if (content.includes("country || 'IN'") || content.includes('country || 'IN'')) {
        content = content.replace(/country\s*\|\|\s*['"]PK['"]/g, "country || 'IN'");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Cleaned file:', full);
      }
    }
  }
}

cleanFiles(root);

// 2. Fix Firestore Documents in /users and /admins
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id
  });
}
const db = admin.firestore();

async function fixFirestoreDocs() {
  console.log('\n=== FIXING FIRESTORE DOCUMENTS COUNTRY & PHONE ===');
  
  // Fix in /users
  const userSnap = await db.collection('users').get();
  for (const doc of userSnap.docs) {
    const data = doc.data();
    if (data.country === 'PK' || data.phone?.includes('+92')) {
      await doc.ref.set({
        country: 'IN',
        phone: data.phone?.replace('+92', '+91') || ''
      }, { merge: true });
      console.log(`Updated /users/${doc.id} -> country: 'IN'`);
    }
  }

  // Fix in /admins
  const adminSnap = await db.collection('admins').get();
  for (const doc of adminSnap.docs) {
    const data = doc.data();
    if (data.country === 'PK' || data.phone?.includes('+92')) {
      await doc.ref.set({
        country: 'IN',
        phone: data.phone?.replace('+92', '+91') || ''
      }, { merge: true });
      console.log(`Updated /admins/${doc.id} -> country: 'IN'`);
    }
  }
}

fixFirestoreDocs().then(() => console.log('Finished updating Firestore records.'));
