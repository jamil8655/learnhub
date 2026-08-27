/**
 * LearnHub Student Study Notebook & Scientific Diary Module
 * Allows students to write, tag, search, organize and export their learning notes
 * across Quran, Hadith, Courses, and Islamic research.
 */

window.Views = window.Views || {};

// Note titles and bodies are written by the student and rendered through
// innerHTML, so every one of them is escaped on the way into the markup.
// Falls back to a local implementation if uiConfig.js has not loaded yet.
const escNote = (v) => (window.escapeHtml
  ? window.escapeHtml(v)
  : String(v === null || v === undefined ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;'));

window.Views.renderStudyNotes = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const isRtl = window.I18N ? window.I18N.isRTL() : true;
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'ur';

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 ${isRtl ? 'font-urdu text-right' : 'text-left'} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Notebook Hero Banner -->
      <div class="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-teal-500/40">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-bold shadow-sm">
              <i data-lucide="book-open-check" class="w-4 h-4 text-amber-400"></i>
              <span>طالب علم کی علمی ڈائری و ذاتی نوٹس (Study Notebook)</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-white">میری علمی یادداشتیں اور نوٹس</h1>
            <p class="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
              قرآن فہمی، دروسِ حدیث، کلاسز اور کتب کے مطالعے کے دوران اہم نکات اپنے پاس محفوظ کریں اور پی ڈی ایف میں ڈاؤنلوڈ کریں۔
            </p>
          </div>

          <button 
            onclick="window.Views.openAddNoteModal()"
            class="btn-primary py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 active:scale-95 transition"
          >
            <i data-lucide="plus-circle" class="w-5 h-5"></i>
            <span>نیا نوٹ لکھیں (Add Note)</span>
          </button>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div class="relative w-full sm:w-96">
          <input 
            type="text" 
            id="notes-search-input"
            oninput="window.Views.filterNotesLive(this.value)"
            placeholder="نوٹس میں تلاش کریں..." 
            class="w-full p-2.5 pr-10 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-3"></i>
        </div>

        <span class="text-xs text-slate-500 dark:text-slate-400 font-bold">
          کل محفوظ نوٹس: <strong class="text-emerald-600 dark:text-emerald-400 font-mono text-sm">${notes.length}</strong>
        </span>
      </div>

      <!-- Notes Grid -->
      <div id="notes-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${notes.length === 0 ? `
          <div class="col-span-full lh-card p-12 text-center text-slate-400 space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 mx-auto flex items-center justify-center text-2xl">
              📝
            </div>
            <h3 class="text-base font-extrabold text-slate-700 dark:text-slate-300">ابھی تک کوئی نوٹ درج نہیں کیا گیا</h3>
            <p class="text-xs text-slate-500 max-w-md mx-auto">اوپر "نیا نوٹ لکھیں" بٹن پر کلک کر کے اپنے قرآنی، حدیثی یا کورس کے اسباق کے نوٹس محفوظ کرنا شروع کریں۔</p>
            <button onclick="window.Views.openAddNoteModal()" class="btn-primary py-2 px-5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow">
              <i data-lucide="plus" class="w-4 h-4"></i> پہلا نوٹ بنائیں
            </button>
          </div>
        ` : notes.map(note => window.Views.renderSingleNoteCardHtml(note)).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderSingleNoteCardHtml = function(note) {
  const tagColors = {
    quran: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    hadith: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    fiqh: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
    course: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300',
    general: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
  };

  return `
    <div class="lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition flex flex-col justify-between space-y-4 relative group" id="note-card-${note.id}">
      <div class="space-y-2.5">
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <span class="badge ${tagColors[note.category] || tagColors.general} text-[10px] font-bold border px-2.5 py-0.5 rounded-full">
            ${escNote(note.categoryName || 'عمومی نوٹ')}
          </span>
          <span class="text-[10px] text-slate-400 font-mono">${escNote(note.date)}</span>
        </div>

        <h3 class="text-base font-black text-slate-900 dark:text-white line-clamp-1">${escNote(note.title)}</h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">${escNote(note.content)}</p>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
        <button onclick="window.Views.downloadNoteTxt('${note.id}')" class="text-slate-400 hover:text-emerald-600 flex items-center gap-1 font-bold transition" title="فائل ڈاؤنلوڈ کریں">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          <span>ڈاؤنلوڈ</span>
        </button>

        <div class="flex items-center gap-1.5">
          <button onclick="window.Views.openAddNoteModal('${note.id}')" class="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition" title="ترمیم کریں">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.deleteNote('${note.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition" title="حذف کریں">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
};

window.Views.openAddNoteModal = function(editNoteId = null) {
  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const note = editNoteId ? notes.find(n => n.id === editNoteId) : null;

  const modalHtml = `
    <div class="space-y-4 font-urdu text-right select-none" dir="rtl">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 class="text-base font-black text-slate-900 dark:text-white">
          ${note ? 'علمی نوٹ میں ترمیم' : 'نیا نوٹ تحریر کریں'}
        </h3>
        <p class="text-xs text-slate-500">اپنے مطالعے اور اسباق کے اہم نکات محفوظ کریں۔</p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">نوٹ کا عنوان:</label>
          <input type="text" id="note-title-input" value="${note ? note.title : ''}" placeholder="مثلاً: سورۃ الملک کے فضائل یا فقہی فوائد..." class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">زمرہ (Category):</label>
          <select id="note-category-input" class="form-select text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold font-urdu">
            <option value="quran" ${note?.category === 'quran' ? 'selected' : ''}>📖 قرآن و تجوید کے نوٹس</option>
            <option value="hadith" ${note?.category === 'hadith' ? 'selected' : ''}>📜 علوم الحدیث و روایات</option>
            <option value="fiqh" ${note?.category === 'fiqh' ? 'selected' : ''}>⚖️ مسائلِ فقہ و فتاویٰ</option>
            <option value="course" ${note?.category === 'course' ? 'selected' : ''}>🎓 آن لائن کلاسز و اسباق</option>
            <option value="general" ${note?.category === 'general' ? 'selected' : ''}>📝 عمومی علمی یادداشت</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تفصیلی نوٹ / خلاصہ:</label>
          <textarea id="note-content-input" rows="6" placeholder="اپنا تفصیلی نوٹ یہاں تحریر فرمائیں..." class="form-input text-xs w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-urdu leading-relaxed">${note ? note.content : ''}</textarea>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
        <button onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 rounded-xl text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.saveStudentNote('${editNoteId || ''}')" class="btn-primary py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
          محفوظ کریں ✓
        </button>
      </div>
    </div>
  `;

  window.App.showModal(note ? 'نوٹ میں ترمیم' : 'نیا نوٹ', modalHtml);
};

window.Views.saveStudentNote = function(editNoteId) {
  const title = document.getElementById('note-title-input')?.value?.trim();
  const cat = document.getElementById('note-category-input')?.value || 'general';
  const content = document.getElementById('note-content-input')?.value?.trim();

  if (!title || !content) {
    window.App?.showToast('برائے کرم عنوان اور نوٹ کی تفصیل لازمی لکھیں۔', 'warning');
    return;
  }

  const categoryNames = {
    quran: 'قرآن و تجوید',
    hadith: 'علوم الحدیث',
    fiqh: 'فقہ و مسائل',
    course: 'کورس اسباق',
    general: 'عمومی نوٹ'
  };

  let notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('ur-PK')} • ${now.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' })}`;

  if (editNoteId) {
    const n = notes.find(item => item.id === editNoteId);
    if (n) {
      n.title = title;
      n.category = cat;
      n.categoryName = categoryNames[cat];
      n.content = content;
      n.updatedAt = dateStr;
    }
  } else {
    notes.unshift({
      id: `note-${Date.now()}`,
      title,
      category: cat,
      categoryName: categoryNames[cat],
      content,
      date: dateStr
    });
  }

  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  window.App.closeModal();
  window.App.showToast('علمی نوٹ کامیابی سے محفوظ ہو گیا! 📝', 'success');
  window.Views.renderStudyNotes();
};

window.Views.deleteNote = function(noteId) {
  if (!confirm('کیا آپ واقعی اس نوٹ کو حذف کرنا چاہتے ہیں؟')) return;
  let notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  notes = notes.filter(n => n.id !== noteId);
  localStorage.setItem('learnhub_student_notes', JSON.stringify(notes));
  window.App.showToast('نوٹ حذف کر دیا گیا۔', 'info');
  window.Views.renderStudyNotes();
};

window.Views.downloadNoteTxt = function(noteId) {
  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  const fullText = `═════════════════════════════════════════════\nعلمی نوٹ: ${note.title}\nزمرہ: ${note.categoryName}\nتاریخ: ${note.date}\nماخوذ از LearnHub Academy (learnhubplatform.com)\n═════════════════════════════════════════════\n\n${note.content}\n`;
  
  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  window.App.showToast('نوٹ کی فائل کامیابی سے ڈاؤنلوڈ ہو گئی! 📥', 'success');
};

window.Views.filterNotesLive = function(q) {
  const query = (q || '').toLowerCase().trim();
  const notes = JSON.parse(localStorage.getItem('learnhub_student_notes') || '[]');
  const grid = document.getElementById('notes-cards-grid');
  if (!grid) return;

  const matches = notes.filter(n => 
    n.title.toLowerCase().includes(query) || 
    n.content.toLowerCase().includes(query) ||
    n.categoryName.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 font-urdu text-xs">تلاش کے مطابق کوئی نوٹ نہیں ملا۔</div>';
    return;
  }

  grid.innerHTML = matches.map(n => window.Views.renderSingleNoteCardHtml(n)).join('');
  if (window.lucide) window.lucide.createIcons();
};
