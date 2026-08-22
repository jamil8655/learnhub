<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Factory;
use RuntimeException;

final class FirebaseAdminService
{
    private ?Auth $auth = null;

    public function auth(): Auth
    {
        if ($this->auth instanceof Auth) {
            return $this->auth;
        }

        $credentials = config('firebase.credentials');

        if (!is_string($credentials) || $credentials === '') {
            throw new RuntimeException('FIREBASE_CREDENTIALS is not configured.');
        }

        if (!is_file($credentials) || !is_readable($credentials)) {
            throw new RuntimeException('Firebase service-account credentials file is missing or unreadable.');
        }

        $this->auth = (new Factory())
            ->withServiceAccount($credentials)
            ->createAuth();

        return $this->auth;
    }

    /**
     * Grant the Firebase Admin custom claim to an existing Firebase Auth user.
     * Existing custom claims are preserved.
     */
    public function grantAdmin(string $uid): void
    {
        $auth = $this->auth();
        $user = $auth->getUser($uid);
        $claims = $user->customClaims ?? [];

        $claims['admin'] = true;
        $claims['role'] = 'admin';

        $auth->setCustomUserClaims($uid, $claims);

        Log::notice('Firebase admin claim granted', [
            'uid' => $uid,
            'email' => $user->email,
        ]);
    }

    /**
     * Remove privileged Firebase claims from a user.
     */
    public function revokeAdmin(string $uid): void
    {
        $auth = $this->auth();
        $user = $auth->getUser($uid);
        $claims = $user->customClaims ?? [];

        unset($claims['admin'], $claims['superAdmin']);

        if (($claims['role'] ?? null) === 'admin' || ($claims['role'] ?? null) === 'super_admin') {
            $claims['role'] = 'student';
        }

        $auth->setCustomUserClaims($uid, $claims ?: null);

        Log::warning('Firebase admin claim revoked', [
            'uid' => $uid,
            'email' => $user->email,
        ]);
    }
}
