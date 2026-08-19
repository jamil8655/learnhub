<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Hadith;
use App\Models\Certificate;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@learnhub.pk'],
            [
                'name' => 'LearnHub Super Admin',
                'password' => Hash::make('Admin@123456'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+923001234567',
                'bio' => 'System Administrator & Islamic Curriculum Lead',
            ]
        );

        $instructor = User::firstOrCreate(
            ['email' => 'mufti.tariq@learnhub.pk'],
            [
                'name' => 'Mufti Tariq Masood',
                'password' => Hash::make('Instructor@123'),
                'role' => 'instructor',
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+923007654321',
                'bio' => 'Renowned Scholar, Islamic Jurisprudence Expert',
            ]
        );

        $student = User::firstOrCreate(
            ['email' => 'student@learnhub.pk'],
            [
                'name' => 'Bilal Ahmed',
                'password' => Hash::make('Student@123'),
                'role' => 'student',
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+923331122334',
                'bio' => 'Eager learner pursuing Tajweed and Hadith studies',
            ]
        );

        // 2. Categories
        $categories = [
            [
                'name' => 'Quran & Tajweed',
                'name_ur' => 'قرآن اور تجوید',
                'slug' => 'quran-tajweed',
                'icon' => 'book-open',
                'description' => 'Learn proper Quran recitation, Makharij, and rules of Tajweed.',
                'order' => 1,
            ],
            [
                'name' => 'Hadith Studies',
                'name_ur' => 'مطالعہ حدیث',
                'slug' => 'hadith-studies',
                'icon' => 'scroll',
                'description' => 'Authentic Hadith sciences, collections, and commentary.',
                'order' => 2,
            ],
            [
                'name' => 'Islamic Jurisprudence (Fiqh)',
                'name_ur' => 'فقہ و اصول فقہ',
                'slug' => 'fiqh',
                'icon' => 'scale',
                'description' => 'Practical daily rulings on prayer, fasting, zakat, and transactions.',
                'order' => 3,
            ],
            [
                'name' => 'Arabic Language',
                'name_ur' => 'عربی زبان و گرامر',
                'slug' => 'arabic-language',
                'icon' => 'globe',
                'description' => 'Classical and modern Arabic grammar (Nahw & Sarf) from basics.',
                'order' => 4,
            ],
            [
                'name' => 'Seerah & Islamic History',
                'name_ur' => 'سیرت النبی ﷺ اور تاریخ',
                'slug' => 'seerah-history',
                'icon' => 'clock',
                'description' => 'Life of the Prophet Muhammad ﷺ and historical Islamic eras.',
                'order' => 5,
            ]
        ];

        foreach ($categories as $catData) {
            Category::firstOrCreate(['slug' => $catData['slug']], $catData);
        }

        $tajweedCat = Category::where('slug', 'quran-tajweed')->first();
        $fiqhCat = Category::where('slug', 'fiqh')->first();
        $hadithCat = Category::where('slug', 'hadith-studies')->first();

        // 3. Courses
        $course1 = Course::firstOrCreate(
            ['slug' => 'complete-tajweed-masterclass'],
            [
                'title' => 'Complete Tajweed Masterclass for Beginners',
                'title_ur' => 'ابتدائی طلبہ کے لیے مکمل تجوید ماسٹر کلاس',
                'short_description' => 'Master Quranic pronunciation, articulation points (Makharij), and melodic recitation.',
                'short_description_ur' => 'قرآن پاک کی درست تجوید، مخارج اور تلاوت کے اصول سیکھیں۔',
                'description' => 'This comprehensive course takes you from zero to fluent Quran recitation with correct tajweed rules including Noon Sakinah, Meem Sakinah, Madd rules, and Sifaat.',
                'description_ur' => 'یہ جامع کورس آپ کو قرآن پاک کی درست ادائیگی اور مخارج سکھاتا ہے تاکہ آپ خوبصورت اور درست انداز میں تلاوت کر سکیں۔',
                'thumbnail' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
                'price' => 0.00,
                'is_free' => true,
                'level' => 'beginner',
                'language' => 'Urdu / Arabic',
                'status' => 'published',
                'instructor_id' => $instructor->id,
                'category_id' => $tajweedCat->id,
                'rating' => 4.95,
                'reviews_count' => 142,
                'enrolled_count' => 580,
                'duration_minutes' => 240,
            ]
        );

        $course2 = Course::firstOrCreate(
            ['slug' => 'practical-fiqh-of-prayer-zakat'],
            [
                'title' => 'Practical Fiqh of Salah and Zakat',
                'title_ur' => 'نماز اور زکوٰۃ کا عملی فقہی کورس',
                'short_description' => 'Understand the essential requirements, conditions, sunnahs, and nullifiers of prayer and charity.',
                'short_description_ur' => 'نماز اور زکوٰۃ کے شرعی احکام، فرائض، واجبات اور مکروہات کی مکمل رہنمائی۔',
                'description' => 'A structured and evidence-based study of Salah, Wudu, Tayammum, Sajdah Sahw, and precise Zakat calculation methodology.',
                'description_ur' => 'وضو، تیمم، نماز، سجدہ سہو اور زکوٰۃ کے بنیادی اصولوں پر مشتمل تفصیلی کورس۔',
                'thumbnail' => 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80',
                'price' => 1500.00,
                'discount_price' => 999.00,
                'is_free' => false,
                'level' => 'intermediate',
                'language' => 'Urdu',
                'status' => 'published',
                'instructor_id' => $instructor->id,
                'category_id' => $fiqhCat->id,
                'rating' => 4.88,
                'reviews_count' => 98,
                'enrolled_count' => 312,
                'duration_minutes' => 320,
            ]
        );

        // 4. Lessons for Course 1
        $lessonsC1 = [
            [
                'title' => 'Introduction to Tajweed & Makharij al-Huruf',
                'title_ur' => 'تجوید کا تعارف اور مخارج الحروف کی بنیاد',
                'slug' => 'intro-to-tajweed',
                'description' => 'Overview of the science of Tajweed and 17 articulation points.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 25,
                'order' => 1,
                'is_preview' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Rules of Noon Sakinah and Tanween (Izhar, Idgham, Iqlab, Ikhfa)',
                'title_ur' => 'نون ساکن اور تنوین کے چار بنیادی قواعد',
                'slug' => 'noon-sakinah-rules',
                'description' => 'Master the 4 fundamental rules with practical Quranic examples.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 35,
                'order' => 2,
                'is_preview' => false,
                'status' => 'published',
            ],
            [
                'title' => 'Rules of Meem Sakinah and Ghunnah',
                'title_ur' => 'میم ساکن اور غنہ کے احکام',
                'slug' => 'meem-sakinah-rules',
                'description' => 'Ikhfa Shafawi, Idgham Shafawi, and Izhar Shafawi explained.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 30,
                'order' => 3,
                'is_preview' => false,
                'status' => 'published',
            ],
            [
                'title' => 'Rules of Madd (Elongation) and Heavy/Light Letters (Tafkheem/Tarqeeq)',
                'title_ur' => 'مد کے اقسام اور تفخیم و ترقیق کے اصول',
                'slug' => 'madd-and-sifaat',
                'description' => 'Detailed guide on Madd Tabiee, Muttasil, Munfasil, and Lazim.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 40,
                'order' => 4,
                'is_preview' => false,
                'status' => 'published',
            ]
        ];

        foreach ($lessonsC1 as $l) {
            Lesson::firstOrCreate(
                ['course_id' => $course1->id, 'order' => $l['order']],
                array_merge($l, ['course_id' => $course1->id])
            );
        }

        // 5. Quizzes
        $quiz1 = Quiz::firstOrCreate(
            ['slug' => 'tajweed-fundamentals-assessment'],
            [
                'title' => 'Tajweed Fundamentals & Makharij Assessment',
                'title_ur' => 'تجوید اور مخارج الحروف کا جامع جائزہ',
                'description' => 'Test your understanding of Noon Sakinah, Meem Sakinah, and letter articulation rules.',
                'description_ur' => 'نون ساکن، میم ساکن اور مخارج کے قواعد پر اپنی گرفت کا امتحان لیں۔',
                'category_id' => $tajweedCat->id,
                'course_id' => $course1->id,
                'difficulty' => 'beginner',
                'time_limit_minutes' => 15,
                'pass_percentage' => 70.0,
                'max_attempts' => 3,
                'is_standalone' => true,
                'status' => 'published',
            ]
        );

        $questions1 = [
            [
                'question_text' => 'How many rules are there for Noon Sakinah and Tanween?',
                'question_text_ur' => 'نون ساکن اور تنوین کے کتنے بنیادی قواعد ہیں؟',
                'options' => ['2', '3', '4 (Izhar, Idgham, Iqlab, Ikhfa)', '6'],
                'correct_option_index' => 2,
                'explanation' => 'Noon Sakinah and Tanween have 4 rules: Izhar (clear), Idgham (merging), Iqlab (changing to Meem), and Ikhfa (hiding).',
                'explanation_ur' => 'نون ساکن اور تنوین کے چار قواعد ہیں: اظہار، ادغام، اقلاب، اور اخفاء۔',
                'points' => 1,
                'order' => 1,
            ],
            [
                'question_text' => 'Which of the following is the letter of Iqlab (اقلاب)?',
                'question_text_ur' => 'درج ذیل میں سے حرفِ اقلاب کون سا ہے؟',
                'options' => ['ب (Baa)', 'م (Meem)', 'ن (Noon)', 'ر (Raa)'],
                'correct_option_index' => 0,
                'explanation' => 'The letter of Iqlab is solely Baa (ب). When Noon Sakinah or Tanween is followed by Baa, it converts to a hidden Meem with Ghunnah.',
                'explanation_ur' => 'اقلاب کا صرف ایک حرف ہے اور وہ "ب" ہے۔',
                'points' => 1,
                'order' => 2,
            ],
            [
                'question_text' => 'How many main articulation areas (Makharij al-Ammah) exist in the vocal tract according to Ibn al-Jazari?',
                'question_text_ur' => 'ابن الجزری کے مطابق مخارجِ عامہ کی کل تعداد کتنی ہے؟',
                'options' => ['3', '5 (Jawf, Halq, Lisaan, Shafatan, Khayshoom)', '7', '17'],
                'correct_option_index' => 1,
                'explanation' => 'There are 5 general areas (Makharij Ammah) containing 17 specific points (Makharij Khassah).',
                'explanation_ur' => 'عام مخارج 5 ہیں جن میں 17 خاص مخارج واقع ہیں۔',
                'points' => 1,
                'order' => 3,
            ]
        ];

        foreach ($questions1 as $q) {
            QuizQuestion::firstOrCreate(
                ['quiz_id' => $quiz1->id, 'order' => $q['order']],
                array_merge($q, ['quiz_id' => $quiz1->id])
            );
        }

        // 6. Hadiths
        $hadiths = [
            [
                'book_slug' => 'bukhari',
                'book_name_en' => 'Sahih al-Bukhari',
                'book_name_ur' => 'صحیح البخاری',
                'book_name_ar' => 'صحيح البخاري',
                'chapter_number' => 1,
                'chapter_title_en' => 'Revelation (Bad\' al-Wahy)',
                'chapter_title_ur' => 'کتاب وحی کے بیان میں',
                'chapter_title_ar' => 'كتاب بدء الوحي',
                'hadith_number' => 1,
                'narrator_en' => 'Umar ibn al-Khattab (RA)',
                'narrator_ur' => 'حضرت عمر بن الخطاب رضی اللہ عنہ',
                'text_ar' => 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
                'text_ur' => 'اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا کے لیے ہو جسے وہ حاصل کرے یا کسی عورت کے لیے جس سے وہ نکاح کرے، تو اس کی ہجرت اسی کے لیے ہے جس کی طرف اس نے ہجرت کی۔',
                'text_en' => 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.',
                'grade' => 'Sahih (متفق علیہ)',
                'reference' => 'Sahih al-Bukhari 1, Book 1, Hadith 1',
            ],
            [
                'book_slug' => 'bukhari',
                'book_name_en' => 'Sahih al-Bukhari',
                'book_name_ur' => 'صحیح البخاری',
                'book_name_ar' => 'صحيح البخاري',
                'chapter_number' => 66,
                'chapter_title_en' => 'Virtues of the Quran',
                'chapter_title_ur' => 'فضائل قرآن کا بیان',
                'chapter_title_ar' => 'كتاب فضائل القرآن',
                'hadith_number' => 5027,
                'narrator_en' => 'Uthman bin Affan (RA)',
                'narrator_ur' => 'حضرت عثمان بن عفان رضی اللہ عنہ',
                'text_ar' => 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
                'text_ur' => 'تم میں سے سب سے بہتر وہ شخص ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔',
                'text_en' => 'The best among you (Muslims) are those who learn the Quran and teach it.',
                'grade' => 'Sahih (صحیح)',
                'reference' => 'Sahih al-Bukhari 5027, Book 66, Hadith 49',
            ],
            [
                'book_slug' => 'muslim',
                'book_name_en' => 'Sahih Muslim',
                'book_name_ur' => 'صحیح مسلم',
                'book_name_ar' => 'صحيح مسلم',
                'chapter_number' => 1,
                'chapter_title_en' => 'Faith (Kitab Al-Iman)',
                'chapter_title_ur' => 'کتاب الایمان',
                'chapter_title_ar' => 'كتاب الإيمان',
                'hadith_number' => 8,
                'narrator_en' => 'Abdullah ibn Umar (RA)',
                'narrator_ur' => 'حضرت عبداللہ بن عمر رضی اللہ عنہما',
                'text_ar' => 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ.',
                'text_ur' => 'اسلام کی بنیاد پانچ ستونوں پر رکھی گئی ہے: اس بات کی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ ادا کرنا، حج کرنا اور رمضان کے روزے رکھنا۔',
                'text_en' => 'Islam is built on five pillars: To testify that none has the right to be worshipped but Allah and Muhammad is His Messenger, to establish prayer, to pay Zakat, to perform Hajj, and to observe fasts during Ramadan.',
                'grade' => 'Sahih (متفق علیہ)',
                'reference' => 'Sahih Muslim 16, Book 1, Hadith 8',
            ]
        ];

        foreach ($hadiths as $h) {
            Hadith::firstOrCreate(
                ['book_slug' => $h['book_slug'], 'hadith_number' => $h['hadith_number']],
                $h
            );
        }

        // 7. Seed sample certificate
        Certificate::firstOrCreate(
            ['certificate_code' => 'LH-TJWD-2026-008492'],
            [
                'user_id' => $student->id,
                'course_id' => $course1->id,
                'type' => 'course_completion',
                'recipient_name' => $student->name,
                'title' => 'Certificate of Completion: Complete Tajweed Masterclass',
                'title_ur' => 'سندِ فراغت: مکمل تجوید ماسٹر کلاس',
                'grade' => 'Distinction',
                'score_percentage' => 100.0,
                'issued_at' => now(),
                'metadata' => [
                    'course_title' => $course1->title,
                    'total_lessons' => 4,
                ]
            ]
        );
    }
}
