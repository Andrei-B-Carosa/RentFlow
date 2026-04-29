<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMaintenanceRequest extends Notification
{
    use Queueable;

    public function __construct(protected $maintenanceRequest)
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
            'type'       => 'new_maintenance',
            'message'    => 'A new maintenance request has been submitted.',
            'title'      => $this->maintenanceRequest->title,
            'priority'   => $this->maintenanceRequest->priority,
            'unit'       => $this->maintenanceRequest->unit->unit_number,
            'request_id' => $this->maintenanceRequest->id,
        ];
    }
}
