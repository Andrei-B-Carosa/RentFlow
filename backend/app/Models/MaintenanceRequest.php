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

    protected $casts = [
        'status'=>MaintenanceStatus::class,
        'priority'=>PriorityStatus::class,
        'photos'=>'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function($model){
            if(empty($model->status)){
                $model->status = MaintenanceStatus::OPEN->value;
            }
        });
        // static::updated(function($model){
        //     if($model->wasChanged('status')){
        //         //check if OPEN and new status is IN_PROGRESS
        //         if($model->getOriginal('status') === MaintenanceStatus::OPEN->value){
        //             if($model->status === MaintenanceStatus::IN_PROGRESS->value){
        //                 $model->unit()->update(['status' => UnitStatus::UNDER_MAINTENANCE->value]);
        //             }
        //         }
        //         //check if RESOLVED and old status is IN_PROGRESS
        //         if($model->status === MaintenanceStatus::RESOLVED->value){
        //             if($model->getOriginal('status') === MaintenanceStatus::IN_PROGRESS->value){
        //                 $model->unit()->update(['status' => UnitStatus::OCCUPIED->value]);
        //             }
        //         }
        //     }
        // });
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
