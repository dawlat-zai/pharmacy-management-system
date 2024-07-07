<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'description' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'product_type_id' => ['required', 'integer', 'exists:product_types,id'],
            'manufacture_date' => ['required', 'date:Y-m-d'],
            'expiry_date' => ['required', 'date:Y-m-d'],
            'purchase_price' => ['required', 'decimal:0,2'],
            'sale_price' => ['required', 'decimal:0,2'],
            'quantity' => ['required', 'integer'],
        ];
    }
}
