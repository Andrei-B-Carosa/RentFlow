<?php

namespace App\Helpers;
use App\Constants\LeaseStatus;
use App\Constants\Role;
use App\Constants\UnitStatus;
use App\Models\Lease;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SelectFetcher
{
    use ApiResponseTrait;

    public function __construct() {}

    public function getProperties(Request $rq)
    {
        $data = Property::where('landlord_id', Auth::id())
            ->active()
            ->has('units')
            ->withCount(['units'=>function($q){
                $q->where('status',UnitStatus::VACANT->value);
            }])
            ->get(['id', 'name', 'address', 'city', 'is_active']);

        return $this->ok('Success', $data);
    }

    public function getUnits(Request $rq, string $id)
    {
        // property_id is required
        if (!$id) {
            return $this->error('Property ID is required.', null, 422);
        }

        // verify property belongs to landlord
        $data = Unit::where('property_id', $id)
            ->whereHas('property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })
            ->where('status', UnitStatus::VACANT->value) // only vacant units
            ->with('property:id,name')
            ->get(['id', 'unit_number', 'rent_price', 'status', 'property_id', 'floor_area']);

        return $this->ok('Success', $data);
    }

    public function getTenants(Request $rq)
    {
        $search = $rq->query('search');
        $query = User::where('role', Role::TENANT->value)->active();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        return $this->ok('Success', $query->get(['id', 'name', 'email']));
    }

    public function getLeases(Request $rq)
    {
        $data = Lease::whereHas('unit.property', function ($q) {
            $q->where('landlord_id', Auth::id());
        })
        ->active()
        ->with([
            'unit:id,unit_number',
            'tenant:id,name',
        ])
        ->get(['id', 'unit_id', 'tenant_id', 'monthly_rent']);

        return $this->ok('Success', $data);
    }
}
