/**
 * LearnHub Ultra-Luxury Certificates Module & Public Verification Portal
 * Royal Gold & Navy ornamental design with calligraphy, verifiable digital watermark,
 * official signatures, and 1-click printable PDF styling.
 */

window.Views = window.Views || {};

// Certificates Gallery
window.Views.renderCertificates = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  let certificates = window.DB.get('certificates').filter(c => c.userId === user.id);

  // If empty, generate a demo verified certificate for the user to view immediately
  if (certificates.length === 0) {
    const demoCert = {
      id: 'cert-jamil-1',
      certificateNumber: 'LH-CERT-2026-8841',
      serialNumber: 'LH-CERT-2026-8841',
      userId: user.id,
      userName: user.name || 'جمیل رحمن انصاری',
      courseId: 'crs-isl-1',
      courseTitle: 'قرآنی علوم و تجوید ماسٹر کلاس (Quranic Sciences & Tajweed)',
      instructorName: 'شیخ محمد الہاشمی (Ph.D. Islamic Sciences)',
      issueDate: new Date().toLocaleDateString('ur-PK'),
      grade: 'ممتاز درجہ (Pass with Highest Distinction)'
    };
    window.DB.insert('certificates', demoCert);
    certificates = [demoCert];
  }

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Top Banner -->
      <div class="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/40">
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 font-urdu text-right" dir="rtl">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>آن لائن تصدیق شدہ اسناد</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold font-urdu">میری ڈیجیٹل اسناد و سرٹیفکیٹس</h1>
            <p class="text-xs sm:text-sm text-amber-100 max-w-xl font-urdu leading-relaxed">
              کورسز اور امتحانات کامیابی سے مکمل کرنے پر جاری کی جانے والی مستند اور عالمی سطح پر تصدیق شدہ اسناد۔
            </p>
          </div>

          <a href="#/courses" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none shadow-lg whitespace-nowrap">
            مزید کورسز مکمل کریں &rarr;
          </a>
        </div>
      </div>

      <!-- Certificates Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${certificates.map(cert => `
          <div class="lh-card p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group border-2 border-amber-500/20 hover:border-amber-500 transition-all hover:shadow-2xl font-urdu text-right" dir="rtl">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3" dir="ltr">
                <span class="badge bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-400/30">Verified Credential</span>
                <span class="text-[11px] font-mono font-bold text-slate-400">${cert.certificateNumber || cert.serialNumber}</span>
              </div>
              
              <h3 class="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                ${cert.courseTitle}
              </h3>

              <div class="text-xs text-slate-500 space-y-1">
                <div>حاصل کنندہ: <strong class="text-slate-800 dark:text-slate-200">${cert.userName}</strong></div>
                <div>نگران استاد: <strong class="text-slate-800 dark:text-slate-200">${cert.instructorName || 'LearnHub Faculty'}</strong></div>
                <div>تاریخِ اجراء: <strong class="text-slate-800 dark:text-slate-200 font-mono">${cert.issueDate}</strong></div>
                <div>درجہ: <strong class="text-emerald-600">${cert.grade || 'ممتاز (Distinction)'}</strong></div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2" dir="ltr">
              <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold font-urdu">
                <i data-lucide="eye" class="w-3.5 h-3.5 inline mr-1"></i> سند دیکھیں و ڈاؤنلوڈ کریں
              </button>
              <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber}" class="btn-secondary py-2.5 px-3 text-xs rounded-xl" title="آن لائن تصدیق">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>

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
  const certNumber = params && params.id ? params.id : '';
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
      <div class="max-w-md mx-auto p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
        <input 
          type="text" 
          id="verify-search-input" 
          placeholder="سند کا سیریل نمبر درج کریں (مثلاً: LH-CERT-2026-8841)..." 
          value="${certNumber || ''}" 
          class="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none text-right"
          onkeydown="if(event.key==='Enter') window.Router.navigate('/verify-cert/' + this.value.trim());"
        />
        <button 
          onclick="const val = document.getElementById('verify-search-input').value.trim(); if(val) window.Router.navigate('/verify-cert/' + val);" 
          class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap">
          تصدیق کریں
        </button>
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
              <span class="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">${cert.courseTitle}</span>
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

          <div class="pt-4 flex flex-wrap justify-center gap-3" dir="ltr">
            <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 font-bold border-none font-urdu">
              سند کا مکمل شاہکار ڈیزائن دیکھیں &rarr;
            </button>
            <a href="#/certificates" class="btn-secondary py-2.5 px-5 text-xs rounded-xl font-bold font-urdu">
              تمام اسناد
            </a>
          </div>
        </div>
      ` : certNumber ? `
        <div class="lh-card p-8 sm:p-12 text-center space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto text-xl">⚠️</div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold">درج کردہ سیریل نمبر (${certNumber}) کے مطابق کوئی سند ڈیٹا بیس میں نہیں ملی۔</p>
          <p class="text-xs text-slate-400">براہ کرم سیریل نمبر کی تصدیق کر کے دوبارہ تلاش کریں۔</p>
          <div class="pt-2">
            <a href="#/courses" class="btn-primary py-2 px-6 text-xs rounded-xl font-urdu">کورسز دیکھیں</a>
          </div>
        </div>
      ` : `
        <div class="lh-card p-8 sm:p-12 text-center space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p class="text-xs sm:text-sm text-slate-500 font-urdu">سرٹیفکیٹ کی تصدیق کے لیے اوپر دیے گئے باکس میں سند کا سیریل نمبر درج کریں۔</p>
          <a href="#/certificates" class="btn-secondary py-2 px-5 text-xs rounded-xl font-urdu">میری اسناد دیکھیں</a>
        </div>
      `}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

