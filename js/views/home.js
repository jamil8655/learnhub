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

    <!-- Contact & Direct Inquiry Hub (Connected to Email & WhatsApp) -->
    <section class="py-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white border-t border-emerald-500/30 relative overflow-hidden font-urdu" dir="rtl">
      <!-- Background Glow Pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
      
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-urdu">
          <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
          <span>📬 براہِ راست رابطہ و رہنمائی (24/7)</span>
        </div>

        <h3 class="text-3xl sm:text-4xl font-extrabold font-urdu">ہم سے براہِ راست رابطہ کریں اور فوری رہنمائی حاصل کریں</h3>
        <p class="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto font-urdu leading-relaxed">
          داخلہ رہنمائی، دینی مسائل، تجاویز یا کسی بھی سوال کے لیے اپنا پیغام درج کریں۔ آپ کا پیغام براہِ راست ہمارے ایڈمن ڈیٹا بیس، ای میل اور واٹس ایپ پر موصول ہوگا۔
        </p>

        <!-- Direct Message Form -->
        <div class="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4 text-right">
          <form onsubmit="window.Views.sendContactInquiry(event)" class="space-y-3 font-urdu">
            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا مبارک نام</label>
              <input type="text" id="cnt-name" required placeholder="مثلاً: محمد عبد اللہ" class="w-full bg-white/90 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu">
            </div>

            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا ای میل ایڈریس یا فون نمبر</label>
              <input type="text" id="cnt-contact" required placeholder="ای میل یا واٹس ایپ نمبر..." class="w-full bg-white/90 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu">
            </div>

            <div>
              <label class="text-xs font-bold text-emerald-200 block mb-1">آپ کا پیغام یا سوال</label>
              <textarea id="cnt-message" rows="3" required placeholder="اپنا سوال یا پیغام تفصیل سے لکھیں..." class="w-full bg-white/90 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-400 focus:outline-none font-urdu leading-relaxed"></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button type="submit" class="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2">
                <i data-lucide="mail" class="w-4 h-4"></i>
                <span>ای میل کے ذریعے بھیجیں</span>
              </button>

              <button type="button" onclick="window.Views.sendWhatsAppDirect()" class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 border border-emerald-400/40">
                <i data-lucide="message-circle" class="w-4 h-4 text-emerald-300"></i>
                <span>واٹس ایپ پر 1-کلک پیغام</span>
              </button>
            </div>
          </form>

          <!-- Direct Admin Credentials Banner -->
          <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-200/90 font-mono">
            <span class="flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5 text-amber-400"></i> JRahmanAnsari132@gmail.com</span>
            <span class="flex items-center gap-1.5 text-emerald-300 font-bold"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-400"></i> واٹس ایپ: +91 7521019766 (جمیل رحمان انصاری)</span>
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
  const body = encodeURIComponent(`السلام علیکم ورحمۃ اللہ،\n\nمحترم جمیل رحمان انصاری صاحب،\n\nٹکٹ نمبر: ${ticketNumber}\nنام: ${name}\nرابطہ نمبر / ای میل: ${contact}\n\nپیغام:\n${message}\n\nماخوذ از: LearnHub Islamic Academy (https://jamil8655.github.io/learnhub/)`);

  const mailtoUrl = `mailto:JRahmanAnsari132@gmail.com?subject=${subject}&body=${body}`;
  const waText = encodeURIComponent(`السلام علیکم جمیل صاحب،\nمیرا نام ${name} ہے۔\nرابطہ نمبر: ${contact}\nٹکٹ نمبر: ${ticketNumber}\n\nپیغام:\n${message}\n\n(ماخوذ از LearnHub: https://jamil8655.github.io/learnhub/)`);
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
          <span>جمیل رحمان انصاری کو واٹس ایپ پر بھیجیں (1-Click)</span>
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

  const text = encodeURIComponent(`السلام علیکم جمیل صاحب،\nمیرا نام ${name} ہے۔\n${contact ? 'میرا رابطہ نمبر: ' + contact + '\n' : ''}\nپیغام:\n${message}\n\n(ماخوذ از LearnHub: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${text}`;
  window.open(whatsappUrl, '_blank');
  window.App.showToast('واٹس ایپ چیٹ (+91 7521019766) کھل رہی ہے...', 'success');
};

// Reusable Components
window.Views.components = window.Views.components || {};

window.Views.components.renderCourseCard = function(course) {
  const category = course.category || window.DB.findById('categories', course.categoryId) || { name: 'علومِ اسلامیہ' };
  const badgeLabel = course.badge || (course.isFree ? 'مفت' : 'جامع کورس');
  
  return `
    <div class="lh-card lh-card-hover overflow-hidden flex flex-col group font-urdu border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-slate-900">
      <div class="relative aspect-video overflow-hidden">
        <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>
        <div class="absolute top-3 start-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full shadow-md">
            <i data-lucide="award" class="w-3.5 h-3.5"></i> ${badgeLabel}
          </span>
        </div>
        <div class="absolute bottom-3 end-3 bg-slate-900/90 backdrop-blur text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow font-mono">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i> ${course.durationHours} گھنٹے
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">${category.name}</span>
            <span class="text-slate-500 dark:text-slate-400 text-[11px]">${course.level}</span>
          </div>
          <h4 class="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-relaxed">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${course.shortDescription}</p>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 font-bold text-amber-500 font-mono">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i>
              <span>${course.rating || 5.0}</span>
              <span class="text-slate-400 font-normal">(${course.ratingCount || 100})</span>
            </div>
            <div class="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-600"></i>
              <span>${course.enrolledCount ? course.enrolledCount.toLocaleString() : '12,000'} طالب علم</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="flex items-baseline gap-2">
              <span class="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                ${course.isFree ? 'مفت (فی سبیل اللہ)' : `$${course.price}`}
              </span>
            </div>
            <a href="#/courses/${course.id}" class="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition">
              <span>کورس دیکھیں</span>
              <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
};
