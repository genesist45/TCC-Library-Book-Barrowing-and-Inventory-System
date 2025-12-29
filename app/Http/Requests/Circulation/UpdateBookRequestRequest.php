<?php

namespace App\Http\Requests\Circulation;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request for updating a Book Request
 */
class UpdateBookRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'quota' => ['nullable', 'integer', 'min:0'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'return_date' => ['required', 'date'],
            'return_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:Pending,Approved,Disapproved,Returned'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Full name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'return_date.required' => 'Return date is required.',
            'return_time.required' => 'Return time is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',
        ];
    }
}
