<?php

namespace App\Http\Requests;

use App\Models\CoreProduct;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class RepackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Adjust authorization logic as needed.
        // For API, often true if user is authenticated.
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
            'outgoing_product_id' => ['required', 'integer', 'exists:core_products,id'],
            'outgoing_quantity' => ['required', 'numeric', 'min:1'],
            'incoming_product_id' => ['required', 'integer', 'exists:core_products,id'],
            'incoming_quantity' => ['required', 'numeric', 'min:1'],
            'repack_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function after(Validator $validator)
    {
        $validator->after(function ($validator) {
            $incomingProductId = $this->input('incoming_product_id');
            $outgoingProductId = $this->input('outgoing_product_id');

            // Ensure both IDs are present before proceeding
            if ($incomingProductId && $outgoingProductId) {
                $incomingProduct = CoreProduct::find($incomingProductId);
                $outgoingProduct = CoreProduct::find($outgoingProductId);

                // Ensure both products are found and have a category ID
                if ($incomingProduct && $outgoingProduct && isset($incomingProduct->m_category_id) && isset($outgoingProduct->m_category_id)) {
                    if ($incomingProduct->m_category_id !== $outgoingProduct->m_category_id) {
                        // Add an error message if the categories do not match
                        $validator->errors()->add(
                            'outgoing_product_id',
                            'The ingredient category must match the product category.'
                        );
                    }
                }
            }
        });
    }
}
