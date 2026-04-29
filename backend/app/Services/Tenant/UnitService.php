<?php

namespace App\Services\Tenant;

use App\Models\Lease;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Throwable;

class UnitService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function find()
    {
        try{
            $data = Lease::with('unit.property')
            ->where('tenant_id',Auth::id())
            ->active()
            ->firstOrFail();
            return $this->ok('Success!', $data->unit);
        } catch(Throwable $t) {
            return $this->error('Failed to find unit', $t->getMessage());
        }
    }
}
