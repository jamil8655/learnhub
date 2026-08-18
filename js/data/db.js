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
    heroTitle: 'Transform Your Future with World-Class Learning',
    heroSubtitle: 'Access premium courses, test your real-world skills with standalone timed quizzes, earn verified industry certificates, and accelerate your career.',
    bannerText: '🚀 Spring Special: Use coupon LEARN20 for 20% off all certifications and courses!',
    bannerActive: true,
    aboutText: 'LearnHub is a next-generation Learning Management System built for students, professionals, and forward-thinking organizations. We combine cutting-edge curriculum design with interactive hands-on labs and standalone assessments.',
    faqs: [
      { id: 'faq-1', category: 'General', question: 'How do standalone quizzes work?', answer: 'Quizzes at LearnHub are completely independent from courses. You can take any quiz directly to test and validate your knowledge without enrolling in a full course.' },
      { id: 'faq-2', category: 'Certificates', question: 'Are LearnHub certificates verifiable?', answer: 'Yes! Every certificate issued has a unique verification code and public URL (e.g., #/verify-cert/LH-CERT-2026-8841) that employers can verify in real time.' },
      { id: 'faq-3', category: 'Billing', question: 'What payment methods are supported?', answer: 'We support all major Credit/Debit cards, PayPal, and enterprise invoices with instant course enrollment.' },
      { id: 'faq-4', category: 'Courses', question: 'Can I access course materials offline?', answer: 'Yes, downloadable resources, project cheat sheets, and PDF study guides can be saved for offline review.' }
    ]
  },

  roles: [
    { id: 'student', name: 'Student', description: 'Can browse, enroll, take quizzes, earn certificates, and join discussions.' },
    { id: 'instructor', name: 'Instructor', description: 'Can manage assigned courses, lessons, and view student progress.' },
    { id: 'admin', name: 'Administrator', description: 'Full access to courses, standalone quizzes, users, orders, coupons, CMS, and settings.' },
    { id: 'super_admin', name: 'Super Admin', description: 'Complete system control including role assignments, audit logs, and system config.' }
  ],

  users: [
    {
      id: 'usr-jamil',
      name: 'جمیل رحمن انصاری',
      email: 'JRahmanAnsari132@gmail.com',
      password: 'student123',
      role: 'admin',
      avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
      headline: 'LearnHub بانی و ایڈمنسٹریٹر',
      bio: 'سیکھنے اور سکھانے کا پرجوش سفر۔',
      status: 'active',
      learningStreak: 7,
      longestStreak: 14,
      totalPoints: 1450,
      createdAt: '2026-01-01',
      notificationsEnabled: true
    },
    {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'student@learnhub.com',
      password: 'student123', // In production simulated auth
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      headline: 'Full-Stack Developer & Lifelong Learner',
      bio: 'Software engineer passionate about React, TypeScript, and modern Cloud architectures.',
      status: 'active',
      learningStreak: 12,
      longestStreak: 21,
      totalPoints: 1450,
      createdAt: '2026-01-10T10:00:00Z',
      notificationsEnabled: true
    },
    {
      id: 'usr-2',
      name: 'Dr. Sarah Chen',
      email: 'instructor@learnhub.com',
      password: 'instructor123',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      headline: 'Lead AI Researcher & Stanford PhD',
      bio: 'Specializing in Deep Learning, Computer Vision, and Neural Networks with 12+ years of industry experience.',
      status: 'active',
      learningStreak: 45,
      longestStreak: 45,
      totalPoints: 5200,
      createdAt: '2025-11-01T12:00:00Z',
      notificationsEnabled: true
    },
    {
      id: 'usr-3',
      name: 'Admin Director',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      headline: 'LearnHub Chief Learning Officer & Admin',
      bio: 'Managing academic operations, course quality, and instructor governance.',
      status: 'active',
      learningStreak: 30,
      longestStreak: 60,
      totalPoints: 9800,
      createdAt: '2025-08-01T08:00:00Z',
      notificationsEnabled: true
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

  // Quiz Attempts (User quiz history & analytics)
  quizAttempts: [
    {
      id: 'qa-101',
      quizId: 'qz-1',
      userId: 'usr-1',
      score: 50,
      totalMarks: 50,
      percentage: 100,
      passed: true,
      timeTakenSeconds: 380,
      attemptNumber: 1,
      answers: [
        { questionId: 'qq-101', selectedOptionIndex: 1, isCorrect: true },
        { questionId: 'qq-102', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-103', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-104', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-105', selectedOptionIndex: 0, isCorrect: true }
      ],
      completedAt: '2026-02-14T14:30:00Z'
    },
    {
      id: 'qa-102',
      quizId: 'qz-2',
      userId: 'usr-1',
      score: 30,
      totalMarks: 30,
      percentage: 100,
      passed: true,
      timeTakenSeconds: 210,
      attemptNumber: 1,
      answers: [
        { questionId: 'qq-201', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-202', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-203', selectedOptionIndex: 0, isCorrect: true }
      ],
      completedAt: '2026-02-15T09:15:00Z'
    }
  ],

  // User Course Enrollments & Progress
  enrollments: [
    {
      id: 'enr-1',
      userId: 'usr-jamil',
      courseId: 'crs-isl-1',
      enrolledAt: '2026-01-15T11:00:00Z',
      progressPercentage: 100,
      completedLessons: ['les-isl-101', 'les-isl-102'],
      lastViewedLessonId: 'les-isl-102',
      status: 'completed',
      completedAt: '2026-02-02T16:00:00Z'
    },
    {
      id: 'enr-2',
      userId: 'usr-jamil',
      courseId: 'crs-isl-3',
      enrolledAt: '2026-01-20T10:00:00Z',
      progressPercentage: 80,
      completedLessons: ['les-isl-301'],
      lastViewedLessonId: 'les-isl-302',
      status: 'in_progress',
      completedAt: null
    }
  ],

  // Certificates
  certificates: [
    {
      id: 'cert-1',
      certificateNumber: 'LH-CERT-2026-8841',
      serialNumber: 'LH-CERT-2026-8841',
      userId: 'usr-jamil',
      userName: 'جمیل رحمن انصاری',
      courseId: 'crs-isl-1',
      courseTitle: 'قرآنی تجوید و قراءت ماسٹر کلاس (مخارج و صفات الحروف)',
      instructorName: 'شیخ ڈاکٹر محمد الہاشمی',
      issueDate: '2026-02-18',
      verificationUrl: '#/verify-cert/LH-CERT-2026-8841',
      grade: 'ممتاز درجہ (Pass with Highest Distinction)',
      badgeColor: '#059669'
    }
  ],

  // Gamification & Achievements
  achievements: [
    { id: 'ach-1', code: 'first_course', title: 'پہلا اعزاز', description: 'پہلا اسلامی کورس کامیابی سے مکمل کریں۔', icon: 'award', points: 100 },
    { id: 'ach-2', code: 'quiz_ace', title: 'کوئز ماسٹر', description: 'اسلامی کوئز میں 90% سے زیادہ نمبر حاصل کریں۔', icon: 'zap', points: 150 },
    { id: 'ach-3', code: 'streak_7', title: 'مستقل مزاجی چیمپئن', description: 'مسلسل 7 دن تک علم حاصل کرنے کا تسلسل برقرار رکھیں۔', icon: 'flame', points: 200 },
    { id: 'ach-4', code: 'five_courses', title: 'علم کا خزانہ', description: '5 اسلامی کورسز کامیابی سے مکمل کریں۔', icon: 'book-open', points: 500 },
    { id: 'ach-5', code: 'community_voice', title: 'خیر خواہی کا ستون', description: 'طلباء کے سوالات کے علمی جوابات دیں۔', icon: 'message-square', points: 120 }
  ],

  userAchievements: [
    { id: 'ua-1', userId: 'usr-jamil', achievementId: 'ach-1', unlockedAt: '2026-02-02T16:05:00Z' },
    { id: 'ua-2', userId: 'usr-jamil', achievementId: 'ach-2', unlockedAt: '2026-02-14T14:31:00Z' },
    { id: 'ua-3', userId: 'usr-jamil', achievementId: 'ach-3', unlockedAt: '2026-02-16T10:00:00Z' }
  ],

  // Activity Logs for Heatmap Calendar
  activityLogs: [
    { id: 'act-1', userId: 'usr-jamil', date: '2026-02-18', count: 6, type: 'lesson_completed' },
    { id: 'act-2', userId: 'usr-jamil', date: '2026-02-17', count: 4, type: 'quiz_submitted' },
    { id: 'act-3', userId: 'usr-jamil', date: '2026-02-16', count: 5, type: 'quran_recited' },
    { id: 'act-4', userId: 'usr-jamil', date: '2026-02-15', count: 8, type: 'hadith_studied' }
  ],

  // Reviews & Ratings
  reviews: [
    {
      id: 'rev-1',
      courseId: 'crs-isl-1',
      userId: 'usr-jamil',
      userName: 'جمیل رحمن انصاری',
      userAvatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
      rating: 5,
      title: 'ماشاءاللہ! تجوید کے تمام قواعد انتہائی آسان اور پر اثر انداز میں سکھائے گئے۔',
      comment: 'شیخ الہاشمی صاحب کا اندازِ بیان لاجواب ہے۔ ہر مسلمان کے لیے یہ کورس ایک عظیم نعمت ہے۔',
      createdAt: '2026-02-18T15:00:00Z',
      helpfulCount: 54,
      status: 'approved'
    }
  ],

  wishlist: [
    { id: 'wl-1', userId: 'usr-1', itemType: 'course', itemId: 'crs-2', addedAt: '2026-02-05' },
    { id: 'wl-2', userId: 'usr-1', itemType: 'quiz', itemId: 'qz-3', addedAt: '2026-02-10' }
  ],

  bookmarks: [
    { id: 'bm-1', userId: 'usr-1', itemType: 'lesson', itemId: 'les-103', title: 'Next.js App Router, Server Components & Streaming', courseId: 'crs-1', addedAt: '2026-02-15' },
    { id: 'bm-2', userId: 'usr-1', itemType: 'resource', itemId: 'res-1', title: 'Neural Net Math Guide PDF', url: '#/resources', addedAt: '2026-02-12' }
  ],

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

  supportTickets: [
    {
      id: 'tkt-101',
      ticketNumber: 'TKT-2026-042',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userEmail: 'student@learnhub.com',
      category: 'Billing',
      subject: 'Invoice copy for company reimbursement',
      message: 'Hello, could you please confirm my tax invoice with company GST details for order LH-ORD-9021?',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2026-01-16T10:00:00Z',
      replies: [
        { id: 'tr-1', senderName: 'Admin Director', senderRole: 'admin', message: 'Hello Alex, the formal GST tax invoice has been generated and attached to your order record.', createdAt: '2026-01-16T12:00:00Z' }
      ]
    }
  ],

  mediaItems: [
    { id: 'med-1', name: 'nextjs-hero.jpg', type: 'image', size: '240 KB', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-10' },
    { id: 'med-2', name: 'ai-masterclass.jpg', type: 'image', size: '310 KB', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-12' },
    { id: 'med-3', name: 'cloud-devops.jpg', type: 'image', size: '280 KB', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-14' },
    { id: 'med-4', name: 'syllabus-guide.pdf', type: 'document', size: '1.2 MB', url: '#/resources', uploadedAt: '2026-01-15' }
  ],

  auditLogs: [
    { id: 'aud-1', actorName: 'Admin Director', action: 'COURSE_PUBLISHED', target: 'Modern Full-Stack Next.js & TypeScript Bootcamp', timestamp: '2026-01-15T10:30:00Z', ip: '192.168.1.1' },
    { id: 'aud-2', actorName: 'Admin Director', action: 'COUPON_CREATED', target: 'Coupon LEARN20 (20% off)', timestamp: '2026-01-15T10:45:00Z', ip: '192.168.1.1' },
    { id: 'aud-3', actorName: 'Alex Johnson', action: 'USER_LOGIN', target: 'Alex Johnson', timestamp: '2026-02-18T14:00:00Z', ip: '192.168.1.45' },
    { id: 'aud-4', actorName: 'Admin Director', action: 'TICKET_RESOLVED', target: 'Ticket #TKT-2026-042', timestamp: '2026-01-16T12:00:00Z', ip: '192.168.1.1' }
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

  get(collectionName) {
    return this.data[collectionName] || [];
  }

  set(collectionName, items) {
    this.data[collectionName] = items;
    this.saveData();
    return items;
  }

  findById(collectionName, id) {
    const list = this.get(collectionName);
    return list.find(item => item.id === id) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    if (!item.id) {
      item.id = `${collectionName.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    item.createdAt = item.createdAt || new Date().toISOString();
    this.data[collectionName].unshift(item);
    this.saveData();
    return item;
  }

  update(collectionName, id, updates) {
    const list = this.get(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[collectionName][index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data[collectionName][index];
  }

  delete(collectionName, id) {
    const list = this.get(collectionName);
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
}

// Global Singleton DB
window.DB = new DatabaseManager();
