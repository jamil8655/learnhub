/**
 * LearnHub Admin Newsletter Subscribers & Broadcast Studio (v167.0.0)
 * Visual announcement composer with image preview, changelog bullets,
 * in-app DB sync, and 1-click subscriber email dispatch.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

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
    title: isRtl ? 'سبسکرائبرز مینجمنٹ و تصویری براڈکاسٹ اسٹوڈیو' : 'Newsletter Subscribers & Rich Broadcast Studio',
    sub: isRtl ? 'سبسکرائب کرنے والے تمام صارفین کو تصاویر، اپڈیٹ تفصیلات اور ایکشن لنکس کے ساتھ میسج بھیجیں' : 'Compose rich announcements with banners, changelogs, and action buttons to broadcast to all subscribers.',
    btnBroadcast: isRtl ? '📢 نیا تصویری براڈکاسٹ تیار کریں' : '📢 Compose Rich Broadcast',
    btnExportCsv: isRtl ? '📥 CSV ڈاؤن لوڈ کریں' : '📥 Export CSV',
    btnCopyAll: isRtl ? '📋 تمام ای میلز کاپی کریں' : '📋 Copy Emails',
    thEmail: isRtl ? 'ای میل ایڈریس' : 'Subscriber Email',
    thDate: isRtl ? 'تاریخ شمولیت' : 'Subscribed Date',
    thSource: isRtl ? 'ماخذ' : 'Origin',
    thStatus: isRtl ? 'اسٹیٹس' : 'Status',
    thActions: isRtl ? 'اختیارات' : 'Actions'
  };

  container.innerHTML = `
    <div class="space-y-5 ${fontClass} max-w-7xl mx-auto px-3 sm:px-6 py-4 text-slate-900 dark:text-slate-100" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      ${window.Views.admin.renderAdminNav('subscribers')}

      <!-- Executive Header -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-950 text-white border border-teal-600/50 p-5 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-800 text-amber-300 border border-teal-500/40 text-[10px] font-bold font-mono">
            <span>📡 SUBSCRIBERS OUTREACH & BROADCAST SUITE</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-white">
            ${L.title}
          </h2>
          <p class="text-xs text-teal-200/90 max-w-2xl leading-relaxed">
            ${L.sub}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="window.Views.admin.copyAllSubscriberEmails()" class="py-2.5 px-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 font-bold text-xs border border-teal-600/40 transition flex items-center gap-1.5 shadow-sm">
            <span>${L.btnCopyAll}</span>
          </button>
          <button onclick="window.Views.admin.exportSubscribersCsv()" class="py-2.5 px-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 font-bold text-xs border border-teal-600/40 transition flex items-center gap-1.5 shadow-sm">
            <span>${L.btnExportCsv}</span>
          </button>
          <button onclick="window.Views.admin.openBroadcastModal()" class="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md flex items-center gap-1.5 transition active:scale-95">
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
                      <button onclick="window.Views.admin.deleteSubscriber('${email}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs" title="Remove Subscriber">
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
  window.DB.set('subscribers', subscribers);
  window.DB.save();
  localStorage.setItem('learnhub_subscribers', JSON.stringify(subscribers));
  window.App?.showToast('Subscriber removed', 'info');
  window.Views.admin.renderSubscribers();
};

window.Views.admin.openBroadcastModal = function() {
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);

  const modalHtml = `
    <div id="broadcast-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs my-8 max-h-[90vh] flex flex-col">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📢</span>
            <div>
              <h3 class="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                تصویری براڈکاسٹ و اپڈیٹ میسنجر (Rich Broadcast Studio)
              </h3>
              <p class="text-[11px] text-slate-500">
                سبسکرائبرز (${emails.length}) کو نئی تبدیلیاں، تصاویر اور لنکس بھیجیں
              </p>
            </div>
          </div>
          <button onclick="document.getElementById('broadcast-modal').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-4 overflow-y-auto pr-1 flex-1">
          <!-- Category & Subject -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کیٹیگری *</label>
              <select id="bc-category" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                <option value="🚀 نئی خصوصیت اور اپڈیٹ">🚀 نئی خصوصیت اور اپڈیٹ</option>
                <option value="📖 نیا قرآنی و اسلامی مواد">📖 نیا قرآنی و اسلامی مواد</option>
                <option value="🎓 نیا کورس و امتحان">🎓 نیا کورس و امتحان</option>
                <option value="📢 اہم اکیڈمی اعلان">📢 اہم اکیڈمی اعلان</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">اعلان کا عنوان / سبجیکٹ *</label>
              <input type="text" id="bc-subject" placeholder="مثلاً: LearnHub میں صوتی تلاوت اور لائیو تجوید کا نیا اپڈیٹ شامل!" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
          </div>

          <!-- Featured Image URL -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">تصویر یا بینر کا لنک (Image URL)</label>
            <input type="url" id="bc-image" placeholder="https://example.com/banner.jpg (یا خالی چھوڑ دیں)" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500" />
          </div>

          <!-- Changelog & Description -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کیا تبدیلیاں کی گئی ہیں؟ (Changelog / تفصیلات) *</label>
            <textarea id="bc-body" rows="4" placeholder="• تمام 114 سورتوں میں لائیو صوتی تلاوت شامل کر دی گئی ہے۔&#10;• ہوم پیج پر ایڈونچر کارڈ اور نئے ٹولز فعال ہو گئے ہیں۔&#10;• سیکیورٹی اور کارکردگی میں زبردست اضافہ کیا گیا ہے۔" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"></textarea>
          </div>

          <!-- Action Button Link & Label -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">بٹن کا نام (Action Button Text)</label>
              <input type="text" id="bc-btn-text" value="ابھی دیکھیں اور تلاوت کریں" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">بٹن کا لنک (URL / Route)</label>
              <input type="text" id="bc-btn-link" value="https://learnhubplatform.com/#/quran/1" oninput="window.Views.admin.updateBroadcastPreview()" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" />
            </div>
          </div>

          <!-- Live Visual Preview Box -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">لائیو کارڈ پریویو (Live Preview for Subscribers)</label>
            <div id="bc-live-preview" class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div id="bc-prev-img-wrap" class="hidden">
                <img id="bc-prev-img" src="" alt="Banner" class="w-full h-36 object-cover rounded-xl shadow-xs" />
              </div>
              <div class="space-y-1">
                <span id="bc-prev-cat" class="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-[10px]">🚀 نئی خصوصیت اور اپڈیٹ</span>
                <h4 id="bc-prev-title" class="font-black text-sm text-slate-900 dark:text-white">اعلان کا عنوان یہاں نظر آئے گا...</h4>
                <p id="bc-prev-desc" class="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">تفصیلات یہاں نظر آئیں گی...</p>
              </div>
              <div>
                <a id="bc-prev-btn" href="#" class="inline-block py-2 px-4 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-xs">ابھی دیکھیں اور تلاوت کریں</a>
              </div>
            </div>
          </div>

        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
          <span class="text-[11px] text-teal-700 dark:text-teal-400 font-bold font-mono">
            ${emails.length} سبسکرائبرز کو بھیجا جائے گا
          </span>
          <div class="flex items-center gap-2">
            <button onclick="document.getElementById('broadcast-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">Cancel</button>
            <button onclick="window.Views.admin.sendBroadcastAction()" class="py-2 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black shadow-md active:scale-95 transition">
              📢 تمام سبسکرائبرز کو بھیجیں
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.getElementById('broadcast-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.Views.admin.updateBroadcastPreview = function() {
  const cat = document.getElementById('bc-category')?.value || '';
  const subj = document.getElementById('bc-subject')?.value || 'اعلان کا عنوان یہاں نظر آئے گا...';
  const img = document.getElementById('bc-image')?.value.trim() || '';
  const body = document.getElementById('bc-body')?.value || 'تفصیلات یہاں نظر آئیں گی...';
  const btnText = document.getElementById('bc-btn-text')?.value || 'ابھی دیکھیں';
  const btnLink = document.getElementById('bc-btn-link')?.value || '#';

  const prevCat = document.getElementById('bc-prev-cat');
  const prevTitle = document.getElementById('bc-prev-title');
  const prevDesc = document.getElementById('bc-prev-desc');
  const prevBtn = document.getElementById('bc-prev-btn');
  const prevImgWrap = document.getElementById('bc-prev-img-wrap');
  const prevImg = document.getElementById('bc-prev-img');

  if (prevCat) prevCat.textContent = cat;
  if (prevTitle) prevTitle.textContent = subj;
  if (prevDesc) prevDesc.textContent = body;
  if (prevBtn) {
    prevBtn.textContent = btnText;
    prevBtn.href = btnLink;
  }
  if (prevImgWrap && prevImg) {
    if (img && img.startsWith('http')) {
      prevImg.src = img;
      prevImgWrap.classList.remove('hidden');
    } else {
      prevImgWrap.classList.add('hidden');
    }
  }
};

window.Views.admin.sendBroadcastAction = function() {
  const subject = document.getElementById('bc-subject')?.value.trim() || 'LearnHub Academy Announcement';
  const category = document.getElementById('bc-category')?.value || 'اپڈیٹ';
  const image = document.getElementById('bc-image')?.value.trim() || '';
  const body = document.getElementById('bc-body')?.value.trim() || 'نئی تبدیلیاں اور تعلیمی مواد شامل کر دیا گیا ہے۔';
  const btnText = document.getElementById('bc-btn-text')?.value.trim() || 'ابھی دیکھیں';
  const btnLink = document.getElementById('bc-btn-link')?.value.trim() || 'https://learnhubplatform.com';

  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);

  // Save to DB announcements so in-app users see the notification
  const announcements = (window.DB && window.DB.get('announcements')) || [];
  announcements.unshift({
    id: 'ann_' + Date.now(),
    title: subject,
    category: category,
    image: image,
    content: body,
    actionText: btnText,
    actionUrl: btnLink,
    createdAt: new Date().toISOString()
  });
  if (window.DB) {
    window.DB.set('announcements', announcements);
    window.DB.save();
  }

  // Compose clean formatted email body
  const fullMailBody = `${category} - ${subject}\n\n${body}\n\n${image ? 'Banner: ' + image + '\n\n' : ''}${btnText}: ${btnLink}\n\nWith best regards,\nLearnHub Islamic EdTech Platform`;
  const mailtoUrl = 'mailto:jrahmanansari@gmail.com?bcc=' + encodeURIComponent(emails.join(',')) + '&subject=' + encodeURIComponent(`[LearnHub] ${subject}`) + '&body=' + encodeURIComponent(fullMailBody);

  document.getElementById('broadcast-modal')?.remove();
  window.open(mailtoUrl, '_blank');
  window.App?.showToast('📢 براڈکاسٹ میسج تیار کر کے تمام سبسکرائبرز (' + emails.length + ') کے لیے بھیج دیا گیا!', 'success');
};
