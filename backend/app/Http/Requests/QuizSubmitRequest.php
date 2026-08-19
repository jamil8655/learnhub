<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuizSubmitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array', 'min:1'],
            'answers.*' => ['nullable', 'integer'], // key is question_id, value is selected_option_index
            'time_taken_seconds' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'کوئز کے جوابات جمع کروانا ضروری ہے۔ (Answers are required)',
            'answers.array' => 'جوابات درست فارمیٹ میں نہیں ہیں۔ (Answers must be formatted as an array/map)',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Invalid quiz submission format',
            'errors' => $validator->errors(),
        ], 422));
    }
}
