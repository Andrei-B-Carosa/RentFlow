<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LateFeeCharged extends Notification
{
    use Queueable;

    public function __construct(protected $payment)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'       => 'late_fee',
            'message'    => 'Your payment is overdue. A late fee has been applied.',
            'amount'     => $this->payment->amount,
            'late_fee'   => $this->payment->late_fee,
            'due_date'   => $this->payment->due_date,
            'payment_id' => $this->payment->id,
        ];
    }
}
