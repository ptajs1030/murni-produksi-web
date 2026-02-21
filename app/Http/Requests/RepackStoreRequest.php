<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RepackStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'source_product_id' => 'required|exists:core_products,id',
            'source_quantity' => 'required|integer|min:1',
            'target_products' => 'required|array|min:1',
            'target_products.*.product_id' => 'required|exists:core_products,id',
            'target_products.*.quantity' => 'required|integer|min:1',
        ];
    }
}