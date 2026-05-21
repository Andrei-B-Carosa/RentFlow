<?php

namespace App\Models;

use App\Constants\PaymentStatus;
use App\Constants\PaymentType;
use App\Models\BaseModel;

class Payment extends BaseModel
{
    protected $fillable = [
        'lease_id',
        'amount',
        'amount_paid',
        'late_fee',
        'due_date',
        'paid_at',
        'status',
        'notes',
        'breakdown',
        'type',
        'recorded_by',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function($model){
            if($model->type == PaymentType::EXTRA_CHARGE || $model->type == PaymentType::DEPOSIT){
                $model->status = PaymentStatus::PAID->value;
            }
        });
    }

    protected $casts = [
        'status'=> PaymentStatus::class,
        'paid_at' => 'datetime',
        'due_date' => 'date',
        'amount'   => 'decimal:2',
        'late_fee' => 'decimal:2',
        'breakdown' => 'array',
        'type' => PaymentType::class
    ];

    protected $appends = [
        'formatted_date',
        'formatted_paid_at',
        'formatted_due_date',
        'total_paid',
        'remaining_balance'
    ];

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at?$this->created_at->format('F d, Y · h:i A'):'';
    }

    public function getFormattedDueDateAttribute(): string
    {
        return $this->due_date?$this->due_date->format('F d, Y'):'';
    }

    public function getFormattedPaidAtAttribute(): string
    {
        return $this->paid_at?$this->paid_at->format('F d, Y'):'';
    }

    public function scopePaid($q)
    {
        return $q->where('status',PaymentStatus::PAID->value);
    }

    public function lease()
    {
        return $this->belongsTo(Lease::class,'lease_id', 'id');
    }

    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    // helper — total amount paid across all transactions
    public function getTotalPaidAttribute(): float
    {
        return (float) $this->transactions()->sum('amount_paid');
    }

    // helper — remaining balance
    public function getRemainingBalanceAttribute(): float
    {
        return (float) $this->amount - $this->total_paid;
    }

}
