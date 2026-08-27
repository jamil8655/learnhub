// Exercises the real isAdmin/isInstructor/getEffectiveRole logic lifted from
// auth.js, to prove a forged localStorage role stops winning once the
// verified claim is present.
import { readFileSync } from 'fs';

const src = readFileSync(process.argv[2] || '../../js/services/auth.js', 'utf8');

// Pull the four role methods out of the class and rebuild them on a stub that
// mimics the surrounding object, so the assertions run against shipped code.
function extract(name) {
  const start = src.indexOf(`  ${name}(`);
  if (start === -1) throw new Error(`method not found: ${name}`);
  let depth = 0, i = src.indexOf('{', start);
  const from = i;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  return src.slice(from, i + 1);
}

const stub = {
  _verifiedClaims: null,
  _localRole: 'student',
  getCurrentUser() { return { role: this._localRole, status: 'active' }; },
  isAuthenticated() { return true; }
};

stub.getEffectiveRole = new Function(`return function () ${extract('getEffectiveRole')}`)();
stub.isAdmin = new Function(`return function () ${extract('isAdmin')}`)();
stub.isInstructor = new Function(`return function () ${extract('isInstructor')}`)();
stub.isSuperAdmin = new Function(`return function () ${extract('isSuperAdmin')}`)();

const cases = [];
function t(name, actual, expected) {
  cases.push([name, actual === expected, `got ${actual}, expected ${expected}`]);
}

// --- The attack: user edits localStorage to role: 'admin' ---
stub._localRole = 'admin';
stub._verifiedClaims = { role: 'student', admin: false };
t('forged localStorage admin is ignored once the claim says student',
  stub.isAdmin(), false);
t('forged localStorage admin does not confer instructor either',
  stub.isInstructor(), false);
t('effective role comes from the claim, not localStorage',
  stub.getEffectiveRole(), 'student');

// --- A real admin ---
stub._localRole = 'student';
stub._verifiedClaims = { role: 'admin', admin: true };
t('verified admin claim grants admin even if localStorage says student',
  stub.isAdmin(), true);
t('verified admin also counts as instructor', stub.isInstructor(), true);

// --- A real instructor ---
stub._verifiedClaims = { role: 'instructor', admin: false };
t('verified instructor is an instructor', stub.isInstructor(), true);
t('verified instructor is NOT an admin', stub.isAdmin(), false);

// --- super_admin ---
stub._verifiedClaims = { role: 'super_admin', admin: true };
t('super_admin is admin', stub.isAdmin(), true);
t('super_admin reports super admin', stub.isSuperAdmin(), true);

// --- Before the claim resolves, the local hint is used (no menu flicker) ---
stub._verifiedClaims = null;
stub._localRole = 'admin';
t('falls back to local hint before the claim resolves', stub.isAdmin(), true);
stub._localRole = 'student';
t('fallback denies a plain student', stub.isAdmin(), false);

console.log('\n═══ Role resolution (auth.js) ═══');
let bad = 0;
for (const [name, ok, detail] of cases) {
  if (!ok) bad++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : '  →  ' + detail}`);
}
console.log(`  ${cases.length - bad}/${cases.length} behaved as expected\n`);
process.exit(bad ? 1 : 0);
