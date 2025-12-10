<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePublisherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Publisher name is required.',
            'name.max' => 'Publisher name must not exceed 255 characters.',
            'country.required' => 'Country is required.',
            'country.max' => 'Country must not exceed 255 characters.',
        ];
    }
}
