// Verifies the content-sharing path end to end against the emulator:
// an admin publishes a course, a different user reads it back, and a
// student is refused the write.
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { readFileSync } from 'fs';

const testEnv = await initializeTestEnvironment({
  projectId: 'learnhub-content-test',
  firestore: {
    rules: readFileSync(process.argv[2] || '../../firestore.rules', 'utf8'),
    host: '127.0.0.1', port: 8080
  }
});

const results = [];
async function check(name, expect, fn) {
  try {
    await (expect === 'DENY' ? assertFails(fn()) : assertSucceeds(fn()));
    results.push([name, expect, true]);
  } catch (e) {
    results.push([name, expect, false, (e.message || '').split('\n')[0].slice(0, 80)]);
  }
}

const admin = testEnv.authenticatedContext('admin1', { email: 'jrahmanansari132@gmail.com' }).firestore();
const teacher = testEnv.authenticatedContext('teacher1', { role: 'instructor' }).firestore();
const student = testEnv.authenticatedContext('student1', {}).firestore();
const guest = testEnv.unauthenticatedContext().firestore();

const course = { id: 'c-tajweed', title: 'Tajweed Foundations', instructorId: 'teacher1', status: 'published' };

await check('admin publishes a course', 'ALLOW', () =>
  setDoc(doc(admin, 'courses/c-tajweed'), course));

await check('instructor publishes their own course', 'ALLOW', () =>
  setDoc(doc(teacher, 'courses/c-own'), { id: 'c-own', title: 'Seerah', instructorId: 'teacher1' }));

await check('student publishes a course', 'DENY', () =>
  setDoc(doc(student, 'courses/c-evil'), { id: 'c-evil', title: 'Fake', instructorId: 'student1' }));

// The whole point: a DIFFERENT user must be able to read what admin published.
await check('another student reads the shared catalogue', 'ALLOW', () =>
  getDocs(collection(student, 'courses')));

await check('signed-out visitor reads the catalogue', 'ALLOW', () =>
  getDocs(collection(guest, 'courses')));

await check('articles are readable (rule was missing entirely)', 'ALLOW', () =>
  getDocs(collection(guest, 'articles')));

await check('admin publishes an article', 'ALLOW', () =>
  setDoc(doc(admin, 'articles/a1'), { id: 'a1', title: 'Adab of Learning' }));

await check('student publishes an article', 'DENY', () =>
  setDoc(doc(student, 'articles/a2'), { id: 'a2', title: 'Spam' }));

await check('lessons and quizzes readable by students', 'ALLOW', () =>
  getDocs(collection(student, 'lessons')));

// Prove the catalogue actually crosses users, not just that rules allow it.
const snap = await getDocs(collection(student, 'courses'));
const titles = snap.docs.map(d => d.data().title);
const crossed = titles.includes('Tajweed Foundations');

console.log('\n═══ Shared content path ═══');
for (const [name, expect, ok, err] of results) {
  console.log(`  ${ok ? '✓' : '✗'} [${expect.padEnd(5)}] ${name}${ok ? '' : '  →  ' + err}`);
}
console.log(`\n  Student sees courses published by admin: ${crossed ? 'YES' : 'NO'} (${titles.join(', ') || 'none'})`);
const failed = results.filter(r => !r[2]).length;
console.log(`  ${results.length - failed}/${results.length} behaved as expected\n`);
await testEnv.cleanup();
process.exit(0);
