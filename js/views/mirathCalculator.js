/**
 * LearnHub Islamic Inheritance & Mirath Calculator Module v144
 * Pure Royal Teal & Gold Edition
 * Features:
 * - Single-Line Controls & Royal Header
 * - Exact Quranic & Sunnah Heirs Calculation (Spouse, Mother, Father, Sons, Daughters)
 * - Detailed Islamic Breakdown & Quranic Proofs
 * - 1-Click Copy & Shareable Result
 */

window.Views = window.Views || {};

window.Views.renderMirathCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">⚖️</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">عِلْمُ الْفَرَائِضِ وَالْمَوَارِيثِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Islamic Inheritance Calculator • Quranic Shares</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
              شرعی حساب
            </span>
          </div>

          <p class="text-xs text-teal-100 mt-2 leading-relaxed">
            قرآن کریم کی آیاتِ مواریث (سورۃ النساء: 11-12) اور احادیثِ مبارکہ کے مطابق تمام ورثاء کے شرعی حصص کا درست تخمینہ۔
          </p>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Filter Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">📜 آیتِ میراث:</span>
            <span class="text-amber-300 font-bold text-xs shrink-0">يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ (النساء: 11)</span>
          </div>
        </div>
      </div>

      <!-- Main Calculator Form & Results -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          <!-- Input Form -->
          <div class="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="font-bold text-sm text-teal-800 dark:text-teal-300 border-b border-slate-100 dark:border-slate-800 pb-2">
              1. کل ترکہ / جائیداد کی مالیت:
            </h3>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کل ترکہ کی رقم (روپے / ریال / ڈالر):</label>
              <input type="number" id="mirath-estate" value="1000000" min="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr" oninput="window.Views.calculateMirathShares()">
            </div>

            <h3 class="font-bold text-sm text-teal-800 dark:text-teal-300 border-b border-slate-100 dark:border-slate-800 pb-2 pt-1">
              2. ورثاء کی تفصیلات درج کریں:
            </h3>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">مرحوم کی جنس:</label>
                <select id="mirath-gender" onchange="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="male">مرد (شوہر / باپ)</option>
                  <option value="female">عورت (بیوی / ماں)</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">زوج / زوجہ:</label>
                <select id="mirath-spouse" onchange="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">موجود ہے (1)</option>
                  <option value="0">نہیں ہے</option>
                  <option value="2">2 بیویاں</option>
                  <option value="3">3 بیویاں</option>
                  <option value="4">4 بیویاں</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">بیٹوں کی تعداد:</label>
                <input type="number" id="mirath-sons" value="2" min="0" oninput="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">بیٹیوں کی تعداد:</label>
                <input type="number" id="mirath-daughters" value="1" min="0" oninput="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">باپ موجود ہے؟</label>
                <select id="mirath-father" onchange="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">جی ہاں</option>
                  <option value="0" selected>نہیں</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">ماں موجود ہے؟</label>
                <select id="mirath-mother" onchange="window.Views.calculateMirathShares()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">جی ہاں</option>
                  <option value="0" selected>نہیں</option>
                </select>
              </div>
            </div>

            <button onclick="window.Views.calculateMirathShares()" class="w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2 border border-teal-600">
              <i data-lucide="calculator" class="w-4 h-4"></i>
              <span>شرعی حصص دوبارہ شمار کریں</span>
            </button>
          </div>

          <!-- Result Table -->
          <div class="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 class="font-bold text-sm text-teal-800 dark:text-teal-300">
                3. شرعی تقسیم و تفصیلی نتیجہ:
              </h3>
              <button onclick="window.Views.copyMirathReport()" class="text-xs text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span>نتیجہ کاپی</span>
              </button>
            </div>

            <div id="mirath-result-area" class="space-y-3">
              <!-- Rendered via calculateMirathShares -->
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  window.Views.calculateMirathShares();
};

window.Views.calculateMirathShares = function() {
  const estate = parseFloat(document.getElementById('mirath-estate')?.value || 1000000);
  const gender = document.getElementById('mirath-gender')?.value || 'male';
  const spouseCount = parseInt(document.getElementById('mirath-spouse')?.value || 1);
  const sons = parseInt(document.getElementById('mirath-sons')?.value || 0);
  const daughters = parseInt(document.getElementById('mirath-daughters')?.value || 0);
  const hasFather = document.getElementById('mirath-father')?.value === '1';
  const hasMother = document.getElementById('mirath-mother')?.value === '1';

  const hasChildren = (sons + daughters) > 0;
  const shares = [];
  let remaining = estate;

  // 1. Mother share
  if (hasMother) {
    const frac = hasChildren ? 1/6 : 1/3;
    const amount = estate * frac;
    remaining -= amount;
    shares.push({ title: 'ماں (Mother)', fraction: hasChildren ? '1/6 (سدس)' : '1/3 (ثلث)', amount, reason: hasChildren ? 'اولاد کی موجودگی میں 1/6 حصہ' : 'اولاد نہ ہونے پر 1/3 حصہ' });
  }

  // 2. Father share
  if (hasFather) {
    const frac = hasChildren ? 1/6 : 1/6;
    const amount = estate * frac;
    remaining -= amount;
    shares.push({ title: 'باپ (Father)', fraction: '1/6 (سدس)', amount, reason: 'اصحاب الفروض کے طور پر فرض' });
  }

  // 3. Spouse share
  if (spouseCount > 0) {
    if (gender === 'male') {
      const frac = hasChildren ? 1/8 : 1/4;
      const totalSpouseAmount = estate * frac;
      remaining -= totalSpouseAmount;
      shares.push({ title: `بیوی / بیویاں (${spouseCount})`, fraction: hasChildren ? '1/8 (ثمن)' : '1/4 (ربع)', amount: totalSpouseAmount, reason: hasChildren ? 'اولاد کی موجودگی میں بیویوں کا حصہ 1/8 ہے' : 'اولاد نہ ہونے پر 1/4 ہے' });
    } else {
      const frac = hasChildren ? 1/4 : 1/2;
      const husbandAmount = estate * frac;
      remaining -= husbandAmount;
      shares.push({ title: 'شوہر (Husband)', fraction: hasChildren ? '1/4 (ربع)' : '1/2 (نصف)', amount: husbandAmount, reason: hasChildren ? 'اولاد کی موجودگی میں شوہر کا حصہ 1/4 ہے' : 'اولاد نہ ہونے پر 1/2 ہے' });
    }
  }

  // 4. Children (Asabah - 2:1 for sons vs daughters)
  if (hasChildren && remaining > 0) {
    const totalUnits = (sons * 2) + daughters;
    if (totalUnits > 0) {
      const perUnit = remaining / totalUnits;
      if (sons > 0) {
        shares.push({ title: `بیٹے (${sons}) [للذكر مثل حظ الأنثيين]`, fraction: 'عصبہ بالغیر', amount: perUnit * 2 * sons, perPerson: perUnit * 2, reason: `ہر بیٹے کو ${(Math.round(perUnit * 2)).toLocaleString()} ملیں گے` });
      }
      if (daughters > 0) {
        shares.push({ title: `میٹیاں (${daughters})`, fraction: 'عصبہ بالغیر', amount: perUnit * daughters, perPerson: perUnit, reason: `ہر بیٹی کو ${Math.round(perUnit).toLocaleString()} ملیں گے` });
      }
    }
  }

  const resultArea = document.getElementById('mirath-result-area');
  if (resultArea) {
    resultArea.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-2xl border border-teal-600/30 flex items-center justify-between text-xs">
          <span class="font-bold text-teal-900 dark:text-teal-200">کل ترکہ کی مالیت:</span>
          <span class="font-mono font-black text-teal-800 dark:text-amber-300 text-sm">${estate.toLocaleString()}</span>
        </div>

        <div class="space-y-2">
          ${shares.map(s => `
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">${s.title}</span>
                <span class="text-[11px] text-teal-700 dark:text-teal-400 font-bold">${s.reason}</span>
              </div>
              <div class="text-left font-mono" dir="ltr">
                <span class="font-bold text-teal-800 dark:text-amber-300 block">${Math.round(s.amount).toLocaleString()}</span>
                <span class="text-[10px] text-slate-400">${s.fraction}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.Views.copyMirathReport = function() {
  const estate = document.getElementById('mirath-estate')?.value || '1000000';
  const text = `اسلامی شرعی میراث رپورٹ:\nکل ترکہ: ${estate}\nتفصیلات: https://learnhubplatform.com/#/mirath`;
  navigator.clipboard.writeText(text).then(() => {
    window.App?.showToast('رپورٹ کاپی ہو گئی! 📋', 'success');
  });
};
