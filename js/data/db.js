/**
 * LearnHub Relational Data Store & Seed Database
 * Complete standalone persistence layer with rich, realistic domain models.
 */

const STORAGE_KEY = 'learnhub_db_islamic_v2';

// Seed Initial Data
const SEED_DATA = {
  settings: {
    siteName: 'LearnHub',
    tagline: 'Master the skills of tomorrow, today.',
    logoText: 'LearnHub',
    brandPrimary: '#4f46e5',
    brandAccent: '#06b6d4',
    contactEmail: 'support@learnhub.com',
    enableRegistration: true,
    enableReviews: true,
    enableCertificates: true,
    currencySymbol: '$',
    footerText: '© 2026 LearnHub Inc. All rights reserved. Empowering modern learners worldwide.',
    seoTitle: 'LearnHub — Premium EdTech & Learning Management Platform',
    seoDescription: 'Explore thousands of premium online courses, standalone skill assessment quizzes, and verified professional certificates.'
  },

  cmsContent: {
    heroTitle: 'دینی و جدید علوم میں کمال حاصل کریں مستند اساتذہ کے ساتھ',
    heroSubtitle: 'جامع و منظم اسلامی کورسز حاصل کریں، آزادانہ ٹائمر والے کوئزز کے ذریعے اپنی قابلیت جانچیں، اور فوری تصدیق شدہ کیو آر کوڈ سرٹیفکیٹس حاصل کریں۔',
    bannerText: '🚀 لرن ہب خصوصی آفر: کوپن کوڈ LEARN20 استعمال کریں اور 20% رعایت حاصل کریں!',
    bannerActive: true,
    aboutText: 'لرن ہب ایک جدید ترین دینی و تعلیمی لرننگ مینجمنٹ سسٹم ہے جو طلباء اور علمائے کرام کے لیے تیار کیا گیا ہے۔ ہم مستند نصاب اور آزادانہ تشخیصی امتحانات کا ایک شاندار امتزاج پیش کرتے ہیں۔',
    faqs: [
      { id: 'faq-1', category: 'کوئزز و امتحانات', question: 'آزادانہ امتحانی کوئزز (Standalone Quizzes) کس طرح کام کرتے ہیں؟', answer: 'لرن ہب پر کوئزز کسی کورس کے محتاج نہیں ہیں۔ آپ بغیر کسی کورس میں داخلہ لیے براہِ راست اپنی پسند کا کوئز منتخب کر کے مقررہ ٹائمر کے ساتھ ٹیسٹ دے سکتے ہیں اور ٹیسٹ کے فوری بعد ہر سوال کی تفصیلی شرعی و علمی وضاحت دیکھ سکتے ہیں۔' },
      { id: 'faq-2', category: 'اسناد و سرٹیفکیٹس', question: 'کیا لرن ہب کے سرٹیفکیٹس ڈیجیٹل طور پر تصدیق کے قابل ہیں؟', answer: 'جی ہاں! کورس کامیابی سے مکمل کرنے یا آزاد کوئز پاس کرنے پر جاری ہونے والے ہر سرٹیفکیٹ کا ایک منفرد سیریل نمبر، کیو آر کوڈ (QR Code) اور مستقل آن لائن لنک (مثلاً #/verify-cert/LH-CERT-2026-8841) ہوتا ہے جس کی مدد سے کوئی بھی ادارہ دنیا بھر سے تصدیق کر سکتا ہے۔' },
      { id: 'faq-3', category: 'فیس و رجسٹریشن', question: 'کیا تمام اسلامی کورسز اور امتحانی کوئزز مفت ہیں؟', answer: 'الحمد للہ! لرن ہب پر قرآنی تجوید، علوم الحدیث، فقہ العبادات، سیرت النبی ﷺ اور آزادانہ تشخیصی کوئزز طلباء کے لیے بالکل مفت اور بلا معاوضہ فراہم کیے گئے ہیں تاکہ علمِ نافع ہر خاص و عام تک پہنچ سکے۔' },
      { id: 'faq-4', category: 'وسائل و مواد', question: 'کیا آف لائن مطالعہ کے لیے کتب اور پی ڈی ایف نوٹس ڈاؤن لوڈ کیے جا سکتے ہیں؟', answer: 'جی بالکل! ہر سبق اور کورس کے ساتھ متعلقہ پی ڈی ایف (PDF) تجوید چارٹس، احادیث کی اسناد کا خلاصہ اور نوٹس فراہم کیے جاتے ہیں جنہیں آپ "وسائل و مواد" سیکشن سے باآسانی ڈاؤن لوڈ کر سکتے ہیں۔' }
    ]
  },

  users: [
    {
      id: 'usr-admin',
      name: 'جمیل رحمن انصاری',
      firstName: 'جمیل',
      lastName: 'انصاری',
      email: 'jrahmanansari@gmail.com',
      password: 'Jamil132@#@#',
      role: 'super_admin',
      status: 'active',
      emailVerified: true,
      avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
      phone: '+92 300 1234567',
      country: 'PK',
      language: 'ur',
      headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
      bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
      learningStreak: 15,
      totalPoints: 5000,
      createdAt: '2026-01-01T00:00:00Z'
    }
  ],

  categories: [
    { id: 'cat-1', name: 'قرآنی علوم و تجوید', slug: 'quran-tajweed', icon: 'book-open', description: 'مخارج الحروف، ترتیل و قراءت اور فہمِ قرآن کے جامع کورسز۔', color: '#059669' },
    { id: 'cat-2', name: 'علوم الحدیث و سنن', slug: 'hadith-sciences', icon: 'sparkles', description: 'اربعین نووی، صحاح ستہ اور اصولِ حدیث کا مفصل مطالعہ۔', color: '#d97706' },
    { id: 'cat-3', name: 'فقہ اسلامی و مسائل', slug: 'islamic-fiqh', icon: 'shield-check', description: 'طہارت، نماز، روزہ، زکوٰۃ، حج اور روزمرہ کے شرعی احکام۔', color: '#4f46e5' },
    { id: 'cat-4', name: 'سیرت النبی ﷺ و تاریخ', slug: 'seerah-history', icon: 'heart', description: 'حضور اکرم ﷺ کی حیات طیبہ، غزوات اور اسلامی تاریخ کا مطالعہ۔', color: '#0284c7' },
    { id: 'cat-5', name: 'عربی گرامر، نحو و صرف', slug: 'arabic-grammar', icon: 'feather', description: 'قرآن فہمی کے لیے آسان عربی زبان، نحو، صرف اور لغت۔', color: '#7c3aed' },
    { id: 'cat-6', name: 'اسلامی عقائد و اخلاقیات', slug: 'aqeedah-ethics', icon: 'compass', description: 'توحید، رسالت، تزکیۂ نفس، محاسبۂ باطن اور اسلامی اخلاق۔', color: '#db2777' }
  ],

  instructors: [
    {
      id: 'inst-1',
      userId: 'usr-jamil',
      name: 'شیخ ڈاکٹر محمد الہاشمی',
      title: 'استاذ علوم القرآن، جامعہ ازہر (Ph.D.)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'جامعہ ازہر سے قرآنی علوم اور قراءاتِ عشرہ میں پی ایچ ڈی۔ 20 سالہ تدریسی تجربہ اور متعدد تفسیری کتب کے مصنف۔',
      rating: 4.98,
      studentsCount: 38450,
      coursesCount: 6,
      expertise: ['تجوید و قراءات', 'تفسیر القرآن', 'علوم القرآن']
    },
    {
      id: 'inst-2',
      userId: null,
      name: 'مفتی عبد الرحمن القادری',
      title: 'صدر مفتی دار الافتاء و محقق فقہ اسلامی',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: 'فقہ اسلامی، اصولِ فقہ اور جدید مالیاتی مسائل پر عبور۔ ہزاروں فتاویٰ کے نگراں اور مستند مدرس۔',
      rating: 4.94,
      studentsCount: 29120,
      coursesCount: 5,
      expertise: ['فقہ العبادات', 'اصول فقہ', 'معاملات']
    },
    {
      id: 'inst-3',
      userId: null,
      name: 'ڈاکٹر انیس احمد صدیقی',
      title: 'استاد علوم الحدیث و محقق اسماء الرجال',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      bio: 'صحیح بخاری، صحیح مسلم اور اربعین نووی کی اسنادی و متنی تحقیق کے ماہر اور درجنوں علمی تحقیقی مقالات کے مصنف۔',
      rating: 4.96,
      studentsCount: 24800,
      coursesCount: 4,
      expertise: ['اربعین نووی', 'اصول حدیث', 'سیرت النبی ﷺ']
    },
    {
      id: 'inst-4',
      userId: null,
      name: 'استاذہ فاطمہ الزہراء',
      title: 'ماہرہ تجوید و زبانِ عربی',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      bio: 'قرآنی عربی زبان، نحو و صرف اور تجوید کی مستند معلّمہ۔ طالبات کے لیے آسان فہم اسباق کی تخلیق کار۔',
      rating: 4.92,
      studentsCount: 19600,
      coursesCount: 3,
      expertise: ['قرآنی عربی', 'نحو و صرف', 'حفظ و تجوید']
    }
  ],

  courses: [
    {
      id: 'crs-isl-1',
      title: 'قرآنی تجوید و قراءت ماسٹر کلاس (مخارج و صفات الحروف)',
      slug: 'quran-tajweed-masterclass',
      categoryId: 'cat-1',
      instructorId: 'inst-1',
      thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
      badge: 'سب سے مقبول',
      level: 'ابتدائی تا ایڈوانس',
      language: 'اردو / عربی',
      price: 0.00,
      originalPrice: 49.99,
      isFree: true,
      status: 'published',
      rating: 4.99,
      ratingCount: 3420,
      durationHours: 24.5,
      enrolledCount: 18400,
      shortDescription: 'قرآن مجید کو ترتیل، درست مخارج، قلقلہ، ادغام اور مدّات کے مستند قواعد کے ساتھ پڑھنا سیکھیں۔',
      description: 'یہ جامع ماسٹر کلاس آپ کو مخارج الحروف، صفاتِ لازمہ و عارضہ، نون ساکن و تنوین کے احکام اور وقف و ابتدا کے تمام اصول عملی مشقوں کے ساتھ سکھاتی ہے۔',
      learningOutcomes: [
        'تمام 29 عربی حروف کے درست مخارج اور تلفظ کی ادائیگی',
        'نون ساکن و تنوین کے چاروں احکام (اظہار، ادغام، اقلاب، اخفاء)',
        'میم ساکن کے احکام اور قلقلہ کے مراتب کی پہچان',
        'مدّ کی اقسام (مد اصلی، مد فرعی، مد لازم و متصل)',
        'قرآن مجید کی درست و پر اثر تلاوت کی صلاحیت'
      ],
      requirements: [
        'قرآن مجید کا بنیادی ناظرہ جاننا',
        'سیکھنے کا خلوص اور شوق'
      ],
      updatedAt: '2026-02-18'
    },
    {
      id: 'crs-isl-2',
      title: 'تفسیر و تفہیم القرآن: سورۃ الکہف و منتخب سورتیں',
      slug: 'tafseer-surah-kahf-masterclass',
      categoryId: 'cat-1',
      instructorId: 'inst-1',
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=800',
      badge: 'خصوصی کورس',
      level: 'متوسط',
      language: 'اردو',
      price: 0.00,
      originalPrice: 39.99,
      isFree: true,
      status: 'published',
      rating: 4.97,
      ratingCount: 2180,
      durationHours: 18.0,
      enrolledCount: 14200,
      shortDescription: 'سورۃ الکہف کے چار عظیم الشان قصص (اصحابِ کہف، صاحب الجنتین، موسیٰ و خضرؑ، ذوالقرنین) اور فتنہ دجال سے حفاظت کے اسباق۔',
      description: 'سورۃ الکہف اور آخری پارے کی منتخب سورتوں کا گہرا تفسیری مطالعہ۔ آیات کے اسبابِ نزول، فقہی نکات اور دورِ حاضر کے فتنوں سے نمٹنے کے لیے قرآنی رہنمائی۔',
      learningOutcomes: [
        'سورۃ الکہف کے 4 بنیادی قصص اور ان کے گہرے روحانی اسباق',
        'فتنہ دجال، مادہ پرستی اور جدید چیلنجز کا قرآنی حل',
        'شانِ نزول اور سورت کے باہمی ربط کا ادراک',
        'قرآنی دعاؤں اور اخلاقی پیغامات کو عملی زندگی میں اپنانا'
      ],
      requirements: [
        'اردو فہم اور قرآن پڑھنے کی بنیادی صلاحیت'
      ],
      updatedAt: '2026-02-15'
    },
    {
      id: 'crs-isl-3',
      title: 'اربعین نووی اور اصولِ حدیث کا جامع ڈپلوما',
      slug: '40-hadith-nawawi-diploma',
      categoryId: 'cat-2',
      instructorId: 'inst-3',
      thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800',
      badge: 'جامع ڈپلوما',
      level: 'تمام طلباء کے لیے',
      language: 'اردو / عربی',
      price: 0.00,
      originalPrice: 59.99,
      isFree: true,
      status: 'published',
      rating: 4.98,
      ratingCount: 2890,
      durationHours: 26.0,
      enrolledCount: 16500,
      shortDescription: 'امام نوویؒ کی منتخب 40 احادیثِ مبارکہ کا مکمل متن، مستند ترجمہ، تشریح اور اصولِ حدیث کے بنیادی قواعد۔',
      description: 'اربعین نووی دینِ اسلام کا خلاصہ ہے۔ اس کورس میں تمام 40 احادیث کے فقہی احکام، اخلاقی تعلیمات اور راویوں کے حالات پر سیر حاصل گفتگو کی گئی ہے۔',
      learningOutcomes: [
        'اربعین نووی کی تمام 40 احادیث کا عربی متن اور مفہوم',
        'صحیح، حسن اور ضعیف احادیث کے اصطلاحی فرق کی سمجھ',
        'نیت کے اخلاص سے لے کر حقوق العباد تک اسلامی احکام کی تفہیم',
        'احادیث کو حفظ کرنے اور زندگی میں نافذ کرنے کی مشق'
      ],
      requirements: [
        'احادیثِ نبوی ﷺ سے محبت اور سیکھنے کا عزم'
      ],
      updatedAt: '2026-02-17'
    },
    {
      id: 'crs-isl-4',
      title: 'فقہ العبادات: طہارت، نماز، روزہ، زکوٰۃ و حج کے احکام',
      slug: 'fiqh-ibadat-masterclass',
      categoryId: 'cat-3',
      instructorId: 'inst-2',
      thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800',
      badge: 'فرضِ عین علم',
      level: 'ابتدائی تا متوسط',
      language: 'اردو',
      price: 0.00,
      originalPrice: 45.00,
      isFree: true,
      status: 'published',
      rating: 4.96,
      ratingCount: 1950,
      durationHours: 22.0,
      enrolledCount: 13800,
      shortDescription: 'روزمرہ عبادات کے درست شرعی مسائل: وضو، غسل، سنت کے مطابق نماز، سجدہ سہو، زکوٰۃ کا حساب اور روزے کے احکام۔',
      description: 'ایک مسلمان کے لیے اپنی بنیادی عبادات کے احکام جاننا فرض ہے۔ اس کورس میں قرآن و سنت اور فقہی کتب کی روشنی میں تمام مسائل آسان اردو میں سمجھائے گئے ہیں۔',
      learningOutcomes: [
        'وضو، تیمم اور غسل کے فرائض و سنن کا مکمل علم',
        'حضور ﷺ کے طریقے پر نماز پنجگانہ، نمازِ جنازہ اور تراویح',
        'سجدہ سہو اور نماز کو توڑنے والی چیزوں کے تفصیلی احکام',
        'زکوٰۃ کا نصاب نکالنے کا عملی طریقہ کار اور مصارفِ زکوٰۃ',
        'روزے کے مفسدات، مکروہات اور قضاء و کفارہ کے مسائل'
      ],
      requirements: [
        'کوئی پیشگی شرط نہیں، ہر مسلمان کے لیے ضروری کورس'
      ],
      updatedAt: '2026-02-12'
    },
    {
      id: 'crs-isl-5',
      title: 'سیرت سرورِ کونین حضرت محمد مصطفیٰ ﷺ کا مفصل مطالعہ',
      slug: 'seerah-prophet-muhammad-masterclass',
      categoryId: 'cat-4',
      instructorId: 'inst-3',
      thumbnail: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
      badge: 'ایمان افروز',
      level: 'تمام درجات',
      language: 'اردو',
      price: 0.00,
      originalPrice: 49.99,
      isFree: true,
      status: 'published',
      rating: 5.0,
      ratingCount: 4200,
      durationHours: 30.0,
      enrolledCount: 22100,
      shortDescription: 'ولادتِ باسعادت سے لے کر وصال تک حضور نبی اکرم ﷺ کی حیات طیبہ، اخلاقِ حسنہ، غزوات اور انسانیت کے لیے رحمت کا پیغام۔',
      description: 'سیرت النبی ﷺ کا مطالعہ ہر مسلمان کے ایمان کی بنیاد ہے۔ اس کورس میں مکی اور مدنی دور، میثاقِ مدینہ، فتح مکہ اور خطبہ حجۃ الوداع کے لافانی اسباق شامل ہیں۔',
      learningOutcomes: [
        'حضور اکرم ﷺ کی ولادت، بچپن، جوانی اور اعلانِ نبوت کے حالات',
        'مکی دور کے مصائب، صبر و استقامت اور ہجرتِ مدینہ کے اسباق',
        'مدنی دور کی فتوحات، عادلانہ نظامِ ریاست اور بین الاقوامی معاہدات',
        'حضور ﷺ کی خانگی زندگی، اصحاب سے حسنِ سلوک اور اخلاقِ عالیہ',
        'خطبہ حجۃ الوداع کا انسانی حقوق کا عظیم الشان چارٹر'
      ],
      requirements: [
        'عشقِ رسول ﷺ اور سیرت سیکھنے کا پاکیزہ جذبہ'
      ],
      updatedAt: '2026-02-18'
    },
    {
      id: 'crs-isl-6',
      title: 'آسان قرآنی عربی زبان، نحو و صرف ماسٹر کورس',
      slug: 'quranic-arabic-grammar-masterclass',
      categoryId: 'cat-5',
      instructorId: 'inst-4',
      thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      badge: 'قرآن فہمی',
      level: 'ابتدائی تا متوسط',
      language: 'اردو / عربی',
      price: 0.00,
      originalPrice: 55.00,
      isFree: true,
      status: 'published',
      rating: 4.95,
      ratingCount: 1650,
      durationHours: 28.0,
      enrolledCount: 11200,
      shortDescription: 'بغیر ترجمہ دیکھے براہ راست قرآن مجید کی عربی زبان سمجھنے کے لیے آسان نحو و صرف اور قواعد کا کورس۔',
      description: 'اگر آپ نماز میں تلاوت کو براہ راست سمجھنا چاہتے ہیں تو یہ کورس آپ کے لیے ہے۔ اسم، فعل، حرف، مرکبات، گردانیں اور قرآنی آیات کی لغوی ترکیبیں۔',
      learningOutcomes: [
        'اسم، فعل اور حرف کی پہچان اور اعراب کے قواعد',
        'مرکب توصیفی، اضافی، اشاری اور جاری کی ترکیب',
        'فعل ماضی، مضارع اور امر کی گردانیں اور صیغوں کی پہچان',
        'قرآن مجید کے 80% کثرت سے مستعمل الفاظ کا ذخیرہ'
      ],
      requirements: [
        'عربی ناظرہ پڑھنے کی صلاحیت'
      ],
      updatedAt: '2026-02-14'
    }
  ],

  lessons: [
    // Course 1: Tajweed Lessons
    {
      id: 'les-isl-101',
      courseId: 'crs-isl-1',
      order: 1,
      title: 'علمِ تجوید کا تعارف، فضیلت اور حروف کے مخارج کا نقشہ',
      durationMinutes: 20,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'تجوید کی اہمیت، لحن جلی و خفی کا فرق اور 17 مخارج کا تفصیلی نقشہ۔',
      resources: [{ title: 'مخارج الحروف چارٹ PDF', url: '#/resources', type: 'pdf', size: '2.5 MB' }]
    },
    {
      id: 'les-isl-102',
      courseId: 'crs-isl-1',
      order: 2,
      title: 'نون ساکن اور تنوین کے چار بنیادی احکام (اظہار، ادغام، اقلاب، اخفاء)',
      durationMinutes: 30,
      type: 'text',
      contentBody: `### نون ساکن و تنوین کے چار احکام

1. **اظہار (Clear Pronunciation)**: جب نون ساکن یا تنوین کے بعد حروفِ حلقی (ء، ہ، ع، ح، غ، خ) آئیں تو بغیر غنہ کے واضح پڑھا جائے گا۔ جیسے: *مَنْ آمَنَ*۔
2. **ادغام (Merging)**: جب حروفِ یرملون (ی، ر، م، ل، و، ن) آئیں تو نون کو ملا کر پڑھا جائے گا۔
3. **اقلاب (Conversion)**: جب حرف "ب" آئے تو نون کو چھوٹی میم سے بدل کر غنہ کے ساتھ پڑھا جائے گا۔ جیسے: *مِنْ بَعْدِ*۔
4. **اخفاء (Concealment)**: بقیہ 15 حروف میں نون کی آواز کو ناک کے پردے میں چھپا کر پڑھا جاتا ہے۔`,
      isFreePreview: true,
      resources: []
    },

    // Course 3: Nawawi Lessons
    {
      id: 'les-isl-301',
      courseId: 'crs-isl-3',
      order: 1,
      title: 'امام نوویؒ کا تعارف اور پہلی حدیث (إنما الأعمال بالنيات) کی تشریح',
      durationMinutes: 25,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'امام محی الدین النوویؒ کی سوانح حیات اور اخلاصِ نیت کی بنیادی حدیث کا درس۔',
      resources: [{ title: 'متن اربعین نووی عربی و اردو PDF', url: '#/resources', type: 'pdf', size: '3.2 MB' }]
    },
    {
      id: 'les-isl-302',
      courseId: 'crs-isl-3',
      order: 2,
      title: 'حدیثِ جبرائیل (اسلام، ایمان اور احسان کے درجات)',
      durationMinutes: 35,
      type: 'text',
      contentBody: `### حدیثِ جبرائیل کا خلاصہ و مفاہیم

یہ حدیث دین کی امّ الکتاب (جڑ) کہلاتی ہے۔ اس میں تین بنیادی درجات بیان ہوئے ہیں:

1. **اسلام (ظاہری ارکان)**: توحید کی گواہی، نماز، زکوٰۃ، روزہ اور حج۔
2. **ایمان (باطنی عقائد)**: اللہ، فرشتوں، آسمانی کتابوں، رسولوں، آخرت اور تقدیر پر کامل یقین۔
3. **احسان (روحانی کمال)**: اللہ کی عبادت اس طرح کرنا گویا تم اسے دیکھ رہے ہو، یا کم از کم یہ احساس رکھنا کہ وہ تمہیں دیکھ رہا ہے۔`,
      isFreePreview: true,
      resources: []
    }
  ],

  // STANDALONE QUIZZES MODULE (Completely independent from courses)
  quizzes: [
    {
      id: 'qz-isl-1',
      title: 'قرآن فہمی، تجوید اور سورتوں کے اہم مضامین کا ٹیسٹ',
      slug: 'quran-tajweed-comprehension-quiz',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'قرآن مجید کی سورتوں کے بنیادی مضامین، مکی و مدنی احکام اور تجوید کے اہم قواعد کی جانچ۔',
      instructions: 'آپ کے پاس کل 10 منٹ ہیں۔ تمام سوالات کے جوابات دیں، ضرورت پڑنے پر 50-50 لائف لائن استعمال کر سکتے ہیں۔',
      participantsCount: 4520,
      passRate: 92,
      averageScore: 88,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-isl-2',
      title: 'علم الحدیث اور سیرت النبی ﷺ جامع امتحان',
      slug: 'hadith-sciences-seerah-quiz',
      categoryId: 'cat-2',
      difficulty: 'Intermediate',
      timeLimitMinutes: 12,
      passingPercentage: 75,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'صحاح ستہ، اسماء الرجال کی اصطلاحات، اور حضور نبی اکرم ﷺ کی حیات طیبہ پر جامع امتحانی کوئز۔',
      instructions: '12 منٹ کے اندر سوالات مکمل کریں۔ ٹیسٹ کے اختتام پر تصدیقی سرٹیفکیٹ جاری ہوگا۔',
      participantsCount: 3890,
      passRate: 86,
      averageScore: 84,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-isl-3',
      title: 'فقہ العبادات و احکامِ شریعت تشخیصی کوئز',
      slug: 'fiqh-ibadat-quiz',
      categoryId: 'cat-3',
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'وضو، نماز کے فرائض، سجدہ سہو اور روزے کے بنیادی مسائل کی شرعی جانچ۔',
      instructions: '10 منٹ میں تمام بنیادی فقہی سوالات حل کریں۔',
      participantsCount: 2940,
      passRate: 90,
      averageScore: 86,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-isl-4',
      title: 'جامع اربعین نووی فہم و بصیرت ٹیسٹ',
      slug: '40-hadith-nawawi-quiz',
      categoryId: 'cat-2',
      difficulty: 'Advanced',
      timeLimitMinutes: 15,
      passingPercentage: 75,
      maxAttempts: 3,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'اربعین نووی کی بنیادی احادیث کے مفاہیم اور ان سے مستنبط ہونے والے احکام کا ٹیسٹ۔',
      instructions: '15 منٹ کا وقت ہے۔ ہر سوال کی مکمل تفصیل اور حوالہ آخر میں دیا جائے گا۔',
      participantsCount: 2150,
      passRate: 84,
      averageScore: 82,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-isl-5',
      title: 'قرآنی عربی گرامر، نحو و صرف امتحانی چیلنج',
      slug: 'quranic-arabic-grammar-quiz',
      categoryId: 'cat-5',
      difficulty: 'Intermediate',
      timeLimitMinutes: 12,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'اسم، فعل، حرف، مرکبات اور صیغوں کی پہچان کی جانچ کے لیے خصوصی کوئز۔',
      instructions: '12 منٹ کے اندر سوالات حل کریں۔',
      participantsCount: 1820,
      passRate: 80,
      averageScore: 79,
      createdAt: '2026-02-18'
    }
  ],

  quizQuestions: [
    // Islamic Quiz 1 Questions (Quran & Tajweed)
    {
      id: 'qq-isl-101',
      quizId: 'qz-isl-1',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'قرآن مجید کی سب سے بڑی اور طویل ترین سورت کون سی ہے؟',
      options: ['سورۃ آل عمران', 'سورۃ البقرہ', 'سورۃ النساء', 'سورۃ المائدہ'],
      correctAnswerIndex: 1,
      explanation: 'سورۃ البقرہ قرآن مجید کی سب سے بڑی سورت ہے، جس میں کل 286 آیات اور قرآن کی سب سے طویل آیت (آیت الدین - 282) اور آیت الکرسی (255) شامل ہیں۔'
    },
    {
      id: 'qq-isl-102',
      quizId: 'qz-isl-1',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'علمِ تجوید میں "قلقلہ" کے حروف کتنے ہیں اور وہ کون سے ہیں؟',
      options: ['3 حروف (ا، و، ی)', '5 حروف (ق، ط، ب، ج، د)', '6 حروف (حلق والے حروف)', '4 حروف (ن، م، و، ی)'],
      correctAnswerIndex: 1,
      explanation: 'قلقلہ کے 5 حروف ہیں جن کا مجموعہ "قُطْبُ جَدٍّ" (ق، ط، ب، ج، د) ہے۔ جب یہ حروف ساکن ہوں تو ان میں آواز کی جنبش (Echo) پیدا ہوتی ہے۔'
    },
    {
      id: 'qq-isl-103',
      quizId: 'qz-isl-1',
      order: 3,
      type: 'true_false',
      marks: 10,
      questionText: 'سورۃ التوبہ قرآن مجید کی واحد سورت ہے جس کے شروع میں "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" نہیں لکھی جاتی۔',
      options: ['صحیح (True)', 'غلط (False)'],
      correctAnswerIndex: 0,
      explanation: 'صحیح۔ سورۃ التوبہ کے آغاز میں تسمیہ نہیں پڑھی جاتی کیونکہ یہ مشرکین کے ساتھ معاہدات ختم کرنے اور غضبِ الٰہی کا اظہار ہے۔'
    },

    // Islamic Quiz 2 Questions (Hadith & Seerah)
    {
      id: 'qq-isl-201',
      quizId: 'qz-isl-2',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'حدیثِ مبارکہ کی مشہور ترین کتاب "صحیح بخاری" کے مؤلف کا پورا نام کیا ہے؟',
      options: ['امام مسلم بن الحجاج', 'امام محمد بن اسماعیل البخاری', 'امام ابو عیسیٰ الترمذی', 'امام احمد بن حنبل'],
      correctAnswerIndex: 1,
      explanation: 'صحیح بخاری کے مؤلف کا نام امام ابو عبد اللہ محمد بن اسماعیل البخاری رحمۃ اللہ علیہ (194ھ - 256ھ) ہے۔'
    },
    {
      id: 'qq-isl-202',
      quizId: 'qz-isl-2',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'حضور نبی اکرم ﷺ نے نبوت کے بعد مدینہ منورہ کی طرف ہجرت کس سن عیسوی میں فرمائی؟',
      options: ['610 عیسوی', '622 عیسوی', '630 عیسوی', '632 عیسوی'],
      correctAnswerIndex: 1,
      explanation: 'ہجرتِ مدینہ 622ء میں ہوئی جس سے اسلامی تقویم (ہجری سال) کا آغاز ہوا۔'
    },

    // Islamic Quiz 3 Questions (Fiqh)
    {
      id: 'qq-isl-301',
      quizId: 'qz-isl-3',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'وضو کے بنیادی فرائض کتنے ہیں؟',
      options: ['3 فرائض', '4 فرائض', '6 فرائض', '7 فرائض'],
      correctAnswerIndex: 1,
      explanation: 'وضو کے 4 فرائض ہیں: چہرہ دھونا، کہنیوں سمیت دونوں ہاتھ دھونا، چوتھائی سر کا مسح کرنا، اور ٹخنوں سمیت دونوں پاؤں دھونا۔'
    },

    // Islamic Quiz 4 Questions (Nawawi)
    {
      id: 'qq-isl-401',
      quizId: 'qz-isl-4',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'اربعین نووی کی پہلی حدیث مبارکہ کا راوی کون سے صحابی رسول ہیں؟',
      options: ['حضرت ابوبکر صدیقؓ', 'حضرت عمر بن الخطابؓ', 'حضرت علی المرتضیٰؓ', 'حضرت عثمان غنیؓ'],
      correctAnswerIndex: 1,
      explanation: 'حدیثِ إنما الأعمال بالنيات کے راوی حضرت امیر المؤمنین عمر بن الخطاب رضی اللہ عنہ ہیں۔'
    }
  ],

  // Real Dynamic Collections (Empty on fresh install until authentic student/user actions)
  quizAttempts: [],
  enrollments: [],
  certificates: [],
  userAchievements: [],
  activityLogs: [],
  reviews: [],
  wishlist: [],
  bookmarks: [],

  notifications: [
    {
      id: 'notif-1',
      userId: 'usr-1',
      type: 'certificate',
      title: 'Certificate Issued!',
      message: 'Congratulations! You completed "Data Science & Machine Learning with Python Bootcamp" and earned your verified certificate.',
      link: '#/certificates',
      read: false,
      createdAt: '2026-02-02T16:02:00Z'
    },
    {
      id: 'notif-2',
      userId: 'usr-1',
      type: 'quiz',
      title: 'Perfect Quiz Score',
      message: 'You scored 100% on JavaScript Core & Modern ES6+ Proficiency Exam!',
      link: '#/quizzes/qz-1',
      read: false,
      createdAt: '2026-02-14T14:30:00Z'
    },
    {
      id: 'notif-3',
      userId: 'usr-1',
      type: 'announcement',
      title: 'New AI Masterclass Released',
      message: 'Check out the newly updated PyTorch 2.0 & Transformer modules.',
      link: '#/courses/crs-2',
      read: true,
      createdAt: '2026-02-10T09:00:00Z'
    }
  ],

  announcements: [
    {
      id: 'ann-1',
      title: 'LearnHub 2026 Global AI & Cloud Certification Challenge',
      content: 'Participate in our monthly diagnostic challenge. Top performers in standalone quizzes earn exclusive tuition credits and verified badge upgrades.',
      targetAudience: 'All Learners',
      priority: 'urgent',
      status: 'active',
      createdAt: '2026-02-01',
      expiresAt: '2026-03-31'
    }
  ],

  discussions: [
    {
      id: 'disc-1',
      courseId: 'crs-1',
      lessonId: 'les-103',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: 'How should we handle caching when mutating data with Server Actions?',
      body: 'When calling revalidatePath() inside a server action, does it invalidate both the data cache and full route cache automatically?',
      upvotes: 14,
      upvotedBy: ['usr-1', 'usr-3'],
      createdAt: '2026-02-15T16:00:00Z',
      replies: [
        {
          id: 'rep-1',
          userId: 'usr-2',
          userName: 'Dr. Sarah Chen',
          userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          isInstructor: true,
          body: 'Great question Alex! Yes, revalidatePath() purges the data cache for the matching path segments and immediately triggers a background revalidation for subsequent requests.',
          createdAt: '2026-02-15T17:30:00Z',
          upvotes: 8
        }
      ]
    }
  ],

  resources: [
    { id: 'res-1', title: 'Complete Full-Stack Architecture Roadmap 2026', category: 'Web Development', format: 'PDF', size: '3.4 MB', downloadsCount: 4120, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-2', title: 'Deep Learning & Transformer Math Cheat Sheet', category: 'Artificial Intelligence', format: 'PDF', size: '2.1 MB', downloadsCount: 2980, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-3', title: 'AWS Cloud Architecture Well-Architected Template', category: 'Cloud & DevOps', format: 'ZIP / Code', size: '1.2 MB', downloadsCount: 1840, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-4', title: 'Pandas & NumPy Data Wrangling Pocket Guide', category: 'Data Science', format: 'PDF', size: '1.8 MB', downloadsCount: 5600, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ],

  orders: [
    {
      id: 'ord-1001',
      orderNumber: 'LH-ORD-9021',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      items: [
        { id: 'crs-1', title: 'Modern Full-Stack Next.js & TypeScript Bootcamp', price: 79.99 }
      ],
      subtotal: 79.99,
      discount: 16.00,
      total: 63.99,
      couponCode: 'LEARN20',
      paymentMethod: 'Credit Card (Stripe)',
      status: 'completed',
      createdAt: '2026-01-15T11:00:00Z'
    }
  ],

  coupons: [
    { id: 'cp-1', code: 'LEARN20', discountType: 'percentage', discountValue: 20, minPurchase: 30, maxUsage: 1000, usedCount: 142, active: true, expiresAt: '2026-12-31' },
    { id: 'cp-2', code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minPurchase: 100, maxUsage: 500, usedCount: 88, active: true, expiresAt: '2026-12-31' },
    { id: 'cp-3', code: 'SUMMER10', discountType: 'percentage', discountValue: 10, minPurchase: 0, maxUsage: 2000, usedCount: 310, active: true, expiresAt: '2026-08-31' }
  ],

  supportTickets: [],

  mediaItems: [
    { id: 'med-1', name: 'nextjs-hero.jpg', type: 'image', size: '240 KB', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-10' },
    { id: 'med-2', name: 'ai-masterclass.jpg', type: 'image', size: '310 KB', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-12' },
    { id: 'med-3', name: 'cloud-devops.jpg', type: 'image', size: '280 KB', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-14' },
    { id: 'med-4', name: 'syllabus-guide.pdf', type: 'document', size: '1.2 MB', url: '#/resources', uploadedAt: '2026-01-15' }
  ],

  auditLogs: [],

  // Production-grade Auth & Security Collections
  sessions: [],

  emailVerifications: [],

  passwordResets: [],

  twoFactorSettings: [],

  loginAttempts: [],

  securityEvents: [
    {
      id: 'sec-101',
      userId: 'usr-jamil',
      eventType: 'LOGIN_SUCCESS',
      severity: 'info',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      description: 'Successful administrative login',
      timestamp: '2026-02-18T10:00:00Z'
    },
    {
      id: 'sec-102',
      userId: 'usr-1',
      eventType: 'LOGIN_SUCCESS',
      severity: 'info',
      ip: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      description: 'Successful user authentication',
      timestamp: '2026-02-18T14:00:00Z'
    }
  ],

  // =========================================================================
  // ISLAMIC ADVENTURE GAME ECOSYSTEM (CLASSES 1 TO 10 PROGRESSION)
  // =========================================================================
  gameWorlds: [
    {
      id: 'cls-1',
      worldNumber: 1,
      classGrade: 1,
      title: 'کلاس 1 — ابتدائی دینی ایڈونچر',
      subtitle: 'بنیادی حروف، کلمۂ طیبہ، اللہ کے نام، دعائیں اور اچھے اخلاق',
      description: 'چھوٹے بچوں کے لیے پہلا کلمہ، کھانے سونے کی دعائیں، اللہ تعالیٰ کی نعمتیں اور اچھے عادات کے کھیل۔',
      themeColor: '#f59e0b',
      gradient: 'from-amber-400 via-yellow-300 to-emerald-400',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: 'sparkles',
      totalStages: 5,
      unlockXp: 0,
      rewardBadge: 'badge-class-1-star'
    },
    {
      id: 'cls-2',
      worldNumber: 2,
      classGrade: 2,
      title: 'کلاس 2 — ارکانِ نماز و کلمات',
      subtitle: 'نماز کی عملی ترتیب، چھ کلمے، والدین کی خدمت اور چھوٹی سورتیں',
      description: 'نماز کے بنیادی ارکان، چھ کلموں کے معانی، سورۃ الاخلاص اور سچ بولنے کے سنہری اصول۔',
      themeColor: '#10b981',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: 'book-open',
      totalStages: 5,
      unlockXp: 400,
      rewardBadge: 'badge-class-2-star'
    },
    {
      id: 'cls-3',
      worldNumber: 3,
      classGrade: 3,
      title: 'کلاس 3 — وضو و طہارت اور ارکانِ اسلام',
      subtitle: 'وضو کے فرائض و سنن، ارکانِ اسلام، مسنون دعائیں اور قرآنی کلمات',
      description: 'وضو کی مرحلہ وار ترتیب، پنجگانہ ارکانِ اسلام، معوذتین اور اسلامی آدابِ معاشرت۔',
      themeColor: '#06b6d4',
      gradient: 'from-cyan-400 via-blue-400 to-indigo-400',
      badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      icon: 'sun',
      totalStages: 5,
      unlockXp: 900,
      rewardBadge: 'badge-class-3-star'
    },
    {
      id: 'cls-4',
      worldNumber: 4,
      classGrade: 4,
      title: 'کلاس 4 — بنیادی تجوید و قصص الانبیاء',
      subtitle: 'تجوید کے اصول، حضرت ابراہیم و اسماعیل علیہم السلام، سچائی و امانت',
      description: 'حروفِ حلقی و قلقلہ کی پہچان، قربانی و تعمیرِ کعبہ کی تاریخ، اور امانت و دیانت۔',
      themeColor: '#8b5cf6',
      gradient: 'from-purple-400 via-pink-400 to-rose-400',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: 'scroll',
      totalStages: 5,
      unlockXp: 1500,
      rewardBadge: 'badge-class-4-star'
    },
    {
      id: 'cls-5',
      worldNumber: 5,
      classGrade: 5,
      title: 'کلاس 5 — سیرتِ نبوی ﷺ و احادیثِ مبارکہ',
      subtitle: 'مکی دورِ حیات، اربعین نووی کی بنیادی احادیث اور اخلاقِ نبوی',
      description: 'ولادتِ باسعادت، اعلانِ نبوت، مکہ کے صبر آزما حالات اور احادیثِ مبارکہ کے مبارک متون۔',
      themeColor: '#f97316',
      gradient: 'from-orange-400 via-amber-400 to-yellow-400',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: 'shield-check',
      totalStages: 5,
      unlockXp: 2200,
      rewardBadge: 'badge-class-5-star'
    },
    {
      id: 'cls-6',
      worldNumber: 6,
      classGrade: 6,
      title: 'کلاس 6 — ہجرتِ مدینہ و احکامِ صوم',
      subtitle: 'ہجرت کے مراحل، مواخات، روزہ و رمضان کے احکام اور صحابۂ کرام',
      description: 'سفرِ ہجرت، مسجدِ نبوی کی تعمیر، رمضان المبارک کے فضائل اور جلیل القدر صحابہ کے کارنامے۔',
      themeColor: '#14b8a6',
      gradient: 'from-teal-400 via-emerald-400 to-lime-400',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      icon: 'heart',
      totalStages: 4,
      unlockXp: 3000,
      rewardBadge: 'badge-class-6-star'
    },
    {
      id: 'cls-7',
      worldNumber: 7,
      classGrade: 7,
      title: 'کلاس 7 — غزواتِ اسلام و احکامِ تجوید',
      subtitle: 'غزواتِ نبوی، تجوید کے تفصیلی احکام (ادغام، اخفاء)، اور زکوٰۃ کا نظام',
      description: 'غزوہ بدر، احد و خندق کی تاریخ، تجوید کے قواعد اور زکوٰۃ و صدقات کے مصارف۔',
      themeColor: '#6366f1',
      gradient: 'from-indigo-400 via-blue-500 to-cyan-400',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: 'landmark',
      totalStages: 4,
      unlockXp: 4000,
      rewardBadge: 'badge-class-7-star'
    },
    {
      id: 'cls-8',
      worldNumber: 8,
      classGrade: 8,
      title: 'کلاس 8 — مناسکِ حج و خلفائے راشدین',
      subtitle: 'حج و عمرہ کے احکام، چاروں خلفائے راشدین کا دور اور قرآنی حکمت',
      description: 'ارکانِ حج کا عملی نقشہ، حضرت ابوبکر، عمر، عثمان و علی رضی اللہ عنہم کا شاندار عہد۔',
      themeColor: '#ef4444',
      gradient: 'from-rose-400 via-orange-400 to-amber-400',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: 'compass',
      totalStages: 4,
      unlockXp: 5200,
      rewardBadge: 'badge-class-8-star'
    },
    {
      id: 'cls-9',
      worldNumber: 9,
      classGrade: 9,
      title: 'کلاس 9 — اسلامی تاریخ و مسلم سائنسدان',
      subtitle: 'بیت الحکمہ، مسلم ائمہ و سائنسدان، اور علوم القرآن کا ارتقاء',
      description: 'جابر بن حیان، خوارزمی، ابن الہیثم، کبار محدثین اور مکی و مدنی سورتوں کے اسرار۔',
      themeColor: '#a855f7',
      gradient: 'from-violet-500 via-purple-400 to-indigo-400',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: 'layers',
      totalStages: 4,
      unlockXp: 6600,
      rewardBadge: 'badge-class-9-star'
    },
    {
      id: 'cls-10',
      worldNumber: 10,
      classGrade: 10,
      title: 'کلاس 10 — اصولِ حدیث و گرینڈ چیمپئن شپ',
      subtitle: 'اصولِ حدیث، فقہی قواعد، اعجاز القرآن اور گرینڈ فائنل چیمپئن ٹرائل',
      description: 'صحیح، حسن، ضعیف کی جانچ، فقہی اجتہاد کے قواعد اور تمام 10 کلاسوں کا فائنل گولڈن چیمپئن ٹیسٹ۔',
      themeColor: '#eab308',
      gradient: 'from-yellow-400 via-amber-500 to-emerald-500',
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      icon: 'crown',
      totalStages: 4,
      unlockXp: 8200,
      rewardBadge: 'badge-class-10-grandmaster'
    }
  ],

  gameStages: [
    // Class 1 Stages (Levels 1 to 5)
    { id: 'stg-1-1', worldId: 'cls-1', stageNumber: 1, title: 'لیول 1 — کلمۂ طیبہ کے الفاظ کا نگینہ', type: 'verse_gem_bank', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 150, rewardCoins: 50, icon: 'gem' },
    { id: 'stg-1-2', worldId: 'cls-1', stageNumber: 2, title: 'لیول 2 — اللہ تعالیٰ کے پیارے نام (Memory Match)', type: 'memory_match', difficulty: 'easy', timeLimitSeconds: 70, rewardXp: 180, rewardCoins: 60, icon: 'grid' },
    { id: 'stg-1-3', worldId: 'cls-1', stageNumber: 3, title: 'لیول 3 — کھانے اور سونے کی دعائیں (ترتیب)', type: 'sequential_order', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 200, rewardCoins: 70, icon: 'layers' },
    { id: 'stg-1-4', worldId: 'cls-1', stageNumber: 4, title: 'لیول 4 — اچھے اور برے کام (تیز فیصلہ)', type: 'rapid_binary', difficulty: 'easy', timeLimitSeconds: 45, rewardXp: 220, rewardCoins: 80, icon: 'zap' },
    { id: 'stg-1-5', worldId: 'cls-1', stageNumber: 5, title: '👑 لیول 5 — کلاس 1 کا گولڈن چیمپئن ٹیسٹ', type: 'boss', difficulty: 'medium', timeLimitSeconds: 120, rewardXp: 450, rewardCoins: 150, icon: 'trophy' },

    // Class 2 Stages (Levels 1 to 5)
    { id: 'stg-2-1', worldId: 'cls-2', stageNumber: 1, title: 'لیول 1 — نماز کے ارکان کی عملی ترتیب', type: 'sequential_order', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 160, rewardCoins: 55, icon: 'layers' },
    { id: 'stg-2-2', worldId: 'cls-2', stageNumber: 2, title: 'لیول 2 — چھ کلموں کے نام اور معانی', type: 'term_connector', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 190, rewardCoins: 65, icon: 'link' },
    { id: 'stg-2-3', worldId: 'cls-2', stageNumber: 3, title: 'لیول 3 — سورۃ الاخلاص کے کلمات کا پزل', type: 'verse_gem_bank', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 210, rewardCoins: 75, icon: 'gem' },
    { id: 'stg-2-4', worldId: 'cls-2', stageNumber: 4, title: 'لیول 4 — اسلامی آداب اور سچائی', type: 'knowledge', difficulty: 'easy', timeLimitSeconds: 60, rewardXp: 230, rewardCoins: 85, icon: 'check-circle' },
    { id: 'stg-2-5', worldId: 'cls-2', stageNumber: 5, title: '👑 لیول 5 — کلاس 2 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'medium', timeLimitSeconds: 120, rewardXp: 480, rewardCoins: 180, icon: 'trophy' },

    // Class 3 Stages (Levels 1 to 5)
    { id: 'stg-3-1', worldId: 'cls-3', stageNumber: 1, title: 'لیول 1 — وضو کے فرائض و سنن کی ترتیب', type: 'sequential_order', difficulty: 'medium', timeLimitSeconds: 70, rewardXp: 180, rewardCoins: 60, icon: 'layers' },
    { id: 'stg-3-2', worldId: 'cls-3', stageNumber: 2, title: 'لیول 2 — ارکانِ اسلام کی تفریق (تیز فیصلہ)', type: 'rapid_binary', difficulty: 'medium', timeLimitSeconds: 45, rewardXp: 200, rewardCoins: 70, icon: 'zap' },
    { id: 'stg-3-3', worldId: 'cls-3', stageNumber: 3, title: 'لیول 3 — معوذتین کے معانی (Memory Match)', type: 'memory_match', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 230, rewardCoins: 80, icon: 'grid' },
    { id: 'stg-3-4', worldId: 'cls-3', stageNumber: 4, title: 'لیول 4 — بڑوں اور ہمسایوں کے حقوق', type: 'knowledge', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 250, rewardCoins: 90, icon: 'check-circle' },
    { id: 'stg-3-5', worldId: 'cls-3', stageNumber: 5, title: '👑 لیول 5 — کلاس 3 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'medium', timeLimitSeconds: 120, rewardXp: 500, rewardCoins: 200, icon: 'trophy' },

    // Class 4 Stages
    { id: 'stg-4-1', worldId: 'cls-4', stageNumber: 1, title: 'لیول 1 — تجوید کے بنیادی قواعد (حروفِ حلقی و قلقلہ)', type: 'knowledge', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 200, rewardCoins: 70, icon: 'book-open' },
    { id: 'stg-4-2', worldId: 'cls-4', stageNumber: 2, title: 'لیول 2 — حضرت ابراہیم و اسماعیل (ع) کا امتحان', type: 'knowledge', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 230, rewardCoins: 80, icon: 'star' },
    { id: 'stg-4-3', worldId: 'cls-4', stageNumber: 3, title: 'لیول 3 — تجارت اور گفتگو میں امانت و دیانت', type: 'rapid_binary', difficulty: 'medium', timeLimitSeconds: 45, rewardXp: 260, rewardCoins: 90, icon: 'zap' },
    { id: 'stg-4-4', worldId: 'cls-4', stageNumber: 4, title: '👑 لیول 4 — کلاس 4 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'medium', timeLimitSeconds: 120, rewardXp: 550, rewardCoins: 220, icon: 'trophy' },

    // Class 5 Stages
    { id: 'stg-5-1', worldId: 'cls-5', stageNumber: 1, title: 'لیول 1 — سیرتِ نبوی ﷺ: مکی دور کے اہم سنگِ میل', type: 'sequential_order', difficulty: 'medium', timeLimitSeconds: 75, rewardXp: 220, rewardCoins: 80, icon: 'layers' },
    { id: 'stg-5-2', worldId: 'cls-5', stageNumber: 2, title: 'لیول 2 — اربعین نووی: پہلی 5 احادیث کا مفہوم', type: 'knowledge', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 260, rewardCoins: 90, icon: 'book-open' },
    { id: 'stg-5-3', worldId: 'cls-5', stageNumber: 3, title: 'لیول 3 — حیا، سچائی اور امانت کی پہچان', type: 'memory_match', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 300, rewardCoins: 100, icon: 'grid' },
    { id: 'stg-5-4', worldId: 'cls-5', stageNumber: 4, title: '👑 لیول 4 — کلاس 5 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'medium', timeLimitSeconds: 120, rewardXp: 600, rewardCoins: 250, icon: 'trophy' },

    // Class 6 Stages
    { id: 'stg-6-1', worldId: 'cls-6', stageNumber: 1, title: 'لیول 1 — ہجرتِ مدینہ کے تاریخی مراحل کی ترتیب', type: 'sequential_order', difficulty: 'medium', timeLimitSeconds: 80, rewardXp: 240, rewardCoins: 85, icon: 'layers' },
    { id: 'stg-6-2', worldId: 'cls-6', stageNumber: 2, title: 'لیول 2 — روزہ اور رمضان المبارک کے احکام', type: 'knowledge', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 280, rewardCoins: 95, icon: 'check-circle' },
    { id: 'stg-6-3', worldId: 'cls-6', stageNumber: 3, title: 'لیول 3 — مواخات اور جلیل القدر صحابۂ کرام', type: 'term_connector', difficulty: 'medium', timeLimitSeconds: 60, rewardXp: 320, rewardCoins: 110, icon: 'link' },
    { id: 'stg-6-4', worldId: 'cls-6', stageNumber: 4, title: '👑 لیول 4 — کلاس 6 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'hard', timeLimitSeconds: 120, rewardXp: 650, rewardCoins: 280, icon: 'trophy' },

    // Class 7 Stages
    { id: 'stg-7-1', worldId: 'cls-7', stageNumber: 1, title: 'لیول 1 — غزواتِ اسلام (بدر، احد، خندق) کا نقشہ', type: 'sequential_order', difficulty: 'hard', timeLimitSeconds: 80, rewardXp: 260, rewardCoins: 90, icon: 'layers' },
    { id: 'stg-7-2', worldId: 'cls-7', stageNumber: 2, title: 'لیول 2 — تجوید کے احکام (ادغام، اخفاء و اقلاب)', type: 'memory_match', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 300, rewardCoins: 105, icon: 'grid' },
    { id: 'stg-7-3', worldId: 'cls-7', stageNumber: 3, title: 'لیول 3 — زکوٰۃ کا نصاب اور مصارف کے مسائل', type: 'knowledge', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 340, rewardCoins: 120, icon: 'check-circle' },
    { id: 'stg-7-4', worldId: 'cls-7', stageNumber: 4, title: '👑 لیول 4 — کلاس 7 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'hard', timeLimitSeconds: 120, rewardXp: 700, rewardCoins: 300, icon: 'trophy' },

    // Class 8 Stages
    { id: 'stg-8-1', worldId: 'cls-8', stageNumber: 1, title: 'لیول 1 — مناسکِ حج کے مقامات کی عملی ترتیب', type: 'sequential_order', difficulty: 'hard', timeLimitSeconds: 85, rewardXp: 280, rewardCoins: 100, icon: 'layers' },
    { id: 'stg-8-2', worldId: 'cls-8', stageNumber: 2, title: 'لیول 2 — خلفائے راشدین کے ادوار اور فتوحات', type: 'knowledge', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 320, rewardCoins: 115, icon: 'shield' },
    { id: 'stg-8-3', worldId: 'cls-8', stageNumber: 3, title: 'لیول 3 — قرآنی فہم اور احکامِ شریعت', type: 'rapid_binary', difficulty: 'hard', timeLimitSeconds: 45, rewardXp: 360, rewardCoins: 130, icon: 'zap' },
    { id: 'stg-8-4', worldId: 'cls-8', stageNumber: 4, title: '👑 لیول 4 — کلاس 8 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'hard', timeLimitSeconds: 120, rewardXp: 750, rewardCoins: 320, icon: 'trophy' },

    // Class 9 Stages
    { id: 'stg-9-1', worldId: 'cls-9', stageNumber: 1, title: 'لیول 1 — مسلم سائنسدان اور ان کی عظیم ایجادات', type: 'term_connector', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 300, rewardCoins: 110, icon: 'link' },
    { id: 'stg-9-2', worldId: 'cls-9', stageNumber: 2, title: 'لیول 2 — علوم القرآن اور تدوینِ حدیث کا سنہری دور', type: 'knowledge', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 350, rewardCoins: 125, icon: 'book' },
    { id: 'stg-9-3', worldId: 'cls-9', stageNumber: 3, title: 'لیول 3 — اسلامی تہذیب اور بیت الحکمہ کی تاریخ', type: 'memory_match', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 400, rewardCoins: 140, icon: 'grid' },
    { id: 'stg-9-4', worldId: 'cls-9', stageNumber: 4, title: '👑 لیول 4 — کلاس 9 کا فائنل چیمپئن چیلنج', type: 'boss', difficulty: 'hard', timeLimitSeconds: 120, rewardXp: 800, rewardCoins: 350, icon: 'trophy' },

    // Class 10 Stages
    { id: 'stg-10-1', worldId: 'cls-10', stageNumber: 1, title: 'لیول 1 — اصولِ حدیث: صحیح، حسن، ضعیف کی تمیز', type: 'knowledge', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 350, rewardCoins: 120, icon: 'award' },
    { id: 'stg-10-2', worldId: 'cls-10', stageNumber: 2, title: 'لیول 2 — فقہی قواعد اور اجتہاد کے اصول', type: 'knowledge', difficulty: 'hard', timeLimitSeconds: 60, rewardXp: 400, rewardCoins: 140, icon: 'check-circle' },
    { id: 'stg-10-3', worldId: 'cls-10', stageNumber: 3, title: 'لیول 3 — اعجاز القرآن و متواتر روایات کی جانچ', type: 'rapid_binary', difficulty: 'hard', timeLimitSeconds: 45, rewardXp: 450, rewardCoins: 160, icon: 'zap' },
    { id: 'stg-10-4', worldId: 'cls-10', stageNumber: 4, title: '👑 لیول 4 — گرینڈ فائنل چیمپئن ٹرائل (Master Trial)', type: 'boss', difficulty: 'hard', timeLimitSeconds: 150, rewardXp: 1000, rewardCoins: 500, icon: 'crown' }
  ],

  gameQuestions: [
    // Class 1 Questions
    {
      id: 'gq-1-1',
      worldId: 'cls-1',
      stageId: 'stg-1-1',
      type: 'verse_gem_bank',
      title: 'کلمۂ طیبہ کے الفاظ کا نگینہ',
      questionText: 'پہلے کلمۂ طیبہ کی خالی جگہ میں درست کلمہ لگائیں:',
      verseTemplate: 'لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ ___ اللهِ',
      missingWord: 'رَّسُوْلُ',
      wordBank: ['رَّسُوْلُ', 'نَبِيُّ', 'عَبْدُ', 'خَلِيْلُ'],
      reference: 'پہلا کلمہ طیب',
      explanation: 'کلمہ طیبہ کے الفاظ ہیں: لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُوْلُ اللهِ۔'
    },
    {
      id: 'gq-1-2',
      worldId: 'cls-1',
      stageId: 'stg-1-2',
      type: 'memory_match',
      title: 'اللہ تعالیٰ کے پیارے نام (Memory Match)',
      questionText: 'اللہ تعالیٰ کے ناموں اور ان کے معانی کے درست جوڑے ملائیں:',
      pairs: [
        { id: 'p1', term: 'الرَّحْمٰنُ', match: 'بہت بڑا مہربان' },
        { id: 'p2', term: 'الرَّحِیْمُ', match: 'نہایت رحم فرمانے والا' },
        { id: 'p3', term: 'الْخَالِقُ', match: 'پیدا کرنے والا' },
        { id: 'p4', term: 'السَّلَامُ', match: 'سلامتی دینے والا' }
      ],
      reference: 'اسماء الحسنیٰ',
      explanation: 'اللہ تعالیٰ کے تمام نام پاک اور برکت والے ہیں۔'
    },
    {
      id: 'gq-1-3',
      worldId: 'cls-1',
      stageId: 'stg-1-3',
      type: 'visual_letter_object',
      title: 'بصری تصویر و صوتی حرف کی پہچان',
      questionText: 'دی گئی تصویر کو دیکھیں اور بتائیں اس کا پہلا حرف کون سا ہے؟',
      objectEmoji: '🕋',
      objectName: 'بیت اللہ (کعبہ شریف)',
      options: ['ب (بیت اللہ)', 'ج (جہان)', 'م (مسجد)', 'ک (کتاب)'],
      correctOptionIndex: 0,
      reference: 'حروف و کلمات',
      explanation: 'بیت اللہ کا پہلا حرف "ب" ہے۔'
    },
    {
      id: 'gq-1-4',
      worldId: 'cls-1',
      stageId: 'stg-1-4',
      type: 'audio_speller',
      title: 'صوتی ہجے و کلمہ سازی — کِتَابٌ',
      questionText: 'آواز سنیں اور نیچے دیے گئے حروف کو دبا کر لفظ "كِتَابٌ" بنائیں:',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002002.mp3',
      spelledWord: 'كتاب',
      letters: ['ك', 'ت', 'ا', 'ب', 'م', 'س'],
      reference: 'سورۃ البقرۃ: 2',
      explanation: 'کِتَابٌ کے حروف ہیں: ک، ت، ا، ب۔'
    },
    {
      id: 'gq-1-5',
      worldId: 'cls-1',
      stageId: 'stg-1-5',
      type: 'audio_surah_guess',
      title: '🎧 سن کر سورت کی پہچان فرمائیں',
      questionText: 'تلاوت سنیں اور بتائیں یہ کس مبارک سورت کی تلاوت ہے؟',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      audioTitle: 'شیخ مشاری راشد العفاسی — تلاوت',
      options: ['سورۃ الفاتحہ', 'سورۃ البقرۃ', 'سورۃ الاخلاص', 'سورۃ الناس'],
      correctOptionIndex: 0,
      reference: 'سورۃ الفاتحہ: 1',
      explanation: 'یہ تلاوت سورۃ الفاتحہ (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) کی ہے۔'
    },

    // Class 2 Questions
    {
      id: 'gq-2-1',
      worldId: 'cls-2',
      stageId: 'stg-2-1',
      type: 'sequential_order',
      title: 'نماز کی رکعت کی عملی ترتیب',
      questionText: 'نماز کی ایک رکعت کے ارکان کو ترتیب سے لگائیں:',
      items: [
        { id: 'sal-1', text: 'تکبیرِ تحریمہ (اللہ اکبر) اور قیام' },
        { id: 'sal-2', text: 'سورۃ الفاتحہ اور سورت کی تلاوت' },
        { id: 'sal-3', text: 'رکوع اور تسبیح (سبحان ربی العظیم)' },
        { id: 'sal-4', text: 'قومہ (سیدھا کھڑا ہونا) اور سمع اللہ لمن حمدہ' },
        { id: 'sal-5', text: 'پہلا سجدہ اور تسبیح (سبحان ربی الاعلیٰ)' },
        { id: 'sal-6', text: 'جلسہ (دونوں سجدوں کے درمیان بیٹھنا)' },
        { id: 'sal-7', text: 'دوسرا سجدہ مکمل کرنا' }
      ],
      correctSequence: ['sal-1', 'sal-2', 'sal-3', 'sal-4', 'sal-5', 'sal-6', 'sal-7'],
      reference: 'ارکانِ صلوٰۃ',
      explanation: 'نماز دین کا ستون ہے اور اس کے ارکان کی ترتیب فرض ہے۔'
    },
    {
      id: 'gq-2-2',
      worldId: 'cls-2',
      stageId: 'stg-2-2',
      type: 'audio_qari_guess',
      title: '🎧 سن کر قاری صاحب کی آواز پہچانیں',
      questionText: 'صوتی تلاوت سنیں اور بتائیں یہ کس عظیم قاری کی تلاوت ہے؟',
      audioUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/112001.mp3',
      audioTitle: 'سورۃ الاخلاص — قاری آواز',
      options: ['شیخ عبد الباسط عبد الصمد', 'شیخ عبد الرحمن السدیس', 'شیخ مشاری راشد', 'شیخ سعد الغامدی'],
      correctOptionIndex: 0,
      reference: 'تلاوتِ قرآن',
      explanation: 'یہ سنہری آواز مصر کے مشہور قاری شیخ عبد الباسط عبد الصمد رحمۃ اللہ علیہ کی ہے۔'
    },
    {
      id: 'gq-2-3',
      worldId: 'cls-2',
      stageId: 'stg-2-3',
      type: 'audio_dua_guess',
      title: 'مسنون دعا سن کر موقع کی پہچان',
      questionText: 'آڈیو میں پڑھی گئی مسنون دعا کس موقع پر پڑھی جاتی ہے؟',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3',
      audioTitle: 'مسنون دعا و تسبیح',
      options: ['نعمت ملنے پر اور کھانے کے بعد شکر', 'سونے سے پہلے', 'گھر سے نکلتے وقت', 'مسجد میں داخل ہوتے وقت'],
      correctOptionIndex: 0,
      reference: 'مسنون دعائیں',
      explanation: 'الحمد للہ اللہ تعالیٰ کی نعمتوں پر شکر گزاری کے موقع پر پڑھا جاتا ہے۔'
    },
    {
      id: 'gq-2-4',
      worldId: 'cls-2',
      stageId: 'stg-2-4',
      type: 'video_clip_quiz',
      title: '🎬 وضو کی عملی وڈیو کا مشاہدہ',
      questionText: 'ویڈیو میں دیکھ کر بتائیں وضو کا پہلا فرض کون سا ہے؟',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoTitle: 'طہارت و وضو کا عملی طریقہ',
      options: ['چہرہ دھونا (پیشانی سے ٹھوڑی تک)', 'کلی کرنا', 'مسواک کرنا', 'گردن کا مسح'],
      correctOptionIndex: 0,
      reference: 'سورۃ المائدۃ: 6',
      explanation: 'قرآن مجید کے مطابق وضو کا پہلا فرض چہرہ دھونا ہے۔'
    },

    // Class 3 Questions
    {
      id: 'gq-3-1',
      worldId: 'cls-3',
      stageId: 'stg-3-1',
      type: 'sequential_order',
      title: 'وضو کے فرائض و سنن کا عملی پزل',
      questionText: 'وضو کے درج ذیل اعمال کو ان کی مسنون ترتیب میں رکھیں:',
      items: [
        { id: 'w-1', text: 'ہاتھوں کو کلائیوں تک دھونا اور تسمیہ پڑھنا' },
        { id: 'w-2', text: 'تین بار کلی کرنا اور مسواک کرنا' },
        { id: 'w-3', text: 'تین بار ناک میں پانی چڑھا کر صاف کرنا' },
        { id: 'w-4', text: 'پورا چہرہ پیشانی سے ٹھوڑی تک دھونا' },
        { id: 'w-5', text: 'کہنیوں سمیت دونوں ہاتھ دھونا' },
        { id: 'w-6', text: 'سر کا مسح کرنا اور کان صاف کرنا' },
        { id: 'w-7', text: 'ٹخنوں سمیت دونوں پاؤں دھونا' }
      ],
      correctSequence: ['w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7'],
      reference: 'طہارت و وضو',
      explanation: 'وضو میں ترتیبِ مسنون کا خیال رکھنا سنتِ مؤکدہ ہے۔'
    },
    {
      id: 'gq-3-2',
      worldId: 'cls-3',
      stageId: 'stg-3-2',
      type: 'audio_next_verse',
      title: '🎧 تلاوت کا تسلسل — اگلی آیت جوڑیں',
      questionText: 'آڈیو میں سورۃ الفلق کی پہلی آیت سنیں، اس کے بعد آنے والی دوسری آیت کون سی ہے؟',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3',
      audioTitle: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      options: ['مِن شَرِّ مَا خَلَقَ', 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ'],
      correctOptionIndex: 0,
      reference: 'سورۃ الفلق: 2',
      explanation: 'سورۃ الفلق کی دوسری آیت "مِن شَرِّ مَا خَلَقَ" ہے۔'
    },

    // Class 4 Questions
    {
      id: 'gq-4-1',
      worldId: 'cls-4',
      stageId: 'stg-4-1',
      type: 'audio_tajweed_makhraj',
      title: 'تجوید کا صوتی قاعدہ — قلقلہ کی آواز',
      questionText: 'تلاوت سنیں اور بتائیں لفظ "الْفَلَقِ" کے آخری حرف پر کون سا تجویدی قاعدہ ادا ہوا؟',
      audioUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps/113001.mp3',
      audioTitle: 'شیخ المنشاوی — تجوید ترتیل',
      options: ['قلقلہ (آواز کی جنبش و گونج)', 'ادغام (ملا کر پڑھنا)', 'اقلاب (میم سے بدلنا)', 'اخفاء (ناک میں چھپانا)'],
      correctOptionIndex: 0,
      reference: 'قواعد التجوید',
      explanation: 'قاف حروفِ قلقلہ (قطب جد) میں سے ہے، وقف کی حالت میں اس پر واضح قلقلہ ہوتا ہے۔'
    },

    // Class 5 Questions
    {
      id: 'gq-5-1',
      worldId: 'cls-5',
      stageId: 'stg-5-1',
      type: 'sequential_order',
      title: 'سیرتِ نبوی ﷺ (مکی دور) کے سنگِ میل',
      questionText: 'مکی دور کے درج ذیل اہم واقعات کو تاریخ کے مطابق ترتیب دیں:',
      items: [
        { id: 'm-1', text: 'غارِ حرا میں پہلی وحی کا نزول' },
        { id: 'm-2', text: 'دعوتِ ذوالعشیرہ اور کوہِ صفا پر اعلانِ حق' },
        { id: 'm-3', text: 'شعبِ ابی طالب کا تین سالہ بائیکاٹ' },
        { id: 'm-4', text: 'عام الحزن (حضرت خدیجہؓ اور ابو طالب کا وصال)' },
        { id: 'm-5', text: 'واقعہ معراج اور پانچ نمازوں کی فرضیت' }
      ],
      correctSequence: ['m-1', 'm-2', 'm-3', 'm-4', 'm-5'],
      reference: 'سیرت النبی ﷺ',
      explanation: 'مکی دور کے یہ تمام مراحل صبر، استقامت اور تبلیغِ حق کی عظیم داستان ہیں۔'
    },
    {
      id: 'gq-5-2',
      worldId: 'cls-5',
      stageId: 'stg-5-2',
      type: 'audio_hadith_quiz',
      title: '🎧 صوتی حدیثِ نبوی ﷺ کی جانچ',
      questionText: 'حدیث مبارکہ کا صوتی متن سنیں اور بتائیں اعمال کا دارومدار کس چیز پر ہے؟',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      audioTitle: 'اربعین نووی — حدیثِ اول',
      options: ['نیتوں اور اخلاص پر (إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ)', 'صرف ظاہر پر', 'دولت اور شہرت پر', 'لوگوں کی تعریف پر'],
      correctOptionIndex: 0,
      reference: 'صحیح بخاری: 1',
      explanation: 'نبی کریم ﷺ نے فرمایا: تمام اعمال کا دارومدار نیتوں پر ہے۔'
    },

    // Class 6 Questions
    {
      id: 'gq-6-1',
      worldId: 'cls-6',
      stageId: 'stg-6-1',
      type: 'audio_adhan_guess',
      title: '🕌 سن کر مقدس شہر کی اذان پہچانیں',
      questionText: 'اذان کی دلکش صدا سنیں اور بتائیں یہ کس مقدس شہر کا خاص لہجہ ہے؟',
      audioUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3',
      audioTitle: 'صوت الاذان — الحرمين الشريفين',
      options: ['مدینہ منورہ (مسجد نبوی)', 'قاہرہ (مصر)', 'استنبول (ترکی)', 'بوسنیا'],
      correctOptionIndex: 0,
      reference: 'اذانِ حرمین',
      explanation: 'حرمین شریفین کی اذان روح پرور اور دلی سکون بخشتی ہے۔'
    }
  ],

  gameMissions: [
    { id: 'msn-1', title: 'علم کا مسافر', description: 'ایڈونچر گیم کا کوئی سا 1 مرحلہ مکمل کریں', goal: 1, type: 'stages_completed', rewardXp: 100, rewardCoins: 40, isDaily: true },
    { id: 'msn-2', title: 'شاندار سلسلہ (Combo Master)', description: 'مسلسل 5 درست جوابات کا کمبو حاصل کریں', goal: 5, type: 'max_combo', rewardXp: 150, rewardCoins: 60, isDaily: true },
    { id: 'msn-3', title: 'مکمل مہارت (3-Star Triumph)', description: 'کسی بھی مرحلے میں 3 ستارے حاصل کریں', goal: 1, type: 'three_stars', rewardXp: 200, rewardCoins: 80, isDaily: true },
    { id: 'msn-4', title: 'ہفتہ وار فاتح (Weekly Champion)', description: 'اس ہفتے کل 5 مراحل کامیابی سے فتح کریں', goal: 5, type: 'stages_completed', rewardXp: 600, rewardCoins: 250, isDaily: false }
  ],

  gameAchievements: [
    { id: 'ach-first-step', title: 'پہلا قدم (First Step)', description: 'پہلا ایڈونچر مرحلہ کامیابی سے مکمل کیا', icon: 'award', tier: 'bronze', rewardCoins: 50, rewardXp: 100 },
    { id: 'ach-sharp-mind', title: 'تیز نگاہ (Sharp Mind)', description: 'مسلسل 10 سوالات کے درست جوابات دیے', icon: 'zap', tier: 'silver', rewardCoins: 100, rewardXp: 250 },
    { id: 'ach-boss-slayer', title: 'فاتحِ جہاں (Realm Conqueror)', description: 'پہلے جہاں کا فائنل باس چیلنج فتح کیا', icon: 'crown', tier: 'gold', rewardCoins: 200, rewardXp: 500 },
    { id: 'ach-streak-7', title: 'مستقل مزاجی (7-Day Streak)', description: 'مسلسل 7 دن تک اسلامی ایڈونچر کھیلا', icon: 'flame', tier: 'gold', rewardCoins: 300, rewardXp: 750 },
    { id: 'ach-grand-scholar', title: 'علامہ دہر (Grand Scholar)', description: 'ایڈونچر میں لیول 10 پر پہنچے', icon: 'gem', tier: 'diamond', rewardCoins: 500, rewardXp: 1500 }
  ],

  gamePowerups: [
    { id: 'pwr-hint', type: 'hint', title: 'عالم کا اشارہ (Scholar\'s Hint)', description: 'سوال کو سمجھنے کے لیے مستند علمی اشارہ ظاہر کرے', costCoins: 50, icon: 'help-circle' },
    { id: 'pwr-fifty', type: 'fiftyFifty', title: 'نصف اختیارات (50/50)', description: 'دو غلط جوابات کو فوری طور پر حذف کر دے', costCoins: 60, icon: 'scissors' },
    { id: 'pwr-time', type: 'timeBoost', title: 'وقت کا اضافہ (+15s)', description: 'ٹائمر میں مزید 15 سیکنڈ کا اضافہ کرے', costCoins: 40, icon: 'clock' },
    { id: 'pwr-life', type: 'extraLife', title: 'اضافی دل / زندگی (+1 Life)', description: 'ایک ضائع شدہ زندگی کو فوری بحال کرے', costCoins: 80, icon: 'heart' }
  ]
};

// Data Store Manager Class
class DatabaseManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      // Purge obsolete cache keys from previous versions
      localStorage.removeItem('learnhub_db_v1');
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.courses && parsed.courses.some(c => c.id === 'crs-isl-1')) {
          // Schema Migration: ensure new security & auth collections exist
          const securityCollections = [
            'sessions',
            'emailVerifications',
            'passwordResets',
            'twoFactorSettings',
            'loginAttempts',
            'securityEvents',
            'gameWorlds',
            'gameStages',
            'gameQuestions',
            'gameMissions',
            'gameAchievements',
            'gamePowerups'
          ];
          securityCollections.forEach(col => {
            if (!Array.isArray(parsed[col]) || 
                (col === 'gameWorlds' && (!parsed.gameWorlds[0] || parsed.gameWorlds[0].id === 'w-1' || parsed.gameWorlds.length < 10)) ||
                (col === 'gameStages' && (!parsed.gameStages || parsed.gameStages.length < 10)) ||
                (col === 'gameQuestions' && (!parsed.gameQuestions || parsed.gameQuestions.length < SEED_DATA.gameQuestions.length))) {
              parsed[col] = JSON.parse(JSON.stringify(SEED_DATA[col] || []));
            }
          });


          // Schema Migration: ensure users have required auth fields and seed accounts exist
          if (Array.isArray(parsed.users)) {
            parsed.users = parsed.users.map(u => ({
              firstName: u.firstName || (u.name ? u.name.split(' ')[0] : ''),
              lastName: u.lastName || (u.name ? u.name.split(' ').slice(1).join(' ') : ''),
              phone: u.phone || '',
              country: u.country || 'PK',
              language: u.language || 'ur',
              emailVerified: u.emailVerified !== undefined ? u.emailVerified : true,
              twoFactorEnabled: u.twoFactorEnabled !== undefined ? u.twoFactorEnabled : false,
              marketingConsent: u.marketingConsent !== undefined ? u.marketingConsent : true,
              status: u.status || 'active',
              ...u
            }));

            // Ensure seed users (Jamil Ansari, Admin) are always present and can log in
            SEED_DATA.users.forEach(seedUser => {
              const existingIdx = parsed.users.findIndex(u => 
                (u.id && u.id === seedUser.id) || 
                (u.email && u.email.toLowerCase().trim() === seedUser.email.toLowerCase().trim())
              );
              if (existingIdx === -1) {
                parsed.users.push(JSON.parse(JSON.stringify(seedUser)));
              } else {
                // Ensure role is super_admin for admin emails and update password
                const adminList = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'];
                if (parsed.users[existingIdx].email && adminList.includes(parsed.users[existingIdx].email.toLowerCase().trim())) {
                  parsed.users[existingIdx].role = 'super_admin';
                  parsed.users[existingIdx].status = 'active';
                  parsed.users[existingIdx].emailVerified = true;
                  parsed.users[existingIdx].password = 'Jamil132@#@#';
                }
                if (!parsed.users[existingIdx].password) {
                  parsed.users[existingIdx].password = seedUser.password;
                }
              }
            });
          }

          // Deduplicate users and purge all demo / mock records
          if (Array.isArray(parsed.users)) {
            const seenEmails = new Set();
            const mockEmails = new Set(['student@learnhub.com', 'instructor@learnhub.com', 'admin@learnhub.com']);
            parsed.users = parsed.users.filter(u => {
              if (!u || !u.email || u.name === 'undefined') return false;
              const em = String(u.email).toLowerCase().trim();
              if (mockEmails.has(em)) return false;
              if (seenEmails.has(em)) return false;
              seenEmails.add(em);
              return true;
            });
          }

          // Purge mock demo records from enrollments, quiz attempts, and certificates
          if (Array.isArray(parsed.enrollments)) {
            parsed.enrollments = parsed.enrollments.filter(e => e && e.userId && e.userId !== 'usr-1' && e.userId !== 'usr-jamil' && e.id !== 'enr-1' && e.id !== 'enr-2');
          }
          if (Array.isArray(parsed.quizAttempts)) {
            parsed.quizAttempts = parsed.quizAttempts.filter(a => a && a.userId && a.userId !== 'usr-1' && a.id !== 'qa-101' && a.id !== 'qa-102');
          }
          if (Array.isArray(parsed.certificates)) {
            parsed.certificates = parsed.certificates.filter(c => c && c.userId && c.userId !== 'usr-1' && c.userId !== 'usr-jamil' && c.id !== 'cert-1');
          }

          // Clean up old login attempts older than 10 minutes
          if (Array.isArray(parsed.loginAttempts)) {
            const tenMinsAgo = Date.now() - 10 * 60 * 1000;
            parsed.loginAttempts = parsed.loginAttempts.filter(a => new Date(a.timestamp).getTime() >= tenMinsAgo);
          }

          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    this.saveData(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  saveData(data = this.data) {
    try {
      this.data = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('learnhub:db_updated', { detail: { timestamp: Date.now() } }));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  get(collectionName, options = {}) {
    const raw = this.data[collectionName] || [];
    if (!Array.isArray(raw)) return raw;

    // Check if user is admin or if explicit includeDrafts requested
    const isAdmin = window.Auth && typeof window.Auth.isAdmin === 'function' && window.Auth.isAdmin();
    const showDrafts = options.includeDrafts === true || (isAdmin && options.includeDrafts !== false);

    if (showDrafts) {
      return JSON.parse(JSON.stringify(raw));
    }

    // Public / Student filter: hide any item with status === 'draft' or isPublished === false
    return JSON.parse(JSON.stringify(
      raw.filter(item => {
        if (!item || typeof item !== 'object') return true;
        if (item.status === 'draft' || item.isPublished === false || item.isDraft === true) {
          return false;
        }
        return true;
      })
    ));
  }

  getPublished(collectionName) {
    return this.get(collectionName, { includeDrafts: false });
  }

  getDrafts(collectionName) {
    const raw = this.data[collectionName] || [];
    if (!Array.isArray(raw)) return [];
    return JSON.parse(JSON.stringify(
      raw.filter(item => item && (item.status === 'draft' || item.isPublished === false || item.isDraft === true))
    ));
  }

  /**
   * Universal Release Management: get summary of all pending drafts across collections
   */
  getStagedDraftsSummary() {
    const collections = ['courses', 'quizzes', 'gameQuestions', 'articles', 'announcements', 'books'];
    const summary = {
      totalDrafts: 0,
      byCollection: {},
      draftItems: []
    };

    collections.forEach(col => {
      const drafts = this.getDrafts(col);
      summary.byCollection[col] = drafts.length;
      summary.totalDrafts += drafts.length;
      drafts.forEach(d => {
        summary.draftItems.push({
          collection: col,
          id: d.id,
          title: d.title || d.name || d.headline || 'عنوان کے بغیر آئٹم',
          type: col,
          createdAt: d.createdAt || d.updatedAt || new Date().toISOString()
        });
      });
    });

    return summary;
  }

  /**
   * 1-Click Master Publish: Deploy all staged drafts to live
   */
  publishAllStagedDrafts() {
    const collections = ['courses', 'quizzes', 'gameQuestions', 'articles', 'announcements', 'books'];
    let count = 0;

    collections.forEach(col => {
      if (Array.isArray(this.data[col])) {
        this.data[col].forEach(item => {
          if (item && (item.status === 'draft' || item.isPublished === false || item.isDraft === true)) {
            item.status = 'published';
            item.isPublished = true;
            item.isDraft = false;
            item.publishedAt = new Date().toISOString();
            count++;
          }
        });
      }
    });

    this.saveData();
    return count;
  }

  publishItem(collectionName, id) {
    const list = this.data[collectionName] || [];
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return false;

    this.data[collectionName][idx].status = 'published';
    this.data[collectionName][idx].isPublished = true;
    this.data[collectionName][idx].isDraft = false;
    this.data[collectionName][idx].publishedAt = new Date().toISOString();
    this.saveData();
    return true;
  }

  unpublishItem(collectionName, id) {
    const list = this.data[collectionName] || [];
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return false;

    this.data[collectionName][idx].status = 'draft';
    this.data[collectionName][idx].isPublished = false;
    this.data[collectionName][idx].isDraft = true;
    this.saveData();
    return true;
  }

  set(collectionName, items) {
    this.data[collectionName] = items;
    this.saveData();
    return items;
  }

  findById(collectionName, id) {
    const list = this.get(collectionName, { includeDrafts: true });
    return list.find(item => item.id === id) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    if (!item.id) {
      item.id = `${collectionName.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    // Default new admin entries to draft if not explicitly marked published
    if (item.isPublished === undefined && item.status === undefined) {
      item.status = 'draft';
      item.isPublished = false;
    }
    item.createdAt = item.createdAt || new Date().toISOString();
    this.data[collectionName].unshift(item);
    this.saveData();
    return item;
  }

  update(collectionName, id, updates) {
    const list = this.data[collectionName] || [];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[collectionName][index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data[collectionName][index];
  }

  delete(collectionName, id) {
    const list = this.data[collectionName] || [];
    this.data[collectionName] = list.filter(item => item.id !== id);
    this.saveData();
    return true;
  }

  resetToSeed() {
    this.saveData(JSON.parse(JSON.stringify(SEED_DATA)));
    return this.data;
  }

  logAudit(actorName, action, target) {
    this.insert('auditLogs', {
      actorName,
      action,
      target,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1'
    });
  }

  logSecurityEvent(userId, eventType, severity = 'info', description = '', metadata = {}) {
    return this.insert('securityEvents', {
      userId: userId || 'anonymous',
      eventType,
      severity, // 'info' | 'warning' | 'critical'
      description,
      metadata,
      ip: metadata.ip || '127.0.0.1',
      userAgent: metadata.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Client'),
      timestamp: new Date().toISOString()
    });
  }
}

// Global Singleton DB
window.DB = new DatabaseManager();
