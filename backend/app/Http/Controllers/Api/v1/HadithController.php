<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Hadith;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HadithController extends Controller
{
    /**
     * List hadith collections or paginated hadiths in a collection.
     */
    public function index(Request $request): JsonResponse
    {
        $book = $request->input('book'); // e.g. 'bukhari', 'muslim', 'tirmidhi'

        // If no specific book requested, return available Hadith books/collections metadata
        if (!$book) {
            $collections = [
                [
                    'slug' => 'bukhari',
                    'name_en' => 'Sahih al-Bukhari',
                    'name_ur' => 'صحیح البخاری',
                    'name_ar' => 'صحيح البخاري',
                    'author' => 'Imam Muhammad al-Bukhari',
                    'total_hadiths' => 7563,
                    'count_available' => Hadith::where('book_slug', 'bukhari')->count(),
                ],
                [
                    'slug' => 'muslim',
                    'name_en' => 'Sahih Muslim',
                    'name_ur' => 'صحیح مسلم',
                    'name_ar' => 'صحيح مسلم',
                    'author' => 'Imam Muslim ibn al-Hajjaj',
                    'total_hadiths' => 7500,
                    'count_available' => Hadith::where('book_slug', 'muslim')->count(),
                ],
                [
                    'slug' => 'tirmidhi',
                    'name_en' => 'Jami` at-Tirmidhi',
                    'name_ur' => 'جامع الترمذی',
                    'name_ar' => 'جامع الترمذي',
                    'author' => 'Imam Abu Isa Muhammad at-Tirmidhi',
                    'total_hadiths' => 3956,
                    'count_available' => Hadith::where('book_slug', 'tirmidhi')->count(),
                ],
                [
                    'slug' => 'abu-dawood',
                    'name_en' => 'Sunan Abi Dawud',
                    'name_ur' => 'سنن ابی داؤد',
                    'name_ar' => 'سنن أبي داود',
                    'author' => 'Imam Abu Dawud as-Sijistani',
                    'total_hadiths' => 5274,
                    'count_available' => Hadith::where('book_slug', 'abu-dawood')->count(),
                ],
                [
                    'slug' => 'nasai',
                    'name_en' => 'Sunan an-Nasa\'i',
                    'name_ur' => 'سنن النسائی',
                    'name_ar' => 'سنن النسائي',
                    'author' => 'Imam Ahmad an-Nasa\'i',
                    'total_hadiths' => 5758,
                    'count_available' => Hadith::where('book_slug', 'nasai')->count(),
                ],
                [
                    'slug' => 'ibn-majah',
                    'name_en' => 'Sunan Ibn Majah',
                    'name_ur' => 'سنن ابن ماجہ',
                    'name_ar' => 'سنن ابن ماجه',
                    'author' => 'Imam Ibn Majah al-Qazwini',
                    'total_hadiths' => 4341,
                    'count_available' => Hadith::where('book_slug', 'ibn-majah')->count(),
                ],
                [
                    'slug' => 'forty-hadith',
                    'name_en' => 'An-Nawawi 40 Hadith',
                    'name_ur' => 'الاربعون النوويه (چالیس احادیث)',
                    'name_ar' => 'الأربعون النووية',
                    'author' => 'Imam Yahya ibn Sharaf an-Nawawi',
                    'total_hadiths' => 42,
                    'count_available' => Hadith::where('book_slug', 'forty-hadith')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'collections' => $collections,
                    'total_books' => count($collections),
                ]
            ], 200);
        }

        // Query hadiths in a specific book
        $query = Hadith::where('book_slug', $book);

        if ($chapter = $request->input('chapter')) {
            $query->where('chapter_number', $chapter);
        }

        if ($grade = $request->input('grade')) {
            $query->where('grade', 'like', "%{$grade}%");
        }

        $perPage = min((int) $request->input('per_page', 20), 100);
        $hadiths = $query->orderBy('hadith_number', 'asc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $hadiths->items(),
            'pagination' => [
                'current_page' => $hadiths->currentPage(),
                'per_page' => $hadiths->perPage(),
                'total' => $hadiths->total(),
                'last_page' => $hadiths->lastPage(),
            ]
        ], 200);
    }

    /**
     * Get specific Hadith by ID or by book and hadith number.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $hadith = null;

        if (is_numeric($id)) {
            $hadith = Hadith::find($id);
        }

        if (!$hadith && $request->has('book')) {
            $hadith = Hadith::where('book_slug', $request->input('book'))
                ->where('hadith_number', $id)
                ->first();
        }

        if (!$hadith) {
            return response()->json([
                'success' => false,
                'message' => 'حدیث نہیں ملی۔ (Hadith not found)',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $hadith,
        ], 200);
    }

    /**
     * Search Hadiths in Arabic, Urdu, English and by narrator.
     */
    public function search(Request $request): JsonResponse
    {
        $q = trim($request->input('query', ''));

        if (strlen($q) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'براہ کرم کم از کم 2 حروف کی تلاش درج کریں۔ (Search query must be at least 2 characters)',
            ], 422);
        }

        $query = Hadith::query();

        if ($book = $request->input('book')) {
            $query->where('book_slug', $book);
        }

        if ($grade = $request->input('grade')) {
            $query->where('grade', 'like', "%{$grade}%");
        }

        $query->where(function ($builder) use ($q) {
            $builder->where('text_ur', 'like', "%{$q}%")
                    ->orWhere('text_en', 'like', "%{$q}%")
                    ->orWhere('text_ar', 'like', "%{$q}%")
                    ->orWhere('narrator_ur', 'like', "%{$q}%")
                    ->orWhere('narrator_en', 'like', "%{$q}%")
                    ->orWhere('chapter_title_ur', 'like', "%{$q}%")
                    ->orWhere('chapter_title_en', 'like', "%{$q}%");
        });

        $perPage = min((int) $request->input('per_page', 20), 50);
        $results = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'query' => $q,
            'data' => $results->items(),
            'pagination' => [
                'current_page' => $results->currentPage(),
                'total' => $results->total(),
                'last_page' => $results->lastPage(),
            ]
        ], 200);
    }
}
