<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StorePaymentRequest;
use App\Services\Landlord\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $rq, PaymentService $service):JsonResponse
    {
        return $service->table($rq);
    }

    public function store(StorePaymentRequest $rq,PaymentService $service):JsonResponse
    {
        return $service->create($rq);
    }

    public function show(PaymentService $service, string $id):JsonResponse
    {
        return $service->find($id);
    }

    public function update(Request $rq,PaymentService $service, string $id):JsonResponse
    {
        return $service->update($rq,$id);
    }

}
