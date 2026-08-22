# 🔐 LearnHub Firebase Admin SDK Integration Guide

This guide documents the official, production-ready integration of the **Firebase Admin PHP SDK (`kreait/firebase-php:^8.0`)** into the LearnHub Laravel 11 backend.

---

## 1. Overview & Security Architecture

LearnHub uses a hybrid zero-trust authorization model:
1. **Firebase Authentication Custom Claims** (`admin: true`, `role: "admin"`) are set exclusively by trusted backend/CLI tooling.
2. **Firestore Security Rules** enforce `request.auth.token.admin == true` for privileged operations (managing courses, question banks, global certificates, audit logs).
3. **Laravel Sanctum & Middleware** (`AdminMiddleware`) protect API endpoints (`/api/v1/admin/*`).
4. **No Client Self-Promotion**: A user cannot promote themselves by altering Firestore documents or submitting arbitrary `role` fields during registration.

```
+-----------------------------------------------------------+
|               LearnHub Security Triangle                  |
|                                                           |
|       Firebase Custom Claim (admin: true)                 |
|                     +                                     |
|       Laravel Authenticated User (Sanctum)                |
|                     +                                     |
|       Admin Middleware & Policy Verification              |
|                     =                                     |
|               FULL ADMIN ACCESS                           |
+-----------------------------------------------------------+
```

---

## 2. Prerequisites & Installation

The Firebase Admin SDK is declared in `backend/composer.json`:
```bash
cd backend
composer require kreait/firebase-php:^8.0
```

---

## 3. Generating Firebase Service Account Credentials

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (e.g. `studio-5305763939-bdcf7`).
3. Navigate to **Project Settings** (gear icon) -> **Service accounts**.
4. Under the **Firebase Admin SDK** tab, click **Generate new private key**.
5. Save the generated JSON file in a secure, non-public directory on your server.

> [!CAUTION]
> **CRITICAL SECURITY RULE**: Never commit your Service Account JSON file to GitHub or place it in public web directories. It is protected by `.gitignore`.

---

## 4. Environment Configuration

In your server's `backend/.env` file:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=studio-5305763939-bdcf7
FIREBASE_CREDENTIALS=/path/to/secure/firebase-service-account.json

# Optional: Alternatively provide raw JSON string if on PaaS (Heroku/Railway/Render)
# FIREBASE_CREDENTIALS_JSON='{"type":"service_account",...}'

FIREBASE_AUTH_ENABLED=true
FIREBASE_FIRESTORE_ENABLED=true
```

---

## 5. Provisioning Admin Privileges (Artisan CLI)

### To Grant Admin Privileges:
```bash
php artisan firebase:make-admin user@example.com
# OR using Firebase UID:
php artisan firebase:make-admin FIREBASE_UID
```

**Output:**
```
===============================================================
 LearnHub Enterprise Firebase Admin Security Provisioner
===============================================================

 Resolving Firebase Auth user: user@example.com ...

 [SUCCESS] Admin privileges GRANTED successfully for:
+---------------+------------------------+
| Field         | Value                  |
+---------------+------------------------+
| Firebase UID  | abc123xyz456           |
| Email         | user@example.com       |
| Admin Claim   | admin: true            |
| Role Claim    | role: admin            |
+---------------+------------------------+
 ✓ Synchronized local Laravel database: role=admin, status=active
```

---

### To Revoke Admin Privileges:
```bash
php artisan firebase:make-admin user@example.com --revoke
```

**Output:**
```
 [SUCCESS] Admin privileges REVOKED successfully for:
+---------------+------------------------+
| Field         | Value                  |
+---------------+------------------------+
| Firebase UID  | abc123xyz456           |
| Email         | user@example.com       |
| Admin Claim   | REMOVED (false)        |
| Assigned Role | student                |
+---------------+------------------------+
 ✓ Synchronized local Laravel database: role=student
```

---

## 6. Client Token Refresh Notice

When custom claims are granted or revoked by the backend, active client browsers must force-refresh their Firebase ID token to pick up new claims:

```javascript
// In frontend JavaScript:
const user = firebase.auth().currentUser;
if (user) {
  const tokenResult = await user.getIdTokenResult(true); // true forces refresh
  console.log('Is Admin:', tokenResult.claims.admin);
}
```

---

## 7. Service Architecture

- **`App\Services\FirebaseAdminService`**: Singleton service handling SDK initialization, user lookups, claim manipulation, and ID token verification.
- **`App\Console\Commands\FirebaseMakeAdminCommand`**: Artisan command for safe privilege provisioning.
- **`config/firebase.php`**: Centralized configuration reading from `.env`.
- **`App\Http\Middleware\AdminMiddleware`**: Protects Laravel API routes against unauthorized access.
- **`firestore.rules`**: Cloud Firestore security rules matching `request.auth.token.admin == true`.
