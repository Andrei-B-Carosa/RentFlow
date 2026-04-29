<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Services\Landlord\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(DashboardService $service): JsonResponse
    {
        return $service->overview();
    }

    public function revenue(Request $rq, DashboardService $service): JsonResponse
    {
        return $service->revenue($rq);
    }
}
