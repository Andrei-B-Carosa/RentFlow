<?php

namespace App\Services\Landlord;

use App\Constants\Role;
use App\Helpers\DTServerSide;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;

class TenantService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function table($rq)
    {
        $data = User::with(['leases' => function ($q) {
            $q->with('unit.property');
        }])
        ->active()
        ->where('role',Role::TENANT->value)
        ->whereHas('leases.unit.property', function ($q) {
            $q->where('landlord_id', Auth::id());
        });
        $searchableColumn = [
            'name',
            'email'
        ];
        $sortableColumn = [
            'id' => 'id'
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function find(string $id)
    {
        try{
            $data = User::with([
                'leases' => function ($q) {
                    $q->with([
                        'unit.property',
                        'payments' => function ($q) {
                            $q->orderBy('due_date', 'desc');
                        }
                    ]);
                },
                'maintenanceRequests' => function ($q) {
                    $q->orderBy('created_at', 'desc');
                }
            ])
            ->active()
            ->where('role',Role::TENANT->value)
            ->whereHas('leases.unit.property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })
            ->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Exception $e) {
            return $this->error('Failed to find tenant!',$e->getMessage(),404);
        }

    }
}
