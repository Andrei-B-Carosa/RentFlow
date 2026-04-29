<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StoreUnitRequest;
use App\Http\Requests\Landlord\UpdateUnitRequest;
use App\Services\Landlord\UnitService;
use Illuminate\Http\JsonResponse;

class UnitController extends Controller
{
    public function index(UnitService $service,string $id):JsonResponse
    {
        return $service->list($id);
    }

    public function store(StoreUnitRequest $rq, UnitService $service):JsonResponse
    {
        return $service->create($rq);
    }

    public function show(string $id,UnitService $service):JsonResponse
    {
        return $service->find($id);
    }

    public function update(UpdateUnitRequest $rq,UnitService $service, string $id):JsonResponse
    {
        return $service->update($id,$rq);
    }

    public function destroy(UnitService $service,string $id):JsonResponse
    {
        return $service->delete($id);
    }
}
