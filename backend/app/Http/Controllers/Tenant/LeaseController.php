<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Services\Tenant\LeaseService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LeaseController extends Controller
{
    public function index(LeaseService $service):JsonResponse
    {
        return $service->find();
    }

    public function download(LeaseService $service):BinaryFileResponse
    {
        return $service->downloadLease();
    }

}
