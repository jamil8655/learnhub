/**
 * LearnHub Islamic Mirath (Inheritance) Calculator Engine
 * Calculates exact legal Quranic inheritance shares according to Surah An-Nisa (verses 11, 12, 176)
 * and authentic Sunnah.
 */

window.Views = window.Views || {};

window.Views.renderMirathCalculator = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Mirath Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="scale" class="w-4 h-4 text-emerald-400"></i>
          <span>علم الفرائض و تقسیمِ ترکہ (Islamic Inheritance Law)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">شرعی وراثت و ترکہ کیلکولیٹر</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          قرآن مجید (سورۃ النساء) اور سنتِ نبوی کے عین مطابق ورثاء کے حصص اور جائیداد کی خودکار اور شفاف شرعی تقسیم۔
        </p>
      </div>

      <!-- Main Calculator Form & Results Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Input Form (7 cols) -->
        <div class="lg:col-span-7 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <i data-lucide="wallet" class="w-5 h-5 text-emerald-600"></i>
            <span>میت کی تفصیلات اور کل ترکہ درج کریں:</span>
          </h3>

          <!-- Total Wealth Amount -->
          <div class="space-y-2">
            <label class="font-extrabold text-xs sm:text-sm text-slate-700 dark:text-slate-200 block">
              کل ترکہ / جائیداد کی مالیت (قرض اور وصیت نکالنے کے بعد):
            </label>
            <input 
              type="number" 
              id="mirath-total-estate" 
              value="1000000" 
              class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-base font-mono font-black text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <!-- Deceased Gender -->
          <div class="space-y-2">
            <label class="font-extrabold text-xs sm:text-sm text-slate-700 dark:text-slate-200 block">میت کی جنس:</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between cursor-pointer">
                <span class="text-xs font-bold text-slate-900 dark:text-white">مرد (مرحوم شوہر/باپ)</span>
                <input type="radio" name="deceased_gender" value="male" checked onchange="window.Views.updateMirathSpouseLabel()">
              </label>
              <label class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer">
                <span class="text-xs font-bold text-slate-900 dark:text-white">عورت (مرحومہ بیوی/ماں)</span>
                <input type="radio" name="deceased_gender" value="female" onchange="window.Views.updateMirathSpouseLabel()">
              </label>
            </div>
          </div>

          <!-- Relatives Matrix -->
          <div class="space-y-4 pt-2">
            <h4 class="font-bold text-xs uppercase text-slate-400">حیات ورثاء کی تعداد منتخب کریں:</h4>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <!-- Spouse -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span id="mirath-spouse-label" class="text-xs font-bold text-slate-700 dark:text-slate-300 block">بیوہ (Wife)</span>
                <input type="number" id="mirath-wives" value="1" min="0" max="4" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-sm font-mono border border-slate-300 dark:border-slate-600">
              </div>

              <!-- Father -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">والد (Father)</span>
                <select id="mirath-father" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-xs border border-slate-300 dark:border-slate-600">
                  <option value="1">حیات ہیں (Yes)</option>
                  <option value="0">وفات پا چکے (No)</option>
                </select>
              </div>

              <!-- Mother -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">والدہ (Mother)</span>
                <select id="mirath-mother" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-xs border border-slate-300 dark:border-slate-600">
                  <option value="1">حیات ہیں (Yes)</option>
                  <option value="0">وفات پا چکے (No)</option>
                </select>
              </div>

              <!-- Sons -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">بیٹے (Sons)</span>
                <input type="number" id="mirath-sons" value="2" min="0" max="20" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-sm font-mono border border-slate-300 dark:border-slate-600">
              </div>

              <!-- Daughters -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">بیٹیاں (Daughters)</span>
                <input type="number" id="mirath-daughters" value="1" min="0" max="20" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-sm font-mono border border-slate-300 dark:border-slate-600">
              </div>

              <!-- Brothers -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">بھائی (Brothers)</span>
                <input type="number" id="mirath-brothers" value="0" min="0" max="20" class="w-full bg-white dark:bg-slate-900 p-2 rounded-xl text-center font-bold text-sm font-mono border border-slate-300 dark:border-slate-600">
              </div>
            </div>
          </div>

          <button 
            onclick="window.Views.calculateMirathShares()" 
            class="btn-primary w-full py-3.5 px-6 text-xs sm:text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl flex items-center justify-center gap-2"
          >
            <i data-lucide="calculator" class="w-4 h-4"></i>
            <span>شرعی تقسیم کا حساب لگائیں (Calculate Shares)</span>
          </button>
        </div>

        <!-- Right Results Box (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div id="mirath-result-container" class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-5">
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <i data-lucide="pie-chart" class="w-5 h-5 text-amber-500"></i>
              <span>شرعی حصص کا خلاصہ:</span>
            </h3>

            <div id="mirath-shares-list" class="space-y-3">
              <div class="text-center py-8 text-slate-400 text-xs">
                اوپر دی گئی تفصیلات کے مطابق حساب لگانے کے لیے "حساب لگائیں" پر کلک کریں۔
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  window.Views.calculateMirathShares();
};

window.Views.updateMirathSpouseLabel = function() {
  const isMale = document.querySelector('input[name="deceased_gender"]:checked')?.value === 'male';
  const label = document.getElementById('mirath-spouse-label');
  if (label) {
    label.textContent = isMale ? 'بیوہ (Wife)' : 'شوہر (Husband)';
  }
};

window.Views.calculateMirathShares = function() {
  const totalEstate = parseFloat(document.getElementById('mirath-total-estate')?.value || 1000000);
  const isMale = document.querySelector('input[name="deceased_gender"]:checked')?.value === 'male';
  const wives = parseInt(document.getElementById('mirath-wives')?.value || 0, 10);
  const hasFather = parseInt(document.getElementById('mirath-father')?.value || 1, 10) === 1;
  const hasMother = parseInt(document.getElementById('mirath-mother')?.value || 1, 10) === 1;
  const sons = parseInt(document.getElementById('mirath-sons')?.value || 0, 10);
  const daughters = parseInt(document.getElementById('mirath-daughters')?.value || 0, 10);
  
  const hasChildren = (sons + daughters) > 0;
  const shares = [];
  let remainingEstate = totalEstate;

  // 1. Spouse Share (1/8 if children, 1/4 if no children for wife; 1/4 if children, 1/2 if no children for husband)
  if (isMale && wives > 0) {
    const fraction = hasChildren ? 0.125 : 0.25; // 1/8 or 1/4
    const fractionStr = hasChildren ? '1/8 (آٹھواں حصہ)' : '1/4 (چوتھائی حصہ)';
    const amount = totalEstate * fraction;
    shares.push({
      relation: `بیوہ (${wives > 1 ? `${wives} بیوائیں مشترکہ` : 'بیوہ'})`,
      fraction: fractionStr,
      percent: `${(fraction * 100).toFixed(1)}%`,
      amount: amount
    });
    remainingEstate -= amount;
  } else if (!isMale && wives > 0) { // Husband
    const fraction = hasChildren ? 0.25 : 0.5; // 1/4 or 1/2
    const fractionStr = hasChildren ? '1/4 (چوتھائی حصہ)' : '1/2 (نصف حصہ)';
    const amount = totalEstate * fraction;
    shares.push({
      relation: 'شوہر (Husband)',
      fraction: fractionStr,
      percent: `${(fraction * 100).toFixed(1)}%`,
      amount: amount
    });
    remainingEstate -= amount;
  }

  // 2. Mother Share (1/6 if children or multiple siblings, else 1/3)
  if (hasMother) {
    const fraction = hasChildren ? (1 / 6) : (1 / 3);
    const fractionStr = hasChildren ? '1/6 (چھٹا حصہ)' : '1/3 (تہائی حصہ)';
    const amount = totalEstate * fraction;
    shares.push({
      relation: 'والدہ (Mother)',
      fraction: fractionStr,
      percent: `${(fraction * 100).toFixed(1)}%`,
      amount: amount
    });
    remainingEstate -= amount;
  }

  // 3. Father Share (1/6 if children, else Asabah)
  if (hasFather) {
    if (hasChildren && sons > 0) {
      const fraction = 1 / 6;
      const amount = totalEstate * fraction;
      shares.push({
        relation: 'والد (Father)',
        fraction: '1/6 (چھٹا حصہ فرض)',
        percent: '16.6%',
        amount: amount
      });
      remainingEstate -= amount;
    } else if (!hasChildren) {
      shares.push({
        relation: 'والد (Father)',
        fraction: 'عصبہ (باقی تمام ترکہ)',
        percent: 'عصبہ',
        amount: remainingEstate
      });
      remainingEstate = 0;
    }
  }

  // 4. Children Share (للذكر مثل حظ الأنثيين - 2 shares for son, 1 share for daughter)
  if (hasChildren && remainingEstate > 0) {
    const totalParts = (sons * 2) + daughters;
    const partValue = remainingEstate / totalParts;

    if (sons > 0) {
      const sonTotalAmount = sons * 2 * partValue;
      shares.push({
        relation: `ہر بیٹے کا حصہ (${sons} بیٹے)`,
        fraction: 'عصبہ بالغیر (دوگنا حصہ)',
        percent: `${((2 * partValue / totalEstate) * 100).toFixed(1)}% فی کس`,
        amount: 2 * partValue
      });
    }

    if (daughters > 0) {
      shares.push({
        relation: `ہر بیٹی کا حصہ (${daughters} بیٹیاں)`,
        fraction: 'عصبہ بالغیر (ایک حصہ)',
        percent: `${((partValue / totalEstate) * 100).toFixed(1)}% فی کس`,
        amount: partValue
      });
    }
  }

  // Render to DOM
  const container = document.getElementById('mirath-shares-list');
  if (container) {
    container.innerHTML = `
      <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 font-bold">
        کل قابلِ تقسیم ترکہ: ₹${totalEstate.toLocaleString()}
      </div>

      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        ${shares.map(s => `
          <div class="py-3 flex items-center justify-between gap-2 text-xs">
            <div>
              <strong class="text-slate-900 dark:text-white block font-bold">${s.relation}</strong>
              <span class="text-[10px] text-slate-400">${s.fraction} (${s.percent})</span>
            </div>
            <div class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
              ₹${Math.round(s.amount).toLocaleString()}
            </div>
          </div>
        `).join('')}
      </div>

      <button onclick="window.print()" class="btn-secondary w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-4">
        <i data-lucide="printer" class="w-4 h-4"></i>
        <span>شرعی تقسیم کا پرنٹ نکالیں 🖨️</span>
      </button>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
};
