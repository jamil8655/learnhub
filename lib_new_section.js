/* =============================================================================
   ADMIN BOOK CRUD (ADD / EDIT / DELETE & COMPLETE AUTHORING SUITE)
   ============================================================================= */

window._pendingBookPdfData = null;
window._pendingBookCoverData = null;
window._pendingBookChapters = [];

window.Views.openAddBookModal = function() {
  window._pendingBookPdfData = null;
  window._pendingBookCoverData = null;
  window._pendingBookChapters = [
    { title: 'مقدمہ و افتتاحی کلمات', arabicTitle: 'مقدمة الكتاب', contentUrdu: '' }
  ];

  var modalHtml = '<div id="add-book-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 font-urdu overflow-y-auto" dir="rtl">' +
    '<div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up my-auto">' +
    '<div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">' +
      '<div class="flex items-center gap-2.5">' +
        '<div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center"><i data-lucide="book-plus" class="w-5 h-5"></i></div>' +
        '<div><h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">کتب خانے میں نئی کتاب شامل کریں</h3>' +
        '<p class="text-[11px] text-slate-400">PDF اپلوڈ کریں، ابواب تحریر کریں یا آن لائن لنکس لگائیں</p></div>' +
      '</div>' +
      '<button onclick="document.getElementById(\'add-book-modal\').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500"><i data-lucide="x" class="w-4 h-4"></i></button>' +
    '</div>' +
    '<div class="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'basic\')" id="book-tab-btn-basic" class="py-1.5 px-3 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1 shrink-0"><i data-lucide="info" class="w-3.5 h-3.5"></i> بنیادی معلومات</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'pdf\')" id="book-tab-btn-pdf" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shrink-0"><i data-lucide="file-up" class="w-3.5 h-3.5"></i> PDF اپلوڈ</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'write\')" id="book-tab-btn-write" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shrink-0"><i data-lucide="pen-tool" class="w-3.5 h-3.5"></i> کتاب تحریر</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'cover\')" id="book-tab-btn-cover" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shrink-0"><i data-lucide="image" class="w-3.5 h-3.5"></i> سرورق</button>' +
    '</div>' +
    '<form onsubmit="window.Views.saveNewBook(event)" class="space-y-4 text-xs">' +

    '<div id="book-tab-pane-basic" class="space-y-3">' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کتاب کا نام *</label>' +
      '<input type="text" id="add-book-title" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="مثلاً: فتح المجید شرح کتاب التوحید"></div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">عربی عنوان</label>' +
        '<input type="text" id="add-book-title-ar" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="فتح المجيد شرح كتاب التوحيد"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">مصنف کا نام *</label>' +
        '<input type="text" id="add-book-author" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="مثلاً: علامہ ابن قیم الجوزیہ"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">شعبہ / کیٹیگری *</label>' +
        '<select id="add-book-category" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">' +
          '<option value="tafseer">تفاسیر و علوم القرآن</option>' +
          '<option value="hadith">کتبِ حدیث و شروح</option>' +
          '<option value="aqeedah" selected>عقیدہ و توحید</option>' +
          '<option value="fiqh">فقہ الحدیث و مسائل</option>' +
          '<option value="seerah">سیرت و تاریخِ اسلام</option>' +
          '<option value="asmarijal">اسماء الرجال و اصولِ حدیث</option>' +
          '<option value="muhadditheen">کتبِ ائمہ و محدثینِ عصر</option>' +
          '<option value="scholars_subcontinent">علمائے اہل حدیث برصغیر</option>' +
        '</select></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">صفحات</label>' +
        '<input type="number" id="add-book-pages" value="450" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">جلدیں</label>' +
        '<input type="number" id="add-book-volumes" value="1" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono"></div>' +
      '</div>' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">مختصر تعارف و خلاصہ</label>' +
      '<textarea id="add-book-description" rows="2" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="کتاب کے اہم مباحث کا خلاصہ..."></textarea></div>' +
    '</div>' +

    '<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +
      '<div class="p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2">' +
        '<i data-lucide="file-up" class="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400"></i>' +
        '<div class="font-extrabold text-slate-900 dark:text-white text-xs">اپنے ڈیوائس سے PDF فائل منتخب کریں</div>' +
        '<p class="text-[10px] text-slate-500">موبائل یا کمپیوٹر سے کوئی بھی کتاب (PDF) فوری اٹیچ کریں</p>' +
        '<input type="file" id="add-book-pdf-file" accept="application/pdf" onchange="window.Views.handleBookPdfUpload(this)" class="hidden">' +
        '<button type="button" onclick="document.getElementById(\'add-book-pdf-file\').click()" class="py-2 px-4 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow">' +
          '<i data-lucide="upload" class="w-3.5 h-3.5"></i> فائل منتخب کریں</button>' +
        '<div id="book-pdf-status-badge" class="hidden text-[11px] pt-1 font-mono font-bold text-emerald-600 dark:text-emerald-400"></div>' +
      '</div>' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">انٹرنیٹ آرکائیو / بیرونی آن لائن ریڈنگ لنک</label>' +
      '<input type="url" id="add-book-external-reader-url" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-left" dir="ltr" placeholder="https://archive.org/details/...">' +
      '<p class="text-[10px] text-slate-400 mt-0.5">Archive.org، Shamela، Noor-Book، Waqfeya، Google Drive</p></div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">براہ راست PDF ڈاؤن لوڈ URL</label>' +
        '<input type="url" id="add-book-pdf-url" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-left" dir="ltr" placeholder="https://.../book.pdf"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">ماخذ / ویب سائٹ کا نام</label>' +
        '<input type="text" id="add-book-source-name" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="مثلاً: انٹرنیٹ آرکائیو"></div>' +
      '</div>' +
    '</div>' +

    '<div id="book-tab-pane-write" class="space-y-3 hidden">' +
      '<div class="flex items-center justify-between">' +
        '<div><span class="font-extrabold text-slate-900 dark:text-white text-xs">کتاب کے ابواب تحریر کریں</span>' +
        '<p class="text-[10px] text-slate-400">آپ خود پوری کتاب ابواب کی صورت میں تحریر کر سکتے ہیں</p></div>' +
        '<button type="button" onclick="window.Views.addChapterToModal()" class="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow">' +
          '<i data-lucide="plus" class="w-3.5 h-3.5"></i> نیا باب شامل کریں</button>' +
      '</div>' +
      '<div id="modal-chapters-list-container" class="space-y-3 max-h-64 overflow-y-auto p-1"></div>' +
    '</div>' +

    '<div id="book-tab-pane-cover" class="space-y-3 hidden">' +
      '<div class="flex items-center gap-4">' +
        '<img id="book-cover-preview-img" src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" class="w-20 h-28 object-cover rounded-2xl border-2 border-emerald-500/40 shadow-lg shrink-0">' +
        '<div class="space-y-2 flex-1 min-w-0">' +
          '<label class="block font-bold text-slate-700 dark:text-slate-300 text-xs">سرورق تصویر اپلوڈ کریں</label>' +
          '<input type="file" id="add-book-cover-file" accept="image/*" onchange="window.Views.handleBookCoverUpload(this)" class="hidden">' +
          '<button type="button" onclick="document.getElementById(\'add-book-cover-file\').click()" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:border-emerald-500 text-xs font-bold flex items-center gap-1.5">' +
            '<i data-lucide="image-plus" class="w-4 h-4 text-emerald-500"></i> تصویر منتخب کریں</button>' +
          '<input type="url" id="add-book-cover-url" oninput="document.getElementById(\'book-cover-preview-img\').src=this.value" placeholder="یا تصویر URL پیسٹ کریں..." class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono text-left" dir="ltr">' +
        '</div>' +
      '</div>' +
      '<div><span class="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">یا پیش سیٹ سرورق منتخب کریں:</span>' +
      '<div class="grid grid-cols-4 gap-2">' +
        '<img onclick="window.Views.selectPresetCover(\'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=300&q=80\')" src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=150&q=80" class="w-full aspect-[3/4] object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-500">' +
        '<img onclick="window.Views.selectPresetCover(\'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80\')" src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80" class="w-full aspect-[3/4] object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-500">' +
        '<img onclick="window.Views.selectPresetCover(\'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=300&q=80\')" src="https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=150&q=80" class="w-full aspect-[3/4] object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-500">' +
        '<img onclick="window.Views.selectPresetCover(\'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80\')" src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=150&q=80" class="w-full aspect-[3/4] object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-500">' +
      '</div></div>' +
    '</div>' +

    '<div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">' +
      '<button type="button" onclick="document.getElementById(\'add-book-modal\').remove()" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">منسوخ</button>' +
      '<button type="submit" class="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i> کتاب محفوظ کریں</button>' +
    '</div>' +
    '</form></div></div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window.Views._renderModalChaptersList();
  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchBookModalTab = function(tabKey) {
  var tabs = ['basic', 'pdf', 'write', 'cover'];
  tabs.forEach(function(t) {
    var pane = document.getElementById('book-tab-pane-' + t);
    var btn = document.getElementById('book-tab-btn-' + t);
    if (t === tabKey) {
      if (pane) pane.classList.remove('hidden');
      if (btn) { btn.classList.add('bg-emerald-600', 'text-white', 'shadow-sm'); btn.classList.remove('text-slate-600', 'dark:text-slate-300'); }
    } else {
      if (pane) pane.classList.add('hidden');
      if (btn) { btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm'); btn.classList.add('text-slate-600', 'dark:text-slate-300'); }
    }
  });
};

window.Views.handleBookPdfUpload = function(input) {
  var file = input.files[0];
  if (!file) return;
  var sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  var reader = new FileReader();
  reader.onload = function(e) {
    window._pendingBookPdfData = e.target.result;
    var badge = document.getElementById('book-pdf-status-badge');
    if (badge) { badge.innerHTML = '&#10003; PDF منسلک: ' + file.name + ' (' + sizeMb + ' MB)'; badge.classList.remove('hidden'); }
    if (window.App) window.App.showToast('PDF فائل کامیابی سے منسلک ہو گئی!', 'success');
  };
  reader.readAsDataURL(file);
};

window.Views.handleBookCoverUpload = function(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    window._pendingBookCoverData = e.target.result;
    var preview = document.getElementById('book-cover-preview-img');
    if (preview) preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.Views.selectPresetCover = function(url) {
  window._pendingBookCoverData = url;
  var preview = document.getElementById('book-cover-preview-img');
  if (preview) preview.src = url;
  var urlInput = document.getElementById('add-book-cover-url') || document.getElementById('edit-book-cover-url');
  if (urlInput) urlInput.value = url;
};

window.Views.addChapterToModal = function() {
  window._pendingBookChapters = window._pendingBookChapters || [];
  window._pendingBookChapters.push({ title: 'باب ' + (window._pendingBookChapters.length + 1), arabicTitle: '', contentUrdu: '' });
  window.Views._renderModalChaptersList();
};

window.Views.removeChapterFromModal = function(idx) {
  if (!window._pendingBookChapters) return;
  window._pendingBookChapters.splice(idx, 1);
  window.Views._renderModalChaptersList();
};

window.Views._renderModalChaptersList = function() {
  var container = document.getElementById('modal-chapters-list-container');
  if (!container) return;
  if (!window._pendingBookChapters || window._pendingBookChapters.length === 0) {
    container.innerHTML = '<div class="text-center py-6 border rounded-xl text-slate-400 text-xs">کوئی باب شامل نہیں۔ اوپر + بٹن دبائیں۔</div>';
    return;
  }
  container.innerHTML = window._pendingBookChapters.map(function(ch, idx) {
    return '<div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">' +
      '<div class="flex items-center justify-between">' +
        '<span class="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">باب نمبر ' + (idx + 1) + '</span>' +
        '<button type="button" onclick="window.Views.removeChapterFromModal(' + idx + ')" class="text-rose-500 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>' +
      '</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">' +
        '<input type="text" value="' + (ch.title || '').replace(/"/g, '') + '" oninput="window._pendingBookChapters[' + idx + '].title=this.value" placeholder="باب کا عنوان..." class="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold">' +
        '<input type="text" value="' + (ch.arabicTitle || '').replace(/"/g, '') + '" oninput="window._pendingBookChapters[' + idx + '].arabicTitle=this.value" placeholder="عربی عنوان (اختیاری)..." class="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold">' +
      '</div>' +
      '<textarea rows="3" oninput="window._pendingBookChapters[' + idx + '].contentUrdu=this.value" placeholder="اس باب کا مکمل متن، تفسیری تشریح، احادیث اور فقہی فوائد تحریر کریں..." class="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs leading-relaxed font-semibold">' + (ch.contentUrdu || '') + '</textarea>' +
    '</div>';
  }).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveNewBook = function(e) {
  e.preventDefault();
  var title = document.getElementById('add-book-title').value.trim();
  var titleAr = ((document.getElementById('add-book-title-ar') || { value: title }).value || title).trim();
  var author = document.getElementById('add-book-author').value.trim();
  var category = document.getElementById('add-book-category').value;
  var pages = Number(document.getElementById('add-book-pages').value) || 250;
  var volumes = Number(((document.getElementById('add-book-volumes') || { value: 1 }).value)) || 1;
  var description = document.getElementById('add-book-description').value.trim();
  var externalReaderUrl = ((document.getElementById('add-book-external-reader-url') || { value: '' }).value || '').trim();
  var pdfUrl = ((document.getElementById('add-book-pdf-url') || { value: '' }).value || '').trim();
  var sourceName = ((document.getElementById('add-book-source-name') || { value: '' }).value || '').trim();
  var coverUrlInput = ((document.getElementById('add-book-cover-url') || { value: '' }).value || '').trim();

  var catNames = {
    tafseer: 'تفاسیر و علوم القرآن', hadith: 'کتبِ حدیث و شروح', aqeedah: 'عقیدہ و توحید',
    fiqh: 'فقہ الحدیث و مسائل', seerah: 'سیرت و تاریخِ اسلام', asmarijal: 'اسماء الرجال و اصولِ حدیث',
    muhadditheen: 'کتبِ ائمہ و محدثینِ عصر', scholars_subcontinent: 'علمائے اہل حدیث برصغیر'
  };

  var newBook = {
    id: 'bk-user-' + Date.now(), title: title, titleArabic: titleAr, author: author,
    category: category, categoryName: catNames[category] || 'عمومی کتب',
    cover: window._pendingBookCoverData || coverUrlInput || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    pages: pages, volumes: volumes, publisher: 'لرن ہب', year: '1447ھ', language: 'ur',
    description: description || (title + ' پر وقیع علمی تصنیف۔'),
    pdfDataUrl: window._pendingBookPdfData || null,
    pdfUrl: pdfUrl || '#', externalReaderUrl: externalReaderUrl || null,
    sourceName: sourceName || null, downloadUrl: pdfUrl || '#',
    chapters: (window._pendingBookChapters && window._pendingBookChapters.length > 0) ? JSON.parse(JSON.stringify(window._pendingBookChapters)) : null,
    rating: 5.0, readTime: Math.max(2, Math.round(pages / 50)) + ' گھنٹے'
  };

  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  books.unshift(newBook);
  if (window.DB) { window.DB.set('libraryBooks', books); window.DB.save(); }
  document.getElementById('add-book-modal').remove();
  if (window.App) window.App.showToast('✓ نئی کتاب کامیابی سے شامل کر دی گئی!', 'success');
  if (window.location.hash.includes('/admin/books') && window.Views.admin && window.Views.admin.renderBooks) {
    window.Views.admin.renderBooks();
  } else {
    window.Views.renderIslamicLibrary(window._currentLibraryCategory || 'all');
  }
};

window.Views.openEditBookModal = function(bookId) {
  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  var book = books.find(function(b) { return b.id === bookId; });
  if (!book) return;

  window._pendingBookPdfData = book.pdfDataUrl || null;
  window._pendingBookCoverData = book.cover || null;
  window._pendingBookChapters = Array.isArray(book.chapters) ? JSON.parse(JSON.stringify(book.chapters)) : [
    { title: 'مقدمہ', arabicTitle: 'مقدمة الكتاب', contentUrdu: book.description || '' }
  ];

  var catOpts = [
    ['tafseer', 'تفاسیر و علوم القرآن'], ['hadith', 'کتبِ حدیث و شروح'], ['aqeedah', 'عقیدہ و توحید'],
    ['fiqh', 'فقہ الحدیث و مسائل'], ['seerah', 'سیرت و تاریخِ اسلام'], ['asmarijal', 'اسماء الرجال و اصولِ حدیث'],
    ['muhadditheen', 'کتبِ ائمہ و محدثینِ عصر'], ['scholars_subcontinent', 'علمائے اہل حدیث برصغیر']
  ];
  var catSelectHtml = catOpts.map(function(o) {
    return '<option value="' + o[0] + '"' + (book.category === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
  }).join('');

  var eTitle = (book.title || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  var eAr = (book.titleArabic || '').replace(/"/g, '&quot;');
  var eAuthor = (book.author || '').replace(/"/g, '&quot;');
  var eDesc = (book.description || '').replace(/</g, '&lt;');
  var eCover = (book.cover || '').replace(/"/g, '&quot;');
  var eExtUrl = (book.externalReaderUrl || '').replace(/"/g, '&quot;');
  var ePdfUrl = (book.pdfUrl && book.pdfUrl !== '#' ? book.pdfUrl : '').replace(/"/g, '&quot;');
  var eSrc = (book.sourceName || '').replace(/"/g, '&quot;');
  var hasPdf = Boolean(book.pdfDataUrl);

  var modalHtml = '<div id="edit-book-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 font-urdu overflow-y-auto" dir="rtl">' +
    '<div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up my-auto">' +
    '<div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">' +
      '<div class="flex items-center gap-2.5">' +
        '<div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center"><i data-lucide="edit-3" class="w-5 h-5"></i></div>' +
        '<div><h3 class="text-base font-black text-slate-900 dark:text-white">ترمیم: ' + eTitle + '</h3>' +
        '<p class="text-[11px] text-slate-400">PDF، ابواب اور معلومات اپڈیٹ کریں</p></div>' +
      '</div>' +
      '<button onclick="document.getElementById(\'edit-book-modal\').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500"><i data-lucide="x" class="w-4 h-4"></i></button>' +
    '</div>' +
    '<div class="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'basic\')" id="book-tab-btn-basic" class="py-1.5 px-3 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1 shrink-0"><i data-lucide="info" class="w-3.5 h-3.5"></i> بنیادی معلومات</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'pdf\')" id="book-tab-btn-pdf" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 shrink-0"><i data-lucide="file-up" class="w-3.5 h-3.5"></i> PDF و لنکس</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'write\')" id="book-tab-btn-write" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 shrink-0"><i data-lucide="pen-tool" class="w-3.5 h-3.5"></i> ابواب نگاری</button>' +
      '<button type="button" onclick="window.Views.switchBookModalTab(\'cover\')" id="book-tab-btn-cover" class="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 shrink-0"><i data-lucide="image" class="w-3.5 h-3.5"></i> سرورق</button>' +
    '</div>' +
    '<form onsubmit="window.Views.saveEditBook(event, \'' + book.id + '\')" class="space-y-4 text-xs">' +

    '<div id="book-tab-pane-basic" class="space-y-3">' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کتاب کا نام *</label>' +
      '<input type="text" id="edit-book-title" value="' + eTitle + '" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"></div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">عربی عنوان</label>' +
        '<input type="text" id="edit-book-title-ar" value="' + eAr + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">مصنف کا نام *</label>' +
        '<input type="text" id="edit-book-author" value="' + eAuthor + '" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">شعبہ / کیٹیگری *</label>' +
        '<select id="edit-book-category" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">' + catSelectHtml + '</select></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">صفحات</label>' +
        '<input type="number" id="edit-book-pages" value="' + (book.pages || 250) + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">جلدیں</label>' +
        '<input type="number" id="edit-book-volumes" value="' + (book.volumes || 1) + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono"></div>' +
      '</div>' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">خلاصہ و تعارف</label>' +
      '<textarea id="edit-book-description" rows="2" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">' + eDesc + '</textarea></div>' +
    '</div>' +

    '<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +
      '<div class="p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2">' +
        '<i data-lucide="file-up" class="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400"></i>' +
        '<div class="font-extrabold text-slate-900 dark:text-white text-xs">PDF فائل تبدیل / منسلک کریں</div>' +
        '<input type="file" id="edit-book-pdf-file" accept="application/pdf" onchange="window.Views.handleBookPdfUpload(this)" class="hidden">' +
        '<button type="button" onclick="document.getElementById(\'edit-book-pdf-file\').click()" class="py-2 px-4 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow"><i data-lucide="upload" class="w-3.5 h-3.5"></i> نئی PDF منتخب کریں</button>' +
        '<div id="book-pdf-status-badge" class="text-[11px] pt-1 font-mono font-bold text-emerald-600 dark:text-emerald-400' + (hasPdf ? '' : ' hidden') + '">' + (hasPdf ? '&#10003; اصلی PDF پہلے سے منسلک ہے' : '') + '</div>' +
      '</div>' +
      '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">آن لائن ریڈنگ لنک</label>' +
      '<input type="url" id="edit-book-external-reader-url" value="' + eExtUrl + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono text-left" dir="ltr" placeholder="https://archive.org/details/..."></div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">PDF ڈاؤن لوڈ URL</label>' +
        '<input type="url" id="edit-book-pdf-url" value="' + ePdfUrl + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono text-left" dir="ltr"></div>' +
        '<div><label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">ماخذ کا نام</label>' +
        '<input type="text" id="edit-book-source-name" value="' + eSrc + '" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"></div>' +
      '</div>' +
    '</div>' +

    '<div id="book-tab-pane-write" class="space-y-3 hidden">' +
      '<div class="flex items-center justify-between">' +
        '<div><span class="font-extrabold text-slate-900 dark:text-white text-xs">کتاب کے ابواب و مضامین</span>' +
        '<p class="text-[10px] text-slate-400">ابواب ترمیم یا نئے ابواب شامل کریں</p></div>' +
        '<button type="button" onclick="window.Views.addChapterToModal()" class="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"><i data-lucide="plus" class="w-3.5 h-3.5"></i> نیا باب</button>' +
      '</div>' +
      '<div id="modal-chapters-list-container" class="space-y-3 max-h-64 overflow-y-auto p-1"></div>' +
    '</div>' +

    '<div id="book-tab-pane-cover" class="space-y-3 hidden">' +
      '<div class="flex items-center gap-4">' +
        '<img id="book-cover-preview-img" src="' + eCover + '" class="w-20 h-28 object-cover rounded-2xl border-2 border-amber-500/40 shadow-lg shrink-0">' +
        '<div class="space-y-2 flex-1">' +
          '<label class="block font-bold text-slate-700 dark:text-slate-300 text-xs">سرورق تصویر تبدیل کریں</label>' +
          '<input type="file" id="edit-book-cover-file" accept="image/*" onchange="window.Views.handleBookCoverUpload(this)" class="hidden">' +
          '<button type="button" onclick="document.getElementById(\'edit-book-cover-file\').click()" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:border-amber-500 text-xs font-bold flex items-center gap-1.5"><i data-lucide="image-plus" class="w-4 h-4 text-amber-500"></i> تصویر اپلوڈ کریں</button>' +
          '<input type="url" id="edit-book-cover-url" value="' + eCover + '" oninput="document.getElementById(\'book-cover-preview-img\').src=this.value" placeholder="یا تصویر URL..." class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono text-left" dir="ltr">' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">' +
      '<button type="button" onclick="document.getElementById(\'edit-book-modal\').remove()" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">منسوخ</button>' +
      '<button type="submit" class="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg flex items-center gap-1.5"><i data-lucide="save" class="w-4 h-4 text-slate-950"></i> تبدیلیاں محفوظ کریں</button>' +
    '</div>' +
    '</form></div></div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window.Views._renderModalChaptersList();
  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveEditBook = function(e, bookId) {
  e.preventDefault();
  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  var book = books.find(function(b) { return b.id === bookId; });
  if (!book) return;

  book.title = document.getElementById('edit-book-title').value.trim();
  book.titleArabic = ((document.getElementById('edit-book-title-ar') || { value: book.title }).value || book.title).trim();
  book.author = document.getElementById('edit-book-author').value.trim();
  book.category = document.getElementById('edit-book-category').value;
  book.pages = Number(document.getElementById('edit-book-pages').value) || 250;
  book.volumes = Number(((document.getElementById('edit-book-volumes') || { value: 1 }).value)) || 1;
  book.description = document.getElementById('edit-book-description').value.trim();

  var externalReaderUrl = ((document.getElementById('edit-book-external-reader-url') || { value: '' }).value || '').trim();
  var pdfUrl = ((document.getElementById('edit-book-pdf-url') || { value: '' }).value || '').trim();
  var sourceName = ((document.getElementById('edit-book-source-name') || { value: '' }).value || '').trim();
  var coverUrlInput = ((document.getElementById('edit-book-cover-url') || { value: '' }).value || '').trim();

  if (window._pendingBookPdfData) book.pdfDataUrl = window._pendingBookPdfData;
  if (window._pendingBookCoverData) book.cover = window._pendingBookCoverData;
  else if (coverUrlInput) book.cover = coverUrlInput;
  if (externalReaderUrl) book.externalReaderUrl = externalReaderUrl;
  if (pdfUrl) { book.pdfUrl = pdfUrl; book.downloadUrl = pdfUrl; }
  if (sourceName) book.sourceName = sourceName;
  if (window._pendingBookChapters && window._pendingBookChapters.length > 0) {
    book.chapters = JSON.parse(JSON.stringify(window._pendingBookChapters));
  }

  var catNames = {
    tafseer: 'تفاسیر و علوم القرآن', hadith: 'کتبِ حدیث و شروح', aqeedah: 'عقیدہ و توحید',
    fiqh: 'فقہ الحدیث و مسائل', seerah: 'سیرت و تاریخِ اسلام', asmarijal: 'اسماء الرجال و اصولِ حدیث',
    muhadditheen: 'کتبِ ائمہ و محدثینِ عصر', scholars_subcontinent: 'علمائے اہل حدیث برصغیر'
  };
  book.categoryName = catNames[book.category] || book.categoryName;

  if (window.DB) { window.DB.set('libraryBooks', books); window.DB.save(); }
  document.getElementById('edit-book-modal').remove();
  if (window.App) window.App.showToast('✓ کتاب کامیابی سے اپڈیٹ ہو گئی!', 'success');
  if (window.location.hash.includes('/admin/books') && window.Views.admin && window.Views.admin.renderBooks) {
    window.Views.admin.renderBooks();
  } else {
    window.Views.renderIslamicLibrary(window._currentLibraryCategory || 'all');
  }
};

window.Views.deleteBook = function(bookId) {
  if (!confirm('کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟')) return;
  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  books = books.filter(function(b) { return b.id !== bookId; });
  if (window.DB) { window.DB.set('libraryBooks', books); window.DB.save(); }
  if (window.App) window.App.showToast('✓ کتاب کامیابی سے حذف ہو گئی!', 'success');
  if (window.location.hash.includes('/admin/books') && window.Views.admin && window.Views.admin.renderBooks) {
    window.Views.admin.renderBooks();
  } else {
    window.Views.renderIslamicLibrary(window._currentLibraryCategory || 'all');
  }
};
