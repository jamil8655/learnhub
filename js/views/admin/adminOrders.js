/**
 * LearnHub Admin Orders, Financial Transactions & Coupon Management Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderOrders = async function() {
  const container = document.getElementById('main-content');
  const orders = window.DB.get('orders') || [];
  const coupons = window.DB.get('coupons') || [];

  container.innerHTML = `
    <div class="space-y-8 font-urdu" dir="rtl">
      
      <!-- Orders Section -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">مالیاتی آرڈرز و ٹرانزیکشنز</h1>
            <p class="text-xs text-slate-500">ادائیگیوں کا لائیو آڈٹ، انوائسز، رسیدیں اور آرڈر ٹریکنگ۔</p>
          </div>
        </div>

        <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <input 
              type="text" 
              placeholder="آرڈر نمبر یا کسٹمر کے نام سے تلاش کریں..." 
              class="form-input text-xs max-w-xs font-urdu text-right"
              oninput="window.Views.admin.filterOrdersTable(this.value)"
            />
            <span class="text-xs text-slate-400">کل آرڈرز: <strong class="text-slate-900 dark:text-white font-mono">${orders.length}</strong></span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs" id="admin-orders-table">
              <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-3.5">آرڈر نمبر</th>
                  <th class="p-3.5">طالب علم / کسٹمر</th>
                  <th class="p-3.5">کورس / اشیاء</th>
                  <th class="p-3.5">سب ٹوٹل</th>
                  <th class="p-3.5">رعایت (Discount)</th>
                  <th class="p-3.5">کل رقم</th>
                  <th class="p-3.5">طریقہ ادائیگی</th>
                  <th class="p-3.5 text-center">اسٹیٹس</th>
                  <th class="p-3.5 text-left">انوائس و اختیارات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${orders.length === 0 ? `
                  <tr>
                    <td colspan="9" class="p-8 text-center text-slate-400">کوئی آرڈر ریکارڈ موجود نہیں ہے۔</td>
                  </tr>
                ` : orders.map(o => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">${o.orderNumber}</td>
                    <td class="p-3.5 font-bold text-slate-900 dark:text-white">${o.userName}</td>
                    <td class="p-3.5 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">${(o.items || []).map(i => i.title).join(', ')}</td>
                    <td class="p-3.5 text-slate-500 font-mono" dir="ltr">$${(o.subtotal || 0).toFixed(2)}</td>
                    <td class="p-3.5 text-emerald-600 font-semibold font-mono" dir="ltr">${o.discount > 0 ? '-$' + o.discount.toFixed(2) : '$0.00'}</td>
                    <td class="p-3.5 font-extrabold text-slate-900 dark:text-white font-mono" dir="ltr">$${(o.total || 0).toFixed(2)}</td>
                    <td class="p-3.5 text-[11px] text-slate-500 font-bold">${o.paymentMethod || 'Credit Card / JazzCash'}</td>
                    <td class="p-3.5 text-center">
                      <select onchange="window.Views.admin.updateOrderStatus('${o.id}', this.value)" class="form-select text-[10px] py-1 px-2 rounded-lg font-bold font-urdu bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>مکمل شدہ (Completed)</option>
                        <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>زیرِ عمل (Processing)</option>
                        <option value="refunded" ${o.status === 'refunded' ? 'selected' : ''}>واپس شدہ (Refunded)</option>
                        <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>منسوخ (Cancelled)</option>
                      </select>
                    </td>
                    <td class="p-3.5 text-left" dir="ltr">
                      <button onclick="window.Views.admin.viewOrderInvoice('${o.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        <i data-lucide="receipt" class="w-3.5 h-3.5"></i> رسید (Invoice)
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Coupons Management Section -->
      <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">رعایتی کوپنز منیجر (Discount Coupons)</h2>
            <p class="text-xs text-slate-500">خصوصی پروموشنل کوپنز بنائیں، فیصد یا فکسڈ رعایت مقرر کریں۔</p>
          </div>
          <button onclick="window.Views.admin.openCouponBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1.5 shadow">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> نیا کوپن بنائیں
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          ${coupons.map(cp => `
            <div class="lh-card p-5 space-y-3 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="font-mono text-sm font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                  ${cp.code}
                </span>
                <span class="badge ${cp.active ? 'badge-success' : 'badge-neutral'} text-[10px] uppercase font-bold">${cp.active ? 'فعال (ACTIVE)' : 'غیر فعال'}</span>
              </div>

              <div class="text-xl font-extrabold text-slate-900 dark:text-white font-mono" dir="ltr">
                ${cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `$${cp.discountValue} OFF`}
              </div>

              <div class="text-xs text-slate-500 space-y-1">
                <div>کم از کم خریداری: <strong class="font-mono">$${cp.minPurchase}</strong></div>
                <div>استعمال کی تعداد: <strong class="font-mono">${cp.usedCount} / ${cp.maxUsage}</strong></div>
                <div>آخری تاریخ: <strong class="font-mono">${cp.expiresAt || '2026-12-31'}</strong></div>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div class="flex gap-2">
                  <button onclick="window.Views.admin.openCouponBuilderModal('${cp.id}')" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                    ایڈٹ
                  </button>
                  <button onclick="window.Views.admin.toggleCouponActive('${cp.id}')" class="text-amber-600 font-bold hover:underline">
                    ${cp.active ? 'غیر فعال کریں' : 'فعال کریں'}
                  </button>
                </div>
                <button onclick="window.Views.admin.deleteCoupon('${cp.id}')" class="text-rose-500 font-bold hover:underline">
                  ڈیلیٹ کریں
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

window.Views.admin.filterOrdersTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-orders-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.updateOrderStatus = function(orderId, newStatus) {
  window.DB.update('orders', orderId, { status: newStatus });
  window.App.showToast(`آرڈر کا اسٹیٹس "${newStatus}" کر دیا گیا۔`, 'info');
};

window.Views.admin.viewOrderInvoice = function(orderId) {
  const o = window.DB.findById('orders', orderId);
  if (!o) return;

  window.App.showModal(`رسید و انوائس: ${o.orderNumber}`, `
    <div class="space-y-6 text-xs text-slate-700 dark:text-slate-300 font-urdu text-right" dir="rtl">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">لرن ہب اسلامی اکیڈمی - سرکاری رسید</h3>
          <div class="text-slate-400 text-[11px]">تاریخِ اجرا: ${new Date(o.createdAt).toLocaleDateString('ur-PK')}</div>
        </div>
        <span class="font-mono font-bold text-sm text-indigo-600">${o.orderNumber}</span>
      </div>

      <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <div class="font-bold text-slate-900 dark:text-white mb-1">بل بنام طالب علم:</div>
        <div class="font-bold text-emerald-600">${o.userName}</div>
        <div class="text-slate-400 text-[11px]">طریقہ ادائیگی: ${o.paymentMethod || 'Online'}</div>
      </div>

      <table class="w-full text-right">
        <thead class="bg-slate-100 dark:bg-slate-800/80 text-[10px] uppercase text-slate-500">
          <tr>
            <th class="p-2.5">کورس / تفصیل</th>
            <th class="p-2.5 text-left">قیمت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${(o.items || []).map(item => `
            <tr>
              <td class="p-2.5 font-bold text-slate-900 dark:text-white">${item.title}</td>
              <td class="p-2.5 text-left font-mono" dir="ltr">$${(item.price || 0).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-left font-mono" dir="ltr">
        <div>Subtotal: <strong>$${(o.subtotal || 0).toFixed(2)}</strong></div>
        ${o.discount > 0 ? `<div class="text-emerald-600 font-bold">Discount (${o.couponCode || 'PROMO'}): <strong>-$${o.discount.toFixed(2)}</strong></div>` : ''}
        <div class="text-base font-extrabold text-slate-900 dark:text-white pt-1">Total Paid: $${(o.total || 0).toFixed(2)}</div>
      </div>

      <div class="flex justify-center pt-2 gap-2" dir="ltr">
        <button onclick="window.print()" class="btn-primary py-2.5 px-5 text-xs rounded-xl flex items-center gap-1.5 bg-emerald-600 text-white font-bold">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i> پرنٹ رسید (Print Receipt)
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">بند کریں</button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openCouponBuilderModal = function(couponId = null) {
  const existing = couponId ? window.DB.findById('coupons', couponId) : null;

  window.App.showModal(existing ? 'رعایتی کوپن میں ترمیم کریں' : 'نیا رعایتی کوپن بنائیں', `
    <form onsubmit="window.Views.admin.saveCoupon(event, '${couponId || ''}')" class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کوپن کوڈ (انگریزی بڑے حروف میں)</label>
        <input type="text" id="cp-code" required value="${existing ? existing.code : ''}" placeholder="e.g. RAMADAN50" class="form-input text-xs uppercase font-mono text-left" dir="ltr">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">رعایت کی قسم</label>
          <select id="cp-type" class="form-input text-xs font-urdu">
            <option value="percentage" ${existing && existing.discountType === 'percentage' ? 'selected' : ''}>فیصد رعایت (%)</option>
            <option value="fixed" ${existing && existing.discountType === 'fixed' ? 'selected' : ''}>مقررہ ڈالر رعایت ($)</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">رعایت کی مقدار</label>
          <input type="number" id="cp-val" required value="${existing ? existing.discountValue : 20}" min="1" class="form-input text-xs font-mono">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کم از کم خریداری ($)</label>
          <input type="number" id="cp-min" value="${existing ? existing.minPurchase : 0}" min="0" class="form-input text-xs font-mono">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">زیادہ سے زیادہ استعمال</label>
          <input type="number" id="cp-max" value="${existing ? existing.maxUsage : 500}" min="1" class="form-input text-xs font-mono">
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">میعاد ختم ہونے کی تاریخ</label>
        <input type="date" id="cp-expiry" value="${existing ? existing.expiresAt : '2026-12-31'}" class="form-input text-xs font-mono">
      </div>
      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
          ${existing ? 'کوپن اپ ڈیٹ کریں' : 'کوپن محفوظ کریں'}
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveCoupon = function(e, couponId) {
  e.preventDefault();
  const code = document.getElementById('cp-code').value.toUpperCase().trim();
  const discountType = document.getElementById('cp-type').value;
  const discountValue = parseFloat(document.getElementById('cp-val').value) || 10;
  const minPurchase = parseFloat(document.getElementById('cp-min').value) || 0;
  const maxUsage = parseInt(document.getElementById('cp-max').value, 10) || 100;
  const expiresAt = document.getElementById('cp-expiry').value;

  const cpData = {
    id: couponId || undefined,
    code,
    discountType,
    discountValue,
    minPurchase,
    maxUsage,
    usedCount: couponId ? (window.DB.findById('coupons', couponId)?.usedCount || 0) : 0,
    active: true,
    expiresAt
  };

  if (couponId) {
    window.DB.update('coupons', couponId, cpData);
    window.App.showToast(`کوپن ${code} اپ ڈیٹ ہو گیا!`, 'success');
  } else {
    window.DB.insert('coupons', cpData);
    window.App.showToast(`نیا کوپن ${code} کامیابی سے شامل ہو گیا!`, 'success');
  }

  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', couponId ? 'COUPON_UPDATED' : 'COUPON_CREATED', code);
  window.App.closeModal();
  window.Views.admin.renderOrders();
};

window.Views.admin.toggleCouponActive = function(couponId) {
  const cp = window.DB.findById('coupons', couponId);
  if (!cp) return;

  window.DB.update('coupons', couponId, { active: !cp.active });
  window.App.showToast(`کوپن کی حالت تبدیل کر دی گئی۔`, 'info');
  window.Views.admin.renderOrders();
};

window.Views.admin.deleteCoupon = function(couponId) {
  if (confirm('کیا آپ واقعی یہ کوپن کوڈ حذف کرنا چاہتے ہیں؟')) {
    window.DB.delete('coupons', couponId);
    window.App.showToast('کوپن حذف کر دیا گیا۔', 'info');
    window.Views.admin.renderOrders();
  }
};

