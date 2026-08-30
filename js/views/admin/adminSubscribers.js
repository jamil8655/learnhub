/**
 * LearnHub Admin Newsletter Subscribers & Broadcast Portal (v156.0.0)
 * Centralized subscriber management, CSV export, and email broadcasting
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

  const L = {
    title: isRtl ? 'اکیڈمی سبسکرائبرز و ای میل براڈکاسٹ' : 'Newsletter Subscribers & Broadcast Control',
    sub: isRtl ? 'ویب سائٹ فوٹر سے سبسکرائب کرنے والے صارفین کی مکمل فہرست اور ای میل الرٹس' : 'View all registered subscriber emails, export recipient lists, and broadcast announcements.',
    btnBroadcast: isRtl ? '📢 نیا ای میل براڈکاسٹ بھیجیں' : '📢 Broadcast Newsletter',
    btnExportCsv: isRtl ? '📥 CSV ڈاؤن لوڈ کریں' : '📥 Export Subscribers CSV',
    btnCopyAll: isRtl ? '📋 تمام ای میلز کاپی کریں' : '📋 Copy All Email Addresses',
    thEmail: isRtl ? 'ای میل ایڈریس' : 'Subscriber Email',
    thDate: isRtl ? 'تاریخ شمولیت' : 'Subscribed Date',
    thSource: isRtl ? 'ماخذ' : 'Source / Origin',
    thStatus: isRtl ? 'اسٹیٹس' : 'Status',
    thActions: isRtl ? 'اختیارات' : 'Actions'
  };

  container.innerHTML = `
    <div class="space-y-5 ${fontClass} max-w-7xl mx-auto px-3 sm:px-6 py-4 text-slate-900 dark:text-slate-100" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      ${window.Views.admin.renderAdminNav('subscribers')}

      <!-- Executive Header -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
            <span>📧 AUDIENCE ENGAGEMENT & OUTREACH</span>
          </div>
          <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            ${L.title}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            ${L.sub}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="window.Views.admin.copyAllSubscriberEmails()" class="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 shadow-xs">
            <span>${L.btnCopyAll}</span>
          </button>
          <button onclick="window.Views.admin.exportSubscribersCsv()" class="py-2.5 px-3.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-600/30 hover:bg-teal-100 transition flex items-center gap-1.5 shadow-xs">
            <span>${L.btnExportCsv}</span>
          </button>
          <button onclick="window.Views.admin.openBroadcastModal()" class="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
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
    <div id="broadcast-modal" class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">📢</span>
            <h3 class="text-sm font-black uppercase tracking-wider">Broadcast Newsletter</h3>
          </div>
          <button onclick="document.getElementById('broadcast-modal').remove()" class="p-1 text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipients Count</label>
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-teal-700 dark:text-teal-300">
              ${emails.length} Verified Subscribers
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Subject *</label>
            <input type="text" id="bc-subject" placeholder="e.g. New Islamic Courses & Ramadhan Schedule Released" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message Content *</label>
            <textarea id="bc-body" rows="4" placeholder="Type your announcement, newly uploaded classical books, or exam notifications..." class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"></textarea>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button onclick="document.getElementById('broadcast-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">Cancel</button>
          <button onclick="window.Views.admin.sendBroadcastAction()" class="py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md">Open in Mailer / Send</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('broadcast-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.Views.admin.sendBroadcastAction = function() {
  const subject = document.getElementById('bc-subject')?.value.trim() || 'LearnHub Academy Announcement';
  const body = document.getElementById('bc-body')?.value.trim() || 'Dear Scholar,\n\nNew learning resources are now available on LearnHub.\n\nVisit: https://learnhubplatform.com';
  
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const emails = subscribers.map(s => typeof s === 'string' ? s : s.email).filter(Boolean);

  const mailtoUrl = 'mailto:jrahmanansari@gmail.com?bcc=' + encodeURIComponent(emails.join(',')) + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  
  document.getElementById('broadcast-modal')?.remove();
  window.open(mailtoUrl, '_blank');
  window.App?.showToast('Broadcast email drafted to ' + emails.length + ' recipients! 📢', 'success');
};
