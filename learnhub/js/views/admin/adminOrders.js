/**
 * LearnHub Admin Orders, Financial Transactions & Coupon Management Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderOrders = async function() {
  const container = document.getElementById('main-content');
  const orders = window.DB.get('orders');
  const coupons = window.DB.get('coupons');

  container.innerHTML = `
    <div class="space-y-8">
      
      <!-- Orders Section -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Orders & Transactions</h1>
            <p class="text-xs text-slate-500">Live payment audit trails, receipts, and order statuses.</p>
          </div>
        </div>

        <div class="lh-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Order Number</th>
                  <th class="p-3">Customer</th>
                  <th class="p-3">Course / Items</th>
                  <th class="p-3">Subtotal</th>
                  <th class="p-3">Discount</th>
                  <th class="p-3">Total</th>
                  <th class="p-3">Payment Method</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${orders.map(o => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">${o.orderNumber}</td>
                    <td class="p-3 font-medium">${o.userName}</td>
                    <td class="p-3 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">${o.items.map(i => i.title).join(', ')}</td>
                    <td class="p-3 text-slate-500">$${o.subtotal.toFixed(2)}</td>
                    <td class="p-3 text-emerald-600 font-semibold">${o.discount > 0 ? '-$' + o.discount.toFixed(2) : '$0.00'}</td>
                    <td class="p-3 font-extrabold text-slate-900 dark:text-white">$${o.total.toFixed(2)}</td>
                    <td class="p-3 text-[11px] text-slate-500">${o.paymentMethod}</td>
                    <td class="p-3"><span class="badge badge-success text-[9px] uppercase">${o.status}</span></td>
                    <td class="p-3 text-right">
                      <button onclick="window.Views.admin.viewOrderInvoice('${o.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg">
                        <i data-lucide="receipt" class="w-3.5 h-3.5 text-indigo-600"></i> Invoice
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
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Discount Coupons</h2>
            <p class="text-xs text-slate-500">Configure promotional campaigns, fixed or percentage discounts.</p>
          </div>
          <button onclick="window.Views.admin.openCouponBuilderModal()" class="btn-primary py-2 px-3 text-xs rounded-xl">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Create Coupon
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${coupons.map(cp => `
            <div class="lh-card p-5 space-y-3 relative overflow-hidden">
              <div class="flex items-center justify-between">
                <span class="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  ${cp.code}
                </span>
                <span class="badge ${cp.active ? 'badge-success' : 'badge-neutral'} text-[10px] uppercase">${cp.active ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>

              <div class="text-lg font-bold text-slate-900 dark:text-white">
                ${cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `$${cp.discountValue} OFF`}
              </div>

              <div class="text-xs text-slate-500 space-y-1">
                <div>Min Purchase: <strong>$${cp.minPurchase}</strong></div>
                <div>Usage: <strong>${cp.usedCount} / ${cp.maxUsage}</strong></div>
                <div>Expires: <strong>${cp.expiresAt}</strong></div>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <button onclick="window.Views.admin.toggleCouponActive('${cp.id}')" class="text-xs text-indigo-600 font-bold hover:underline">
                  ${cp.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="window.Views.admin.deleteCoupon('${cp.id}')" class="text-xs text-rose-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

window.Views.admin.viewOrderInvoice = function(orderId) {
  const o = window.DB.findById('orders', orderId);
  if (!o) return;

  window.App.showModal(`Invoice: ${o.orderNumber}`, `
    <div class="space-y-6 text-xs text-slate-700 dark:text-slate-300">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">LearnHub Academy Invoice</h3>
          <div class="text-slate-400 text-[11px]">Date: ${new Date(o.createdAt).toLocaleDateString()}</div>
        </div>
        <span class="font-mono font-bold text-sm text-indigo-600">${o.orderNumber}</span>
      </div>

      <div>
        <div class="font-bold text-slate-900 dark:text-white mb-1">Billed To:</div>
        <div>${o.userName}</div>
        <div class="text-slate-400">Payment via ${o.paymentMethod}</div>
      </div>

      <table class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase text-slate-400">
          <tr>
            <th class="p-2">Item</th>
            <th class="p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${o.items.map(item => `
            <tr>
              <td class="p-2 font-bold">${item.title}</td>
              <td class="p-2 text-right font-mono">$${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-right">
        <div>Subtotal: <strong>$${o.subtotal.toFixed(2)}</strong></div>
        ${o.discount > 0 ? `<div class="text-emerald-600">Discount (${o.couponCode}): <strong>-$${o.discount.toFixed(2)}</strong></div>` : ''}
        <div class="text-sm font-extrabold text-slate-900 dark:text-white pt-1">Total Paid: $${o.total.toFixed(2)}</div>
      </div>

      <div class="flex justify-center pt-2">
        <button onclick="window.print()" class="btn-primary py-2 px-5 text-xs rounded-xl">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print Receipt
        </button>
      </div>
    </div>
  `);
};

window.Views.admin.openCouponBuilderModal = function() {
  window.App.showModal('Create Discount Coupon', `
    <form onsubmit="window.Views.admin.saveCoupon(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code (Uppercase)</label>
        <input type="text" id="cp-code" required placeholder="e.g. FLASH30" class="form-input text-xs uppercase font-mono">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Type</label>
          <select id="cp-type" class="form-input text-xs">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Value</label>
          <input type="number" id="cp-val" required value="20" class="form-input text-xs">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Purchase ($)</label>
          <input type="number" id="cp-min" value="0" class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Redemptions</label>
          <input type="number" id="cp-max" value="500" class="form-input text-xs">
        </div>
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiration Date</label>
        <input type="date" id="cp-expiry" value="2026-12-31" class="form-input text-xs">
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Create Coupon</button>
    </form>
  `);
};

window.Views.admin.saveCoupon = function(e) {
  e.preventDefault();
  const code = document.getElementById('cp-code').value.toUpperCase().trim();
  const discountType = document.getElementById('cp-type').value;
  const discountValue = parseFloat(document.getElementById('cp-val').value) || 10;
  const minPurchase = parseFloat(document.getElementById('cp-min').value) || 0;
  const maxUsage = parseInt(document.getElementById('cp-max').value, 10) || 100;
  const expiresAt = document.getElementById('cp-expiry').value;

  window.DB.insert('coupons', {
    code,
    discountType,
    discountValue,
    minPurchase,
    maxUsage,
    usedCount: 0,
    active: true,
    expiresAt
  });

  window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'COUPON_CREATED', code);
  window.App.closeModal();
  window.App.showToast(`Coupon ${code} created!`, 'success');
  window.Router.handleRouting();
};

window.Views.admin.toggleCouponActive = function(couponId) {
  const cp = window.DB.findById('coupons', couponId);
  if (!cp) return;

  window.DB.update('coupons', couponId, { active: !cp.active });
  window.App.showToast(`Coupon status updated.`, 'info');
  window.Router.handleRouting();
};

window.Views.admin.deleteCoupon = function(couponId) {
  if (confirm('Delete this coupon?')) {
    window.DB.delete('coupons', couponId);
    window.App.showToast('Coupon deleted.', 'info');
    window.Router.handleRouting();
  }
};
