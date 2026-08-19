<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class RateLimitAuthMiddleware
{
    /**
     * Handle an incoming request with rate limiting.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  int  $maxAttempts
     * @param  int  $decaySeconds
     */
    public function handle(Request $request, Closure $next, int $maxAttempts = 5, int $decaySeconds = 60): Response
    {
        $key = 'auth_attempt:' . Str::lower($request->input('email', '')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'success' => false,
                'message' => "Too many authentication attempts. Please try again in {$seconds} seconds.",
                'retry_after' => $seconds,
            ], 429);
        }

        $response = $next($request);

        // If the request was unauthorized (e.g. 401 / 422 with invalid creds), hit the rate limiter
        if ($response->getStatusCode() === 401 || ($response->getStatusCode() === 422 && $request->is('*/login*'))) {
            RateLimiter::hit($key, $decaySeconds);
        }

        return $response;
    }
}
