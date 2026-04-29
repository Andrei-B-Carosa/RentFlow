<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Services\Tenant\UnitService;
use Illuminate\Http\JsonResponse;

class UnitController extends Controller
{
    public function index(UnitService $service):JsonResponse
    {
        return $service->find();
    }
}
