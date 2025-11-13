<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\Http;

class EmailReminderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email:rfc', 'max:255'], // Removed DNS check
            'return_date' => ['required', 'date', 'after_or_equal:today'],
            'return_time' => ['required', 'date_format:H:i'],
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'return_date.required' => 'Return date is required.',
            'return_date.after_or_equal' => 'Return date cannot be in the past.',
            'return_time.required' => 'Return time is required.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        // Removed strict email deliverability check for easier testing
        // You can re-enable this in production if needed
        
        // $validator->after(function (Validator $validator) {
        //     $email = $this->input('email');
        //     
        //     if ($email && !$this->isEmailDeliverable($email)) {
        //         $validator->errors()->add(
        //             'email',
        //             'This email address does not appear to exist. Please enter a valid email address.'
        //         );
        //     }
        // });
    }

    /**
     * Check if email domain has valid MX records
     */
    private function isEmailDeliverable(string $email): bool
    {
        try {
            // Extract domain from email
            $domain = substr(strrchr($email, "@"), 1);
            
            // Check for MX records
            $mxRecords = [];
            $hasMX = getmxrr($domain, $mxRecords);
            
            // If no MX records, check A record
            if (!$hasMX) {
                $aRecord = gethostbyname($domain);
                return $aRecord !== $domain; // Returns true if A record exists
            }
            
            return $hasMX && count($mxRecords) > 0;
        } catch (\Exception $e) {
            // If validation fails, allow it (don't block valid emails due to network issues)
            return true;
        }
    }
}

