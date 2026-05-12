<?php

namespace App\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends BaseModel
{
    protected $fillable = [
        'landlord_id',
        'name',
        'address',
        'city',
        'description',
        'photos',
        'is_active',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'formatted_date'
    ];

    protected $hidden =[
        'landlord_id'
    ];

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at?$this->created_at->format('F d, Y · h:i A'):'';
        // output: April 22, 2026 · 10:30 AM
    }

    public function scopeActive($q)
    {
        return $q->where('is_active',true);
    }

    public function landlord()
    {
        return $this->belongsTo(User::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class,'property_id');
    }
}
