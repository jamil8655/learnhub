<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameWorld;
use App\Models\GameStage;
use App\Models\GameQuestion;
use App\Models\GameAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminGameStudioController extends Controller
{
    /**
     * Get Admin Game Studio Overview & Metrics.
     */
    public function getStudioOverview(): JsonResponse
    {
        $worlds = GameWorld::withCount('stages')->orderBy('world_number')->get();
        $stages = GameStage::with('world')->get();
        $attemptsCount = GameAttempt::count();
        $avgAccuracy = GameAttempt::avg('accuracy') ?: 0;

        return response()->json([
            'success' => true,
            'worlds' => $worlds,
            'stages' => $stages,
            'stats' => [
                'totalWorlds' => $worlds->count(),
                'totalStages' => $stages->count(),
                'totalAttempts' => $attemptsCount,
                'averageAccuracy' => round($avgAccuracy, 1),
            ],
        ]);
    }

    /**
     * Create or Update a Game Stage.
     */
    public function saveStage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'nullable|string',
            'world_id' => 'required|string|exists:game_worlds,id',
            'stage_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'difficulty' => 'required|string|in:easy,medium,hard',
            'time_limit_seconds' => 'required|integer|min:10',
            'reward_xp' => 'required|integer|min:10',
            'reward_coins' => 'required|integer|min:5',
        ]);

        $id = $validated['id'] ?? ('stg-' . Str::uuid());

        $stage = GameStage::updateOrCreate(
            ['id' => $id],
            $validated
        );

        return response()->json([
            'success' => true,
            'stage' => $stage,
            'message' => 'مرحلہ کامیابی سے محفوظ ہو گیا ہے۔',
        ]);
    }
}
