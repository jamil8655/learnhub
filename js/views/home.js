/**
 * LearnHub Master Home View & Daily Islamic Experience (v167.0.0)
 * Ultra-Premium Islamic EdTech Visual System
 * 100% Trilingual Dynamic Localization (English, Urdu, Arabic)
 */

window.Views = window.Views || {};
window.Views.components = window.Views.components || {};

const DAILY_INSPIRATIONS = [
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: {
      en: 'The best among you are those who learn the Quran and teach it.',
      ur: 'تم میں سے سب سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
      ar: 'خير الناس وأفضلهم من أقبل على تعلم كتاب الله وتلاوته وتعليمه للناس.'
    },
    ref: { en: 'Sahih al-Bukhari: 5027', ur: 'صحیح بخاری: 5027', ar: 'صحيح البخاري: 5027' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: {
      en: 'Indeed, with hardship comes ease.',
      ur: 'بے شک ہر تنگی اور مشکل کے ساتھ آسانی ہے۔',
      ar: 'إن مع العسر والشدة يسراً وفرجاً قريباً من الله تعالى.'
    },
    ref: { en: 'Surah Ash-Sharh: 6', ur: 'سورۃ الشرح: 6', ar: 'سورة الشرح: 6' },
    link: '#/quran/94'
  },
  {
    type: { en: "Today's Dua", ur: "آج کی مسنون دعا", ar: "دعاء اليوم المأثور" },
    icon: '🤲',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    translation: {
      en: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
      ur: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
      ar: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً مباركاً.'
    },
    ref: { en: 'Sunan Ibn Majah: 925', ur: 'سنن ابن ماجہ: 925', ar: 'سنن ابن ماجه: 925' },
    link: '#/islamic-tools'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: {
      en: 'Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.',
      ur: 'جو شخص علم کی تلاش میں کسی راستے پر نکلے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
      ar: 'من سلك طريقاً يطلب فيه العلم الشرعي يسر الله له طريقاً إلى الجنة.'
    },
    ref: { en: 'Sahih Muslim: 2699', ur: 'صحیح مسلم: 2699', ar: 'صحيح مسلم: 2699' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: {
      en: 'And say: My Lord, increase me in knowledge.',
      ur: 'اور دعا کیجیے کہ اے میرے پروردگار! میرے علم میں اضافہ فرما۔',
      ar: 'وقل داعياً ربك ومبتهلاً: يا رب زدني علماً نافعاً وفقهاً في الدين.'
    },
    ref: { en: 'Surah Ta-Ha: 114', ur: 'سورۃ طہٰ: 114', ar: 'سورة طه: 114' },
    link: '#/quran/20'
  }
];

function getActiveLanguage() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'en';
}

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = getActiveLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';

  // Rotating Daily Inspiration
  const now = new Date();
  const rawInsp = DAILY_INSPIRATIONS[(now.getDate() - 1) % DAILY_INSPIRATIONS.length];
  const inspiration = {
    icon: rawInsp.icon,
    arabic: rawInsp.arabic,
    type: rawInsp.type[currentLang] || rawInsp.type.en,
    translation: rawInsp.translation[currentLang] || rawInsp.translation.en,
    ref: rawInsp.ref[currentLang] || rawInsp.ref.en,
    link: rawInsp.link
  };

  // User & DB data
  const lastRead = window.QuranService ? window.QuranService.getLastRead() : { surahNumber: 1, ayahNumber: 1 };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const lastReadSurah = surahs.find(s => s.number === lastRead.surahNumber) || { nameTranslit: 'Al-Fatihah', nameUrdu: 'سورۃ الفاتحہ', nameArabic: 'الفاتحة', juz: 1, totalVerses: 7 };

  const allCourses = window.DB ? (window.DB.get('courses') || []) : [];
  const courses = allCourses.slice(0, 4);
  const allBooks = (window.ISLAMIC_LIBRARY_BOOKS && window.ISLAMIC_LIBRARY_BOOKS.length > 0) ? window.ISLAMIC_LIBRARY_BOOKS.slice(0, 4) : [];

  // Trilingual UI strings dictionary
  const L = {
    studyNow: currentLang === 'en' ? 'Study & Recite' : (currentLang === 'ar' ? 'مطالعة وتلاوة' : 'مطالعہ و تلاوت کریں'),
    lastReadBadge: currentLang === 'en' ? 'Last Read' : (currentLang === 'ar' ? 'آخر قراءة' : 'آخری تلاوت'),
    ayahNumber: currentLang === 'en' ? `Ayah No. ${lastRead.ayahNumber || 1}` : (currentLang === 'ar' ? `آية رقم ${lastRead.ayahNumber || 1}` : `آیت نمبر ${lastRead.ayahNumber || 1}`),
    juzNumber: currentLang === 'en' ? `Juz ${lastReadSurah.juz || 1}` : (currentLang === 'ar' ? `الجزء ${lastReadSurah.juz || 1}` : `پارہ ${lastReadSurah.juz || 1}`),
    continueBtn: currentLang === 'en' ? 'Continue Reading' : (currentLang === 'ar' ? 'متابعة التلاوة' : 'تلاوت جاری رکھیں'),
    hubsTitle: currentLang === 'en' ? 'Explore Academic Hubs' : (currentLang === 'ar' ? 'الأقسام التعليمية والشرعية' : 'تعلیمی و دینی شعبے'),
    
    // 6 Pillars
    pQuranTitle: currentLang === 'en' ? 'Holy Quran' : (currentLang === 'ar' ? 'القرآن الكريم' : 'قرآن مجید'),
    pQuranSub: currentLang === 'en' ? '114 Surahs & Voice Tajweed' : (currentLang === 'ar' ? '114 سورة وتلاوة' : '114 سورتیں و صوتی تجوید'),
    pHadithTitle: currentLang === 'en' ? 'Hadith Library' : (currentLang === 'ar' ? 'المكتبة الحديثية' : 'کتبِ حدیث'),
    pHadithSub: currentLang === 'en' ? 'Bukhari, Muslim & Sunan' : (currentLang === 'ar' ? 'البخاري ومسلم والسنن' : 'بخاری، مسلم و سنن'),
    pLibraryTitle: currentLang === 'en' ? 'Islamic Library' : (currentLang === 'ar' ? 'المكتبة الرقمية' : '300+ کتب خانہ'),
    pLibrarySub: currentLang === 'en' ? '300+ Classical Books' : (currentLang === 'ar' ? '300+ كتاب ومخطوط' : 'تفاسیر، فقہ و سیرت'),
    pCoursesTitle: currentLang === 'en' ? 'Certified Masterclasses' : (currentLang === 'ar' ? 'الدورات والشهادات' : 'کورسز و شاہی اسناد'),
    pCoursesSub: currentLang === 'en' ? 'Interactive Lessons & Diplomas' : (currentLang === 'ar' ? 'دروس وشهادات معتمدة' : 'مکمل اسباق و تصدیق شدہ اسناد'),
    pToolsTitle: currentLang === 'en' ? 'Islamic Tools & Mirath' : (currentLang === 'ar' ? 'الأدوات الإسلامية' : 'اسلامی ٹولز و میراث'),
    pToolsSub: currentLang === 'en' ? 'Prayer Times, Zakat & Mirath' : (currentLang === 'ar' ? 'أوقات الصلاة والزكاة والميراث' : 'اوقاتِ نماز، زکوٰۃ، میراث'),
    pAdventureTitle: currentLang === 'en' ? 'Islamic Adventure' : (currentLang === 'ar' ? 'المغامرة الإسلامية' : 'اسلامک ایڈونچر گیم'),
    pAdventureSub: currentLang === 'en' ? '9 Sacred Realms & Quizzes' : (currentLang === 'ar' ? '9 عوالم مقدسة وألغاز' : '9 مقدس جہان و انٹرایکٹو پزلز'),

    // Classical Books
    booksTitle: currentLang === 'en' ? 'Classical Islamic Library' : (currentLang === 'ar' ? 'مكتبة التراث الإسلامي' : 'کتبِ سلف و تفاسیر'),
    booksSub: currentLang === 'en' ? 'Available for online reading & PDF download' : (currentLang === 'ar' ? 'متاحة للقراءة المباشرة والتحميل مجاناً' : 'آن لائن مطالعہ اور پی ڈی ایف ڈاؤن لوڈ کے لیے دستیاب کتب'),
    viewAllBooks: currentLang === 'en' ? 'View All (300+ Books)' : (currentLang === 'ar' ? 'عرض جميع الكتب (300+)' : 'تمام کتب (300+)'),
    readBtn: currentLang === 'en' ? 'Read Online' : (currentLang === 'ar' ? 'قراءة' : 'مطالعہ کریں'),

    // Masterclasses
    coursesTitle: currentLang === 'en' ? 'Academic Masterclasses' : (currentLang === 'ar' ? 'الدورات العلمية والشرعية' : 'آن لائن کورسز و اسباق'),
    coursesSub: currentLang === 'en' ? 'Expert-curated courses with diplomas & examinations' : (currentLang === 'ar' ? 'مناهج دراسية متكاملة بإشراف نخبة من العلماء' : 'مستند شیوخ و اساتذہ کے زیرِ نگرانی تیار کردہ مکمل اسباق'),
    viewAllCourses: currentLang === 'en' ? 'View All Courses' : (currentLang === 'ar' ? 'عرض جميع الدورات' : 'تمام کورسز'),
    enrollBtn: currentLang === 'en' ? 'Enroll Now' : (currentLang === 'ar' ? 'سجل الآن' : 'داخلہ لیں'),
    freeBadge: currentLang === 'en' ? 'Free (Fi Sabilillah)' : (currentLang === 'ar' ? 'مجاناً' : 'مفت (Free)')
  };

  const surahDisplayName = currentLang === 'en'
    ? `Surah ${lastReadSurah.nameTranslit || 'Al-Fatihah'}`
    : (currentLang === 'ar' ? lastReadSurah.nameArabic : lastReadSurah.nameUrdu);

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        <!-- 1. GREETING & DAILY HADITH / AYAH BANNER -->
        <div class="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-teal-600/40 relative overflow-hidden">
          <div class="relative z-10 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-500/40 text-[11px] font-bold text-teal-100">
                ${inspiration.icon} <span>${inspiration.type}</span>
              </span>
              <span class="text-[11px] text-teal-200/80 font-semibold font-mono">${inspiration.ref}</span>
            </div>

            <!-- Arabic Vocalized Text -->
            <div class="text-xl sm:text-2xl font-black font-arabic text-center py-2 text-amber-200 font-bold leading-relaxed drop-shadow-md" dir="rtl">
              ${inspiration.arabic}
            </div>

            <!-- Translation in Active Language -->
            <p class="text-xs sm:text-sm text-teal-100 text-center leading-relaxed max-w-xl mx-auto">
              "${inspiration.translation}"
            </p>

            <!-- Action Button -->
            <div class="pt-2 flex justify-center">
              <a href="${inspiration.link}" class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-amber-300 border border-teal-600/50 text-xs font-bold transition shadow-sm">
                <span>${L.studyNow}</span>
                <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- 2. CONTINUE READING / TILAWAT QUICK RESUME CARD -->
        <div class="bg-gradient-to-r from-emerald-800 via-teal-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-teal-600/40 flex items-center justify-between gap-4">
          <div class="space-y-1 min-w-0">
            <div class="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              ${L.lastReadBadge}
            </div>
            <h3 class="text-base sm:text-lg font-black font-arabic text-white truncate">
              ${surahDisplayName}
            </h3>
            <p class="text-xs text-emerald-100/90 font-mono">
              ${L.ayahNumber} • ${L.juzNumber}
            </p>
          </div>
          <a href="#/quran/${lastRead.surahNumber || 1}" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold text-xs shadow-md transition shrink-0 flex items-center gap-1.5 active:scale-95">
            <i data-lucide="book-open" class="w-4 h-4 text-teal-900"></i>
            <span>${L.continueBtn}</span>
          </a>
        </div>

        <!-- 3. PRIMARY ACADEMIC HUBS (Ordered: 1.Quran, 2.Hadith, 3.Library, 4.Courses, 5.Tools, 6.Adventure) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.hubsTitle}
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
            
            <!-- Pillar 1: Quran -->
            <a href="#/quran" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                <i data-lucide="book" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">${L.pQuranTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pQuranSub}</p>
              </div>
            </a>

            <!-- Pillar 2: Hadith -->
            <a href="#/hadith" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                <i data-lucide="scroll" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">${L.pHadithTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pHadithSub}</p>
              </div>
            </a>

            <!-- Pillar 3: Classical Library -->
            <a href="#/library" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                <i data-lucide="library" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">${L.pLibraryTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pLibrarySub}</p>
              </div>
            </a>

            <!-- Pillar 4: Courses & Diplomas -->
            <a href="#/courses" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">${L.pCoursesTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pCoursesSub}</p>
              </div>
            </a>

            <!-- Pillar 5: Islamic Tools & Mirath -->
            <a href="#/islamic-tools" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                <i data-lucide="sparkles" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition">${L.pToolsTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pToolsSub}</p>
              </div>
            </a>

            <!-- Pillar 6: Islamic Adventure Game (Moved to 6th spot with clean white/emerald card) -->
            <a href="#/adventure" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition shadow-2xs">
                🎮
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">${L.pAdventureTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${L.pAdventureSub}</p>
              </div>
            </a>

          </div>
        </div>

        <!-- 4. CLASSICAL ISLAMIC LIBRARY (Featured 4 Books) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-black text-slate-900 dark:text-white">${L.booksTitle}</h2>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.booksSub}</p>
            </div>
            <a href="#/library" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>${L.viewAllBooks}</span>
              <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            ${allBooks.map(book => `
              <div class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-500 transition group">
                <div class="space-y-2">
                  <div class="w-full h-32 rounded-xl bg-gradient-to-br from-teal-900 to-slate-950 p-2 text-white flex flex-col justify-between shadow-inner relative overflow-hidden">
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white w-max backdrop-blur-xs font-mono">
                      ${book.categoryName || 'کتاب'}
                    </span>
                    <div>
                      <h4 class="font-arabic font-bold text-xs text-amber-200 leading-snug line-clamp-2">${book.title}</h4>
                      <p class="text-[9px] text-teal-200/90 truncate mt-0.5">${book.author}</p>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-teal-700 transition">${book.title}</h4>
                    <p class="text-[10px] text-slate-500 truncate">${book.author}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button onclick="window.Views.openBookReader('${book.id}')" class="w-full py-1.5 px-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-[11px] flex items-center justify-center gap-1 transition">
                    <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                    <span>${L.readBtn}</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. ACADEMIC MASTERCLASSES (Featured 4 Courses) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-black text-slate-900 dark:text-white">${L.coursesTitle}</h2>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.coursesSub}</p>
            </div>
            <a href="#/courses" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>${L.viewAllCourses}</span>
              <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${courses.map(c => `
              <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-500 transition group">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-600/30">
                      ${L.freeBadge}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      ${c.duration || '6 اسباق'}
                    </span>
                  </div>
                  <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition leading-snug">
                    ${c.title}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    ${c.description || 'مستند شیوخ کے تحت مکمل اسباق اور آن لائن امتحانی مشقیں۔'}
                  </p>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-3">
                  <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    استاد: <strong class="text-slate-700 dark:text-slate-200">${c.instructor || 'شیخ الحدیث'}</strong>
                  </span>
                  <a href="#/courses/${c.id}" class="py-1.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
                    ${L.enrollBtn}
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};
