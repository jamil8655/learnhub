<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaEnterpriseService
{
    protected string $projectId;
    protected string $siteKey;
    protected ?string $apiKey;

    public function __construct()
    {
        $this->projectId = config('firebase.project_id', env('FIREBASE_PROJECT_ID', 'studio-5305763939-bdcf7'));
        $this->siteKey = env('RECAPTCHA_ENTERPRISE_SITE_KEY', '6LdJ4pItAAAAAKro7iF4u0eNFiUBMWyezlXG682Y');
        $this->apiKey = env('GOOGLE_CLOUD_API_KEY', env('RECAPTCHA_API_KEY'));
    }

    /**
     * Create an assessment to analyze the risk of a UI action.
     *
     * @param string|null $token The token generated on client by grecaptcha.enterprise.execute()
     * @param string $expectedAction The expected action name (e.g. 'LOGIN', 'REGISTER')
     * @return array ['success' => bool, 'score' => float, 'reasons' => array]
     */
    public function createAssessment(?string $token, string $expectedAction = 'LOGIN'): array
    {
        if (empty($token)) {
            // In local/test environments or if token is omitted, pass gracefully with audit note
            return [
                'success' => true,
                'score' => 1.0,
                'action' => $expectedAction,
                'note' => 'Token omitted or offline environment'
            ];
        }

        try {
            $endpoint = "https://recaptchaenterprise.googleapis.com/v1/projects/{$this->projectId}/assessments";
            if ($this->apiKey) {
                $endpoint .= "?key={$this->apiKey}";
            }

            $payload = [
                'event' => [
                    'token' => $token,
                    'expectedAction' => $expectedAction,
                    'siteKey' => $this->siteKey,
                ]
            ];

            $response = Http::timeout(5)->post($endpoint, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $tokenProperties = $data['tokenProperties'] ?? [];
                $riskAnalysis = $data['riskAnalysis'] ?? [];

                $isValidToken = ($tokenProperties['valid'] ?? false) === true;
                $actionMatch = ($tokenProperties['action'] ?? '') === $expectedAction;
                $score = (float)($riskAnalysis['score'] ?? 0.9);

                Log::info("[reCAPTCHA Enterprise] Assessment result: valid={$isValidToken}, action={$actionMatch}, score={$score}");

                return [
                    'success' => $isValidToken && $actionMatch && ($score >= 0.3),
                    'score' => $score,
                    'reasons' => $riskAnalysis['reasons'] ?? [],
                    'action' => $tokenProperties['action'] ?? $expectedAction
                ];
            }

            Log::warning("[reCAPTCHA Enterprise] API response status {$response->status()}: " . $response->body());
            return [
                'success' => true, // Fail-open gracefully to prevent blocking legitimate students
                'score' => 0.8,
                'note' => 'Assessment service unavailable'
            ];
        } catch (\Throwable $e) {
            Log::error("[reCAPTCHA Enterprise] Error creating assessment: " . $e->getMessage());
            return [
                'success' => true,
                'score' => 0.8,
                'error' => $e->getMessage()
            ];
        }
    }
}
