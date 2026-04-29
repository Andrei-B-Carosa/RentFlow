<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreMaintenanceRequest;
use App\Services\Tenant\MaintenanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $rq, MaintenanceService $service):JsonResponse
    {
        return $service->table($rq);
    }

    public function store(StoreMaintenanceRequest $rq, MaintenanceService $service):JsonResponse
    {
        return $service->create($rq);

    }

    public function show(MaintenanceService $service, string $id):JsonResponse
    {
        return $service->find($id);
    }
}
