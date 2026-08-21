<?php

namespace App\Http\Controllers\Api\v1\Game;

use App\Http\Controllers\Controller;
use App\Models\GameWorld;
use App\Models\GameStage;
use App\Models\GameQuestion;
use App\Models\GameAttempt;
use App\Models\GameProgress;
use App\Models\GameMission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdventureGameController extends Controller
{
    /**
     * Get Game Lobby and Map Data.
     */
    public function getLobby(Request $request): JsonResponse
    {
        $worlds = GameWorld::active()->with(['stages'])->get();
        $missions = GameMission::all();

        $user = $request->user();
        $progress = null;

        if ($user) {
            $progress = GameProgress::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'id' => 'gp-' . Str::uuid(),
                    'level' => 1,
                    'total_xp' => 0,
                    'coins' => 250,
                    'hearts' => 3,
                    'streak' => 1,
                    'unlocked_worlds' => ['w-1'],
                    'completed_stages' => (object)[],
                    'inventory' => [
                        'hint' => 3,
                        'fiftyFifty' => 3,
                        'timeBoost' => 2,
                        'extraLife' => 1
                    ],
                    'weak_areas' => [],
                    'achievements' => ['ach-first-step']
                ]
            );
        }

        return response()->json([
            'success' => true,
            'worlds' => $worlds,
            'missions' => $missions,
            'progress' => $progress,
        ]);
    }

    /**
     * Start a specific Stage session.
     */
    public function startStage(Request $request, string $stageId): JsonResponse
    {
        $stage = GameStage::with(['world', 'questions'])->find($stageId);

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'مرحلہ موجود نہیں ہے۔ (Stage not found)',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'stage' => $stage,
            'questions' => $stage->questions,
        ]);
    }

    /**
     * Submit Stage Attempt & Calculate Authoritative Rewards.
     */
    public function submitStage(Request $request, string $stageId): JsonResponse
    {
        $stage = GameStage::findOrFail($stageId);
        $user = $request->user();

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'accuracy' => 'required|integer|min:0|max:100',
            'timeTakenSeconds' => 'required|integer|min:0',
            'answersPayload' => 'nullable|array',
        ]);

        // Calculate Stars
        $stars = 0;
        if ($validated['accuracy'] === 100) {
            $stars = 3;
        } elseif ($validated['accuracy'] >= 80) {
            $stars = 2;
        } elseif ($validated['accuracy'] >= 60) {
            $stars = 1;
        }

        $earnedXp = (int) round($stage->reward_xp * ($validated['accuracy'] / 100) + ($stars === 3 ? 50 : 0));
        $earnedCoins = (int) round($stage->reward_coins * ($stars / 3) + ($stars === 3 ? 25 : 0));

        // Record attempt
        $attempt = GameAttempt::create([
            'id' => 'att-' . Str::uuid(),
            'user_id' => $user ? $user->id : null,
            'stage_id' => $stageId,
            'world_id' => $stage->world_id,
            'score' => $validated['score'],
            'stars' => $stars,
            'accuracy' => $validated['accuracy'],
            'time_taken_seconds' => $validated['timeTakenSeconds'],
            'answers_payload' => $validated['answersPayload'] ?? [],
            'completed_at' => now(),
        ]);

        // Update User Progress
        if ($user) {
            $progress = GameProgress::where('user_id', $user->id)->first();
            if ($progress) {
                $progress->total_xp += $earnedXp;
                $progress->coins += $earnedCoins;
                $progress->level = (int) (floor(sqrt($progress->total_xp / 100)) + 1);

                $completed = $progress->completed_stages ?? [];
                $prevStars = $completed[$stageId]['stars'] ?? 0;
                $completed[$stageId] = [
                    'stars' => max($prevStars, $stars),
                    'bestScore' => max($completed[$stageId]['bestScore'] ?? 0, $validated['score']),
                    'completedAt' => now()->toIso8601String()
                ];
                $progress->completed_stages = $completed;
                $progress->save();
            }
        }

        return response()->json([
            'success' => true,
            'stars' => $stars,
            'earnedXp' => $earnedXp,
            'earnedCoins' => $earnedCoins,
            'attemptId' => $attempt->id,
        ]);
    }
}
