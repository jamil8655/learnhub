<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\FirebaseAdminService;
use Illuminate\Console\Command;
use Throwable;

final class FirebaseMakeAdmin extends Command
{
    protected $signature = 'firebase:make-admin
                            {identifier : Firebase Auth UID or email}
                            {--revoke : Remove admin privileges instead of granting them}';

    protected $description = 'Grant or revoke LearnHub Firebase Admin custom claims for a Firebase Auth user.';

    public function handle(FirebaseAdminService $firebase): int
    {
        try {
            $auth = $firebase->auth();
            $identifier = (string) $this->argument('identifier');

            $user = filter_var($identifier, FILTER_VALIDATE_EMAIL)
                ? $auth->getUserByEmail($identifier)
                : $auth->getUser($identifier);

            if ($this->option('revoke')) {
                $firebase->revokeAdmin($user->uid);
                $this->info("Firebase admin privileges revoked for {$user->email} ({$user->uid}).");
            } else {
                $firebase->grantAdmin($user->uid);
                $this->info("Firebase admin privileges granted for {$user->email} ({$user->uid}).");
            }

            $this->warn('The user must refresh their Firebase ID token (sign out/in or force token refresh) before the new claims appear client-side.');

            return self::SUCCESS;
        } catch (Throwable $e) {
            report($e);
            $this->error('Firebase Admin operation failed: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
