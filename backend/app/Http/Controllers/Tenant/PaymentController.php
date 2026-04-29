<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Services\Tenant\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $rq, PaymentService $service):JsonResponse
    {
        return $service->table($rq);
    }


    public function current(PaymentService $service):JsonResponse
    {
        return $service->findCurrent();
    }


    public function receipt(PaymentService $service, string $id):JsonResponse
    {
        return $service->findReceipt($id);
    }
}
