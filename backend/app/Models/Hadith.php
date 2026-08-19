<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Hadith
 *
 * @property int|string $id
 * @property string $book_id
 * @property string $book_name
 * @property string $chapter
 * @property string $hadith_number
 * @property string $narrator
 * @property string $text_arabic
 * @property string $text_urdu
 * @property string|null $text_english
 * @property string $grade
 * @property string|null $explanation
 * @property string|null $reference
 * @property int $order
 * @property bool $is_featured
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Hadith extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'hadiths';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'book_id',
        'book_name',
        'chapter',
        'hadith_number',
        'narrator',
        'text_arabic',
        'text_urdu',
        'text_english',
        'grade',
        'explanation',
        'reference',
        'order',
        'is_featured',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'hadith_number' => 'string',
            'order' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope a query to filter hadiths by book identifier or book name.
     *
     * @param  Builder<Hadith>  $query
     * @param  string  $book
     * @return Builder<Hadith>
     */
    public function scopeByBook(Builder $query, string $book): Builder
    {
        return $query->where(function (Builder $q) use ($book) {
            $q->where('book_id', $book)
              ->orWhere('book_name', 'like', "%{$book}%");
        });
    }

    /**
     * Scope a query to filter hadiths by authentication grade (e.g. Sahih, Hasan, Agreed Upon).
     *
     * @param  Builder<Hadith>  $query
     * @param  string  $grade
     * @return Builder<Hadith>
     */
    public function scopeByGrade(Builder $query, string $grade): Builder
    {
        return $query->where('grade', 'like', "%{$grade}%");
    }

    /**
     * Scope a query to only include featured hadiths.
     *
     * @param  Builder<Hadith>  $query
     * @return Builder<Hadith>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to search across Arabic, Urdu, English texts, or Narrator.
     *
     * @param  Builder<Hadith>  $query
     * @param  string  $searchTerm
     * @return Builder<Hadith>
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->where(function (Builder $q) use ($searchTerm) {
            $q->where('text_arabic', 'like', "%{$searchTerm}%")
              ->orWhere('text_urdu', 'like', "%{$searchTerm}%")
              ->orWhere('text_english', 'like', "%{$searchTerm}%")
              ->orWhere('narrator', 'like', "%{$searchTerm}%")
              ->orWhere('chapter', 'like', "%{$searchTerm}%");
        });
    }
}
