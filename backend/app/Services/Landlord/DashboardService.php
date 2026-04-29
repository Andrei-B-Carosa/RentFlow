<?php

namespace App\Services\Landlord;

use App\Constants\MaintenanceStatus;
use App\Constants\PaymentStatus;
use App\Constants\UnitStatus;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Unit;
use App\Traits\ApiResponseTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Throwable;

class DashboardService
{
    use ApiResponseTrait;

    public function __construct() {}

    public function overview()
    {
        try {
            $landlordId = Auth::id();
            $today      = Carbon::now();

            // property and unit counts
            $totalProperties = Property::where('landlord_id', $landlordId)->count();

            $unitQuery = Unit::whereHas('property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            );

            $totalUnits           = (clone $unitQuery)->count();
            $occupiedUnits        = (clone $unitQuery)->where('status', UnitStatus::OCCUPIED->value)->count();
            $vacantUnits          = (clone $unitQuery)->where('status', UnitStatus::VACANT->value)->count();
            $underMaintenanceUnits= (clone $unitQuery)->where('status', UnitStatus::UNDER_MAINTENANCE->value)->count();

            $occupancyRate = $totalUnits > 0
                ? round(($occupiedUnits / $totalUnits) * 100, 2)
                : 0;

            // tenant count
            $totalTenants = Lease::whereHas('unit.property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            )->active()->distinct('tenant_id')->count('tenant_id');

            // payment queries
            $paymentQuery = Payment::whereHas('lease.unit.property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            );

            $monthlyIncome = (clone $paymentQuery)
                ->where('status', PaymentStatus::PAID->value)
                ->whereYear('paid_at', $today->year)
                ->whereMonth('paid_at', $today->month)
                ->sum('amount');

            $overduePayments = (clone $paymentQuery)
                ->where('status', PaymentStatus::LATE->value)
                ->count();

            $overdueAmount = (clone $paymentQuery)
                ->where('status', PaymentStatus::LATE->value)
                ->sum('amount');

            // pending maintenance
            $pendingMaintenance = MaintenanceRequest::whereHas('unit.property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            )->where('status', '!=', MaintenanceStatus::RESOLVED->value)->count();

            // expiring leases within 30 days
            $expiringLeases = Lease::whereHas('unit.property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            )
            ->active()
            ->whereDate('end_date', '<=', $today->copy()->addDays(30))
            ->count();

            return $this->ok('Success!', [
                'total_properties'        => $totalProperties,
                'total_units'             => $totalUnits,
                'occupied_units'          => $occupiedUnits,
                'vacant_units'            => $vacantUnits,
                'under_maintenance_units' => $underMaintenanceUnits,
                'occupancy_rate'          => $occupancyRate,
                'total_tenants'           => $totalTenants,
                'monthly_income'          => $monthlyIncome,
                'overdue_payments'        => $overduePayments,
                'overdue_amount'          => $overdueAmount,
                'pending_maintenance'     => $pendingMaintenance,
                'expiring_leases'         => $expiringLeases,
            ]);

        } catch (Throwable $t) {
            return $this->error('Failed to load dashboard.', $t->getMessage());
        }
    }

    public function revenue($rq)
    {
        try {
            $landlordId = Auth::id();
            $year       = $rq->input('year', Carbon::now()->year);
            $month      = $rq->input('month');
            $unitId     = $rq->input('unit_id');

            $query = Payment::whereHas('lease.unit.property', fn($q) =>
                $q->where('landlord_id', $landlordId)
            )->whereYear('due_date', $year);

            // optional filters
            if ($month) {
                $query->whereMonth('due_date', $month);
            }

            if ($unitId) {
                $query->whereHas('lease.unit', fn($q) =>
                    $q->where('id', $unitId)
                );
            }

            // summary totals
            $totalCollected   = (clone $query)->where('status', PaymentStatus::PAID->value)->sum('amount');
            $totalLateFees    = (clone $query)->sum('late_fee');
            $totalOutstanding = (clone $query)->whereIn('status', [
                PaymentStatus::PENDING->value,
                PaymentStatus::LATE->value,
                PaymentStatus::PARTIAL->value,
            ])->sum('amount');
            $totalExpected    = $totalCollected + $totalOutstanding;

            // monthly breakdown
            $monthlyBreakdown = [];

            $months = $month ? [$month] : range(1, 12);

            foreach ($months as $m) {
                $monthQuery = (clone $query)->whereMonth('due_date', $m);

                $expected    = (clone $monthQuery)->sum('amount');
                $collected   = (clone $monthQuery)->where('status', PaymentStatus::PAID->value)->sum('amount');
                $lateFees    = (clone $monthQuery)->sum('late_fee');
                $outstanding = (clone $monthQuery)->whereIn('status', [
                    PaymentStatus::PENDING->value,
                    PaymentStatus::LATE->value,
                    PaymentStatus::PARTIAL->value,
                ])->sum('amount');

                // skip months with no data
                if ($expected == 0) continue;

                $monthlyBreakdown[] = [
                    'month'       => Carbon::create()->month($m)->format('F'),
                    'expected'    => $expected,
                    'collected'   => $collected,
                    'late_fees'   => $lateFees,
                    'outstanding' => $outstanding,
                ];
            }

            return $this->ok('Success!', [
                'filters' => [
                    'year'    => $year,
                    'month'   => $month,
                    'unit_id' => $unitId,
                ],
                'summary' => [
                    'total_collected'   => $totalCollected,
                    'total_late_fees'   => $totalLateFees,
                    'total_outstanding' => $totalOutstanding,
                    'total_expected'    => $totalExpected,
                ],
                'monthly_breakdown' => $monthlyBreakdown,
            ]);

        } catch (Throwable $t) {
            return $this->error('Failed to load revenue.', $t->getMessage());
        }
    }
}
