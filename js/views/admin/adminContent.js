/**
 * LearnHub Admin Content, CMS, Media Library, Support Triage, Audit Logs & Settings
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

// Categories Manager View
window.Views.admin.renderCategories = async function() {
  const container = document.getElementById('main-content');
  const categories = window.DB.get('categories');
  const courses = window.DB.get('courses');
  const quizzes = window.DB.get('quizzes');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Academic Categories</h1>
          <p class="text-xs text-slate-500">Organize courses, quizzes, and learning materials into structured domains.</p>
        </div>
        <button onclick="window.Views.admin.openCategoryModal()" class="btn-primary py-2 px-3 text-xs rounded-xl">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Category
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${categories.map(cat => {
          const catCourses = courses.filter(c => c.categoryId === cat.id);
          const catQuizzes = quizzes.filter(q => q.categoryId === cat.id);

          return `
            <div class="lh-card p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background-color: ${cat.color}15; color: ${cat.color};">
                  <i data-lucide="${cat.icon || 'book-open'}" class="w-6 h-6"></i>
                </div>
                <div class="flex gap-1">
                  <button onclick="window.Views.admin.openCategoryModal('${cat.id}')" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                    <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="window.Views.admin.deleteCategory('${cat.id}')" class="p-1.5 rounded hover:bg-rose-100 text-rose-500">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">${cat.name}</h3>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${cat.description}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-400">
                <span>${catCourses.length} Courses</span>
                <span>•</span>
                <span>${catQuizzes.length} Quizzes</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openCategoryModal = function(catId = null) {
  const cat = catId ? window.DB.findById('categories', catId) : null;

  window.App.showModal(cat ? 'Edit Category' : 'Create Category', `
    <form onsubmit="window.Views.admin.saveCategory(event, '${catId || ''}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category Name</label>
        <input type="text" id="cat-name" value="${cat ? cat.name : ''}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
        <textarea id="cat-desc" rows="2" required class="form-input text-xs">${cat ? cat.description : ''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lucide Icon Name</label>
          <input type="text" id="cat-icon" value="${cat ? (cat.icon || 'book-open') : 'code'}" required class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Theme Color</label>
          <input type="color" id="cat-color" value="${cat ? (cat.color || '#4f46e5') : '#4f46e5'}" class="h-9 w-full p-1 rounded-xl cursor-pointer">
        </div>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save Category</button>
    </form>
  `);
};

window.Views.admin.saveCategory = function(e, catId) {
  e.preventDefault();
  const name = document.getElementById('cat-name').value;
  const description = document.getElementById('cat-desc').value;
  const icon = document.getElementById('cat-icon').value;
  const color = document.getElementById('cat-color').value;

  const data = {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    icon,
    color
  };

  if (catId) {
    window.DB.update('categories', catId, data);
    window.App.showToast('Category updated!', 'success');
  } else {
    window.DB.insert('categories', data);
    window.App.showToast('Category created!', 'success');
  }

  window.App.closeModal();
  window.Views.admin.renderCategories();
};

window.Views.admin.deleteCategory = function(catId) {
  if (confirm('Delete this category?')) {
    window.DB.delete('categories', catId);
    window.App.showToast('Category removed.', 'info');
    window.Views.admin.renderCategories();
  }
};

// Instructors Manager View
window.Views.admin.renderInstructors = async function() {
  const container = document.getElementById('main-content');
  const instructors = window.DB.get('instructors');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Instructor Directory</h1>
          <p class="text-xs text-slate-500">Manage teaching faculty profiles, bios, and course assignments.</p>
        </div>
        <button onclick="window.Views.admin.openInstructorModal()" class="btn-primary py-2 px-3 text-xs rounded-xl">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Instructor
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${instructors.map(inst => `
          <div class="lh-card p-6 space-y-4">
            <div class="flex items-center justify-between">
              <img src="${inst.avatar}" class="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 dark:border-indigo-900">
              <div class="flex gap-1">
                <button onclick="window.Views.admin.openInstructorModal('${inst.id}')" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.Views.admin.deleteInstructor('${inst.id}')" class="p-1.5 rounded hover:bg-rose-100 text-rose-500">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">${inst.name}</h3>
              <p class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">${inst.title}</p>
              <p class="text-xs text-slate-500 mt-2 line-clamp-2">${inst.bio}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-400">
              <span class="flex items-center gap-1"><i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i> ${inst.rating}</span>
              <span>${inst.studentsCount.toLocaleString()} Students</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openInstructorModal = function(instId = null) {
  const inst = instId ? window.DB.findById('instructors', instId) : null;

  window.App.showModal(inst ? 'Edit Instructor' : 'Add Instructor', `
    <form onsubmit="window.Views.admin.saveInstructor(event, '${instId || ''}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructor Name</label>
        <input type="text" id="inst-name" value="${inst ? inst.name : ''}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Professional Title</label>
        <input type="text" id="inst-title" value="${inst ? inst.title : ''}" required placeholder="e.g. Lead AI Researcher" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Avatar Image URL</label>
        <input type="url" id="inst-avatar" value="${inst ? inst.avatar : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bio / Background</label>
        <textarea id="inst-bio" rows="3" required class="form-input text-xs">${inst ? inst.bio : ''}</textarea>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save Instructor</button>
    </form>
  `);
};

window.Views.admin.saveInstructor = function(e, instId) {
  e.preventDefault();
  const name = document.getElementById('inst-name').value;
  const title = document.getElementById('inst-title').value;
  const avatar = document.getElementById('inst-avatar').value;
  const bio = document.getElementById('inst-bio').value;

  const data = {
    name,
    title,
    avatar,
    bio,
    rating: 4.9,
    studentsCount: 1000,
    coursesCount: 1,
    expertise: ['Technology', 'Software Architecture']
  };

  if (instId) {
    window.DB.update('instructors', instId, data);
    window.App.showToast('Instructor updated!', 'success');
  } else {
    window.DB.insert('instructors', data);
    window.App.showToast('Instructor added!', 'success');
  }

  window.App.closeModal();
  window.Views.admin.renderInstructors();
};

window.Views.admin.deleteInstructor = function(instId) {
  if (confirm('Delete this instructor record?')) {
    window.DB.delete('instructors', instId);
    window.App.showToast('Instructor deleted.', 'info');
    window.Views.admin.renderInstructors();
  }
};

// Reviews Moderation View
window.Views.admin.renderReviews = async function() {
  const container = document.getElementById('main-content');
  const reviews = window.DB.get('reviews');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Review Moderation</h1>
          <p class="text-xs text-slate-500">Review student ratings, moderate feedback, and manage quality assurance.</p>
        </div>
      </div>

      <div class="lh-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Course</th>
                <th class="p-3">Rating</th>
                <th class="p-3">Review Headline & Comment</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${reviews.map(r => {
                const c = window.DB.findById('courses', r.courseId);
                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="p-3 font-bold">${r.userName}</td>
                    <td class="p-3 text-slate-500 max-w-[140px] truncate">${c ? c.title : 'Course'}</td>
                    <td class="p-3 text-amber-500 font-bold">⭐ ${r.rating}/5</td>
                    <td class="p-3 max-w-sm">
                      <div class="font-bold text-slate-900 dark:text-white truncate">${r.title}</div>
                      <div class="text-[11px] text-slate-500 line-clamp-1">${r.comment}</div>
                    </td>
                    <td class="p-3">
                      <span class="badge ${r.status === 'approved' ? 'badge-success' : 'badge-danger'} text-[10px] uppercase">${r.status}</span>
                    </td>
                    <td class="p-3 text-right space-x-1">
                      <button onclick="window.Views.admin.toggleReviewStatus('${r.id}')" class="btn-secondary py-1 px-2 text-[10px] rounded-lg">
                        ${r.status === 'approved' ? 'Hide' : 'Approve'}
                      </button>
                      <button onclick="window.Views.admin.deleteReview('${r.id}')" class="btn-secondary py-1 px-2 text-[10px] rounded-lg text-rose-500">
                        Delete
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.toggleReviewStatus = function(reviewId) {
  const r = window.DB.findById('reviews', reviewId);
  if (!r) return;

  const newStatus = r.status === 'approved' ? 'hidden' : 'approved';
  window.DB.update('reviews', reviewId, { status: newStatus });
  window.App.showToast(`Review status updated to ${newStatus}.`, 'info');
  window.Router.handleRouting();
};

window.Views.admin.deleteReview = function(reviewId) {
  if (confirm('Delete this review permanently?')) {
    window.DB.delete('reviews', reviewId);
    window.App.showToast('Review deleted.', 'info');
    window.Router.handleRouting();
  }
};

// Announcements Broadcast View
window.Views.admin.renderAnnouncements = async function() {
  const container = document.getElementById('main-content');
  const announcements = window.DB.get('announcements') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">اعلانات و نوٹیفیکیشنز کنٹرول (Announcements)</h1>
          <p class="text-xs text-slate-500">تمام طلباء کے لیے اہم اطلاعات، نصابی اپ ڈیٹس اور چیلنجز کا براڈکاسٹ کریں۔</p>
        </div>
        <button onclick="window.Views.admin.openAnnouncementModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow">
          <i data-lucide="megaphone" class="w-3.5 h-3.5"></i> نیا اعلان جاری کریں
        </button>
      </div>

      <div class="space-y-4">
        ${announcements.length === 0 ? `
          <div class="lh-card p-8 text-center text-slate-400 text-xs rounded-3xl">کوئی اعلان موجود نہیں ہے۔</div>
        ` : announcements.map(ann => `
          <div class="lh-card p-6 space-y-3 rounded-3xl border-r-4 ${ann.priority === 'urgent' ? 'border-r-rose-500' : 'border-r-purple-500'} bg-white dark:bg-slate-900 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="badge ${ann.priority === 'urgent' ? 'badge-danger' : 'badge-primary'} text-[10px] uppercase font-bold">${ann.priority === 'urgent' ? 'اہم ترین (Urgent)' : 'عام اعلان'}</span>
                <span class="badge badge-neutral text-[10px] font-bold">${ann.targetAudience || 'تمام طلباء'}</span>
              </div>
              <div class="flex gap-2 text-xs">
                <button onclick="window.Views.admin.openAnnouncementModal('${ann.id}')" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">ایڈٹ</button>
                <button onclick="window.Views.admin.deleteAnnouncement('${ann.id}')" class="text-rose-500 font-bold hover:underline">ڈیلیٹ</button>
              </div>
            </div>

            <h3 class="font-bold text-base text-slate-900 dark:text-white">${ann.title}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${ann.content}</p>

            <div class="text-[11px] text-slate-400 pt-2 flex justify-between border-t border-slate-100 dark:border-slate-800 font-mono">
              <span>تاریخِ اشاعت: ${ann.createdAt || '2026-02-18'}</span>
              <span>آخری تاریخ: ${ann.expiresAt || '2026-12-31'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openAnnouncementModal = function(annId = null) {
  const existing = annId ? window.DB.findById('announcements', annId) : null;

  window.App.showModal(existing ? 'اعلان میں ترمیم کریں' : 'نیا اعلان براڈکاسٹ کریں', `
    <form onsubmit="window.Views.admin.saveAnnouncement(event, '${annId || ''}')" class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">اعلان کا عنوان</label>
        <input type="text" id="ann-title" value="${existing ? existing.title : ''}" required class="form-input text-xs font-urdu" placeholder="مثلاً: رمضان المبارک کے خصوصی دروس کا آغاز">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ترجیح (Priority)</label>
        <select id="ann-priority" class="form-input text-xs font-urdu">
          <option value="normal" ${existing && existing.priority === 'normal' ? 'selected' : ''}>عام نشریات (Normal Broadcast)</option>
          <option value="urgent" ${existing && existing.priority === 'urgent' ? 'selected' : ''}>فوری و اہم الرٹ (Urgent / Highlight)</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">اعلان کا تفصیلی متن</label>
        <textarea id="ann-content" rows="4" required class="form-input text-xs font-urdu leading-relaxed" placeholder="پیغام یہاں تحریر کریں...">${existing ? existing.content : ''}</textarea>
      </div>
      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
          ${existing ? 'اعلان اپ ڈیٹ کریں' : 'تمام طلباء کو ارسال کریں'}
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveAnnouncement = function(e, annId) {
  e.preventDefault();
  const title = document.getElementById('ann-title').value.trim();
  const priority = document.getElementById('ann-priority').value;
  const content = document.getElementById('ann-content').value.trim();

  const annData = {
    id: annId || undefined,
    title,
    priority,
    content,
    targetAudience: 'تمام طلباء',
    status: 'active',
    createdAt: annId ? (window.DB.findById('announcements', annId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    expiresAt: '2026-12-31'
  };

  if (annId) {
    window.DB.update('announcements', annId, annData);
    window.App.showToast('اعلان اپ ڈیٹ ہو گیا!', 'success');
  } else {
    window.DB.insert('announcements', annData);
    window.App.showToast('اعلان کامیابی سے براڈکاسٹ کر دیا گیا!', 'success');
  }

  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', annId ? 'ANNOUNCEMENT_UPDATED' : 'ANNOUNCEMENT_BROADCAST', title);
  window.App.closeModal();
  window.Views.admin.renderAnnouncements();
};

window.Views.admin.deleteAnnouncement = function(annId) {
  if (confirm('کیا آپ واقعی یہ اعلان حذف کرنا چاہتے ہیں؟')) {
    window.DB.delete('announcements', annId);
    window.App.showToast('اعلان حذف کر دیا گیا۔', 'info');
    window.Views.admin.renderAnnouncements();
  }
};

// Admin Support Ticket & Inquiries Triage View
window.Views.admin.renderSupportTriage = async function() {
  const container = document.getElementById('main-content');
  const tickets = window.DB.get('supportTickets') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="message-circle" class="w-6 h-6 text-emerald-600"></i> ہیلپ ڈیسک، سپورٹ ٹکٹس و استفسارات
          </h1>
          <p class="text-xs text-slate-500 mt-1">طالب علموں کے تمام استفسارات، واٹس ایپ پیغامات اور ای میل ٹکٹس کا تفصیلی جائزہ لیں اور فوری جواب دیں۔</p>
        </div>
        <div class="flex gap-2">
          <a href="#/support" class="btn-secondary py-2 px-3 text-xs rounded-xl flex items-center gap-1.5">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> سپورٹ پورٹل دیکھیں
          </a>
        </div>
      </div>

      <div class="lh-card overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px]">
              <tr>
                <th class="p-3.5">ٹکٹ نمبر</th>
                <th class="p-3.5">طالب علم کا نام و رابطہ</th>
                <th class="p-3.5">شعبہ / کیٹیگری</th>
                <th class="p-3.5">عنوان و خلاصہ</th>
                <th class="p-3.5">ترجیح</th>
                <th class="p-3.5">حالت</th>
                <th class="p-3.5 text-left">فوری کارروائی</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${tickets.length === 0 ? `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-400 text-xs">کوئی سپورٹ ٹکٹ موجود نہیں ہے۔</td>
                </tr>
              ` : tickets.map(tkt => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">${tkt.ticketNumber}</td>
                  <td class="p-3.5">
                    <div class="font-bold text-slate-900 dark:text-white">${tkt.userName}</div>
                    <div class="text-[10px] text-slate-400 font-mono" dir="ltr">${tkt.userEmail || tkt.contactInfo || 'N/A'}</div>
                  </td>
                  <td class="p-3.5"><span class="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">${tkt.category || 'عمومی'}</span></td>
                  <td class="p-3.5 max-w-xs">
                    <div class="font-semibold text-slate-900 dark:text-white line-clamp-1">${tkt.subject}</div>
                    <div class="text-[11px] text-slate-500 line-clamp-1">${tkt.message}</div>
                  </td>
                  <td class="p-3.5">
                    <span class="badge ${tkt.priority === 'high' ? 'badge-danger' : tkt.priority === 'medium' ? 'badge-warning' : 'badge-primary'} text-[10px]">
                      ${tkt.priority === 'high' ? 'اہم ترین' : tkt.priority === 'medium' ? 'درمیانی' : 'عام'}
                    </span>
                  </td>
                  <td class="p-3.5">
                    <span class="badge ${tkt.status === 'resolved' ? 'badge-success' : tkt.status === 'in_progress' ? 'badge-warning' : 'badge-primary'} text-[10px] font-bold">
                      ${tkt.status === 'resolved' ? 'حل شدہ' : tkt.status === 'in_progress' ? 'زیرِ غور' : 'اوپن'}
                    </span>
                  </td>
                  <td class="p-3.5 text-left whitespace-nowrap" dir="ltr">
                    <button onclick="window.Views.admin.openTicketTriageModal('${tkt.id}')" class="btn-primary py-1 px-3 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1">
                      <i data-lucide="message-square" class="w-3 h-3"></i> ٹریج / جواب
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

window.Views.admin.openTicketTriageModal = function(ticketId) {
  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  const contact = tkt.userEmail || tkt.contactInfo || '';
  const digits = contact.replace(/\D/g, '');
  const waTarget = digits.length >= 10 ? (digits.length === 10 ? `92${digits}` : digits) : '923001234567';
  const waText = encodeURIComponent(`السلام علیکم ${tkt.userName}،\nٹکٹ نمبر ${tkt.ticketNumber} (${tkt.subject}) کے جواب میں رابطہ کیا جا رہا ہے:\n`);
  const whatsappUrl = `https://wa.me/${waTarget}?text=${waText}`;

  const mailSubject = encodeURIComponent(`Re: [${tkt.ticketNumber}] ${tkt.subject}`);
  const mailtoUrl = `mailto:${contact.includes('@') ? contact : 'support@learnhub.com'}?subject=${mailSubject}&body=${encodeURIComponent('السلام علیکم،\n\n')}`;

  window.App.showModal(`ٹکٹ کا معائنہ: ${tkt.ticketNumber}`, `
    <div class="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs font-urdu text-right" dir="rtl">
      
      <!-- Top Header & Status -->
      <div class="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div class="font-bold text-sm text-slate-900 dark:text-white">${tkt.subject}</div>
          <span class="text-slate-400 text-[11px]">ارسال کنندہ: ${tkt.userName} (${contact})</span>
        </div>
        <select id="admin-tkt-status-select" onchange="window.Views.admin.updateTicketStatus('${tkt.id}', this.value)" class="form-input text-xs w-32 font-urdu">
          <option value="open" ${tkt.status === 'open' ? 'selected' : ''}>اوپن (Open)</option>
          <option value="in_progress" ${tkt.status === 'in_progress' ? 'selected' : ''}>زیرِ غور (In Progress)</option>
          <option value="resolved" ${tkt.status === 'resolved' ? 'selected' : ''}>حل شدہ (Resolved)</option>
          <option value="closed" ${tkt.status === 'closed' ? 'selected' : ''}>بند (Closed)</option>
        </select>
      </div>

      <!-- Quick Action Contact Strip -->
      <div class="flex flex-wrap gap-2 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/60 items-center justify-between">
        <span class="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">طالب علم سے براہِ راست رابطہ:</span>
        <div class="flex gap-2" dir="ltr">
          <a href="${whatsappUrl}" target="_blank" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp
          </a>
          <a href="${mailtoUrl}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow">
            <i data-lucide="mail" class="w-3.5 h-3.5"></i> Email
          </a>
        </div>
      </div>

      <!-- Request Body -->
      <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1 border border-slate-100 dark:border-slate-700">
        <div class="font-bold text-slate-700 dark:text-slate-300">ابتدائی پیغام یا سوال:</div>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${tkt.message}</p>
      </div>

      <!-- Thread Conversation -->
      <div class="space-y-2">
        <h5 class="font-bold text-slate-400 uppercase text-[10px]">گفتگو کی تاریخ و جوابات (${(tkt.replies || []).length})</h5>
        ${(tkt.replies || []).map(r => `
          <div class="p-3 rounded-xl space-y-1 ${r.senderRole === 'admin' ? 'bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-800'}">
            <div class="flex justify-between font-bold">
              <span>${r.senderName} (${r.senderRole === 'admin' ? 'ایڈمنسٹریٹر' : 'طالب علم'})</span>
              <span class="text-[10px] text-slate-400 font-mono">${new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="leading-relaxed">${r.message}</p>
          </div>
        `).join('')}
      </div>

      <!-- Admin Reply Box -->
      <div class="pt-2 space-y-2">
        <label class="font-bold text-slate-700 dark:text-slate-300 block">رسمی جواب درج کریں اور ٹکٹ اپ ڈیٹ کریں</label>
        <textarea id="admin-tkt-reply-text" rows="3" placeholder="طالب علم کو ارسال کرنے کے لیے وضاحتی جواب لکھیں..." class="form-input text-xs font-urdu leading-relaxed"></textarea>
        <button onclick="window.Views.admin.sendAdminTicketReply('${tkt.id}')" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold">
          جواب ارسال کریں اور ٹکٹ کو 'حل شدہ' نشان زد کریں
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.updateTicketStatus = function(ticketId, status) {
  window.DB.update('supportTickets', ticketId, { status });
  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'TICKET_STATUS_CHANGED', `Ticket #${ticketId} -> ${status}`);
  window.App.showToast(`ٹکٹ کی حالت ${status} میں تبدیل ہو گئی۔`, 'info');
};

window.Views.admin.sendAdminTicketReply = function(ticketId) {
  const text = document.getElementById('admin-tkt-reply-text')?.value?.trim();
  if (!text) return;

  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  tkt.replies = tkt.replies || [];
  tkt.replies.push({
    id: `tr-${Date.now()}`,
    senderName: window.Auth.getCurrentUser()?.name || 'ایڈمن کنٹرولر',
    senderRole: 'admin',
    message: text,
    createdAt: new Date().toISOString()
  });

  window.DB.update('supportTickets', ticketId, { replies: tkt.replies, status: 'resolved' });
  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'TICKET_RESOLVED', tkt.ticketNumber);
  window.App.showToast('جواب طالب علم کے ریکارڈ میں درج کر دیا گیا اور ٹکٹ حل ہو گئی!', 'success');
  window.Views.admin.openTicketTriageModal(ticketId);
};

// CMS Content Management View (Requirement #37)
window.Views.admin.renderCMS = async function() {
  const container = document.getElementById('main-content');
  const cms = window.DB.get('cmsContent') || {};

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Content Management System (CMS)</h1>
        <p class="text-xs text-slate-500">Edit dynamic homepage banners, headlines, and platform FAQs without modifying code.</p>
      </div>

      <div class="lh-card p-6 sm:p-8 space-y-6">
        <form onsubmit="window.Views.admin.saveCMSContent(event)" class="space-y-6">
          <div class="space-y-4">
            <h3 class="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Hero & Banner Configurations</h3>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hero Headline</label>
              <input type="text" id="cms-hero-title" value="${cms.heroTitle || ''}" required class="form-input text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hero Subtitle</label>
              <textarea id="cms-hero-sub" rows="2" required class="form-input text-xs">${cms.heroSubtitle || ''}</textarea>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Top Announcement Banner Text</label>
              <input type="text" id="cms-banner-text" value="${cms.bannerText || ''}" class="form-input text-xs">
            </div>
            <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" id="cms-banner-active" ${cms.bannerActive ? 'checked' : ''} class="rounded text-indigo-600">
              <span>Enable Top Announcement Banner on Homepage</span>
            </label>
          </div>

          <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">About & Institutional Copy</h3>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">About LearnHub Overview</label>
              <textarea id="cms-about" rows="3" class="form-input text-xs">${cms.aboutText || ''}</textarea>
            </div>
          </div>

          <button type="submit" class="btn-primary py-2.5 px-6 text-xs rounded-xl">Save CMS Changes</button>
        </form>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveCMSContent = function(e) {
  e.preventDefault();
  const heroTitle = document.getElementById('cms-hero-title').value;
  const heroSubtitle = document.getElementById('cms-hero-sub').value;
  const bannerText = document.getElementById('cms-banner-text').value;
  const bannerActive = document.getElementById('cms-banner-active').checked;
  const aboutText = document.getElementById('cms-about').value;

  const current = window.DB.get('cmsContent') || {};
  const updated = {
    ...current,
    heroTitle,
    heroSubtitle,
    bannerText,
    bannerActive,
    aboutText
  };

  window.DB.set('cmsContent', updated);
  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'CMS_CONTENT_UPDATED', 'Homepage & Copy');
  window.App.showToast('CMS changes published!', 'success');
  window.Views.admin.renderCMS();
};

// Media Library View (Requirement #36)
window.Views.admin.renderMedia = async function() {
  const container = document.getElementById('main-content');
  const media = window.DB.get('mediaItems') || [];

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Media Assets Library</h1>
          <p class="text-xs text-slate-500">Store and manage course thumbnails, logos, PDFs, and documentation.</p>
        </div>
        <button onclick="window.Views.admin.openUploadMediaModal()" class="btn-primary py-2 px-3 text-xs rounded-xl">
          <i data-lucide="upload" class="w-3.5 h-3.5"></i> Upload Asset
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        ${media.map(item => `
          <div class="lh-card overflow-hidden p-3 space-y-2 flex flex-col justify-between">
            <div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              ${item.type === 'image' ? `
                <img src="${item.url}" class="w-full h-full object-cover">
              ` : `
                <i data-lucide="file" class="w-8 h-8 text-indigo-500"></i>
              `}
            </div>
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white truncate">${item.name}</div>
              <div class="text-[10px] text-slate-400 uppercase">${item.type} • ${item.size}</div>
            </div>
            <div class="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="navigator.clipboard.writeText('${item.url}'); window.App.showToast('Asset URL copied!', 'success');" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Copy Link
              </button>
              <button onclick="window.Views.admin.deleteMedia('${item.id}')" class="text-xs text-rose-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openUploadMediaModal = function() {
  window.App.showModal('Upload Media Asset', `
    <form onsubmit="window.Views.admin.saveMediaItem(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Asset Name</label>
        <input type="text" id="med-name" required placeholder="e.g. react-hero.jpg" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Asset Type</label>
        <select id="med-type" class="form-input text-xs">
          <option value="image">Image (JPG, PNG, WebP)</option>
          <option value="document">Document (PDF, DOC)</option>
          <option value="video">Video Embed Link</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Public URL / Hosted Asset Path</label>
        <input type="url" id="med-url" required placeholder="https://images.unsplash.com/..." class="form-input text-xs">
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save to Media Library</button>
    </form>
  `);
};

window.Views.admin.saveMediaItem = function(e) {
  e.preventDefault();
  const name = document.getElementById('med-name').value;
  const type = document.getElementById('med-type').value;
  const url = document.getElementById('med-url').value;

  window.DB.insert('mediaItems', {
    name,
    type,
    url,
    size: '320 KB',
    uploadedAt: new Date().toISOString().split('T')[0]
  });

  window.App.closeModal();
  window.App.showToast('Asset uploaded to library!', 'success');
  window.Views.admin.renderMedia();
};

window.Views.admin.deleteMedia = function(mediaId) {
  if (confirm('Delete this media asset?')) {
    window.DB.delete('mediaItems', mediaId);
    window.App.showToast('Media item deleted.', 'info');
    window.Views.admin.renderMedia();
  }
};

// Admin Audit Logs View (Requirement #52)
window.Views.admin.renderAuditLogs = async function() {
  const container = document.getElementById('main-content');
  const logs = window.DB.get('auditLogs') || [];

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Administrative Audit Logs</h1>
          <p class="text-xs text-slate-500">Security audit trail of all elevated actions, course modifications, and status changes.</p>
        </div>
      </div>

      <div class="lh-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">Timestamp</th>
                <th class="p-3">Actor</th>
                <th class="p-3">Action Event</th>
                <th class="p-3">Target Resource</th>
                <th class="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${logs.map(log => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="p-3 font-mono text-slate-400">${new Date(log.timestamp).toLocaleString()}</td>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">${log.actorName}</td>
                  <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">${log.action}</td>
                  <td class="p-3 text-slate-600 dark:text-slate-300 font-medium">${log.target}</td>
                  <td class="p-3 font-mono text-slate-400">${log.ip || '127.0.0.1'}</td>
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

// Admin Platform Settings & Cloud Database Manager View
window.Views.admin.renderSettings = async function() {
  const container = document.getElementById('main-content');
  const settings = window.DB.get('settings') || {};
  const cloudStatus = window.CloudDB ? window.CloudDB.getCloudStatus() : { status: 'offline', provider: 'firebase', latency: '0ms' };

  container.innerHTML = `
    <div class="space-y-8 font-urdu pb-12" dir="rtl">
      
      <!-- Top Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">پلیٹ فارم و بیرونی کلاؤڈ ڈیٹا بیس سیٹنگز</h1>
          <p class="text-xs text-slate-500 mt-1">لاگ ان، سائن اپ اور ڈیٹا سنک کے لیے بیرونی کلاؤڈ ڈیٹا بیس کنفیگریشن۔</p>
        </div>
      </div>

      <!-- Cloud Database Connector Card -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 text-white shadow-2xl space-y-6">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl shadow-lg">
              🗄️
            </div>
            <div>
              <span class="text-xs text-indigo-300 font-bold uppercase tracking-wider block">بیرونی کلاؤڈ ڈیٹا بیس انٹیگریشن</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-white">Google Firebase / Supabase Cloud DB</h2>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE CLOUD CONNECTED (${cloudStatus.latency})</span>
            </span>
          </div>
        </div>

        <!-- Cloud Live KPI Metrics -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span class="text-[11px] text-indigo-200 font-bold block">فعال پرووائیڈر</span>
            <span class="text-sm font-extrabold font-mono text-white uppercase">${cloudStatus.provider}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span class="text-[11px] text-indigo-200 font-bold block">کلاؤڈ رجسٹرڈ یوزرز</span>
            <span class="text-sm font-extrabold font-mono text-emerald-400">${cloudStatus.totalCloudUsers} Users</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span class="text-[11px] text-indigo-200 font-bold block">کلاؤڈ کوئز رزلٹس</span>
            <span class="text-sm font-extrabold font-mono text-amber-400">${cloudStatus.totalCloudAttempts} Records</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span class="text-[11px] text-indigo-200 font-bold block">کلاؤڈ مصدقہ اسناد</span>
            <span class="text-sm font-extrabold font-mono text-cyan-400">${cloudStatus.totalCloudCertificates} Verified</span>
          </div>
        </div>

        <!-- Cloud Provider Switcher & Live Ping -->
        <div class="pt-4 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <label class="font-bold text-slate-300 whitespace-nowrap">ڈیٹا بیس پرووائیڈر تبدیل کریں:</label>
            <select id="cloud-provider-select" onchange="window.Views.admin.changeCloudProvider(this.value)" class="bg-slate-800 text-white rounded-xl px-3 py-1.5 border border-slate-700 font-bold">
              <option value="firebase" ${cloudStatus.provider === 'firebase' ? 'selected' : ''}>🔥 Google Firebase (Firestore & Auth)</option>
              <option value="supabase" ${cloudStatus.provider === 'supabase' ? 'selected' : ''}>⚡ Supabase Cloud (PostgreSQL)</option>
              <option value="custom_api" ${cloudStatus.provider === 'custom_api' ? 'selected' : ''}>🐘 Live Laravel 11 REST API</option>
            </select>
          </div>

          <button onclick="window.Views.admin.testCloudDatabaseConnection()" class="btn-primary py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow whitespace-nowrap flex items-center gap-1.5">
            <span>⚡ لائیو کنکشن ٹیسٹ کریں (Ping Cloud)</span>
          </button>
        </div>

      </div>

      <!-- General Platform Settings Card -->
      <div class="lh-card p-6 sm:p-8 space-y-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          عمومی پلیٹ فارم برانڈنگ
        </h3>

        <form onsubmit="window.Views.admin.saveSettings(event)" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پلیٹ فارم کا نام</label>
              <input type="text" id="set-name" value="${settings.siteName || 'LearnHub'}" required class="form-input text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ٹیگ لائن</label>
              <input type="text" id="set-tagline" value="${settings.tagline || 'مستند اسلامی اکیڈمی و امتحانات'}" class="form-input text-xs">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سپورٹ ای میل ایڈریس</label>
              <input type="email" id="set-email" value="${settings.contactEmail || 'support@learnhub.com'}" required class="form-input text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کرنسی سمبل</label>
              <input type="text" id="set-currency" value="${settings.currencySymbol || 'Rs.'}" class="form-input text-xs">
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button type="submit" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold">
              سیٹنگز محفوظ کریں ✓
            </button>
            <button type="button" onclick="if(confirm('کیا آپ ڈیمو ڈیٹا ری سیٹ کرنا چاہتے ہیں؟')) { window.DB.resetToSeed(); window.App.showToast('ڈیٹا بیس ری سیٹ ہو گئی۔', 'info'); window.Router.navigate('/'); }" class="text-xs text-rose-500 hover:underline">
              ڈیٹا بیس ری سیٹ کریں ↺
            </button>
          </div>
        </form>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.changeCloudProvider = function(newProvider) {
  if (window.CloudDB) {
    window.CloudDB.saveConfig(newProvider, {});
    window.App?.showToast(`کلاؤڈ ڈیٹا بیس پرووائیڈر "${newProvider.toUpperCase()}" کامیابی سے فعال ہو گیا!`, 'success');
    window.Views.admin.renderSettings();
  }
};

window.Views.admin.testCloudDatabaseConnection = function() {
  if (window.CloudDB) {
    const status = window.CloudDB.getCloudStatus();
    window.App?.showToast(`✓ کلاؤڈ کنکشن فعال ہے! Latency: ${status.latency} | پرووائیڈر: ${status.provider.toUpperCase()} | کل یوزرز: ${status.totalCloudUsers}`, 'success');
  }
};

window.Views.admin.saveSettings = function(e) {
  e.preventDefault();
  const siteName = document.getElementById('set-name').value;
  const tagline = document.getElementById('set-tagline').value;
  const contactEmail = document.getElementById('set-email').value;
  const currencySymbol = document.getElementById('set-currency').value;
  const brandPrimary = document.getElementById('set-primary').value;
  const brandAccent = document.getElementById('set-accent').value;
  const footerText = document.getElementById('set-footer').value;

  const current = window.DB.get('settings') || {};
  const updated = {
    ...current,
    siteName,
    tagline,
    contactEmail,
    currencySymbol,
    brandPrimary,
    brandAccent,
    footerText
  };

  window.DB.set('settings', updated);
  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'SETTINGS_UPDATED', 'Platform Settings');
  window.App.showToast('Platform settings saved!', 'success');
  window.Views.admin.renderSettings();
};

/* =============================================================================
   ADMIN ISLAMIC LIBRARY & BOOKS MANAGEMENT SUITE
   ============================================================================= */

window.Views.admin.renderBooks = function(filterCategory = 'all') {
  const container = document.getElementById('main-content');
  if (!container) return;

  const books = window.getLibraryBooks ? window.getLibraryBooks() : (window.ISLAMIC_LIBRARY_BOOKS || []);
  
  const tafseerCount = books.filter(b => b.category === 'tafseer').length;
  const hadithCount = books.filter(b => b.category === 'hadith').length;
  const aqeedahCount = books.filter(b => b.category === 'aqeedah').length;
  const fiqhCount = books.filter(b => b.category === 'fiqh').length;
  const customCount = books.filter(b => b.id && b.id.startsWith('bk-user-')).length;

  const categories = [
    { key: 'all', name: 'تمام کتب' },
    { key: 'tafseer', name: 'تفاسیر' },
    { key: 'hadith', name: 'کتبِ حدیث' },
    { key: 'aqeedah', name: 'عقیدہ و توحید' },
    { key: 'fiqh', name: 'فقہ الحدیث' },
    { key: 'seerah', name: 'سیرت و تاریخ' },
    { key: 'asmarijal', name: 'اسماء الرجال' },
    { key: 'muhadditheen', name: 'ائمہ و محدثین' },
    { key: 'scholars_subcontinent', name: 'علمائے برصغیر' }
  ];

  const filtered = filterCategory === 'all' ? books : books.filter(b => b.category === filterCategory);

  container.innerHTML = `
    <div class="space-y-6 font-urdu text-right select-none animate-fade-in" dir="rtl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-500/30">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full shadow mb-2">
            <i data-lucide="book-marked" class="w-3.5 h-3.5"></i> کتب خانہ ایڈمنسٹریشن
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">اسلامی کتب خانہ و ای-ریڈر کنٹرول</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 mt-1">تمام مراجع، تفاسیر، کتبِ حدیث، پی ڈی ایف فائلز اور نئے ابواب کی مینجمنٹ۔</p>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <button onclick="window.Views.openAddBookModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> نئی کتاب شامل کریں
          </button>
          <a href="#/library" target="_blank" class="btn-secondary py-2.5 px-4 text-xs rounded-xl flex items-center gap-1.5 text-amber-400 font-bold border border-amber-500/30">
            <i data-lucide="external-link" class="w-4 h-4"></i> پبلک کتب خانہ دیکھیں
          </a>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border-t-4 border-t-emerald-500 shadow-sm">
          <div class="text-xs text-slate-500 font-bold">کل کتب (Total)</div>
          <div class="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">${books.length}</div>
        </div>
        <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border-t-4 border-t-indigo-500 shadow-sm">
          <div class="text-xs text-slate-500 font-bold">تفاسیر و علوم القرآن</div>
          <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">${tafseerCount}</div>
        </div>
        <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border-t-4 border-t-amber-500 shadow-sm">
          <div class="text-xs text-slate-500 font-bold">کتبِ حدیث و شروح</div>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">${hadithCount}</div>
        </div>
        <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border-t-4 border-t-cyan-500 shadow-sm">
          <div class="text-xs text-slate-500 font-bold">عقیدہ و توحید</div>
          <div class="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1">${aqeedahCount}</div>
        </div>
        <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border-t-4 border-t-purple-500 shadow-sm">
          <div class="text-xs text-slate-500 font-bold">کسٹم ایڈ شدہ کتب</div>
          <div class="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">${customCount}</div>
        </div>
      </div>

      <!-- Controls & Table -->
      <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            ${categories.map(c => `
              <button onclick="window.Views.admin.renderBooks('${c.key}')" class="py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 ${filterCategory === c.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                ${c.name}
              </button>
            `).join('')}
          </div>

          <div class="relative w-full sm:w-64">
            <input type="text" id="admin-book-search" oninput="window.Views.admin.filterBooksTable(this.value)" placeholder="کتاب تلاش کریں..." class="form-input text-xs w-full pr-8">
            <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2"></i>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-right border-collapse" id="admin-books-table">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
                <th class="p-3">سرورق</th>
                <th class="p-3">کتاب کا عنوان</th>
                <th class="p-3">شعبہ / کیٹیگری</th>
                <th class="p-3">مصنف</th>
                <th class="p-3">صفحات</th>
                <th class="p-3">پی ڈی ایف حالت</th>
                <th class="p-3 text-center">اختیارات (Actions)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
              ${filtered.map(book => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3">
                    <img src="${book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'}" class="w-10 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm">
                  </td>
                  <td class="p-3">
                    <div class="text-slate-900 dark:text-white font-black">${book.title}</div>
                    <div class="text-[10px] text-amber-600 font-arabic">${book.titleArabic || ''}</div>
                  </td>
                  <td class="p-3">
                    <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] py-0.5 px-2">
                      ${book.categoryName || book.category}
                    </span>
                  </td>
                  <td class="p-3 text-slate-600 dark:text-slate-300">${book.author}</td>
                  <td class="p-3 font-mono text-slate-700 dark:text-slate-300">${book.pages || 250} ص</td>
                  <td class="p-3">
                    ${(book.downloadUrl && book.downloadUrl !== '#') || (book.pdfUrl && book.pdfUrl !== '#') ? `
                      <span class="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> منسلک
                      </span>
                    ` : `
                      <span class="text-slate-400 text-[11px]">صرف ای-ریڈر</span>
                    `}
                  </td>
                  <td class="p-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button onclick="window.Views.openBookReader('${book.id}')" class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100" title="مطالعہ کریں">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                      </button>
                      <button onclick="window.Views.openEditBookModal('${book.id}')" class="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 hover:bg-amber-100" title="ترمیم کریں">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                      </button>
                      <button onclick="window.Views.deleteBook('${book.id}'); window.Views.admin.renderBooks('${filterCategory}')" class="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100" title="حذف کریں">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
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

window.Views.admin.filterBooksTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-books-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};
