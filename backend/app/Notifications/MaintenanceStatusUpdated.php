<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MaintenanceStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(protected $maintenanceRequest)
    {

    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'       => 'maintenance_update',
            'message'    => 'Your maintenance request has been updated.',
            'status'     => $this->maintenanceRequest->status,
            'title'      => $this->maintenanceRequest->title,
            'notes'      => $this->maintenanceRequest->landlord_notes,
            'request_id' => $this->maintenanceRequest->id,
        ];
    }
}
