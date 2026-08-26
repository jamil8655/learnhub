# Firestore security-rules tests

Adversarial tests for `firestore.rules`. Each case asserts that an attack is
DENIED, or that a legitimate operation still succeeds — so tightening a rule
cannot silently break a working feature.

Requires Java (for the Firestore emulator).

```bash
cd tests/security
npm install
npx firebase-tools emulators:start --only firestore --project learnhub-rules-test   # terminal 1
npm test                                                                            # terminal 2
```

Covers: XP/streak forgery, ownership hijack (IDOR) on enrollments and sunnah
trackers, anonymous writes to `donations`, forged quiz attempts, self-issued
certificates, self-granted admin role, and instructor course scoping.
