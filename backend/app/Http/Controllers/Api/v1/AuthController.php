<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\PasswordChangeRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use App\Models\UserSession;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class AuthController extends Controller
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Register a new user account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $verificationToken = Str::random(64);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'status' => 'active',
            'phone' => $validated['phone'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'verification_token' => $verificationToken,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $token = $user->createToken($request->input('device_name', 'Default Browser'))->plainTextToken;

        // Record User Session
        $this->recordSession($user, $request, $token);

        // Audit Log
        $this->logAudit($user, 'USER_REGISTER', 'User registered with email ' . $user->email, $request);

        return response()->json([
            'success' => true,
            'message' => 'اکاؤنٹ کامیابی کے ساتھ بن گیا ہے۔ (Account registered successfully)',
            'data' => [
                'user' => $user,
                'token' => $token,
                'verification_required' => false,
            ]
        ], 201);
    }

    /**
     * Login user, verify password, check 2FA challenge if active.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', strtolower($request->input('email')))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'ای میل یا پاس ورڈ درست نہیں ہے۔ (Invalid email or password)',
            ], 401);
        }

        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'آپ کا اکاؤنٹ معطل یا غیر فعال ہے۔ براہ کرم ایڈمن سے رابطہ کریں۔ (Account is suspended/disabled)',
            ], 403);
        }

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            $twoFactorCode = $request->input('two_factor_code');
            $recoveryCode = $request->input('recovery_code');

            if (empty($twoFactorCode) && empty($recoveryCode)) {
                return response()->json([
                    'success' => true,
                    'requires_2fa' => true,
                    'message' => 'براہ کرم دو فیکٹر توثیقی کوڈ درج کریں۔ (2FA challenge required)',
                    'temp_token' => encrypt([
                        'user_id' => $user->id,
                        'expires_at' => now()->addMinutes(5)->timestamp,
                    ]),
                ], 200);
            }

            // Verify TOTP Code
            $isValid2FA = false;
            if (!empty($twoFactorCode)) {
                $isValid2FA = $this->google2fa->verifyKey($user->two_factor_secret, $twoFactorCode, 2);
            } elseif (!empty($recoveryCode)) {
                $recoveryCodes = $user->two_factor_recovery_codes ?? [];
                if (in_array($recoveryCode, $recoveryCodes)) {
                    $isValid2FA = true;
                    // Remove used recovery code
                    $user->two_factor_recovery_codes = array_values(array_diff($recoveryCodes, [$recoveryCode]));
                    $user->save();
                }
            }

            if (!$isValid2FA) {
                return response()->json([
                    'success' => false,
                    'message' => 'غلط 2FA توثیقی کوڈ یا ریکوری کوڈ ہے۔ (Invalid 2FA code or recovery code)',
                ], 422);
            }
        }

        // Update login stats
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $deviceName = $request->input('device_name') ?: $this->detectDevice($request->userAgent());
        $token = $user->createToken($deviceName)->plainTextToken;

        // Record User Session
        $this->recordSession($user, $request, $token, $deviceName);

        // Audit Log
        $this->logAudit($user, 'USER_LOGIN', 'User logged in from ' . $request->ip(), $request);

        return response()->json([
            'success' => true,
            'message' => 'کامیابی سے لاگ ان ہو گئے۔ (Logged in successfully)',
            'data' => [
                'user' => $user->fresh(),
                'token' => $token,
            ]
        ], 200);
    }

    /**
     * Logout and revoke current access token and session.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $currentToken = $user->currentAccessToken();
            if ($currentToken) {
                UserSession::where('user_id', $user->id)
                    ->where('token_id', $currentToken->id)
                    ->update(['is_revoked' => true]);

                $currentToken->delete();
            }

            $this->logAudit($user, 'USER_LOGOUT', 'User logged out', $request);
        }

        return response()->json([
            'success' => true,
            'message' => 'کامیابی سے لاگ آؤٹ ہو گیا۔ (Logged out successfully)',
        ], 200);
    }

    /**
     * Verify email with token.
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Verification token missing',
            ], 422);
        }

        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification token.',
            ], 400);
        }

        $user->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);

        $this->logAudit($user, 'EMAIL_VERIFIED', 'Email verified successfully', $request);

        return response()->json([
            'success' => true,
            'message' => 'ای میل کامیابی کے ساتھ تصدیق ہو گئی ہے۔ (Email verified successfully)',
            'data' => ['user' => $user]
        ], 200);
    }

    /**
     * Resend verification email link/token.
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json([
                'success' => true,
                'message' => 'آپ کی ای میل پہلے ہی تصدیق شدہ ہے۔ (Email already verified)',
            ], 200);
        }

        $token = Str::random(64);
        $user->update(['verification_token' => $token]);

        return response()->json([
            'success' => true,
            'message' => 'تصدیقی لنک آپ کے ای میل پر بھیج دیا گیا ہے۔ (Verification link sent to your email)',
            'debug_token' => config('app.debug') ? $token : null,
        ], 200);
    }

    /**
     * Send password reset token.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', strtolower($request->input('email')))->first();

        if (!$user) {
            // Keep message generic for security
            return response()->json([
                'success' => true,
                'message' => 'اگر یہ ای میل رجسٹرڈ ہے تو پاس ورڈ ری سیٹ لنک بھیج دیا گیا ہے۔ (Password reset instructions sent)',
            ], 200);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $this->logAudit($user, 'PASSWORD_RESET_REQUESTED', 'Password reset token generated', $request);

        return response()->json([
            'success' => true,
            'message' => 'پاس ورڈ ری سیٹ کی ہدایات بھیج دی گئی ہیں۔ (Password reset instructions sent)',
            'debug_reset_token' => config('app.debug') ? $token : null,
        ], 200);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $record = DB::table('password_reset_tokens')
            ->where('email', strtolower($request->input('email')))
            ->first();

        if (!$record || !Hash::check($request->input('token'), $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'ری سیٹ ٹوکن غلط یا ختم ہو چکا ہے۔ (Invalid or expired password reset token)',
            ], 422);
        }

        $user = User::where('email', strtolower($request->input('email')))->firstOrFail();
        $user->password = Hash::make($request->input('password'));
        $user->save();

        // Revoke reset token and all tokens/sessions
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();
        $user->tokens()->delete();
        UserSession::where('user_id', $user->id)->update(['is_revoked' => true]);

        $this->logAudit($user, 'PASSWORD_RESET_COMPLETED', 'Password reset successfully', $request);

        return response()->json([
            'success' => true,
            'message' => 'پاس ورڈ کامیابی کے ساتھ تبدیل کر دیا گیا ہے۔ (Password reset successfully. Please login again.)',
        ], 200);
    }

    /**
     * Change password for logged-in user.
     */
    public function changePassword(PasswordChangeRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'موجودہ پاس ورڈ درست نہیں ہے۔ (Current password is incorrect)',
            ], 422);
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        $this->logAudit($user, 'PASSWORD_CHANGED', 'User changed their password', $request);

        return response()->json([
            'success' => true,
            'message' => 'پاس ورڈ کامیابی کے ساتھ اپ ڈیٹ ہو گیا ہے۔ (Password updated successfully)',
        ], 200);
    }

    /**
     * Setup 2FA secret and generate OTP QR URL.
     */
    public function setup2FA(Request $request): JsonResponse
    {
        $user = $request->user();

        $secretKey = $this->google2fa->generateSecretKey();

        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name', 'LearnHub'),
            $user->email,
            $secretKey
        );

        // Store secret temporarily
        $user->two_factor_secret = $secretKey;
        $user->save();

        return response()->json([
            'success' => true,
            'data' => [
                'secret' => $secretKey,
                'qr_code_url' => $qrCodeUrl,
            ],
            'message' => '2FA سیٹ اپ تیار ہے۔ تصدیق کے لیے 6 ہندسوں کا کوڈ درج کریں۔ (2FA setup initialized)',
        ], 200);
    }

    /**
     * Confirm 2FA setup with 6-digit code.
     */
    public function confirm2FA(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'success' => false,
                'message' => 'پہلے 2FA سیٹ اپ شروع کریں۔ (Please initiate 2FA setup first)',
            ], 400);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->input('code'), 2);

        if (!$valid) {
            return response()->json([
                'success' => false,
                'message' => 'غلط تصدیقی کوڈ درج کیا گیا ہے۔ (Invalid 2FA authentication code)',
            ], 422);
        }

        // Generate 8 recovery codes
        $recoveryCodes = [];
        for ($i = 0; $i < 8; $i++) {
            $recoveryCodes[] = strtoupper(Str::random(5) . '-' . Str::random(5));
        }

        $user->two_factor_enabled = true;
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->save();

        $this->logAudit($user, '2FA_ENABLED', 'Two-factor authentication enabled', $request);

        return response()->json([
            'success' => true,
            'message' => '2FA کامیابی سے فعال کر دیا گیا ہے۔ (Two-factor authentication enabled)',
            'data' => [
                'recovery_codes' => $recoveryCodes,
            ]
        ], 200);
    }

    /**
     * Disable 2FA.
     */
    public function disable2FA(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
            'code' => ['nullable', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'پاس ورڈ درست نہیں ہے۔ (Incorrect password)',
            ], 422);
        }

        if (!empty($request->input('code'))) {
            $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->input('code'), 2);
            if (!$valid) {
                return response()->json([
                    'success' => false,
                    'message' => 'غلط 2FA کوڈ درج کیا گیا ہے۔ (Invalid 2FA code)',
                ], 422);
            }
        }

        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        $this->logAudit($user, '2FA_DISABLED', 'Two-factor authentication disabled', $request);

        return response()->json([
            'success' => true,
            'message' => '2FA کامیابی کے ساتھ غیر فعال کر دیا گیا ہے۔ (Two-factor authentication disabled)',
        ], 200);
    }

    /**
     * Get active login sessions for the authenticated user.
     */
    public function getSessions(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentSessionTokenId = $user->currentAccessToken()?->id;

        $sessions = UserSession::where('user_id', $user->id)
            ->where('is_revoked', false)
            ->orderBy('last_active_at', 'desc')
            ->get()
            ->map(function ($session) use ($currentSessionTokenId) {
                return [
                    'id' => $session->id,
                    'device_name' => $session->device_name,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_active_at' => $session->last_active_at,
                    'is_current' => ($session->token_id === $currentSessionTokenId),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ], 200);
    }

    /**
     * Revoke a specific session or all other sessions.
     */
    public function revokeSession(Request $request, $sessionId): JsonResponse
    {
        $user = $request->user();

        if ($sessionId === 'all_others') {
            $currentTokenId = $user->currentAccessToken()?->id;
            
            $user->tokens()->where('id', '!=', $currentTokenId)->delete();
            UserSession::where('user_id', $user->id)
                ->where('token_id', '!=', $currentTokenId)
                ->update(['is_revoked' => true]);

            $this->logAudit($user, 'SESSIONS_REVOKED_ALL', 'Revoked all other sessions', $request);

            return response()->json([
                'success' => true,
                'message' => 'دیگر تمام سیشنز کامیابی سے منسوخ کر دیے گئے ہیں۔ (All other sessions revoked)',
            ], 200);
        }

        $session = UserSession::where('user_id', $user->id)->where('id', $sessionId)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'سیشن نہیں ملا۔ (Session not found)',
            ], 404);
        }

        $session->update(['is_revoked' => true]);
        if ($session->token_id) {
            $user->tokens()->where('id', $session->token_id)->delete();
        }

        $this->logAudit($user, 'SESSION_REVOKED', "Revoked session #{$sessionId}", $request);

        return response()->json([
            'success' => true,
            'message' => 'سیشن کامیابی کے ساتھ منسوخ کر دیا گیا ہے۔ (Session revoked successfully)',
        ], 200);
    }

    /**
     * Helper: Record user session.
     */
    protected function recordSession(User $user, Request $request, string $plainToken, ?string $deviceName = null): void
    {
        $tokenId = null;
        if (str_contains($plainToken, '|')) {
            $tokenId = explode('|', $plainToken)[0];
        }

        UserSession::create([
            'user_id' => $user->id,
            'token_id' => $tokenId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_name' => $deviceName ?: $this->detectDevice($request->userAgent()),
            'last_active_at' => now(),
            'is_revoked' => false,
        ]);
    }

    /**
     * Helper: Detect device from User-Agent.
     */
    protected function detectDevice(?string $ua): string
    {
        if (!$ua) return 'Web Browser';
        if (stripos($ua, 'android') !== false) return 'Android Mobile';
        if (stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false) return 'Apple iOS Device';
        if (stripos($ua, 'macintosh') !== false || stripos($ua, 'mac os') !== false) return 'Mac Computer';
        if (stripos($ua, 'windows') !== false) return 'Windows PC';
        if (stripos($ua, 'linux') !== false) return 'Linux Workstation';
        return 'Web Client';
    }

    /**
     * Helper: Write Audit Log.
     */
    protected function logAudit(User $user, string $action, string $details, Request $request): void
    {
        AuditLog::create([
            'user_id' => $user->id,
            'actor_name' => $user->name,
            'action' => $action,
            'details' => $details,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
