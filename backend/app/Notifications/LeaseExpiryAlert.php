<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeaseExpiryAlert extends Notification
{
    use Queueable;

    public function __construct(protected $lease)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'     => 'lease_expiry',
            'message'  => 'Your lease is expiring soon.',
            'end_date' => $this->lease->end_date,
            'days_left'=> Carbon::now()->diffInDays($this->lease->end_date),
            'lease_id' => $this->lease->id,
        ];
    }
}
