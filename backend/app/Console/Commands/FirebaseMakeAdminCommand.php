<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use App\Services\FirebaseAdminService;
use Exception;
use Illuminate\Console\Command;

class FirebaseMakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'firebase:make-admin 
                            {user : Firebase UID or Email address of the user}
                            {--revoke : Revoke Admin claims instead of granting them}
                            {--sync-db : Synchronize the role in the local Laravel database as well}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Grant or revoke Firebase Auth custom claims (admin: true, role: admin) for a user';

    /**
     * Execute the console command.
     */
    public function handle(FirebaseAdminService $firebase): int
    {
        $identifier = (string) $this->argument('user');
        $isRevoke = (bool) $this->option('revoke');
        $syncDb = $this->option('sync-db') !== false;

        $this->info('');
        $this->line('===============================================================');
        $this->info(' LearnHub Enterprise Firebase Admin Security Provisioner');
        $this->line('===============================================================');
        $this->info('');

        if (!$firebase->isAvailable()) {
            $this->error(' [ERROR] Firebase Admin SDK is not available.');
            $this->line(' Reason: ' . ($firebase->getInitError() ?? 'Credentials not configured.'));
            $this->line('');
            $this->comment(' Please verify FIREBASE_CREDENTIALS in your .env file:');
            $this->line(' FIREBASE_CREDENTIALS=/path/to/firebase-service-account.json');
            $this->line('');
            return Command::FAILURE;
        }

        $this->line(" Resolving Firebase Auth user: <fg=cyan>{$identifier}</> ...");

        try {
            if ($isRevoke) {
                $result = $firebase->revokeAdminClaims($identifier, 'CLI Artisan Command');
                $user = $result['user'];
                $claims = $result['claims'];

                $this->info('');
                $this->info(" [SUCCESS] Admin privileges REVOKED successfully for:");
                $this->table(
                    ['Field', 'Value'],
                    [
                        ['Firebase UID', $user->uid],
                        ['Email', $user->email ?? 'N/A'],
                        ['Display Name', $user->displayName ?? 'N/A'],
                        ['Admin Claim', 'REMOVED (false)'],
                        ['Assigned Role', $claims['role'] ?? 'student'],
                    ]
                );

                // Synchronize with local database if user exists
                if ($syncDb && !empty($user->email)) {
                    $localUser = User::where('email', strtolower($user->email))->first();
                    if ($localUser) {
                        $localUser->update(['role' => 'student']);
                        $this->line(" <fg=green>✓</> Synchronized local Laravel database: <fg=yellow>role=student</>");
                    }
                }

                $this->warn(' Note: User must refresh their Firebase ID token (or re-login) for changes to take effect in client apps.');
            } else {
                $result = $firebase->grantAdminClaims($identifier, 'CLI Artisan Command');
                $user = $result['user'];
                $claims = $result['claims'];

                $this->info('');
                $this->info(" [SUCCESS] Admin privileges GRANTED successfully for:");
                $this->table(
                    ['Field', 'Value'],
                    [
                        ['Firebase UID', $user->uid],
                        ['Email', $user->email ?? 'N/A'],
                        ['Display Name', $user->displayName ?? 'N/A'],
                        ['Admin Claim', 'admin: true'],
                        ['Role Claim', 'role: admin'],
                    ]
                );

                // Synchronize with local database if user exists
                if ($syncDb && !empty($user->email)) {
                    $localUser = User::where('email', strtolower($user->email))->first();
                    if ($localUser) {
                        $localUser->update(['role' => 'admin', 'status' => 'active', 'email_verified_at' => now()]);
                        $this->line(" <fg=green>✓</> Synchronized local Laravel database: <fg=green>role=admin, status=active</>");
                    }
                }

                $this->line('');
                $this->comment(' Security Notice:');
                $this->line(' • Firestore Security Rules now recognize request.auth.token.admin == true');
                $this->line(' • The user must refresh their Firebase token to apply claims to active browser sessions.');
            }

            $this->info('');
            return Command::SUCCESS;
        } catch (Exception $e) {
            $this->error('');
            $this->error(" [FAILURE] {$e->getMessage()}");
            $this->line('');
            return Command::FAILURE;
        }
    }
}
