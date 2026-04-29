<?php

namespace App\Models;

use App\Constants\LeaseStatus;
use App\Constants\UnitStatus;
use App\Models\BaseModel;

class Lease extends BaseModel
{
    protected $fillable = [
        'unit_id',
        'tenant_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'deposit_amount',
        'status',
        'document_path',
        'landlord_notes'
    ];

    protected $casts = [
        'status' => LeaseStatus::class,
        'start_date'=>'date',
        'end_date'=>'date',
        'monthly_rent'   => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function($model){
            if(empty($model->status))
                {
                    $model->status = LeaseStatus::ACTIVE->value;
                }
        });

        static::created(function($model){
            if($model->status === LeaseStatus::ACTIVE){
                $model->unit()->update([
                    'status' => UnitStatus::OCCUPIED->value
                ]);
            }
        });

        static::updated(function($model){
            if($model->wasChanged('status')){
                if($model->status === LeaseStatus::EXPIRED || $model->status === LeaseStatus::TERMINATED){
                    $model->unit()->update([
                        'status' => UnitStatus::VACANT->value
                    ]);
                }
            }
        });

    }

    public function scopeActive($q)
    {
        return $q->where('status', LeaseStatus::ACTIVE->value);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class,'unit_id', 'id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class,'tenant_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class,'lease_id');
    }
}
