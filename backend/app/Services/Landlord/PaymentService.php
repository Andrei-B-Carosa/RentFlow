<?php

namespace App\Services\Landlord;

use App\Constants\PaymentStatus;
use App\Helpers\DTServerSide;
use App\Models\Payment;
use App\Notifications\PaymentConfirmed;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function table($rq)
    {
        $data = Payment::with([
            'lease'=>function($q){
                $q->with('tenant')->active();
            }
        ])
        ->whereHas('lease.unit.property',function($q){
            $q->where('landlord_id',Auth::id());
        });
        $searchableColumn = [
            'amount',
            'lease.tenant.name',
        ];
        $sortableColumn = [
            'amount' => 'amount'
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function create($rq)
    {
        try{
            DB::beginTransaction();
            $exists = Payment::where([['lease_id', $rq->lease_id],['due_date', $rq->due_date]])
            ->whereHas('unit.property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })
            ->exists();
            if ($exists) {
                return $this->error('Payment for this month already exists!', null, 422);
            }
            $data = Payment::create([
                'lease_id' => $rq->lease_id,
                'amount'  => $rq->amount,
                'late_fee' => $rq->late_fee,
                'due_date' => $rq->due_date,
                'paid_at' => $rq->paid_at,
                'status' => $rq->status,
                'notes' => $rq->notes,
            ]);
            DB::commit();
            return $this->ok('Payment sucess!',$data,201);
        } catch(Exception $e) {
            DB::rollBack();
            return $this->error('Payment failed!',$e->getMessage());
        }
    }

    public function find(string $id)
    {
        try{
            $data = Payment::whereHas('lease.unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Exception $e) {
            return $this->error('Payment not found!',$e->getMessage());
        }
    }

    public function updateStatus($rq, string $id)
    {
        try{
            DB::beginTransaction();
            $data = Payment::whereHas('lease.unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })->findOrFail($id);
            if($data->status === PaymentStatus::PAID){
                return $this->error('Payment for this month is already paid!',null,422);
            }
            $data->paid_at = $rq->status === PaymentStatus::PAID->value ? $rq->paid_at : null;
            $data->status = $rq->status;
            $data->save();
            DB::commit();
            if ($data->status === PaymentStatus::PAID->value) {
                $data->lease->tenant->notify(new PaymentConfirmed($data));
            }
            return $this->ok('Success!');
        } catch(Exception $e) {
            DB::rollBack();
            return $this->error('Failed to update payment status!',$e->getMessage());
        }

    }
}
