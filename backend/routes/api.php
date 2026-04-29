<?php

use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::prefix('auth')->group(base_path('routes/auth.php'));

// Landlord routes
Route::middleware(['auth:sanctum', 'role:landlord'])
    ->prefix('landlord')
    ->group(base_path('routes/landlord.php'));

// Tenant routes
Route::middleware(['auth:sanctum', 'role:tenant'])
    ->prefix('tenant')
    ->group(base_path('routes/tenant.php'));
