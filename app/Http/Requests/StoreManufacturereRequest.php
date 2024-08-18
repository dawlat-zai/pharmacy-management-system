<?php

namespace App\Http\Requests;

use App\Models\Manufacturer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreManufacturereRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:64'],
            'email' => ['required', 'email', Rule::unique(Manufacturer::class)],
            'address' => ['required', 'string', 'max:64'],
            'phone_number' => ['required', 'string', 'max:64'],
            'mobile_number' => ['required', 'string', 'max:64'],
            'contact_person' => ['required', 'string', 'max:64'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
