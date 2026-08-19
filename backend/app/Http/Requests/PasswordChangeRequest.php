<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PasswordChangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed', 'different:current_password'],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'موجودہ پاس ورڈ درج کرنا ضروری ہے۔ (Current password is required)',
            'new_password.required' => 'نیا پاس ورڈ درج کرنا ضروری ہے۔ (New password is required)',
            'new_password.min' => 'نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔ (New password must be at least 6 characters)',
            'new_password.confirmed' => 'نئے پاس ورڈ کی تصدیق مماثل نہیں ہے۔ (New password confirmation does not match)',
            'new_password.different' => 'نیا پاس ورڈ پرانے پاس ورڈ سے مختلف ہونا چاہیے۔ (New password must be different from current password)',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Password validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
