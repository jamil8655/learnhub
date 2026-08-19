<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\CourseController;
use App\Http\Controllers\Api\v1\QuizController;
use App\Http\Controllers\Api\v1\CertificateController;
use App\Http\Controllers\Api\v1\HadithController;
use App\Http\Controllers\Api\v1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\v1\Admin\AdminUserController;

/*
|--------------------------------------------------------------------------
| LearnHub API Routes (Version 1)
|--------------------------------------------------------------------------
| Base Prefix: /api/v1
*/

Route::prefix('v1')->group(function () {

    /* =========================================================================
       1. PUBLIC / GUEST ROUTES
       ========================================================================= */

    // Authentication (Rate-limited)
    Route::prefix('auth')->middleware(['auth.ratelimit:5,60'])->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
    });

    // Courses Discovery (Public)
    Route::prefix('courses')->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::get('/{id}', [CourseController::class, 'show']);
    });

    // Quizzes Discovery & Practice (Public show sanitized without answers)
    Route::prefix('quizzes')->group(function () {
        Route::get('/', [QuizController::class, 'index']);
        Route::get('/{id}', [QuizController::class, 'show']);
    });

    // Certificate Public Verification
    Route::get('/certificates/verify/{code}', [CertificateController::class, 'verifyPublic']);

    // Hadith & Islamic Reference Library
    Route::prefix('hadith')->group(function () {
        Route::get('/', [HadithController::class, 'index']);
        Route::get('/search', [HadithController::class, 'search']);
        Route::get('/{id}', [HadithController::class, 'show']);
    });


    /* =========================================================================
       2. AUTHENTICATED USER ROUTES (auth:sanctum)
       ========================================================================= */

    Route::middleware(['auth:sanctum'])->group(function () {

        // User Profile & Account Security
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);

            // 2FA Security Management
            Route::prefix('2fa')->group(function () {
                Route::post('/setup', [AuthController::class, 'setup2FA']);
                Route::post('/confirm', [AuthController::class, 'confirm2FA']);
                Route::post('/disable', [AuthController::class, 'disable2FA']);
            });

            // Session Device Management
            Route::prefix('sessions')->group(function () {
                Route::get('/', [AuthController::class, 'getSessions']);
                Route::delete('/{sessionId}', [AuthController::class, 'revokeSession']);
            });
        });

        // Course Enrollment & Lesson Progress
        Route::prefix('courses')->group(function () {
            Route::post('/{id}/enroll', [CourseController::class, 'enroll']);
            Route::post('/{courseId}/lessons/{lessonId}/progress', [CourseController::class, 'lessonProgress']);
        });

        // Quiz Submission & History
        Route::prefix('quizzes')->group(function () {
            Route::post('/{id}/submit', [QuizController::class, 'submit']);
            Route::get('/attempts/history', [QuizController::class, 'getAttemptHistory']);
        });

        // User Certificates
        Route::prefix('certificates')->group(function () {
            Route::get('/', [CertificateController::class, 'index']);
            Route::get('/{id}', [CertificateController::class, 'show']);
        });


        /* =====================================================================
           3. ADMIN ROUTES (auth:sanctum + admin)
           ===================================================================== */

        Route::prefix('admin')->middleware(['admin'])->group(function () {

            // Admin Analytics & KPIs
            Route::prefix('dashboard')->group(function () {
                Route::get('/kpis', [AdminDashboardController::class, 'kpis']);
                Route::get('/analytics', [AdminDashboardController::class, 'analytics']);
            });

            // User Management & Access Control
            Route::prefix('users')->group(function () {
                Route::get('/', [AdminUserController::class, 'index']);
                Route::put('/{id}/role', [AdminUserController::class, 'updateRole']);
                Route::put('/{id}/status', [AdminUserController::class, 'toggleStatus']);
                Route::post('/{id}/revoke-sessions', [AdminUserController::class, 'revokeSessions']);
            });

            // Standalone Quiz Management Suite
            Route::prefix('quizzes')->group(function () {
                Route::post('/', [QuizController::class, 'adminStore']);
                Route::put('/{id}', [QuizController::class, 'adminUpdate']);
                Route::delete('/{id}', [QuizController::class, 'adminDelete']);
                Route::post('/{id}/duplicate', [QuizController::class, 'adminDuplicate']);
                Route::get('/{id}/analytics', [QuizController::class, 'adminAnalytics']);
                Route::get('/{id}/questions', [QuizController::class, 'adminGetQuestions']);
                Route::post('/{id}/questions', [QuizController::class, 'adminSaveQuestion']);
                Route::delete('/{quizId}/questions/{questionId}', [QuizController::class, 'adminDeleteQuestion']);
            });
        });
    });
});
