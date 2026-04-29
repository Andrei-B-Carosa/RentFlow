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

    public function lease()
    {
        return $this->hasOne(Lease::class,'unit_id');
    }
}
