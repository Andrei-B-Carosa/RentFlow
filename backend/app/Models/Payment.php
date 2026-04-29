<?php

namespace App\Models;

use App\Constants\PaymentStatus;
use App\Models\BaseModel;

class Payment extends BaseModel
{
    protected $fillable = [
        'lease_id',
        'amount',
        'late_fee',
        'due_date',
        'paid_at',
        'status',
        'notes',
        'breakdown',
    ];

    protected $casts = [
        'status'=> PaymentStatus::class,
        'paid_at' => 'datetime',
        'due_date' => 'date',
        'amount'   => 'decimal:2',
        'late_fee' => 'decimal:2',
        'breakdown' => 'array'
    ];

    public function scopePaid($q)
    {
        return $q->where('status',PaymentStatus::PAID->value);
    }

    public function lease()
    {
        return $this->belongsTo(Lease::class,'lease_id', 'id');
    }
}
