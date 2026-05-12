<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\UpdateMaintenanceStatusRequest as UpdateStatusRequest;
use App\Services\Landlord\MaintenanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $rq,MaintenanceService $service):JsonResponse
    {
        return $service->table($rq);
    }

    public function show(MaintenanceService $service,string $id):JsonResponse
    {
        return $service->find($id);
    }

    public function update(UpdateStatusRequest $rq,MaintenanceService $service,string $id):JsonResponse
    {
        return $service->update($rq,$id);
    }

    public function destroy(MaintenanceService $service,string $id):JsonResponse
    {
        return $service->delete($id);
    }
}
