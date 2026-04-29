<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
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
            'name' => ['required'],
            'address'=>['required'],
            'city'=>['required'],
            'description'=>['required'],
            'photos'   => ['nullable', 'array'],
            'photos.*' => ['image', 'max:2048'], // each file max 2MB
            'is_active'=>['required'],
        ];
    }
}
