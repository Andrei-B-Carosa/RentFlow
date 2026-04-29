<?php

use App\Http\Controllers\Tenant\CalendarController;
use App\Http\Controllers\Tenant\LeaseController;
use App\Http\Controllers\Tenant\MaintenanceController;
use App\Http\Controllers\Tenant\NotificationController;
use App\Http\Controllers\Tenant\PaymentController;
use App\Http\Controllers\Tenant\UnitController;
use Illuminate\Support\Facades\Route;

Route::prefix('unit')->controller(UnitController::class)->group(function(){
    Route::get('/','index');
});

Route::prefix('lease')->controller(LeaseController::class)->group(function(){
    Route::get('/','index');
    Route::get('/download','download');
});

Route::prefix('payments')->controller(PaymentController::class)->group(function(){
    Route::get('/','index');
    Route::get('/current','current');
    Route::get('/{id}/receipt','receipt');
});

Route::prefix('maintenance')->controller(MaintenanceController::class)->group(function(){
    Route::get('/','index');
    Route::post('/','store');
    Route::get('/{id}','show');
});

Route::prefix('calendar')->controller(CalendarController::class)->group(function(){
    Route::get('/','index');
});

Route::prefix('notifications')->controller(NotificationController::class)->group(function(){
    Route::get('/','index');
    Route::patch('/{id}/read','markRead');
    Route::patch('/read-all','markReadAll');
});
