<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Services\Tenant\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $rq, NotificationService $service): JsonResponse
    {
        return $service->table($rq);
    }

    public function markRead(NotificationService $service, string $id): JsonResponse
    {
        return $service->markRead($id);
    }

    public function markAllRead(NotificationService $service): JsonResponse
    {
        return $service->markAllRead();
    }
}
