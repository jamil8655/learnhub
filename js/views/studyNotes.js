/**
 * LearnHub Student Study Notebook & Scientific Diary Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderStudyNotes = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Banner -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="book-open-check" class="w-4 h-4 text-teal-600"></i>
            <span>طالب علم کی علمی ڈائری و ذاتی نوٹس (Study Notebook)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">میری علمی یادداشتیں اور نوٹس</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            قرآن فہمی، دروسِ حدیث، کلاسز اور کتب کے مطالعے کے دوران اہم نکات اپنے پاس محفوظ کریں اور پی ڈی ایف میں ڈاؤنلوڈ کریں۔
          </p>

          <div class="pt-2">
            <button 
              onclick="window.Views.openAddNoteModal()"
              class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2 transition active:scale-95"
            >
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>نیا نوٹ لکھیں (Add Note)</span>
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <div class="relative w-full sm:w-80">
            <input 
              type="text" 
              id="notes-search-input"
              oninput="window.Views.filterNotesLive(this.value)"
              placeholder="نوٹس میں تلاش کریں..." 
              class="w-full py-2 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:outline-none focus:border-teal-600"
            >
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-2.5"></i>
          </div>

          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold">
            کل محفوظ نوٹس: <strong class="text-teal-700 dark:text-teal-400 font-mono text-sm">${notes.length}</strong>
          </span>
        </div>

        <!-- Notes Grid -->
        <div id="notes-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${notes.length === 0 ? `
            <div class="col-span-full p-12 text-center text-slate-400 space-y-3 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm">
              <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center text-2xl">
                📝
              </div>
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">ابھی تک کوئی نوٹ درج نہیں کیا گیا</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">اوپر "نیا نوٹ لکھیں" بٹن پر کلک کر کے اپنے اسباق کے نوٹس محفوظ کرنا شروع کریں۔</p>
              <button onclick="window.Views.openAddNoteModal()" class="py-2 px-5 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold inline-flex items-center gap-1.5 shadow-sm">
                <i data-lucide="plus" class="w-4 h-4"></i> پہلا نوٹ بنائیں
              </button>
            </div>
          ` : notes.map(note => window.Views.renderSingleNoteCardHtml(note)).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderSingleNoteCardHtml = function(note) {
  return `
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative group" id="note-card-${note.id}">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
            ${note.categoryName || 'عمومی نوٹ'}
          </span>
          <span class="text-[10px] text-slate-400 font-mono">${note.date}</span>
        </div>

        <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-snug">${note.title}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">${note.content}</p>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
        <button onclick="window.Views.deleteNote('${note.id}')" class="text-rose-500 hover:underline flex items-center gap-1 font-bold text-[11px]">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> حذف کریں
        </button>
        <button onclick="window.Views.openNoteModal('${note.id}')" class="text-teal-700 dark:text-teal-400 hover:underline font-bold text-[11px]">
          مکمل پڑھیں &rarr;
        </button>
      </div>
    </div>
  `;
};

window.Views.openAddNoteModal = function() {
  const modal = document.getElementById('global-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="p-6 sm:p-8 text-center space-y-4 font-urdu text-right" dir="rtl">
      <h3 class="text-lg font-black text-slate-900 dark:text-white">نیا نوٹ درج کریں</h3>
      
      <div class="space-y-3 text-right">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">نوٹ کا عنوان:</label>
          <input type="text" id="note-input-title" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" placeholder="مثلاً: سورۃ البقرہ کی تفسیر کے اہم نکات">
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">قسم / زمرہ:</label>
          <select id="note-input-cat" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
            <option value="quran">قرآن و تفسیر</option>
            <option value="hadith">حدیث و سنت</option>
            <option value="fiqh">فقہ و احکام</option>
            <option value="course">کورس اسباق</option>
            <option value="general">عمومی تحقیق</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">نوٹ کا تفصیلی متن:</label>
          <textarea id="note-input-content" rows="5" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" placeholder="یہاں اہم نکات درج کریں..."></textarea>
        </div>
      </div>

      <div class="flex items-center justify-center gap-3 pt-2">
        <button onclick="window.Views.saveNewNote()" class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm">
          محفوظ کریں
        </button>
        <button onclick="window.App?.closeModal()" class="py-2.5 px-5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold">
          منسوخ کریں
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.Views.saveNewNote = function() {
  const title = document.getElementById('note-input-title')?.value.trim();
  const cat = document.getElementById('note-input-cat')?.value || 'general';
  const content = document.getElementById('note-input-content')?.value.trim();

  if (!title || !content) {
    window.App?.showToast('براہ کرم عنوان اور متن دونوں درج کریں۔', 'warning');
    return;
  }

  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const catNames = { quran: 'قرآن و تفسیر', hadith: 'حدیث و سنت', fiqh: 'فقہ و احکام', course: 'کورس اسباق', general: 'عمومی تحقیق' };

  notes.unshift({
    id: 'note_' + Date.now(),
    title,
    category: cat,
    categoryName: catNames[cat] || 'عمومی نوٹ',
    content,
    date: new Date().toISOString().split('T')[0]
  });

  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  window.App?.closeModal();
  window.App?.showToast('نوٹ کامیابی سے محفوظ ہو گیا! 📝', 'success');
  window.Views.renderStudyNotes();
};

window.Views.deleteNote = function(id) {
  let notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  window.App?.showToast('نوٹ حذف کر دیا گیا۔', 'info');
  window.Views.renderStudyNotes();
};
