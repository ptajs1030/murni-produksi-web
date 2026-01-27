<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $productId = $this->route('product') ? $this->route('product')->id : null;

        return [
            'product_name' => ['required', 'string', 'max:100'],
            'm_category_id' => ['required', 'exists:m_categories,id'],
            'm_supplier_id' => ['required', 'exists:m_suppliers,id'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target_selling_date' => ['nullable', 'date'],
            'product_is_pre_order' => ['boolean'],
            'product_processing_days' => ['integer', 'min:0'],
            'm_property_item_id' => ['required', 'exists:m_property_items,id'],
            'm_packaging_size_id' => ['required', 'exists:m_packaging_sizes,id'],
            'm_packaging_type_id' => ['required', 'exists:m_packaging_types,id'],
            'm_repack_status_id' => ['required', 'exists:m_repack_status,id'],
            'packaging_size_input' => ['required', 'integer', 'min:0'],
            'product_unit_sku' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('core_products', 'product_unit_sku')->ignore($productId),
            ],
            'product_unit_qty' => ['required', 'numeric', 'min:0'],
            'product_unit_price' => ['nullable', 'numeric', 'min:0'],
            'expired_date' => ['nullable', 'date'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['file', 'mimes:jpeg,jpg,png,gif,webp', 'max:5120'], // max 5MB per file
            'deleted_images' => ['nullable', 'array'],
            'deleted_images.*' => ['integer', 'exists:core_product_image,id'],
        ];
    }
}
