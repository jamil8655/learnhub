/**
 * LearnHub Islamic Courses Catalog & Course Details Views (Multi-lingual: English, Urdu, Arabic)
 */

window.Views = window.Views || {};
window.Views.components = window.Views.components || {};

window.Views.components.renderCourseCard = function(course) {
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const isFree = course.isFree !== false;
  const categoryName = course.category?.name || t('navCourses', isRtl ? 'علومِ اسلامیہ' : 'Islamic Sciences');
  const instructorName = course.instructor?.name || t('roleInstructor', isRtl ? 'استاد محترم' : 'Lead Instructor');

  return `
    <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <div class="space-y-3">
        <div class="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative shadow-sm">
          <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=500'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${course.title}">
          <div class="absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} flex items-center gap-1.5">
            ${(course.status === 'draft' || course.isPublished === false || course.isDraft === true) ? `
              <span class="badge bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md animate-pulse">
                🟡 ${t('adminDraft', isRtl ? 'مسودہ / Draft Preview' : 'Draft Preview')}
              </span>
            ` : ''}
            <span class="px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-teal-300 text-[10px] font-bold">
              ${categoryName}
            </span>
          </div>
          <span class="absolute bottom-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-mono">
            ⏱ ${course.durationHours || 12} ${t('courseDuration', isRtl ? 'گھنٹے' : 'Hours')}
          </span>
        </div>

        <div class="space-y-1.5">
          <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            ${course.shortDescription || course.description || ''}
          </p>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="${course.instructor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-6 h-6 rounded-full object-cover border border-teal-500">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">${instructorName}</span>
        </div>
        <span class="text-xs font-black text-teal-700 dark:text-teal-400">
          ${isFree ? t('courseFree', isRtl ? 'مفت' : 'FREE') : `$${course.price}`}
        </span>
      </div>

    </div>
  `;
};

window.Views.renderCourses = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const categories = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('categories') || []) : [];

  const activeCategory = query.category || 'all';
  const activeLevel = query.level || 'all';
  const activeSort = query.sort || 'popular';
  const activeSearch = query.search || '';

  const courses = await window.API.getCourses({
    category: activeCategory,
    level: activeLevel,
    sort: activeSort,
    search: activeSearch
  });

  // Calculate active filters count
  let activeFiltersCount = 0;
  if (activeCategory !== 'all') activeFiltersCount++;
  if (activeLevel !== 'all') activeFiltersCount++;
  if (activeSearch.trim()) activeFiltersCount++;

  const activeCategoryObj = categories.find(c => c.id === activeCategory);

  // Localized level text helper
  const getLevelLabel = (lvl) => {
    if (lvl === 'all') return t('allLevels', 'All Levels');
    if (lvl === 'beginner' || lvl === 'ابتدائی' || lvl === 'مبتدئ') return t('filterBeginner', 'Beginner');
    if (lvl === 'intermediate' || lvl === 'متوسط') return t('filterIntermediate', 'Intermediate');
    if (lvl === 'advanced' || lvl === 'اعلیٰ' || lvl === 'متقدم') return t('filterAdvanced', 'Advanced');
    return lvl;
  };

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 ${fontClass} w-full max-w-full overflow-x-hidden space-y-8" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- 1. Clean SaaS Courses Header -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'}">
        <div class="relative z-10 space-y-4">
          <!-- Top Badge & Breadcrumb -->
          <div class="flex flex-wrap items-center justify-center ${isRtl ? 'sm:justify-start' : 'sm:justify-start'} gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold rounded-full border border-teal-200 dark:border-teal-800">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>${t('heroBadge', isRtl ? 'مستند اکیڈمک کورسز' : 'Authentic Academic Courses')}</span>
            </span>
            <span class="text-slate-400">•</span>
            <span class="text-teal-600 dark:text-teal-400 font-bold">${t('freeFeSabilillah', isRtl ? '100% مفت فی سبیل اللہ' : '100% Free Fe Sabilillah')}</span>
          </div>

          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                ${t('exploreCourses', isRtl ? 'اسلامی کورسز و تعلیمی اسباق 📖' : 'Islamic Masterclasses & Courses 📖')}
              </h1>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ${t('heroSubtitle', isRtl ? 'قرآن و تجوید، احادیثِ مبارکہ، فقہ و عبادات، سیرت النبی ﷺ اور عربی گرامر کے باقاعدہ اکیڈمک ماسٹر کلاسز مع سندِ فراغت۔' : 'Access comprehensive Islamic courses, tajweed, classical books, and verified digital certificates.')}
              </p>
            </div>

            <!-- 2 Quick Stats Badges -->
            <div class="grid grid-cols-2 gap-3 shrink-0">
              <div class="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div class="text-lg sm:text-xl font-black text-teal-700 dark:text-teal-400 font-mono">${courses.length}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">${t('availableCoursesLabel', isRtl ? 'دستیاب کورسز' : 'Available Courses')}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div class="text-lg sm:text-xl font-black text-amber-500 font-mono">100%</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">${t('courseFree', isRtl ? 'مفت رجسٹریشن' : 'Free Registration')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Interactive Topic Chips Strip (Filter Pills) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onclick="window.Router.navigate('/courses')" 
          class="px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeCategory === 'all' && activeLevel === 'all' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
          ✨ ${t('filterAll', isRtl ? 'تمام اسلامی علوم' : 'All Subjects')}
        </button>

        <!-- Quick Level Filters (Beginner, Intermediate, Advanced, Free, Paid) -->
        <button 
          onclick="window.Router.navigate('/courses?level=beginner')" 
          class="px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeLevel === 'beginner' || activeLevel === 'ابتدائی' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
          🌱 ${t('filterBeginner', isRtl ? 'ابتدائی درجہ' : 'Beginner')}
        </button>
        <button 
          onclick="window.Router.navigate('/courses?level=intermediate')" 
          class="px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeLevel === 'intermediate' || activeLevel === 'متوسط' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
          🌿 ${t('filterIntermediate', isRtl ? 'متوسط درجہ' : 'Intermediate')}
        </button>
        <button 
          onclick="window.Router.navigate('/courses?level=advanced')" 
          class="px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeLevel === 'advanced' || activeLevel === 'اعلیٰ' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
          🌳 ${t('filterAdvanced', isRtl ? 'اعلیٰ درجہ' : 'Advanced')}
        </button>

        ${categories.map(cat => `
          <button 
            onclick="window.Router.navigate('/courses?category=${cat.id}')" 
            class="px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeCategory === cat.id ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
            ${cat.name}
          </button>
        `).join('')}
      </div>

      <!-- 3. Modern Sleek Header Action Bar -->
      <div class="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          
          <!-- Quick Search Input -->
          <div class="relative flex-1 min-w-[220px] sm:min-w-[320px]">
            <input 
              type="text" 
              id="actionbar-search-input" 
              value="${activeSearch}" 
              placeholder="${t('searchCoursesPlaceholder', isRtl ? 'کورس کا نام، موضوع یا استاد کا نام تلاش کریں...' : 'Search course by title, topic, or instructor...')}" 
              class="form-input text-xs sm:text-sm ${isRtl ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-3 rounded-2xl w-full ${fontClass} bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
              onkeydown="if(event.key==='Enter') window.Views.applyQuickSearch(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-emerald-600 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5"></i>
            ${activeSearch ? `
              <button onclick="window.Views.applyQuickSearch('')" class="absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5" title="Clear search">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>

          <!-- Controls: Filter Modal Toggle & Sort Dropdown -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <!-- Filter Toggle Button with Active Count Badge -->
            <button 
              onclick="window.Views.toggleCourseFiltersModal(true)" 
              class="py-2.5 px-4 text-xs rounded-2xl flex items-center gap-2 font-extrabold hover:border-emerald-500 hover:text-emerald-600 transition shadow-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 relative active:scale-95">
              <i data-lucide="sliders-horizontal" class="w-4 h-4 text-emerald-600"></i>
              <span>${t('detailedFilters', isRtl ? 'تفصیلی فلٹرز' : 'Detailed Filters')}</span>
              ${activeFiltersCount > 0 ? `
                <span class="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                  ${activeFiltersCount}
                </span>
              ` : ''}
            </button>

            <!-- Sort Dropdown -->
            <div class="flex items-center gap-1.5">
              <select 
                id="course-sort-select" 
                onchange="window.Views.coursesFilterChanged()" 
                class="form-input py-2.5 px-3 sm:px-4 text-xs rounded-2xl ${fontClass} font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <option value="popular" ${activeSort === 'popular' ? 'selected' : ''}>${t('sortPopular', isRtl ? '🔥 سب سے مقبول' : '🔥 Most Popular')}</option>
                <option value="rating" ${activeSort === 'rating' ? 'selected' : ''}>${t('sortRating', isRtl ? '⭐ اعلیٰ ترین ریٹنگ' : '⭐ Highest Rated')}</option>
                <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>${t('sortNewest', isRtl ? '✨ نئے کورسز' : '✨ Newest Courses')}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Active Filter Pills & Mobile Count -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-slate-500 font-bold">${t('activeFiltersLabel', isRtl ? 'فعال فلٹرز:' : 'Active Filters:')}</span>
            
            ${activeCategory === 'all' && activeLevel === 'all' && !activeSearch ? `
              <span class="text-slate-400 text-xs">${t('allCoursesDisplayed', isRtl ? 'تمام کورسز ظاہر ہو رہے ہیں' : 'Displaying all courses')}</span>
            ` : ''}

            ${activeCategory !== 'all' && activeCategoryObj ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                ${activeCategoryObj.name}
                <button onclick="window.Views.removeFilter('category')" class="hover:text-rose-500 ${isRtl ? 'mr-1' : 'ml-1'}"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeLevel !== 'all' ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                ${t('academicLevelLabel', isRtl ? 'درجہ' : 'Level')}: ${getLevelLabel(activeLevel)}
                <button onclick="window.Views.removeFilter('level')" class="hover:text-rose-500 ${isRtl ? 'mr-1' : 'ml-1'}"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeSearch ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                ${t('searchPlaceholder', isRtl ? 'تلاش' : 'Search')}: "${activeSearch}"
                <button onclick="window.Views.removeFilter('search')" class="hover:text-rose-500 ${isRtl ? 'mr-1' : 'ml-1'}"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeFiltersCount > 0 ? `
              <button onclick="window.Router.navigate('/courses')" class="text-xs text-rose-600 dark:text-rose-400 hover:underline font-extrabold ${isRtl ? 'mr-2' : 'ml-2'}">
                ${t('resetAll', isRtl ? 'تمام ری سیٹ' : 'Reset All')}
              </button>
            ` : ''}
          </div>

          <!-- Count for Mobile -->
          <div class="text-slate-500 text-xs">
            ${t('availableCoursesLabel', isRtl ? 'دستیاب کورسز:' : 'Available Courses:')} <strong class="text-slate-900 dark:text-white font-mono font-bold">${courses.length}</strong>
          </div>
        </div>
      </div>

      <!-- 4. Glorious Full Width Courses Grid -->
      <div class="w-full">
        ${courses.length === 0 ? `
          <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto my-8">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              📖
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${t('noCoursesFound', isRtl ? 'کوئی کورس تلاش سے مطابقت نہیں رکھتا' : 'No courses match your search')}</h3>
            <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              ${t('noCoursesSubtitle', isRtl ? 'براہ کرم دوسرے الفاظ کے ساتھ تلاش کریں یا تمام کورسز دیکھیں۔' : 'Please try different keywords or browse all courses.')}
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="window.Router.navigate('/courses')" class="btn-primary py-2.5 px-6 text-xs rounded-xl font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                ${t('viewAllCourses', isRtl ? 'تمام کورسز دیکھیں' : 'View All Courses')}
              </button>
            </div>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${courses.map(course => window.Views.components.renderCourseCard(course)).join('')}
          </div>
        `}
      </div>

      <!-- Slide-Over Filter Drawer / Modal Component -->
      <div id="course-filter-backdrop" onclick="window.Views.toggleCourseFiltersModal(false)" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 opacity-0 pointer-events-none hidden"></div>
      
      <div id="course-filter-drawer" class="fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-full max-w-md bg-white dark:bg-slate-900 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 transform ${isRtl ? 'translate-x-full' : '-translate-x-full'} flex flex-col justify-between overflow-hidden ${fontClass} ${isRtl ? 'text-right' : 'text-left'}" dir="${isRtl ? 'rtl' : 'ltr'}">
        
        <!-- Drawer Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">${t('courseFiltersDrawer', isRtl ? 'کورس فلٹرز' : 'Course Filters')}</h3>
              <p class="text-[11px] text-slate-500">${t('courseFiltersSubtitle', isRtl ? 'اپنی پسند اور درجے کے مطابق کورسز فلٹر کریں' : 'Filter courses by academic level and subject')}</p>
            </div>
          </div>
          <button onclick="window.Views.toggleCourseFiltersModal(false)" class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Drawer Scrollable Content -->
        <div class="p-5 overflow-y-auto flex-1 space-y-6">
          
          <!-- Search in Drawer -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
              <i data-lucide="search" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('searchPlaceholder', isRtl ? 'تلاش کا عنوان یا موضوع' : 'Search Title or Topic')}
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="drawer-search-input" 
                value="${activeSearch}" 
                placeholder="${t('searchCoursesPlaceholder', isRtl ? 'کورس کا نام تلاش کریں...' : 'Search course name...')}" 
                class="form-input text-xs ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 rounded-xl w-full ${fontClass}"
              />
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-3"></i>
            </div>
          </div>

          <!-- Category / Topics Filter -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200 block flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('topicsAndSciences', isRtl ? 'موضوعات و علومِ اسلامیہ' : 'Subjects & Islamic Sciences')}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${categories.length} ${t('filterAll', isRtl ? 'کیٹیگریز' : 'Categories')}</span>
            </label>
            
            <div class="space-y-1.5 max-h-56 overflow-y-auto ${isRtl ? 'pl-1 pr-0.5' : 'pr-1 pl-0.5'}">
              <label class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${activeCategory === 'all' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <div class="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                  <input type="radio" name="drawer-filter-category" value="all" ${activeCategory === 'all' ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                  <span class="font-bold">${t('filterAll', isRtl ? 'تمام اسلامی علوم (All Subjects)' : 'All Subjects')}</span>
                </div>
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
              </label>

              ${categories.map(cat => `
                <label class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${activeCategory === cat.id ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                  <div class="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <input type="radio" name="drawer-filter-category" value="${cat.id}" ${activeCategory === cat.id ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                    <span>${cat.name}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Academic Level Filter -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('academicLevelLabel', isRtl ? 'تعلیمی درجہ' : 'Academic Level')}
            </label>
            <div class="grid grid-cols-1 gap-2">
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel === 'all' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="all" ${activeLevel === 'all' ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span class="font-bold">${t('allLevels', isRtl ? 'تمام درجات' : 'All Levels')}</span>
              </label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel.includes('beginner') || activeLevel.includes('ابتدائی') ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="beginner" ${activeLevel.includes('beginner') || activeLevel.includes('ابتدائی') ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>${t('filterBeginner', isRtl ? 'ابتدائی درجات' : 'Beginner Level')}</span>
              </label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel.includes('intermediate') || activeLevel.includes('متوسط') ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="intermediate" ${activeLevel.includes('intermediate') || activeLevel.includes('متوسط') ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>${t('filterIntermediate', isRtl ? 'متوسط درجہ' : 'Intermediate Level')}</span>
              </label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel.includes('advanced') || activeLevel.includes('اعلیٰ') ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="advanced" ${activeLevel.includes('advanced') || activeLevel.includes('اعلیٰ') ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>${t('filterAdvanced', isRtl ? 'اعلیٰ درجہ' : 'Advanced Level')}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Drawer Footer Action Buttons -->
        <div class="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.Views.resetCourseFilters()" 
            class="btn-secondary flex-1 py-3 text-xs rounded-xl font-bold">
            ${t('resetAll', isRtl ? 'تمام ری سیٹ' : 'Reset All')}
          </button>
          <button 
            type="button" 
            onclick="window.Views.applyCourseFilters()" 
            class="btn-primary flex-1 py-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
            ${t('applyFilters', isRtl ? 'فلٹر لاگو کریں' : 'Apply Filters')}
          </button>
        </div>
      </div>

    </div>
  `;
  
  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleCourseFiltersModal = function(show) {
  const drawer = document.getElementById('course-filter-drawer');
  const backdrop = document.getElementById('course-filter-backdrop');
  if (!drawer || !backdrop) return;

  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const hideClass = isRtl ? 'translate-x-full' : '-translate-x-full';

  const isOpening = (show !== undefined) ? show : drawer.classList.contains(hideClass);

  if (isOpening) {
    backdrop.classList.remove('hidden');
    backdrop.classList.remove('pointer-events-none');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      drawer.classList.remove('translate-x-full', '-translate-x-full');
      drawer.classList.add('translate-x-0');
    }, 10);
  } else {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    drawer.classList.remove('translate-x-0');
    drawer.classList.add(hideClass);
    backdrop.classList.add('pointer-events-none');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }
};

window.Views.applyQuickSearch = function(query) {
  const sort = document.getElementById('course-sort-select')?.value || 'popular';
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  
  if (query && query.trim()) {
    urlParams.set('search', query.trim());
  } else {
    urlParams.delete('search');
  }

  if (sort && sort !== 'popular') {
    urlParams.set('sort', sort);
  }

  window.Router.navigate(`/courses?${urlParams.toString()}`);
};

window.Views.removeFilter = function(filterKey) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  urlParams.delete(filterKey);
  window.Router.navigate(`/courses?${urlParams.toString()}`);
};

window.Views.coursesFilterChanged = function() {
  const sort = document.getElementById('course-sort-select')?.value || 'popular';
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  
  if (sort !== 'popular') {
    urlParams.set('sort', sort);
  } else {
    urlParams.delete('sort');
  }

  window.Router.navigate(`/courses?${urlParams.toString()}`);
};

window.Views.resetCourseFilters = function() {
  window.Views.toggleCourseFiltersModal(false);
  window.Router.navigate('/courses');
};

window.Views.applyCourseFilters = function() {
  const searchInput = document.getElementById('drawer-search-input')?.value || '';
  const categoryRadio = document.querySelector('input[name="drawer-filter-category"]:checked');
  const levelRadio = document.querySelector('input[name="drawer-filter-level"]:checked');
  const sort = document.getElementById('course-sort-select')?.value || 'popular';

  const category = categoryRadio ? categoryRadio.value : 'all';
  const level = levelRadio ? levelRadio.value : 'all';

  const params = new URLSearchParams();
  if (searchInput.trim()) params.set('search', searchInput.trim());
  if (category !== 'all') params.set('category', category);
  if (level !== 'all') params.set('level', level);
  if (sort !== 'popular') params.set('sort', sort);

  window.Views.toggleCourseFiltersModal(false);
  window.Router.navigate(`/courses?${params.toString()}`);
};

// Course Details View (Multi-lingual)
window.Views.renderCourseDetails = async function(params) {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const course = await window.API.getCourseById(params.id);
  const currentUser = window.Auth.getCurrentUser();

  if (!course) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
        <h2 class="text-2xl font-bold">${t('noCoursesFound', isRtl ? 'کورس دستیاب نہیں ہے' : 'Course Not Available')}</h2>
        <p class="text-slate-500">${t('noCoursesSubtitle', isRtl ? 'مطلوبہ کورس موجود نہیں یا منتقل کر دیا گیا ہے۔' : 'The requested course does not exist or has been moved.')}</p>
        <a href="#/courses" class="btn-primary py-2 px-5 text-xs rounded-xl">${t('viewAllCourses', isRtl ? 'کورسز کی فہرست پر واپس جائیں' : 'Back to Courses')}</a>
      </div>
    `;
    return;
  }

  const enrollments = currentUser ? await window.API.getEnrollments(currentUser.id) : [];
  const currentEnrollment = enrollments.find(e => e.courseId === course.id);
  const isEnrolled = !!currentEnrollment;
  const isWishlisted = currentUser ? (window.DB.get('wishlist') || []).some(w => w.userId === currentUser.id && w.itemId === course.id) : false;

  container.innerHTML = `
    <!-- Top Hero Header -->
    <div class="bg-slate-900 text-white py-12 border-b border-slate-800 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <a href="#/" class="hover:text-emerald-400">${t('navHome', isRtl ? 'ہوم پیج' : 'Home')}</a>
              <span>/</span>
              <a href="#/courses" class="hover:text-emerald-400">${t('navCourses', isRtl ? 'کورسز' : 'Courses')}</a>
              <span>/</span>
              <span class="text-emerald-400">${course.category?.name || t('topicsAndSciences', isRtl ? 'علومِ اسلامیہ' : 'Islamic Sciences')}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">${course.title}</h1>
            <p class="text-slate-300 text-base leading-relaxed">${course.shortDescription || course.description || ''}</p>

            <div class="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div class="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <span>${course.rating || 5.0}</span>
                <span class="text-slate-400 font-normal">(${course.ratingCount || 100} ${t('courseReviews', isRtl ? 'آراء' : 'reviews')})</span>
              </div>
              <span>•</span>
              <span class="text-slate-300">${(course.enrolledCount || 12000).toLocaleString()} ${t('roleStudent', isRtl ? 'طالب علم' : 'students')}</span>
              <span>•</span>
              <span class="text-slate-300">${t('courseInstructor', isRtl ? 'مدرس' : 'Instructor')}: <strong class="text-white">${course.instructor?.name || (isRtl ? 'جامعہ کے اساتذہ کرام' : 'Academy Faculty')}</strong></span>
              <span>•</span>
              <span class="text-slate-300">${t('language', isRtl ? 'زبان' : 'Language')}: ${course.language || (lang === 'ur' ? 'اردو' : (lang === 'ar' ? 'العربية' : 'English'))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content & Right Pricing Card -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Content (Outcomes, Curriculum, Instructor, Reviews) -->
        <div class="lg:col-span-8 space-y-10">
          
          <!-- What You'll Learn -->
          <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600"></i> ${t('whatYouLearn', isRtl ? 'آپ اس کورس میں کیا سیکھیں گے' : 'What You Will Learn')}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              ${(course.learningOutcomes || []).map(outcome => `
                <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-1"></i>
                  <span class="leading-relaxed">${outcome}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Course Curriculum -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-xl text-slate-900 dark:text-white">${t('curriculumAndLessons', isRtl ? 'نصاب اور اسباق کی فہرست' : 'Course Curriculum')}</h3>
                <p class="text-xs text-slate-500 mt-0.5">${course.lessons.length} ${t('courseLessons', isRtl ? 'اسباق' : 'Lessons')} • ${course.durationHours} ${t('hoursTeaching', isRtl ? 'گھنٹے تدریس' : 'Hours')}</p>
              </div>
            </div>

            <div class="lh-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              ${course.lessons.map((lesson, idx) => `
                <div class="p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div class="flex items-center gap-3.5 min-w-0 flex-1">
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                      ${idx + 1}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-semibold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                        <span class="break-words">${lesson.title}</span>
                        ${lesson.isFreePreview ? `<span class="badge badge-success text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">${t('freePreviewBadge', isRtl ? 'مفت پیش نظارہ' : 'Free Preview')}</span>` : ''}
                      </div>
                      <div class="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                        <span class="capitalize flex items-center gap-1">
                          <i data-lucide="${lesson.type === 'video' ? 'play-circle' : lesson.type === 'audio' ? 'headphones' : 'file-text'}" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                          ${lesson.type === 'video' ? t('videoLessonBadge', isRtl ? 'ویڈیو سبق' : 'Video Lesson') : t('textReadingBadge', isRtl ? 'متن و تشریح' : 'Reading Module')}
                        </span>
                        <span>•</span>
                        <span class="font-mono">${lesson.durationMinutes} ${t('durationLabel', isRtl ? 'منٹ' : 'min')}</span>
                      </div>
                    </div>
                  </div>

                  <div class="shrink-0">
                    ${isEnrolled ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-primary py-1.5 px-4 text-xs rounded-xl">${t('startLesson', isRtl ? 'سبق پڑھیں' : 'Start Lesson')}</a>
                    ` : lesson.isFreePreview ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-secondary py-1.5 px-4 text-xs rounded-xl text-emerald-600 border-emerald-300">${t('previewLesson', isRtl ? 'پیش نظارہ' : 'Preview')}</a>
                    ` : `
                      <i data-lucide="lock" class="w-4 h-4 text-slate-400 ${isRtl ? 'ml-2' : 'mr-2'}"></i>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Requirements & Description -->
          <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">${t('courseRequirements', isRtl ? 'کورس کی ضروری شرائط' : 'Course Requirements')}</h3>
            <ul class="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
              ${(course.requirements || []).map(r => `<li>${r}</li>`).join('')}
            </ul>

            <h3 class="font-bold text-lg text-slate-900 dark:text-white pt-4">${t('courseDescriptionTitle', isRtl ? 'کورس کا مفصل تعارف' : 'Course Overview')}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${course.description}</p>
          </div>

          <!-- Instructor Section -->
          ${course.instructor ? `
            <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">${t('leadInstructorTitle', isRtl ? 'فاضل استاذ کرام' : 'Instructor Profile')}</h3>
              <div class="flex items-start gap-4">
                <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-16 h-16 rounded-2xl object-cover shadow border border-emerald-100">
                <div class="space-y-1">
                  <h4 class="font-bold text-base text-slate-900 dark:text-white">${course.instructor.name}</h4>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">${course.instructor.title}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">${course.instructor.bio}</p>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Reviews Section -->
          <div class="lh-card p-6 space-y-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 class="font-bold text-lg text-slate-900 dark:text-white">${t('studentReviewsTitle', isRtl ? 'طالبانِ علم کے تاثرات' : 'Student Reviews')}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex items-center text-amber-500">
                    <i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>
                    <span class="font-bold text-sm ${isRtl ? 'mr-1' : 'ml-1'} text-slate-900 dark:text-white font-mono">${course.rating || 5.0}</span>
                  </div>
                  <span class="text-xs text-slate-400 font-mono">(${course.ratingCount || 100} ${t('courseReviews', isRtl ? 'آراء' : 'reviews')})</span>
                </div>
              </div>
              <button onclick="window.Views.openWriteReviewModal('${course.id}')" class="btn-secondary py-1.5 px-4 text-xs rounded-xl">${t('writeReviewBtn', isRtl ? 'رائے درج کریں' : 'Write Review')}</button>
            </div>

            <div class="space-y-4">
              ${(course.reviews || []).map(rev => `
                <div class="border-b border-slate-100 dark:border-slate-800 last:border-none pb-4 last:pb-0 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <img src="${rev.userAvatar}" class="w-8 h-8 rounded-full object-cover">
                      <div>
                        <div class="text-xs font-bold text-slate-900 dark:text-white">${rev.userName}</div>
                        <div class="flex items-center gap-1 text-amber-500">
                          ${'<i data-lucide="star" class="w-3 h-3 fill-amber-500"></i>'.repeat(rev.rating)}
                        </div>
                      </div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-mono">${new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200">${rev.title}</h5>
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${rev.comment}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Sticky Action Card -->
        <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div class="lh-card overflow-hidden shadow-xl border-2 border-emerald-100 dark:border-emerald-950 rounded-2xl bg-white dark:bg-slate-900">
            <div class="relative aspect-video">
              <img src="${course.thumbnail}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a href="#/learn/${course.id}/${course.lessons[0]?.id || ''}" class="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-2xl hover:scale-110 transition">
                  <i data-lucide="play" class="w-6 h-6 fill-emerald-600 ${isRtl ? 'mr-0.5' : 'ml-0.5'}"></i>
                </a>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div class="flex items-baseline gap-3">
                <span class="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  ${course.isFree ? t('freeFeSabilillah', isRtl ? 'مفت (فی سبیل اللہ)' : 'FREE (Fe Sabilillah)') : `$${course.price}`}
                </span>
              </div>

              <!-- Main CTA -->
              ${isEnrolled ? `
                <a href="#/learn/${course.id}/${currentEnrollment.lastViewedLessonId || course.lessons[0]?.id}" class="btn-primary w-full py-3 text-sm rounded-xl inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  <span>${t('continueLearning', isRtl ? 'تعلیم جاری رکھیں' : 'Continue Learning')} (${currentEnrollment.progressPercentage}%)</span>
                  <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-4 h-4"></i>
                </a>
              ` : `
                <button onclick="window.Views.enrollFreeCourse('${course.id}')" class="btn-primary w-full py-3 text-sm rounded-xl inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
                  <span>${t('enrollFreeCourseBtn', isRtl ? 'کورس میں مفت داخلہ لیں' : 'Enroll in Course Free')}</span>
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                </button>
              `}

              <!-- Secondary Actions -->
              <div class="flex gap-2">
                <button onclick="window.Views.toggleWishlist('course', '${course.id}')" class="btn-secondary flex-1 py-2 text-xs rounded-xl ${isWishlisted ? 'text-red-500 border-red-200' : ''}">
                  <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}"></i>
                  <span>${isWishlisted ? t('savedWishlist', isRtl ? 'پسندیدہ' : 'Saved') : t('saveWishlist', isRtl ? 'محفوظ کریں' : 'Save')}</span>
                </button>
                <button onclick="navigator.clipboard.writeText(window.location.href); window.App.showToast(window.I18N ? window.I18N.t('copiedToast', 'Link copied!') : 'Copied!', 'success');" class="btn-secondary flex-1 py-2 text-xs rounded-xl">
                  <i data-lucide="share-2" class="w-4 h-4"></i>
                  <span>${t('shareCourse', isRtl ? 'شیئر کریں' : 'Share')}</span>
                </button>
              </div>

              <!-- Inclusions List -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div class="font-bold text-slate-900 dark:text-white mb-2">${t('courseIncludesHeader', isRtl ? 'اس کورس میں شامل ہے:' : 'This Course Includes:')}</div>
                <div class="flex items-center gap-2"><i data-lucide="video" class="w-4 h-4 text-emerald-500"></i> ${course.durationHours} ${t('hoursAuthenticLessons', isRtl ? 'گھنٹے مستند اسباق' : 'Hours of Authentic Video Lessons')}</div>
                <div class="flex items-center gap-2"><i data-lucide="file-down" class="w-4 h-4 text-emerald-500"></i> ${t('pdfBooksSummaries', isRtl ? 'پی ڈی ایف کتب اور تحریری خلاصے' : 'PDF Handouts & Summaries')}</div>
                <div class="flex items-center gap-2"><i data-lucide="award" class="w-4 h-4 text-amber-500"></i> ${t('verifiedCertificateWithQr', isRtl ? 'تصدیق شدہ شاہی سنَدِ فراغت (QR Code سمیت)' : 'Verified Certificate with QR')}</div>
                <div class="flex items-center gap-2"><i data-lucide="infinity" class="w-4 h-4 text-emerald-500"></i> ${t('lifetimeFreeAccess', isRtl ? 'تا حیات مفت رسائی' : 'Lifetime Free Access')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) window.lucide.createIcons();
};

window.Views.enrollFreeCourse = async function(courseId) {
  const user = window.Auth.getCurrentUser();
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  if (!user) {
    window.App.showToast(t('loginPrompt', 'Please sign in first to enroll.'), 'warning');
    window.Router.navigate('/login');
    return;
  }

  await window.API.enrollInCourse(courseId, user.id);
  window.App.showToast(t('msgSuccess', 'Enrolled in course successfully!'), 'success');
  window.Router.navigate(`/learn/${courseId}`);
};

window.Views.toggleWishlist = function(itemType, itemId) {
  const user = window.Auth.getCurrentUser();
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  if (!user) {
    window.App.showToast(t('loginPrompt', 'Please sign in first.'), 'warning');
    window.Router.navigate('/login');
    return;
  }

  const wishlist = window.DB.get('wishlist') || [];
  const existing = wishlist.find(w => w.userId === user.id && w.itemId === itemId);

  if (existing) {
    window.DB.delete('wishlist', existing.id);
    window.App.showToast(t('removedWishlist', 'Removed from wishlist.'), 'info');
  } else {
    window.DB.insert('wishlist', { userId: user.id, itemType, itemId, addedAt: new Date().toISOString().split('T')[0] });
    window.App.showToast(t('savedWishlistToast', 'Added to wishlist!'), 'success');
  }

  window.Router.handleRouting();
};

window.Views.openWriteReviewModal = function(courseId) {
  const user = window.Auth.getCurrentUser();
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  if (!user) {
    window.App.showToast(t('loginPrompt', 'Please sign in first to submit a review.'), 'warning');
    return;
  }

  window.App.showModal(t('writeReviewModalTitle', 'Submit Course Review'), `
    <form onsubmit="window.Views.submitReview(event, '${courseId}')" class="space-y-4 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('selectRatingLabel', 'Select Rating')}</label>
        <select id="review-rating-select" class="form-input text-xs ${fontClass}">
          <option value="5">${t('rating5Star', '⭐⭐⭐⭐⭐ (5 Stars - Outstanding & Inspiring)')}</option>
          <option value="4">${t('rating4Star', '⭐⭐⭐⭐ (4 Stars - Very Good)')}</option>
          <option value="3">${t('rating3Star', '⭐⭐⭐ (3 Stars - Good)')}</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('reviewTitleLabel', 'Review Title')}</label>
        <input type="text" id="review-title-input" required placeholder="${t('reviewTitlePlaceholder', 'e.g. Comprehensive and beneficial course!')}" class="form-input text-xs ${fontClass}">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${t('reviewCommentLabel', 'Detailed Feedback')}</label>
        <textarea id="review-comment-input" rows="4" required placeholder="${t('reviewCommentPlaceholder', 'Share your thoughts and learning experience...')}" class="form-input text-xs ${fontClass}"></textarea>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">${t('submitReviewBtn', 'Save Review')}</button>
    </form>
  `);
};

window.Views.submitReview = function(e, courseId) {
  e.preventDefault();
  const user = window.Auth.getCurrentUser();
  const rating = parseInt(document.getElementById('review-rating-select').value, 10);
  const title = document.getElementById('review-title-input').value;
  const comment = document.getElementById('review-comment-input').value;
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  window.DB.insert('reviews', {
    courseId,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    rating,
    title,
    comment,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
    status: 'approved'
  });

  window.App.closeModal();
  window.App.showToast(t('reviewSubmittedToast', 'JazakAllahu Khairan! Your review has been recorded.'), 'success');
  window.Router.handleRouting();
};
