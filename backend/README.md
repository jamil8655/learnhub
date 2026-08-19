# LearnHub Laravel 11 RESTful Backend API

Production-ready, enterprise RESTful API for **LearnHub** (Islamic Learning Platform & LMS) built with **Laravel 11**, **Laravel Sanctum**, **2-Factor Authentication (TOTP)**, **Server-Side Secure Quiz Grading**, **Tamper-Evident Certificate Verification**, and **Comprehensive RBAC (Role-Based Access Control)**.

---

## 🚀 Key Architectural Features

1. **Enterprise Authentication & Security**:
   - Token-based API Authentication via **Laravel Sanctum**.
   - **Two-Factor Authentication (2FA)** with Google Authenticator / TOTP and 8 emergency single-use recovery codes.
   - Brute-force protection via `RateLimitAuthMiddleware` (IP and email throttled).
   - Multi-device active session tracking with remote revocation (`/api/v1/auth/sessions`).
   - Audit logging for all authentication, password changes, and admin actions (`AuditLog`).

2. **Course Management & Progress Tracking**:
   - Paginated public catalog with category, difficulty, price, and rating filters.
   - Enrollment subsystem for free and premium courses.
   - Granular lesson-by-lesson progress tracking with auto-calculation of course completion percentage and automatic certificate generation at 100%.

3. **Secure Server-Side Quiz Engine**:
   - Anti-cheating architecture: Public question endpoints strip `correct_option_index` and `explanation` so answer keys cannot be extracted via client inspection.
   - Server-side grading calculates score, records attempt details, and awards certificates of excellence if the passing threshold is reached.

4. **Public Certificate Verification Portal**:
   - Issue verifiable digital certificates with unique alphanumeric codes (e.g. `LH-TJWD-2026-008492`).
   - Public endpoint `/api/v1/certificates/verify/{code}` enables instant employer and institution verification.

5. **Hadith & Islamic Sciences Library**:
   - Fast multi-lingual search (Urdu, Arabic, English) across Bukhari, Muslim, Tirmidhi, Abu Dawood, Nasai, and Ibn Majah collections.

6. **Admin Dashboard & Role Management**:
   - KPIs, daily enrollment trends, quiz pass rates, user role promotion/demotion, account locking, and session termination.

---

## 🛠️ Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── v1/
│   │   │           ├── AuthController.php
│   │   │           ├── CourseController.php
│   │   │           ├── QuizController.php
│   │   │           ├── CertificateController.php
│   │   │           ├── HadithController.php
│   │   │           └── Admin/
│   │   │               ├── AdminDashboardController.php
│   │   │               └── AdminUserController.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   └── RateLimitAuthMiddleware.php
│   │   └── Requests/
│   │       ├── CourseRequest.php
│   │       ├── ForgotPasswordRequest.php
│   │       ├── LoginRequest.php
│   │       ├── PasswordChangeRequest.php
│   │       ├── QuizSubmitRequest.php
│   │       ├── RegisterRequest.php
│   │       └── ResetPasswordRequest.php
│   ├── Models/
│   │   ├── AuditLog.php
│   │   ├── Category.php
│   │   ├── Certificate.php
│   │   ├── Course.php
│   │   ├── CourseEnrollment.php
│   │   ├── Hadith.php
│   │   ├── Lesson.php
│   │   ├── LessonProgress.php
│   │   ├── Quiz.php
│   │   ├── QuizAttempt.php
│   │   ├── QuizQuestion.php
│   │   ├── User.php
│   │   └── UserSession.php
│   └── Policies/
│       ├── CoursePolicy.php
│       └── QuizPolicy.php
├── bootstrap/
│   └── app.php
├── config/
│   └── cors.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   └── api.php
├── .env.example
├── composer.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- PHP `>= 8.2` (with extensions: `pdo_sqlite` or `pdo_mysql`, `openssl`, `mbstring`, `curl`)
- Composer `>= 2.5`

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Migration & Seeding
Using SQLite (default for development):
```bash
touch database/database.sqlite
php artisan migrate --seed
```

Or using MySQL:
1. Update `.env` with your MySQL credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=learnhub_db
DB_USERNAME=root
DB_PASSWORD=your_password
```
2. Run migrations with seed data:
```bash
php artisan migrate --seed
```

### 4. Start Local Development Server
```bash
php artisan serve --port=8000
```
API endpoint is now accessible at `http://127.0.0.1:8000/api/v1`.

---

## 🔑 Pre-Seeded Default Accounts

| Role | Email | Password | Description |
|---|---|---|---|
| **Super Admin** | `admin@learnhub.pk` | `Admin@123456` | Full administrative control & analytics |
| **Instructor** | `mufti.tariq@learnhub.pk` | `Instructor@123` | Course author & curriculum manager |
| **Student** | `student@learnhub.pk` | `Student@123` | Regular student account |

---

## 📖 API Endpoints Reference

### 1. Authentication & Security (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | None | Register new student account |
| `POST` | `/api/v1/auth/login` | None | Login (supports 2FA challenge) |
| `POST` | `/api/v1/auth/logout` | Sanctum | Revoke current token & session |
| `GET` | `/api/v1/auth/verify-email` | None | Verify email with token |
| `POST` | `/api/v1/auth/resend-verification` | Sanctum | Resend verification email |
| `POST` | `/api/v1/auth/forgot-password` | None | Request password reset token |
| `POST` | `/api/v1/auth/reset-password` | None | Reset password with token |
| `POST` | `/api/v1/auth/change-password` | Sanctum | Change password (requires current password) |
| `POST` | `/api/v1/auth/2fa/setup` | Sanctum | Generate 2FA secret and QR code URL |
| `POST` | `/api/v1/auth/2fa/confirm` | Sanctum | Confirm 6-digit TOTP code & generate backup codes |
| `POST` | `/api/v1/auth/2fa/disable` | Sanctum | Disable 2FA with password confirmation |
| `GET` | `/api/v1/auth/sessions` | Sanctum | List active user device sessions |
| `DELETE`| `/api/v1/auth/sessions/{id}` | Sanctum | Revoke specific session or `all_others` |

---

### 2. Courses (`/api/v1/courses`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/courses` | None | List courses (filters: `search`, `category`, `level`, `priceType`, `sort`) |
| `GET` | `/api/v1/courses/{id}` | Optional | Get course details, lessons, and enrollment progress |
| `POST` | `/api/v1/courses/{id}/enroll` | Sanctum | Enroll authenticated user into course |
| `POST` | `/api/v1/courses/{courseId}/lessons/{lessonId}/progress` | Sanctum | Update lesson progress and recalculate completion |

---

### 3. Quizzes (`/api/v1/quizzes`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/quizzes` | None | List published quizzes with metadata |
| `GET` | `/api/v1/quizzes/{id}` | Optional | Get quiz questions (**answers sanitized** to prevent cheating) |
| `POST` | `/api/v1/quizzes/{id}/submit` | Sanctum | Submit answers for server-side secure grading |
| `GET` | `/api/v1/quizzes/attempts/history` | Sanctum | View user's past quiz attempts and scores |

---

### 4. Certificates (`/api/v1/certificates`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/certificates` | Sanctum | List user's earned certificates |
| `GET` | `/api/v1/certificates/{id}` | Sanctum | Get single certificate details |
| `GET` | `/api/v1/certificates/verify/{code}` | **Public** | Tamper-proof public certificate verification |

---

### 5. Hadith & Islamic Reference (`/api/v1/hadith`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/hadith` | None | List collections or hadiths by `?book=bukhari` |
| `GET` | `/api/v1/hadith/search` | None | Multi-lingual search across Arabic, Urdu, and English |
| `GET` | `/api/v1/hadith/{id}` | None | Get specific Hadith by ID or number |

---

### 6. Admin Panel (`/api/v1/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard/kpis` | Sanctum + Admin | Overall platform metrics and summary |
| `GET` | `/api/v1/admin/dashboard/analytics` | Sanctum + Admin | Historical trends (enrollments, revenue, quizzes) |
| `GET` | `/api/v1/admin/users` | Sanctum + Admin | User listing with search and role/status filtering |
| `PUT` | `/api/v1/admin/users/{id}/role` | Sanctum + Admin | Change user role (`student`, `instructor`, `admin`) |
| `PUT` | `/api/v1/admin/users/{id}/status` | Sanctum + Admin | Change status (`active`, `suspended`, `disabled`) |
| `POST` | `/api/v1/admin/users/{id}/revoke-sessions` | Sanctum + Admin | Terminate all active sessions for a user |

---

## 🧪 Testing with cURL / Postman

### 1. User Registration
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Ahmad Raza",
    "email": "ahmad@example.com",
    "password": "Password@123",
    "password_confirmation": "Password@123"
  }'
```

### 2. User Login
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "student@learnhub.pk",
    "password": "Student@123"
  }'
```

### 3. Enroll in a Course
```bash
curl -X POST http://127.0.0.1:8000/api/v1/courses/1/enroll \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Accept: application/json"
```

### 4. Submit Quiz for Secure Server-Side Grading
```bash
curl -X POST http://127.0.0.1:8000/api/v1/quizzes/1/submit \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "answers": {
      "1": 2,
      "2": 0,
      "3": 1
    },
    "time_taken_seconds": 120
  }'
```

### 5. Verify Certificate Publicly
```bash
curl http://127.0.0.1:8000/api/v1/certificates/verify/LH-TJWD-2026-008492 \
  -H "Accept: application/json"
```

---

## 🛡️ Security Best Practices
- **Password Hashing**: Uses modern Bcrypt / Argon2 hashing.
- **Sanctum Tokens**: Plaintext tokens are returned only on creation; SHA-256 hashes are stored in the database.
- **Rate Limiting**: Auth routes have automatic IP & email brute-force protection.
- **CORS Configured**: Cross-origin requests configured for frontend client access via `config/cors.php`.
