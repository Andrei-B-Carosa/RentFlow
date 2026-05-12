<?php

namespace Database\Seeders;

use App\Constants\PriorityStatus;
use App\Constants\Role;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaintenanceRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Lease::active()->each(function($q){
            MaintenanceRequest::create([
                'unit_id' => $q->unit_id,
                'tenant_id'=> $q->tenant_id,
                'title' => 'Leaking Pipes',
                'description' =>'There is a leaking water in the pipes and it worry us, please fix. thanks',
                'priority' =>PriorityStatus::HIGH->value,
            ]);
        });
    }
}
