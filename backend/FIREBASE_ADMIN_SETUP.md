# LearnHub Firebase Admin SDK setup

The Laravel backend uses the Firebase Admin PHP SDK to manage Firebase Authentication custom claims. Custom claims are privileged server-side data and must never be accepted directly from the client.

## 1. Install the SDK

From the `backend` directory run:

```bash
composer require kreait/firebase-php:^8.0
```

The package is intentionally installed through Composer so the generated `composer.lock` is produced by the environment that deploys the backend.

## 2. Create a Firebase service-account key

In Firebase Console open:

**Project settings → Service accounts → Firebase Admin SDK → Generate new private key**

Download the JSON key and store it OUTSIDE the Git repository. Never paste the private key into source code, `.env.example`, GitHub Actions, browser code, or Firebase Security Rules.

Firebase's server-side documentation recommends protecting service-account credentials carefully. In non-Google environments, `GOOGLE_APPLICATION_CREDENTIALS` or an explicitly configured service-account path can be used.

## 3. Configure Laravel

In `backend/.env` set:

```dotenv
FIREBASE_CREDENTIALS=/secure/path/learnhub-firebase-service-account.json
```

The repository `.gitignore` already ignores common Firebase/service-account JSON filenames.

## 4. Grant Admin to an existing Firebase Auth user

Run from `backend`:

```bash
php artisan firebase:make-admin user@example.com
```

or with the Firebase UID:

```bash
php artisan firebase:make-admin FIREBASE_UID
```

This command preserves existing custom claims and adds:

```text
admin: true
role: admin
```

The command is deliberately an Artisan command rather than a public HTTP endpoint. A client must never be allowed to grant itself the Admin claim.

## 5. Revoke Admin

```bash
php artisan firebase:make-admin user@example.com --revoke
```

## 6. Refresh the user's ID token

Custom claims propagate to a user's ID token when a new token is issued. After granting or revoking Admin, sign the user out and back in, or force an ID-token refresh in the client. Firebase Security Rules then see the updated claim.

## 7. Security model

The Firestore rules expect the trusted Firebase Auth custom claim:

```text
request.auth.token.admin == true
```

Do NOT rely on a Firestore field such as `users/{uid}.role == "admin"` for privileged authorization. A client-controlled Firestore document must not be the source of Admin authority.

## 8. Important deployment note

The Firebase Admin SDK has full server-side privileges. Keep the service-account key only in the backend deployment secret store or protected filesystem. Do not commit it to GitHub.
