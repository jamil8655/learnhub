<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'ری سیٹ ٹوکن درکار ہے۔ (Reset token is required)',
            'password.required' => 'نیا پاس ورڈ درج کرنا ضروری ہے۔ (Password is required)',
            'password.min' => 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔ (Password must be at least 6 characters)',
            'password.confirmed' => 'پاس ورڈ کی تصدیق مماثل نہیں ہے۔ (Password confirmation does not match)',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Password reset validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
