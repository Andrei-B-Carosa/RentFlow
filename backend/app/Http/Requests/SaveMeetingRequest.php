<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SaveMeetingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'                   => 'required|string|max:200',
            'audio_filename'          => 'required|string',
            'transcript'              => 'required|string',
            'summary'                 => 'required|string',
            'key_points'              => 'nullable|array',
            'decisions'               => 'nullable|array',
            'action_items'            => 'nullable|array',
            'action_items.*.task'     => 'required|string',
            'action_items.*.owner'    => 'nullable|string',
            'action_items.*.deadline' => 'nullable|string',
            'follow_ups'              => 'nullable|array',
            'minutes'                 => 'nullable|array',
            'highlighted_transcript'  => 'nullable|string',
            'duration'                => 'nullable|integer',
        ];
    }
}
