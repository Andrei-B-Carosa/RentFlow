<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Services\Landlord\TenantService;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index(TenantService $service,Request $rq)
    {
        return $service->table($rq);
    }

    public function show(TenantService $service, string $id)
    {
        return $service->find($id);
    }
}
