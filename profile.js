/**
 * LearnHub User Profile & Account Settings Views
 */

window.Views = window.Views || {};

window.Views.renderProfile = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  const enrollments = await window.API.getEnrollments(user.id);
  const certificates = window.DB.get('certificates').filter(c => c.userId === user.id);
  const userAch = window.DB.get('userAchievements').filter(ua => ua.userId === user.id);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Profile Header Card -->
      <div class="lh-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div class="relative">
            <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-100 dark:border-indigo-900 shadow-xl">
            <button onclick="window.Views.openAvatarModal()" class="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg" title="Change Avatar">
              <i data-lucide="camera" class="w-4 h-4"></i>
            </button>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">${user.name}</h1>
              <span class="badge badge-primary uppercase text-[10px]">${user.role}</span>
            </div>
            <p class="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold">${user.headline || 'LearnHub Member'}</p>
            <p class="text-xs text-slate-500 max-w-lg leading-relaxed">${user.bio || 'Lifelong learner on LearnHub.'}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span>Member since ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span class="font-bold text-amber-500 flex items-center gap-1"><i data-lucide="zap" class="w-3.5 h-3.5"></i> ${user.totalPoints || 0} XP</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onclick="window.Views.openEditProfileModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Profile
          </button>
          <button onclick="window.Views.openSecurityModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i> Security
          </button>
        </div>
      </div>

      <!-- Tabs & Stats Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Stats -->
        <div class="space-y-6">
          <div class="lh-card p-6 space-y-4">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Learning Metrics</h3>
            <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div class="py-2.5 flex justify-between">
                <span class="text-slate-500">Enrolled Courses</span>
                <span class="font-bold text-slate-900 dark:text-white">${enrollments.length}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-slate-500">Completed Courses</span>
                <span class="font-bold text-emerald-600">${enrollments.filter(e => e.status === 'completed').length}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-slate-500">Certificates Earned</span>
                <span class="font-bold text-indigo-600">${certificates.length}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-slate-500">Badges Unlocked</span>
                <span class="font-bold text-amber-500">${userAch.length}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Enrolled Courses & Badges -->
        <div class="lg:col-span-2 space-y-6">
          <div class="lh-card p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 class="font-bold text-base text-slate-900 dark:text-white">My Learning Journey</h3>
              <a href="#/courses" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Explore More &rarr;</a>
            </div>

            <div class="space-y-4">
              ${enrollments.map(enr => `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <img src="${enr.course?.thumbnail}" class="w-12 h-12 rounded-xl object-cover">
                    <div>
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${enr.course?.title}</h4>
                      <div class="text-xs text-slate-400 mt-0.5">${enr.progressPercentage}% Completed</div>
                    </div>
                  </div>
                  <a href="#/learn/${enr.courseId}/${enr.lastViewedLessonId || ''}" class="btn-primary py-1.5 px-3 text-xs rounded-lg whitespace-nowrap self-end sm:self-auto">
                    ${enr.progressPercentage === 100 ? 'Review Masterclass' : 'Continue'}
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Views.openEditProfileModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  window.App.showModal('Edit Profile', `
    <form onsubmit="window.Views.saveProfile(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
        <input type="text" id="prof-name" value="${user.name}" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Professional Headline</label>
        <input type="text" id="prof-headline" value="${user.headline || ''}" placeholder="e.g. Senior Frontend Engineer" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bio / About Me</label>
        <textarea id="prof-bio" rows="3" class="form-input text-xs">${user.bio || ''}</textarea>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Avatar Image URL</label>
        <input type="url" id="prof-avatar" value="${user.avatar}" required class="form-input text-xs">
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs">Save Changes</button>
    </form>
  `);
};

window.Views.saveProfile = async function(e) {
  e.preventDefault();
  const name = document.getElementById('prof-name').value;
  const headline = document.getElementById('prof-headline').value;
  const bio = document.getElementById('prof-bio').value;
  const avatar = document.getElementById('prof-avatar').value;

  await window.Auth.updateProfile({ name, headline, bio, avatar });
  window.App.closeModal();
  window.App.showToast('Profile updated successfully!', 'success');
  window.Router.handleRouting();
};

window.Views.openSecurityModal = function() {
  window.App.showModal('Account Security & Password', `
    <form onsubmit="window.Views.saveSecurityPassword(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
        <input type="password" id="sec-current-pwd" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">New Password</label>
        <input type="password" id="sec-new-pwd" minlength="6" required class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm New Password</label>
        <input type="password" id="sec-confirm-pwd" minlength="6" required class="form-input text-xs">
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs">Update Password</button>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button type="button" onclick="window.Views.confirmDeactivateAccount()" class="text-xs text-rose-600 hover:underline">Deactivate Account</button>
      </div>
    </form>
  `);
};

window.Views.saveSecurityPassword = async function(e) {
  e.preventDefault();
  const cur = document.getElementById('sec-current-pwd').value;
  const nw = document.getElementById('sec-new-pwd').value;
  const conf = document.getElementById('sec-confirm-pwd').value;

  if (nw !== conf) {
    window.App.showToast('New passwords do not match.', 'danger');
    return;
  }

  try {
    await window.Auth.changePassword(cur, nw);
    window.App.closeModal();
    window.App.showToast('Password changed successfully!', 'success');
  } catch (err) {
    window.App.showToast(err.message || 'Error updating password', 'danger');
  }
};

window.Views.confirmDeactivateAccount = function() {
  if (confirm('Are you sure you want to deactivate your LearnHub account? You will lose access to all active enrollments.')) {
    const user = window.Auth.getCurrentUser();
    window.DB.update('users', user.id, { status: 'suspended' });
    window.Auth.logout();
    window.App.closeModal();
    window.App.showToast('Account deactivated.', 'info');
    window.Router.navigate('/');
  }
};
