<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipe_id' => 'required|exists:core_recipes,id',
            'quantity'  => 'required|integer|min:1',
        ];
    }
}
