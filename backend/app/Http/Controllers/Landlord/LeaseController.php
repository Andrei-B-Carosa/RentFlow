<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StoreLeaseRequest;
use App\Http\Requests\Landlord\UpdateLeaseRequest;
use App\Services\Landlord\LeaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaseController extends Controller
{
    public function index(Request $rq, LeaseService $service):JsonResponse
    {
        return $service->table($rq);
    }

    public function store(StoreLeaseRequest $rq,LeaseService $service):JsonResponse
    {
        return $service->create($rq);
    }

    public function show(LeaseService $service,string $id):JsonResponse
    {
        return $service->find($id);
    }

    public function update(UpdateLeaseRequest $rq,LeaseService $service, string $id):JsonResponse
    {
        return $service->update($rq,$id);
    }

    public function terminate(Request $rq,LeaseService $service,string $id):JsonResponse
    {
        return $service->terminate($rq,$id);
    }
}
