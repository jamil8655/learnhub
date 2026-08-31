/**
 * LearnHub Student Study Notebook & Scientific Diary Module (v179.0.0)
 * Clean Trilingual Edition: English (Default), Urdu, Arabic
 */

window.Views = window.Views || {};

window.Views.renderStudyNotes = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');

  const L = {
    badge: isRtl ? (currentLang === 'ur' ? 'طالب علم کی علمی ڈائری و ذاتی نوٹس' : 'دفتر الطالب والملاحظات العلمية') : 'Student Study Notebook & Private Journal',
    title: isRtl ? (currentLang === 'ur' ? 'میری علمی یادداشتیں اور نوٹس' : 'مذكراتي وملاحظاتي العلمية') : 'My Learning Notes & Journal',
    sub: isRtl ? (currentLang === 'ur' ? 'قرآن فہمی، دروسِ حدیث، کلاسز اور کتب کے مطالعے کے دوران اہم نکات اپنے پاس محفوظ کریں اور پی ڈی ایف میں ڈاؤنلوڈ کریں۔' : 'تدوين الفوائد والفرائد من تلاوة القرآن ودروس الحديث والكتب العلمية') : 'Save important insights and study notes from Quran recitation, Hadith lessons, and Islamic courses.',
    addBtn: isRtl ? (currentLang === 'ur' ? '+ نیا نوٹ لکھیں' : '+ إضافة ملاحظة جديدة') : '+ Add New Note',
    searchPh: isRtl ? (currentLang === 'ur' ? 'نوٹس میں تلاش کریں...' : 'البحث في الملاحظات...') : 'Search your notes...',
    totalNotes: isRtl ? (currentLang === 'ur' ? 'کل محفوظ نوٹس:' : 'إجمالي الملاحظات:') : 'Total Saved Notes:',
    noNotes: isRtl ? (currentLang === 'ur' ? 'کوئی نوٹ محفوظ نہیں ہے۔' : 'لا توجد ملاحظات محفوظة حالياً.') : 'No notes saved yet. Click "+ Add New Note" to write your first reflection!',
    deleteBtn: isRtl ? 'حذف' : 'Delete',
    exportPdf: isRtl ? 'پی ڈی ایف' : 'Export PDF'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Banner -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-xs">
            <span>${L.badge}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-arabic">${L.title}</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ${L.sub}
          </p>

          <div class="pt-2">
            <button 
              onclick="window.Views.openAddNoteModal()"
              class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs inline-flex items-center gap-2 transition cursor-pointer"
            >
              <span>${L.addBtn}</span>
            </button>
          </div>
        </div>

        <!-- Search Bar & Total Counter -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div class="relative w-full sm:w-80">
            <input 
              type="text" 
              id="notes-search-input"
              oninput="window.Views.filterNotesLive(this.value)"
              placeholder="${L.searchPh}" 
              class="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
            >
          </div>

          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold">
            ${L.totalNotes} <strong class="text-teal-700 dark:text-teal-400 font-mono text-sm">${notes.length}</strong>
          </span>
        </div>

        <!-- Notes Grid -->
        <div id="notes-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${notes.length === 0 ? `
            <div class="col-span-full text-center py-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-400 text-xs font-bold">
              ${L.noNotes}
            </div>
          ` : notes.map((n, idx) => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
                    ${n.category || 'General'}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">${n.date || '2026'}</span>
                </div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">${n.title}</h3>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">${n.content}</p>
              </div>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button onclick="window.Views.deleteNote(${idx})" class="text-rose-600 hover:text-rose-700 font-bold cursor-pointer">
                  ${L.deleteBtn}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.openAddNoteModal = function() {
  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  
  const modalHtml = `
    <div id="add-note-modal" class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">
            ${currentLang === 'ur' ? 'نیا علمی نوٹ تحریر کریں' : 'Write Study Note'}
          </h3>
          <button onclick="document.getElementById('add-note-modal').remove()" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input type="text" id="note-inp-title" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold" placeholder="e.g. Benefits from Surah Al-Kahf" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select id="note-inp-category" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <option value="Quran">Quran</option>
              <option value="Hadith">Hadith</option>
              <option value="Aqeedah">Aqeedah</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Course">Course</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Content</label>
            <textarea id="note-inp-content" rows="5" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium" placeholder="Write your notes here..."></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button onclick="document.getElementById('add-note-modal').remove()" class="btn-secondary py-2 px-4 rounded-xl text-xs font-bold">Cancel</button>
          <button onclick="window.Views.saveNewNote()" class="py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold">Save Note</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.Views.saveNewNote = function() {
  const title = document.getElementById('note-inp-title')?.value.trim();
  const category = document.getElementById('note-inp-category')?.value;
  const content = document.getElementById('note-inp-content')?.value.trim();

  if (!title || !content) {
    window.App?.showToast('Please fill in title and content', 'warning');
    return;
  }

  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  notes.unshift({
    id: 'note_' + Date.now(),
    title,
    category,
    content,
    date: new Date().toISOString().split('T')[0]
  });

  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  document.getElementById('add-note-modal')?.remove();
  window.App?.showToast('Note saved successfully!', 'success');
  window.Views.renderStudyNotes();
};

window.Views.deleteNote = function(idx) {
  if (!confirm('Delete this note?')) return;
  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  notes.splice(idx, 1);
  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  window.Views.renderStudyNotes();
};
