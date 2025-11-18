<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCatalogItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:Book,Thesis,Journal,Magazine,Newspaper,DVD,CD,Other',
            'category_id' => 'nullable|exists:categories,id',
            'publisher_id' => 'nullable|exists:publishers,id',
            'author_ids' => 'nullable|array',
            'author_ids.*' => 'exists:authors,id',
            'isbn' => 'nullable|string|max:20',
            'isbn13' => 'nullable|string|max:20',
            'call_no' => 'nullable|string|max:100',
            'subject' => 'nullable|string|max:255',
            'series' => 'nullable|string|max:255',
            'edition' => 'nullable|string|max:100',
            'year' => 'nullable|digits:4|integer|min:1000|max:' . (date('Y') + 10),
            'url' => 'nullable|url|max:500',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'title.max' => 'Title must not exceed 255 characters.',
            'type.required' => 'Type is required.',
            'type.in' => 'Invalid type selected.',
            'category_id.exists' => 'Selected category does not exist.',
            'publisher_id.exists' => 'Selected publisher does not exist.',
            'author_ids.*.exists' => 'One or more selected authors do not exist.',
            'year.digits' => 'Year must be exactly 4 digits.',
            'year.min' => 'Year must be at least 1000.',
            'year.max' => 'Year cannot be more than ' . (date('Y') + 10) . '.',
            'url.url' => 'Please enter a valid URL.',
            'cover_image.image' => 'Cover image must be an image file.',
            'cover_image.mimes' => 'Cover image must be a JPEG, JPG, or PNG file.',
            'cover_image.max' => 'Cover image size must not exceed 2MB.',
        ];
    }
}
