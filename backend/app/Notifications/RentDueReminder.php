<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class RentDueReminder extends Notification
{
    use Queueable;

    public function __construct(protected $payment) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'       => 'rent_due',
            'message'    => 'Your rent is due.',
            'amount'     => $this->payment->amount,
            'due_date'   => $this->payment->due_date,
            'breakdown'  => $this->payment->breakdown,
            'payment_id' => $this->payment->id,
        ];
    }
}
