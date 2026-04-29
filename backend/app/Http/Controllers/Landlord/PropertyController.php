<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StorePropertyRequest;
use App\Http\Requests\Landlord\UpdatePropertyRequest;
use App\Services\Landlord\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $rq, PropertyService $service):JsonResponse
    {
        return $service->datatable($rq);
    }

    public function store(StorePropertyRequest $rq,PropertyService $service):JsonResponse
    {
        return $service->create($rq);
    }

    public function show(PropertyService $service,string $id):JsonResponse
    {
        return $service->find($id);
    }

    public function update(UpdatePropertyRequest $rq,PropertyService $service,string $id):JsonResponse
    {
        return $service->update($id,$rq);
    }

    public function destroy(PropertyService $service,string $id):JsonResponse
    {
        return $service->delete($id);
    }
}
