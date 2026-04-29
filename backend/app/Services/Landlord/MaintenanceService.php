<?php

namespace App\Services\Landlord;

use App\Constants\MaintenanceStatus;
use App\Helpers\DTServerSide;
use App\Models\MaintenanceRequest;
use App\Notifications\MaintenanceStatusUpdated;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Throwable;

class MaintenanceService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function table($rq)
    {
        $data = MaintenanceRequest::with(['unit.property','tenant'])
        ->whereHas('unit.property',function($q){
            $q->where('landlord_id',Auth::id());
        });
        $searchableColumn = [
            'unit.unit_number',
            'tenant.name'
        ];
        $sortableColumn = [
            'id'=> 'id'
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function find(string $id)
    {
        try{
            $data = MaintenanceRequest::with(['unit'])
            ->whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })
            ->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Throwable $e) {
            return $this->error('Maintenance request not found',$e->getMessage(),404);
        }
    }

    public function updateStatus($rq,string $id)
    {
        try{
            $data = MaintenanceRequest::with('tenant')->whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })->findOrFail($id);
            if ($data->status === MaintenanceStatus::RESOLVED) {
                return $this->error('Cannot update a resolved request.', null, 422);
            }
            $newStatus = MaintenanceStatus::from($rq->status);
            $data->update([
                'status'          => $newStatus,
                'landlord_notes'  => $rq->landlord_notes,
                'resolved_at'     => $newStatus === MaintenanceStatus::RESOLVED ? now() : null,
            ]);
            $data->tenant->notify(new MaintenanceStatusUpdated($data));
            return $this->ok('Success!',$data->fresh());
        } catch(Throwable $e) {
            return $this->error('Failed to update maintenance request!',$e->getMessage());
        }
    }
}

