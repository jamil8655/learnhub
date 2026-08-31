<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MaskPiiResponseMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $user = $request->user();
        if ($user && in_array($user->role, ['admin', 'super_admin'])) {
            return $response;
        }

        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $data = $response->getData(true);
            if (is_array($data)) {
                $this->maskPiiRecursive($data);
                $response->setData($data);
            }
        }
        return $response;
    }

    private function maskPiiRecursive(array &$data): void
    {
        foreach ($data as $key => &$value) {
            if (is_array($value)) {
                $this->maskPiiRecursive($value);
            } elseif ($key === 'phone' && is_string($value) && strlen($value) > 4) {
                $value = '******' . substr($value, -4);
            } elseif ($key === 'email' && is_string($value) && str_contains($value, '@')) {
                $parts = explode('@', $value);
                $value = substr($parts[0], 0, 1) . '***@' . $parts[1];
            }
        }
    }
}
