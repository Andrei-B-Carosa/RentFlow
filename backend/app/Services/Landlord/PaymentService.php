<?php

namespace App\Services\Landlord;

use App\Constants\PaymentStatus;
use App\Constants\PaymentType;
use App\Helpers\DTServerSide;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Notifications\PaymentConfirmed;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

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
                $q->with(['tenant','unit.property'])->active();
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
            'id'     => 'id',
            'amount' => 'amount',
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function create($rq)
    {
        try{
            DB::beginTransaction();

            $exists = Payment::where('lease_id', $rq->lease_id)
            ->where('type', PaymentType::DEPOSIT->value)
            ->whereHas('lease.unit.property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })
            ->exists();

            if ($exists) {
                return $this->error('Deposit payment for this lease already exists', null, 422);
            }

            $data = Payment::create([
                'lease_id'  => $rq->lease_id,
                'amount'    => $rq->amount,
                'type'      => $rq->type,
                'paid_at'   => $rq->paid_at,
                'notes'     => $rq->notes,
                'recorded_by' => Auth::id(),
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
            $data = Payment::with([
                'lease'=>function($q){
                    $q->with(['tenant','unit.property'])->active();
                },
                'transactions',
            ])
            ->whereHas('lease.unit.property',function($q){
                $q->where('landlord_id',Auth::id());
            })
            ->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Exception $e) {
            return $this->error('Payment not found!',$e->getMessage());
        }
    }

    public function update($rq, string $id)
    {
        try {
            DB::beginTransaction();

            $payment = Payment::whereHas('lease.unit.property', function ($q) {
                $q->where('landlord_id', Auth::id());
            })->findOrFail($id);

            if ($payment->status === PaymentStatus::PAID->value) {
                return $this->error('Payment is already fully paid.', null, 422);
            }

            $newTotalPaid = (int)$payment->amount_paid + (int) $rq->amount_paid;
            $totalDue = (int) $payment->amount + (int) $payment->late_fee;

            if($newTotalPaid > $payment->amount){
                return $this->error('Amount paid cannot exceed the remaining payment.', null, 422);
            }

            if ($newTotalPaid <= 0) {
                $status = PaymentStatus::PENDING->value;
            } elseif ($newTotalPaid < $totalDue) {
                $status = PaymentStatus::PARTIAL->value;
            } elseif ($newTotalPaid == $totalDue) {
                $status = PaymentStatus::PAID->value;
            }

            // record the transaction
            PaymentTransaction::create([
                'payment_id'      => $payment->id,
                'recorded_by'     => Auth::id(),
                'status'          => $status,
                'type'            => $payment->type,
                'amount_paid'     => $rq->amount_paid ?? 0,
                'late_fee'        => $rq->late_fee ?? 0,
                'paid_at'         => $rq->paid_at,
                'landlord_notes'  => $rq->landlord_notes,
            ]);

            $payment->update([
                'amount_paid'  => $newTotalPaid,
                'status'       => $status,
                'paid_at'      => $status === PaymentStatus::PAID->value
                                    ? $rq->paid_at
                                    : null,
                'recorded_by'  => Auth::id()
            ]);

            DB::commit();
            $payment->lease->tenant->notify(new PaymentConfirmed($payment));
            return $this->ok('Payment recorded successfully!', $payment->fresh());
        } catch (Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to record payment.', $t->getMessage());
        }
    }
}
