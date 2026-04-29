<?php

namespace App\Http\Requests\Landlord;

use App\Constants\LeaseStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeaseRequest extends FormRequest
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
            'unit_id' => ['required','exists:units,id'],
            'tenant_id' => ['required','exists:users,id'],
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'deposit_amount'=> ['required', 'numeric', 'min:0'],
            'status'        => ['required', Rule::in(array_column(LeaseStatus::cases(), 'value'))],
            'document_path' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'landlord_notes' => ['nullable','string']
        ];
    }
}
