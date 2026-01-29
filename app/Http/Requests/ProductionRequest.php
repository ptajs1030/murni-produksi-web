<?php

namespace App\Http\Requests;

use App\Models\CoreProduct;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ProductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set true untuk mengizinkan request. Atur otorisasi sesuai kebutuhan.
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
            'incoming_product_id' => ['required', 'integer', 'exists:core_products,id'],
            'incoming_quantity' => ['required', 'numeric', 'min:0.0001'],
            'outgoing_product_id' => ['required', 'integer', 'exists:core_products,id', 'different:incoming_product_id'],
            'outgoing_quantity' => ['required', 'numeric', 'min:0.0001'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get the "after" validation callables.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $incomingProductId = $this->input('incoming_product_id');
                $outgoingProductId = $this->input('outgoing_product_id');

                // Lanjutkan hanya jika kedua ID ada
                if ($incomingProductId && $outgoingProductId) {
                    $incomingProduct = CoreProduct::find($incomingProductId);
                    $outgoingProduct = CoreProduct::find($outgoingProductId);

                    // Lanjutkan hanya jika kedua produk ditemukan
                    if ($incomingProduct && $outgoingProduct) {
                        // **VALIDASI KATEGORI**
                        if ($incomingProduct->m_category_id !== $outgoingProduct->m_category_id) {
                            // Tambahkan error jika kategori tidak cocok
                            $validator->errors()->add(
                                'outgoing_product_id',
                                'Kategori bahan baku harus sama dengan kategori produk hasil.'
                            );
                        }
                    }
                }
            }
        ];
    }
}
