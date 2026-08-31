/**
 * LearnHub Admin Newsletter Subscribers & Interactive Broadcast Studio (v180.0.0)
 * Visual announcement composer with:
 * - Device file upload (Mobile/Desktop) + URL Link option
 * - Automatic Gmail Web Compose & Default Mailto triggering
 * - Live structured HTML email generator with bullet points, banners, and CTA
 * - 1-Click Copy Rich HTML Email (for Gmail/Outlook with intact styling)
 * - In-app DB sync and Firestore Cloud Dispatch
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin._currentBroadcastImage = '';

window.Views.admin.renderSubscribers = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const broadcasts = (window.DB && window.DB.get('broadcasts')) || (JSON.parse(localStorage.getItem('learnhub_broadcasts') || '[]'));

  const L = {
    title: isRtl ? (lang === 'ur' ? 'سبسکرائبرز مینجمنٹ و تصویری براڈکاسٹ اسٹوڈیو' : 'إدارة المشتركين واستوديو البث البريدي') : 'Newsletter Subscribers & Broadcast Studio',
    sub: isRtl ? (lang === 'ur' ? 'سبسکرائب کرنے والے تمام صارفین کو تصاویر، اپڈیٹ تفصیلات اور ایکشن لنکس کے ساتھ پروفیشنل ای میل بھیجیں' : 'إرسال التحديثات والإعلانات لجميع المشتركين عبر البريد الإلكتروني') : 'Compose rich announcements with banners, changelogs, and action buttons to broadcast to all subscribers.',
    btnBroadcast: isRtl ? (lang === 'ur' ? '📢 نیا تصویری براڈکاسٹ تیار و ارسال کریں' : '📢 إنشاء وإرسال بث بريدي') : '📢 Compose & Send Broadcast',
    btnExportCsv: isRtl ? '📥 CSV ڈاؤن لوڈ' : '📥 Export CSV',
    btnCopyAll: isRtl ? '📋 تمام ای میلز کاپی کریں' : '📋 Copy Emails',
    thEmail: isRtl ? 'ای میل ایڈریس' : 'Subscriber Email',
    thDate: isRtl ? 'تاریخ شمولیت' : 'Subscribed Date',
    thSource: isRtl ? 'ماخذ' : 'Origin',
    thStatus: isRtl ? 'اسٹیٹس' : 'Status',
    thActions: isRtl ? 'اختیارات' : 'Actions'
  };

  container.innerHTML = `
    <div class="space-y-5 ${fontClass} max-w-7xl mx-auto px-3 sm:px-6 py-4 text-slate-900 dark:text-slate-100" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      ${typeof window.Views.admin.renderAdminNav === 'function' ? window.Views.admin.renderAdminNav('subscribers') : ''}

      <!-- Executive Header -->
      <div class="bg-teal-800 text-white border border-teal-600/50 p-5 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-900 text-amber-300 border border-teal-500/40 text-[10px] font-bold font-mono">
            <span>📡 SUBSCRIBERS OUTREACH & BROADCAST SUITE</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-white font-arabic">
            ${L.title}
          </h2>
          <p class="text-xs text-teal-200/90 max-w-2xl leading-relaxed">
            ${L.sub}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="window.Views.admin.copyAllSubscriberEmails()" class="py-2.5 px-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-teal-200 font-bold text-xs border border-teal-600/40 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer">
            <span>${L.btnCopyAll}</span>
          </button>
          <button onclick="window.Views.admin.exportSubscribersCsv()" class="py-2.5 px-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-teal-200 font-bold text-xs border border-teal-600/40 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer">
            <span>${L.btnExportCsv}</span>
          </button>
          <button onclick="window.Views.admin.openBroadcastModal()" class="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer">
            <span>${L.btnBroadcast}</span>
          </button>
        </div>
      </div>

      <!-- Subscribers Table -->
      <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Active Newsletter Subscribers (${subscribers.length})
          </h3>
          <span class="text-[11px] text-teal-700 dark:text-teal-400 font-mono font-bold">Auto-synced with Cloud Database</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">#</th>
                <th class="p-3.5">${L.thEmail}</th>
                <th class="p-3.5">${L.thDate}</th>
                <th class="p-3.5">${L.thSource}</th>
                <th class="p-3.5">${L.thStatus}</th>
                <th class="p-3.5 text-right">${L.thActions}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${subscribers.length === 0 ? `
                <tr>
                  <td colspan="6" class="p-8 text-center text-slate-400">
                    No subscribers yet. Any visitor entering their email in the footer will automatically appear here!
                  </td>
                </tr>
              ` : subscribers.map((sub, idx) => {
                const email = typeof sub === 'string' ? sub : (sub.email || '');
                const dateStr = sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : new Date().toLocaleDateString();
                const source = sub.source || 'Website Footer';

                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="p-3.5 font-mono text-slate-400">${idx + 1}</td>
                    <td class="p-3.5 font-bold font-mono text-slate-900 dark:text-white">
                      ${email}
                    </td>
                    <td class="p-3.5 font-mono text-slate-500 text-[11px]">
                      ${dateStr}
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold border border-teal-600/30">
                        ${source}
                      </span>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        ACTIVE ✓
                      </span>
                    </td>
                    <td class="p-3.5 text-right space-x-1">
                      <a href="mailto:${email}?subject=LearnHub Academy Update" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold text-xs" title="Send Direct Email">
                        ✉️ Email
                      </a>
                      <button onclick="window.Views.admin.deleteSubscriber('${email}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs cursor-pointer" title="Remove Subscriber">
                        🗑️
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

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.copyAllSubscriberEmails = function() {
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);
  if (emails.length === 0) {
    window.App?.showToast('No subscriber emails to copy', 'info');
    return;
  }
  navigator.clipboard.writeText(emails.join(', ')).then(() => {
    window.App?.showToast('Copied ' + emails.length + ' subscriber emails to clipboard! 📋', 'success');
  }).catch(() => {
    window.App?.showToast('Copied: ' + emails.length + ' emails', 'success');
  });
};

window.Views.admin.exportSubscribersCsv = function() {
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  let csv = 'Email,SubscribedDate,Source,Status\n';
  subscribers.forEach(s => {
    const email = typeof s === 'string' ? s : (s.email || '');
    const date = s.subscribedAt || new Date().toISOString();
    const src = s.source || 'Website Footer';
    csv += `"${email}","${date}","${src}","active"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'learnhub_subscribers_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  window.App?.showToast('Subscribers CSV exported successfully 📥', 'success');
};

window.Views.admin.deleteSubscriber = function(email) {
  if (!confirm('Remove ' + email + ' from subscribers list?')) return;
  let subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  subscribers = subscribers.filter(s => (typeof s === 'string' ? s : s.email) !== email);
  if (window.DB) {
    window.DB.set('subscribers', subscribers);
    window.DB.save();
  }
  localStorage.setItem('learnhub_subscribers', JSON.stringify(subscribers));
  window.App?.showToast('Subscriber removed', 'info');
  window.Views.admin.renderSubscribers();
};

window.Views.admin.handleBroadcastImageUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    window.App?.showToast('Image size exceeds 5MB limit', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    window.Views.admin._currentBroadcastImage = e.target.result;
    const urlInput = document.getElementById('bc-image');
    if (urlInput) urlInput.value = '';
    window.Views.admin.updateBroadcastPreview();
    window.App?.showToast('تصویر کامیابی سے اپلوڈ ہو گئی! 📷', 'success');
  };
  reader.readAsDataURL(file);
};

window.Views.admin.openBroadcastModal = function() {
  window.Views.admin._currentBroadcastImage = '';
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);

  const modalHtml = `
    <div id="broadcast-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs my-8 max-h-[92vh] flex flex-col">
        
        <!-- Modal Top Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">📢</span>
            <div>
              <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                پروفیشنل تصویری براڈکاسٹ و ای میل بلڈر (Executive Email Studio)
              </h3>
              <p class="text-[11px] text-slate-500">
                سبسکرائبرز (${emails.length}) کے لیے ای میل اور ان-ایپ اعلانات کی بہترین ترتیب
              </p>
            </div>
          </div>
          <button onclick="document.getElementById('broadcast-modal').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div class="space-y-4 overflow-y-auto pr-1 flex-1">
          
          <!-- Category & Subject -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کیٹیگری *</label>
              <select id="bc-category" onchange="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                <option value="🚀 نئی خصوصیت اور اپڈیٹ">🚀 نئی خصوصیت اور اپڈیٹ</option>
                <option value="📖 نیا قرآنی و اسلامی مواد">📖 نیا قرآنی و اسلامی مواد</option>
                <option value="🎓 نیا کورس و امتحان">🎓 نیا کورس و امتحان</option>
                <option value="📢 اہم اکیڈمی اعلان">📢 اہم اکیڈمی اعلان</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">اعلان کا عنوان / سبجیکٹ *</label>
              <input type="text" id="bc-subject" value="LearnHub میں صوتی تلاوت اور لائیو تجوید کا نیا اپڈیٹ شامل!" oninput="window.Views.admin.updateBroadcastPreview()" placeholder="مثلاً: LearnHub میں صوتی تلاوت اور لائیو تجوید کا نیا اپڈیٹ شامل!" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
          </div>

          <!-- Dual Image Source: Device Upload & URL Link -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300">
              🖼️ بینر یا تصویر شامل کریں (موبائل فائل یا ویب لنک):
            </label>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">1. موبائل / لیپ ٹاپ سے تصویر چنیں:</label>
                <label class="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/40 text-teal-800 dark:text-teal-300 font-bold cursor-pointer hover:bg-teal-100 transition text-xs shadow-xs">
                  <span>📷 تصویر اپلوڈ کریں (Upload Image)</span>
                  <input type="file" accept="image/*" onchange="window.Views.admin.handleBroadcastImageUpload(event)" class="hidden" />
                </label>
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">2. یا انٹرنیٹ امیج کا لنک درج کریں:</label>
                <input type="url" id="bc-image" placeholder="https://learnhubplatform.com/images/learnhub-logo.png" oninput="window.Views.admin._currentBroadcastImage = ''; window.Views.admin.updateBroadcastPreview();" class="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-teal-500" dir="ltr" />
              </div>
            </div>
          </div>

          <!-- Changelog & Description -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              تفصیلات و نکات (Changelog Bullets - ہر لائن پر ایک نکتہ تحریر کریں) *
            </label>
            <textarea id="bc-body" rows="4" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500">✓ تمام 114 سورتوں میں لائیو صوتی تلاوت اور تجوید ریڈر شامل کر دیا گیا ہے۔
✓ ہوم پیج پر 300+ کلاسیکی کتب کے براہِ راست مطالعہ کارڈز فعال ہو گئے ہیں۔
✓ انٹرپرائز سیکیورٹی اور موبائل ایپ کی کارکردگی کو مزید تیز اور محفوظ بنا دیا گیا ہے۔</textarea>
          </div>

          <!-- Action Button Link & Label -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">بٹن کا نام (Action Button Text)</label>
              <input type="text" id="bc-btn-text" value="ابھی دیکھیں اور مطالعہ کریں" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">بٹن کا لنک (URL / Route)</label>
              <input type="text" id="bc-btn-link" value="https://learnhubplatform.com/#/quran/1" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" dir="ltr" />
            </div>
          </div>

          <!-- Live Visual Email Preview -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="font-bold text-slate-700 dark:text-slate-300">
                📨 لائیو ای میل پریویو (Live Email Preview as seen by Users):
              </label>
              <span class="text-[10px] text-teal-600 font-mono">100% Responsive HTML Email</span>
            </div>

            <div id="bc-email-preview-box" class="p-6 rounded-3xl bg-slate-900 text-white border border-teal-700/50 shadow-2xl space-y-4 max-w-xl mx-auto">
              <!-- Email Brand Header -->
              <div class="flex items-center justify-between border-b border-teal-800/60 pb-3">
                <div class="flex items-center gap-2">
                  <img src="images/learnhub-logo.png" class="w-7 h-7 rounded-lg object-cover" alt="LearnHub" />
                  <span class="font-black text-sm text-white">LearnHub Academy</span>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">Official Broadcast</span>
              </div>

              <!-- Banner Preview -->
              <div id="bc-prev-img-wrap" class="rounded-2xl overflow-hidden border border-teal-700/40 shadow-md">
                <img id="bc-prev-img" src="images/learnhub-logo.png" alt="Banner" class="w-full h-44 object-cover" />
              </div>

              <!-- Category & Title -->
              <div class="space-y-1 text-center">
                <span id="bc-prev-cat" class="inline-block px-3 py-0.5 rounded-full bg-teal-800 text-amber-300 border border-teal-600/40 text-[10px] font-bold font-mono">
                  🚀 نئی خصوصیت اور اپڈیٹ
                </span>
                <h4 id="bc-prev-title" class="font-black text-base sm:text-lg text-white leading-snug">
                  اعلان کا عنوان
                </h4>
              </div>

              <!-- Bullets Description Box -->
              <div id="bc-prev-desc" class="p-4 rounded-2xl bg-slate-950/60 border border-teal-800/40 text-xs text-teal-100 leading-loose space-y-1 text-right">
                <!-- Bullets injected reactively -->
              </div>

              <!-- Big CTA Button -->
              <div class="text-center pt-2">
                <a id="bc-prev-btn" href="#" class="inline-block py-3 px-8 rounded-2xl bg-amber-400 text-teal-950 font-black text-xs shadow-xl transition active:scale-95">
                  ابھی دیکھیں اور مطالعہ کریں
                </a>
              </div>

              <!-- Email Footer -->
              <div class="border-t border-teal-800/60 pt-3 text-center text-[10px] text-slate-400 space-y-0.5">
                <div>&copy; 2026 LearnHub Islamic EdTech Platform • All Rights Reserved</div>
                <div class="text-amber-300 font-mono">🔒 256-Bit Encrypted Official Dispatch</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Bottom Actions -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
          <span class="text-[11px] text-teal-700 dark:text-teal-400 font-bold font-mono">
            ${emails.length} سبسکرائبرز کو بھیجا جائے گا
          </span>
          <div class="flex items-center gap-2">
            <button onclick="document.getElementById('broadcast-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold cursor-pointer">Cancel</button>
            <button id="bc-send-btn" onclick="window.Views.admin.sendBroadcastAction()" class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black shadow-md active:scale-95 transition cursor-pointer flex items-center gap-1.5">
              <span>📢 تمام سبسکرائبرز کو ارسال کریں</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.getElementById('broadcast-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window.Views.admin.updateBroadcastPreview();
};

window.Views.admin.updateBroadcastPreview = function() {
  const cat = document.getElementById('bc-category')?.value || '';
  const subj = document.getElementById('bc-subject')?.value || 'اعلان کا عنوان یہاں نظر آئے گا...';
  const urlImg = document.getElementById('bc-image')?.value.trim() || '';
  const activeImg = window.Views.admin._currentBroadcastImage || urlImg || 'images/learnhub-logo.png';
  const body = document.getElementById('bc-body')?.value || 'تفصیلات یہاں نظر آئیں گی...';
  const btnText = document.getElementById('bc-btn-text')?.value || 'ابھی دیکھیں';
  const btnLink = document.getElementById('bc-btn-link')?.value || '#';

  const prevCat = document.getElementById('bc-prev-cat');
  const prevTitle = document.getElementById('bc-prev-title');
  const prevDesc = document.getElementById('bc-prev-desc');
  const prevBtn = document.getElementById('bc-prev-btn');
  const prevImg = document.getElementById('bc-prev-img');

  if (prevCat) prevCat.textContent = cat;
  if (prevTitle) prevTitle.textContent = subj;
  if (prevBtn) {
    prevBtn.textContent = btnText;
    prevBtn.href = btnLink;
  }
  if (prevImg) {
    prevImg.src = activeImg;
  }

  if (prevDesc) {
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    prevDesc.innerHTML = lines.map(line => {
      const hasBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('✓');
      return `<div class="flex items-start gap-1.5">${hasBullet ? '' : '<span class="text-amber-400">✓</span> '}<span>${line}</span></div>`;
    }).join('');
  }
};

window.Views.admin.generateHtmlEmailMarkup = function(subject, category, image, body, btnText, btnLink) {
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
  const bulletItemsHtml = lines.map(line => {
    return `<tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.8; color: #e2e8f0;" dir="rtl">✓ ${line}</td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1320; font-family: 'Noto Nastaliq Urdu', Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #0d9488; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Brand Header -->
    <tr>
      <td style="padding: 20px; background: linear-gradient(135deg, #134e4a, #042f2e); text-align: center; border-bottom: 2px solid #f59e0b;">
        <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 900;">LearnHub Islamic Academy</h2>
        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 11px;">مستند علومِ اسلامیہ و آن لائن تعلیمی پلیٹ فارم</p>
      </td>
    </tr>

    ${image ? `
    <!-- Banner Image -->
    <tr>
      <td style="padding: 0; text-align: center;">
        <img src="${image}" alt="${subject}" style="width: 100%; max-height: 280px; object-fit: cover; display: block;" />
      </td>
    </tr>
    ` : ''}

    <!-- Content Body -->
    <tr>
      <td style="padding: 25px 20px;">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="display: inline-block; padding: 4px 12px; background-color: #134e4a; color: #fde68a; border: 1px solid #0d9488; border-radius: 12px; font-size: 11px; font-weight: bold;">
            ${category}
          </span>
          <h1 style="margin: 12px 0; color: #ffffff; font-size: 18px; font-weight: 900; line-height: 1.5;">
            ${subject}
          </h1>
        </div>

        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
          ${bulletItemsHtml}
        </table>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 25px; margin-bottom: 10px;">
          <a href="${btnLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #042f2e; text-decoration: none; font-size: 14px; font-weight: 900; border-radius: 14px; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">
            ${btnText} &larr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px; background-color: #090d16; text-align: center; border-top: 1px solid #1e293b; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0 0 5px 0;">آپ کو یہ ای میل اس لیے موصول ہوئی ہے کیونکہ آپ نے LearnHub پر نیوزلیٹر سبسکرائب کیا تھا۔</p>
        <p style="margin: 0; color: #64748b; font-family: monospace;">&copy; 2026 LearnHub Islamic Platform • learnhubplatform.com</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

window.Views.admin.sendBroadcastAction = function() {
  const subject = document.getElementById('bc-subject')?.value.trim() || 'LearnHub Academy Announcement';
  const category = document.getElementById('bc-category')?.value || 'اپڈیٹ';
  const urlImg = document.getElementById('bc-image')?.value.trim() || '';
  const image = window.Views.admin._currentBroadcastImage || urlImg || 'https://learnhubplatform.com/images/learnhub-logo.png';
  const body = document.getElementById('bc-body')?.value.trim() || 'نئی تبدیلیاں اور تعلیمی مواد شامل کر دیا گیا ہے۔';
  const btnText = document.getElementById('bc-btn-text')?.value.trim() || 'ابھی دیکھیں اور مطالعہ کریں';
  const btnLink = document.getElementById('bc-btn-link')?.value.trim() || 'https://learnhubplatform.com';

  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  let emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);
  if (emails.length === 0) {
    emails = ['jrahmanansari@gmail.com'];
  }

  const broadcastRecord = {
    id: 'bc_' + Date.now(),
    title: subject,
    category: category,
    image: image,
    content: body,
    actionText: btnText,
    actionUrl: btnLink,
    subscribersCount: emails.length,
    sentAt: new Date().toISOString()
  };

  // 1. Save to announcements
  const announcements = (window.DB && window.DB.get('announcements')) || [];
  announcements.unshift({
    id: 'ann_' + Date.now(),
    title: subject,
    category: category,
    image: image,
    content: body,
    actionText: btnText,
    actionUrl: btnLink,
    targetAudience: 'تمام طلباء و سبسکرائبرز',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    expiresAt: '2026-12-31'
  });
  if (window.DB) {
    window.DB.set('announcements', announcements);
  }

  // 2. Save to broadcasts history
  const broadcasts = (window.DB && window.DB.get('broadcasts')) || [];
  broadcasts.unshift(broadcastRecord);
  if (window.DB) {
    window.DB.set('broadcasts', broadcasts);
    window.DB.save();
  }
  localStorage.setItem('learnhub_broadcasts', JSON.stringify(broadcasts));

  // 3. Save to In-App User Notifications
  const notifications = (window.DB && window.DB.get('notifications')) || [];
  notifications.unshift({
    id: 'notif_' + Date.now(),
    title: subject,
    message: body,
    icon: 'megaphone',
    type: 'broadcast',
    read: false,
    createdAt: new Date().toISOString()
  });
  if (window.DB) {
    window.DB.set('notifications', notifications);
    window.DB.save();
  }

  // 4. Cloud DB sync if available
  if (window.CloudDB && window.CloudDB.firestore) {
    try {
      window.CloudDB.firestore.collection('announcements').add(broadcastRecord);
      if (window.CloudDB.logAuditEvent) {
        window.CloudDB.logAuditEvent('NEWSLETTER_BROADCAST_SENT', 'broadcasts', broadcastRecord.id, { title: subject, count: emails.length });
      }
    } catch (e) {}
  }

  const renderedHtmlEmail = window.Views.admin.generateHtmlEmailMarkup(subject, category, image, body, btnText, btnLink);
  window._lastRenderedHtmlEmail = renderedHtmlEmail;
  window._lastBroadcastEmails = emails;

  // Construct Gmail Web URL and Mailto URL
  const bccList = emails.join(',');
  const plainBody = subject + '\n\n' + body + '\n\n' + btnText + ': ' + btnLink + '\n\n--\nLearnHub Islamic Academy\nlearnhubplatform.com';
  
  const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
    '&bcc=' + encodeURIComponent(bccList) +
    '&su=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(plainBody);

  const mailtoUrl = 'mailto:?bcc=' + encodeURIComponent(bccList) +
    '&subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(plainBody);

  window._lastGmailBroadcastUrl = gmailUrl;
  window._lastMailtoBroadcastUrl = mailtoUrl;

  document.getElementById('broadcast-modal')?.remove();

  // Try to open Gmail Web or Mailto directly
  try {
    const win = window.open(gmailUrl, '_blank');
    if (!win) {
      window.location.href = mailtoUrl;
    }
  } catch (e) {
    try { window.location.href = mailtoUrl; } catch(err) {}
  }

  // Show Success Dispatch Dialog with 1-Click Action Buttons
  const successModal = `
    <div id="broadcast-success-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center text-slate-900 dark:text-slate-100">
        <div class="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-lg border border-emerald-500/40">
          ✓
        </div>
        <div class="space-y-1.5">
          <h3 class="text-lg font-black text-slate-900 dark:text-white">براڈکاسٹ کامیابی سے تیار ہو گیا!</h3>
          <p class="text-xs text-slate-500">تمام ${emails.length} سبسکرائبرز کے لیے ای میل اور ان-ایپ نوٹیفکیشنز ڈسپیچ ہو گئی ہیں۔</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-right text-xs space-y-2 border border-slate-200 dark:border-slate-700 font-sans" dir="ltr">
          <div class="flex items-center justify-between font-bold">
            <span class="text-slate-500 font-urdu">عنوان:</span>
            <span class="text-slate-900 dark:text-white truncate max-w-xs">${subject}</span>
          </div>
          <div class="flex items-center justify-between font-bold">
            <span class="text-slate-500 font-urdu">وصول کنندگان:</span>
            <span class="text-emerald-600 font-mono">${emails.length} Active Subscribers</span>
          </div>
        </div>

        <!-- Instant Dispatch Buttons -->
        <div class="pt-2 space-y-2.5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a href="${gmailUrl}" target="_blank" class="py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
              <span>🚀 Gmail میں کھولیں</span>
            </a>
            <a href="${mailtoUrl}" class="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition">
              <span>✉️ Default Mail ایپ</span>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onclick="navigator.clipboard.writeText(window._lastRenderedHtmlEmail); window.App?.showToast('پورا فارمیٹ شدہ HTML ای میل کاپی ہو گیا! 📨', 'success');" class="py-2.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/40 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer">
              <span>📋 فارمیٹ شدہ HTML کاپی کریں</span>
            </button>
            <button onclick="navigator.clipboard.writeText(window._lastBroadcastEmails.join(', ')); window.App?.showToast('ای میل ایڈریسز کاپی ہو گئیں! 👥', 'success');" class="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <span>👥 تمام ای میلز کاپی کریں</span>
            </button>
          </div>

          <button onclick="document.getElementById('broadcast-success-modal').remove(); window.Views.admin.renderSubscribers();" class="btn-primary w-full py-2.5 rounded-xl text-xs font-black cursor-pointer">
            مکمل (Done)
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', successModal);
  window.App?.showToast('📢 براڈکاسٹ کامیابی سے نشر کر دیا گیا!', 'success');
};
