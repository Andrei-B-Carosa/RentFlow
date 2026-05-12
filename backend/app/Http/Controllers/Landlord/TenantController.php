<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StoreTenantRequest;
use App\Http\Requests\Landlord\UpateTenantRequest;
use App\Services\Landlord\TenantService;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index(Request $rq,TenantService $service)
    {
        return $service->table($rq);
    }

    public function show(TenantService $service, string $id)
    {
        return $service->find($id);
    }

    public function store(StoreTenantRequest $rq,TenantService $service)
    {
        return $service->create($rq);
    }

    public function update(UpateTenantRequest $rq,TenantService $service, string $id)
    {
        return $service->update($rq,$id);
    }

    public function destroy(TenantService $service,string $id)
    {
        return $service->delete($id);
    }
}
