/**
 * LearnHub Courses Catalog & Course Details Views
 */

window.Views = window.Views || {};

window.Views.renderCourses = async function(params, query) {
  const container = document.getElementById('main-content');
  const categories = window.DB.get('categories');

  const activeCategory = query.category || 'all';
  const activeLevel = query.level || 'all';
  const activePrice = query.price || 'all';
  const activeSort = query.sort || 'popular';
  const activeSearch = query.search || '';

  const courses = await window.API.getCourses({
    category: activeCategory,
    level: activeLevel,
    priceType: activePrice !== 'all' ? activePrice : null,
    sort: activeSort,
    search: activeSearch
  });

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Breadcrumb & Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <a href="#/" class="hover:text-indigo-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium">Courses</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Explore Courses</h1>
            <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Discover expert-led masterclasses across full-stack, AI, cloud, and design.</p>
          </div>

          <!-- Sort Dropdown -->
          <div class="flex items-center gap-3">
            <label class="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</label>
            <select id="course-sort-select" onchange="window.Views.coursesFilterChanged()" class="form-input py-2 text-xs rounded-xl w-44">
              <option value="popular" ${activeSort === 'popular' ? 'selected' : ''}>Most Popular</option>
              <option value="rating" ${activeSort === 'rating' ? 'selected' : ''}>Highest Rated</option>
              <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>Newest First</option>
              <option value="price_asc" ${activeSort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price_desc" ${activeSort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <!-- Sidebar Filters -->
        <div class="lh-card p-6 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="filter" class="w-4 h-4 text-indigo-600"></i> Filters
            </h3>
            <button onclick="window.Router.navigate('/courses')" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Reset</button>
          </div>

          <!-- Search Query Input -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Search</label>
            <div class="relative">
              <input 
                type="text" 
                id="filter-search-input" 
                value="${activeSearch}" 
                placeholder="Search courses..." 
                class="form-input text-xs pl-8"
                onkeydown="if(event.key==='Enter') window.Views.coursesFilterChanged()"
              />
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3"></i>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Category</label>
            <div class="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name="filter-category" value="all" ${activeCategory === 'all' ? 'checked' : ''} onchange="window.Views.coursesFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                <span>All Categories</span>
              </label>
              ${categories.map(cat => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="filter-category" value="${cat.id}" ${activeCategory === cat.id ? 'checked' : ''} onchange="window.Views.coursesFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                  <span>${cat.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Level Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Difficulty Level</label>
            <div class="space-y-1.5">
              ${['all', 'beginner', 'intermediate', 'advanced'].map(lvl => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="filter-level" value="${lvl}" ${activeLevel.toLowerCase() === lvl ? 'checked' : ''} onchange="window.Views.coursesFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                  <span class="capitalize">${lvl === 'all' ? 'All Levels' : lvl}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Price Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Pricing</label>
            <div class="space-y-1.5">
              ${['all', 'free', 'paid'].map(p => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="filter-price" value="${p}" ${activePrice === p ? 'checked' : ''} onchange="window.Views.coursesFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                  <span class="capitalize">${p === 'all' ? 'All Courses' : p}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Course Cards Grid -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong>${courses.length}</strong> masterclasses</span>
          </div>

          ${courses.length === 0 ? `
            <div class="lh-card p-12 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                <i data-lucide="book-open" class="w-8 h-8"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">No courses match your criteria</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your filters, selecting another category, or searching with broader keywords.</p>
              <button onclick="window.Router.navigate('/courses')" class="btn-primary py-2 px-4 text-xs">Clear All Filters</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${courses.map(course => window.Views.components.renderCourseCard(course)).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

window.Views.coursesFilterChanged = function() {
  const search = document.getElementById('filter-search-input')?.value || '';
  const sort = document.getElementById('course-sort-select')?.value || 'popular';
  const categoryRadio = document.querySelector('input[name="filter-category"]:checked');
  const levelRadio = document.querySelector('input[name="filter-level"]:checked');
  const priceRadio = document.querySelector('input[name="filter-price"]:checked');

  const category = categoryRadio ? categoryRadio.value : 'all';
  const level = levelRadio ? levelRadio.value : 'all';
  const price = priceRadio ? priceRadio.value : 'all';

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category !== 'all') params.set('category', category);
  if (level !== 'all') params.set('level', level);
  if (price !== 'all') params.set('price', price);
  if (sort !== 'popular') params.set('sort', sort);

  window.Router.navigate(`/courses?${params.toString()}`);
};

// Course Details View
window.Views.renderCourseDetails = async function(params) {
  const container = document.getElementById('main-content');
  const course = await window.API.getCourseById(params.id);
  const currentUser = window.Auth.getCurrentUser();

  if (!course) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 class="text-2xl font-bold">Course Not Found</h2>
        <p class="text-slate-500">The requested course could not be located or has been archived.</p>
        <a href="#/courses" class="btn-primary py-2 px-4 text-xs">Return to Courses</a>
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
    <div class="bg-slate-900 text-white py-12 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <a href="#/" class="hover:text-white">Home</a>
              <span>/</span>
              <a href="#/courses" class="hover:text-white">Courses</a>
              <span>/</span>
              <span class="text-indigo-400">${course.category?.name}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${course.title}</h1>
            <p class="text-slate-300 text-base leading-relaxed">${course.shortDescription}</p>

            <div class="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div class="flex items-center gap-1 text-amber-400 font-bold">
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <span>${course.rating}</span>
                <span class="text-slate-400 font-normal">(${course.ratingCount || 100} ratings)</span>
              </div>
              <span>•</span>
              <span class="text-slate-300">${course.enrolledCount.toLocaleString()} students enrolled</span>
              <span>•</span>
              <span class="text-slate-300">Created by <strong class="text-white">${course.instructor?.name || 'LearnHub Faculty'}</strong></span>
              <span>•</span>
              <span class="text-slate-300">Language: ${course.language || 'English'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content & Right Pricing Card -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Content (Outcomes, Curriculum, Instructor, Reviews) -->
        <div class="lg:col-span-8 space-y-10">
          
          <!-- What You'll Learn -->
          <div class="lh-card p-6 space-y-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-5 h-5 text-indigo-600"></i> What you will master
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              ${(course.learningOutcomes || []).map(outcome => `
                <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                  <span>${outcome}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Course Curriculum -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-xl text-slate-900 dark:text-white">Curriculum & Lessons</h3>
                <p class="text-xs text-slate-500 mt-0.5">${course.lessons.length} lessons • ${course.durationHours} hours total</p>
              </div>
            </div>

            <div class="lh-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              ${course.lessons.map((lesson, idx) => `
                <div class="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                      ${idx + 1}
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>${lesson.title}</span>
                        ${lesson.isFreePreview ? '<span class="badge badge-success text-[10px]">Free Preview</span>' : ''}
                      </div>
                      <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span class="capitalize flex items-center gap-1">
                          <i data-lucide="${lesson.type === 'video' ? 'play-circle' : lesson.type === 'audio' ? 'headphones' : 'file-text'}" class="w-3.5 h-3.5"></i>
                          ${lesson.type}
                        </span>
                        <span>•</span>
                        <span>${lesson.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    ${isEnrolled ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-primary py-1.5 px-3 text-xs rounded-lg">Play</a>
                    ` : lesson.isFreePreview ? `
                      <a href="#/learn/${course.id}/${lesson.id}" class="btn-secondary py-1.5 px-3 text-xs rounded-lg text-emerald-600 border-emerald-300">Preview</a>
                    ` : `
                      <i data-lucide="lock" class="w-4 h-4 text-slate-400 mr-2"></i>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Requirements & Description -->
          <div class="lh-card p-6 space-y-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Requirements</h3>
            <ul class="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
              ${(course.requirements || []).map(r => `<li>${r}</li>`).join('')}
            </ul>

            <h3 class="font-bold text-lg text-slate-900 dark:text-white pt-4">Description</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${course.description}</p>
          </div>

          <!-- Instructor Section -->
          ${course.instructor ? `
            <div class="lh-card p-6 space-y-4">
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">Your Instructor</h3>
              <div class="flex items-start gap-4">
                <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-16 h-16 rounded-2xl object-cover shadow border border-indigo-100">
                <div class="space-y-1">
                  <h4 class="font-bold text-base text-slate-900 dark:text-white">${course.instructor.name}</h4>
                  <p class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">${course.instructor.title}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">${course.instructor.bio}</p>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Reviews Section -->
          <div class="lh-card p-6 space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 class="font-bold text-lg text-slate-900 dark:text-white">Student Feedback</h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex items-center text-amber-500">
                    <i data-lucide="star" class="w-4 h-4 fill-amber-500"></i>
                    <span class="font-bold text-sm ml-1 text-slate-900 dark:text-white">${course.rating}</span>
                  </div>
                  <span class="text-xs text-slate-400">based on ${course.ratingCount || 100} reviews</span>
                </div>
              </div>
              <button onclick="window.Views.openWriteReviewModal('${course.id}')" class="btn-secondary py-1.5 px-3 text-xs">Write a Review</button>
            </div>

            <div class="space-y-4">
              ${course.reviews.map(rev => `
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
                    <span class="text-[11px] text-slate-400">${new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200">${rev.title}</h5>
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${rev.comment}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Sticky Action Card -->
        <div class="lg:col-span-4 sticky top-24 space-y-4">
          <div class="lh-card overflow-hidden shadow-xl border-2 border-indigo-100 dark:border-indigo-950">
            <div class="relative aspect-video">
              <img src="${course.thumbnail}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a href="#/learn/${course.id}/${course.lessons[0]?.id || ''}" class="w-14 h-14 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl hover:scale-110 transition">
                  <i data-lucide="play" class="w-6 h-6 fill-indigo-600 ml-0.5"></i>
                </a>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ${course.isFree ? 'FREE' : `$${course.price}`}
                </span>
                ${!course.isFree && course.originalPrice ? `
                  <span class="text-sm text-slate-400 line-through">$${course.originalPrice}</span>
                  <span class="badge badge-danger text-xs font-bold">${Math.round((1 - course.price/course.originalPrice)*100)}% OFF</span>
                ` : ''}
              </div>

              <!-- Main CTA -->
              ${isEnrolled ? `
                <a href="#/learn/${course.id}/${currentEnrollment.lastViewedLessonId || course.lessons[0]?.id}" class="btn-primary w-full py-3 text-sm rounded-xl">
                  <span>Continue Learning (${currentEnrollment.progressPercentage}%)</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              ` : course.isFree ? `
                <button onclick="window.Views.enrollFreeCourse('${course.id}')" class="btn-primary w-full py-3 text-sm rounded-xl">
                  <span>Enroll in Free Course</span>
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                </button>
              ` : `
                <a href="#/checkout?courseId=${course.id}" class="btn-primary w-full py-3 text-sm rounded-xl">
                  <span>Buy Now & Start Learning</span>
                  <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                </a>
              `}

              <!-- Secondary Actions -->
              <div class="flex gap-2">
                <button onclick="window.Views.toggleWishlist('course', '${course.id}')" class="btn-secondary flex-1 py-2 text-xs rounded-xl ${isWishlisted ? 'text-red-500 border-red-200' : ''}">
                  <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}"></i>
                  <span>${isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
                <button onclick="navigator.clipboard.writeText(window.location.href); window.App.showToast('Course link copied to clipboard!', 'success');" class="btn-secondary flex-1 py-2 text-xs rounded-xl">
                  <i data-lucide="share-2" class="w-4 h-4"></i>
                  <span>Share</span>
                </button>
              </div>

              <!-- Inclusions List -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div class="font-bold text-slate-900 dark:text-white mb-2">This masterclass includes:</div>
                <div class="flex items-center gap-2"><i data-lucide="video" class="w-4 h-4 text-indigo-500"></i> ${course.durationHours} hours on-demand video & audio</div>
                <div class="flex items-center gap-2"><i data-lucide="file-down" class="w-4 h-4 text-indigo-500"></i> Downloadable source code & resources</div>
                <div class="flex items-center gap-2"><i data-lucide="award" class="w-4 h-4 text-indigo-500"></i> Verifiable Certificate of Completion</div>
                <div class="flex items-center gap-2"><i data-lucide="infinity" class="w-4 h-4 text-indigo-500"></i> Full lifetime access on web & mobile</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Views.enrollFreeCourse = async function(courseId) {
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('Please sign in to enroll in this course.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  await window.API.enrollInCourse(courseId, user.id);
  window.App.showToast('Successfully enrolled! Let\'s begin.', 'success');
  window.Router.navigate(`/learn/${courseId}`);
};

window.Views.toggleWishlist = function(itemType, itemId) {
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('Please sign in to manage your wishlist.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const wishlist = window.DB.get('wishlist');
  const existing = wishlist.find(w => w.userId === user.id && w.itemId === itemId);

  if (existing) {
    window.DB.delete('wishlist', existing.id);
    window.App.showToast('Removed from wishlist.', 'info');
  } else {
    window.DB.insert('wishlist', { userId: user.id, itemType, itemId, addedAt: new Date().toISOString().split('T')[0] });
    window.App.showToast('Added to your wishlist!', 'success');
  }

  // Re-render current view
  window.Router.handleRouting();
};

window.Views.openWriteReviewModal = function(courseId) {
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('Please sign in to write a review.', 'warning');
    return;
  }

  window.App.showModal('Write Course Review', `
    <form onsubmit="window.Views.submitReview(event, '${courseId}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rating</label>
        <select id="review-rating-select" class="form-input text-xs">
          <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
          <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
          <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
          <option value="2">⭐⭐ (2 Stars - Needs Improvement)</option>
          <option value="1">⭐ (1 Star - Poor)</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Review Headline</label>
        <input type="text" id="review-title-input" required placeholder="e.g. Invaluable real-world lessons!" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Detailed Experience</label>
        <textarea id="review-comment-input" rows="4" required placeholder="Share what you liked most about the curriculum..." class="form-input text-xs"></textarea>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs">Submit Review</button>
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
  window.App.showToast('Thank you! Your review has been published.', 'success');
  window.Router.handleRouting();
};
