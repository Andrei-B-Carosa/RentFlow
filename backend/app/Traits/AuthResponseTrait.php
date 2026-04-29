<?php

namespace App\Traits;

trait AuthResponseTrait
{
    protected function authResponse($user, string $token, int $code = 200): JsonResponse
    {
        return response()->json([
            'user'     => $user,
            'token'    => $token,
        ], $code);
    }

    protected function passwordResponse(string $message, $code):JsonResponse
    {
        return response()->json([
            'message' => __($status)
        ], $code);
    }
}
