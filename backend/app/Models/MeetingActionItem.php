<?php

namespace App\Models;

use App\Models\BaseModel;

class MeetingActionItem extends BaseModel
{
    protected $fillable = [
        'meeting_id',
        'task',
        'owner',
        'deadline',
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
