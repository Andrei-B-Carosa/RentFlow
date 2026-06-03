<?php

namespace App\Services\Tenant;

use App\Helpers\DTServerSide;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Notifications\NewMaintenanceRequest;
use App\Traits\ApiResponseTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $data = MaintenanceRequest::with('unit')->where('tenant_id',Auth::id());
        $searchableColumn = [
            'title',
            'description',
            'landlord_notes'
        ];
        $sortableColumn = [
            'id' => 'id',
            'resolved_at' => 'resolved_at'
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }


    public function create($rq)
    {
        try{
            DB::beginTransaction();
            $lease = Lease::with('unit')
            ->where('tenant_id',Auth::id())
            ->active()
            ->firstOrFail();
            $unit_id = $lease->unit->id;
            //Early check for duplicate
            $duplicate = MaintenanceRequest::where('tenant_id', Auth::id())
            ->where('unit_id', $unit_id)
            ->where('title', $rq->title)
            ->whereDate('created_at', Carbon::today())
            ->exists();
            if ($duplicate) {
                return $this->error( 'You already submitted a similar request today.',null,422);
            }
            $photoPath=[];
            if($rq->hasFile('photos')){
                foreach($rq->file('photos') as $photo){
                    $photoPath[]=$photo->store('maintenance/photos','public');
                }
            }
            $data = MaintenanceRequest::create([
                'unit_id' =>$unit_id,
                'tenant_id' =>Auth::id(),
                'title' =>$rq->title,
                'description'=>$rq->description,
                'photos'=>$photoPath,
                'priority'=>$rq->priority,
            ]);
            DB::commit();
            $data->load('unit.property.landlord');
            $data->unit->property->landlord->notify(new NewMaintenanceRequest($data));
            return $this->ok('Maintenance request created successfully!',$data,201);
        } catch(Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to create maintenance request',$t->getMessage());
        }
    }


    public function find(string $id)
    {
         try{
            $data = MaintenanceRequest::with(['unit','tenant'])->where('tenant_id',Auth::id())->findOrFail($id);
            return $this->ok('Success!',$data);
         } catch(Throwable $t) {
            return $this->error('Failed to find maintenance request',$t->getMessage(),404);
        }
    }
}
