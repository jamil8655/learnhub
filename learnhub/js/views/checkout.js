/**
 * LearnHub E-Commerce Checkout & Payment Architecture
 */

window.Views = window.Views || {};

let checkoutState = {
  course: null,
  coupon: null,
  discountAmount: 0
};

window.Views.renderCheckout = async function(params, query) {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('Please sign in to proceed with checkout.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const courseId = query.courseId;
  const course = await window.API.getCourseById(courseId);

  if (!course) {
    container.innerHTML = `<div class="p-12 text-center">Course not found.</div>`;
    return;
  }

  checkoutState = {
    course,
    coupon: null,
    discountAmount: 0
  };

  window.Views.renderCheckoutWorkspace();
};

window.Views.renderCheckoutWorkspace = function() {
  const container = document.getElementById('main-content');
  const { course, coupon, discountAmount } = checkoutState;
  const subtotal = course.price;
  const total = Math.max(0, subtotal - discountAmount);

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Secure Checkout</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Instant enrollment and lifetime masterclass access.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Payment Methods & Form -->
        <div class="lg:col-span-7 lh-card p-6 space-y-6">
          <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="credit-card" class="w-4 h-4 text-indigo-600"></i> Payment Information
          </h3>

          <div class="space-y-3">
            <label class="flex items-center gap-3 p-3.5 border border-indigo-500 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 cursor-pointer">
              <input type="radio" name="payment-method" checked class="text-indigo-600 focus:ring-indigo-500">
              <span class="text-xs font-bold text-slate-900 dark:text-white">Credit / Debit Card (Stripe Gateway)</span>
            </label>
            <label class="flex items-center gap-3 p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
              <input type="radio" name="payment-method" class="text-indigo-600 focus:ring-indigo-500">
              <span class="text-xs font-bold text-slate-900 dark:text-white">PayPal Express</span>
            </label>
          </div>

          <form onsubmit="window.Views.processPayment(event)" class="space-y-4 pt-2">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Name on Card</label>
              <input type="text" value="${window.Auth.getCurrentUser()?.name || ''}" required class="form-input text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• 4242" value="4242 4242 4242 4242" required class="form-input text-xs font-mono">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiry</label>
                <input type="text" placeholder="MM/YY" value="12/28" required class="form-input text-xs font-mono">
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">CVC / CVV</label>
                <input type="text" placeholder="123" value="888" required class="form-input text-xs font-mono">
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" class="btn-primary w-full py-3 text-sm rounded-xl">
                <span>Pay $${total.toFixed(2)} & Complete Enrollment</span>
                <i data-lucide="lock" class="w-4 h-4"></i>
              </button>
            </div>
          </form>
        </div>

        <!-- Right Order Summary -->
        <div class="lg:col-span-5 lh-card p-6 space-y-6">
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Order Summary</h3>

          <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img src="${course.thumbnail}" class="w-16 h-12 rounded-lg object-cover">
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${course.title}</h4>
              <span class="text-[11px] text-slate-400">By ${course.instructor?.name || 'LearnHub Faculty'}</span>
            </div>
          </div>

          <!-- Coupon Input -->
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Apply Coupon</label>
            <div class="flex gap-2">
              <input type="text" id="coupon-code-input" placeholder="e.g. LEARN20" class="form-input text-xs uppercase font-mono">
              <button onclick="window.Views.applyCheckoutCoupon()" class="btn-secondary py-1.5 px-3 text-xs">Apply</button>
            </div>
            ${coupon ? `
              <div class="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                <i data-lucide="tag" class="w-3.5 h-3.5"></i> Coupon "${coupon.code}" applied!
              </div>
            ` : ''}
          </div>

          <!-- Line Items -->
          <div class="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
            <div class="flex justify-between text-slate-500">
              <span>Original Price</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div class="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>-$${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Amount</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i> 256-Bit SSL Encrypted & Secure
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Views.applyCheckoutCoupon = function() {
  const code = document.getElementById('coupon-code-input')?.value?.trim().toUpperCase();
  if (!code) return;

  const coupons = window.DB.get('coupons');
  const found = coupons.find(c => c.code.toUpperCase() === code && c.active);

  if (!found) {
    window.App.showToast('Invalid or expired coupon code.', 'danger');
    return;
  }

  const subtotal = checkoutState.course.price;
  let discount = 0;
  if (found.discountType === 'percentage') {
    discount = (subtotal * found.discountValue) / 100;
  } else {
    discount = found.discountValue;
  }

  checkoutState.coupon = found;
  checkoutState.discountAmount = discount;
  window.App.showToast(`Coupon applied: saved $${discount.toFixed(2)}!`, 'success');
  window.Views.renderCheckoutWorkspace();
};

window.Views.processPayment = async function(e) {
  e.preventDefault();
  const user = window.Auth.getCurrentUser();
  const { course, coupon, discountAmount } = checkoutState;
  const total = Math.max(0, course.price - discountAmount);

  const orderNumber = `LH-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: user.id,
    userName: user.name,
    items: [{ id: course.id, title: course.title, price: course.price }],
    subtotal: course.price,
    discount: discountAmount,
    total,
    couponCode: coupon ? coupon.code : null,
    paymentMethod: 'Credit Card (Stripe)',
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  window.DB.insert('orders', order);
  window.DB.logAudit(user.name, 'ORDER_COMPLETED', `${orderNumber} ($${total})`);

  // Auto enroll
  await window.API.enrollInCourse(course.id, user.id);

  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  window.App.showModal('Payment Successful!', `
    <div class="text-center space-y-4 py-4">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h3>
      <p class="text-xs text-slate-600 dark:text-slate-400">Order ID: <strong class="font-mono">${orderNumber}</strong></p>
      <p class="text-xs text-slate-500">You now have immediate, lifetime access to <strong>${course.title}</strong>.</p>
      <div class="pt-3">
        <a href="#/learn/${course.id}" onclick="window.App.closeModal()" class="btn-primary py-2.5 px-6 text-xs rounded-xl">
          Start Learning Now &rarr;
        </a>
      </div>
    </div>
  `);
};
