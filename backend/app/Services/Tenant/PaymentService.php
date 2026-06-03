<?php

namespace App\Services\Tenant;

use App\Constants\PaymentStatus;
use App\Helpers\DTServerSide;
use App\Models\Payment;
use App\Traits\ApiResponseTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
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
        $data = Payment::whereHas('lease',function($q){
            $q->where('tenant_id',Auth::id());
        });
        $searchableColumn = [
            'due_date',
            'paid_at',
            'notes'
        ];
        $sortableColumn = [
            'id'=>'id',
            'due_date'=>'due_date',
            'paid_at'=>'paid_at',
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function findCurrent()
    {
        try {
            $now =Carbon::now();
            $data = Payment::whereYear('due_date', $now->year)
            ->whereMonth('due_date', $now->month)
            ->whereHas('lease',function($q){
                $q->where('tenant_id', Auth::id())->active();
            })
            ->firstOrFail();
            return $this->ok('Success!',$data);
        } catch(Throwable $t) {
            return $this->error('Failed to find current month balance',$t->getMessage());
        }
    }

    public function findReceipt(string $id)
    {
        try {
            $data = Payment::with(['lease.unit.property','lease.tenant'])
                ->whereHas('lease', function ($q) {
                    $q->where('tenant_id', Auth::id());
                })
                ->findOrFail($id);

            // only allow receipt for paid payments
            if ($data->status !== PaymentStatus::PAID) {
                return $this->error('Receipt only available for paid payments.', null, 422);
            }

            return $this->ok('Success!', $data);

        } catch (Throwable $t) {
            return $this->error('Failed to get receipt.', $t->getMessage());
        }
    }
}
