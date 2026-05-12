<?php

namespace App\Models;

use App\Constants\UnitStatus;
use App\Models\BaseModel;

class Unit extends BaseModel
{
    protected $fillable = [
        'property_id',
        'unit_number',
        'rent_price',
        'status',
        'bedrooms',
        'bathrooms',
        'floor_area',
    ];

    protected static function boot() {

        parent::boot();

        static::creating(function($model){
            if(empty($model->status)){
                $model->status = UnitStatus::VACANT->value;
            }
        });

    }

    protected $casts = [
        'status' => UnitStatus::class,
    ];

    public function property()
    {
        return $this->belongsTo(Property::class,'property_id', 'id');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class,'unit_id');
    }

    public function leases()
    {
        return $this->hasOne(Lease::class,'unit_id');
    }
}
