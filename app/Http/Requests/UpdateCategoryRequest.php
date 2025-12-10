<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')->id;

        return [
            'name' => "required|string|max:255|unique:categories,name,{$categoryId}",
            'slug' => "required|string|max:255|unique:categories,slug,{$categoryId}",
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'name.unique' => 'This category name already exists.',
            'name.max' => 'Category name must not exceed 255 characters.',
        ];
    }
}
