<?php

declare(strict_types=1);

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Contract\Firestore as FirebaseFirestore;
use Kreait\Firebase\Auth\UserRecord;
use Kreait\Firebase\Exception\Auth\UserNotFound;
use Kreait\Firebase\Exception\FirebaseException;

/**
 * LearnHub Firebase Admin SDK Service
 *
 * Provides production-grade Firebase Admin Authentication and Custom Claims management.
 * Adheres to zero-credential-leakage, singleton reuse, defensive error handling,
 * and seamless synchronization with Laravel Sanctum and RBAC.
 */
class FirebaseAdminService
{
    protected ?Factory $factory = null;
    protected ?FirebaseAuth $auth = null;
    protected ?FirebaseFirestore $firestore = null;
    protected bool $initialized = false;
    protected ?string $initError = null;

    public function __construct()
    {
        $this->initialize();
    }

    /**
     * Safely initialize the Firebase Admin SDK client.
     */
    protected function initialize(): void
    {
        if ($this->initialized) {
            return;
        }

        try {
            $factory = new Factory();

            $credentialsPath = config('firebase.credentials');
            $credentialsJson = config('firebase.credentials_json');
            $projectId = config('firebase.project_id');

            if (!empty($credentialsJson)) {
                $factory = $factory->withServiceAccount($credentialsJson);
            } elseif (!empty($credentialsPath) && file_exists($credentialsPath) && is_readable($credentialsPath)) {
                $factory = $factory->withServiceAccount($credentialsPath);
            } elseif (!empty($credentialsPath) && !file_exists($credentialsPath)) {
                $this->initError = "Firebase service account credentials file not found at: {$credentialsPath}";
                Log::warning('[FirebaseAdminService] ' . $this->initError);
                return;
            }

            if (!empty($projectId)) {
                $factory = $factory->withProjectId($projectId);
            }

            $this->factory = $factory;
            $this->initialized = true;
        } catch (Exception $e) {
            $this->initError = 'Failed to initialize Firebase Admin SDK: ' . $e->getMessage();
            Log::error('[FirebaseAdminService] Initialization failure: ' . $e->getMessage());
        }
    }

    /**
     * Check if Firebase Admin SDK is successfully connected and ready.
     */
    public function isAvailable(): bool
    {
        return $this->initialized && $this->factory !== null;
    }

    /**
     * Get the initialization error message if any.
     */
    public function getInitError(): ?string
    {
        return $this->initError;
    }

    /**
     * Get the Firebase Auth instance.
     *
     * @throws Exception
     */
    public function getAuth(): FirebaseAuth
    {
        if (!$this->isAvailable()) {
            throw new Exception($this->initError ?? 'Firebase Admin SDK is not configured. Check FIREBASE_CREDENTIALS.');
        }

        if ($this->auth === null) {
            $this->auth = $this->factory->createAuth();
        }

        return $this->auth;
    }

    /**
     * Retrieve a Firebase user by either UID or Email.
     *
     * @param string $identifier UID or Email
     * @return UserRecord|null
     * @throws Exception
     */
    public function findUser(string $identifier): ?UserRecord
    {
        $auth = $this->getAuth();
        $cleanId = trim($identifier);

        // 1. Try by Email if contains '@'
        if (filter_var($cleanId, FILTER_VALIDATE_EMAIL)) {
            try {
                return $auth->getUserByEmail(strtolower($cleanId));
            } catch (UserNotFound $e) {
                // If not found by email, attempt fallback by UID
            }
        }

        // 2. Try by UID
        try {
            return $auth->getUser($cleanId);
        } catch (UserNotFound $e) {
            return null;
        }
    }

    /**
     * Get custom claims for a Firebase user.
     *
     * @param string $uid
     * @return array<string, mixed>
     * @throws Exception
     */
    public function getCustomUserClaims(string $uid): array
    {
        $auth = $this->getAuth();
        $user = $auth->getUser($uid);
        return (array) ($user->customClaims ?? []);
    }

    /**
     * Set raw custom claims for a Firebase user.
     *
     * @param string $uid
     * @param array<string, mixed> $claims
     * @throws Exception
     */
    public function setCustomUserClaims(string $uid, array $claims): void
    {
        $auth = $this->getAuth();
        $auth->setCustomUserClaims($uid, $claims);
    }

    /**
     * Grant Admin privileges to a user in Firebase Auth.
     * Preserves existing unrelated claims, sets admin=true and role='admin'.
     *
     * @param string $identifier UID or Email
     * @param string|null $actor The operator or admin performing this action
     * @return array{user: UserRecord, claims: array<string, mixed>}
     * @throws Exception
     */
    public function grantAdminClaims(string $identifier, ?string $actor = 'Artisan CLI'): array
    {
        $user = $this->findUser($identifier);

        if (!$user) {
            throw new Exception("Firebase user with identifier [{$identifier}] was not found.");
        }

        $existingClaims = (array) ($user->customClaims ?? []);

        // Preserve unrelated claims while setting admin privileges
        $updatedClaims = array_merge($existingClaims, [
            'admin' => true,
            'role' => 'admin',
        ]);

        $this->setCustomUserClaims($user->uid, $updatedClaims);

        Log::info('[FirebaseAdminService] Admin claims GRANTED successfully', [
            'uid' => $user->uid,
            'email' => $user->email,
            'actor' => $actor,
            'timestamp' => now()->toIso8601String(),
        ]);

        return [
            'user' => $user,
            'claims' => $updatedClaims,
        ];
    }

    /**
     * Revoke Admin privileges from a user in Firebase Auth.
     * Preserves existing unrelated claims, removes admin and superAdmin, sets role back to 'student'.
     *
     * @param string $identifier UID or Email
     * @param string|null $actor The operator or admin performing this action
     * @return array{user: UserRecord, claims: array<string, mixed>}
     * @throws Exception
     */
    public function revokeAdminClaims(string $identifier, ?string $actor = 'Artisan CLI'): array
    {
        $user = $this->findUser($identifier);

        if (!$user) {
            throw new Exception("Firebase user with identifier [{$identifier}] was not found.");
        }

        $claims = (array) ($user->customClaims ?? []);

        // Remove admin and superAdmin flags
        unset($claims['admin']);
        unset($claims['superAdmin']);
        unset($claims['super_admin']);

        // Demote privileged role back to standard student if it was admin
        if (isset($claims['role']) && in_array($claims['role'], ['admin', 'super_admin', 'superAdmin'], true)) {
            $claims['role'] = 'student';
        }

        $this->setCustomUserClaims($user->uid, $claims);

        Log::info('[FirebaseAdminService] Admin claims REVOKED successfully', [
            'uid' => $user->uid,
            'email' => $user->email,
            'actor' => $actor,
            'timestamp' => now()->toIso8601String(),
        ]);

        return [
            'user' => $user,
            'claims' => $claims,
        ];
    }

    /**
     * Safely verify a client-provided Firebase ID token and extract claims.
     *
     * @param string $idToken
     * @param bool $checkRevoked
     * @return object|null Decoded token object
     */
    public function verifyIdToken(string $idToken, bool $checkRevoked = false): ?object
    {
        if (!$this->isAvailable()) {
            return null;
        }

        try {
            $auth = $this->getAuth();
            return $auth->verifyIdToken($idToken, $checkRevoked);
        } catch (Exception $e) {
            Log::warning('[FirebaseAdminService] ID Token verification failed: ' . $e->getMessage());
            return null;
        }
    }
}
