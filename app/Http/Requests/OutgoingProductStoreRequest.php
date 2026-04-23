<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OutgoingProductStoreRequest extends FormRequest
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
            'product_id' => 'required|exists:core_products,id',
            'out_type_id' => 'required|exists:m_out_types,id',
            'quantity' => 'required|integer|min:1',
        ];
    }
    
    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib diisi.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'out_type_id.required' => 'Jenis pengeluaran wajib diisi.',
            'out_type_id.exists' => 'Jenis pengeluaran tidak ditemukan.',
            'quantity.required' => 'Kuantitas wajib diisi.',
            'quantity.integer' => 'Kuantitas harus berupa angka.',
            'quantity.min' => 'Kuantitas minimal 1.',
        ];
    }
}
