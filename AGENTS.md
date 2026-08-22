# LearnHub Engineering Rules

These rules apply to all changes in this repository.

## 1. Architecture and source of truth
- Keep the frontend, Laravel API (`backend/`), and Android wrapper aligned with the same product behavior.
- Treat the Laravel API as the authoritative server for authentication, authorization, quiz grading, instructor approval, payments/order state, certificates, and other security-sensitive decisions.
- Do not move security-sensitive validation into client-only JavaScript.
- Preserve API versioning under `/api/v1` unless a deliberate migration is documented.

## 2. Roles and instructor governance
- Public signup creates a student account only.
- Never allow signup input to grant `instructor`, `admin`, or `super_admin` privileges.
- Instructor access is granted only through the authenticated instructor-application workflow and explicit admin approval.
- Admin and super-admin permissions must be enforced server-side with authorization middleware/policies; UI guards are not sufficient.
- Protect role changes, account suspension, session revocation, and instructor removal as privileged operations.

## 3. Standalone quizzes
- Quiz is an independent product module, not a child of course enrollment.
- Never send correct answers or grading explanations to an active quiz-taking client before submission.
- Grade attempts server-side and validate quiz ownership/availability, attempt limits, timing, and submitted question IDs server-side.
- Keep quiz administration separate from course administration in both API and UI.

## 4. Security and privacy
- Default to deny for database rules and explicitly grant the minimum required access.
- A normal user may modify only their own permitted profile fields and must not be able to change their role, privilege flags, audit fields, or another user's data.
- Never commit real passwords, API keys, tokens, private certificates, production `.env` files, or payment secrets.
- Never log passwords, access tokens, recovery tokens, or full payment credentials.
- Keep audit logs append-only from application users and restrict access to authorized administrators.
- Use rate limiting on authentication and other abuse-prone endpoints.
- Treat all client input as untrusted; validate, authorize, and sanitize on the server.

## 5. Data and API changes
- Add migrations and tests for schema changes.
- Keep destructive data changes backward-compatible where practical and document required deployment order.
- Use consistent JSON API responses, validation errors, HTTP status codes, and pagination conventions.
- Do not expose internal exception details in production responses.

## 6. Testing and CI
- Every functional/security change must add or update automated tests when practical.
- PHP changes must pass Composer validation, PHP syntax checks, and the Laravel test suite.
- JavaScript changes must pass syntax validation.
- JSON configuration/rules files must remain valid JSON.
- Keep GitHub Actions least-privilege (`contents: read` unless a job genuinely needs more).
- Do not bypass or weaken CI checks to make a change pass.

## 7. Frontend and UX
- Preserve the standalone Quiz experience and existing role separation.
- Keep admin features inaccessible from student/instructor UI unless explicitly intended.
- Avoid duplicating business logic across multiple frontend files; use shared services where available.
- Maintain responsive, accessible UI and avoid breaking existing deep links/routes.

## 8. Changes and review
- Prefer small, focused commits with clear messages.
- Before merging, inspect changed files for security, authorization, validation, accessibility, and regression risks.
- Update documentation when behavior, setup, API contracts, or security rules change.
- Do not silently remove existing features; document intentional removals or migrations.
