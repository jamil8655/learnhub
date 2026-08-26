/**
 * LearnHub Home View
 * Ultra-premium modern EdTech homepage with multi-lingual i18n support.
 */

window.Views = window.Views || {};

// 31 Authentic Daily Inspirations (1 for each day of the month)
const DAILY_INSPIRATIONS_LIST = [
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', urdu: 'بے شک ہر تنگی کے ساتھ آسانی ہے۔', ref: 'سورۃ الشرح: 6', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', urdu: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔', ref: 'صحیح بخاری: 5027', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', urdu: 'اور دعا کیجیے کہ اے میرے رب! میرے علم میں اضافہ فرما۔', ref: 'سورۃ طہٰ: 114', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', urdu: 'اعمال کا دارومدار نیتوں پر ہے۔', ref: 'صحیح بخاری: 1', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي', urdu: 'پس تم مجھے یاد رکھو، میں تمہیں یاد رکھوں گا، اور میرا شکر ادا کرو۔', ref: 'سورۃ البقرہ: 152', link: '#/duas' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', urdu: 'جو شخص علم کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔', ref: 'صحیح مسلم: 2699', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ', urdu: 'اور اس زبردست اور نہایت رحم فرمانے والے پر بھروسہ رکھیں۔', ref: 'سورۃ الشعراء: 217', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔', ref: 'صحیح بخاری: 10', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', urdu: 'سن لو! اللہ کے ذکر ہی سے دلوں کو سکون ملتا ہے۔', ref: 'سورۃ الرعد: 28', link: '#/duas' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ', urdu: 'پاکیزگی اور صفائی نصف ایمان ہے۔', ref: 'صحیح مسلم: 223', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', urdu: 'بے شک اللہ تعالیٰ صبر کرنے والوں کے ساتھ ہے۔', ref: 'سورۃ البقرہ: 153', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', urdu: 'تم میں سے کوئی مومن نہیں ہو سکتا جب تک کہ وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔', ref: 'صحیح بخاری: 13', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ', urdu: 'اور میری رحمت ہر چیز پر حاوی ہے۔', ref: 'سورۃ الاعراف: 156', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', urdu: 'تم جہاں کہیں بھی رہو، اللہ کا تقویٰ اور ڈر اختیار کرو۔', ref: 'جامع ترمذی: 1987', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ', urdu: 'اور جب میرے بندے آپ سے میرے متعلق پوچھیں تو یقیناً میں بالکل قریب ہوں۔', ref: 'سورۃ البقرہ: 186', link: '#/duas' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ', urdu: 'اپنے بھائی کے سامنے تمہارا مسکرانا بھی صدقہ ہے۔', ref: 'جامع ترمذی: 1956', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ', urdu: 'کیا نیکی کا بدلہ نیکی کے سوا کچھ اور ہو سکتا ہے؟', ref: 'سورۃ الرحمن: 60', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', urdu: 'جو اللہ اور قیامت پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔', ref: 'صحیح بخاری: 6018', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', urdu: 'اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔', ref: 'سورۃ البقرہ: 286', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'احْفَظِ اللَّهَ يَحْفَظْكَ', urdu: 'تم اللہ کے احکام کی حفاظت کرو، اللہ تمہاری حفاظت فرمائے گا۔', ref: 'جامع ترمذی: 2516', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', urdu: 'اور صبر اور نماز کے ذریعے اللہ سے مدد طلب کرو۔', ref: 'سورۃ البقرہ: 45', link: '#/prayer-times' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ', urdu: 'رحم کرنے والوں پر رحمان رحم فرماتا ہے، زمین والوں پر رحم کرو آسمان والا تم پر رحم کرے گا۔', ref: 'سنن ابی داؤد: 4941', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', urdu: 'بے شک اللہ تعالیٰ احسان و نیکی کرنے والوں سے محبت فرماتا ہے۔', ref: 'سورۃ البقرہ: 195', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', urdu: 'اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو ہمیشہ کیا جائے، اگرچہ تھوڑا ہی ہو۔', ref: 'صحیح بخاری: 6464', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', urdu: 'اور بھلائی کرو، بے شک اللہ بھلائی کرنے والوں کو پسند فرماتا ہے۔', ref: 'سورۃ البقرہ: 195', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ', urdu: 'دعا ہی اصل عبادت ہے۔', ref: 'جامع ترمذی: 3247', link: '#/duas' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', urdu: 'اور جو اللہ سے ڈرے گا، اللہ اس کے لیے راستے پیدا فرما دے گا۔', ref: 'سورۃ الطلاق: 2', link: '#/quran' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', urdu: 'پاکیزہ اور اچھی بات کہنا بھی صدقہ ہے۔', ref: 'صحیح مسلم: 1009', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', urdu: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما۔', ref: 'سورۃ البقرہ: 201', link: '#/duas' },
  { type: 'حدیثِ مبارکہ', icon: '📜', arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', urdu: 'جس نے کسی نیکی کی رہنمائی کی، اس کو نیکی کرنے والے جیسا اجر ملے گا۔', ref: 'صحیح مسلم: 1893', link: '#/hadith' },
  { type: 'آیتِ مبارکہ', icon: '✨', arabic: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ', urdu: 'اور اپنے رب کی بخشش اور اس جنت کی طرف تیزی سے دوڑو جس کی وسعت آسمانوں اور زمین جیسی ہے۔', ref: 'سورۃ آل عمران: 133', link: '#/quran' }
];

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;
  const cms = (window.DB && window.DB.get('cmsContent')) || {};
  const currentLang = (window.I18N && typeof window.I18N.getLanguage === 'function')
    ? window.I18N.getLanguage() 
    : ((window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'ur');

  // Calculate Today's Automatic Inspiration (Changes Daily)
  const now = new Date();
  const dayOfMonth = now.getDate(); // 1 to 31
  const todayInspiration = DAILY_INSPIRATIONS_LIST[(dayOfMonth - 1) % DAILY_INSPIRATIONS_LIST.length];

  const allCourses = window.DB ? (window.DB.get('courses') || []) : [];
  const courses = allCourses.length > 0 ? allCourses.slice(0, 6) : (await window.API.getCourses({ sort: 'popular' })).slice(0, 6);
  const categories = window.DB ? (window.DB.get('categories') || []) : [];
  const instructors = window.DB ? (window.DB.get('instructors') || []).slice(0, 4) : [];
  const allQuizzes = window.DB ? (window.DB.get('quizzes') || []) : [];
  const standaloneQuizzes = allQuizzes.length > 0 ? allQuizzes.slice(0, 3) : (await window.API.getQuizzes({ sort: 'popular' })).slice(0, 3);

  container.innerHTML = `
    <!-- Automatic Daily Inspiration & Auto-Resume Bar (Rotating Daily) -->
    <div class="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-500/20 py-2.5 sm:py-3 px-3 sm:px-8 w-full shadow-inner">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs font-urdu text-right" dir="rtl">
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-center md:justify-start gap-1.5 sm:gap-3 text-center sm:text-right">
          <span class="badge bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold shadow-sm shrink-0">
            ${todayInspiration.icon} آج کی ${todayInspiration.type}
          </span>
          <span class="text-emerald-100 text-xs leading-relaxed font-semibold">
            «${todayInspiration.arabic}» — ${todayInspiration.urdu} <strong class="text-amber-300">(${todayInspiration.ref})</strong>
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0" dir="ltr">
          <a href="${todayInspiration.link}" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[11px] font-bold text-white transition flex items-center gap-1.5 shadow-md active:scale-95">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span>مکمل مطالعہ کریں</span>
          </a>
          <a href="#/duas" class="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 shadow-md active:scale-95">
            <i data-lucide="bookmark" class="w-3.5 h-3.5"></i> <span>مسنون دعائیں</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Mobile Access Ribbon (4 Unified Luxury Cards) -->
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 font-urdu" dir="rtl">
        <a href="#/quran" class="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center gap-3 transition group active:scale-95 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition">
            <i data-lucide="book-open" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">تجوید القرآن</div>
            <div class="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">تمام 114 سورتیں</div>
          </div>
        </a>

        <a href="#/hadith" class="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 flex items-center gap-3 transition group active:scale-95 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition">
            <i data-lucide="scroll" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">چالیس احادیث</div>
            <div class="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-semibold">مکمل اردو ترجمہ</div>
          </div>
        </a>

        <a href="#/adventure" class="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:bg-slate-900 border border-amber-500/40 hover:border-amber-400 flex items-center gap-3 transition group active:scale-95 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition">
            <i data-lucide="gamepad-2" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-extrabold text-amber-500 dark:text-amber-400 truncate">اسلامی ایڈونچر</div>
            <div class="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-300 font-semibold">9 جہان و پزلز</div>
          </div>
        </a>

        <a href="#/support" class="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 flex items-center gap-3 transition group active:scale-95 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-700 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition">
            <i data-lucide="message-circle" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">24/7 سپورٹ</div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold">براہِ راست رہنمائی</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-6 pb-14 sm:pt-10 sm:pb-20 md:py-24 w-full">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div class="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-start font-urdu" dir="rtl">
            
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-sm max-w-full">
              <i data-lucide="crown" class="w-4 h-4 text-amber-500 shrink-0"></i>
              <span class="truncate">مستند دینی و عصری اسلامی اکیڈمی</span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.3] break-words">
              علومِ اسلامیہ، تجوید القرآن اور مستند احادیث کا <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">شاہی مرکز</span>
            </h1>

            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              قرآن فہمی، صحیح تلفظ و تجوید، اربعین نووی اور فقہ العبادات کے ماسٹر کورسز میں داخلہ لیں۔ آن لائن ٹائمر والے امتحانات دیں اور بارکوڈ والی تصدیق شدہ اسناد حاصل کریں۔
            </p>

            <!-- Direct Action CTAs with Instant Login & Dashboard Entry -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 font-urdu">
              ${(window.Auth && window.Auth.isAuthenticated()) ? `
                <a href="#/dashboard" class="btn-primary w-full sm:w-auto py-3 px-6 text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                  <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                  <span>🎓 میرا لرننگ ڈیش بورڈ</span>
                </a>
                ${window.Auth.isAdmin() ? `
                  <a href="#/admin" class="btn-gold w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="shield" class="w-4 h-4"></i>
                    <span>🛡️ ایڈمن سنٹرل کنسول</span>
                  </a>
                ` : ''}
              ` : `
                <a href="#/login" class="btn-primary w-full sm:w-auto py-3 px-6 text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                  <i data-lucide="log-in" class="w-4 h-4"></i>
                  <span>🔑 لاگ اِن پینل (Sign In)</span>
                </a>
                <a href="#/register" class="py-3 px-5 text-xs sm:text-sm font-extrabold rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 shadow-md active:scale-95 transition flex items-center justify-center gap-2">
                  <i data-lucide="user-plus" class="w-4 h-4"></i>
                  <span>✨ نیا اکاؤنٹ بنائیں</span>
                </a>
              `}
              <a href="#/courses" class="py-3 px-5 text-xs sm:text-sm font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4 text-indigo-500"></i>
                <span>کورسز کی فہرست</span>
              </a>
            </div>

            <!-- Search Bar -->
            <div class="max-w-xl w-full mx-auto lg:mx-0 relative mt-3 sm:mt-4">
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 sm:p-2 gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-emerald-500 transition-all w-full">
                <div class="flex items-center flex-1 min-w-0">
                  <i data-lucide="search" class="w-4 sm:w-5 h-4 sm:h-5 text-slate-400 mx-2 shrink-0"></i>
                  <input 
                    type="text" 
                    id="hero-search-input" 
                    placeholder="کورس، سورت، حدیث یا کوئز تلاش کریں..." 
                    class="w-full bg-transparent border-none px-2 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs sm:text-sm font-urdu text-right"
                    onkeydown="if(event.key==='Enter') { window.Router.navigate('/courses?search=' + encodeURIComponent(this.value)); }"
                  />
                </div>
                <button 
                  onclick="const val = document.getElementById('hero-search-input').value; window.Router.navigate('/courses?search=' + encodeURIComponent(val));"
                  class="btn-primary py-2.5 px-5 text-xs sm:text-sm rounded-xl whitespace-nowrap w-full sm:w-auto font-urdu">
                  تلاش کریں
                </button>
              </div>
            </div>

            <!-- Stats Bar (100% Real Live Metrics) -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg w-full mx-auto lg:mx-0 font-urdu text-center">
              <div class="p-2 sm:p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/10">
                <div class="text-xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">114</div>
                <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">مکمل سورتیں</div>
              </div>
              <div class="p-2 sm:p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-500/10">
                <div class="text-xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">${(window.ALL_COMBINED_HADITHS && window.ALL_COMBINED_HADITHS.length) ? window.ALL_COMBINED_HADITHS.length : 40}+</div>
                <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">مستند احادیث</div>
              </div>
              <div class="p-2 sm:p-3 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-2xl border border-cyan-500/10">
                <div class="text-xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">${courses.length}+</div>
                <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">جامع کورسز</div>
              </div>
            </div>
          </div>

          <!-- Hero Image & Interactive Card Mockup -->
          <div class="lg:col-span-5 relative w-full">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Glow background -->
              <div class="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>

              <div class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
                <!-- Live Learning Session Card -->
                <div class="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 font-urdu text-right" dir="rtl">
                  <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">جاری کورس</div>
                    <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">قرآنی تجوید و قراءت ماسٹر کلاس</div>
                    <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: 100%;"></div>
                    </div>
                  </div>
                  <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono shrink-0">100%</span>
                </div>

                <!-- Islamic Adventure Feature Card -->
                <div class="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl relative overflow-hidden font-urdu text-right border border-amber-500/40" dir="rtl">
                  <div class="flex items-center justify-between mb-2.5">
                    <span class="badge bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black shadow-sm flex items-center gap-1">
                      <i data-lucide="gamepad-2" class="w-3 h-3"></i> لرن ہب اسلامی ایڈونچر گیم
                    </span>
                    <span class="flex items-center gap-1 text-xs text-amber-300 font-bold font-sans" dir="ltr">
                      🪙 250 Coins • Lvl 1
                    </span>
                  </div>
                  <h4 class="font-extrabold text-sm sm:text-base mb-1 text-white">9 اسلامی جہان، انٹرایکٹو پزلز اور انعامات</h4>
                  <p class="text-xs text-slate-300 mb-3 leading-relaxed">تجوید، سیرت، قصص الانبیاء اور فقہ کا پرکشش صوتی گیم ایڈونچر۔</p>
                  <a href="#/adventure" class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-amber-500/30 active:scale-95">
                    <span>🎮 گیم کا آغاز کریں (Play Adventure)</span>
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                  </a>
                </div>

                <!-- Verified Certificate Quick Portal Snippet -->
                <div class="flex items-center justify-between p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-urdu" dir="rtl">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-slate-900 dark:text-white truncate">شاہی تصدیق شدہ اسناد پورٹل</div>
                      <div class="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">محفوظ آن لائن کوڈ ویریفکیشن</div>
                    </div>
                  </div>
                  <a href="#/certificates" class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0">تصدیق کریں &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-12 sm:py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 text-right">
          <div>
            <h2 class="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-2">شعبہ جات و علوم</h2>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">اسلامی و عصری علوم کے اہم شعبے</h3>
          </div>
          <a href="#/courses" class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-3 md:mt-0">
            <span>تمام شعبے دیکھیں</span> &larr;
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          ${categories.map(cat => `
            <a href="#/courses?category=${cat.id}" class="lh-card p-4 sm:p-5 text-center flex flex-col items-center justify-center hover:border-emerald-500 hover:shadow-lg transition group rounded-2xl">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <i data-lucide="${cat.icon || 'book-open'}" class="w-6 h-6 sm:w-7 sm:h-7"></i>
              </div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition font-urdu">${cat.name}</h4>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Masterclasses -->
    <section class="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 text-right">
          <div>
            <span class="badge badge-primary mb-1 sm:mb-2">🌟 نمایاں کورسز</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">جامع آن لائن ماسٹر کلاسز</h3>
            <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">مستند شیوخ و اساتذہ کے زیرِ نگرانی تیار کردہ مکمل اسباق اور مشقیں۔</p>
          </div>
          <a href="#/courses" class="btn-secondary text-xs sm:text-sm mt-3 md:mt-0 font-urdu">تمام کورسز دیکھیں</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          ${courses.slice(0, 6).map(course => window.Views.components.renderCourseCard(course)).join('')}
        </div>
      </div>
    </section>

    <!-- ISLAMIC ADVENTURE GAME SPOTLIGHT SECTION (BRIGHT & PROFESSIONAL DAYLIGHT DESIGN) -->
    <section class="py-12 sm:py-20 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white relative overflow-hidden font-urdu select-none border-y-2 border-emerald-200 dark:border-slate-800" dir="rtl">
      <!-- Glow ambient background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-right">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md mb-3">
              <i data-lucide="gamepad-2" class="w-4 h-4"></i> لرن ہب اسلامی ایڈونچر گیم
            </div>
            <h3 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              علم و کھیل کا خوبصورت سنگم — کلاس 1 تا کلاس 10
            </h3>
            <p class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed font-semibold">
              بچوں کی عمر اور جماعت کے مطابق کلاس 1 سے کلاس 10 تک کے مرحلہ وار لیولز، پزلز، میموری کارڈز، طلائی سکے (Coins) اور انعامات۔
            </p>
          </div>
          <a href="#/adventure" class="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm shrink-0 shadow-xl shadow-amber-500/30 active:scale-95 transition flex items-center gap-2">
            <span>🎮 ایڈونچر میپ کھولیں (Play Game)</span>
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </a>
        </div>

        <!-- 3 Bright Feature Highlight Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Card 1: Classes 1 to 10 -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30">
              🎒
            </div>
            <h4 class="text-lg font-black text-slate-900 dark:text-white">کلاس 1 تا کلاس 10 جماعت وار نصاب</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              پہلی، دوسری، تیسری تا دسویں کلاس کے بچوں کے لیے مخصوص پزلز، نماز کے ارکان، تجوید، سیرت اور دعاؤں کے مراحل۔
            </p>
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              <span>Classes 1 to 10 • 50+ Levels</span>
            </div>
          </div>

          <!-- Card 2: 7 Mini-Games -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 text-2xl shadow-lg shadow-amber-400/30">
              🧩
            </div>
            <h4 class="text-lg font-black text-slate-900 dark:text-white">7 انٹرایکٹو گیم پلے موڈز</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ترتیبِ عمل پزل، میموری کارڈ میچ، کلمات کا ربط، تیز رفتار فیصلے اور حقیقی صوتی گھنٹیاں و انعامی اثرات۔
            </p>
            <div class="text-xs font-bold text-amber-600 dark:text-amber-400 font-sans">
              <span>Puzzles • Memory • Sounds</span>
            </div>
          </div>

          <!-- Card 3: 1-v-1 Arena & Rewards -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30">
              ⚔️
            </div>
            <h4 class="text-lg font-black text-slate-900 dark:text-white">دوست سے مقابلہ، سکے و اسناد</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              روم کوڈ کے ذریعے دوستوں کو چیلنج کریں، طلائی سکے (Coins) کمائیں، پاور اپس خریدیں اور شاہی اسناد حاصل کریں۔
            </p>
            <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-sans">
              <span>1-v-1 Battles • Verifiable Certificates</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Instructors -->
    <section class="py-12 sm:py-16 bg-white dark:bg-slate-900 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span class="badge badge-primary mb-1 sm:mb-2">👨‍🏫 شیوخ و اساتذہ</span>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">مستند اور تجربہ کار اساتذہ سے علم حاصل کریں</h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">جامعہ الازہر، مدینہ یونیورسٹی اور بین الاقوامی تعلیمی اداروں کے مستند اساتذہ۔</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          ${instructors.map(inst => `
            <div class="lh-card p-5 sm:p-6 text-center flex flex-col items-center hover:shadow-lg transition rounded-2xl">
              <img src="${inst.avatar}" alt="${inst.name}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mb-3 sm:mb-4 shadow-md border-2 border-emerald-500/30">
              <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">${inst.name}</h4>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2.5 sm:mb-3">${inst.title}</p>
              <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 sm:pt-3 w-full justify-center">
                <span class="flex items-center gap-1"><i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i> ${inst.rating}</span>
                <span>•</span>
                <span>${inst.studentsCount.toLocaleString()} طلباء</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Verified Certificates Showcase & Public Verification Box -->
    <section class="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center text-right">
          <div class="lg:col-span-6 space-y-4 sm:space-y-6">
            <span class="badge badge-success">📜 شاہی تصدیق شدہ اسناد</span>
            <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">عالمی سطح پر تسلیم شدہ اسناد حاصل کریں</h3>
            <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed">
              کورس مکمل کرنے یا آن لائن امتحانات میں نمایاں نمبر حاصل کرنے پر ہر طالب علم کو بارکوڈ اور آن لائن ویری فکیشن والی مستند سند جاری کی جاتی ہے۔
            </p>
            <ul class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 shrink-0"></i> مکمل رازداری کے ساتھ منفرد تصدیقی سیریل کوڈ</li>
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 shrink-0"></i> ہائی ریزولوشن پرنٹ کے قابل شاہی سندِ فراغت</li>
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 shrink-0"></i> بارکوڈ اسکین اور فوری آن لائن تصدیقی پورٹل</li>
            </ul>
            <div class="pt-2">
              <a href="#/certificates" class="btn-outline text-xs sm:text-sm font-urdu">پورٹلِ اسناد کھولیں &larr;</a>
            </div>
          </div>

          <div class="lg:col-span-6 w-full">
            <div class="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/30 shadow-2xl relative w-full overflow-hidden space-y-4 text-center">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-black text-slate-900 dark:text-white">سند کی آن لائن تصدیق</h4>
              <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                سند کی نقل روکنے کے لیے اسناد اوپن نہیں رکھی جاتیں۔ اپنا تصدیقی کوڈ درج کر کے سند کی فوری تصدیق فرمائیں:
              </p>
              
              <div class="max-w-md mx-auto flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-amber-300 dark:border-slate-700 focus-within:border-amber-500 transition">
                <input 
                  type="text" 
                  id="home-cert-verify-input" 
                  placeholder="سند کا تصدیقی کوڈ درج کریں..." 
                  class="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none text-right font-bold"
                  onkeydown="if(event.key==='Enter') { const val = this.value.trim(); if(val) { window._activeCertSearchCode = val; window.Router.navigate('/certificates?code=' + encodeURIComponent(val)); } }"
                />
                <button 
                  type="button"
                  onclick="const inp = document.getElementById('home-cert-verify-input'); const val = inp ? inp.value.trim() : ''; if(!val){ window.App.showToast('براہِ کرم تصدیقی کوڈ درج فرمائیں۔', 'warning'); return; } window._activeCertSearchCode = val; window.Router.navigate('/certificates?code=' + encodeURIComponent(val));"
                  class="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap shadow transition active:scale-95 flex items-center gap-1 shrink-0"
                >
                  <i data-lucide="search" class="w-3.5 h-3.5"></i>
                  <span>تصدیق کریں</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grand Islamic Super Suite Matrix -->
    <section class="py-12 sm:py-16 bg-white dark:bg-slate-900 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-2">
          <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">⭐ اسلامی ڈیجیٹل ٹولز و جدید سہولیات</span>
          <h3 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">اسلامی و عصری تعلیم کا عظیم الشان ڈیجیٹل مرکز</h3>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            قرآن، حدیث، فقہ، تجوید، سیرت، اور جدید ترین اے آئی ٹولز کے ساتھ اپنی دینی و دنیاوی زندگی کو سنواریں۔
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 text-right">
          
          <!-- 1. AI Scholar -->
          <a href="#/ai-scholar" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">🤖</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition">اے آئی اسلامی اسکالر</h4>
              <p class="text-[10px] text-slate-500 leading-tight">قرآن و سنت کی روشنی میں فوری سوال و جواب۔</p>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 pt-2 block">پوچھیں &larr;</span>
          </a>

          <!-- 2. Live Makkah & Madinah -->
          <a href="#/live-streams" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md">🕋</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition">24/7 لائیو حرمین</h4>
              <p class="text-[10px] text-slate-500 leading-tight">مکہ مکرمہ و مدینہ منورہ لائیو نشریات۔</p>
            </div>
            <span class="text-[10px] font-bold text-rose-600 pt-2 block">دیکھیں &larr;</span>
          </a>

          <!-- 3. Mirath Calculator -->
          <a href="#/mirath" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl shadow-md">⚖️</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">شرعی وراثت کیلکولیٹر</h4>
              <p class="text-[10px] text-slate-500 leading-tight">قرآنی اصولوں کے مطابق ورثاء کا حساب۔</p>
            </div>
            <span class="text-[10px] font-bold text-amber-600 pt-2 block">حساب لگائیں &larr;</span>
          </a>

          <!-- 4. Asma-ul-Husna -->
          <a href="#/asmaul-husna" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shadow-md">✨</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">99 اسمائے حسنیٰ</h4>
              <p class="text-[10px] text-slate-500 leading-tight">صوتی قراءت اور روحانی فضائل۔</p>
            </div>
            <span class="text-[10px] font-bold text-amber-600 pt-2 block">پڑھیں &larr;</span>
          </a>

          <!-- 5. Sunnah Tracker -->
          <a href="#/sunnah-tracker" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">📅</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition">سنت و نماز ٹریکر</h4>
              <p class="text-[10px] text-slate-500 leading-tight">روزانہ کا باجماعت نماز و اذکار چارٹ۔</p>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 pt-2 block">چیک کریں &larr;</span>
          </a>

          <!-- 6. Voice Tajweed -->
          <a href="#/voice-tajweed" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl shadow-md">🎙️</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">صوتی تجوید چیکر</h4>
              <p class="text-[10px] text-slate-500 leading-tight">مائیکروفون میں تلاوت کا لائیو امتحان۔</p>
            </div>
            <span class="text-[10px] font-bold text-teal-600 pt-2 block">امتحان دیں &larr;</span>
          </a>

          <!-- 7. 1-v-1 Quiz Battle -->
          <a href="#/battle-arena" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md">⚔️</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition">1-v-1 کوئز بیٹل</h4>
              <p class="text-[10px] text-slate-500 leading-tight">دوستوں کے ساتھ 60 سیکنڈ کا لائیو مقابلہ۔</p>
            </div>
            <span class="text-[10px] font-bold text-indigo-600 pt-2 block">مقابلہ کھیلیں &larr;</span>
          </a>

          <!-- 8. Moon Sighting -->
          <a href="#/moon-sighting" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-xl shadow-md">🌙</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-400 transition">رویتِ ہلال و چاند</h4>
              <p class="text-[10px] text-slate-500 leading-tight">چاند کی فلکیاتی پوزیشن اور مسنون دعائیں۔</p>
            </div>
            <span class="text-[10px] font-bold text-indigo-600 pt-2 block">دیکھیں &larr;</span>
          </a>

          <!-- 9. AR Qibla Camera -->
          <a href="#/qibla-camera" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl shadow-md">📱</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 transition">کیمرہ قبلہ رخ</h4>
              <p class="text-[10px] text-slate-500 leading-tight">موبائل کیمرے کے ذریعے لائیو کعبہ کی سمت۔</p>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 pt-2 block">معلوم کریں &larr;</span>
          </a>

          <!-- 10. Islamic Heritage -->
          <a href="#/heritage" class="lh-card p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col justify-between group">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl shadow-md">🗺️</div>
              <h4 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition">تاریخی مقامات کا ٹور</h4>
              <p class="text-[10px] text-slate-500 leading-tight">مقدس تاریخی آثار کی تفصیلی تاریخ۔</p>
            </div>
            <span class="text-[10px] font-bold text-amber-600 pt-2 block">سیر کریں &larr;</span>
          </a>

        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span class="badge badge-primary mb-1 sm:mb-2">💬 طلباء کے تاثرات</span>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">ہمارے طلباء لرن ہب کے بارے میں کیا کہتے ہیں</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-right">
          <div class="lh-card p-5 sm:p-6 rounded-2xl">
            <div class="flex items-center gap-1 text-amber-500 mb-3 sm:mb-4">
              ${'<i data-lucide="star" class="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">"تجوید القرآن کا کورس مکمل کرنے کے بعد میری تلاوت میں مخارج اور ترتیل کا جو نکھار آیا ہے وہ بیان سے باہر ہے۔ کوئز سسٹم لاجواب ہے!"</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-emerald-500/40">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">محمد طارق</div>
                <div class="text-[10px] sm:text-[11px] text-slate-500">طالب علم تجوید</div>
              </div>
            </div>
          </div>

          <div class="lh-card p-5 sm:p-6 rounded-2xl">
            <div class="flex items-center gap-1 text-amber-500 mb-3 sm:mb-4">
              ${'<i data-lucide="star" class="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">"اربعین نووی اور احادیث کا ذخیرہ اردو ترجمے اور اعراب کے ساتھ موبائل پر پڑھنا انتہائی آسان اور روح پرور ہے۔ جزاکم اللہ خیرا!"</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-emerald-500/40">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">احمد المنصور</div>
                <div class="text-[10px] sm:text-[11px] text-slate-500">طالب علم علوم الحدیث</div>
              </div>
            </div>
          </div>

          <div class="lh-card p-5 sm:p-6 rounded-2xl">
            <div class="flex items-center gap-1 text-amber-500 mb-3 sm:mb-4">
              ${'<i data-lucide="star" class="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">"موبائل پر نیچے دیے گئے نیویگیشن ڈوک اور فوری کوئز سسٹم نے سیکھنے کے عمل کو انتہائی آسان بنا دیا ہے۔ بہترین ایپ ہے!"</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-emerald-500/40">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">فاطمہ زہراء</div>
                <div class="text-[10px] sm:text-[11px] text-slate-500">طالبہ اسلامی فقہ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Direct Inquiry Hub (Connected to Email & WhatsApp) -->
    <section class="py-12 sm:py-16 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white border-t border-emerald-500/30 relative overflow-hidden font-urdu w-full" dir="rtl">
      <!-- Background Glow Pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
      
      <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6 relative z-10">
        
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold font-urdu">
          <i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>📬 براہِ راست رابطہ و رہنمائی (24/7)</span>
        </div>

        <h3 class="text-2xl sm:text-4xl font-extrabold font-urdu">ہم سے براہِ راست رابطہ کریں اور فوری رہنمائی حاصل کریں</h3>
        <p class="text-emerald-100/80 text-xs sm:text-base max-w-2xl mx-auto font-urdu leading-relaxed">
          داخلہ رہنمائی، دینی مسائل، تجاویز یا کسی بھی سوال کے لیے اپنا پیغام درج کریں۔ آپ کا پیغام براہِ راست ہمارے ایڈمن ڈیٹا بیس، ای میل اور واٹس ایپ پر موصول ہوگا۔
        </p>

        <!-- Direct Message Form -->
        <div class="max-w-xl w-full mx-auto bg-slate-900/90 backdrop-blur-md p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-2xl space-y-3 sm:space-y-4 text-right">
          <form onsubmit="window.Views.sendContactInquiry(event)" class="space-y-3 font-urdu">
            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا مبارک نام</label>
              <input type="text" id="cnt-name" required placeholder="مثلاً: محمد عبد اللہ" class="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 text-xs sm:text-sm rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu">
            </div>

            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا ای میل ایڈریس یا فون نمبر</label>
              <input type="text" id="cnt-contact" required placeholder="ای میل یا واٹس ایپ نمبر..." class="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 text-xs sm:text-sm rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu">
            </div>

            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا پیغام یا سوال</label>
              <textarea id="cnt-message" rows="3" required placeholder="اپنا سوال یا پیغام تفصیل سے لکھیں..." class="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 text-xs sm:text-sm rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu leading-relaxed"></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button type="submit" class="w-full py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2">
                <i data-lucide="mail" class="w-4 h-4"></i>
                <span>ای میل کے ذریعے بھیجیں</span>
              </button>

              <button type="button" onclick="window.Views.sendWhatsAppDirect()" class="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 border border-emerald-400/40">
                <i data-lucide="message-circle" class="w-4 h-4 text-emerald-300"></i>
                <span>واٹس ایپ پر 1-کلک پیغام</span>
              </button>
            </div>
          </form>

          <!-- Official Support Credentials Banner -->
          <div class="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-emerald-200/90 font-mono text-center sm:text-right">
            <span class="flex items-center gap-1.5 break-all"><i data-lucide="mail" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i> support@learnhub.com</span>
            <span class="flex items-center gap-1.5 text-emerald-300 font-bold"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i> آن لائن سپورٹ ڈیسک: 24/7 دستیاب</span>
          </div>
        </div>

      </div>
    </section>
  `;
};

window.Views.sendContactInquiry = function(e) {
  e.preventDefault();
  const name = document.getElementById('cnt-name')?.value?.trim() || 'طالب علم';
  const contact = document.getElementById('cnt-contact')?.value?.trim() || 'student@learnhub.com';
  const message = document.getElementById('cnt-message')?.value?.trim() || '';

  if (!message) {
    window.App.showToast('براہِ کرم اپنا پیغام درج فرمائیں۔', 'warning');
    return;
  }

  const ticketNumber = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Save to DB inquiries for Admin Panel
  window.DB.insert('supportTickets', {
    id: `inq-${Date.now()}`,
    ticketNumber,
    userName: name,
    userEmail: contact,
    contactInfo: contact,
    category: 'عمومی استفسار (General Inquiry)',
    priority: 'medium',
    subject: `استفسار از طرف: ${name}`,
    message: message,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  });

  window.DB.logAudit(name, 'INQUIRY_SUBMITTED', `${ticketNumber} from ${contact}`);

  const subject = encodeURIComponent(`[${ticketNumber}] LearnHub Inquiry: ${name}`);
  const body = encodeURIComponent(`السلام علیکم ورحمۃ اللہ،\n\nلرن ہب سپورٹ ٹیم،\n\nٹکٹ نمبر: ${ticketNumber}\nنام: ${name}\nرابطہ نمبر / ای میل: ${contact}\n\nپیغام:\n${message}\n\nماخوذ از: LearnHub Islamic Academy (https://jamil8655.github.io/learnhub/)`);

  const waText = encodeURIComponent(`السلام علیکم لرن ہب سپورٹ ٹیم،\nمیرا نام ${name} ہے۔\nرابطہ نمبر: ${contact}\nٹکٹ نمبر: ${ticketNumber}\n\nپیغام:\n${message}\n\n(ماخوذ از LearnHub: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${waText}`;

  // Open direct Email compose
  try {
    window.location.href = mailtoUrl;
  } catch (err) {
    console.warn('Mailto open error:', err);
  }

  // Show Success Confirmation Modal with 1-Click WhatsApp option
  window.App.showModal('پیغام ایڈمن پینل میں محفوظ ہو گیا! ✅', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">${ticketNumber}</span>
          <span class="badge bg-emerald-500 text-slate-950 text-[10px] font-bold">ایڈمن لاگ محفوظ</span>
        </div>
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">نام: ${name} (${contact})</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${message}</p>
      </div>

      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        آپ کا استفسار ایڈمن پورٹل میں محفوظ ہو چکا ہے اور ای میل کھل چکی ہے۔ آپ نیچے دیے گئے بٹن پر کلک کر کے فوری طور پر جمیل رحمان انصاری صاحب کو واٹس ایپ پر بھی میسج بھیج سکتے ہیں۔
      </p>

      <div class="space-y-2 pt-2">
        <a 
          href="${whatsappUrl}" 
          target="_blank"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition"
        >
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>جمیل رحمان انصاری کو واٹس ایپ پر بھیجیں (+91 7521019766)</span>
        </a>

        <a 
          href="${mailtoUrl}"
          class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
        >
          <i data-lucide="mail" class="w-4 h-4"></i>
          <span>ای میل کلائنٹ دوبارہ کھولیں</span>
        </a>
      </div>

      <div class="pt-2 text-center">
        <button onclick="window.App.closeModal();" class="btn-secondary py-2 px-6 text-xs rounded-xl">
          ٹھیک ہے
        </button>
      </div>
    </div>
  `);

  window.App.showToast('پیغام ایڈمن پینل اور ای میل میں لاگ ہو گیا!', 'success');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.sendWhatsAppDirect = function() {
  const name = document.getElementById('cnt-name')?.value?.trim() || 'طالب علم';
  const contact = document.getElementById('cnt-contact')?.value?.trim() || '';
  const message = document.getElementById('cnt-message')?.value?.trim() || 'السلام علیکم جمیل صاحب، مجھے اسلامی کورسز اور پلیٹ فارم کے حوالے سے معلومات چاہیے۔';

  const ticketNumber = `WA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Log in DB so admin can track inquiries initiated via WhatsApp
  window.DB.insert('supportTickets', {
    id: `inq-wa-${Date.now()}`,
    ticketNumber,
    userName: name,
    userEmail: contact || 'WhatsApp Contact',
    contactInfo: contact || '+91 7521019766',
    category: 'واٹس ایپ استفسار (WhatsApp Inquiry)',
    priority: 'medium',
    subject: `WhatsApp Inquiry: ${name}`,
    message: message,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  });

  const text = encodeURIComponent(`السلام علیکم لرن ہب سپورٹ ٹیم،\nمیرا نام ${name} ہے۔\n${contact ? 'میرا رابطہ نمبر: ' + contact + '\n' : ''}\nپیغام:\n${message}\n\n(ماخوذ از LearnHub: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${text}`;
  window.open(whatsappUrl, '_blank');
  window.App.showToast('آن لائن واٹس ایپ سپورٹ کھل رہی ہے...', 'success');
};

// Reusable Components
window.Views.components = window.Views.components || {};

window.Views.components.renderCourseCard = function(course) {
  const category = course.category || (window.DB && typeof window.DB.findById === 'function' ? window.DB.findById('categories', course.categoryId) : null) || { name: 'علومِ اسلامیہ' };
  const badgeLabel = course.badge || (course.isFree ? 'مفت ماسٹر کلاس' : 'جامع ڈپلوما');
  const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
  const isEnrolled = currentUser && window.DB && typeof window.DB.get === 'function'
    ? window.DB.get('enrollments').some(e => e.userId === currentUser.id && e.courseId === course.id)
    : false;
  
  return `
    <div class="lh-card overflow-hidden flex flex-col justify-between group font-urdu border-2 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/80 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white dark:bg-slate-900 text-right relative" dir="rtl">
      
      <!-- Top Thumbnail Container with Aspect Ratio & Badges -->
      <div class="relative aspect-video overflow-hidden rounded-t-3xl">
        <img 
          src="${course.thumbnail || 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=600'}" 
          alt="${course.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
        
        <!-- Category & Level Badges -->
        <div class="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-extrabold rounded-full shadow-md border border-emerald-400/30">
            <i data-lucide="tag" class="w-3 h-3"></i>
            <span>${category.name}</span>
          </span>
        </div>

        <div class="absolute top-3 left-3">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-full shadow-md border border-amber-400/30">
            ${course.level || 'تمام درجات'}
          </span>
        </div>

        <!-- Duration & Status Badge -->
        <div class="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md border border-emerald-500/20 font-mono">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>${course.durationHours || 12} گھنٹے</span>
        </div>

        ${isEnrolled ? `
          <div class="absolute bottom-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
            <span>✓ داخلہ فعال</span>
          </div>
        ` : ''}
      </div>

      <!-- Card Body -->
      <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div class="space-y-2.5">
          <!-- Rating & Enrolled Count -->
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 font-extrabold text-amber-500 font-mono">
              <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
              <span>${course.rating || 5.0}</span>
              <span class="text-slate-400 font-normal">(${course.ratingCount || 120} آراء)</span>
            </div>
            
            <div class="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-semibold">
              <i data-lucide="users" class="w-3.5 h-3.5 text-indigo-500"></i>
              <span>${course.enrolledCount ? course.enrolledCount.toLocaleString() : '1,500'}+ طلباء</span>
            </div>
          </div>

          <!-- Course Title -->
          <h4 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h4>

          <!-- Short Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-semibold">
            ${course.shortDescription || course.subtitle || 'مستند اسلامی نصاب اور تجوید و قراءت کی شاہی کلاسز۔'}
          </p>
        </div>

        <!-- Card Footer & Action Buttons -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-1">
              <span class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                ${course.isFree ? 'مفت (فی سبیل اللہ)' : `$${course.price}`}
              </span>
            </div>
            
            <div class="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <i data-lucide="award" class="w-3.5 h-3.5"></i>
              <span>شاہی سند شامل ہے</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <a href="#/courses/${course.id}" class="py-2.5 px-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition active:scale-95">
              تفصیلات دیکھیں
            </a>

            ${isEnrolled ? `
              <a href="#/learn/${course.id}" class="py-2.5 px-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1">
                <span>سبق پڑھیں</span>
                <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              </a>
            ` : `
              <button onclick="window.Views.enrollFreeCourse('${course.id}')" class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1">
                <span>مفت داخلہ لیں</span>
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              </button>
            `}
          </div>

        </div>

      </div>

    </div>
  `;
};
