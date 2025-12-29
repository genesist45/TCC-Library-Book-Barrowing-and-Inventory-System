<?php

namespace App\Http\Requests\Circulation;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request for storing an approved Book Request
 */
class StoreApprovedBookRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_id' => ['required', 'exists:members,member_no'],
            'catalog_item_id' => ['required', 'exists:catalog_items,id'],
            'catalog_item_copy_id' => ['required', 'exists:catalog_item_copies,id'],
            'return_date' => ['required', 'date', 'after_or_equal:today'],
            'return_time' => ['required', 'date_format:H:i'],
            'address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'Member not found.',
            'catalog_item_id.required' => 'Please select a book.',
            'catalog_item_id.exists' => 'Book not found.',
            'catalog_item_copy_id.required' => 'Please select a copy.',
            'catalog_item_copy_id.exists' => 'Copy not found.',
            'return_date.required' => 'Return date is required.',
            'return_date.after_or_equal' => 'Return date must be today or later.',
            'return_time.required' => 'Return time is required.',
        ];
    }
}
