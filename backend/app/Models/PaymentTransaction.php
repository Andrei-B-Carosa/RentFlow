<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentTransaction extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'payment_id',
        'recorded_by',
        'status',
        'type',
        'amount_paid',
        'late_fee',
        'paid_at',
        'landlord_notes',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'late_fee'    => 'decimal:2',
        'paid_at'     => 'date',
    ];

    protected $appends = [
        'formatted_date',
        'formatted_paid_at',
    ];

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at?$this->created_at->format('F d, Y · h:i A'):'';
    }

    public function getFormattedPaidAtAttribute(): string
    {
        return $this->paid_at?$this->paid_at->format('F d, Y'):'';
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
