<?php

namespace App\Models;

use App\Models\BaseModel;

class CalendarEvent extends BaseModel
{
    protected $fillable = [
        'landlord_id',
        'property_id',
        'unit_id',
        'title',
        'type',
        'notes',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class,'property_id', 'id');
    }

    public function landlord()
    {
        return $this->belongsTo(User::class,'landlord_id', 'id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class,'unit_id', 'id');
    }
}

