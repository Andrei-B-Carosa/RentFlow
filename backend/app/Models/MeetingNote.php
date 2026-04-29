<?php

namespace App\Models;

use App\Models\BaseModel;

class MeetingNote extends BaseModel
{
    protected $fillable = [
        'title',
        'audio_filename',
        'transcript',
        'summary',
        'key_points',
        'decisions',
        'minutes',
        'highlighted_transcript',
        'duration',
    ];

    protected $casts = [
        'key_points' => 'array',
        'decisions'  => 'array',
        'minutes'    => 'array',
    ];

    protected $appends = ['formatted_date'];

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('F d, Y · h:i A');
        // output: April 22, 2026 · 10:30 AM
    }

    public function actionItems()
    {
        return $this->hasMany(MeetingActionItem::class, 'meeting_id');
    }

    public function followUps()
    {
        return $this->hasMany(MeetingFollowUp::class, 'meeting_id');
    }
}
