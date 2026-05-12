<?php

namespace App\Models;

use App\Constants\MaintenanceStatus;
use App\Constants\PriorityStatus;
use App\Constants\UnitStatus;
use App\Models\BaseModel;

class MaintenanceRequest extends BaseModel
{
    protected $fillable = [
        'unit_id',
        'tenant_id',
        'title',
        'description',
        'photos',
        'priority',
        'status',
        'landlord_notes',
        'resolved_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function($model){
            if(empty($model->status)){
                $model->status = MaintenanceStatus::OPEN->value;
            }
        });
    }

    protected $casts = [
        'status'=>MaintenanceStatus::class,
        'priority'=>PriorityStatus::class,
        'photos'=>'array',
        'resolved_at'=>'date',
    ];

    protected $appends = [
        'formatted_date',
        'formatted_resolved_at'
    ];

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at?$this->created_at->format('F d, Y'):'';
        // output: April 22, 2026 · 10:30 AM
    }

    public function getFormattedResolvedAtAttribute(): string
    {
        return $this->resolved_at?$this->resolved_at->format('F d, Y'):'';
        // output: April 22, 2026 · 10:30 AM
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class,'unit_id', 'id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class,'tenant_id', 'id');
    }
}
