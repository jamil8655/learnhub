/**
 * LearnHub Islamic Courses Catalog & Course Details Views (Urdu & Islamic Academy)
 */

window.Views = window.Views || {};
window.Views.components = window.Views.components || {};

window.Views.components.renderCourseCard = function(course) {
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
  const isFree = course.isFree !== false;
  const categoryName = course.category?.name || t('navCourses', 'علومِ اسلامیہ');
  const instructorName = course.instructor?.name || t('roleInstructor', 'استاد محترم');

  return `
    <div class="lh-card overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div class="relative aspect-video overflow-hidden">
        <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=500'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${course.title}">
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          ${(course.status === 'draft' || course.isPublished === false || course.isDraft === true) ? `
            <span class="badge bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md animate-pulse">
              🟡 ${t('adminDraft', 'مسودہ / Draft Preview')}
            </span>
          ` : ''}
          <span class="badge bg-emerald-950/80 backdrop-blur-md text-emerald-300 font-extrabold text-[11px] px-2.5 py-1 rounded-xl border border-emerald-500/30">
            ${categoryName}
          </span>
        </div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-500"></i> ${course.durationHours || 12} ${t('courseDuration', 'گھنٹے')}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i data-lucide="video" class="w-3.5 h-3.5 text-indigo-500"></i> ${(course.lessons || []).length || 15} ${t('courseLessons', 'اسباق')}</span>
          </div>
          <h3 class="font-black text-base text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            ${course.shortDescription || course.description || ''}
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="${course.instructor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-7 h-7 rounded-xl object-cover border border-emerald-500/40">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">${instructorName}</span>
          </div>
          <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
            ${isFree ? t('courseFree', 'مفت') : `$${course.price}`}
          </span>
        </div>
      </div>
    </div>
  `;
};

window.Views.renderCourses = async function(params, query = {}) {
  const container = document.getElementById('main-content');
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

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-urdu w-full max-w-full overflow-x-hidden space-y-8" dir="rtl">
      
      <!-- 1. Royal Courses Hero Banner -->
      <div class="relative bg-gradient-to-l from-slate-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/40 shadow-2xl overflow-hidden text-center sm:text-right">
        <!-- Ambient Glow Lights -->
        <div class="absolute right-0 top-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-0 bottom-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <!-- Top Badge & Breadcrumb -->
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 font-extrabold rounded-full border border-amber-500/30">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>مستند اکیڈمک کورسز</span>
            </span>
            <span class="text-slate-400">•</span>
            <span class="text-emerald-300 font-bold">100% مفت فی سبیل اللہ</span>
          </div>

          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                اسلامی کورسز و تعلیمی اسباق 📖
              </h1>
              <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-semibold">
                قرآن و تجوید، احادیثِ مبارکہ، فقہ و عبادات، سیرت النبی ﷺ اور عربی گرامر کے باقاعدہ اکیڈمک ماسٹر کلاسز مع سندِ فراغت۔
              </p>
            </div>

            <!-- 4 Quick Stats Badges -->
            <div class="grid grid-cols-2 gap-3 shrink-0">
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
                <div class="text-lg sm:text-xl font-black text-amber-300 font-mono">${courses.length}</div>
                <div class="text-[10px] text-slate-300 font-bold">دستیاب کورسز</div>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
                <div class="text-lg sm:text-xl font-black text-emerald-300 font-mono">100%</div>
                <div class="text-[10px] text-slate-300 font-bold">مفت رجسٹریشن</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Interactive Topic Chips Strip (Quick 1-Click Topic Filter) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onclick="window.Router.navigate('/courses')" 
          class="px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition shadow-sm ${activeCategory === 'all' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}">
          ✨ تمام اسلامی علوم
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
              placeholder="کورس کا نام، موضوع یا استاد کا نام تلاش کریں..." 
              class="form-input text-xs sm:text-sm pr-10 pl-8 py-3 rounded-2xl w-full font-urdu bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
              onkeydown="if(event.key==='Enter') window.Views.applyQuickSearch(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5"></i>
            ${activeSearch ? `
              <button onclick="window.Views.applyQuickSearch('')" class="absolute left-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5" title="Clear search">
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
              <span>تفصیلی فلٹرز</span>
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
                class="form-input py-2.5 px-3 sm:px-4 text-xs rounded-2xl font-urdu font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <option value="popular" ${activeSort === 'popular' ? 'selected' : ''}>🔥 سب سے مقبول</option>
                <option value="rating" ${activeSort === 'rating' ? 'selected' : ''}>⭐ اعلیٰ ترین ریٹنگ</option>
                <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>✨ نئے کورسز</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Active Filter Pills & Mobile Count -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-slate-500 font-bold">فعال فلٹرز:</span>
            
            ${activeCategory === 'all' && activeLevel === 'all' && !activeSearch ? `
              <span class="text-slate-400 text-xs">تمام کورسز ظاہر ہو رہے ہیں</span>
            ` : ''}

            ${activeCategory !== 'all' && activeCategoryObj ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                ${activeCategoryObj.name}
                <button onclick="window.Views.removeFilter('category')" class="hover:text-rose-500 mr-1"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeLevel !== 'all' ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                درجہ: ${activeLevel}
                <button onclick="window.Views.removeFilter('level')" class="hover:text-rose-500 mr-1"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeSearch ? `
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                تلاش: "${activeSearch}"
                <button onclick="window.Views.removeFilter('search')" class="hover:text-rose-500 mr-1"><i data-lucide="x" class="w-3 h-3"></i></button>
              </span>
            ` : ''}

            ${activeFiltersCount > 0 ? `
              <button onclick="window.Router.navigate('/courses')" class="text-xs text-rose-600 dark:text-rose-400 hover:underline font-extrabold mr-2">
                تمام ری سیٹ
              </button>
            ` : ''}
          </div>

          <!-- Count for Mobile -->
          <div class="text-slate-500 text-xs">
            دستیاب کورسز: <strong class="text-slate-900 dark:text-white font-mono font-bold">${courses.length}</strong>
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
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">کوئی کورس تلاش سے مطابقت نہیں رکھتا</h3>
            <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              براہ کرم دوسرے الفاظ کے ساتھ تلاش کریں یا تمام کورسز دیکھیں۔
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="window.Router.navigate('/courses')" class="btn-primary py-2.5 px-6 text-xs rounded-xl font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                تمام کورسز دیکھیں
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
      
      <div id="course-filter-drawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 transform translate-x-full flex flex-col justify-between overflow-hidden font-urdu text-right" dir="rtl">
        
        <!-- Drawer Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">کورس فلٹرز (Course Filters)</h3>
              <p class="text-[11px] text-slate-500">اپنی پسند اور درجے کے مطابق کورسز فلٹر کریں</p>
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
              <i data-lucide="search" class="w-3.5 h-3.5 text-emerald-600"></i> تلاش کا عنوان یا موضوع
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="drawer-search-input" 
                value="${activeSearch}" 
                placeholder="کورس کا نام تلاش کریں..." 
                class="form-input text-xs pr-9 pl-3 py-2.5 rounded-xl w-full font-urdu"
              />
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-3"></i>
            </div>
          </div>

          <!-- Category / Topics Filter -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200 block flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5 text-emerald-600"></i> موضوعات و علومِ اسلامیہ
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${categories.length} کیٹیگریز</span>
            </label>
            
            <div class="space-y-1.5 max-h-56 overflow-y-auto pl-1 pr-0.5">
              <label class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${activeCategory === 'all' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <div class="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                  <input type="radio" name="drawer-filter-category" value="all" ${activeCategory === 'all' ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                  <span class="font-bold">تمام اسلامی علوم (All Subjects)</span>
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
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-emerald-600"></i> تعلیمی درجہ (Academic Level)
            </label>
            <div class="grid grid-cols-1 gap-2">
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel === 'all' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="all" ${activeLevel === 'all' ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span class="font-bold">تمام درجات (All Levels)</span>
              </label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel.includes('ابتدائی') ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="ابتدائی" ${activeLevel.includes('ابتدائی') ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>ابتدائی درجات (Beginner)</span>
              </label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs ${activeLevel.includes('متوسط') ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : ''}">
                <input type="radio" name="drawer-filter-level" value="متوسط" ${activeLevel.includes('متوسط') ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
                <span>متوسط و ایڈوانس (Intermediate / Advanced)</span>
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
            تمام ری سیٹ (Reset All)
          </button>
          <button 
            type="button" 
            onclick="window.Views.applyCourseFilters()" 
            class="btn-primary flex-1 py-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
            فلٹر لاگو کریں (Apply)
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

  const isOpening = (show !== undefined) ? show : drawer.classList.contains('translate-x-full');

  if (isOpening) {
    backdrop.classList.remove('hidden');
    backdrop.classList.remove('pointer-events-none');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
    }, 10);
  } else {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
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

// Course Details View (Urdu)
window.Views.renderCourseDetails = async function(params) {
  const container = document.getElementById('main-content');
  const course = await window.API.getCourseById(params.id);
  const currentUser = window.Auth.getCurrentUser();

  if (!course) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-urdu" dir="rtl">
        <h2 class="text-2xl font-bold">کورس دستیاب نہیں ہے</h2>
        <p class="text-slate-500">مطلوبہ کورس موجود نہیں یا منتقل کر دیا گیا ہے۔</p>
        <a href="#/courses" class="btn-primary py-2 px-5 text-xs rounded-xl">کورسز کی فہرست پر واپس جائیں</a>
      </div>
    `;
    return;
  }

  const enrollments = currentUser ? await window.API.getEnrollments(currentUser.id) : [];
  const currentEnrollment = enrollments.find(e => e.courseId === course.id);
  const isEnrolled = !!currentEnrollment;
  const isWishlisted = currentUser ? window.DB.get('wishlist').some(w => w.userId === currentUser.id && w.itemId === course.id) : false;

  container.innerHTML = `
    <!-- Top Hero Header -->
    <div class="bg-slate-900 text-white py-12 border-b border-slate-800 font-urdu" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <a href="#/" class="hover:text-emerald-400">ہوم پیج</a>
              <span>/</span>
              <a href="#/courses" class="hover:text-emerald-400">کورسز</a>
              <span>/</span>
              <span class="text-emerald-400">${course.category?.name || 'علومِ اسلامیہ'}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">${course.title}</h1>
            <p class="text-slate-300 text-base leading-relaxed">${course.shortDescription}</p>

            <div class="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div class="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <span>${course.rating || 5.0}</span>
                <span class="text-slate-400 font-normal">(${course.ratingCount || 100} آراء)</span>
              </div>
              <span>•</span>
              <span class="text-slate-300">${(course.enrolledCount || 12000).toLocaleString()} طالب علم</span>
              <span>•</span>
              <span class="text-slate-300">مدرس: <strong class="text-white">${course.instructor?.name || 'جامعہ کے اساتذہ کرام'}</strong></span>
              <span>•</span>
              <span class="text-slate-300">زبان: ${course.language || 'اردو'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content & Right Pricing Card -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-urdu" dir="rtl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Content (Outcomes, Curriculum, Instructor, Reviews) -->
        <div class="lg:col-span-8 space-y-10">
          
          <!-- What You'll Learn -->
          <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600"></i> آپ اس کورس میں کیا سیکھیں گے
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
                <h3 class="font-bold text-xl text-slate-900 dark:text-white">نصاب اور اسباق کی فہرست</h3>
                <p class="text-xs text-slate-500 mt-0.5">${course.lessons.length} اسباق • ${course.durationHours} گھنٹے تدریس</p>
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
                        ${lesson.isFreePreview ? '<span class="badge badge-success text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">مفت پیش نظارہ</span>' : ''}
                      </div>
                      <div class="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                        <span class="capitalize flex items-center gap-1">
                          <i data-lucide="${lesson.type === 'video' ? 'play-circle' : lesson.type === 'audio' ? 'headphones' : 'file-text'}" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                          ${lesson.type === 'video' ? 'ویڈیو سبق' : 'متن و تشریح'}
                        </span>
                        <span>•</span>
                        <span class="font-mono">${lesson.durationMinutes} منٹ</span>
                      </div>
                    </div>
                  </div>

                  <div class="shrink-0">
                    ${isEnrolled ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-primary py-1.5 px-4 text-xs rounded-xl">سبق پڑھیں</a>
                    ` : lesson.isFreePreview ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-secondary py-1.5 px-4 text-xs rounded-xl text-emerald-600 border-emerald-300">پیش نظارہ</a>
                    ` : `
                      <i data-lucide="lock" class="w-4 h-4 text-slate-400 ml-2"></i>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Requirements & Description -->
          <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">کورس کی ضروری شرائط</h3>
            <ul class="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
              ${(course.requirements || []).map(r => `<li>${r}</li>`).join('')}
            </ul>

            <h3 class="font-bold text-lg text-slate-900 dark:text-white pt-4">کورس کا مفصل تعارف</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${course.description}</p>
          </div>

          <!-- Instructor Section -->
          ${course.instructor ? `
            <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">فاضل استاذ کرام</h3>
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
                <h3 class="font-bold text-lg text-slate-900 dark:text-white">طالبانِ علم کے تاثرات</h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex items-center text-amber-500">
                    <i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>
                    <span class="font-bold text-sm mr-1 text-slate-900 dark:text-white font-mono">${course.rating || 5.0}</span>
                  </div>
                  <span class="text-xs text-slate-400 font-mono">(${course.ratingCount || 100} آراء)</span>
                </div>
              </div>
              <button onclick="window.Views.openWriteReviewModal('${course.id}')" class="btn-secondary py-1.5 px-4 text-xs rounded-xl">رائے درج کریں</button>
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
                  <i data-lucide="play" class="w-6 h-6 fill-emerald-600 mr-0.5"></i>
                </a>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div class="flex items-baseline gap-3">
                <span class="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  ${course.isFree ? 'مفت (فی سبیل اللہ)' : `$${course.price}`}
                </span>
              </div>

              <!-- Main CTA -->
              ${isEnrolled ? `
                <a href="#/learn/${course.id}/${currentEnrollment.lastViewedLessonId || course.lessons[0]?.id}" class="btn-primary w-full py-3 text-sm rounded-xl inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  <span>تعلیم جاری رکھیں (${currentEnrollment.progressPercentage}%)</span>
                  <i data-lucide="arrow-left" class="w-4 h-4"></i>
                </a>
              ` : `
                <button onclick="window.Views.enrollFreeCourse('${course.id}')" class="btn-primary w-full py-3 text-sm rounded-xl inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
                  <span>کورس میں مفت داخلہ لیں</span>
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                </button>
              `}

              <!-- Secondary Actions -->
              <div class="flex gap-2">
                <button onclick="window.Views.toggleWishlist('course', '${course.id}')" class="btn-secondary flex-1 py-2 text-xs rounded-xl ${isWishlisted ? 'text-red-500 border-red-200' : ''}">
                  <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}"></i>
                  <span>${isWishlisted ? 'پسندیدہ' : 'محفوظ کریں'}</span>
                </button>
                <button onclick="navigator.clipboard.writeText(window.location.href); window.App.showToast('کورس کا لنک کاپی ہو گیا!', 'success');" class="btn-secondary flex-1 py-2 text-xs rounded-xl">
                  <i data-lucide="share-2" class="w-4 h-4"></i>
                  <span>شیئر کریں</span>
                </button>
              </div>

              <!-- Inclusions List -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div class="font-bold text-slate-900 dark:text-white mb-2">اس کورس میں شامل ہے:</div>
                <div class="flex items-center gap-2"><i data-lucide="video" class="w-4 h-4 text-emerald-500"></i> ${course.durationHours} گھنٹے مستند اسباق</div>
                <div class="flex items-center gap-2"><i data-lucide="file-down" class="w-4 h-4 text-emerald-500"></i> پی ڈی ایف کتب اور تحریری خلاصے</div>
                <div class="flex items-center gap-2"><i data-lucide="award" class="w-4 h-4 text-amber-500"></i> تصدیق شدہ شاہی سنَدِ فراغت (QR Code سمیت)</div>
                <div class="flex items-center gap-2"><i data-lucide="infinity" class="w-4 h-4 text-emerald-500"></i> تا حیات مفت رسائی</div>
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
  if (!user) {
    window.App.showToast('براہ کرم پہلے لاگ ان کریں۔', 'warning');
    window.Router.navigate('/login');
    return;
  }

  await window.API.enrollInCourse(courseId, user.id);
  window.App.showToast('مبارک ہو! آپ کا داخلہ کامیابی سے ہو گیا۔', 'success');
  window.Router.navigate(`/learn/${courseId}`);
};

window.Views.toggleWishlist = function(itemType, itemId) {
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('براہ کرم پہلے لاگ ان کریں۔', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const wishlist = window.DB.get('wishlist');
  const existing = wishlist.find(w => w.userId === user.id && w.itemId === itemId);

  if (existing) {
    window.DB.delete('wishlist', existing.id);
    window.App.showToast('محفوظ فہرست سے نکال دیا گیا۔', 'info');
  } else {
    window.DB.insert('wishlist', { userId: user.id, itemType, itemId, addedAt: new Date().toISOString().split('T')[0] });
    window.App.showToast('پسندیدہ فہرست میں شامل کر دیا گیا!', 'success');
  }

  window.Router.handleRouting();
};

window.Views.openWriteReviewModal = function(courseId) {
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('براہ کرم رائے درج کرنے کے لیے لاگ ان کریں۔', 'warning');
    return;
  }

  window.App.showModal('کورس پر اپنی رائے درج کریں', `
    <form onsubmit="window.Views.submitReview(event, '${courseId}')" class="space-y-4 font-urdu" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ریٹنگ کا انتخاب کریں</label>
        <select id="review-rating-select" class="form-input text-xs font-urdu">
          <option value="5">⭐⭐⭐⭐⭐ (5 ستارے - بہترین اور لاجواب)</option>
          <option value="4">⭐⭐⭐⭐ (4 ستارے - بہت عمدہ)</option>
          <option value="3">⭐⭐⭐ (3 ستارے - مناسب)</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان</label>
        <input type="text" id="review-title-input" required placeholder="مثلاً: انتہائی جامع اور آسان فہم کورس!" class="form-input text-xs font-urdu">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تفصیلی رائے</label>
        <textarea id="review-comment-input" rows="4" required placeholder="اپنے تاثرات اور تجربہ بیان کریں..." class="form-input text-xs font-urdu"></textarea>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">رائے محفوظ کریں</button>
    </form>
  `);
};

window.Views.submitReview = function(e, courseId) {
  e.preventDefault();
  const user = window.Auth.getCurrentUser();
  const rating = parseInt(document.getElementById('review-rating-select').value, 10);
  const title = document.getElementById('review-title-input').value;
  const comment = document.getElementById('review-comment-input').value;

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
  window.App.showToast('جزاک اللہ خیراً! آپ کی قیمتی رائے شامل ہو گئی۔', 'success');
  window.Router.handleRouting();
};
