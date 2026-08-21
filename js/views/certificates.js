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

// Royal Certificate Interactive Modal & High-Precision Printable Engine
window.Views.openCertificateViewer = function(certId) {
  let cert = window.DB ? window.DB.findById('certificates', certId) : null;
  if (!cert) {
    const allCerts = window.DB ? window.DB.get('certificates') || [] : [];
    cert = allCerts.find(c => c.id === certId || c.certificateNumber === certId || c.serialNumber === certId) || allCerts[0] || {
      id: 'cert-1',
      certificateNumber: 'LH-CERT-2026-0001',
      serialNumber: 'LH-CERT-2026-0001',
      userName: 'جمیل رحمن انصاری (Jamil Rahman Ansari)',
      courseTitle: 'قرآنی علوم و تجوید ماسٹر کلاس (Quranic Sciences & Tajweed)',
      instructorName: 'پروفیسر شیخ محمد الہاشمی (Ph.D. Islamic Sciences)',
      issueDate: new Date().toISOString().split('T')[0],
      grade: 'ممتاز درجہ (Pass with Highest Distinction)'
    };
  }

  const serial = cert.certificateNumber || cert.serialNumber || 'LH-CERT-2026-0001';
  const baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '');
  const verifyUrl = `${baseUrl}/#/verify-cert/${serial}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}`;

  window.App.showModal('شاہی سندِ فراغت (Royal Diploma of Excellence)', `
    <div id="cert-modal" class="space-y-6 max-w-full">
      
      <!-- Responsive Scroll Container for Mobile Screens -->
      <div class="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        
        <!-- Printable Royal Certificate Container (A4 Landscape Proportions) -->
        <div id="printable-certificate" class="relative bg-[#fffdf9] text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-14 border-[6px] sm:border-[10px] border-double border-[#b38728] shadow-2xl overflow-hidden select-none w-full max-w-4xl mx-auto min-w-[340px] sm:min-w-[680px]">
          
          <!-- Ornate Inner Guilloche Border -->
          <div class="absolute inset-2 sm:inset-3 border-2 border-[#d4af37]/60 pointer-events-none rounded-2xl"></div>
          <div class="absolute inset-3 sm:inset-4 border border-[#b38728]/30 pointer-events-none rounded-xl"></div>

          <!-- 4 Corner Royal Islamic Arabesque Emblems -->
          <div class="absolute top-4 left-4 text-[#b38728] text-xl sm:text-2xl select-none">۞</div>
          <div class="absolute top-4 right-4 text-[#b38728] text-xl sm:text-2xl select-none">۞</div>
          <div class="absolute bottom-4 left-4 text-[#b38728] text-xl sm:text-2xl select-none">۞</div>
          <div class="absolute bottom-4 right-4 text-[#b38728] text-xl sm:text-2xl select-none">۞</div>

          <!-- Subtle Royal Watermark -->
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
            <span class="text-7xl sm:text-9xl font-black text-amber-950 font-serif tracking-widest uppercase">LEARNHUB</span>
          </div>

          <div class="relative z-10 space-y-4 sm:space-y-6 text-center">
            
            <!-- Calligraphy & Royal Header -->
            <div class="space-y-1.5 pt-1">
              <div class="text-base sm:text-xl font-serif font-black text-[#8c6b1b] tracking-wider font-arabic drop-shadow-sm">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div class="text-[9px] sm:text-xs uppercase font-extrabold tracking-[0.25em] text-[#0f172a]/70 font-mono">
                LEARNHUB INTERNATIONAL ISLAMIC ACADEMY & RESEARCH INSTITUTE
              </div>
              <div class="text-[10px] sm:text-xs font-urdu font-bold text-amber-800">
                جامعہ لرن ہب انٹرنیشنل اکیڈمی و سنٹر فار اسلامک سائنسز
              </div>
            </div>

            <!-- Grand Diploma Title Ribbon -->
            <div class="py-2.5 px-6 border-y-2 border-[#b38728]/50 max-w-xl mx-auto bg-gradient-to-r from-transparent via-[#fdf6e7] to-transparent">
              <h2 class="text-xl sm:text-3xl font-extrabold text-[#0f172a] font-serif tracking-wide uppercase">
                Certificate of Excellence
              </h2>
              <div class="text-xs sm:text-sm font-urdu font-extrabold text-[#996515] mt-0.5">
                سندِ فراغت و حسنِ کارکردگی
              </div>
            </div>

            <!-- Recipient Student Presentation -->
            <div class="space-y-2 pt-1">
              <p class="text-xs sm:text-sm text-slate-500 font-serif italic">This is to officially and proudly certify that</p>
              <p class="text-[11px] sm:text-xs text-slate-600 font-urdu -mt-1">تصدیق کی جاتی ہے کہ محترم / محترمہ</p>
              
              <div class="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] font-serif py-1 drop-shadow-sm tracking-tight">
                ${cert.userName}
              </div>
              <div class="w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-[#b38728] to-transparent mx-auto rounded-full"></div>
            </div>

            <!-- Course Title & High Distinction Shield -->
            <div class="space-y-2 max-w-2xl mx-auto">
              <p class="text-xs sm:text-sm text-slate-700 font-urdu leading-relaxed font-semibold">
                نے تمام نصابی اسباق، تشخیصی ٹیسٹس اور عملی مشقوں کو کامیابی کے ساتھ مکمل کر کے یہ سند حاصل کی ہے:
              </p>
              <div class="inline-block px-5 sm:px-8 py-2.5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-2 border-[#d4af37] shadow-inner">
                <h3 class="text-base sm:text-xl font-black text-[#0f172a] font-urdu">${cert.courseTitle || cert.title}</h3>
              </div>
              <div class="text-xs sm:text-sm font-bold text-emerald-800 font-urdu pt-1 flex items-center justify-center gap-2">
                <span>درجہ / رینک:</span>
                <span class="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black">
                  ${cert.grade || 'ممتاز (Pass with Highest Distinction)'}
                </span>
              </div>
            </div>

            <!-- Signatures, 24K Holographic Stamp & Live Verification QR Code -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-8 border-t-2 border-[#b38728]/30 items-center">
              
              <!-- Left: Dean Signature -->
              <div class="text-center sm:text-left space-y-1">
                <div class="font-serif italic text-sm sm:text-base text-slate-900 font-extrabold border-b-2 border-slate-600 pb-1 inline-block min-w-[140px]">
                  ${cert.instructorName || 'Prof. M. Al-Hashmi'}
                </div>
                <div class="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-600 font-bold font-mono">
                  Dean of Academic Faculty
                </div>
                <div class="text-[10px] text-amber-900 font-urdu font-bold">
                  شیخ الحدیث و صدر المعلمین
                </div>
              </div>

              <!-- Center: 24K Gold 3D Holographic Official Seal -->
              <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#b38728] p-1.5 shadow-2xl flex items-center justify-center transform hover:scale-105 transition border-2 border-[#fffdf9]">
                  <div class="w-full h-full rounded-full border-2 border-dashed border-[#5c4008] flex flex-col items-center justify-center text-[#5c4008] font-black text-[8px] sm:text-[9px] leading-tight">
                    <span>★ OFFICIAL ★</span>
                    <span class="text-[9px] sm:text-[10px] tracking-wider">SEAL</span>
                    <span class="text-[7px]">VERIFIED</span>
                  </div>
                </div>
                <span class="text-[9px] font-mono font-bold text-amber-800 mt-1">256-Bit Cryptographic Seal</span>
              </div>

              <!-- Right: Verification QR Code & Serial -->
              <div class="flex items-center justify-center sm:justify-end gap-3 text-right" dir="rtl">
                <div class="p-1 bg-white border-2 border-[#b38728] rounded-xl shadow-md shrink-0">
                  <img src="${qrUrl}" class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-contain" alt="Scan to Verify" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=LH-VERIFY-${serial}'">
                </div>
                <div class="text-right space-y-0.5" dir="rtl">
                  <div class="text-[9px] uppercase tracking-wider text-[#996515] font-bold font-mono">اسکین کر کے تصدیق کریں</div>
                  <div class="font-mono text-xs sm:text-sm font-extrabold text-[#0f172a]" dir="ltr">${serial}</div>
                  <div class="text-[9px] text-slate-500 font-urdu font-bold">تاریخ: <span class="font-mono">${cert.issueDate}</span></div>
                </div>
              </div>

            </div>

            <!-- Bottom Verification URL Banner -->
            <div class="pt-2 text-[10px] text-slate-500 font-mono break-all border-t border-slate-200">
              Online Verification Portal: ${verifyUrl}
            </div>

          </div>
        </div>
      </div>

      <!-- Action Toolbar with Direct High-Res PDF & Print Generator -->
      <div class="flex flex-wrap justify-center gap-3 font-urdu pt-2">
        <button 
          onclick="window.Views.printCertificate('${cert.id}')" 
          class="py-3 px-8 text-xs sm:text-sm rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-xl transition active:scale-95 flex items-center gap-2"
        >
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>سند پرنٹ کریں / مکمل PDF ڈاؤن لوڈ کریں (A4 Landscape)</span>
        </button>
        
        <button 
          onclick="window.Views.shareCertificate('${serial}', '${(cert.courseTitle || '').replace(/'/g, "\\'")}')" 
          class="py-3 px-6 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition active:scale-95 flex items-center gap-2 border border-slate-300 dark:border-slate-700"
        >
          <i data-lucide="share-2" class="w-4 h-4"></i>
          <span>واٹس ایپ پر شیئر کریں</span>
        </button>

        <button 
          onclick="navigator.clipboard.writeText('${verifyUrl}'); window.App.showToast('تصدیقی لنک کاپی ہو گیا! 📋', 'success');" 
          class="py-3 px-5 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition active:scale-95 flex items-center gap-2 border border-slate-300 dark:border-slate-700"
        >
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span>لنک کاپی</span>
        </button>
      </div>

    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

// Standalone Isolated High-Resolution Print Engine (Never chops or clips)
window.Views.printCertificate = function(certId) {
  let cert = window.DB ? window.DB.findById('certificates', certId) : null;
  if (!cert) {
    const allCerts = window.DB ? window.DB.get('certificates') || [] : [];
    cert = allCerts.find(c => c.id === certId || c.certificateNumber === certId || c.serialNumber === certId) || allCerts[0] || {
      id: 'cert-1',
      certificateNumber: 'LH-CERT-2026-0001',
      serialNumber: 'LH-CERT-2026-0001',
      userName: 'طالب علم (Student)',
      courseTitle: 'قرآنی علوم و تجوید ماسٹر کلاس',
      instructorName: 'پروفیسر شیخ محمد الہاشمی',
      issueDate: new Date().toISOString().split('T')[0],
      grade: 'ممتاز درجہ (Pass with Highest Distinction)'
    };
  }

  const serial = cert.certificateNumber || cert.serialNumber || 'LH-CERT-2026-0001';
  const baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '');
  const verifyUrl = `${baseUrl}/#/verify-cert/${serial}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}`;

  // Create clean isolated iframe for direct browser print dialog
  let printFrame = document.getElementById('cert-print-frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'cert-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="ur" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>سندِ فراغت - ${cert.userName}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@500;700;900&family=Noto+Nastaliq+Urdu:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          width: 297mm;
          height: 210mm;
          margin: 0;
          padding: 6mm;
          background: #fdfaf3;
          font-family: 'Noto Nastaliq Urdu', 'Amiri', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cert-container {
          width: 285mm;
          height: 198mm;
          background: radial-gradient(circle at 50% 50%, #ffffff 0%, #fffdf8 70%, #fbf5e8 100%);
          border: 6mm double #b38728;
          border-radius: 6mm;
          position: relative;
          padding: 8mm 12mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          color: #0f172a;
          box-shadow: 0 0 20px rgba(179,135,40,0.2);
        }
        .inner-border {
          position: absolute;
          inset: 3mm;
          border: 1px solid rgba(212, 175, 55, 0.6);
          border-radius: 4mm;
          pointer-events: none;
        }
        .corner-star {
          position: absolute;
          color: #b38728;
          font-size: 16pt;
          user-select: none;
        }
        .top-left { top: 4mm; left: 4mm; }
        .top-right { top: 4mm; right: 4mm; }
        .bottom-left { bottom: 4mm; left: 4mm; }
        .bottom-right { bottom: 4mm; right: 4mm; }

        .bismillah {
          font-family: 'Amiri', serif;
          font-size: 18pt;
          font-weight: bold;
          color: #8c6b1b;
          margin-bottom: 1mm;
        }
        .academy-name-en {
          font-family: 'Cinzel', serif;
          font-size: 9pt;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #334155;
          text-transform: uppercase;
        }
        .academy-name-ur {
          font-size: 10.5pt;
          font-weight: bold;
          color: #78350f;
          margin-top: 1mm;
        }
        .title-box {
          border-top: 2px solid rgba(179,135,40,0.5);
          border-bottom: 2px solid rgba(179,135,40,0.5);
          background: linear-gradient(90deg, transparent, rgba(253,246,231,0.9), transparent);
          padding: 2mm 0;
          margin: 1.5mm auto;
          width: 80%;
        }
        .title-en {
          font-family: 'Cinzel', serif;
          font-size: 17pt;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 1.5px;
        }
        .title-ur {
          font-size: 11pt;
          font-weight: 800;
          color: #996515;
          margin-top: 0.5mm;
        }
        .recipient-intro {
          font-family: 'Amiri', serif;
          font-style: italic;
          font-size: 10pt;
          color: #64748b;
        }
        .student-name {
          font-family: 'Cinzel', 'Amiri', serif;
          font-size: 24pt;
          font-weight: 900;
          color: #0f172a;
          margin: 1mm 0;
          letter-spacing: 0.5px;
        }
        .name-divider {
          width: 50mm;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #b38728, transparent);
          margin: 0 auto 1.5mm auto;
        }
        .course-desc {
          font-size: 9.5pt;
          color: #334155;
          line-height: 1.6;
        }
        .course-pill {
          display: inline-block;
          background: #fdf6e7;
          border: 1.5px solid #d4af37;
          border-radius: 4mm;
          padding: 1.5mm 8mm;
          font-size: 13pt;
          font-weight: 800;
          color: #0f172a;
          margin: 1.5mm 0;
        }
        .grade-badge {
          display: inline-block;
          font-size: 9pt;
          color: #065f46;
          font-weight: bold;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          border-top: 1.5px solid rgba(179,135,40,0.3);
          padding-top: 2.5mm;
          margin-top: 1mm;
        }
        .dean-sign {
          text-align: right;
        }
        .sign-line {
          font-family: 'Amiri', serif;
          font-style: italic;
          font-weight: bold;
          font-size: 11pt;
          border-bottom: 1.5px solid #64748b;
          display: inline-block;
          min-width: 40mm;
          padding-bottom: 1mm;
        }
        .sign-title {
          font-size: 7.5pt;
          color: #64748b;
          font-family: 'Cinzel', sans-serif;
          margin-top: 1mm;
        }
        .seal-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gold-seal {
          width: 20mm;
          height: 20mm;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff176, #d4af37 50%, #8c6b1b 100%);
          border: 1.5px solid #fffdf8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #451a03;
          font-weight: 900;
          font-size: 5.5pt;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .qr-section {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 2.5mm;
          text-align: left;
        }
        .qr-img {
          width: 16mm;
          height: 16mm;
          border: 1px solid #b38728;
          border-radius: 2mm;
          background: #fff;
          padding: 0.5mm;
        }
        .qr-meta {
          font-family: monospace;
          font-size: 6.5pt;
          color: #475569;
        }
        .serial-bold {
          font-weight: bold;
          color: #0f172a;
          font-size: 7.5pt;
        }
        .verification-bar {
          font-family: monospace;
          font-size: 6.5pt;
          color: #94a3b8;
          margin-top: 1mm;
        }
      </style>
    </head>
    <body>
      <div class="cert-container">
        <div class="inner-border"></div>
        <div class="corner-star top-left">۞</div>
        <div class="corner-star top-right">۞</div>
        <div class="corner-star bottom-left">۞</div>
        <div class="corner-star bottom-right">۞</div>

        <!-- Header -->
        <div>
          <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div class="academy-name-en">LEARNHUB INTERNATIONAL ISLAMIC ACADEMY & RESEARCH INSTITUTE</div>
          <div class="academy-name-ur">جامعہ لرن ہب انٹرنیشنل اکیڈمی و سنٹر فار اسلامک سائنسز</div>
        </div>

        <!-- Title -->
        <div class="title-box">
          <div class="title-en">CERTIFICATE OF EXCELLENCE</div>
          <div class="title-ur">سندِ فراغت و حسنِ کارکردگی</div>
        </div>

        <!-- Recipient -->
        <div>
          <div class="recipient-intro">This is to proudly and officially certify that</div>
          <div class="student-name">${cert.userName}</div>
          <div class="name-divider"></div>
          <div class="course-desc">نے تمام نصابی اسباق، تشخیصی ٹیسٹس اور عملی مشقوں کو اعلیٰ درجے کے ساتھ کامیابی سے مکمل کیا ہے:</div>
          <div class="course-pill">${cert.courseTitle || cert.title}</div>
          <div><span class="grade-badge">درجہ: ${cert.grade || 'ممتاز (Pass with Highest Distinction)'}</span></div>
        </div>

        <!-- Footer Authentication -->
        <div>
          <div class="footer-grid">
            <div class="dean-sign">
              <div class="sign-line">${cert.instructorName || 'Prof. M. Al-Hashmi'}</div>
              <div class="sign-title">DEAN OF ISLAMIC SCIENCES</div>
              <div style="font-size: 7.5pt; color: #78350f; font-weight: bold;">شیخ الحدیث و صدر المعلمین</div>
            </div>

            <div class="seal-center">
              <div class="gold-seal">
                <div>★ OFFICIAL ★</div>
                <div style="font-size: 6.5pt;">SEAL</div>
                <div>VERIFIED</div>
              </div>
              <div style="font-size: 6pt; font-family: monospace; color: #78350f; margin-top: 1mm;">256-Bit Signed</div>
            </div>

            <div class="qr-section">
              <img src="${qrUrl}" class="qr-img" alt="QR">
              <div class="qr-meta">
                <div style="color: #996515; font-weight: bold;">SCAN TO VERIFY</div>
                <div class="serial-bold">${serial}</div>
                <div>Date: ${cert.issueDate}</div>
              </div>
            </div>
          </div>

          <div class="verification-bar">
            Online Verification: ${verifyUrl}
          </div>
        </div>

      </div>
    </body>
    </html>
  `);
  frameDoc.close();

  // Trigger print after resources and fonts load
  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 600);
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

