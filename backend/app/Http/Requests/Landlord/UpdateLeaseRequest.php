<?php

namespace App\Http\Requests\Landlord;

use App\Constants\LeaseStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeaseRequest extends FormRequest
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
            'start_date' => ['sometimes','date'],
            'end_date' => ['sometimes','date'],
            'monthly_rent' => ['sometimes', 'numeric', 'min:0'],
            'deposit_amount'=> ['nullable', 'numeric', 'min:0'],
            'status'=> ['sometimes',Rule::in(array_column(LeaseStatus::cases(), 'value'))],
            'document'=> ['nullable','file','mimes:pdf','max:5120'],
            'landlord_notes' => ['nullable','string']
        ];
    }
}
