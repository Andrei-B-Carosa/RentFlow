<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        $userRole = $request->user()?->role;

        // if role is cast to enum — get the string value
        $userRoleValue = $userRole instanceof \BackedEnum
            ? $userRole->value
            : (string) $userRole;

        if (strtoupper($userRoleValue) !== strtoupper($role)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
