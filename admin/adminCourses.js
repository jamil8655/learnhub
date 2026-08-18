/**
 * LearnHub Admin Course & Lesson Management Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderCourses = async function() {
  const container = document.getElementById('main-content');
  const courses = await window.API.getCourses({ includeAllStatus: true });
  const categories = window.DB.get('categories');
  const instructors = window.DB.get('instructors');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Masterclasses & Courses</h1>
          <p class="text-xs text-slate-500">Create, edit, organize curriculum lessons, and manage pricing.</p>
        </div>
        <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Create New Course
        </button>
      </div>

      <!-- Courses Table -->
      <div class="lh-card overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search courses..." 
            class="form-input text-xs max-w-xs"
            oninput="window.Views.admin.filterCourseTable(this.value)"
          />
          <span class="text-xs text-slate-400">Total Courses: <strong>${courses.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs" id="admin-courses-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">Course</th>
                <th class="p-3">Category</th>
                <th class="p-3">Instructor</th>
                <th class="p-3">Pricing</th>
                <th class="p-3">Students</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${courses.map(course => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <img src="${course.thumbnail}" class="w-12 h-8 rounded-lg object-cover">
                      <div>
                        <div class="font-bold text-slate-900 dark:text-white">${course.title}</div>
                        <div class="text-[11px] text-slate-400">${course.lessonCount || 0} lessons • ${course.durationHours} hrs</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3">
                    <span class="badge badge-neutral text-[10px]">${course.category?.name || 'General'}</span>
                  </td>
                  <td class="p-3 text-slate-600 dark:text-slate-300 font-medium">
                    ${course.instructor?.name || 'Faculty'}
                  </td>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">
                    ${course.isFree ? '<span class="text-emerald-600">FREE</span>' : '$' + course.price}
                  </td>
                  <td class="p-3">${(course.enrolledCount || 0).toLocaleString()}</td>
                  <td class="p-3">
                    <button onclick="window.Views.admin.toggleCourseStatus('${course.id}')" class="badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'} cursor-pointer text-[10px] uppercase">
                      ${course.status}
                    </button>
                  </td>
                  <td class="p-3 text-right space-x-1 whitespace-nowrap">
                    <button onclick="window.Views.admin.openManageLessonsModal('${course.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg" title="Manage Lessons">
                      <i data-lucide="list-ordered" class="w-3.5 h-3.5 text-indigo-600"></i> Lessons
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
};

window.Views.admin.filterCourseTable = function(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#admin-courses-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openCourseBuilderModal = function(courseId = null) {
  const course = courseId ? window.DB.findById('courses', courseId) : null;
  const categories = window.DB.get('categories');
  const instructors = window.DB.get('instructors');

  window.App.showModal(course ? 'Edit Masterclass' : 'Create New Masterclass', `
    <form onsubmit="window.Views.admin.saveCourseForm(event, '${courseId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Title</label>
        <input type="text" id="cb-title" value="${course ? course.title : ''}" required class="form-input text-xs">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
          <select id="cb-category" class="form-input text-xs">
            ${categories.map(c => `
              <option value="${c.id}" ${course && course.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructor</label>
          <select id="cb-instructor" class="form-input text-xs">
            ${instructors.map(i => `
              <option value="${i.id}" ${course && course.instructorId === i.id ? 'selected' : ''}>${i.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Price ($)</label>
          <input type="number" step="0.01" id="cb-price" value="${course ? course.price : '49.99'}" required class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Original Price ($)</label>
          <input type="number" step="0.01" id="cb-orig-price" value="${course ? (course.originalPrice || '99.99') : '99.99'}" class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty Level</label>
          <select id="cb-level" class="form-input text-xs">
            <option value="Beginner" ${course && course.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${course && course.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${course && course.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
            <option value="All Levels" ${course && course.level === 'All Levels' ? 'selected' : ''}>All Levels</option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Thumbnail Image URL</label>
        <input type="url" id="cb-thumbnail" value="${course ? course.thumbnail : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}" required class="form-input text-xs">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
        <input type="text" id="cb-short-desc" value="${course ? course.shortDescription : ''}" required class="form-input text-xs">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Description</label>
        <textarea id="cb-description" rows="3" required class="form-input text-xs">${course ? course.description : ''}</textarea>
      </div>

      <div class="flex items-center gap-4 pt-2">
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="cb-free" ${course && course.isFree ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
          <span>Make this course 100% Free</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="cb-publish" ${!course || course.status === 'published' ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
          <span>Publish Course Immediately</span>
        </label>
      </div>

      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save Masterclass</button>
    </form>
  `);
};

window.Views.admin.saveCourseForm = async function(e, courseId) {
  e.preventDefault();
  const title = document.getElementById('cb-title').value;
  const categoryId = document.getElementById('cb-category').value;
  const instructorId = document.getElementById('cb-instructor').value;
  const price = parseFloat(document.getElementById('cb-price').value) || 0;
  const originalPrice = parseFloat(document.getElementById('cb-orig-price').value) || 0;
  const level = document.getElementById('cb-level').value;
  const thumbnail = document.getElementById('cb-thumbnail').value;
  const shortDescription = document.getElementById('cb-short-desc').value;
  const description = document.getElementById('cb-description').value;
  const isFree = document.getElementById('cb-free').checked;
  const status = document.getElementById('cb-publish').checked ? 'published' : 'draft';

  const courseData = {
    id: courseId || undefined,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryId,
    instructorId,
    price: isFree ? 0 : price,
    originalPrice,
    isFree,
    level,
    thumbnail,
    shortDescription,
    description,
    status,
    rating: 5.0,
    ratingCount: 1,
    durationHours: 12.0,
    enrolledCount: 0,
    learningOutcomes: [
      'Master core foundations and architectural principles',
      'Build end-to-end production systems',
      'Apply best-in-class industry patterns'
    ],
    requirements: ['Basic computer proficiency', 'Desire to learn']
  };

  await window.API.saveCourse(courseData);
  window.App.closeModal();
  window.App.showToast(courseId ? 'Course updated!' : 'Course created successfully!', 'success');
  window.Router.handleRouting();
};

window.Views.admin.toggleCourseStatus = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const newStatus = course.status === 'published' ? 'draft' : 'published';
  window.DB.update('courses', courseId, { status: newStatus });
  window.App.showToast(`Course status changed to ${newStatus}.`, 'info');
  window.Router.handleRouting();
};

window.Views.admin.duplicateCourse = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const cloned = {
    ...JSON.parse(JSON.stringify(course)),
    id: `crs-${Date.now()}`,
    title: `${course.title} (Copy)`,
    slug: `${course.slug}-copy`,
    status: 'draft',
    enrolledCount: 0
  };

  window.DB.insert('courses', cloned);
  window.App.showToast('Course duplicated as draft.', 'success');
  window.Router.handleRouting();
};

window.Views.admin.deleteCourse = async function(courseId) {
  if (confirm('Are you sure you want to delete this course and all associated lessons?')) {
    await window.API.deleteCourse(courseId);
    window.App.showToast('Course deleted.', 'info');
    window.Router.handleRouting();
  }
};

// Lesson Manager Modal (Drag-and-Drop / Reordering / Adding Lessons)
window.Views.admin.openManageLessonsModal = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

  window.App.showModal(`Curriculum Lessons: ${course.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500">Total Lessons: <strong>${lessons.length}</strong></span>
        <button onclick="window.Views.admin.openAddLessonForm('${courseId}')" class="btn-primary py-1.5 px-3 text-xs rounded-lg">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Lesson
        </button>
      </div>

      <!-- Lessons List with Up/Down Reordering -->
      <div class="space-y-2" id="admin-lessons-list">
        ${lessons.length === 0 ? `
          <p class="text-xs text-slate-400 py-4 text-center">No lessons added yet. Click "Add Lesson" to build curriculum.</p>
        ` : lessons.map((les, idx) => `
          <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                ${idx + 1}
              </span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${les.title}</div>
                <div class="text-[10px] text-slate-400 uppercase">${les.type} • ${les.durationMinutes} mins ${les.isFreePreview ? '• (Free Preview)' : ''}</div>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, 1)" ${idx === lessons.length - 1 ? 'disabled' : ''} class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.deleteLesson('${courseId}', '${les.id}')" class="p-1 rounded hover:bg-rose-100 text-rose-600">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
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

window.Views.admin.openAddLessonForm = function(courseId) {
  window.App.showModal('Add Curriculum Lesson', `
    <form onsubmit="window.Views.admin.saveNewLesson(event, '${courseId}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Title</label>
        <input type="text" id="les-title" required class="form-input text-xs">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Content Type</label>
          <select id="les-type" class="form-input text-xs">
            <option value="video">Video Lesson</option>
            <option value="text">Text / Markdown Lesson</option>
            <option value="audio">Audio Lecture</option>
            <option value="pdf">PDF Document</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Minutes)</label>
          <input type="number" id="les-duration" value="15" required class="form-input text-xs">
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Video / Audio Embed URL</label>
        <input type="text" id="les-url" value="https://www.youtube.com/embed/dQw4w9WgXcQ" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Notes / Markdown Text</label>
        <textarea id="les-body" rows="4" placeholder="Enter lesson text..." class="form-input text-xs"></textarea>
      </div>
      <div>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="les-preview" class="rounded text-indigo-600">
          <span>Enable Free Preview for non-enrolled visitors</span>
        </label>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save Lesson</button>
    </form>
  `);
};

window.Views.admin.saveNewLesson = async function(e, courseId) {
  e.preventDefault();
  const title = document.getElementById('les-title').value;
  const type = document.getElementById('les-type').value;
  const durationMinutes = parseInt(document.getElementById('les-duration').value, 10) || 10;
  const videoUrl = document.getElementById('les-url').value;
  const contentBody = document.getElementById('les-body').value;
  const isFreePreview = document.getElementById('les-preview').checked;

  const existingLessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  const newOrder = existingLessons.length + 1;

  await window.API.saveLesson({
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

  window.App.showToast('Lesson added to curriculum!', 'success');
  window.Views.admin.openManageLessonsModal(courseId);
};

window.Views.admin.deleteLesson = async function(courseId, lessonId) {
  if (confirm('Delete this lesson?')) {
    await window.API.deleteLesson(lessonId);
    window.App.showToast('Lesson removed.', 'info');
    window.Views.admin.openManageLessonsModal(courseId);
  }
};
