/**
 * LearnHub Admin User Management & RBAC Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderUsers = async function() {
  const container = document.getElementById('main-content');
  const users = window.DB.get('users');
  const enrollments = window.DB.get('enrollments');
  const certificates = window.DB.get('certificates');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">User Directory & RBAC</h1>
          <p class="text-xs text-slate-500">Manage user accounts, assign roles, inspect activity, and configure permissions.</p>
        </div>
        <button onclick="window.Views.admin.openAddUserModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl">
          <i data-lucide="user-plus" class="w-4 h-4"></i> Add User
        </button>
      </div>

      <!-- Users Table -->
      <div class="lh-card overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            class="form-input text-xs max-w-xs"
            oninput="window.Views.admin.filterUserTable(this.value)"
          />
          <span class="text-xs text-slate-400">Total Users: <strong>${users.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs" id="admin-users-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Role</th>
                <th class="p-3">Status</th>
                <th class="p-3">Enrollments</th>
                <th class="p-3">Certificates</th>
                <th class="p-3">Joined Date</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${users.map(u => {
                const userEnrs = enrollments.filter(e => e.userId === u.id);
                const userCerts = certificates.filter(c => c.userId === u.id);

                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="p-3">
                      <div class="flex items-center gap-3">
                        <img src="${u.avatar}" class="w-9 h-9 rounded-full object-cover">
                        <div>
                          <div class="font-bold text-slate-900 dark:text-white">${u.name}</div>
                          <div class="text-[11px] text-slate-400">${u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3">
                      <span class="badge ${u.role === 'super_admin' ? 'badge-danger' : u.role === 'admin' ? 'badge-warning' : u.role === 'instructor' ? 'badge-primary' : 'badge-neutral'} text-[10px] uppercase">
                        ${u.role}
                      </span>
                    </td>
                    <td class="p-3">
                      <button onclick="window.Views.admin.toggleUserStatus('${u.id}')" class="badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'} cursor-pointer text-[10px] uppercase">
                        ${u.status}
                      </button>
                    </td>
                    <td class="p-3 font-semibold">${userEnrs.length} courses</td>
                    <td class="p-3 font-bold text-indigo-600">${userCerts.length}</td>
                    <td class="p-3 text-slate-400">${new Date(u.createdAt).toLocaleDateString()}</td>
                    <td class="p-3 text-right space-x-1 whitespace-nowrap">
                      <button onclick="window.Views.admin.openUserHistoryDrawer('${u.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="View Learning History">
                        <i data-lucide="history" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.openEditUserModal('${u.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Edit User">
                        <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.promptAdminResetPassword('${u.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Reset Password">
                        <i data-lucide="key" class="w-3.5 h-3.5 text-amber-500"></i>
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
};

window.Views.admin.filterUserTable = function(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#admin-users-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openAddUserModal = function() {
  window.App.showModal('Create User Account', `
    <form onsubmit="window.Views.admin.saveNewUser(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
        <input type="text" id="usr-name" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
        <input type="email" id="usr-email" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Temporary Password</label>
        <input type="password" id="usr-pwd" minlength="6" required value="learnhub123" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">System Role</label>
        <select id="usr-role" class="form-input text-xs">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Create Account</button>
    </form>
  `);
};

window.Views.admin.saveNewUser = function(e) {
  e.preventDefault();
  const name = document.getElementById('usr-name').value;
  const email = document.getElementById('usr-email').value;
  const password = document.getElementById('usr-pwd').value;
  const role = document.getElementById('usr-role').value;

  try {
    window.Auth.register(name, email, password, role);
    window.App.closeModal();
    window.App.showToast(`User account created for ${name}.`, 'success');
    window.Router.handleRouting();
  } catch (err) {
    window.App.showToast(err.message || 'Error creating user', 'danger');
  }
};

window.Views.admin.openEditUserModal = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  window.App.showModal(`Edit User: ${user.name}`, `
    <form onsubmit="window.Views.admin.saveEditUser(event, '${userId}')" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
        <input type="text" id="edit-usr-name" value="${user.name}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
        <input type="email" id="edit-usr-email" value="${user.email}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">System Role</label>
        <select id="edit-usr-role" class="form-input text-xs">
          <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
          <option value="instructor" ${user.role === 'instructor' ? 'selected' : ''}>Instructor</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
          <option value="super_admin" ${user.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Status</label>
        <select id="edit-usr-status" class="form-input text-xs">
          <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
        </select>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Save User Details</button>
    </form>
  `);
};

window.Views.admin.saveEditUser = function(e, userId) {
  e.preventDefault();
  const name = document.getElementById('edit-usr-name').value;
  const email = document.getElementById('edit-usr-email').value;
  const role = document.getElementById('edit-usr-role').value;
  const status = document.getElementById('edit-usr-status').value;

  window.DB.update('users', userId, { name, email, role, status });
  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'USER_MODIFIED', `${name} (${role})`);
  window.App.closeModal();
  window.App.showToast('User record updated.', 'success');
  window.Router.handleRouting();
};

window.Views.admin.toggleUserStatus = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  window.DB.update('users', userId, { status: newStatus });
  window.App.showToast(`User status changed to ${newStatus}.`, 'info');
  window.Router.handleRouting();
};

window.Views.admin.promptAdminResetPassword = function(userId) {
  const user = window.DB.findById('users', userId);
  if (!user) return;

  const newPwd = prompt(`Enter new password for ${user.name}:`, 'newPassword123');
  if (newPwd && newPwd.trim().length >= 6) {
    window.DB.update('users', userId, { password: newPwd.trim() });
    window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'ADMIN_PASSWORD_RESET', user.email);
    window.App.showToast(`Password for ${user.name} has been reset.`, 'success');
  }
};

window.Views.admin.openUserHistoryDrawer = function(userId) {
  const user = window.DB.findById('users', userId);
  const enrollments = window.DB.get('enrollments').filter(e => e.userId === userId);
  const attempts = window.DB.get('quizAttempts').filter(a => a.userId === userId);
  const certs = window.DB.get('certificates').filter(c => c.userId === userId);

  window.App.showModal(`Learning Telemetry: ${user.name}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Courses</div>
          <div class="text-lg font-bold">${enrollments.length}</div>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Quizzes</div>
          <div class="text-lg font-bold">${attempts.length}</div>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Certificates</div>
          <div class="text-lg font-bold text-indigo-600">${certs.length}</div>
        </div>
      </div>

      <div class="space-y-2">
        <h4 class="font-bold text-xs text-slate-400 uppercase">Enrolled Masterclasses</h4>
        ${enrollments.map(enr => {
          const c = window.DB.findById('courses', enr.courseId);
          return `
            <div class="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center text-xs">
              <span class="font-bold truncate max-w-[200px]">${c ? c.title : 'Course'}</span>
              <span class="text-indigo-600 font-semibold">${enr.progressPercentage}%</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `);
};
