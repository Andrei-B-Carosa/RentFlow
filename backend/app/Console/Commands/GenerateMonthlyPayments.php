<?php

namespace App\Console\Commands;

use App\Constants\PaymentType;
use App\Models\Lease;
use App\Models\Payment;
use App\Notifications\LateFeeCharged;
use App\Notifications\RentDueReminder;
use Carbon\Carbon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:generate-monthly-payments')]
#[Description('Generate monthly payments on 2nd week with carry-over logic')]
class GenerateMonthlyPayments extends Command
{
    public function handle()
    {
        $today = Carbon::now();
        if($today->day < 8 || $today->day >14){
            $this->info('Not 2nd week — skipping');
            return;
        }
        if(!$today->isMonday()){
            $this->info('Not Monday — skipping');
            return;
        }
        $previousMonth = $today->copy()->subMonth();
        Lease::with([
            'tenant',
            'payments' => function ($q) use ($previousMonth) {
                $q->whereYear('due_date', $previousMonth->year)
                ->whereMonth('due_date', $previousMonth->month);
            }
        ])->active()
        ->whereDoesntHave('payments', function ($q) use ($today) {
            $q->whereYear('due_date', $today->year)->whereMonth('due_date', $today->month);
        })->each(function($lease) use($today){

            $previousPayment = $lease->payments->first();

            // mark late first, then build breakdown
            $this->lateFeeCharged($previousPayment, $lease);
            if ($previousPayment) { $previousPayment->refresh(); }
            $breakdown = $this->buildBreakdown($lease, $previousPayment);

            // generate monthly payment and notify
            $this->rentDueReminder($lease,$today,$breakdown);

        });
    }

    private function buildBreakdown($lease, $previousPayment): array
    {
        $monthlyRent     = (float) $lease->monthly_rent;
        $previousBalance = 0;
        $previousLateFee = 0;

        if ($previousPayment) {
            if (in_array($previousPayment->status, ['LATE', 'PARTIAL'])) {
                // for PARTIAL — carry over the REMAINING balance not the full amount
                if ($previousPayment->status === 'PARTIAL') {
                    $amountPaid      = (float) ($previousPayment->amount_paid ?? 0);
                    $previousBalance = (float) $previousPayment->amount - $amountPaid;
                } else {
                    // LATE — carry over full amount
                    $previousBalance = (float) $previousPayment->amount;
                }
                $previousLateFee = (float) $previousPayment->late_fee;
            }
        }

        $total = $monthlyRent + $previousBalance + $previousLateFee;

        return [
            'monthly_rent'      => $monthlyRent,
            'previous_balance'  => $previousBalance,
            'previous_late_fee' => $previousLateFee,
            'total'             => $total,
        ];
    }

    private function lateFeeCharged($previousPayment,$lease)
    {
        if ($previousPayment && $previousPayment->status === 'PENDING') {
            $previousPayment->update([
                'status'   => 'LATE',
                'late_fee' => 500, // configurable later
            ]);
            $lease->tenant->notify(new LateFeeCharged($previousPayment));
        }
    }

    private function rentDueReminder($lease,$today,$breakdown)
    {
        // generate new payment
        $payment = Payment::create([
            'lease_id'  => $lease->id,
            'amount'    => $breakdown['total'],
            'late_fee'  => 0,
            'due_date'  => $today,
            'paid_at'   => null,
            'status'    => 'PENDING',
            'notes'     => 'Auto-generated monthly payment.',
            'breakdown' => $breakdown,
            'type'      => PaymentType::RENT->value,
        ]);

        // notify tenant
        $lease->tenant->notify(new RentDueReminder($payment));
    }
}
