<?php

namespace App\Http\Requests\Landlord;

use App\Constants\PaymentStatus;
use App\Constants\PaymentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
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
            'lease_id' =>['required','string', 'exists:leases,id'],
            'amount'   => ['required', 'numeric', 'min:0'],
            'paid_at' =>['nullable','date'],
            'notes' => ['nullable', 'string'],
            'type' => [
                'required',
                Rule::in(array_map(fn (PaymentType $type) => $type->value, PaymentType::cases())),
                Rule::notIn([PaymentType::RENT->value]),
            ],
        ];
    }
}
