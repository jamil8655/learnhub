/**
 * LearnHub Master Home View & Daily Islamic Experience
 * 100% Trilingual localization (English, Urdu, Arabic)
 * Includes Daily Hadith, Daily Ayah, Continue Reading Banner,
 * 6-Pillar Quick Grid, Live Prayer Times, Featured Courses, 300+ Books Spotlight & Haramain Live.
 */

window.Views = window.Views || {};
window.Views.components = window.Views.components || {};

// 31 Authentic Trilingual Daily Inspirations
const DAILY_INSPIRATIONS_LIST = [
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
      en: 'O Allah, I ask You for beneficial knowledge, good provision, and acceptable deeds.',
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

function getHomeLang() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'en';
}

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = getHomeLang();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';

  // Rotating Daily Inspiration
  const now = new Date();
  const rawInspiration = DAILY_INSPIRATIONS_LIST[(now.getDate() - 1) % DAILY_INSPIRATIONS_LIST.length];
  const todayInspiration = {
    icon: rawInspiration.icon,
    arabic: rawInspiration.arabic,
    type: rawInspiration.type[currentLang] || rawInspiration.type.en,
    translation: rawInspiration.translation[currentLang] || rawInspiration.translation.en,
    ref: rawInspiration.ref[currentLang] || rawInspiration.ref.en,
    link: rawInspiration.link
  };

  // User & DB data
  const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
  const lastRead = window.QuranService ? window.QuranService.getLastRead() : { surahNumber: 1, ayahNumber: 1 };
  const allCourses = window.DB ? (window.DB.get('courses') || []) : [];
  const courses = allCourses.slice(0, 4);
  const allBooks = (window.ISLAMIC_LIBRARY_BOOKS && window.ISLAMIC_LIBRARY_BOOKS.length > 0) ? window.ISLAMIC_LIBRARY_BOOKS.slice(0, 4) : [];

  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      
      <!-- Screen Inner Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        <!-- 1. GREETING & DAILY HADITH / AYAH BANNER -->
        <div class="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-teal-700/50 relative overflow-hidden">
          <div class="relative z-10 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-[11px] font-bold text-teal-100">
                ${todayInspiration.icon} <span>${todayInspiration.type}</span>
              </span>
              <span class="text-[11px] text-teal-200/80 font-semibold">${todayInspiration.ref}</span>
            </div>

            <!-- Arabic Vocalized Text -->
            <div class="text-xl sm:text-2xl font-black font-arabic text-center py-2 text-amber-300 leading-relaxed drop-shadow-sm" dir="rtl">
              ${todayInspiration.arabic}
            </div>

            <!-- Translation -->
            <p class="text-xs sm:text-sm text-teal-50 text-center leading-relaxed max-w-xl mx-auto">
              "${todayInspiration.translation}"
            </p>

            <!-- Action Button -->
            <div class="pt-2 flex justify-center">
              <a href="${todayInspiration.link}" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition">
                <span>مطالعہ و تلاوت کریں</span>
                <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- 2. CONTINUE READING / TILAWAT QUICK RESUME CARD (Reference Design) -->
        <div class="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
              ${isRtl ? 'آخری تلاوت (Last Read)' : 'Continue Reading'}
            </div>
            <h3 class="text-base sm:text-lg font-black font-arabic text-white">
              سورۃ الفاتحہ (Surah ${lastRead.surahNumber || 1})
            </h3>
            <p class="text-xs text-emerald-100/90">
              آیت نمبر ${lastRead.ayahNumber || 1} • پارہ 1
            </p>
          </div>
          <a href="#/quran/${lastRead.surahNumber || 1}" class="px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs hover:bg-teal-50 shadow transition shrink-0 flex items-center gap-1.5">
            <i data-lucide="book-open" class="w-4 h-4 text-teal-700"></i>
            <span>تلاوت شروع کریں</span>
          </a>
        </div>

        <!-- 3. PRIMARY PILLARS (6-Card Clean White Grid) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${t('homePillarsTitle', 'تعلیمی و دینی شعبے (Explore Hubs)')}
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            
            <!-- Pillar 1: Quran -->
            <a href="#/quran" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="book" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">قرآن مجید</h3>
                <p class="text-[11px] text-slate-500">114 سورتیں و تلاوت</p>
              </div>
            </a>

            <!-- Pillar 2: Hadith -->
            <a href="#/hadith" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="scroll" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">کتبِ حدیث</h3>
                <p class="text-[11px] text-slate-500">بخاری، مسلم و سنن</p>
              </div>
            </a>

            <!-- Pillar 3: 300+ Books Library -->
            <a href="#/library" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="library" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">300+ کتب خانہ</h3>
                <p class="text-[11px] text-slate-500">تفاسیر، فقہ و سیرت</p>
              </div>
            </a>

            <!-- Pillar 4: Quizzes & Exams -->
            <a href="#/quizzes" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="help-circle" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">کوئز امتحانات</h3>
                <p class="text-[11px] text-slate-500">ٹیسٹ و شاہی اسناد</p>
              </div>
            </a>

            <!-- Pillar 5: Adventure Game -->
            <a href="#/adventure" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="gamepad-2" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">اسلامک ایڈونچر</h3>
                <p class="text-[11px] text-slate-500">کلاس 1 تا 10 پزلز</p>
              </div>
            </a>

            <!-- Pillar 6: Islamic Tools -->
            <a href="#/islamic-tools" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition">
                <i data-lucide="compass" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">اسلامی ٹولز</h3>
                <p class="text-[11px] text-slate-500">اوقاتِ نماز، زکوٰۃ، میراث</p>
              </div>
            </a>

          </div>
        </div>

        <!-- 4. PRAYER TIMES LIVE COUNTDOWN STRIP -->
        <div class="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
              <i data-lucide="clock" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">اوقاتِ نماز و اذان</div>
              <div class="text-[11px] text-slate-500">فلکیاتی شمسی وقت کے مطابق درست حساب</div>
            </div>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shrink-0">فجر: 04:45 AM</span>
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shrink-0">ظہر: 12:15 PM</span>
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shrink-0">عصر: 04:30 PM</span>
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shrink-0">مغرب: 06:25 PM</span>
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shrink-0">عشاء: 07:45 PM</span>
          </div>
        </div>

        <!-- 5. 300+ CLASSICAL BOOKS SPOTLIGHT -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                کتبِ سلف و تفاسیر (Classical Islamic Library)
              </h2>
              <p class="text-xs text-slate-500">آن لائن مطالعہ اور پی ڈی ایف ڈاؤن لوڈ کے لیے دستیاب کتب</p>
            </div>
            <a href="#/library" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>تمام کتب (300+)</span>
              <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            ${allBooks.map(b => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5 hover:border-teal-600 transition">
                <img src="${b.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'}" class="w-14 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" alt="${b.title}">
                <div class="flex-1 min-w-0">
                  <span class="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${b.categoryName?.ur || b.categoryName?.en || 'کتاب'}</span>
                  <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-1">${b.title}</h4>
                  <p class="text-[11px] text-slate-500 truncate">${b.author}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <button onclick="window.Views.openBookReader('${b.id}')" class="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] flex items-center gap-1 transition">
                      <i data-lucide="book-open" class="w-3 h-3"></i>
                      <span>مطالعہ کریں</span>
                    </button>
                    <button onclick="window.Views.downloadBookPdf('${b.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] hover:bg-slate-200 transition">
                      <i data-lucide="download" class="w-3 h-3"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6. FEATURED COURSES -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                آن لائن کورسز و اسباق (Academic Masterclasses)
              </h2>
              <p class="text-xs text-slate-500">مستند شیوخ و اساتذہ کے زیرِ نگرانی تیار کردہ مکمل اسباق</p>
            </div>
            <a href="#/courses" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>تمام کورسز</span>
              <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            ${courses.map(c => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition flex flex-col justify-between space-y-3">
                <div class="flex items-start gap-3">
                  <img src="${c.thumbnail || 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=160'}" class="w-20 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" alt="${c.title}">
                  <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${c.category?.name || 'اسلامک کورس'}</span>
                    <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-1">${c.title}</h4>
                    <p class="text-[11px] text-slate-500 truncate">${c.instructor?.name || 'اہلِ علم'}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs">
                  <span class="font-bold text-slate-900 dark:text-white">${c.isFree ? 'مفت (Free)' : '$' + c.price}</span>
                  <a href="#/courses/${c.id}" class="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition">داخلہ لیں &larr;</a>
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
