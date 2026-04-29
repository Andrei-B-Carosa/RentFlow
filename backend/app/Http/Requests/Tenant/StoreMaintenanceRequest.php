<?php

namespace App\Http\Requests\Tenant;

use App\Constants\PriorityStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMaintenanceRequest extends FormRequest
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
            'title'         => ['required','string','max:255'],
            'description'   => ['required','string'],
            'photos'        => ['nullable', 'array'],
            'photos.*'      => ['image', 'max:2048'],
            'priority'      => ['required', Rule::in(array_column(PriorityStatus::cases(),'value'))],
        ];
    }
}
