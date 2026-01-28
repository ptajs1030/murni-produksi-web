<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
}
