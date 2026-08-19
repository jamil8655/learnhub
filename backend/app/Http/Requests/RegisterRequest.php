<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'نام درج کرنا ضروری ہے۔ (Full name is required)',
            'email.required' => 'ای میل درج کرنا ضروری ہے۔ (Email address is required)',
            'email.email' => 'براہ کرم درست ای میل پتہ درج کریں۔ (Please provide a valid email)',
            'email.unique' => 'یہ ای میل پہلے سے زیر استعمال ہے۔ (This email is already registered)',
            'password.required' => 'پاس ورڈ درج کرنا ضروری ہے۔ (Password is required)',
            'password.min' => 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔ (Password must be at least 6 characters)',
            'password.confirmed' => 'پاس ورڈ کی تصدیق مماثل نہیں ہے۔ (Password confirmation does not match)',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors(),
        ], 422));
    }
}
