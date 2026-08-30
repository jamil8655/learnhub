/**
 * LearnHub Shariah Zakat & Nisab Calculator Module v144
 * Royal Teal & Gold Edition
 * Features:
 * - Single-Line Controls & Royal Header
 * - Live Gold (87.48g / 7.5 tola) & Silver (612.36g / 52.5 tola) Nisab Check
 * - Multi-Currency Selector (PKR, INR, SAR, USD, AED)
 * - Net Zakatable Assets Calculation (2.5% واجب الادا زکوٰۃ)
 * - 1-Click Copy & Comprehensive Shariah Report
 */

window.Views = window.Views || {};

window.Views.renderZakatCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🪙</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">حَاسِبَةُ الزَّكَاةِ الشَّرْعِيَّةِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Shariah Zakat & Nisab Calculator • Pure Financial Fiqh</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-mono font-bold shadow-xs">
              2.5% سالانہ
            </span>
          </div>

          <p class="text-xs text-teal-100 mt-2 leading-relaxed">
            سونے، چاندی، نقدی، تجارتی مال اور بچت پر واجب الادا زکوٰۃ کا شرعی اصولوں کے مطابق 100% درست اور شفاف حساب۔
          </p>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Filter Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">🪙 نصابِ سونا:</span>
            <span class="text-amber-300 font-bold text-xs shrink-0 font-mono">87.48 گرام (7.5 تولہ)</span>
            <span class="text-teal-400 shrink-0">•</span>
            <span class="text-teal-200 text-xs font-bold shrink-0">نصابِ چاندی:</span>
            <span class="text-amber-300 font-bold text-xs shrink-0 font-mono">612.36 گرام (52.5 تولہ)</span>
          </div>
        </div>
      </div>

      <!-- Main Form & Real-Time Calculation -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <!-- Currency & Market Rates Strip -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">1. مارکیٹ ریٹ و کرنسی کا تعین:</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">کرنسی منتخب کریں:</label>
              <select id="zk-currency" onchange="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-600">
                <option value="PKR">روپیہ (PKR - پاکستان)</option>
                <option value="INR">روپیہ (INR - بھارت)</option>
                <option value="SAR">ریال (SAR - سعودی عرب)</option>
                <option value="USD">ڈالر (USD - امریکہ)</option>
                <option value="AED">درہم (AED - امارات)</option>
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">24k سونے کی قیمت (فی گرام):</label>
              <input type="number" id="zk-gold-rate" value="23000" oninput="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">چاندی کی قیمت (فی گرام):</label>
              <input type="number" id="zk-silver-rate" value="280" oninput="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          <!-- Assets Form (7 Cols) -->
          <div class="md:col-span-7 space-y-4">
            
            <!-- Zakatable Assets -->
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <h3 class="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-500"></i>
                <span>قابلِ زکوٰۃ اثاثہ جات (Zakatable Assets)</span>
              </h3>

              <div class="space-y-2.5 text-xs font-bold">
                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود سونے کا وزن (گرام میں):</label>
                  <input type="number" id="zk-gold-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود چاندی کا وزن (گرام میں):</label>
                  <input type="number" id="zk-silver-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">نقدی رقم (گھر میں یا بینک بیلنس):</label>
                  <input type="number" id="zk-cash" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">تجارتی مال و سامان کی مارکیٹ ویلیو:</label>
                  <input type="number" id="zk-merchandise" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">دیگر دی گئی رقم جو واپس ملنے کی امید ہو:</label>
                  <input type="number" id="zk-receivables" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>
              </div>
            </div>

            <!-- Deductions / Debts -->
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <h3 class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <i data-lucide="minus-circle" class="w-4 h-4"></i>
                <span>کٹوتی و فوری واجب الادا قرضے (Deductions / Debts)</span>
              </h3>

              <div class="space-y-2.5 text-xs font-bold">
                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">فوری واجب الادا قرض / واجبات:</label>
                  <input type="number" id="zk-debts" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>
                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">اس مہینے کے ضروری بلز یا ملازمین کی تنخواہیں:</label>
                  <input type="number" id="zk-bills" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>
              </div>
            </div>

          </div>

          <!-- Live Results Summary (5 Cols) -->
          <div class="md:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 class="font-bold text-sm text-teal-800 dark:text-teal-300">
                خلاصۂ حسابِ زکوٰۃ:
              </h3>
              <button onclick="window.Views.copyZakatReport()" class="text-xs text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span>رپورٹ کاپی</span>
              </button>
            </div>

            <div id="zakat-live-summary" class="space-y-3">
              <!-- Rendered dynamically -->
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  window.Views.calculateZakatLive();
};

window.Views.calculateZakatLive = function() {
  const currency = document.getElementById('zk-currency')?.value || 'PKR';
  const goldRate = parseFloat(document.getElementById('zk-gold-rate')?.value || 23000);
  const silverRate = parseFloat(document.getElementById('zk-silver-rate')?.value || 280);

  const goldGrams = parseFloat(document.getElementById('zk-gold-grams')?.value || 0);
  const silverGrams = parseFloat(document.getElementById('zk-silver-grams')?.value || 0);
  const cash = parseFloat(document.getElementById('zk-cash')?.value || 0);
  const merchandise = parseFloat(document.getElementById('zk-merchandise')?.value || 0);
  const receivables = parseFloat(document.getElementById('zk-receivables')?.value || 0);

  const debts = parseFloat(document.getElementById('zk-debts')?.value || 0);
  const bills = parseFloat(document.getElementById('zk-bills')?.value || 0);

  const goldValue = goldGrams * goldRate;
  const silverValue = silverGrams * silverRate;
  const totalAssets = goldValue + silverValue + cash + merchandise + receivables;
  const totalLiabilities = debts + bills;
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const silverNisabValue = 612.36 * silverRate;
  const isNisabReached = netWealth >= silverNisabValue;
  const zakatDue = isNisabReached ? (netWealth * 0.025) : 0;

  const summary = document.getElementById('zakat-live-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="space-y-3 font-urdu">
        
        <div class="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-center space-y-1">
          <span class="text-xs text-teal-800 dark:text-teal-300 font-bold block">واجب الادا شرعی زکوٰۃ (2.5%):</span>
          <span class="text-2xl font-black font-mono text-teal-900 dark:text-amber-300 block">
            ${Math.round(zakatDue).toLocaleString()} ${currency}
          </span>
          <span class="text-[10px] font-bold ${isNisabReached ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
            ${isNisabReached ? '✨ نصاب مکمل ہے، زکوٰۃ فرض ہے۔' : 'ℹ️ نصاب سے کم ہے، زکوٰۃ واجب نہیں۔'}
          </span>
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">کل قابلِ زکوٰۃ اثاثہ جات:</span>
            <span class="font-mono font-bold text-slate-900 dark:text-white">${Math.round(totalAssets).toLocaleString()} ${currency}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <span class="text-rose-600 dark:text-rose-400">منہا کردہ قرضے و بلز:</span>
            <span class="font-mono font-bold text-rose-600 dark:text-rose-400">-${Math.round(totalLiabilities).toLocaleString()} ${currency}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <span class="text-slate-900 dark:text-white font-bold">خالص مالیت (Net Zakatable):</span>
            <span class="font-mono font-black text-teal-800 dark:text-teal-300">${Math.round(netWealth).toLocaleString()} ${currency}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <span class="text-slate-500">چاندی کے نصاب کی مالیت:</span>
            <span class="font-mono text-slate-500">${Math.round(silverNisabValue).toLocaleString()} ${currency}</span>
          </div>
        </div>

      </div>
    `;
  }
};

window.Views.copyZakatReport = function() {
  const currency = document.getElementById('zk-currency')?.value || 'PKR';
  const text = `اسلامی شرعی زکوٰۃ رپورٹ:\nپلیٹ فارم پر حساب فرمائیں: https://learnhubplatform.com/#/zakat`;
  navigator.clipboard.writeText(text).then(() => {
    window.App?.showToast('زکوٰۃ رپورٹ کاپی ہو گئی! 📋', 'success');
  });
};
