<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $courseId = $this->route('course') ? (is_object($this->route('course')) ? $this->route('course')->id : $this->route('course')) : null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'title_ur' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:courses,slug,' . $courseId],
            'short_description' => ['required', 'string', 'max:500'],
            'short_description_ur' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'description_ur' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'price' => ['required_if:is_free,false', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'is_free' => ['boolean'],
            'level' => ['required', 'in:beginner,intermediate,advanced,all'],
            'language' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'in:draft,published,archived'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Course validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
