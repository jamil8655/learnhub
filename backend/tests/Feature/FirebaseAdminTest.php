<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Services\FirebaseAdminService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Auth\UserRecord;
use Mockery;
use Tests\TestCase;

class FirebaseAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test 1: Normal registration creates a standard Student account and cannot set admin.
     */
    public function test_normal_registration_cannot_create_admin(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Tariq Mahmood',
            'email' => 'tariq@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'admin', // Attempted privilege escalation
            'admin' => true,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'tariq@example.com',
            'role' => 'student', // Must remain student
        ]);

        $user = User::where('email', 'tariq@example.com')->first();
        $this->assertNotNull($user);
        $this->assertFalse($user->isAdmin());
        $this->assertSame('student', $user->role);
    }

    /**
     * Test 2: Standard user cannot access Admin endpoints (AdminMiddleware protected).
     */
    public function test_standard_user_cannot_access_admin_endpoints(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
        ]);

        $response = $this->actingAs($student)->getJson('/api/v1/admin/users');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Forbidden. Admin privileges required.',
            ]);
    }

    /**
     * Test 3: Missing Firebase credentials fail safely without throwing unhandled exceptions.
     */
    public function test_missing_firebase_credentials_fail_safely(): void
    {
        Config::set('firebase.credentials', '/non/existent/service-account.json');
        Config::set('firebase.credentials_json', null);

        $service = new FirebaseAdminService();

        $this->assertFalse($service->isAvailable());
        $this->assertNotNull($service->getInitError());
        $this->assertStringContainsString('credentials file not found', $service->getInitError());
    }

    /**
     * Test 4: Artisan Command `firebase:make-admin` grants admin claims and preserves unrelated claims.
     */
    public function test_firebase_make_admin_command_grants_claims_and_preserves_unrelated(): void
    {
        $user = User::factory()->create([
            'email' => 'admin_candidate@example.com',
            'role' => 'student',
        ]);

        // Mock Firebase UserRecord with existing unrelated claims
        $userRecord = Mockery::mock(UserRecord::class);
        $userRecord->uid = 'fb-uid-12345';
        $userRecord->email = 'admin_candidate@example.com';
        $userRecord->displayName = 'Admin Candidate';
        $userRecord->customClaims = [
            'department' => 'Quranic Studies',
            'premium' => true,
        ];

        // Mock Firebase Auth Contract
        $firebaseAuth = Mockery::mock(FirebaseAuth::class);
        $firebaseAuth->shouldReceive('getUserByEmail')
            ->with('admin_candidate@example.com')
            ->once()
            ->andReturn($userRecord);

        $firebaseAuth->shouldReceive('getUser')
            ->with('fb-uid-12345')
            ->andReturn($userRecord);

        $firebaseAuth->shouldReceive('setCustomUserClaims')
            ->with('fb-uid-12345', Mockery::on(function ($claims) {
                return isset($claims['admin']) && $claims['admin'] === true
                    && isset($claims['role']) && $claims['role'] === 'admin'
                    && isset($claims['department']) && $claims['department'] === 'Quranic Studies'
                    && isset($claims['premium']) && $claims['premium'] === true;
            }))
            ->once();

        // Mock FirebaseAdminService
        $service = Mockery::mock(FirebaseAdminService::class)->makePartial();
        $service->shouldReceive('isAvailable')->andReturn(true);
        $service->shouldReceive('getAuth')->andReturn($firebaseAuth);

        $this->app->instance(FirebaseAdminService::class, $service);

        $this->artisan('firebase:make-admin', ['user' => 'admin_candidate@example.com'])
            ->expectsOutputToContain('Admin privileges GRANTED successfully')
            ->assertExitCode(0);

        // Verify local DB synchronization
        $user->refresh();
        $this->assertSame('admin', $user->role);
        $this->assertTrue($user->isAdmin());
    }

    /**
     * Test 5: Artisan Command `firebase:make-admin --revoke` removes admin claims and demotes to student.
     */
    public function test_firebase_make_admin_command_revoke_removes_admin(): void
    {
        $user = User::factory()->create([
            'email' => 'former_admin@example.com',
            'role' => 'admin',
        ]);

        $userRecord = Mockery::mock(UserRecord::class);
        $userRecord->uid = 'fb-uid-67890';
        $userRecord->email = 'former_admin@example.com';
        $userRecord->displayName = 'Former Admin';
        $userRecord->customClaims = [
            'admin' => true,
            'role' => 'admin',
            'superAdmin' => true,
            'badge' => 'Gold',
        ];

        $firebaseAuth = Mockery::mock(FirebaseAuth::class);
        $firebaseAuth->shouldReceive('getUserByEmail')
            ->with('former_admin@example.com')
            ->once()
            ->andReturn($userRecord);

        $firebaseAuth->shouldReceive('getUser')
            ->with('fb-uid-67890')
            ->andReturn($userRecord);

        $firebaseAuth->shouldReceive('setCustomUserClaims')
            ->with('fb-uid-67890', Mockery::on(function ($claims) {
                return !isset($claims['admin'])
                    && !isset($claims['superAdmin'])
                    && isset($claims['role']) && $claims['role'] === 'student'
                    && isset($claims['badge']) && $claims['badge'] === 'Gold';
            }))
            ->once();

        $service = Mockery::mock(FirebaseAdminService::class)->makePartial();
        $service->shouldReceive('isAvailable')->andReturn(true);
        $service->shouldReceive('getAuth')->andReturn($firebaseAuth);

        $this->app->instance(FirebaseAdminService::class, $service);

        $this->artisan('firebase:make-admin', [
            'user' => 'former_admin@example.com',
            '--revoke' => true,
        ])
            ->expectsOutputToContain('Admin privileges REVOKED successfully')
            ->assertExitCode(0);

        $user->refresh();
        $this->assertSame('student', $user->role);
        $this->assertFalse($user->isAdmin());
    }
}
