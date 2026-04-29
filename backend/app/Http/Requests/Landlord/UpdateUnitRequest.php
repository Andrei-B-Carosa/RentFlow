<?php

namespace App\Http\Requests\Landlord;

use App\Constants\UnitStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
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
            'property_id' => ['required', 'string'],
            'unit_number' => ['required', 'string'],
            'rent_price' => ['required', 'numeric'],
            'status'      => [
                'sometimes',
                Rule::in(array_column(UnitStatus::cases(), 'value')),
            ],
            'bedrooms' => ['nullable', 'integer'],
            'bathrooms' => ['nullable', 'integer'],
            'floor_area' => ['nullable', 'numeric'],
        ];
    }
}
