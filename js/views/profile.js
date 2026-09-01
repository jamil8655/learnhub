/**
 * LearnHub Clean User Profile Suite (v225.0.0)
 * Modern, Mobile-First Profile Management with Dual User Categories:
 * 1. Student Scholar (Enrolled in >= 1 Course) with Official Student ID
 * 2. Public Member / Learner (0 Courses) with Invitation to Enroll
 * Fully backed by Firebase Storage & Firestore /users/{uid} Persistence.
 */

window.Views = window.Views || {};

window.Views.renderProfile = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const cleanUid = String(user.uid || user.id || '').trim();
  const cleanEmail = String(user.email || '').toLowerCase().trim();

  // Dynamic Live Joining Date
  let joinedDate = '2026';
  try {
    const rawDate = user.createdAt || user.joinedDate || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.metadata && firebase.auth().currentUser.metadata.creationTime);
    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        joinedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }
  } catch (e) {}

  const allEnrollments = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('enrollments') || []) : [];
  const userEnrollments = allEnrollments.filter(e => e && (e.userId === cleanUid || e.userId === user.id));
  const isEnrolled = userEnrollments.length > 0;

  // Student ID is issued only when enrolled
  const studentId = isEnrolled ? (user.studentId || ('LH-STD-2026-' + (cleanUid.replace(/[^0-9]/g, '').slice(-4) || '8841'))) : null;

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c && (c.userId === cleanUid || c.userId === user.id))
    : [];

  const favorites = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('favorites') || []).filter(f => f && (f.userId === cleanUid || f.userId === user.id))
    : [];

  const isAdmin = window.Auth.isAdmin();
  const isInstructor = user.role === 'instructor' || user.role === 'teacher';

  // Determine User Category & Badge
  let categoryBadge = {
    title: 'Public Learner / Member',
    sub: 'General Registered Member',
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: 'user'
  };

  if (isAdmin) {
    categoryBadge = {
      title: 'Administrator',
      sub: 'System Governance & Academic Dean',
      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: 'shield-check'
    };
  } else if (isInstructor) {
    categoryBadge = {
      title: 'Faculty Instructor',
      sub: 'Verified Islamic Scholar & Teacher',
      bg: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800',
      icon: 'award'
    };
  } else if (isEnrolled) {
    categoryBadge = {
      title: 'Student Scholar',
      sub: `Enrolled Student • ID: ${studentId}`,
      bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: 'graduation-cap'
    };
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-3xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Profile Identity & Status Card -->
        <div class="p-5 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs space-y-6">
          
          <!-- Avatar + Identity Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              
              <!-- Avatar with Upload Overlay -->
              <div class="relative group cursor-pointer shrink-0" onclick="document.getElementById('profile-avatar-upload-input').click()" title="Change Profile Photo">
                ${user.avatar ? `
                  <img src="${user.avatar}" id="profile-avatar-preview" class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-teal-600 dark:border-teal-500 shadow-md" alt="${user.name}">
                ` : `
                  <div id="profile-avatar-fallback" class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-800 text-amber-300 border-2 border-teal-600 flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md">
                    ${(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                `}
                <div class="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-bold p-1 text-center">
                  <i data-lucide="camera" class="w-5 h-5 mb-0.5"></i>
                  <span>Upload Photo</span>
                </div>
              </div>

              <!-- Hidden File Input -->
              <input type="file" id="profile-avatar-upload-input" accept="image/*" class="hidden" onchange="window.Views.handleProfileAvatarUpload(this)" />

              <div class="space-y-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate" id="profile-name-heading">
                    ${user.name}
                  </h1>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadge.bg}">
                    <i data-lucide="${categoryBadge.icon}" class="w-3 h-3"></i>
                    <span>${categoryBadge.title}</span>
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">${user.email}</p>
                
                ${studentId ? `
                  <div class="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 pt-0.5 flex items-center gap-1.5">
                    <span>Student Enrollment ID:</span>
                    <span class="bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">${studentId}</span>
                  </div>
                ` : `
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Official Student ID will be generated upon course enrollment.
                  </div>
                `}
              </div>
            </div>

            <!-- Upload Photo Button -->
            <div class="shrink-0 flex items-center sm:items-end">
              <button onclick="document.getElementById('profile-avatar-upload-input').click()" class="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 border border-teal-600/30 font-bold text-xs transition shadow-xs cursor-pointer">
                <i data-lucide="upload" class="w-4 h-4"></i>
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          <!-- Quick Learning Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <a href="#/my-courses" class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-teal-500/40 transition block text-center">
              <div class="text-base sm:text-lg font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</div>
              <div class="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">Enrolled Courses</div>
            </a>
            <a href="#/certificates" class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-amber-500/40 transition block text-center">
              <div class="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400">${certificates.length}</div>
              <div class="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">Earned Degrees</div>
            </a>
            <a href="#/favorites" class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-rose-500/40 transition block text-center">
              <div class="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400">${favorites.length}</div>
              <div class="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">Saved Favorites</div>
            </a>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
              <div class="text-xs sm:text-xs font-bold font-mono text-slate-700 dark:text-slate-300 truncate mt-1">${joinedDate}</div>
              <div class="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">Member Since</div>
            </div>
          </div>

          ${!isEnrolled && !isAdmin ? `
            <!-- Banner inviting public member to enroll -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="p-2 rounded-xl bg-teal-600 text-white shrink-0">
                  <i data-lucide="sparkles" class="w-5 h-5"></i>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-teal-900 dark:text-teal-200">Start Your Certified Learning Journey</h4>
                  <p class="text-[11px] text-teal-700 dark:text-teal-400">Enroll in masterclasses to receive your official Student ID and verified certificates.</p>
                </div>
              </div>
              <a href="#/courses" class="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs shrink-0 transition">
                <span>Browse Courses</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          ` : ''}

        </div>

        <!-- Edit Profile Details Card -->
        <div class="p-5 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20">
                <i data-lucide="user-check" class="w-4 h-4"></i>
              </span>
              <h2 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Personal Profile & Contact Information
              </h2>
            </div>
            <span class="text-[11px] text-teal-700 dark:text-teal-400 font-bold">Cloud Synced</span>
          </div>

          <form id="profile-edit-form" onsubmit="window.Views.saveProfileChanges(event)" class="space-y-4 text-xs font-medium">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  id="profile-input-name" 
                  value="${user.name || ''}" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <!-- Email (Google Auth, Read-Only) -->
              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Email Address (Google Identity)</label>
                <input 
                  type="email" 
                  value="${user.email || ''}" 
                  disabled
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <!-- Phone Number -->
              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp</label>
                <input 
                  type="text" 
                  id="profile-input-phone" 
                  value="${user.phone || ''}" 
                  placeholder="+91 / +92 300 1234567"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>

              <!-- Country -->
              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Country / Region</label>
                <input 
                  type="text" 
                  id="profile-input-country" 
                  value="${user.country || 'India'}" 
                  placeholder="e.g. India, Pakistan, Saudi Arabia"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            <!-- Bio / Learning Goals -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Personal Bio & Islamic Learning Goals</label>
              <textarea 
                id="profile-input-bio" 
                rows="3"
                placeholder="Share your Islamic learning goals, interests, or qualifications..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs"
              >${user.bio || user.headline || ''}</textarea>
            </div>

            <!-- Save Action Button -->
            <div class="pt-2 flex items-center justify-end gap-3">
              <button 
                type="submit" 
                id="profile-save-btn"
                class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Save Profile Changes</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Handle Profile Avatar Upload directly to Firebase Storage + Firestore
 */
window.Views.handleProfileAvatarUpload = async function(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;

  const cleanUid = String(user.uid || user.id || '').trim();

  // 1. Instant local preview
  const reader = new FileReader();
  reader.onload = async function(e) {
    const dataUrl = e.target.result;
    const imgEl = document.getElementById('profile-avatar-preview');
    if (imgEl) imgEl.src = dataUrl;

    // Update in-memory auth state
    user.avatar = dataUrl;
    user.photoURL = dataUrl;
    if (window.Auth && typeof window.Auth.setSession === 'function') {
      window.Auth.setSession(user, true);
    }
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }

    if (window.App) window.App.showToast('Profile photo updated.', 'success');

    // 2. Authoritative Firebase Storage Upload
    if (typeof firebase !== 'undefined' && firebase.storage && cleanUid) {
      try {
        const storageRef = firebase.storage().ref(`users/${cleanUid}/profile/avatar.jpg`);
        const snapshot = await storageRef.put(file);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        
        // Save downloadUrl to Firestore /users/{uid}
        if (firebase.firestore) {
          await firebase.firestore().collection('users').doc(cleanUid).set({
            avatar: downloadUrl,
            photoURL: downloadUrl,
            updatedAt: firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
          }, { merge: true });
        }
        user.avatar = downloadUrl;
        user.photoURL = downloadUrl;
        if (window.Auth && typeof window.Auth.setSession === 'function') {
          window.Auth.setSession(user, true);
        }
      } catch (uploadErr) {
        console.warn('[Profile] Storage upload note (saved locally):', uploadErr.message);
      }
    }
  };
  reader.readAsDataURL(file);
};

/**
 * Save Profile Changes to Firestore /users/{uid}
 */
window.Views.saveProfileChanges = async function(event) {
  event.preventDefault();
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;

  const cleanUid = String(user.uid || user.id || '').trim();
  const name = document.getElementById('profile-input-name')?.value.trim() || user.name;
  const phone = document.getElementById('profile-input-phone')?.value.trim() || '';
  const country = document.getElementById('profile-input-country')?.value.trim() || 'India';
  const bio = document.getElementById('profile-input-bio')?.value.trim() || '';

  const saveBtn = document.getElementById('profile-save-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Saving...</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  // 1. Update Auth Session
  const updatedUser = {
    ...user,
    name,
    displayName: name,
    phone,
    country,
    bio,
    headline: bio
  };

  if (window.Auth && typeof window.Auth.setSession === 'function') {
    window.Auth.setSession(updatedUser, true);
  }

  // Update DB cache
  if (window.DB && typeof window.DB.get === 'function') {
    const allUsers = window.DB.get('users') || [];
    const idx = allUsers.findIndex(u => u && (u.id === cleanUid || u.uid === cleanUid));
    if (idx !== -1) {
      allUsers[idx] = { ...allUsers[idx], ...updatedUser };
      if (window.DB.hydrateCollection) window.DB.hydrateCollection('users', allUsers);
    }
  }

  // 2. Authoritative Firestore Persistence
  if (typeof firebase !== 'undefined' && firebase.firestore && cleanUid) {
    try {
      await firebase.firestore().collection('users').doc(cleanUid).set({
        name,
        displayName: name,
        phone,
        country,
        bio,
        headline: bio,
        updatedAt: (firebase.firestore.FieldValue && firebase.firestore.FieldValue.serverTimestamp) ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      }, { merge: true });
      console.log('[Profile] Saved profile updates to Firestore users/' + cleanUid);
    } catch (e) {
      console.warn('[Profile] Firestore update note:', e.message);
    }
  }

  if (window.App) {
    window.App.showToast('Profile updated successfully!', 'success');
    window.App.updateNavbarUserUI();
  }

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Save Profile Changes</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  const nameHeading = document.getElementById('profile-name-heading');
  if (nameHeading) nameHeading.textContent = name;
};
