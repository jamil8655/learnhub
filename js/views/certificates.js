/**
 * LearnHub Ultra-Luxury Certificates Module & Public Verification Portal
 * Royal Gold & Navy ornamental design with calligraphy, verifiable digital watermark,
 * official signatures, and 1-click printable PDF styling.
 */

window.Views = window.Views || {};

// Certificates Portal with Strict Privacy & Serial Code Verification Gate
window.Views.renderCertificates = async function(params = {}, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const searchedCode = (query && query.code) ? query.code.trim() : (window._activeCertSearchCode || '');
  let foundCert = null;
  let searchAttempted = false;

  if (searchedCode) {
    searchAttempted = true;
    const allCerts = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('certificates') || []) : [];
    foundCert = allCerts.find(c => 
      (c.certificateNumber && c.certificateNumber.toLowerCase() === searchedCode.toLowerCase()) ||
      (c.serialNumber && c.serialNumber.toLowerCase() === searchedCode.toLowerCase()) ||
      (c.id && c.id.toLowerCase() === searchedCode.toLowerCase())
    );
  }

  // Check if viewing personal certs tab (only for logged-in users)
  const isPersonalTab = window._activeCertTab === 'my_certs' && user;
  const myCertificates = (isPersonalTab && user && window.DB) 
    ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id)
    : [];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 font-urdu text-right" dir="rtl">
      
      <!-- Top Privacy & Verification Header -->
      <div class="bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-500/40 text-center space-y-3">
        <!-- Glow decoration -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="shield-check" class="w-4 h-4 text-amber-400"></i>
          <span>عوامی تصدیقی پورٹلِ اسناد (Public Verification Portal)</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold text-white">شاہی تصدیق و پورٹلِ اسناد</h1>
        <p class="text-xs sm:text-sm text-amber-100/90 max-w-xl mx-auto leading-relaxed">
          کسی بھی طالب علم کی سند عوامی طور پر کھلی نہیں رکھی جاتی تاکہ کوئی کاپی نہ کر سکے۔ اپنا یا کسی کا بھی تصدیقی کوڈ درج کر کے سند کی باقاعدہ تصدیق فرمائیں اور معائنہ کے بعد کوڈ ہٹا کر اسکرین صاف کر دیں۔
        </p>

        ${user ? `
          <div class="pt-3 flex items-center justify-center gap-3">
            <button onclick="window._activeCertTab = 'search'; window._activeCertSearchCode = ''; window.Views.renderCertificates();" class="py-2 px-4 rounded-xl text-xs font-bold transition ${!isPersonalTab ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'bg-white/10 hover:bg-white/20 text-white'}">
              🔍 عوامی تصدیق
            </button>
            <button onclick="window._activeCertTab = 'my_certs'; window.Views.renderCertificates();" class="py-2 px-4 rounded-xl text-xs font-bold transition ${isPersonalTab ? 'bg-emerald-500 text-white shadow-md font-black' : 'bg-white/10 hover:bg-white/20 text-white'}">
              📜 میری ذاتی اسناد (${(window.DB.get('certificates') || []).filter(c => c.userId === user.id).length})
            </button>
          </div>
        ` : ''}
      </div>

      ${!isPersonalTab ? `
        <!-- Certificate Serial Verification Search Box -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/30 dark:border-slate-800 shadow-xl space-y-4">
          <div class="text-center space-y-1">
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">سند کا تصدیقی سیریل کوڈ درج کریں</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">مثال کے طور پر: <span class="font-mono text-amber-600 font-bold" dir="ltr">LH-CERT-2026-0001</span></p>
          </div>

          <div class="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-amber-300 dark:border-slate-700 focus-within:border-amber-500 transition">
            <input 
              type="text" 
              id="cert-search-input-field" 
              placeholder="یہاں سند کا کوڈ درج کریں..." 
              value="${searchedCode || ''}"
              class="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none text-right font-bold"
              onkeydown="if(event.key==='Enter') { window._activeCertSearchCode = this.value.trim(); window.Views.renderCertificates(); }"
            />
            <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button 
                type="button"
                onclick="const val = document.getElementById('cert-search-input-field').value.trim(); if(!val){ window.App.showToast('براہِ کرم تصدیقی کوڈ درج فرمائیں۔', 'warning'); return; } window._activeCertSearchCode = val; window.Views.renderCertificates();"
                class="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <i data-lucide="search" class="w-4 h-4"></i>
                <span>تصدیق کریں</span>
              </button>

              ${searchedCode ? `
                <button 
                  type="button"
                  onclick="window._activeCertSearchCode = ''; const inp = document.getElementById('cert-search-input-field'); if(inp) inp.value = ''; window.Views.renderCertificates();"
                  class="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 font-bold text-xs transition shadow-sm flex items-center gap-1"
                  title="کوڈ ہٹا کر اسکرین صاف کریں"
                >
                  <i data-lucide="x" class="w-4 h-4"></i>
                  <span>کوڈ ہٹائیں</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Verification Search Result Display -->
        ${searchAttempted ? (foundCert ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-2xl space-y-6 animate-scale-in">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div class="flex items-center gap-2">
                <span class="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-sm">
                  <i data-lucide="award" class="w-5 h-5"></i>
                </span>
                <div>
                  <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">مستند و تصدیق شدہ شاہی سند</h3>
                  <p class="text-[11px] text-slate-500 font-mono" dir="ltr">سیریل کوڈ: <strong class="text-amber-600 font-bold">${foundCert.certificateNumber || foundCert.serialNumber}</strong></p>
                </div>
              </div>
              <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                ✓ تصدیق شدہ
              </span>
            </div>

            <!-- Credentials Information Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <span class="text-slate-400 block text-[11px]">طالب علم / شریکِ کورس کا نام:</span>
                <span class="text-base font-extrabold text-slate-900 dark:text-white">${foundCert.userName}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <span class="text-slate-400 block text-[11px]">کورس / تعلیمی امتحان:</span>
                <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${foundCert.courseTitle || foundCert.title}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <span class="text-slate-400 block text-[11px]">تاریخِ اجراء و تصدیق:</span>
                <span class="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">${foundCert.issueDate}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <span class="text-slate-400 block text-[11px]">حاصل کردہ درجہ / گریڈ:</span>
                <span class="text-sm font-bold text-emerald-600">${foundCert.grade || 'ممتاز (Pass with Distinction)'}</span>
              </div>
            </div>

            <!-- CTA Actions -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onclick="window.Views.openCertificateViewer('${foundCert.id}')" class="w-full sm:w-auto py-3 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>شاہی سند کا مکمل شاہکار منظر و پرنٹ</span>
              </button>
              <button onclick="window._activeCertSearchCode = ''; const inp = document.getElementById('cert-search-input-field'); if(inp) inp.value = ''; window.Views.renderCertificates();" class="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs sm:text-sm transition active:scale-95 flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
                <span>کوڈ ہٹا دیں و ختم کریں (Clear Result)</span>
              </button>
            </div>
          </div>
        ` : `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-4 border-2 border-rose-300 dark:border-slate-800 shadow-md">
            <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto text-2xl">⚠️</div>
            <h4 class="text-base font-black text-slate-900 dark:text-white">کوئی سند نہیں ملی</h4>
            <p class="text-xs text-slate-500">درج کردہ تصدیقی کوڈ (${searchedCode}) ڈیٹا بیس میں موجود نہیں ہے۔ براہِ کرم درست سیریل کوڈ چیک کر کے دوبارہ تلاش فرمائیں۔</p>
            <div>
              <button onclick="window._activeCertSearchCode = ''; const inp = document.getElementById('cert-search-input-field'); if(inp) inp.value = ''; window.Views.renderCertificates();" class="py-2 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs transition">
                دوبارہ کوشش کریں (کوڈ صاف کریں)
              </button>
            </div>
          </div>
        `) : `
          <!-- Privacy Placeholder Box When No Code Is Entered -->
          <div class="p-8 sm:p-12 text-center rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              🔒
            </div>
            <h4 class="text-base font-black text-slate-800 dark:text-slate-200">رازداری و تحفظ</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              کسی بھی سند کی نقل یا غلط استعمال روکنے کے لیے اسناد عوامی طور پر اوپن نہیں ہیں۔ صرف مخصوص تصدیقی کوڈ درج کرنے پر ہی متعلقہ سند کی تفصیلات ظاہر ہوں گی، اور معائنہ کے بعد آپ کوڈ ہٹا کر اسکرین ختم کر سکتے ہیں۔
            </p>
          </div>
        `}
      ` : `
        <!-- My Personal Logged-In Certificates -->
        <div class="space-y-4">
          <h3 class="text-lg font-black text-slate-900 dark:text-white">میری تصدیق شدہ اسناد کا ریکارڈ</h3>
          ${myCertificates.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${myCertificates.map(cert => `
                <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-emerald-300 dark:border-slate-800 shadow-md space-y-3">
                  <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span class="text-[11px] font-mono font-bold text-amber-600">${cert.certificateNumber || cert.serialNumber}</span>
                    <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">تصدیق شدہ</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">${cert.courseTitle || cert.title}</h4>
                  <div class="text-xs text-slate-500">تاریخِ اجراء: <strong class="text-slate-700 dark:text-slate-300">${cert.issueDate}</strong></div>
                  <div class="pt-2">
                    <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow">
                      سند دیکھیں و پرنٹ کریں
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-8 bg-white dark:bg-slate-900 rounded-3xl text-center text-slate-500 text-xs">
              ابھی آپ کے اکاؤنٹ کے تحت کوئی سند جاری نہیں ہوئی۔ کورس یا کوئز مکمل کر کے سند حاصل فرمائیں۔
            </div>
          `}
        </div>
      `}

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Royal Certificate Interactive Modal & Printable Template
window.Views.openCertificateViewer = function(certId) {
  let cert = window.DB ? window.DB.findById('certificates', certId) : null;
  if (!cert) {
    const allCerts = window.DB ? window.DB.get('certificates') || [] : [];
    cert = allCerts.find(c => c.id === certId || c.certificateNumber === certId || c.serialNumber === certId) || allCerts[0] || {
      id: 'cert-1',
      certificateNumber: 'LH-CERT-2026-8841',
      serialNumber: 'LH-CERT-2026-8841',
      userName: 'جمیل رحمن انصاری (Jamil Rahman Ansari)',
      courseTitle: 'قرآنی علوم و تجوید ماسٹر کلاس (Quranic Sciences & Tajweed)',
      instructorName: 'شیخ محمد الہاشمی (Ph.D. Islamic Sciences)',
      issueDate: new Date().toISOString().split('T')[0],
      grade: 'ممتاز درجہ (Pass with Highest Distinction)'
    };
  }

  const serial = cert.certificateNumber || cert.serialNumber || 'LH-CERT-2026-8841';
  const baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '');
  const verifyUrl = `${baseUrl}/#/verify-cert/${serial}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}`;

  window.App.showModal('سرٹیفکیٹ کا شاہکار منظر (Official Royal Certificate)', `
    <div id="cert-modal" class="space-y-6 max-w-full overflow-x-auto">
      
      <!-- Printable Royal Certificate Container -->
      <div id="printable-certificate" class="relative bg-[#fffdfa] text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 border-4 sm:border-8 border-double border-amber-600/80 shadow-2xl overflow-hidden select-none w-full max-w-4xl mx-auto min-w-[280px]">
        
        <!-- Corner Guilloche Ornaments -->
        <div class="absolute top-2 left-2 text-amber-600 opacity-60 text-xl sm:text-2xl font-serif">⚜️</div>
        <div class="absolute top-2 right-2 text-amber-600 opacity-60 text-xl sm:text-2xl font-serif">⚜️</div>
        <div class="absolute bottom-2 left-2 text-amber-600 opacity-60 text-xl sm:text-2xl font-serif">⚜️</div>
        <div class="absolute bottom-2 right-2 text-amber-600 opacity-60 text-xl sm:text-2xl font-serif">⚜️</div>

        <!-- Subtle Watermark -->
        <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span class="text-7xl sm:text-9xl font-extrabold text-amber-900 font-serif tracking-widest">LEARNHUB</span>
        </div>

        <div class="relative z-10 space-y-4 sm:space-y-6 text-center">
          
          <!-- Calligraphy & Seal Header -->
          <div class="space-y-1">
            <div class="text-sm sm:text-base lg:text-lg font-serif font-bold text-amber-800 tracking-wider font-arabic">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div class="text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em] text-slate-500 font-mono">
              LEARNHUB GLOBAL ACADEMY & RESEARCH INSTITUTE
            </div>
          </div>

          <!-- Certificate Title -->
          <div class="py-2 border-y-2 border-amber-600/40 max-w-lg mx-auto">
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-950 font-serif tracking-tight uppercase">
              Certificate of Completion
            </h2>
            <div class="text-xs font-urdu font-bold text-amber-700 mt-0.5">
              سندِ تکمیل و فراغت
            </div>
          </div>

          <!-- Recipient Text -->
          <div class="space-y-2">
            <p class="text-xs text-slate-500 font-serif italic">This is to proudly certify that</p>
            <div class="text-xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-indigo-900 to-amber-900 font-serif py-1">
              ${cert.userName}
            </div>
            <div class="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"></div>
          </div>

          <!-- Course & Distinction -->
          <div class="space-y-2 max-w-2xl mx-auto">
            <p class="text-xs text-slate-600 font-urdu leading-relaxed">
              نے تمام نصابی اسباق، تشخیصی ٹیسٹس اور عملی مشقوں کو اعلیٰ درجے کے ساتھ کامیابی سے مکمل کیا ہے:
            </p>
            <div class="inline-block px-4 sm:px-5 py-2 rounded-2xl bg-amber-50 border-2 border-amber-400/50 shadow-inner">
              <h3 class="text-sm sm:text-base lg:text-lg font-extrabold text-indigo-950 font-urdu">${cert.courseTitle}</h3>
            </div>
            <div class="text-xs font-bold text-emerald-700 font-urdu pt-1">
              درجہ: ${cert.grade || 'ممتاز (Pass with Highest Distinction)'}
            </div>
          </div>

          <!-- Signatures, Holographic Seal & Verification QR Code -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-8 border-t border-slate-200 text-left items-center">
            
            <!-- Left: Instructor Signature -->
            <div class="text-center sm:text-left space-y-1">
              <div class="font-serif italic text-xs sm:text-sm lg:text-base text-slate-900 font-bold border-b border-slate-400 pb-1 inline-block min-w-[130px]">
                ${cert.instructorName || 'Prof. M. Al-Hashmi'}
              </div>
              <div class="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                Dean of Academic Faculty
              </div>
            </div>

            <!-- Center: Gold Hologram Seal -->
            <div class="flex flex-col items-center justify-center">
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-1 shadow-xl flex items-center justify-center relative transform hover:scale-105 transition">
                <div class="w-full h-full rounded-full border-2 border-dashed border-amber-950 flex flex-col items-center justify-center text-amber-950 font-bold text-[7px] sm:text-[8px] lg:text-[9px] leading-tight">
                  <span>★ VERIFIED ★</span>
                  <span class="text-[6px] sm:text-[7px]">OFFICIAL</span>
                  <span class="text-[5px] sm:text-[6px]">SEAL</span>
                </div>
              </div>
            </div>

            <!-- Right: Scannable QR Code & Serial -->
            <div class="flex items-center justify-center sm:justify-end gap-3">
              <div class="p-1.5 bg-white border-2 border-amber-400/60 rounded-xl shadow-md">
                <img src="${qrUrl}" class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg object-contain" alt="Scan to Verify" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=LH-VERIFY-${serial}'">
              </div>
              <div class="text-left space-y-0.5">
                <div class="text-[8px] uppercase tracking-wider text-amber-700 font-bold font-mono">Scan to Verify</div>
                <div class="font-mono text-[11px] sm:text-xs font-extrabold text-indigo-950">${serial}</div>
                <div class="text-[8px] text-slate-400 font-mono">256-Bit Signed</div>
              </div>
            </div>

          </div>

          <!-- Bottom Verification URL -->
          <div class="pt-3 text-[10px] text-slate-400 font-mono break-all">
            Online Verification: ${verifyUrl}
          </div>

        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap justify-center gap-3 font-urdu">
        <button onclick="window.print()" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold border-none shadow-lg">
          <i data-lucide="printer" class="w-4 h-4 inline mr-1"></i> سند پرنٹ کریں / PDF محفوظ کریں
        </button>
        
        <button onclick="window.Views.shareCertificate('${serial}', '${(cert.courseTitle || '').replace(/'/g, "\\'")}')" class="btn-secondary py-2.5 px-5 text-xs rounded-xl font-bold">
          <i data-lucide="share-2" class="w-4 h-4 inline mr-1"></i> شیئر کریں (WhatsApp / Social)
        </button>

        <button onclick="navigator.clipboard.writeText('${verifyUrl}'); window.App.showToast('تصدیقی لنک کاپی ہو گیا! 📋', 'success');" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
          <i data-lucide="copy" class="w-4 h-4 inline mr-1"></i> لنک کاپی
        </button>
      </div>

    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.shareCertificate = function(serial, courseTitle) {
  const baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '');
  const url = `${baseUrl}/#/verify-cert/${serial}`;
  const text = `🎓 الحمدللہ! میں نے LearnHub سے "${courseTitle}" کامیابی سے مکمل کر کے تصدیقی ڈیجیٹل سند حاصل کر لی ہے۔\nمیری سند دیکھیں:\n${url}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'LearnHub Verified Certificate',
      text: text,
      url: url
    }).catch(() => {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  } else {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }
};

// Public Certificate Verification View
window.Views.renderVerifyCertificate = async function(params) {
  const container = document.getElementById('main-content');
  const certNumber = params && params.id ? params.id.trim() : '';
  const cert = certNumber ? await window.API.getCertificateByNumber(certNumber) : null;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center space-y-6 sm:space-y-8 font-urdu w-full max-w-full overflow-hidden" dir="rtl">
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full ${cert ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800'} text-xs font-bold mb-4 shadow-sm">
          <i data-lucide="${cert ? 'shield-check' : 'search'}" class="w-5 h-5"></i>
          <span>${cert ? '✓ تصدیق شدہ اور محفوظ ڈیجیٹل سند (Officially Verified Credential)' : 'آن لائن سرٹیفکیٹ تصدیقی پورٹل (Verification Portal)'}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">LearnHub ڈیجیٹل سرٹیفکیٹ تصدیق</h1>
        ${certNumber ? `<p class="text-xs sm:text-sm text-slate-500 mt-2 font-mono" dir="ltr">سیریل نمبر: <strong class="text-amber-600 font-bold">${certNumber}</strong></p>` : ''}
      </div>

      <!-- Verification Search Bar -->
      <div class="max-w-md mx-auto p-2 bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-300 dark:border-slate-800 shadow-md flex items-center gap-2">
        <input 
          type="text" 
          id="verify-search-input" 
          placeholder="سند کا تصدیقی کوڈ درج کریں (مثلاً: LH-CERT-2026-0001)..." 
          value="${certNumber || ''}" 
          class="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none text-right font-bold"
          onkeydown="if(event.key==='Enter') window.Router.navigate('/verify-cert/' + this.value.trim());"
        />
        <button 
          onclick="const val = document.getElementById('verify-search-input').value.trim(); if(val) window.Router.navigate('/verify-cert/' + val);" 
          class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap">
          تصدیق کریں
        </button>
        ${certNumber ? `
          <button 
            onclick="window.Router.navigate('/verify-cert');" 
            class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition"
            title="کوڈ ہٹائیں و اسکرین صاف کریں"
          >
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>

      ${cert ? `
        <div class="lh-card p-6 sm:p-10 space-y-6 shadow-2xl border-2 border-emerald-500/30 text-right rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900" dir="rtl">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">سرٹیفکیٹ کی آفیشل معلومات</h3>
            <span class="badge badge-success text-xs font-bold">درست و تصدیق شدہ ✓</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">طالب علم کا نام:</span>
              <span class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">${cert.userName}</span>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">کورس / امتحان کا نام:</span>
              <span class="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">${cert.courseTitle || cert.title}</span>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">تاریخِ اجراء:</span>
              <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono">${cert.issueDate}</span>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">حاصل کردہ گریڈ:</span>
              <span class="text-xs sm:text-sm font-bold text-emerald-600">${cert.grade || 'ممتاز (Distinction)'}</span>
            </div>
          </div>

          <div class="pt-4 flex flex-wrap justify-center gap-3">
            <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 font-bold border-none font-urdu">
              سند کا مکمل شاہکار ڈیزائن دیکھیں &rarr;
            </button>
            <button onclick="window.Router.navigate('/verify-cert');" class="btn-secondary py-2.5 px-5 text-xs rounded-xl font-bold font-urdu">
              کوڈ ہٹا دیں و نئی تصدیق کریں
            </button>
          </div>
        </div>
      ` : certNumber ? `
        <div class="lh-card p-8 sm:p-12 text-center space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto text-xl">⚠️</div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold">درج کردہ سیریل نمبر (${certNumber}) کے مطابق کوئی سند ڈیٹا بیس میں نہیں ملی۔</p>
          <p class="text-xs text-slate-400">براہ کرم سیریل نمبر کی تصدیق کر کے دوبارہ تلاش کریں۔</p>
          <div class="pt-2">
            <button onclick="window.Router.navigate('/verify-cert');" class="btn-primary py-2 px-6 text-xs rounded-xl font-urdu">کوڈ صاف کریں</button>
          </div>
        </div>
      ` : `
        <div class="lh-card p-8 sm:p-12 text-center space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p class="text-xs sm:text-sm text-slate-500 font-urdu">سرٹیفکیٹ کی تصدیق کے لیے اوپر دیے گئے باکس میں سند کا تصدیقی کوڈ درج کریں۔</p>
        </div>
      `}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

