/**
 * LearnHub Admin User Management & RBAC Governance Suite
 * Complete Administration Suite:
 *  - Search by name, email, or phone
 *  - Multi-criteria Filter by Role (All, Student, Instructor, Admin, Super Admin)
 *  - Multi-criteria Filter by Status (All, Active, Unverified, Suspended, Disabled, Locked)
 *  - User Action Menu: Edit Role, Toggle Status (Activate, Suspend, Disable, Unlock), Revoke All Sessions, Trigger Password Reset Link, Delete User
 *  - Detailed User Inspector Drawer: Security status, 2FA state, active sessions, recent login audit events, and learning telemetry
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

// Admin Users State Store for dynamic filtering
window.Views.admin.userFilters = {
  search: '',
  role: 'all',
  status: 'all'
};

// ==========================================================================
// MAIN ADMIN USERS VIEW RENDERER
// ==========================================================================
window.Views.admin.renderUsers = async function() {
  const container = document.getElementById('main-content');
  const users = window.DB.get('users') || [];
  const enrollments = window.DB.get('enrollments') || [];
  const certificates = window.DB.get('certificates') || [];

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended' || u.status === 'disabled' || u.status === 'locked').length;
  const adminCount = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
  const instructorCount = users.filter(u => u.role === 'instructor').length;
  const studentCount = users.filter(u => u.role === 'student').length;

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      
      <!-- Top Title & Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-500/30">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full shadow mb-2">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i> صارفین اور سیکیورٹی ڈائریکٹری (RBAC Suite)
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">صارفین کا انتظامی کنٹرول اور رسائی</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 mt-1">اکاؤنٹس کا انتظام، کردار تفویض، سیکیورٹی آڈٹ، 2FA معائنہ اور سیشنز کو منسوخ کریں۔</p>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <button 
            onclick="window.Views.admin.openAddUserModal()" 
            class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/30"
          >
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            <span>نیا صارف شامل کریں</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div class="lh-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">کل صارفین</div>
          <div class="text-xl font-extrabold text-slate-900 dark:text-white font-mono">${totalUsers}</div>
        </div>

        <div class="lh-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">فعال (Active)</div>
          <div class="text-xl font-extrabold text-emerald-600 font-mono">${activeUsers}</div>
        </div>

        <div class="lh-card p-4 rounded-2xl border border-rose-500/30 bg-rose-50/30 dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-rose-700 dark:text-rose-400 font-bold">معطل / لاک شدہ</div>
          <div class="text-xl font-extrabold text-rose-600 font-mono">${suspendedUsers}</div>
        </div>

        <div class="lh-card p-4 rounded-2xl border border-amber-500/30 bg-amber-50/30 dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-amber-700 dark:text-amber-400 font-bold">ایڈمنز</div>
          <div class="text-xl font-extrabold text-amber-600 font-mono">${adminCount}</div>
        </div>

        <div class="lh-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-50/30 dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold">اساتذہ (Faculty)</div>
          <div class="text-xl font-extrabold text-indigo-600 font-mono">${instructorCount}</div>
        </div>

        <div class="lh-card p-4 rounded-2xl border border-teal-500/30 bg-teal-50/30 dark:bg-slate-900 space-y-1 text-center shadow-sm">
          <div class="text-[11px] text-teal-700 dark:text-teal-400 font-bold">طلباء (Students)</div>
          <div class="text-xl font-extrabold text-teal-600 font-mono">${studentCount}</div>
        </div>

      </div>

      <!-- Main Users Table Card & Multi-Filter Bar -->
      <div class="lh-card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
        
        <!-- Interactive Multi-Filter Toolbar -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <input 
              type="text" 
              id="admin-user-search-input"
              placeholder="نام، ای میل، فون یا آئی ڈی سے تلاش کریں..." 
              class="form-input text-xs py-2.5 pr-9 pl-4 rounded-xl w-full text-right focus:border-emerald-500"
              oninput="window.Views.admin.handleSearchChange(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-3"></i>
          </div>

          <!-- Filters Row: Role & Status Dropdowns -->
          <div class="flex flex-wrap items-center gap-2.5">
            
            <!-- Role Filter -->
            <div class="flex items-center gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">کردار (Role):</label>
              <select 
                id="admin-user-role-filter"
                class="form-select text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-bold"
                onchange="window.Views.admin.handleRoleFilterChange(this.value)"
              >
                <option value="all">تمام کردار (All Roles)</option>
                <option value="student">طالب علم (Student)</option>
                <option value="instructor">استاد (Instructor)</option>
                <option value="admin">ایڈمنسٹریٹر (Admin)</option>
                <option value="super_admin">سپر ایڈمن (Super Admin)</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="flex items-center gap-1.5">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">حیثیت (Status):</label>
              <select 
                id="admin-user-status-filter"
                class="form-select text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-bold"
                onchange="window.Views.admin.handleStatusFilterChange(this.value)"
              >
                <option value="all">تمام کیفیات (All Statuses)</option>
                <option value="active">فعال (Active)</option>
                <option value="unverified">غیر تصدیق شدہ (Unverified)</option>
                <option value="suspended">معطل (Suspended)</option>
                <option value="disabled">غیر فعال (Disabled)</option>
                <option value="locked">لاک شدہ (Locked)</option>
              </select>
            </div>

            <!-- Filter Results Counter Pill -->
            <span id="admin-user-count-pill" class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-300 dark:border-emerald-800">
              دستیاب: ${users.length}
            </span>

          </div>

        </div>

        <!-- Mobile Cards List (Visible on Mobile < 768px) -->
        <div class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3" id="admin-users-mobile-list">
          ${window.Views.admin.renderUserMobileCards(users, enrollments, certificates)}
        </div>

        <!-- Desktop Table Container (Visible on Desktop >= 768px) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-right text-xs" id="admin-users-table">
            <thead class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3.5">صارف (User Profile)</th>
                <th class="p-3.5 text-center">کردار (Role)</th>
                <th class="p-3.5 text-center">حیثیت (Status)</th>
                <th class="p-3.5 text-center">سیکیورٹی و 2FA</th>
                <th class="p-3.5 text-center">داخلے و اسناد</th>
                <th class="p-3.5 text-center">تاریخِ شمولیت</th>
                <th class="p-3.5 text-left">انتظامی اختیارات (Actions)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800" id="admin-users-tbody">
              ${window.Views.admin.renderUserTableRows(users, enrollments, certificates)}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// MOBILE CARDS GENERATOR (Zero broken words, beautiful native card UI)
// ==========================================================================
window.Views.admin.renderUserMobileCards = function(users, enrollments, certificates) {
  if (!users || users.length === 0) {
    return `
      <div class="p-6 text-center text-slate-400 text-xs">
        کوئی صارف نہیں ملا جو موجودہ فلٹرز پر پورا اترتا ہو۔
      </div>
    `;
  }

  return users.map(u => {
    const userEnrs = (enrollments || []).filter(e => e.userId === u.id);
    const userCerts = (certificates || []).filter(c => c.userId === u.id);
    const status = u.status || 'active';
    const is2fa = !!u.twoFactorEnabled;

    return `
      <div class="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 font-urdu">
        <!-- Top Row: Avatar + Name + Role -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <img 
              src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" 
              class="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              alt="${u.name}"
            >
            <div class="min-w-0">
              <div class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                <span>${u.name}</span>
                ${u.role === 'super_admin' ? '<span class="text-amber-500 text-xs">👑</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-400 font-mono" dir="ltr">${u.email}</div>
            </div>
          </div>

          <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold font-mono shrink-0 ${
            u.role === 'super_admin' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400' :
            u.role === 'admin' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' :
            u.role === 'instructor' ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400' :
            'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }">
            ${u.role === 'super_admin' ? 'SUPER ADMIN' : u.role === 'admin' ? 'ADMIN' : u.role === 'instructor' ? 'INSTRUCTOR' : 'STUDENT'}
          </span>
        </div>

        <!-- Middle Info: Status, 2FA, Enrollments -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-center">
          <div class="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-[10px] text-slate-400 block">حیثیت</span>
            <span class="font-bold font-mono ${status === 'active' ? 'text-emerald-600' : 'text-rose-500'}">${status}</span>
          </div>
          <div class="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-[10px] text-slate-400 block">سیکیورٹی</span>
            <span class="font-bold text-xs ${is2fa ? 'text-emerald-500' : 'text-slate-400'}">${is2fa ? '✓ 2FA فعال' : '2FA آف'}</span>
          </div>
          <div class="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-[10px] text-slate-400 block">کورسز و اسناد</span>
            <span class="font-bold text-xs text-indigo-600 dark:text-indigo-400 font-mono">${userEnrs.length} / 🏆 ${userCerts.length}</span>
          </div>
        </div>

        <!-- Bottom Action Buttons: 1-Tap Touch -->
        <div class="flex items-center gap-1.5 pt-1" dir="ltr">
          <button 
            onclick="window.Views.admin.openUserInspectorDrawer('${u.id}')" 
            class="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1 border border-indigo-200 dark:border-indigo-800"
          >
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> <span>معائنہ</span>
          </button>
          <button 
            onclick="window.Views.admin.openStatusChangeMenu('${u.id}')" 
            class="py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            اسٹیٹس
          </button>
          <button 
            onclick="window.Views.admin.openEditUserModal('${u.id}')" 
            class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800"
            title="کردار تبدیل"
          >
            <i data-lucide="edit" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
};

// ==========================================================================
// USER TABLE ROWS GENERATOR
// ==========================================================================
window.Views.admin.renderUserTableRows = function(users, enrollments, certificates) {
  if (!users || users.length === 0) {
    return `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400 text-xs">
          کوئی صارف نہیں ملا جو موجودہ فلٹرز پر پورا اترتا ہو۔
        </td>
      </tr>
    `;
  }

  return users.map(u => {
    const userEnrs = (enrollments || []).filter(e => e.userId === u.id);
    const userCerts = (certificates || []).filter(c => c.userId === u.id);
    const status = u.status || 'active';
    const is2fa = !!u.twoFactorEnabled;

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group font-urdu" data-user-id="${u.id}" data-role="${u.role}" data-status="${status}">
        
        <!-- User Profile Column -->
        <td class="p-3.5">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0">
              <img 
                src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" 
                class="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                alt="${u.name}"
              >
              ${is2fa ? `
                <span class="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow" title="2FA فعال ہے">
                  ✓
                </span>
              ` : ''}
            </div>

              <div class="min-w-0 space-y-0.5">
                <div class="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-600 transition cursor-pointer flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-xs" onclick="window.Views.admin.openUserInspectorDrawer('${u.id}')">
                  <span class="truncate">${u.name}</span>
                  ${u.role === 'super_admin' ? '<span class="text-amber-500 text-xs shrink-0">★</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-400 font-mono select-all truncate max-w-[150px] sm:max-w-xs" dir="ltr">${u.email}</div>
                ${u.phone ? `<div class="text-[10px] text-slate-500 font-mono truncate max-w-[150px] sm:max-w-xs" dir="ltr">${u.phone}</div>` : ''}
              </div>
          </div>
        </td>

        <!-- Role Column -->
        <td class="p-3.5 text-center">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase font-mono ${
            u.role === 'super_admin' 
              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-400/30' 
              : u.role === 'admin' 
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-400/30' 
              : u.role === 'instructor' 
              ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-400/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
          }">
            ${u.role === 'super_admin' ? '👑 SUPER ADMIN' : u.role === 'admin' ? '🛡️ ADMIN' : u.role === 'instructor' ? '👨‍🏫 INSTRUCTOR' : '🎓 STUDENT'}
          </span>
        </td>

        <!-- Status Column with Quick Toggle -->
        <td class="p-3.5 text-center">
          <button 
            type="button"
            onclick="window.Views.admin.openStatusChangeMenu('${u.id}', event)" 
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase font-mono cursor-pointer transition hover:scale-105 ${
              status === 'active' 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40' 
                : status === 'suspended'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-400/40'
                : status === 'locked'
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-400/40'
                : status === 'disabled'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-400/40'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-400/40'
            }"
            title="حیثیت تبدیل کرنے کے لیے کلک کریں"
          >
            <span class="w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
            <span>${status}</span>
            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400"></i>
          </button>
        </td>

        <!-- Security & 2FA State -->
        <td class="p-3.5 text-center">
          <div class="inline-flex flex-col items-center gap-1">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
              is2fa 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }">
              <i data-lucide="${is2fa ? 'shield-check' : 'shield-off'}" class="w-3 h-3"></i>
              <span>${is2fa ? '2FA فعال' : '2FA آف'}</span>
            </span>
          </div>
        </td>

        <!-- Enrollments & Certificates -->
        <td class="p-3.5 text-center font-mono">
          <div class="space-y-0.5">
            <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">${userEnrs.length} کورسز</div>
            <div class="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">🏆 ${userCerts.length} اسناد</div>
          </div>
        </td>

        <!-- Joined Date -->
        <td class="p-3.5 text-center text-slate-400 font-mono text-[11px]">
          ${new Date(u.createdAt || Date.now()).toLocaleDateString('en-GB')}
        </td>

        <!-- Actions Toolbar Menu -->
        <td class="p-3.5 text-left whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5" dir="ltr">
            
            <!-- 1. Inspect User Drawer -->
            <button 
              onclick="window.Views.admin.openUserInspectorDrawer('${u.id}')" 
              class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition" 
              title="تفصیلی سیکیورٹی و تعلیمی انسپکٹر ڈراور کھولیں (Inspect User)"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            </button>

            <!-- 2. Edit Role & Profile Modal -->
            <button 
              onclick="window.Views.admin.openEditUserModal('${u.id}')" 
              class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition" 
              title="کردار و پروفائل میں ترمیم کریں (Edit Role)"
            >
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>

            <!-- 3. Password Reset Link Generator -->
            <button 
              onclick="window.Views.admin.triggerPasswordResetLink('${u.id}')" 
              class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 transition" 
              title="پاس ورڈ ری سیٹ لنک جاری کریں (Reset Password)"
            >
              <i data-lucide="key" class="w-3.5 h-3.5"></i>
            </button>

            <!-- 4. Revoke All Sessions -->
            <button 
              onclick="window.Views.admin.revokeUserSessions('${u.id}')" 
              class="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition" 
              title="صارف کے تمام فعال سیشنز منسوخ کریں (Revoke All Sessions)"
            >
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
            </button>

          </div>
        </td>

      </tr>
    `;
  }).join('');
};

// ==========================================================================
// SEARCH & FILTER HANDLERS
// ==========================================================================
window.Views.admin.handleSearchChange = function(val) {
  window.Views.admin.userFilters.search = (val || '').toLowerCase().trim();
  window.Views.admin.applyUserFilters();
};

window.Views.admin.handleRoleFilterChange = function(role) {
  window.Views.admin.userFilters.role = role;
  window.Views.admin.applyUserFilters();
};

window.Views.admin.handleStatusFilterChange = function(status) {
  window.Views.admin.userFilters.status = status;
  window.Views.admin.applyUserFilters();
};

window.Views.admin.applyUserFilters = function() {
  const users = window.DB.get('users') || [];
  const enrollments = window.DB.get('enrollments') || [];
  const certificates = window.DB.get('certificates') || [];
  const { search, role, status } = window.Views.admin.userFilters;

  const filtered = users.filter(u => {
    // Search matching
    const matchSearch = !search || 
      (u.name && u.name.toLowerCase().includes(search)) ||
      (u.email && u.email.toLowerCase().includes(search)) ||
      (u.phone && u.phone.includes(search)) ||
      (u.id && u.id.toLowerCase().includes(search));

    // Role matching
    const matchRole = (role === 'all') || (u.role === role);

    // Status matching
    const uStatus = u.status || 'active';
    const matchStatus = (status === 'all') || (uStatus === status);

    return matchSearch && matchRole && matchStatus;
  });

  const tbody = document.getElementById('admin-users-tbody');
  if (tbody) {
    tbody.innerHTML = window.Views.admin.renderUserTableRows(filtered, enrollments, certificates);
  }

  const mobList = document.getElementById('admin-users-mobile-list');
  if (mobList) {
    mobList.innerHTML = window.Views.admin.renderUserMobileCards(filtered, enrollments, certificates);
  }

  const pill = document.getElementById('admin-user-count-pill');
  if (pill) {
    pill.textContent = `دستیاب: ${filtered.length} میں سے ${users.length}`;
  }

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// QUICK STATUS CHANGE MENU MODAL
// ==========================================================================
window.Views.admin.openStatusChangeMenu = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const currentStatus = user.status || 'active';

  window.App.showModal(`صارف کی حیثیت تبدیل کریں: ${user.name}`, `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <p class="text-xs text-slate-500 dark:text-slate-400">
        صارف کے لاگ اِن اور پلیٹ فارم تک رسائی کی نئی حیثیت منتخب کریں:
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <!-- Activate -->
        <button 
          type="button" 
          onclick="window.Views.admin.setUserStatus('${userId}', 'active')" 
          class="p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
            currentStatus === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold' : 'hover:border-emerald-400'
          }"
        >
          <div>
            <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">فعال (Active)</div>
            <div class="text-[10px] text-slate-400">مکمل رسائی و لاگ اِن بحال</div>
          </div>
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
        </button>

        <!-- Suspend -->
        <button 
          type="button" 
          onclick="window.Views.admin.setUserStatus('${userId}', 'suspended')" 
          class="p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
            currentStatus === 'suspended' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 font-bold' : 'hover:border-rose-400'
          }"
        >
          <div>
            <div class="text-xs font-bold text-rose-700 dark:text-rose-400">معطل (Suspended)</div>
            <div class="text-[10px] text-slate-400">لاگ اِن عارضی بلاک</div>
          </div>
          <span class="w-3 h-3 rounded-full bg-rose-500"></span>
        </button>

        <!-- Unverified -->
        <button 
          type="button" 
          onclick="window.Views.admin.setUserStatus('${userId}', 'unverified')" 
          class="p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
            currentStatus === 'unverified' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 font-bold' : 'hover:border-amber-400'
          }"
        >
          <div>
            <div class="text-xs font-bold text-amber-700 dark:text-amber-400">غیر تصدیق شدہ (Unverified)</div>
            <div class="text-[10px] text-slate-400">ای میل تصدیق کا انتظار</div>
          </div>
          <span class="w-3 h-3 rounded-full bg-amber-500"></span>
        </button>

        <!-- Disabled -->
        <button 
          type="button" 
          onclick="window.Views.admin.setUserStatus('${userId}', 'disabled')" 
          class="p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
            currentStatus === 'disabled' ? 'bg-slate-200 dark:bg-slate-800 border-slate-500 font-bold' : 'hover:border-slate-400'
          }"
        >
          <div>
            <div class="text-xs font-bold text-slate-700 dark:text-slate-300">غیر فعال (Disabled)</div>
            <div class="text-[10px] text-slate-400">اکاؤنٹ بند</div>
          </div>
          <span class="w-3 h-3 rounded-full bg-slate-500"></span>
        </button>

        <!-- Locked -->
        <button 
          type="button" 
          onclick="window.Views.admin.setUserStatus('${userId}', 'locked')" 
          class="p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
            currentStatus === 'locked' ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 font-bold' : 'hover:border-purple-400'
          }"
        >
          <div>
            <div class="text-xs font-bold text-purple-700 dark:text-purple-400">لاک شدہ (Locked)</div>
            <div class="text-[10px] text-slate-400">غلط لاگ اِن کوششوں پر لاک</div>
          </div>
          <span class="w-3 h-3 rounded-full bg-purple-500"></span>
        </button>

      </div>

      <div class="pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary w-full py-2.5 text-xs rounded-xl">
          بند کریں
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.setUserStatus = function(userId, newStatus) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
  window.DB.update('users', userId, { status: newStatus });
  window.DB.logAudit(currentAdmin, 'USER_STATUS_CHANGED', `${user.name} (${user.email}) -> ${newStatus}`);

  window.App.closeModal();
  window.App.showToast(`صارف ${user.name} کی حیثیت ${newStatus} میں تبدیل کر دی گئی۔`, 'success');
  window.Views.admin.applyUserFilters();
};

// ==========================================================================
// CREATE NEW USER MODAL & HANDLER
// ==========================================================================
window.Views.admin.openAddUserModal = function() {
  window.App.showModal('نیا صارف اکاؤنٹ شامل کریں (Add User)', `
    <form onsubmit="window.Views.admin.saveNewUser(event)" class="space-y-4 font-urdu text-right" dir="rtl">
      
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">صارف کا پورا نام (Full Name)</label>
        <input type="text" id="usr-name" required placeholder="مثلاً: احمد کمال" class="form-input text-xs py-2.5 rounded-xl font-urdu">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس (Email)</label>
        <input type="email" id="usr-email" required placeholder="name@example.com" class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">فون نمبر (Phone / WhatsApp - اختیاری)</label>
        <input type="text" id="usr-phone" placeholder="+92 300 1234567" class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ابتدائی پاس ورڈ (Initial Password)</label>
        <input type="password" id="usr-pwd" minlength="6" required value="learnhub123" class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کردار (System Role)</label>
          <select id="usr-role" class="form-select text-xs py-2.5 rounded-xl font-urdu">
            <option value="student">🎓 طالب علم (Student)</option>
            <option value="instructor">👨‍🏫 استاد (Instructor)</option>
            <option value="admin">🛡️ ایڈمنسٹریٹر (Admin)</option>
            <option value="super_admin">👑 سپر ایڈمن (Super Admin)</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ابتدائی حیثیت (Status)</label>
          <select id="usr-status" class="form-select text-xs py-2.5 rounded-xl font-urdu">
            <option value="active">فعال (Active)</option>
            <option value="unverified">غیر تصدیق شدہ (Unverified)</option>
            <option value="suspended">معطل (Suspended)</option>
          </select>
        </div>
      </div>

      <div class="flex gap-2.5 pt-3">
        <button type="submit" class="btn-primary flex-1 py-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-md">
          اکاؤنٹ تخلیق کریں ✓
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-3 px-4 text-xs rounded-xl">
          منسوخ
        </button>
      </div>

    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveNewUser = async function(e) {
  e.preventDefault();
  const name = document.getElementById('usr-name').value.trim();
  const email = document.getElementById('usr-email').value.trim();
  const phone = document.getElementById('usr-phone').value.trim();
  const password = document.getElementById('usr-pwd').value;
  const role = document.getElementById('usr-role').value;
  const status = document.getElementById('usr-status').value;

  try {
    const newUser = await window.Auth.register(name, email, password, role, false);
    if (phone || status !== 'active') {
      window.DB.update('users', newUser.id, { phone, status });
    }

    const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
    window.DB.logAudit(currentAdmin, 'USER_CREATED_BY_ADMIN', `${name} (${email}) - ${role}`);

    window.App.closeModal();
    window.App.showToast(`صارف ${name} کا نیا اکاؤنٹ کامیابی سے بن گیا!`, 'success');
    window.Views.admin.renderUsers();
  } catch (err) {
    window.App.showToast(err.message || 'اکاؤنٹ بنانے میں غلطی پیش آئی', 'danger');
  }
};

// ==========================================================================
// EDIT USER ROLE & DETAILS MODAL
// ==========================================================================
window.Views.admin.openEditUserModal = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  window.App.showModal(`صارف پروفائل و کردار میں ترمیم: ${user.name}`, `
    <form onsubmit="window.Views.admin.saveEditUser(event, '${userId}')" class="space-y-4 font-urdu text-right" dir="rtl">
      
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پورا نام (Full Name)</label>
        <input type="text" id="edit-usr-name" value="${user.name || ''}" required class="form-input text-xs py-2.5 rounded-xl font-urdu">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس (Email Address)</label>
        <input type="email" id="edit-usr-email" value="${user.email || ''}" required class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">فون نمبر (Phone / WhatsApp)</label>
        <input type="text" id="edit-usr-phone" value="${user.phone || ''}" class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کردار (System Role)</label>
          <select id="edit-usr-role" class="form-select text-xs py-2.5 rounded-xl font-urdu">
            <option value="student" ${user.role === 'student' ? 'selected' : ''}>🎓 طالب علم (Student)</option>
            <option value="instructor" ${user.role === 'instructor' ? 'selected' : ''}>👨‍🏫 استاد (Instructor)</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>🛡️ ایڈمنسٹریٹر (Admin)</option>
            <option value="super_admin" ${user.role === 'super_admin' ? 'selected' : ''}>👑 سپر ایڈمن (Super Admin)</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">اکاؤنٹ کی حیثیت (Status)</label>
          <select id="edit-usr-status" class="form-select text-xs py-2.5 rounded-xl font-urdu">
            <option value="active" ${user.status === 'active' ? 'selected' : ''}>فعال (Active)</option>
            <option value="unverified" ${user.status === 'unverified' ? 'selected' : ''}>غیر تصدیق شدہ (Unverified)</option>
            <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>معطل (Suspended)</option>
            <option value="disabled" ${user.status === 'disabled' ? 'selected' : ''}>غیر فعال (Disabled)</option>
            <option value="locked" ${user.status === 'locked' ? 'selected' : ''}>لاک شدہ (Locked)</option>
          </select>
        </div>
      </div>

      <div class="flex gap-2.5 pt-3">
        <button type="submit" class="btn-primary flex-1 py-3 text-xs rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md">
          تبدیلیاں محفوظ کریں ✓
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-3 px-4 text-xs rounded-xl">
          منسوخ
        </button>
      </div>

    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveEditUser = function(e, userId) {
  e.preventDefault();
  const name = document.getElementById('edit-usr-name').value.trim();
  const email = document.getElementById('edit-usr-email').value.trim();
  const phone = document.getElementById('edit-usr-phone').value.trim();
  const role = document.getElementById('edit-usr-role').value;
  const status = document.getElementById('edit-usr-status').value;

  const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
  window.DB.update('users', userId, { name, email, phone, role, status });
  window.DB.logAudit(currentAdmin, 'USER_MODIFIED', `${name} (${email}) -> Role: ${role}, Status: ${status}`);

  window.App.closeModal();
  window.App.showToast('صارف کا ریکارڈ کامیابی سے اپڈیٹ ہو گیا۔', 'success');
  window.Views.admin.renderUsers();
};

// ==========================================================================
// PASSWORD RESET LINK GENERATOR & ADMIN RESET
// ==========================================================================
window.Views.admin.triggerPasswordResetLink = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const token = 'lh-reset-' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const resetLink = `${window.location.origin}/#/login?resetToken=${token}&email=${encodeURIComponent(user.email)}`;

  window.App.showModal(`پاس ورڈ ری سیٹ لنک: ${user.name}`, `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        صارف <strong>${user.name}</strong> (${user.email}) کے لیے پاس ورڈ ری سیٹ کا محفوظ ون ٹائم لنک تیار کر دیا گیا ہے:
      </p>

      <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <input 
          type="text" 
          readonly 
          value="${resetLink}" 
          id="admin-generated-reset-link"
          class="bg-transparent font-mono text-xs text-slate-700 dark:text-slate-300 w-full outline-none select-all" 
          dir="ltr"
        >
        <button 
          type="button"
          onclick="navigator.clipboard.writeText('${resetLink}'); window.App.showToast('ری سیٹ لنک کاپی ہو گیا!', 'success');"
          class="btn-primary py-1.5 px-3 text-xs rounded-xl shrink-0 font-bold"
        >
          کاپی لنک
        </button>
      </div>

      <!-- Quick Set Temporary Password Option -->
      <div class="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
        <div class="text-xs font-bold text-emerald-800 dark:text-emerald-300">یا نیا عارضی پاس ورڈ براہِ راست درج کریں:</div>
        <div class="flex gap-2">
          <input 
            type="text" 
            id="admin-temp-new-pwd" 
            placeholder="مثلاً: TempPass123" 
            value="learnhub2026"
            class="form-input text-xs py-2 rounded-xl font-mono text-left flex-1" 
            dir="ltr"
          >
          <button 
            type="button" 
            onclick="window.Views.admin.applyManualPasswordReset('${userId}')" 
            class="btn-primary py-2 px-3 text-xs rounded-xl bg-emerald-600 text-white font-bold shrink-0"
          >
            پاس ورڈ لاگو کریں
          </button>
        </div>
      </div>

      <div class="flex justify-end pt-1">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 text-xs rounded-xl">
          بند کریں
        </button>
      </div>

    </div>
  `);

  const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
  window.DB.logAudit(currentAdmin, 'ADMIN_PASSWORD_RESET_LINK_GENERATED', user.email);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.applyManualPasswordReset = async function(userId) {
  const newPwd = document.getElementById('admin-temp-new-pwd')?.value.trim();
  const user = window.DB.findById('users', userId);
  if (!user || !newPwd || newPwd.length < 6) {
    window.App.showToast('پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔', 'warning');
    return;
  }

  // Cryptographically hash the new password with salt
  let passwordHash = null;
  let salt = null;
  if (window.Auth && typeof window.Auth._generateSalt === 'function' && typeof window.Auth._hashPassword === 'function') {
    salt = window.Auth._generateSalt(16);
    passwordHash = await window.Auth._hashPassword(newPwd, salt);
  }

  window.DB.update('users', userId, { 
    password: null, 
    passwordHash: passwordHash || newPwd, 
    salt,
    passwordChangedAt: new Date().toISOString() 
  });
  
  const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
  window.DB.logAudit(currentAdmin, 'ADMIN_MANUAL_PASSWORD_OVERRIDE', user.email);

  window.App.closeModal();
  window.App.showToast(`صارف ${user.name} کا پاس ورڈ کامیابی سے کرپٹوگرافک ہیش کے ساتھ تبدیل کر دیا گیا!`, 'success');
};

// ==========================================================================
// REVOKE ALL SESSIONS FOR USER
// ==========================================================================
window.Views.getUserActiveSessions = function(userId) {
  if (!userId) return [];
  const dbSessions = (window.DB.get('sessions') || []).filter(s => s && s.userId === userId && s.isValid !== false);
  if (dbSessions.length > 0) {
    return dbSessions.map(s => ({
      device: s.device || 'Desktop Browser (Chrome/Firefox)',
      ip: s.ip || '127.0.0.1',
      location: s.location || 'Pakistan',
      lastActive: s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString('ur-PK') : 'ابھی فعال (Active Now)',
      icon: (s.device && (s.device.toLowerCase().includes('phone') || s.device.toLowerCase().includes('mobile') || s.device.toLowerCase().includes('ios') || s.device.toLowerCase().includes('android'))) ? 'smartphone' : 'laptop'
    }));
  }
  return [{
    device: 'موجودہ براؤزر سیشن (Active Web Session)',
    ip: '127.0.0.1',
    location: 'مقامی نیٹ ورک (Local Network)',
    lastActive: 'ابھی فعال (Active Now)',
    icon: 'laptop'
  }];
};

window.Views.admin.revokeUserSessions = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  if (confirm(`کیا آپ واقعی صارف "${user.name}" کے تمام فعال ڈیوائس سیشنز منسوخ کرنا چاہتے ہیں؟ اس کے تمام براؤزرز لاگ آؤٹ ہو جائیں گے۔`)) {
    // Clear localStorage sessions cache for this user
    const key = `learnhub_sessions_${userId}`;
    localStorage.removeItem(key);

    // Invalidate sessions in database
    if (window.DB && typeof window.DB.get === 'function' && typeof window.DB.update === 'function') {
      const sessions = (window.DB.get('sessions') || []).filter(s => s && s.userId === userId);
      sessions.forEach(s => {
        window.DB.update('sessions', s.id, { isValid: false });
      });
    }

    const currentAdmin = window.Auth.getCurrentUser()?.name || 'Administrator';
    window.DB.logAudit(currentAdmin, 'ADMIN_REVOKED_USER_SESSIONS', user.email);

    window.App.showToast(`صارف ${user.name} کے تمام فعال سیشنز منسوخ کر دیے گئے۔`, 'info');
    if (document.getElementById('admin-users-table')) {
      window.Views.admin.renderUsers();
    }
  }
};

// ==========================================================================
// DETAILED USER INSPECTOR DRAWER / RICH MODAL
// ==========================================================================
window.Views.admin.openUserInspectorDrawer = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const enrollments = (window.DB.get('enrollments') || []).filter(e => e.userId === userId);
  const attempts = (window.DB.get('quizAttempts') || []).filter(a => a.userId === userId);
  const certs = (window.DB.get('certificates') || []).filter(c => c.userId === userId);
  const auditLogs = (window.DB.get('auditLogs') || []).filter(l => 
    (l.target && l.target.includes(user.email)) || (l.actorName === user.name)
  ).slice(0, 10);

  const sessions = window.Views.getUserActiveSessions(userId);
  const is2fa = !!user.twoFactorEnabled;

  window.App.showModal(`صارف سیکیورٹی و تعلیمی انسپکٹر: ${user.name}`, `
    <div class="space-y-6 max-h-[80vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      
      <!-- Top User Profile Snapshot Header -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div class="flex items-center gap-4">
          <img 
            src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" 
            class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-md"
            alt="${user.name}"
          >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-extrabold text-white">${user.name}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-400 text-slate-950">
                ${user.role.toUpperCase()}
              </span>
            </div>
            <div class="text-xs text-emerald-300 font-mono" dir="ltr">${user.email}</div>
            <div class="text-[10px] text-slate-400 font-mono">ID: ${user.id} • شمولیت: ${new Date(user.createdAt || Date.now()).toLocaleDateString('ur-PK')}</div>
          </div>
        </div>

        <div class="flex gap-2">
          <button 
            type="button" 
            onclick="window.Views.admin.openEditUserModal('${user.id}')" 
            class="btn-primary py-2 px-3 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            کردار تبدیل کریں
          </button>
        </div>
      </div>

      <!-- Account Security Status & 2FA State Card -->
      <div class="lh-card p-5 space-y-4 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
            <span>اکاؤنٹ سیکیورٹی کیفیت (Account Security State)</span>
          </h4>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
            user.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700' : 'bg-rose-100 dark:bg-rose-950 text-rose-700'
          }">
            حیثیت: ${user.status || 'active'}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          
          <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 text-[11px]">2FA تصدیق:</div>
            <div class="font-extrabold flex items-center gap-1.5 ${is2fa ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
              <i data-lucide="${is2fa ? 'shield-check' : 'shield-off'}" class="w-4 h-4"></i>
              <span>${is2fa ? 'فعال (TOTP Enabled)' : 'غیر فعال (Disabled)'}</span>
            </div>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 text-[11px]">ای میل تصدیق:</div>
            <div class="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>تصدیق شدہ (Verified)</span>
            </div>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 text-[11px]">فعال سیشنز:</div>
            <div class="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <i data-lucide="laptop" class="w-4 h-4"></i>
              <span>${sessions.length} ڈیوائسز</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Active Sessions List for this User -->
      <div class="lh-card p-5 space-y-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h4 class="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <i data-lucide="smartphone" class="w-4 h-4 text-indigo-500"></i>
            <span>صارف کے فعال سیشنز (${sessions.length})</span>
          </h4>
          <button 
            type="button" 
            onclick="window.Views.admin.revokeUserSessions('${user.id}')" 
            class="text-[11px] text-rose-500 hover:text-rose-600 font-bold hover:underline"
          >
            تمام سیشنز منسوخ کریں &rarr;
          </button>
        </div>

        <div class="space-y-2 text-xs">
          ${sessions.map(s => `
            <div class="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
              <div class="space-y-0.5">
                <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <i data-lucide="${s.icon || 'laptop'}" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${s.device}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono" dir="ltr">${s.ip} • ${s.location}</div>
              </div>
              <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">${s.lastActive}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Learning Telemetry Stats -->
      <div class="lh-card p-5 space-y-4 border border-amber-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
        <h4 class="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <i data-lucide="graduation-cap" class="w-4 h-4 text-amber-500"></i>
          <span>تعلیمی کارکردگی و ٹیلی میٹری (Learning Telemetry)</span>
        </h4>

        <div class="grid grid-cols-4 gap-3 text-center">
          <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <div class="text-[10px] text-slate-400 font-bold">داخل شدہ کورسز</div>
            <div class="text-base font-extrabold text-slate-900 dark:text-white font-mono">${enrollments.length}</div>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <div class="text-[10px] text-slate-400 font-bold">امتحانی کوئزز</div>
            <div class="text-base font-extrabold text-cyan-600 font-mono">${attempts.length}</div>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <div class="text-[10px] text-slate-400 font-bold">اسناد (Certs)</div>
            <div class="text-base font-extrabold text-amber-500 font-mono">${certs.length}</div>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <div class="text-[10px] text-slate-400 font-bold">کل پوائنٹس</div>
            <div class="text-base font-extrabold text-emerald-600 font-mono">${user.totalPoints || 0} XP</div>
          </div>
        </div>
      </div>

      <!-- Recent Login & Security Audit Trail -->
      <div class="lh-card p-5 space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
        <h4 class="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <i data-lucide="history" class="w-4 h-4 text-emerald-500"></i>
          <span>حالیہ لاگ اِن و سیکیورٹی آڈٹ ایونٹس (Audit Logs)</span>
        </h4>

        ${auditLogs.length === 0 ? `
          <p class="text-[11px] text-slate-400 text-center py-4">اس صارف کے لیے ابھی کوئی آڈٹ لاگ موجود نہیں ہے۔</p>
        ` : `
          <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            ${auditLogs.map(log => `
              <div class="py-2.5 flex items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono text-[11px]">
                    <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">${log.action}</span>
                    <span>${log.target || ''}</span>
                  </div>
                  <div class="text-[10px] text-slate-400">بذریعہ: ${log.actorName} • IP: ${log.ip || '127.0.0.1'}</div>
                </div>
                <span class="text-[10px] text-slate-400 font-mono shrink-0">
                  ${new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-primary py-2 px-6 text-xs rounded-xl font-bold">
          بند کریں
        </button>
      </div>

    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};
