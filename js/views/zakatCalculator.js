/**
 * LearnHub Islamic Zakat Calculator Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderZakatCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const isRtl = window.I18N ? window.I18N.isRTL() : true;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Banner -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <span>✨ رکنِ سوم: ادائے زکوٰۃ (Shariah Zakat Calculator)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">حاسبۂ زکوٰۃ شرعیہ و نصاب</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            سونے، چاندی، نقدی، تجارتی مال اور بچت پر واجب الادا زکوٰۃ کا شرعی اصولوں کے مطابق 100% درست اور آسان حساب۔
          </p>
        </div>

        <!-- Currency & Price Settings Bar -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">1. مارکیٹ ریٹ و کرنسی کا تعین</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کرنسی:</label>
              <select id="zk-currency" onchange="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-600">
                <option value="PKR">روپیہ (PKR - پاکستان)</option>
                <option value="INR">روپیہ (INR - بھارت)</option>
                <option value="SAR">ریال (SAR - سعودی عرب)</option>
                <option value="USD">ڈالر (USD - امریکہ)</option>
                <option value="AED">درہم (AED - امارات)</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">24k سونے کی قیمت (فی گرام):</label>
              <input type="number" id="zk-gold-rate" value="23000" oninput="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">چاندی کی قیمت (فی گرام):</label>
              <input type="number" id="zk-silver-rate" value="280" oninput="window.Views.calculateZakatLive()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-2 font-mono">
            <span>نصابِ سونا: <strong>87.48 گرام (7.5 تولہ)</strong></span>
            <span>•</span>
            <span>نصابِ چاندی: <strong>612.36 گرام (52.5 تولہ)</strong></span>
          </div>
        </div>

        <!-- Assets & Debts Form Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left 7 Cols: Inputs -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Assets Card -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
              <h3 class="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>قابلِ زکوٰۃ اثاثہ جات (Zakatable Assets)</span>
              </h3>

              <div class="space-y-2.5 text-xs font-bold">
                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود سونے کا وزن (گرام میں):</label>
                  <input type="number" id="zk-gold-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">موجود چاندی کا وزن (گرام میں):</label>
                  <input type="number" id="zk-silver-grams" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">نقدی رقم (گھر میں یا بینک بیلنس):</label>
                  <input type="number" id="zk-cash" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">تجارتی مال و سامان کی مارکیٹ ویلیو:</label>
                  <input type="number" id="zk-merchandise" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">دیگر دی گئی رقم جو واپس ملنے کی امید ہو:</label>
                  <input type="number" id="zk-receivables" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>
              </div>
            </div>

            <!-- Liabilities Card -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
              <h3 class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <i data-lucide="minus-circle" class="w-4 h-4"></i>
                <span>فوری واجب الادا قرضے و اخراجات (Deductible Debts)</span>
              </h3>

              <div class="space-y-2.5 text-xs font-bold">
                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">لوگوں کے فوری واجب الادا قرضے:</label>
                  <input type="number" id="zk-debts" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>

                <div>
                  <label class="text-slate-700 dark:text-slate-300 block mb-1">ملازمین کی واجب الادا تنخواہیں یا بلز:</label>
                  <input type="number" id="zk-bills" value="0" min="0" oninput="window.Views.calculateZakatLive()" placeholder="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono" dir="ltr" />
                </div>
              </div>
            </div>

          </div>

          <!-- Right 5 Cols: Real-Time Scorecard & Summary -->
          <div class="lg:col-span-5 space-y-4">
            
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">خلاصۂ حسابِ زکوٰۃ</h3>
                <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-mono font-bold border border-teal-600/30">2.5% واجب</span>
              </div>

              <div class="space-y-2.5 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">کل قابلِ زکوٰۃ اثاثے:</span>
                  <span class="font-mono font-bold text-slate-900 dark:text-white text-xs" id="zk-total-assets">0</span>
                </div>

                <div class="flex items-center justify-between text-rose-500">
                  <span>منہا شدہ قرضے و اخراجات:</span>
                  <span class="font-mono font-bold text-xs" id="zk-total-liabilities">- 0</span>
                </div>

                <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2 text-teal-700 dark:text-teal-400 font-bold">
                  <span>خالص مال (Net Zakatable):</span>
                  <span class="font-mono font-black text-sm" id="zk-net-wealth">0</span>
                </div>

                <div class="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>نصابِ چاندی کی حد:</span>
                  <span class="font-mono" id="zk-silver-nisab-value">0</span>
                </div>
              </div>

              <!-- Grand Total Card -->
              <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-600/30 text-center space-y-1">
                <span class="text-xs font-bold text-teal-800 dark:text-teal-300 block">آپ پر کل واجب الادا زکوٰۃ:</span>
                <div class="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300 font-mono" id="zk-grand-total">
                  0
                </div>
                <span class="text-[11px] text-teal-600 dark:text-teal-400 block mt-1" id="zk-status-text">مال نصاب سے کم ہے</span>
              </div>
            </div>

            <!-- Quranic Injunction -->
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <span class="font-bold text-teal-700 dark:text-teal-400 block">📖 فرمانِ باری تعالیٰ:</span>
              <p class="font-arabic text-sm text-slate-900 dark:text-white leading-loose font-bold">
                «وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ»
              </p>
              <p>
                "اور نماز قائم کرو اور زکوٰۃ ادا کرو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔" (سورۃ البقرۃ: 43)
              </p>
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
  const goldRate = parseFloat(document.getElementById('zk-gold-rate')?.value || '0');
  const silverRate = parseFloat(document.getElementById('zk-silver-rate')?.value || '0');

  const goldGrams = parseFloat(document.getElementById('zk-gold-grams')?.value || '0');
  const silverGrams = parseFloat(document.getElementById('zk-silver-grams')?.value || '0');
  const cash = parseFloat(document.getElementById('zk-cash')?.value || '0');
  const merchandise = parseFloat(document.getElementById('zk-merchandise')?.value || '0');
  const receivables = parseFloat(document.getElementById('zk-receivables')?.value || '0');

  const debts = parseFloat(document.getElementById('zk-debts')?.value || '0');
  const bills = parseFloat(document.getElementById('zk-bills')?.value || '0');

  const goldValue = goldGrams * goldRate;
  const silverValue = silverGrams * silverRate;
  const totalAssets = goldValue + silverValue + cash + merchandise + receivables;
  const totalLiabilities = debts + bills;
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const silverNisabValue = 612.36 * silverRate;
  const isEligible = netWealth >= silverNisabValue && silverNisabValue > 0;
  const zakatPayable = isEligible ? netWealth * 0.025 : 0;

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
      ? '✓ نصاب مکمل ہے، زکوٰۃ (2.5%) فوری واجب الادا ہے' 
      : `مال نصاب (${currency} ${silverNisabValue.toLocaleString()}) سے کم ہے، زکوٰۃ فرض نہیں`;
  }
};
