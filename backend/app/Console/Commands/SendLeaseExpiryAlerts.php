<?php

namespace App\Console\Commands;

use App\Models\Lease;
use App\Notifications\LeaseExpiryAlert;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:send-lease-expiry-alerts')]
#[Description('Notify tenants of leases expiring in 30 days')]
class SendLeaseExpiryAlerts extends Command
{

    public function handle()
    {
        Lease::with('tenant')
        ->active()
        ->whereDate('end_date',Carbon:now()->addDays(30))->each(function($q){
            $q->tenant->notify(new LeaseExpiryAlert($q));
        });
        $this->info('Send lease expiry alert');
    }
}
