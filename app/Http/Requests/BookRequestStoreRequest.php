<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookRequestStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow anyone to submit a borrow request
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'member_id' => 'required|exists:members,member_no', // member_id field contains member_no from form
            'catalog_item_id' => 'required|exists:catalog_items,id',
            'full_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
            ],
            'quota' => 'nullable|integer|min:0',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'return_date' => 'required|date|after_or_equal:today|before_or_equal:+1 month',
            'return_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ];
    }
}
