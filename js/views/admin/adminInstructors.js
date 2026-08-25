/**
 * LearnHub Admin Instructor & Applications Management Suite
 * Full control to view, approve, reject, suspend, remove, and transfer instructor courses.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderInstructors = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const allUsers = window.DB.get('users') || [];
  const instructors = allUsers.filter(u => u.role === 'instructor');
  const applications = window.DB.get('instructorApplications') || [];
  const pendingApps = applications.filter(a => a.status === 'submitted' || a.status === 'under_review');
  const allCourses = window.DB.get('courses') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Top Title & Stats Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <i data-lucide="award" class="w-3.5 h-3.5"></i> شیوخ و اساتذہ مینجمنٹ
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">اساتذۂ کرام اور تدریسی درخواستیں</h1>
          <p class="text-xs text-slate-500">تمام اساتذہ کے اکاؤنٹس، کورسز کے حقوق، اور نئی درخواستوں کی منظوری و انتظام۔</p>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.Views.admin.openAddInstructorModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="user-plus" class="w-4 h-4"></i> براہِ راست استاد شامل کریں
          </button>
        </div>
      </div>

      <!-- 3 Metrics KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">فعال اساتذۂ کرام</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">${instructors.length}</div>
          <span class="text-[10px] text-slate-500">منظور شدہ پروفائلز</span>
        </div>
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">زیرِ جائزہ درخواستیں</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">${pendingApps.length}</div>
          <span class="text-[10px] text-amber-600">منظوری کی منتظر</span>
        </div>
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">اساتذہ کے زیرِ تدریس کورسز</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">${allCourses.length}</div>
          <span class="text-[10px] text-indigo-500">آن لائن کلاسز</span>
        </div>
      </div>

      <!-- Tabs: All Instructors | Applications Queue -->
      <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        <!-- Tab Navigation Header -->
        <div class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
          <button id="tab-btn-inst-all" onclick="window.Views.admin.switchInstTab('all')" class="py-2 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition">
            تمام اساتذہ (${instructors.length})
          </button>
          <button id="tab-btn-inst-apps" onclick="window.Views.admin.switchInstTab('apps')" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition flex items-center gap-1.5">
            <span>درخواستیں (Applications Queue)</span>
            ${pendingApps.length ? `<span class="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold font-mono">${pendingApps.length}</span>` : ''}
          </button>
        </div>

        <!-- Tab 1: All Instructors Table -->
        <div id="tab-pane-inst-all" class="p-4 sm:p-6 space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-3.5">استاد کا نام و پروفائل</th>
                  <th class="p-3.5">ای میل و رابطہ</th>
                  <th class="p-3.5">تدریسی عنوان</th>
                  <th class="p-3.5">کورسز کی تعداد</th>
                  <th class="p-3.5">اسٹیٹس</th>
                  <th class="p-3.5 text-left">اختیارات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${instructors.length === 0 ? `
                  <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400 font-urdu">کوئی استاد موجود نہیں ہے۔</td>
                  </tr>
                ` : instructors.map(inst => {
                  const instCourses = allCourses.filter(c => c.instructorId === inst.id || c.instructor === inst.name);
                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td class="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <img src="${inst.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div class="font-bold">${inst.name}</div>
                          <span class="text-[10px] text-slate-400 font-mono" dir="ltr">${inst.email}</span>
                        </div>
                      </td>
                      <td class="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300" dir="ltr">${inst.phone || '+91'}</td>
                      <td class="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">${inst.headline || 'استاذ و محقق'}</td>
                      <td class="p-3.5 font-bold font-mono">${instCourses.length} کورسز</td>
                      <td class="p-3.5">
                        <span class="badge ${inst.status === 'active' ? 'badge-success' : 'badge-danger'} text-[10px] font-bold">
                          ${inst.status === 'active' ? 'فعال (Active)' : 'معطل (Suspended)'}
                        </span>
                      </td>
                      <td class="p-3.5 text-left space-x-1 whitespace-nowrap" dir="ltr">
                        <button onclick="window.Views.admin.openAddInstructorModal('${inst.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-amber-600 hover:bg-amber-50" title="معلومات و تصویر تبدیل کریں">ترمیم</button>
   <button onclick="window.Views.admin.toggleInstructorStatus('${inst.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg ${inst.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}" title="اسٹیٹس تبدیل کریں">
                          ${inst.status === 'active' ? 'معطل کریں' : 'بحال کریں'}
                        </button>
                        <button onclick="window.Views.admin.openTransferCourseModal('${inst.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-indigo-600" title="کورس منتقل کریں">
                          کورس تفویض
                        </button>
                        <button onclick="window.Views.admin.removeInstructorRole('${inst.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="استاد کا رول ختم کریں">
                          رول ختم
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Applications Queue -->
        <div id="tab-pane-inst-apps" class="p-4 sm:p-6 space-y-4 hidden">
          ${applications.length === 0 ? `
            <div class="p-10 text-center text-slate-400 font-urdu">کوئی تدریسی درخواست موجود نہیں ہے۔</div>
          ` : applications.map(app => `
            <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${app.userName}</h3>
                  <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span class="font-mono" dir="ltr">${app.userEmail}</span>
                    <span>•</span>
                    <span class="font-mono" dir="ltr">${app.phone}</span>
                    <span>•</span>
                    <span>تاریخ: ${app.date || '۲۰ فروری ۲۰۲۶'}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning'} text-xs font-bold uppercase">
                    ${app.status === 'approved' ? 'منظور شدہ' : app.status === 'rejected' ? 'مسترد شدہ' : 'زیرِ جائزہ'}
                  </span>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <strong class="text-slate-400 block mb-0.5">تدریسی عنوان:</strong>
                  <span class="font-bold text-slate-800 dark:text-slate-200">${app.title}</span>
                </div>
                <div>
                  <strong class="text-slate-400 block mb-0.5">اسناد و ڈگریاں:</strong>
                  <span class="font-bold text-slate-800 dark:text-slate-200">${app.qualifications}</span>
                </div>
                <div>
                  <strong class="text-slate-400 block mb-0.5">تجربہ:</strong>
                  <span class="font-bold text-slate-800 dark:text-slate-200 font-mono">${app.experienceYears} سال</span>
                </div>
              </div>

              <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <strong>تعارف و سوانح:</strong>
                <p class="leading-relaxed">${app.bio}</p>
              </div>

              ${app.status === 'submitted' || app.status === 'under_review' ? `
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button onclick="window.Views.admin.rejectInstructorApp('${app.id}')" class="btn-secondary py-1.5 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50">
                    مسترد کریں
                  </button>
                  <button onclick="window.Views.admin.approveInstructorApp('${app.id}')" class="btn-primary py-1.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                    منظور کریں اور استاد بنائیں ✓
                  </button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.switchInstTab = function(tab) {
  const btnAll = document.getElementById('tab-btn-inst-all');
  const btnApps = document.getElementById('tab-btn-inst-apps');
  const paneAll = document.getElementById('tab-pane-inst-all');
  const paneApps = document.getElementById('tab-pane-inst-apps');

  if (tab === 'all') {
    btnAll.className = 'py-2 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition';
    btnApps.className = 'py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition flex items-center gap-1.5';
    paneAll.classList.remove('hidden');
    paneApps.classList.add('hidden');
  } else {
    btnApps.className = 'py-2 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition flex items-center gap-1.5';
    btnAll.className = 'py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition';
    paneApps.classList.remove('hidden');
    paneAll.classList.add('hidden');
  }
};

window.Views.admin.approveInstructorApp = function(appId) {
  const apps = window.DB.get('instructorApplications') || [];
  const app = apps.find(a => a.id === appId);
  if (!app) return;

  app.status = 'approved';
  window.DB.set('instructorApplications', apps);

  // Update user role to instructor
  const users = window.DB.get('users') || [];
  const u = users.find(user => user.id === app.userId || user.email === app.userEmail);
  if (u) {
    u.role = 'instructor';
    u.headline = app.title;
    u.bio = app.bio;
    window.DB.set('users', users);
  }

  window.App.showToast(`درخواست منظور کر لی گئی ہے اور ${app.userName} کو استاد کا رول دے دیا گیا ہے۔`, 'success');
  window.Views.admin.renderInstructors();
};

window.Views.admin.rejectInstructorApp = function(appId) {
  const reason = prompt('مسترد کرنے کی وجہ درج فرمائیں:', 'معیار پر پورا نہ اترنے کی وجہ سے۔');
  if (!reason) return;

  const apps = window.DB.get('instructorApplications') || [];
  const app = apps.find(a => a.id === appId);
  if (!app) return;

  app.status = 'rejected';
  app.adminNotes = reason;
  window.DB.set('instructorApplications', apps);

  window.App.showToast('درخواست مسترد کر دی گئی ہے۔', 'info');
  window.Views.admin.renderInstructors();
};

window.Views.admin.toggleInstructorStatus = function(instId) {
  const users = window.DB.get('users') || [];
  const u = users.find(user => user.id === instId);
  if (!u) return;

  u.status = u.status === 'active' ? 'suspended' : 'active';
  window.DB.set('users', users);

  window.App.showToast(u.status === 'active' ? 'استاد کا اکاؤنٹ بحال کر دیا گیا ہے۔' : 'استاد کا اکاؤنٹ معطل کر دیا گیا ہے۔', 'info');
  window.Views.admin.renderInstructors();
};

window.Views.admin.removeInstructorRole = function(instId) {
  if (!confirm('کیا آپ واقعی اس صارف سے استاد کا رول واپس لے کر عام طالب علم بنانا چاہتے ہیں؟')) return;

  const users = window.DB.get('users') || [];
  const u = users.find(user => user.id === instId);
  if (!u) return;

  u.role = 'student';
  window.DB.set('users', users);

  window.App.showToast('استاد کا رول کامیابی سے ختم کر دیا گیا ہے۔', 'success');
  window.Views.admin.renderInstructors();
};


window._pendingInstructorAvatar = null;

window.Views.admin.handleInstructorAvatarUpload = function(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
  
  if (file.size > 8 * 1024 * 1024) {
    window.App?.showToast('تصویر کا سائز 8MB سے کم ہونا چاہیے۔', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    // Compress in canvas to 300x300 for optimal storage & speed
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 300, 300);
      const compressedData = canvas.toDataURL('image/jpeg', 0.85);
      
      window._pendingInstructorAvatar = compressedData;
      
      const previewImg = document.getElementById('inst-avatar-preview');
      if (previewImg) {
        previewImg.src = compressedData;
        previewImg.classList.remove('hidden');
      }
      const previewPlaceholder = document.getElementById('inst-avatar-placeholder');
      if (previewPlaceholder) previewPlaceholder.classList.add('hidden');
      
      window.App?.showToast('✓ تصویر کامیابی سے لوڈ ہو گئی!', 'success');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.Views.admin.openAddInstructorModal = function(editInstId = null) {
  const users = window.DB.get('users') || [];
  const inst = editInstId ? users.find(u => u.id === editInstId) : null;
  window._pendingInstructorAvatar = inst ? inst.avatar : null;

  const modalHtml = `
    <div class="space-y-4 font-urdu text-right select-none" dir="rtl">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
          ${inst ? 'استاد کی معلومات و تصویر میں ترمیم' : 'نیا استاذ شامل کریں (موبائل/گیلری سے تصویر کے ساتھ)'}
        </h3>
        <p class="text-xs text-slate-500">استاد کا نام، تدریسی عنوان، فون، تعارف اور براہ راست تصویر اپلوڈ کریں۔</p>
      </div>

      <!-- Instructor Avatar Upload Studio (Camera / Gallery / File Picker) -->
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-center">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">استاد کی پروفائل تصویر (موبائل گیلری یا کمپیوٹر سے اپلوڈ کریں):</label>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <img 
              id="inst-avatar-preview" 
              src="${inst?.avatar || ''}" 
              class="${inst?.avatar ? '' : 'hidden'} w-full h-full object-cover"
            />
            <div id="inst-avatar-placeholder" class="${inst?.avatar ? 'hidden' : ''} text-slate-400 text-xs font-bold">
              📷 بغیر تصویر
            </div>
          </div>

          <div class="space-y-2">
            <input 
              type="file" 
              id="inst-file-input" 
              accept="image/*" 
              onchange="window.Views.admin.handleInstructorAvatarUpload(this)"
              class="hidden"
            />
            <label 
              for="inst-file-input" 
              class="btn-primary py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow"
            >
              <i data-lucide="upload" class="w-4 h-4"></i>
              <span>موبائل/کمپیوٹر سے تصویر منتخب کریں</span>
            </label>
            <span class="text-[10px] text-slate-400 block">JPG, PNG, WebP سپورٹڈ ہے</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">استاد کا پورا نام:</label>
          <input type="text" id="add-inst-name" value="${inst ? inst.name : ''}" placeholder="مثلاً: مولانا عبد الرشید" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس:</label>
          <input type="email" id="add-inst-email" value="${inst ? inst.email : ''}" placeholder="instructor@learnhub.com" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-left" dir="ltr" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تدریسی عنوان / منصب:</label>
          <input type="text" id="add-inst-title" value="${inst ? (inst.headline || '') : 'استاذ علومِ اسلامیہ و حدیث'}" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">رابطہ نمبر / واٹس ایپ:</label>
          <input type="text" id="add-inst-phone" value="${inst ? (inst.phone || '') : '+91 '}" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-left" dir="ltr" />
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تعارف و سوانح (Bio):</label>
        <textarea id="add-inst-bio" rows="3" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-urdu leading-relaxed">${inst ? (inst.bio || '') : 'مستند سلفی جامعات سے فارغ التحصیل اور تدریس کا طویل تجربہ۔'}</textarea>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
        <button onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 rounded-xl text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveInstructorModal('${editInstId || ''}')" class="btn-primary py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
          ${inst ? 'تبدیلیاں محفوظ کریں ✓' : 'استاد کو رجسٹر کریں ✓'}
        </button>
      </div>
    </div>
  `;

  window.App.showModal(inst ? 'استاد کی ترمیم' : 'نیا استاد شامل کریں', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveInstructorModal = function(editInstId) {
  const name = document.getElementById('add-inst-name')?.value?.trim();
  const email = document.getElementById('add-inst-email')?.value?.trim();
  const title = document.getElementById('add-inst-title')?.value?.trim();
  const phone = document.getElementById('add-inst-phone')?.value?.trim();
  const bio = document.getElementById('add-inst-bio')?.value?.trim();
  const avatar = window._pendingInstructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

  if (!name || !email) {
    window.App?.showToast('برائے کرم نام اور ای میل لازمی درج کریں۔', 'warning');
    return;
  }

  const users = window.DB.get('users') || [];
  if (editInstId) {
    const inst = users.find(u => u.id === editInstId);
    if (inst) {
      inst.name = name;
      inst.email = email;
      inst.headline = title;
      inst.phone = phone;
      inst.bio = bio;
      inst.avatar = avatar;
    }
  } else {
    const newInst = {
      id: `usr-inst-${Date.now()}`,
      name,
      email,
      role: 'instructor',
      status: 'active',
      headline: title || 'استاذ و محقق',
      phone: phone || '',
      bio: bio || 'مستند دینی علوم اور تدریس کا تجربہ۔',
      avatar: avatar
    };
    users.push(newInst);
  }

  window.DB.set('users', users);
  window.App.closeModal();
  window.App.showToast(editInstId ? 'استاد کی معلومات کامیابی سے اپڈیٹ ہو گئیں!' : 'نیا استاد تصویر سمیت کامیابی سے رجسٹر کر دیا گیا!', 'success');
  window.Views.admin.renderInstructors();
};


window.Views.admin.openTransferCourseModal = function(instId) {
  const courses = window.DB.get('courses') || [];
  const instructors = (window.DB.get('users') || []).filter(u => u.role === 'instructor');

  if (courses.length === 0) {
    window.App.showToast('منتقل کرنے کے لیے کوئی کورس موجود نہیں ہے۔', 'warning');
    return;
  }

  const courseTitle = prompt(`منتقل کرنے کے لیے کورس کا عنوان درج کریں:\nموجودہ کورسز: ${courses.map(c => c.title).join(', ')}`);
  if (!courseTitle) return;

  const course = courses.find(c => c.title.includes(courseTitle.trim()));
  if (!course) {
    window.App.showToast('کورس نہیں ملا۔', 'danger');
    return;
  }

  const targetInstName = prompt(`کس استاد کو تفویض کرنا چاہتے ہیں؟\nاساتذہ: ${instructors.map(i => i.name).join(', ')}`);
  if (!targetInstName) return;

  const targetInst = instructors.find(i => i.name.includes(targetInstName.trim()));
  if (!targetInst) {
    window.App.showToast('مطلوبہ استاد نہیں ملے۔', 'danger');
    return;
  }

  course.instructor = targetInst.name;
  course.instructorId = targetInst.id;
  window.DB.set('courses', courses);

  window.App.showToast(`کورس '${course.title}' کامیابی سے استاذ ${targetInst.name} کو تفویض کر دیا گیا ہے۔`, 'success');
  window.Views.admin.renderInstructors();
};
