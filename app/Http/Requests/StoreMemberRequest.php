<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_no' => ['required', 'string', 'max:255', 'unique:members,member_no'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:Regular,Privileged'],
            'status' => ['required', 'in:Active,Inactive,Suspended'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'booking_quota' => ['nullable', 'integer', 'min:0'],
            'member_group' => ['nullable', 'string', 'max:255'],
            'allow_login' => ['boolean'],
        ];
    }
}
