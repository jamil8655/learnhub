/**
 * LearnHub Home View
 * Ultra-premium modern EdTech homepage with multi-lingual i18n support.
 */

window.Views = window.Views || {};

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  const cms = window.DB.get('cmsContent') || {};
  const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;
  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'ur';

  const courses = await window.API.getCourses({ sort: 'popular' });
  const categories = window.DB.get('categories');
  const instructors = window.DB.get('instructors').slice(0, 4);
  const standaloneQuizzes = (await window.API.getQuizzes({ sort: 'popular' })).slice(0, 3);

  container.innerHTML = `
    <!-- Top Announcement Banner -->
    ${cms.bannerActive ? `
      <div class="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs md:text-sm font-medium py-2.5 px-4 text-center flex items-center justify-center gap-2">
        <i data-lucide="sparkles" class="w-4 h-4 text-yellow-300"></i>
        <span>${currentLang === 'ur' ? '🚀 لرن ہب خصوصی آفر: کوپن کوڈ LEARN20 استعمال کریں اور 20% رعایت حاصل کریں!' : currentLang === 'ar' ? '🚀 عرض خاص: استخدم الكوبون LEARN20 للحصول على خصم 20%!' : cms.bannerText}</span>
        <a href="#/courses" class="underline mx-2 font-bold hover:text-indigo-100">${currentLang === 'ur' ? 'کورسز دیکھیں' : currentLang === 'ar' ? 'تصفح الآن' : 'Explore Now'} &rarr;</a>
      </div>
    ` : ''}

    <!-- Automatic Daily Inspiration & Auto-Resume Bar -->
    <div class="bg-slate-900 text-white border-b border-slate-800 py-3 px-4 sm:px-8">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-urdu text-right" dir="rtl">
        <div class="flex items-center gap-3">
          <span class="badge bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">✨ آج کی آیتِ مبارکہ</span>
          <span class="text-slate-300">«إِنَّ مَعَ الْعُسْرِ يُسْرًا» — بے شک ہر تنگی کے ساتھ آسانی ہے۔ (سورۃ الشرح)</span>
        </div>
        <div class="flex items-center gap-2" dir="ltr">
          <a href="#/quran" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[11px] font-bold text-white transition flex items-center gap-1">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i> قرآن پڑھیں
          </a>
          <a href="#/hadith" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-xl text-[11px] font-bold text-white transition flex items-center gap-1">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> احادیث
          </a>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-12 pb-20 md:py-24 gradient-bg-hero">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 text-center lg:text-start">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-semibold animate-pulse-slow">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>${t('badgeHero', 'Next-Gen Learning & Standalone Assessments')}</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.25]">
              ${t('heroTitlePrefix', 'Master Tech Skills with')} <span class="gradient-text">${t('heroTitleGradient', 'World-Class Mentors')}</span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              ${t('heroSubtitle', 'Access hands-on courses, test real-world mastery with standalone timed quizzes, and earn verifiable industry credentials.')}
            </p>

            <!-- Search Bar -->
            <div class="max-w-xl mx-auto lg:mx-0 relative mt-4">
              <div class="flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <i data-lucide="search" class="w-6 h-6 text-slate-400 mx-2"></i>
                <input 
                  type="text" 
                  id="hero-search-input"
                  placeholder="${t('heroSearchInput', 'Search courses, standalone quizzes, instructors, skills...')}" 
                  class="w-full bg-transparent border-none px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base"
                  onkeydown="if(event.key==='Enter') { window.Router.navigate('/courses?search=' + encodeURIComponent(this.value)); }"
                />
                <button 
                  onclick="const val = document.getElementById('hero-search-input').value; window.Router.navigate('/courses?search=' + encodeURIComponent(val));"
                  class="btn-primary py-2.5 px-5 text-sm rounded-xl whitespace-nowrap">
                  ${t('heroSearchBtn', 'Search')}
                </button>
              </div>
            </div>

            <!-- Quick Pill Filters -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-urdu">
              <span class="font-medium text-slate-700 dark:text-slate-300">مقبول موضوعات:</span>
              <a href="#/courses?category=cat-1" class="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition">قرآنی تجوید</a>
              <a href="#/courses?category=cat-2" class="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-amber-500 hover:text-amber-600 transition">اربعین نووی</a>
              <a href="#/quizzes" class="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full font-semibold hover:bg-amber-100 transition">اسلامی کوئزز</a>
              <a href="#/courses?category=cat-3" class="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition">فقہ العبادات</a>
              <a href="#/courses?category=cat-4" class="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-cyan-500 hover:text-cyan-600 transition">سیرت النبی ﷺ</a>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0 font-urdu">
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">65K+</div>
                <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">طالبانِ علم</div>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
                <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">مستند نصاب</div>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">100%</div>
                <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">تصدیق شدہ اسناد</div>
              </div>
            </div>
          </div>

          <!-- Hero Image & Interactive Card Mockup -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Glow background -->
              <div class="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>

              <div class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <!-- Live Learning Session Card -->
                <div class="flex items-center gap-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 font-urdu">
                  <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">جاری کورس</div>
                    <div class="text-sm font-bold text-slate-900 dark:text-white truncate">قرآنی تجوید و قراءت ماسٹر کلاس</div>
                    <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: 100%;"></div>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">100%</span>
                </div>

                <!-- Standalone Quiz Feature Card -->
                <div class="p-4 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl shadow-lg relative overflow-hidden font-urdu">
                  <div class="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-amber-500/20 rounded-full blur-xl"></div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="badge badge-warning text-[10px]">مستقل تشخیصی امتحان</span>
                    <span class="flex items-center gap-1 text-xs text-amber-300 font-semibold font-mono">
                      <i data-lucide="clock" class="w-3.5 h-3.5"></i> 10 Mins
                    </span>
                  </div>
                  <h4 class="font-bold text-base mb-1">قرآن فہمی، تجوید اور سورتوں کے اہم مضامین کا ٹیسٹ</h4>
                  <p class="text-xs text-slate-300 mb-4">بغیر کورس داخلہ لیے آزادانہ ٹائمر والا کوئز دیں۔</p>
                  <a href="#/quiz-take/qz-isl-1" class="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-white text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-50 transition shadow">
                    <span>ابھی کوئز شروع کریں</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </a>
                </div>

                <!-- Verified Certificate Snippet -->
                <div class="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-100">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold">${t('verifiedCredential', 'Verified Industry Certificate')}</div>
                      <div class="text-[11px] text-emerald-700 dark:text-emerald-300">ID: LH-CERT-2026-8841</div>
                    </div>
                  </div>
                  <a href="#/verify-cert/LH-CERT-2026-8841" class="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline">&rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 class="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">${t('exploreCategories', 'Explore Categories')}</h2>
            <h3 class="text-3xl font-extrabold text-slate-900 dark:text-white">${t('exploreCategoriesSub', 'Learn in-demand technologies')}</h3>
          </div>
          <a href="#/courses" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-4 md:mt-0">
            ${t('browseAllCategories', 'Browse all categories')} &rarr;
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          ${categories.map(cat => `
            <a href="#/courses?category=${cat.id}" class="lh-card p-5 text-center flex flex-col items-center justify-center hover:border-indigo-500 hover:shadow-lg transition group">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition" style="background-color: ${cat.color}15; color: ${cat.color};">
                <i data-lucide="${cat.icon || 'book-open'}" class="w-7 h-7"></i>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">${cat.name}</h4>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Masterclasses -->
    <section class="py-16 bg-slate-50 dark:bg-slate-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span class="badge badge-primary mb-2">${t('topRated', 'Top Rated')}</span>
            <h3 class="text-3xl font-extrabold text-slate-900 dark:text-white">${t('featuredMasterclasses', 'Featured Masterclasses')}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">${t('featuredMasterclassesSub', 'Structured comprehensive courses taught by industry leaders.')}</p>
          </div>
          <a href="#/courses" class="btn-secondary text-sm mt-4 md:mt-0">${t('viewAllCourses', 'View All Courses')}</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${courses.slice(0, 6).map(course => window.Views.components.renderCourseCard(course)).join('')}
        </div>
      </div>
    </section>

    <!-- STANDALONE QUIZZES SPOTLIGHT (Requirement #11, 12, 13) -->
    <section class="py-16 bg-gradient-to-b from-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-3">
              <i data-lucide="zap" class="w-3.5 h-3.5"></i> ${t('standaloneSpotlightBadge', 'Standalone Diagnostic Engine')}
            </div>
            <h3 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${t('standaloneSpotlightTitle', 'Test Your Skills Directly With Standalone Quizzes')}</h3>
            <p class="text-slate-300 text-sm max-w-2xl mt-2">
              ${t('standaloneSpotlightSub', 'No course enrollment required. Take timed assessments, receive instant question-by-question explanations, and benchmark your knowledge.')}
            </p>
          </div>
          <a href="#/quizzes" class="btn-primary bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold border-none mt-4 md:mt-0">
            ${t('browseAllQuizzes', 'Browse All Quizzes')}
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${standaloneQuizzes.map(quiz => `
            <div class="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition group">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-xs">
                    ${quiz.difficulty}
                  </span>
                  <span class="text-xs text-slate-400 flex items-center gap-1">
                    <i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-400"></i> ${quiz.timeLimitMinutes} mins
                  </span>
                </div>
                <h4 class="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">${quiz.title}</h4>
                <p class="text-xs text-slate-300 mb-6 line-clamp-2">${quiz.shortDescription}</p>
              </div>

              <div class="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <div class="text-[11px] text-slate-400">Passing Score</div>
                  <div class="text-sm font-bold text-white">${quiz.passingPercentage}% (${quiz.totalMarks} pts)</div>
                </div>
                <a href="#/quiz-take/${quiz.id}" class="btn-primary py-2 px-4 text-xs rounded-xl">
                  <span>${t('startQuiz', 'Start Quiz')}</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Top Instructors -->
    <section class="py-16 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="badge badge-primary mb-2">${t('expertMentors', 'Expert Mentors')}</span>
          <h3 class="text-3xl font-extrabold text-slate-900 dark:text-white">${t('topInstructorsTitle', 'Learn from the World\'s Best')}</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mt-2">${t('topInstructorsSub', 'Every instructor on LearnHub is an active industry practitioner with deep engineering credentials.')}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${instructors.map(inst => `
            <div class="lh-card p-6 text-center flex flex-col items-center hover:shadow-lg transition">
              <img src="${inst.avatar}" alt="${inst.name}" class="w-24 h-24 rounded-2xl object-cover mb-4 shadow-md border-2 border-indigo-100 dark:border-indigo-900">
              <h4 class="font-bold text-base text-slate-900 dark:text-white">${inst.name}</h4>
              <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">${inst.title}</p>
              <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 w-full justify-center">
                <span class="flex items-center gap-1"><i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i> ${inst.rating}</span>
                <span>•</span>
                <span>${inst.studentsCount.toLocaleString()} Students</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Verified Certificates Showcase -->
    <section class="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6 space-y-6">
            <span class="badge badge-success">${t('verifiableCredentialsBadge', 'Verifiable Credentials')}</span>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">${t('verifiableCertsTitle', 'Earn Professional Certificates That Stand Out')}</h3>
            <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              ${t('verifiableCertsSub', 'Upon 100% course completion or high-scoring diagnostic quiz achievement, receive an encrypted, digitally verifiable certificate with a permanent URL and QR verification code.')}
            </p>
            <ul class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i> Unique serial verification code for LinkedIn and resume</li>
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i> High-resolution printable PDF download</li>
              <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i> Instant employer validation portal (#/verify-cert/ID)</li>
            </ul>
            <div class="pt-2">
              <a href="#/verify-cert/LH-CERT-2026-8841" class="btn-outline text-sm">Test Verification Portal &rarr;</a>
            </div>
          </div>

          <div class="lg:col-span-6">
            <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border-4 border-indigo-600/30 shadow-2xl relative">
              <div class="border-2 border-indigo-500/20 p-6 rounded-2xl text-center space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span class="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Official Certificate of Completion</span>
                  <i data-lucide="award" class="w-6 h-6 text-indigo-600"></i>
                </div>
                <p class="text-xs text-slate-500 uppercase tracking-wider">This is to certify that</p>
                <h4 class="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">Alex Johnson</h4>
                <p class="text-xs text-slate-500">has successfully mastered and demonstrated excellence in</p>
                <div class="text-base font-bold text-indigo-600 dark:text-indigo-400">مکمل فل اسٹیک ویب ڈویلپمنٹ ماسٹرکلاس</div>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  <span>Issued: February 18, 2026</span>
                  <span class="font-mono text-indigo-500 font-bold">LH-CERT-2026-8841</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="badge badge-primary mb-2">${t('studentFeedback', 'Student Feedback')}</span>
          <h3 class="text-3xl font-extrabold text-slate-900 dark:text-white">${t('trustedByEngineers', 'Trusted by Engineers Everywhere')}</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="lh-card p-6">
            <div class="flex items-center gap-1 text-amber-500 mb-4">
              ${'<i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 italic mb-6">"اردو میں اتنا اعلیٰ معیار کا فل اسٹیک ویب ڈویلپمنٹ کورس اور آن لائن کوئز سسٹم پہلی بار دیکھنے کو ملا ہے۔ شاندار تجربہ!"</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="w-10 h-10 rounded-full object-cover">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">علی رضا</div>
                <div class="text-[11px] text-slate-500">Full-Stack Engineer</div>
              </div>
            </div>
          </div>

          <div class="lh-card p-6">
            <div class="flex items-center gap-1 text-amber-500 mb-4">
              ${'<i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 italic mb-6">"منصة تعليمية متكاملة واحترافية. التقييمات المستقلة ساعدتني كثيراً في فهم المفاهيم البرمجية بدقة."</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" class="w-10 h-10 rounded-full object-cover">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">أحمد المنصور</div>
                <div class="text-[11px] text-slate-500">AI Researcher</div>
              </div>
            </div>
          </div>

          <div class="lh-card p-6">
            <div class="flex items-center gap-1 text-amber-500 mb-4">
              ${'<i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>'.repeat(5)}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 italic mb-6">"The mobile app experience with bottom navigation and instant standalone quizzes makes learning on-the-go effortless!"</p>
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" class="w-10 h-10 rounded-full object-cover">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">Emily Rodriguez</div>
                <div class="text-[11px] text-slate-500">Cloud Consultant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 class="text-3xl sm:text-4xl font-extrabold">${t('stayAhead', 'Stay Ahead of Emerging Tech')}</h3>
        <p class="text-indigo-100 text-base max-w-xl mx-auto">
          ${t('newsletterSub', 'Join 65,000+ engineers receiving weekly deep-dive tutorials, standalone diagnostic challenges, and curriculum updates.')}
        </p>
        <form onsubmit="event.preventDefault(); window.App.showToast('Thank you for subscribing!', 'success'); this.reset();" class="max-w-md mx-auto flex gap-2">
          <input type="email" required placeholder="Enter your email address..." class="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none shadow">
          <button type="submit" class="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl text-sm transition shadow">${t('subscribe', 'Subscribe')}</button>
        </form>
      </div>
    </section>
  `;
};

// Reusable Components
window.Views.components = window.Views.components || {};

window.Views.components.renderCourseCard = function(course) {
  return `
    <div class="lh-card lh-card-hover overflow-hidden flex flex-col group">
      <div class="relative aspect-video overflow-hidden">
        <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
        ${course.badge ? `
          <div class="absolute top-3 start-3">
            <span class="badge ${course.badge === 'Bestseller' ? 'badge-warning' : course.badge === 'Free' ? 'badge-success' : 'badge-primary'} font-bold shadow">
              ${course.badge}
            </span>
          </div>
        ` : ''}
        <div class="absolute bottom-3 end-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
          <i data-lucide="clock" class="w-3 h-3"></i> ${course.durationHours} hrs
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-medium text-indigo-600 dark:text-indigo-400">${course.category?.name || 'Technology'}</span>
            <span class="badge badge-neutral text-[10px]">${course.level}</span>
          </div>
          <h4 class="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${course.shortDescription}</p>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 font-bold text-amber-500">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500"></i>
              <span>${course.rating}</span>
              <span class="text-slate-400 font-normal">(${course.ratingCount || 100})</span>
            </div>
            <div class="text-slate-500 dark:text-slate-400 text-[11px]">
              ${course.lessonCount || 10} lessons
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <div class="flex items-baseline gap-2">
              <span class="text-lg font-extrabold text-slate-900 dark:text-white">
                ${course.isFree ? 'FREE' : `$${course.price}`}
              </span>
              ${!course.isFree && course.originalPrice ? `
                <span class="text-xs text-slate-400 line-through">$${course.originalPrice}</span>
              ` : ''}
            </div>
            <a href="#/courses/${course.id}" class="btn-secondary py-1.5 px-3 text-xs rounded-lg">
              ${window.I18N ? window.I18N.t('curriculumLessons', 'Details') : 'Details'} &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
};
