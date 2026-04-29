<?php

namespace App\Services\Landlord;

use App\Constants\LeaseStatus;
use App\Helpers\DTServerSide;
use App\Models\Lease;
use App\Traits\ApiResponseTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LeaseService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function table($rq)
    {
        $data = Lease::with(['unit.property', 'tenant'])
        ->whereHas('unit.property',function($q){
            $q->where('landlord_id',Auth::id());
        });
        $searchableColumn = [
            'tenant.name',
            'unit.unit_number'
        ];
        $sortableColumn = [
            'id' => 'id',
            'start_date' => 'start_date',
            'end_date'   => 'end_date',
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function create($rq)
    {
        $documentPath = null;
        try {
            DB::beginTransaction();
            $hasActiveLease = Lease::where('unit_id', $rq->unit_id)
            ->active()
            ->whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })
            ->exists();
            if ($hasActiveLease) {
                return $this->error('Unit already has an active lease.', null, 422);
            }
            if ($rq->hasFile('document')) {
                $documentPath = $rq->file('document')->store('lease/documents', 'public');
            }
            $data = Lease::create([
                'unit_id' => $rq->unit_id,
                'tenant_id' => $rq->tenant_id,
                'start_date' => $rq->start_date,
                'end_date' => $rq->end_date,
                'monthly_rent' => $rq->monthly_rent,
                'deposit_amount' => $rq->deposit_amount,
                'document_path' => $documentPath,
                'landlord_notes' =>$rq->landlord_notes,
            ]);
            DB::commit();
            return $this->ok('Lease create successfully!',$data,201);
        } catch (Throwable $t) {
            DB::rollBack();
            if ($documentPath) { Storage::disk('public')->delete($documentPath); }
            return $this->error('Failed to create lease', $t->getMessage());
        }
    }

    public function find(string $id)
    {
        try {
            $data = Lease::with(['unit.property', 'tenant', 'payments'])
            ->whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })
            ->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch (Throwable $t) {
            return $this->error('Failed to find lease', $t->getMessage());
        }
    }

    public function update($rq, string $id)
    {
        $documentPath = null;
        try {
            DB::beginTransaction();
            $data = Lease::whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })->findOrFail($id);
            if($data->status === LeaseStatus::TERMINATED) {
                return $this->error('Cannot update a terminated lease.', null, 422);
            }
            if($data->status === LeaseStatus::EXPIRED) {
                return $this->error('Cannot update a expired lease.', null, 422);
            }
            if ($rq->hasFile('document')) {
                if ($data->document_path) {
                    Storage::disk('public')->delete($data->document_path);
                }
                $documentPath = $rq->file('document')->store('lease/documents', 'public');
            }
            $data->update([
                'start_date'     => $rq->start_date     ?? $data->start_date,
                'end_date'       => $rq->end_date       ?? $data->end_date,
                'monthly_rent'   => $rq->monthly_rent   ?? $data->monthly_rent,
                'deposit_amount' => $rq->deposit_amount ?? $data->deposit_amount,
                'document_path'  => $documentPath       ?? $data->document_path,
                'landlord_notes' => $rq->landlord_notes ?? $data->landlord_notes,
            ]);
            DB::commit();
            return $this->ok('Lease updated successfully',$data->fresh());
        } catch (Throwable $t) {
            DB::rollBack();
            if ($documentPath) { Storage::disk('public')->delete($documentPath); }
            return $this->error('Failed to find lease', $t->getMessage());
        }
    }

    public function terminate($rq,string $id)
    {
        try {
            DB::beginTransaction();
            $data = Lease::whereHas('unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })->findOrFail($id);
            if($data->status === LeaseStatus::TERMINATED) {
                return $this->error('Lease is already terminated.', null, 422);
            }
            if($data->status === LeaseStatus::EXPIRED) {
                return $this->error('Cannot terminate a expired lease.', null, 422);
            }
            $data->update([
                'status' => LeaseStatus::TERMINATED->value,
                'landlord_notes' =>$rq->landlord_notes,
                'end_date' =>Carbon::now()->lt($data->end_date) ? Carbon::now() : $data->end_date,
            ]);
            DB::commit();
            return $this->ok('Lease terminated successfully');
        } catch (Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to terminate lease', $t->getMessage());
        }
    }
}
