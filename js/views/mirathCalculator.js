/**
 * LearnHub Islamic Inheritance & Mirath Calculator Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderMirathCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="scale" class="w-4 h-4 text-teal-600"></i>
            <span>علم الفرائض و وراثت کیلکولیٹر (Islamic Mirath Calculator)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">اسلامی تقسیمِ ترکہ و وراثت</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            قرآن و سنت کی روشنی میں اصحاب الفروض اور عصبات کے شرعی حصص کا خودکار اور مستند حساب۔
          </p>
        </div>

        <!-- Calculator Form & Results Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Input Form -->
          <div class="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-5">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              1. کل جائیداد / ترکہ کی مالیت:
            </h3>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کل ترکہ کی رقم (روپے / ریال / ڈالر):</label>
              <input type="number" id="mirath-estate" value="1000000" min="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
            </div>

            <h3 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 pt-2">
              2. ورثاء کی تفصیلات:
            </h3>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">مرحوم کی جنس:</label>
                <select id="mirath-gender" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="male">مرد (شوہر / باپ)</option>
                  <option value="female">عورت (بیوی / ماں)</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">زوج / زوجہ:</label>
                <select id="mirath-spouse" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">موجود ہے (1)</option>
                  <option value="0">نہیں ہے</option>
                  <option value="2">2 بیویاں</option>
                  <option value="3">3 بیویاں</option>
                  <option value="4">4 بیویاں</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">بیٹوں کی تعداد:</label>
                <input type="number" id="mirath-sons" value="2" min="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">بیٹیوں کی تعداد:</label>
                <input type="number" id="mirath-daughters" value="1" min="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">باپ موجود ہے؟</label>
                <select id="mirath-father" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">جی ہاں</option>
                  <option value="0" selected>نہیں</option>
                </select>
              </div>

              <div>
                <label class="text-slate-600 dark:text-slate-400 block mb-1">ماں موجود ہے؟</label>
                <select id="mirath-mother" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
                  <option value="1">جی ہاں</option>
                  <option value="0" selected>نہیں</option>
                </select>
              </div>
            </div>

            <button onclick="window.Views.calculateMirathShares()" class="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2">
              <i data-lucide="calculator" class="w-4 h-4"></i>
              <span>شرعی حصص تقسیم کریں</span>
            </button>
          </div>

          <!-- Result Table -->
          <div class="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              3. شرعی تقسیم و تفصیلی نتیجہ:
            </h3>

            <div id="mirath-result-area" class="space-y-3">
              <p class="text-xs text-slate-500">حساب لگانے کے لیے 'شرعی حصص تقسیم کریں' بٹن پر کلک کریں۔</p>
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
    const frac = hasChildren ? 1/6 : 1/6; // Asabah if no sons
    const amount = estate * frac;
    remaining -= amount;
    shares.push({ title: 'باپ (Father)', fraction: '1/6 (سدس)', amount, reason: 'اصحاب الفروض کے طور پر فرض' });
  }

  // 3. Spouse share
  if (spouseCount > 0) {
    if (gender === 'male') {
      // Deceased was male, heirs are wives
      const frac = hasChildren ? 1/8 : 1/4;
      const totalSpouseAmount = estate * frac;
      remaining -= totalSpouseAmount;
      shares.push({ title: `بیوی / بیویاں (${spouseCount})`, fraction: hasChildren ? '1/8 (ثمن)' : '1/4 (ربع)', amount: totalSpouseAmount, reason: hasChildren ? 'اولاد کی موجودگی میں بیویوں کا حصہ 1/8 ہے' : 'اولاد نہ ہونے پر 1/4 ہے' });
    } else {
      // Deceased was female, heir is husband
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
        shares.push({ title: `بیٹے (${sons}) [للذكر مثل حظ الأنثيين]`, fraction: 'عصبہ بالغیر', amount: perUnit * 2 * sons, perPerson: perUnit * 2, reason: `ہر بیٹے کو ${(perUnit * 2).toLocaleString()} روپے ملیں گے` });
      }
      if (daughters > 0) {
        shares.push({ title: `میٹیاں (${daughters})`, fraction: 'عصبہ بالغیر', amount: perUnit * daughters, perPerson: perUnit, reason: `ہر بیٹی کو ${perUnit.toLocaleString()} روپے ملیں گے` });
      }
    }
  }

  const resultArea = document.getElementById('mirath-result-area');
  if (resultArea) {
    resultArea.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-600/30 flex items-center justify-between text-xs">
          <span class="font-bold text-teal-900 dark:text-teal-200">کل ترکہ:</span>
          <span class="font-mono font-black text-teal-700 dark:text-teal-300 text-sm">${estate.toLocaleString()} روپے</span>
        </div>

        <div class="space-y-2">
          ${shares.map(s => `
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">${s.title}</span>
                <span class="text-[10px] text-slate-500">${s.reason}</span>
              </div>
              <div class="text-left font-mono" dir="ltr">
                <span class="font-bold text-teal-700 dark:text-teal-400 block">${s.amount.toLocaleString()}</span>
                <span class="text-[10px] text-slate-400">${s.fraction}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
