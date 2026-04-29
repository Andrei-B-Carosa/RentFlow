<?php
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function(){
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/forgot-password', 'forgotPassword');
    Route::post('/reset-password', 'resetPassword');

    Route::middleware('auth:sanctum')->group(function(){
        Route::get('/me','me');
        Route::post('/logout','logout');
        Route::post('/logout-all','logoutAll');
        Route::post('/refresh','refresh');
    });

});
