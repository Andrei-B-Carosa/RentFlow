<?php

namespace App\Services\Landlord;

use App\Models\Unit;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UnitService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function list(string $property_id)
    {
       try {
            $data = Unit::with(['leases' => function ($q) {
                $q->with('tenant')->active();
            }])
            ->where('property_id',$property_id)
            ->get();
            return $this->ok('Success!',$data);
       } catch (Exception $e) {
            return $this->error('Failed to get unit list!',$e->getMessage());
       }
    }

    public function create($rq)
    {
        try{
            DB::beginTransaction();
            $data = Unit::create([
                'property_id' => $rq->property_id,
                'unit_number' => $rq->unit_number,
                'rent_price' => $rq->rent_price,
                'status' => $rq->status,
                'bedrooms' => $rq->bedrooms,
                'bathrooms' => $rq->bathrooms,
                'floor_area' => $rq->floor_area,
            ]);
            DB::commit();
            return $this->ok('Unit created successfully!',$data,201);
        } catch(Exception $e){
            DB::rollBack();
            return $this->error('Failed to create unit!',$e->getMessage());
        }
    }

    public function find(string $id)
    {
        try{
            $data = Unit::with([
                'leases' => fn($q) => $q->with('tenant')->active(),
                'maintenanceRequests'
            ])->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Exception $e){
            return $this->error('Unit not found!',$e->getMessage(),404);
        }
    }

    public function update(string $id,$rq)
    {
        try{
            DB::beginTransaction();
            $data = Unit::whereHas('property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })->findOrFail($id);
            $data->update([
                'unit_number' =>$rq->unit_number,
                'rent_price' =>$rq->rent_price,
                'status' =>$rq->status,
                'bedrooms' =>$rq->bedrooms,
                'bathrooms' =>$rq->bathrooms,
                'floor_area' =>$rq->floor_area,
            ]);
            DB::commit();
            return $this->ok('Unit updated successfully!',$data);
        } catch(Exception $e) {
            DB::rollBack();
            return $this->error('Failed to update Unit!',$e->getMessage());
        }
    }

    public function delete(string $id)
    {
        try{
            DB::beginTransaction();
            $data = Unit::whereHas('property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })->findOrFail($id);
            $hasActiveLease = $data->leases()->active()->exists();
            if ($hasActiveLease) {
                return $this->error('Cannot delete a unit with an active tenant!',null,422);
            }
            $data->delete();
            DB::commit();
            return $this->ok('Unit deleted successfully!',$data);
        } catch(Exception $e) {
            DB::rollBack();
            return $this->error('Failed to delete unit!',$e->getMessage(),500);
        }
    }
}
