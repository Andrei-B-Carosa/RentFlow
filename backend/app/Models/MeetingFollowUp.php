<?php

namespace App\Models;

use App\Models\BaseModel;

class MeetingFollowUp extends BaseModel
{
    protected $fillable = [
        'meeting_id',
        'description',
        'status',
        'remarks',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function meeting()
    {
        return $this->belongsTo(MeetingNote::class, 'meeting_id');
    }
}
