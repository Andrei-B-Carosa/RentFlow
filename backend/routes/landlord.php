<?php

use App\Http\Controllers\Landlord\CalendarController;
use App\Http\Controllers\Landlord\DashboardController;
use App\Http\Controllers\Landlord\LeaseController;
use App\Http\Controllers\Landlord\MaintenanceController;
use App\Http\Controllers\Landlord\PaymentController;
use App\Http\Controllers\Landlord\PropertyController;
use App\Http\Controllers\Landlord\TenantController;
use App\Http\Controllers\Landlord\UnitController;
use Illuminate\Support\Facades\Route;


Route::prefix('dashboard')->controller(DashboardController::class)->group(function(){
    Route::get('/','index');
    Route::get('/revenue','revenue');
});

Route::prefix('properties')->controller(PropertyController::class)->group(function(){
    Route::get('/','index');
    Route::post('/','store');
    Route::get('/{id}','show');
    Route::put('/{id}','update');
    Route::delete('/{id}','destroy');
});

Route::controller(UnitController::class)->group(function(){
    Route::get('properties/{id}/units','index');
    Route::post('properties/{id}/units','store');
    Route::get('units/{id}','show');
    Route::put('units/{id}','update');
    Route::delete('units/{id}','destroy');
});

Route::prefix('tenants')->controller(TenantController::class)->group(function(){
    Route::get('/','index');
    Route::get('/{id}','show');
});

Route::prefix('payments')->controller(PaymentController::class)->group(function(){
    Route::get('/','index');
    Route::post('/','store');
    Route::get('/{id}','show');
    Route::patch('/{id}/status','updateStatus');
});

Route::prefix('maintenance')->controller(MaintenanceController::class)->group(function(){
    Route::get('/','index');
    Route::get('/{id}','show');
    Route::patch('/{id}/status','updateStatus');
});

Route::prefix('leases')->controller(LeaseController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::patch('/{id}/terminate', 'terminate');
});

Route::controller('calendar')->controller(CalendarController::class)->group(function(){
    Route::get('/','index');
    Route::post('/','store');
    Route::put('/{id}','update');
    Route::delete('/{id}','destroy');
});
