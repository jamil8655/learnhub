<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'two_factor_code' => ['nullable', 'string', 'size:6'],
            'recovery_code' => ['nullable', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
            'remember' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'ای میل درج کرنا ضروری ہے۔ (Email is required)',
            'password.required' => 'پاس ورڈ درج کرنا ضروری ہے۔ (Password is required)',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Invalid credentials or missing fields',
            'errors' => $validator->errors(),
        ], 422));
    }
}
