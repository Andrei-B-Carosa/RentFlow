<?php

namespace App\Models;

use App\Constants\Role;
use App\Constants\UserStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasUuids, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'status' => UserStatus::class,
        'role'=>Role::class
    ];

    protected $hidden =[
        // 'id'
    ];

    protected $appends = [
        'formatted_date'
    ];

    protected static function boot(){
        parent::boot();

        //if role is empty default is tenant
        static::creating(function($model){
            if(empty($model->role)){
                $model->role = Role::TENANT->value;
            }
        });
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at?$this->created_at->format('F d, Y · h:i A'):'';
        // output: April 22, 2026 · 10:30 AM
    }

    public function scopeActive($q)
    {
        return $q->where('status', UserStatus::ACTIVE->value);
    }


    public function properties() {
        return $this->hasMany(Property::class,'landlord_id');
    }

    public function leases() {
        return $this->hasMany(Lease::class,'tenant_id');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class,'tenant_id');
    }


}
