/**
 * LearnHub Admin Course & Lesson Management Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderCourses = async function() {
  const container = document.getElementById('main-content');
  const courses = await window.API.getCourses({ includeAllStatus: true });
  const categories = window.DB.get('categories') || [];
  const instructors = window.DB.get('instructors') || [];

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Masterclasses & Courses</h1>
          <p class="text-xs text-slate-500">Create, edit, organize curriculum lessons, and manage pricing.</p>
        </div>
        <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Create New Course
        </button>
      </div>

      <!-- Courses Table -->
      <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search courses by title, instructor, or category..." 
            class="form-input text-xs max-w-sm"
            oninput="window.Views.admin.filterCourseTable(this.value)"
          />
          <span class="text-xs text-slate-400">Total Courses: <strong class="text-slate-900 dark:text-white">${courses.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs" id="admin-courses-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">Course</th>
                <th class="p-3.5">Category</th>
                <th class="p-3.5">Instructor</th>
                <th class="p-3.5">Pricing</th>
                <th class="p-3.5">Students</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${courses.length === 0 ? `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-400">No courses available. Click "Create New Course" to add one.</td>
                </tr>
              ` : courses.map(course => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3.5">
                    <div class="flex items-center gap-3">
                      <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}" class="w-12 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0">
                      <div class="min-w-0">
                        <div class="font-bold text-slate-900 dark:text-white truncate max-w-xs">${course.title}</div>
                        <div class="text-[11px] text-slate-400">${course.lessonCount || 0} lessons • ${course.durationHours || 10} hrs</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3.5">
                    <span class="badge badge-neutral text-[10px] font-bold">${course.category?.name || 'General'}</span>
                  </td>
                  <td class="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    ${course.instructor?.name || 'Faculty'}
                  </td>
                  <td class="p-3.5 font-bold text-slate-900 dark:text-white">
                    ${course.isFree ? '<span class="text-emerald-600 font-extrabold">FREE</span>' : '$' + (course.price || 0).toFixed(2)}
                  </td>
                  <td class="p-3.5 font-mono">${(course.enrolledCount || 0).toLocaleString()}</td>
                  <td class="p-3.5">
                    <button onclick="window.Views.admin.toggleCourseStatus('${course.id}')" class="badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'} cursor-pointer text-[10px] uppercase font-bold" title="Click to toggle Status">
                      ${course.status || 'draft'}
                    </button>
                  </td>
                  <td class="p-3.5 text-right space-x-1 whitespace-nowrap" dir="ltr">
                    <button onclick="window.Views.admin.openManageLessonsModal('${course.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-indigo-600 dark:text-indigo-400 font-bold" title="Curriculum Lesson Manager">
                      <i data-lucide="list-ordered" class="w-3.5 h-3.5"></i> Lessons
                    </button>
                    <button onclick="window.Views.admin.openCourseBuilderModal('${course.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Edit Course">
                      <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.duplicateCourse('${course.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Duplicate">
                      <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.deleteCourse('${course.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="Delete">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.filterCourseTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-courses-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openCourseBuilderModal = function(courseId = null) {
  const course = courseId ? window.DB.findById('courses', courseId) : null;
  const categories = window.DB.get('categories') || [];
  const instructors = window.DB.get('instructors') || [];

  window.App.showModal(course ? 'Edit Masterclass / Course' : 'Create New Masterclass / Course', `
    <form onsubmit="window.Views.admin.saveCourseForm(event, '${courseId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Title</label>
        <input type="text" id="cb-title" value="${course ? course.title : ''}" required class="form-input text-xs" placeholder="e.g. قرآنی تجوید و قراءت ماسٹر کلاس">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
          <select id="cb-category" class="form-input text-xs font-urdu">
            ${categories.map(c => `
              <option value="${c.id}" ${course && course.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructor</label>
          <select id="cb-instructor" class="form-input text-xs font-urdu">
            ${instructors.map(i => `
              <option value="${i.id}" ${course && course.instructorId === i.id ? 'selected' : ''}>${i.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Price ($)</label>
          <input type="number" step="0.01" min="0" id="cb-price" value="${course ? (course.price || 0) : '0.00'}" required class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Original Price ($)</label>
          <input type="number" step="0.01" min="0" id="cb-orig-price" value="${course ? (course.originalPrice || '49.99') : '49.99'}" class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty Level</label>
          <select id="cb-level" class="form-input text-xs">
            <option value="Beginner" ${course && course.level === 'Beginner' ? 'selected' : ''}>Beginner (ابتدائی)</option>
            <option value="Intermediate" ${course && course.level === 'Intermediate' ? 'selected' : ''}>Intermediate (متوسط)</option>
            <option value="Advanced" ${course && course.level === 'Advanced' ? 'selected' : ''}>Advanced (ایڈوانس)</option>
            <option value="All Levels" ${course && (course.level === 'All Levels' || course.level === 'تمام درجات' || course.level === 'تمام طلباء کے لیے') ? 'selected' : ''}>All Levels (تمام طلباء کے لیے)</option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Thumbnail Image URL</label>
        <input type="url" id="cb-thumbnail" value="${course ? (course.thumbnail || '') : 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'}" required class="form-input text-xs">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
        <input type="text" id="cb-short-desc" value="${course ? course.shortDescription : ''}" required class="form-input text-xs" placeholder="Brief summary for cards and search...">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Description</label>
        <textarea id="cb-description" rows="3" required class="form-input text-xs" placeholder="Comprehensive curriculum overview...">${course ? (course.description || '') : ''}</textarea>
      </div>

      <div class="flex flex-wrap items-center gap-6 pt-2">
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="cb-free" ${!course || course.isFree ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
          <span>Make this course 100% Free (مفت کورس)</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="cb-publish" ${!course || course.status === 'published' ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
          <span>Publish Course Immediately (شائع کریں)</span>
        </label>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
          ${course ? 'Save Changes' : 'Create Masterclass'}
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">Cancel</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveCourseForm = async function(e, courseId) {
  e.preventDefault();
  const title = document.getElementById('cb-title').value.trim();
  const categoryId = document.getElementById('cb-category').value;
  const instructorId = document.getElementById('cb-instructor').value;
  const isFree = document.getElementById('cb-free').checked;
  const price = isFree ? 0 : (parseFloat(document.getElementById('cb-price').value) || 0);
  const originalPrice = parseFloat(document.getElementById('cb-orig-price').value) || 49.99;
  const level = document.getElementById('cb-level').value;
  const thumbnail = document.getElementById('cb-thumbnail').value.trim();
  const shortDescription = document.getElementById('cb-short-desc').value.trim();
  const description = document.getElementById('cb-description').value.trim();
  const status = document.getElementById('cb-publish').checked ? 'published' : 'draft';

  let rawSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!rawSlug || rawSlug.length < 2) {
    rawSlug = `course-${Date.now()}`;
  }

  const courseData = {
    id: courseId || undefined,
    title,
    slug: rawSlug,
    categoryId,
    instructorId,
    price,
    originalPrice,
    isFree,
    level,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    shortDescription,
    description,
    status,
    rating: 5.0,
    ratingCount: 1,
    durationHours: 12.0,
    enrolledCount: 0,
    learningOutcomes: [
      'Master core foundations and authentic principles',
      'Understand practical rules and applications',
      'Earn verified certificate of completion'
    ],
    requirements: ['Commitment to learning', 'Basic understanding']
  };

  await window.API.saveCourse(courseData);
  window.App.closeModal();
  window.App.showToast(courseId ? 'کورس کامیابی سے اپ ڈیٹ ہو گیا!' : 'نیا کورس کامیابی سے شامل کر دیا گیا!', 'success');
  window.Views.admin.renderCourses();
};

window.Views.admin.toggleCourseStatus = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const newStatus = course.status === 'published' ? 'draft' : 'published';
  window.DB.update('courses', courseId, { status: newStatus });
  window.App.showToast(`کورس کا اسٹیٹس ${newStatus} میں تبدیل ہو گیا۔`, 'info');
  window.Views.admin.renderCourses();
};

window.Views.admin.duplicateCourse = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const cloned = {
    ...JSON.parse(JSON.stringify(course)),
    id: `crs-${Date.now()}`,
    title: `${course.title} (کاپی)`,
    slug: `${course.slug || 'course'}-copy-${Date.now().toString(36)}`,
    status: 'draft',
    enrolledCount: 0
  };

  window.DB.insert('courses', cloned);

  // Also duplicate associated lessons
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  lessons.forEach(les => {
    const clonedLes = {
      ...JSON.parse(JSON.stringify(les)),
      id: `les-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      courseId: cloned.id
    };
    window.DB.insert('lessons', clonedLes);
  });

  window.App.showToast('کورس مع تمام اسباق ڈپلیکیٹ ہو گیا۔', 'success');
  window.Views.admin.renderCourses();
};

window.Views.admin.deleteCourse = async function(courseId) {
  if (confirm('کیا آپ واقعی یہ کورس اور اس کے تمام اسباق حذف کرنا چاہتے ہیں؟')) {
    await window.API.deleteCourse(courseId);
    window.App.showToast('کورس اور اسباق حذف کر دیے گئے۔', 'info');
    window.Views.admin.renderCourses();
  }
};

// ==========================================
// CURRICULUM LESSON MANAGER & MODALS
// ==========================================
window.Views.admin.openManageLessonsModal = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

  window.App.showModal(`Curriculum Lessons: ${course.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span class="text-xs text-slate-500">Total Lessons: <strong>${lessons.length}</strong></span>
        <button onclick="window.Views.admin.openAddLessonForm('${courseId}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold flex items-center gap-1">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Lesson
        </button>
      </div>

      <!-- Lessons List with Up/Down Reordering & Edit -->
      <div class="space-y-2.5" id="admin-lessons-list">
        ${lessons.length === 0 ? `
          <p class="text-xs text-slate-400 py-6 text-center">No lessons added yet. Click "Add Lesson" to build curriculum.</p>
        ` : lessons.map((les, idx) => `
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold shrink-0 font-mono">
                ${idx + 1}
              </span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${les.title}</div>
                <div class="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                  ${les.type || 'video'} • ${les.durationMinutes || 15} mins ${les.isFreePreview ? '• <span class="text-emerald-500 font-bold">(Free Preview)</span>' : ''}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0" dir="ltr">
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300" title="Move Up">
                <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, 1)" ${idx === lessons.length - 1 ? 'disabled' : ''} class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300" title="Move Down">
                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.openAddLessonForm('${courseId}', '${les.id}')" class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400" title="Edit Lesson">
                <i data-lucide="edit" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.deleteLesson('${courseId}', '${les.id}')" class="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600" title="Delete Lesson">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal(); window.Views.admin.renderCourses();" class="btn-secondary py-2 px-5 text-xs rounded-xl">
          Close Manager
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.moveLessonOrder = async function(courseId, currentIndex, direction) {
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  const targetIndex = currentIndex + direction;

  if (targetIndex < 0 || targetIndex >= lessons.length) return;

  const temp = lessons[currentIndex];
  lessons[currentIndex] = lessons[targetIndex];
  lessons[targetIndex] = temp;

  await window.API.reorderLessons(lessons.map(l => l.id));
  window.Views.admin.openManageLessonsModal(courseId);
};

window.Views.admin.openAddLessonForm = function(courseId, lessonId = null) {
  const existing = lessonId ? window.DB.findById('lessons', lessonId) : null;

  window.App.showModal(existing ? 'Edit Lesson' : 'Add Curriculum Lesson', `
    <form onsubmit="window.Views.admin.saveNewLesson(event, '${courseId}', '${lessonId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Title</label>
        <input type="text" id="les-title" value="${existing ? existing.title : ''}" required class="form-input text-xs" placeholder="e.g. علمِ تجوید کا تعارف و مخارج">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Content Type</label>
          <select id="les-type" class="form-input text-xs">
            <option value="video" ${existing && existing.type === 'video' ? 'selected' : ''}>Video Lesson (ویڈیو سبق)</option>
            <option value="text" ${existing && existing.type === 'text' ? 'selected' : ''}>Text / Markdown (تحریری سبق)</option>
            <option value="audio" ${existing && existing.type === 'audio' ? 'selected' : ''}>Audio Lecture (صوتی درس)</option>
            <option value="pdf" ${existing && existing.type === 'pdf' ? 'selected' : ''}>PDF Document (کتاب و دستاویز)</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Minutes)</label>
          <input type="number" id="les-duration" value="${existing ? (existing.durationMinutes || 15) : 15}" min="1" required class="form-input text-xs">
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Video / Audio Embed URL (YouTube, Vimeo, MP4)</label>
        <input type="text" id="les-url" value="${existing ? (existing.videoUrl || '') : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Notes / Markdown Text</label>
        <textarea id="les-body" rows="4" placeholder="Enter lesson notes, Hadith references, or markdown formatted content..." class="form-input text-xs">${existing ? (existing.contentBody || '') : ''}</textarea>
      </div>
      <div>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="les-preview" ${existing && existing.isFreePreview ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500">
          <span>Enable Free Preview for non-enrolled visitors (مفت پیش منظر)</span>
        </label>
      </div>
      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
          ${existing ? 'Update Lesson' : 'Save Lesson'}
        </button>
        <button type="button" onclick="window.Views.admin.openManageLessonsModal('${courseId}')" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">Back</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveNewLesson = async function(e, courseId, lessonId) {
  e.preventDefault();
  const title = document.getElementById('les-title').value.trim();
  const type = document.getElementById('les-type').value;
  const durationMinutes = parseInt(document.getElementById('les-duration').value, 10) || 15;
  const videoUrl = document.getElementById('les-url').value.trim();
  const contentBody = document.getElementById('les-body').value.trim();
  const isFreePreview = document.getElementById('les-preview').checked;

  const existingLessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  const newOrder = lessonId ? (window.DB.findById('lessons', lessonId)?.order || existingLessons.length) : (existingLessons.length + 1);

  await window.API.saveLesson({
    id: lessonId || undefined,
    courseId,
    order: newOrder,
    title,
    type,
    durationMinutes,
    videoUrl,
    contentBody,
    isFreePreview,
    resources: []
  });

  window.App.showToast(lessonId ? 'سبق کامیابی سے اپ ڈیٹ ہو گیا!' : 'نیا سبق نصاب میں شامل ہو گیا!', 'success');
  window.Views.admin.openManageLessonsModal(courseId);
};

window.Views.admin.deleteLesson = async function(courseId, lessonId) {
  if (confirm('کیا آپ واقعی یہ سبق حذف کرنا چاہتے ہیں؟')) {
    await window.API.deleteLesson(lessonId);
    window.App.showToast('سبق نصاب سے ہٹا دیا گیا۔', 'info');
    window.Views.admin.openManageLessonsModal(courseId);
  }
};

