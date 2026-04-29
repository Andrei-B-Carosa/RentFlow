<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:generate-monthly-payments')->weekly()->mondays()->at('00:00')->timezone(env('TIMEZONE'));
Schedule::command('app:send-lease-expiry-alerts')->dailyAt('01:00')->timeZone(env('TIMEZONE'));
