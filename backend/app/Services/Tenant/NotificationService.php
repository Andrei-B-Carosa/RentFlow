<?php

namespace App\Services\Tenant;

use App\Helpers\DTServerSide;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Throwable;

class NotificationService
{
    use ApiResponseTrait;

    public function __construct() {}

    public function table($rq)
    {
        $data = Auth::user()->notifications();
        $searchable = [];
        $sortable = [
            'created_at' => 'created_at',
        ];
        return (new DTServerSide($rq, $data, $searchable, $sortable))->renderTable();
    }

    public function markRead(string $id)
    {
        try {
            $notification = Auth::user()
                ->notifications()
                ->findOrFail($id);

            $notification->markAsRead();

            return $this->ok('Notification marked as read.');

        } catch (Throwable $t) {
            return $this->error('Failed to mark notification as read.', $t->getMessage(), 404);
        }
    }

    public function markAllRead()
    {
        try {
            Auth::user()->unreadNotifications()->update(['read_at' => now()]);

            return $this->ok('All notifications marked as read.');

        } catch (Throwable $t) {
            return $this->error('Failed to mark all notifications as read.', $t->getMessage());
        }
    }
}
