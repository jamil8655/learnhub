<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\InstructorApplication;
use App\Models\InstructorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InstructorTest extends TestCase
{
    /**
     * Test public registration cannot self-assign instructor role.
     * The backend MUST always ignore any user-supplied role and force 'student'.
     */
    public function test_public_registration_cannot_self_assign_instructor_role()
    {
        $payload = [
            'name' => 'ٹیسٹ امیدوار',
            'email' => 'test_applicant_' . rand(1000, 9999) . '@learnhub.test',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'instructor', // Malicious attempt to self-promote
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('users', [
            'email' => $payload['email'],
            'role' => 'student', // MUST be student
        ]);
    }

    /**
     * Test guest can browse public instructors directory.
     */
    public function test_guest_can_browse_instructors_directory()
    {
        $response = $this->getJson('/api/v1/instructors');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data'
                 ]);
    }

    /**
     * Test authenticated student can apply to become an instructor.
     */
    public function test_student_can_apply_to_become_instructor()
    {
        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active'
        ]);

        $payload = [
            'title' => 'استاذ علوم الحدیث و التفسیر',
            'bio' => 'جامعہ سے فراغت اور تدریس کا ۵ سالہ تجربہ۔',
            'expertise' => ['تجوید', 'حدیث', 'فقہ'],
            'qualifications' => 'شہادۃ العالمیہ و ایم فل اسلامیات',
            'experience_years' => 5,
            'teaching_languages' => ['اردو', 'عربی'],
            'motivation' => 'امت کے نوجوانوں کو مستند دینی تعلیم فراہم کرنا۔'
        ];

        $response = $this->actingAs($student, 'sanctum')
                         ->postJson('/api/v1/instructor-application/apply', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'id',
                         'user_id',
                         'status'
                     ]
                 ]);
    }

    /**
     * Test admin can approve an instructor application.
     */
    public function test_admin_can_approve_instructor_application()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active'
        ]);

        $applicant = User::factory()->create([
            'role' => 'student',
            'status' => 'active'
        ]);

        $application = InstructorApplication::create([
            'user_id' => $applicant->id,
            'title' => 'محقق و استاذ',
            'bio' => 'تفصیلی بائیو',
            'expertise' => ['تجوید'],
            'qualifications' => 'عالمیہ',
            'experience_years' => 3,
            'teaching_languages' => ['اردو'],
            'status' => 'submitted'
        ]);

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/v1/admin/instructors/applications/' . $application->id . '/approve', [
                             'admin_notes' => 'درخواست منظور ہے۔'
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $applicant->refresh();
        $this->assertEquals('instructor', $applicant->role);
    }
}
