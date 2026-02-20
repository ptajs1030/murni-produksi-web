<?php

namespace App\Http\Requests;

use App\Models\CoreProduct;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ProductionCheckRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'recipe_id' => 'required|exists:core_recipes,id',
            'quantity'  => 'required|integer|min:1',
        ];
    }
}
