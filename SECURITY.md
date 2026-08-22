# LearnHub Security Baseline

## Firebase

- Firebase Authentication is the only authority for passwords and identity.
- Do not store plaintext passwords, reversible encodings, password hashes, reset tokens, or session tokens in Firestore, Realtime Database, IndexedDB, localStorage, sessionStorage, or GitHub.
- Client-side role checks are UX controls only. Privileged operations must be enforced by Firebase Security Rules or trusted server code.
- Public signup must create only `student` accounts. Instructor/admin elevation is administrator-controlled.
- Use Firebase App Check (reCAPTCHA Enterprise or the appropriate supported provider) for Firestore, Realtime Database and Storage where supported.
- Enable email verification, password policy, MFA for administrators, account recovery protections and provider restrictions in Firebase Authentication.
- Keep Firestore, Realtime Database and Storage rules default-deny for unspecified paths.
- Never put service-account JSON, Admin SDK credentials, private keys, webhook secrets, payment secrets or OAuth client secrets in this repository.

## GitHub

- Repository secrets belong in GitHub Actions Secrets/Variables or an external secret manager, never source files.
- Enable secret scanning, push protection, Dependabot and branch protection on `main`.
- Require pull requests and successful CI before merging security-sensitive changes.
- Do not commit production database exports, user uploads, private PDFs, logs, backups or runtime data.
- Rotate any credential that has ever been committed, even if it was later deleted.

## Client storage

- Treat all browser storage as attacker-controlled. Never use localStorage/sessionStorage as an authorization source.
- Store only non-sensitive UI preferences or short-lived non-privileged state there.
- Prefer Firebase Auth's managed session persistence and ID tokens for authentication.

## Application security

- Validate and authorize every write on the server/rules layer.
- Never trust client-supplied `role`, `status`, `paymentStatus`, `amountPaid`, certificate completion, quiz score or ownership fields.
- Use transactions for enrollment/payment state changes and idempotent payment webhooks.
- Apply rate limits to login, password reset, registration, search-heavy endpoints and admin actions.
- Use strict Content Security Policy, HTTPS, secure headers, input/output encoding and safe file-type/size validation.
- Log security events without passwords, tokens, authorization headers or other secrets.

## Incident response

If a credential is exposed: revoke/rotate it first, inspect recent authentication/database activity, invalidate affected sessions, then remove the secret from source history. Deleting a secret from the latest commit does not make the old credential safe.
