/**
 * LearnHub Islamic Zakat Calculator Module
 * Accurate Shariah calculation for Gold, Silver, Cash, Merchandise, Investments,
 * minus immediate debts, providing exact 2.5% Zakat output with authentic references.
 */

window.Views = window.Views || {};

window.Views.renderZakatCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const isRtl = window.I18N ? window.I18N.isRTL() : true;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 ${isRtl ? 'font-urdu text-right' : 'text-left'} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Zakat Hero Banner -->
      <div class="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-500/40">
        <div class="space-y-3 text-center sm:text-right">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
            <span>✨ رکنِ سوم: ادائے زکوٰۃ (Shariah Zakat Calculator)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-amber-300 font-arabic">حاسبۂ زکوٰۃ شرعیہ و نصاب</h1>
          <p class="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed mx-auto sm:mx-0">
            سونے، چاندی، نقدی، تجارتی مال اور بچت پر واجب الادا زکوٰۃ کا شرعی اصولوں کے مطابق 100% درست اور آسان حساب۔
          </p>
        </div>
      </div>

      <!-- Currency & Price Settings Bar -->
      <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">1. مارکیٹ ریٹ و کرنسی کا تعین</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کرنسی:</label>
            <select id="zk-currency" onchange="window.Views.calculateZakatLive()" class="form-select text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold">
              <option value="PKR">روپیہ (PKR - پاکستان)</option>
              <option value="INR">روپیہ (INR - بھارت)</option>
              <option value="SAR">ریال (SAR - سعودی عرب)</option>
              <option value="USD">ڈالر (USD - امریکہ)</option>
              <option value="AED">درہم (AED - امارات)</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">24k سونے کی قیمت (فی گرام):</label>
            <input type="number" id="zk-gold-rate" value="23000" oninput="window.Views.calculateZakatLive()" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">چاندی کی قیمت (فی گرام):</label>
            <input type="number" id="zk-silver-rate" value="280" oninput="window.Views.calculateZakatLive()" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
          <span>نصابِ سونا: <strong>87.48 گرام (7.5 تولہ)</strong></span>
          <span>•</span>
          <span>نصابِ چاندی: <strong>612.36 گرام (52.5 تولہ)</strong></span>
        </div>
      </div>

      <!-- Assets & Debts Form Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left 7 Cols: Inputs -->
        <div class="lg:col-span-7 space-y-5">
          
          <!-- Assets Card -->
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 class="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>قابلِ زکوٰۃ اثاثہ جات (Zakatable Assets)</span>
            </h3>

            <div class="space-y-3 text-xs font-bold">
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود سونے کا وزن (گرام میں):</label>
                <input type="number" id="zk-gold-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>

              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود چاندی کا وزن (گرام میں):</label>
                <input type="number" id="zk-silver-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>

              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">نقدی رقم (گھر میں یا بینک بیلنس):</label>
                <input type="number" id="zk-cash" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>

              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">تجارتی مال و سامان کی مارکیٹ ویلیو:</label>
                <input type="number" id="zk-merchandise" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>

              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">دیگر دی گئی رقم جو واپس ملنے کی امید ہو:</label>
                <input type="number" id="zk-receivables" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>
            </div>
          </div>

          <!-- Liabilities Card -->
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 class="text-sm font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <i data-lucide="minus-circle" class="w-4 h-4"></i>
              <span>فوری واجب الادا قرضے و اخراجات (Deductible Debts)</span>
            </h3>

            <div class="space-y-3 text-xs font-bold">
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">لوگوں کے فوری واجب الادا قرضے:</label>
                <input type="number" id="zk-debts" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>

              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">ملازمین کی واجب الادا تنخواہیں یا بلز:</label>
                <input type="number" id="zk-bills" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="form-input text-xs w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-left" dir="ltr" />
              </div>
            </div>
          </div>

        </div>

        <!-- Right 5 Cols: Real-Time Scorecard & Summary -->
        <div class="lg:col-span-5 space-y-5">
          
          <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border-2 border-emerald-500/50 shadow-2xl space-y-5">
            <div class="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <h3 class="text-base font-extrabold text-emerald-300">خلاصۂ حسابِ زکوٰۃ</h3>
              <span class="badge bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">2.5% واجب</span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-300">کل قابلِ زکوٰۃ اثاثے:</span>
                <span class="font-mono font-extrabold text-white text-sm" id="zk-total-assets">0</span>
              </div>

              <div class="flex items-center justify-between text-rose-400">
                <span>منہا شدہ قرضے و اخراجات:</span>
                <span class="font-mono font-bold text-sm" id="zk-total-liabilities">- 0</span>
              </div>

              <div class="flex items-center justify-between border-t border-slate-700 pt-2 text-emerald-300 font-bold">
                <span>خالص مال (Net Zakatable):</span>
                <span class="font-mono font-extrabold text-base" id="zk-net-wealth">0</span>
              </div>

              <div class="flex items-center justify-between text-slate-400">
                <span>نصابِ چاندی کی حد:</span>
                <span class="font-mono" id="zk-silver-nisab-value">0</span>
              </div>
            </div>

            <!-- Grand Zakat Payable Box -->
            <div class="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-center space-y-1">
              <span class="text-xs font-bold text-amber-300 block">آپ پر کل واجب الادا زکوٰۃ:</span>
              <div class="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono" id="zk-grand-total">
                0
              </div>
              <span class="text-[11px] text-amber-200/80 font-urdu block mt-1" id="zk-status-text">مال نصاب سے کم ہے</span>
            </div>
          </div>

          <!-- Quranic Injunction -->
          <div class="lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <span class="font-extrabold text-emerald-600 dark:text-emerald-400 block">📖 فرمانِ باری تعالیٰ:</span>
            <p class="font-arabic text-sm text-slate-900 dark:text-white leading-loose font-bold">
              «وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ»
            </p>
            <p class="font-urdu">
              "اور نماز قائم کرو اور زکوٰۃ ادا کرو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔" (سورۃ البقرۃ: 43)
            </p>
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
  const goldRate = parseFloat(document.getElementById('zk-gold-rate')?.value || '0');
  const silverRate = parseFloat(document.getElementById('zk-silver-rate')?.value || '0');

  const goldGrams = parseFloat(document.getElementById('zk-gold-grams')?.value || '0');
  const silverGrams = parseFloat(document.getElementById('zk-silver-grams')?.value || '0');
  const cash = parseFloat(document.getElementById('zk-cash')?.value || '0');
  const merchandise = parseFloat(document.getElementById('zk-merchandise')?.value || '0');
  const receivables = parseFloat(document.getElementById('zk-receivables')?.value || '0');

  const debts = parseFloat(document.getElementById('zk-debts')?.value || '0');
  const bills = parseFloat(document.getElementById('zk-bills')?.value || '0');

  // Calculations
  const goldValue = goldGrams * goldRate;
  const silverValue = silverGrams * silverRate;
  const totalAssets = goldValue + silverValue + cash + merchandise + receivables;
  const totalLiabilities = debts + bills;
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const silverNisabValue = 612.36 * silverRate;
  const isEligible = netWealth >= silverNisabValue && silverNisabValue > 0;
  const zakatPayable = isEligible ? netWealth * 0.025 : 0;

  // DOM Updates
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('zk-total-assets', `${currency} ${totalAssets.toLocaleString()}`);
  setEl('zk-total-liabilities', `- ${currency} ${totalLiabilities.toLocaleString()}`);
  setEl('zk-net-wealth', `${currency} ${netWealth.toLocaleString()}`);
  setEl('zk-silver-nisab-value', `${currency} ${silverNisabValue.toLocaleString()}`);
  setEl('zk-grand-total', `${currency} ${Math.round(zakatPayable).toLocaleString()}`);

  const statusEl = document.getElementById('zk-status-text');
  if (statusEl) {
    statusEl.textContent = isEligible 
      ? `✓ نصاب مکمل ہے، زکوٰۃ (2.5%) فوری واجب الادا ہے` 
      : `مال نصاب (${currency} ${silverNisabValue.toLocaleString()}) سے کم ہے، زکوٰۃ فرض نہیں`;
  }
};
