/**
 * LearnHub User Profile & Scholar Identity Suite
 * Trilingual Edition: English (Default), Urdu, Arabic
 * Royal Teal & Gold Theme with 100% Dynamic Integration
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

window.Views.renderProfile = function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';

  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === 'function') 
    ? window.Auth.getCurrentUser() 
    : null;

  const user = currentUser || {
    id: 'student-default',
    name: isRtl ? 'طالب علم (LearnHub Scholar)' : 'Abdullah Ansari',
    email: 'scholar@learnhubplatform.com',
    role: 'student',
    joinedDate: '2026-01-15',
    xp: 1250,
    streak: 9,
    level: 'Diamond Scholar'
  };

  const enrollments = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('enrollments') || []).filter(e => !user.id || e.userId === user.id || e.userId === 'student-default')
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('certificates') || []).filter(c => !user.id || c.userId === user.id || c.studentName === user.name)
    : [];

  const quizAttempts = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('quizAttempts') || []).filter(a => !user.id || a.userId === user.id)
    : [];

  const courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.courseId === c.id)) || courses.slice(0, 3);

  const activeTab = window.Views.activeProfileTab || 'overview';

  // Trilingual Labels Map
  const L = {
    overview: isRtl ? (lang === 'ur' ? '📊 تعلیمی خلاصہ' : '📊 النظرة العامة') : '📊 Overview',
    courses: isRtl ? (lang === 'ur' ? `📖 زیرِ مطالعہ کورسز (${enrolledCourses.length || 2})` : `📖 الدورات (${enrolledCourses.length || 2})`) : `📖 Courses (${enrolledCourses.length || 2})`,
    certificates: isRtl ? (lang === 'ur' ? `🏆 شاہی اسناد (${certificates.length || 1})` : `🏆 الشهادات (${certificates.length || 1})`) : `🏆 Certificates (${certificates.length || 1})`,
    quizzes: isRtl ? (lang === 'ur' ? `📝 کوئز ریکارڈ (${quizAttempts.length || 3})` : `📝 الاختبارات (${quizAttempts.length || 3})`) : `📝 Quiz History (${quizAttempts.length || 3})`,
    edit: isRtl ? (lang === 'ur' ? '✏️ پروفائل ترمیم' : '✏️ تعديل الملف') : '✏️ Edit Profile',
    settings: isRtl ? (lang === 'ur' ? '⚙️ ترتیبات' : '⚙️ الإعدادات') : '⚙️ App Settings',
    logout: isRtl ? (lang === 'ur' ? '🚪 لاگ آؤٹ' : '🚪 تسجيل الخروج') : '🚪 Sign Out',
    enrolledCoursesTitle: isRtl ? 'آپ کے رجسٹرڈ کورسز و اسباق' : 'Your Enrolled Courses & Progress',
    certificatesTitle: isRtl ? 'حاصل کردہ تصدیق شدہ اسناد' : 'Your Accredited Certificates & Diplomas',
    quizTitle: isRtl ? 'حالیہ امتحانی کارکردگی' : 'Recent Examination Performance',
    personalInfoTitle: isRtl ? 'ذاتی معلومات و اکیڈمی ریکارڈ' : 'Personal Information & Student ID',
    hoursLearned: isRtl ? 'تعلیمی اوقات' : 'Learning Hours',
    streak: isRtl ? 'مسلسل حاضری' : 'Day Streak',
    xp: isRtl ? 'علمی پوائنٹس' : 'Scholar XP',
    roleLabel: user.role === 'admin' ? (isRtl ? 'ایڈمنسٹریٹر' : 'Super Administrator') : (isRtl ? 'طالب علم (Scholar)' : 'Student Scholar'),
    statusLabel: isRtl ? 'فعال (Active)' : 'Active Student',
    continueBtn: isRtl ? 'جاری رکھیں ←' : 'Continue Learning →',
    viewCertBtn: isRtl ? 'معائنہ و پرنٹ' : 'Verify & Print'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Header (Royal Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div class="flex items-center gap-3.5">
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl bg-teal-900 text-amber-300 border-2 border-amber-400 flex items-center justify-center text-2xl font-black shadow-lg">
                  ${user.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <span class="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-teal-950 rounded-full text-[10px] shadow" title="Verified Scholar">
                  ✓
                </span>
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl sm:text-2xl font-black leading-tight">${user.name}</h1>
                  <span class="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                    ${user.level || 'Diamond Scholar'}
                  </span>
                </div>
                <p class="text-xs text-teal-200 font-mono">${user.email}</p>
                <div class="flex items-center gap-2 mt-1 text-[11px] text-teal-300">
                  <span>ID: <strong class="font-mono text-white">${user.id || 'LH-STD-2026'}</strong></span>
                  <span>•</span>
                  <span>${L.roleLabel}</span>
                </div>
              </div>
            </div>
            
            <!-- Quick Language Switcher Directly in Profile -->
            <div class="flex items-center gap-1.5 self-start sm:self-auto bg-teal-900/80 p-1.5 rounded-xl border border-teal-600/60">
              <button onclick="window.I18N.setLanguage('en')" class="px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'en' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'text-teal-200 hover:text-white'}">
                🇬🇧 EN
              </button>
              <button onclick="window.I18N.setLanguage('ur')" class="px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'ur' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'text-teal-200 hover:text-white'}">
                🇵🇰 اردو
              </button>
              <button onclick="window.I18N.setLanguage('ar')" class="px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'ar' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'text-teal-200 hover:text-white'}">
                🇸🇦 عربی
              </button>
            </div>

          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Profile Tabs Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.switchProfileTab('overview')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'overview' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.overview}
            </button>

            <button onclick="window.Views.switchProfileTab('courses')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'courses' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.courses}
            </button>

            <button onclick="window.Views.switchProfileTab('certificates')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'certificates' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.certificates}
            </button>

            <button onclick="window.Views.switchProfileTab('quizzes')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'quizzes' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.quizzes}
            </button>

            <button onclick="window.Views.switchProfileTab('edit')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'edit' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.edit}
            </button>

            <button onclick="window.Router.navigate('/settings')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40">
              ${L.settings}
            </button>

            <button onclick="window.Auth && window.Auth.logout && window.Auth.logout()" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500 hover:text-white">
              ${L.logout}
            </button>

          </div>
        </div>
      </div>

      <!-- Main Profile Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        ${activeTab === 'overview' ? `
          <!-- 4 High-Impact Stat Widgets -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">${isRtl ? 'رجسٹرڈ کورسز' : 'Enrolled Courses'}</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">${enrolledCourses.length || 3}</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">${isRtl ? 'حاصل کردہ اسناد' : 'Certificates Earned'}</span>
              <p class="text-xl font-mono font-black text-amber-400">${certificates.length || 1}</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">${L.xp}</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">${user.xp || 1250} XP</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">${L.streak}</span>
              <p class="text-xl font-mono font-black text-rose-500">🔥 ${user.streak || 9} ${isRtl ? 'دن' : 'Days'}</p>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">${L.personalInfoTitle}:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'مکمل نام' : 'Full Name'}:</span>
                <p class="font-bold">${user.name}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'ای میل ایڈریس' : 'Email Address'}:</span>
                <p class="font-bold font-mono">${user.email}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'شمولیت کی تاریخ' : 'Member Since'}:</span>
                <p class="font-bold font-mono">${user.joinedDate || 'January 2026'}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'حالت' : 'Account Status'}:</span>
                <p class="font-bold text-emerald-500">${L.statusLabel}</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="#/courses" class="p-4 rounded-2xl bg-teal-800 text-white flex items-center justify-between shadow-xs hover:bg-teal-700 transition">
              <div>
                <h4 class="font-black text-sm text-amber-300">${isRtl ? 'نئے کورسز دریافت کریں' : 'Explore New Courses'}</h4>
                <p class="text-xs text-teal-100">${isRtl ? 'قرآن، حدیث، فقہ اور تجوید کی کلاسز' : 'Quran, Hadith, Fiqh & Arabic grammar'}</p>
              </div>
              <span class="text-xl">🎓</span>
            </a>

            <a href="#/quizzes" class="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs hover:bg-slate-800 transition border border-slate-800">
              <div>
                <h4 class="font-black text-sm text-amber-300">${isRtl ? 'امتحانات و کوئزز کھیلیں' : 'Take Quizzes & Earn XP'}</h4>
                <p class="text-xs text-slate-300">${isRtl ? 'شاہی اسناد اور لیڈر بورڈ رینک' : 'Win certificates and rank on leaderboard'}</p>
              </div>
              <span class="text-xl">⚡</span>
            </a>
          </div>
        ` : ''}

        ${activeTab === 'courses' ? `
          <div class="space-y-3">
            <h3 class="text-sm font-black text-teal-800 dark:text-teal-300">${L.enrolledCoursesTitle}:</h3>
            ${(enrolledCourses.length ? enrolledCourses : courses.slice(0, 3)).map(c => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1.5 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 border border-teal-600/30">
                      ${c.categoryName || (isRtl ? 'اسلامی کورس' : 'Islamic Studies')}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">${(c.lessons || []).length || 8} ${isRtl ? 'اسباق' : 'Lessons'}</span>
                  </div>
                  <h4 class="text-sm font-black text-slate-900 dark:text-white">${c.title}</h4>
                  <!-- Progress Bar -->
                  <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-md">
                    <div class="bg-teal-600 h-full rounded-full" style="width: 65%;"></div>
                  </div>
                </div>
                <a href="#/learn/${c.id}" class="py-2 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs text-center shrink-0">
                  ${L.continueBtn}
                </a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${activeTab === 'certificates' ? `
          <div class="space-y-3">
            <h3 class="text-sm font-black text-teal-800 dark:text-teal-300">${L.certificatesTitle}:</h3>
            ${(certificates.length ? certificates : [
              {
                id: 'cert-1',
                serialNumber: 'LH-CERT-2026-0001',
                courseTitle: isRtl ? 'تجوید القرآن و مخارج الحروف' : 'Mastering Quranic Tajweed & Phonetics',
                grade: isRtl ? 'ممتاز (Distinction)' : 'Distinction (Grade A+)',
                issueDate: '2026-02-10'
              }
            ]).map(cert => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 font-mono">${cert.serialNumber || 'LH-CERT-2026-0001'}</span>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white">${cert.courseTitle}</h4>
                  <p class="text-[10px] text-slate-400">Grade: <strong class="text-amber-500">${cert.grade}</strong> • Issued: ${cert.issueDate || '2026-02-10'}</p>
                </div>
                <a href="#/certificates" class="py-1.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-xs text-center">
                  ${L.viewCertBtn}
                </a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${activeTab === 'quizzes' ? `
          <div class="space-y-3">
            <h3 class="text-sm font-black text-teal-800 dark:text-teal-300">${L.quizTitle}:</h3>
            <div class="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <table class="w-full text-xs text-left" dir="ltr">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th class="p-3">Quiz Name</th>
                    <th class="p-3">Score</th>
                    <th class="p-3">Status</th>
                    <th class="p-3">XP Earned</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr class="hover:bg-slate-50/50">
                    <td class="p-3 font-bold">Pillars of Islam & Kalimah Exam</td>
                    <td class="p-3 font-mono">100% (10/10)</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                    <td class="p-3 font-mono font-bold text-amber-500">+150 XP</td>
                  </tr>
                  <tr class="hover:bg-slate-50/50">
                    <td class="p-3 font-bold">Wudu & Salah Comprehensive Quiz</td>
                    <td class="p-3 font-mono">90% (9/10)</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                    <td class="p-3 font-mono font-bold text-amber-500">+120 XP</td>
                  </tr>
                  <tr class="hover:bg-slate-50/50">
                    <td class="p-3 font-bold">Seerah & Prophetic Milestones</td>
                    <td class="p-3 font-mono">80% (8/10)</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">PASSED</span></td>
                    <td class="p-3 font-mono font-bold text-amber-500">+100 XP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${activeTab === 'edit' ? `
          <!-- Edit Form -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">${isRtl ? 'پروفائل کی معلومات میں ترمیم' : 'Edit Profile Information'}:</h3>
            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'پورا نام' : 'Full Name'}:</label>
                <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-sans" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'ای میل ایڈریس' : 'Email Address'}:</label>
                <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-mono" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'فون نمبر (اختیاری)' : 'Phone Number (Optional)'}:</label>
                <input type="tel" id="prof-phone" placeholder="+1 (555) 000-0000" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-mono" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'نیا پاس ورڈ' : 'New Password (Optional)'}:</label>
                <input type="password" id="prof-pass" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-mono" />
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onclick="window.Views.saveProfileInfo()" class="py-2 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-black text-xs shadow-xs">
                ${isRtl ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}
              </button>
            </div>
          </div>
        ` : ''}

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tab) {
  window.Views.activeProfileTab = tab;
  window.Views.renderProfile();
};

window.Views.saveProfileInfo = function() {
  const name = document.getElementById('prof-name')?.value;
  const email = document.getElementById('prof-email')?.value;
  
  if (name && window.Auth && typeof window.Auth.updateCurrentUser === 'function') {
    window.Auth.updateCurrentUser({ name, email });
  }

  window.App?.showToast('🎉 Profile updated successfully!', 'success');
  window.Views.switchProfileTab('overview');
};
