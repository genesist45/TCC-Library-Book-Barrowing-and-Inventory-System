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
            'return_time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    // Convert time to hours in 24-hour format
                    [$hour, $minute] = explode(':', $value);
                    $hour = (int) $hour;
                    
                    // Check if time is within allowed ranges
                    // Morning: 7:00 AM (07:00) to 11:00 AM (11:00)
                    // Afternoon: 1:00 PM (13:00) to 4:00 PM (16:00)
                    $isValidMorning = ($hour >= 7 && $hour <= 11);
                    $isValidAfternoon = ($hour >= 13 && $hour <= 16);
                    
                    if (!$isValidMorning && !$isValidAfternoon) {
                        $fail('The return time must be between 7:00-11:00 AM or 1:00-4:00 PM.');
                    }
                    
                    // Special check: 4:00 PM (16:00) is the last allowed time
                    if ($hour === 16 && (int) $minute > 0) {
                        $fail('The return time must be between 7:00-11:00 AM or 1:00-4:00 PM.');
                    }
                },
            ],
            'notes' => 'nullable|string',
        ];
    }
}
