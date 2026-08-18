/**
 * LearnHub Certificates Module & Public Verification Portal
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

  const certificates = window.DB.get('certificates').filter(c => c.userId === user.id);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
            <i data-lucide="award" class="w-3.5 h-3.5"></i> Verified Credentials
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">My Certificates</h1>
          <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Official certificates awarded upon successful masterclass completion.</p>
        </div>
      </div>

      ${certificates.length === 0 ? `
        <div class="lh-card p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <i data-lucide="award" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">No certificates earned yet</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Complete 100% of any enrolled course curriculum to automatically receive your verified credential.</p>
          <a href="#/courses" class="btn-primary py-2 px-4 text-xs">Browse Courses</a>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${certificates.map(cert => `
            <div class="lh-card p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="badge badge-success text-[10px]">Verified Certificate</span>
                  <span class="text-[10px] font-mono text-slate-400">${cert.certificateNumber}</span>
                </div>
                
                <h3 class="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                  ${cert.courseTitle}
                </h3>

                <div class="text-xs text-slate-500 space-y-1">
                  <div>Issued to: <strong>${cert.userName}</strong></div>
                  <div>Instructor: <strong>${cert.instructorName}</strong></div>
                  <div>Date: <strong>${cert.issueDate}</strong></div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary flex-1 py-2 text-xs rounded-xl">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i> View Certificate
                </button>
                <a href="#/verify-cert/${cert.certificateNumber}" class="btn-secondary py-2 px-3 text-xs rounded-xl" title="Public Verification Link">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
};

// Certificate Interactive Viewer Modal
window.Views.openCertificateViewer = function(certId) {
  const cert = window.DB.findById('certificates', certId);
  if (!cert) return;

  window.App.showModal('Official Certificate Preview', `
    <div class="space-y-6">
      <div id="printable-certificate" class="certificate-frame p-8 sm:p-12 text-center bg-white text-slate-900 rounded-2xl relative overflow-hidden shadow-2xl">
        <!-- Certificate Header -->
        <div class="flex items-center justify-between border-b-2 border-indigo-900 pb-4 mb-6">
          <div class="text-left">
            <span class="text-xs uppercase tracking-widest font-extrabold text-indigo-700">LearnHub Academy</span>
            <div class="text-[10px] text-slate-500">Global Center of Engineering Excellence</div>
          </div>
          <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-700 to-cyan-600 flex items-center justify-center text-white shadow-md">
            <i data-lucide="award" class="w-7 h-7"></i>
          </div>
        </div>

        <!-- Body -->
        <div class="space-y-4">
          <p class="text-xs uppercase tracking-widest text-slate-500 font-semibold">Certificate of Mastery & Completion</p>
          <p class="text-xs text-slate-600">This certifies that</p>
          
          <h2 class="text-3xl font-extrabold text-indigo-950 font-serif my-2 tracking-tight">${cert.userName}</h2>
          
          <p class="text-xs text-slate-600">has successfully completed the comprehensive curriculum for</p>
          <h3 class="text-xl font-extrabold text-indigo-700 max-w-xl mx-auto">${cert.courseTitle}</h3>
          <p class="text-xs text-slate-500">Grade: <strong class="text-emerald-700">${cert.grade || 'Pass with Distinction'}</strong></p>
        </div>

        <!-- Signatures & Verification Code -->
        <div class="grid grid-cols-3 gap-4 pt-10 mt-6 border-t border-slate-200 text-left items-end">
          <div>
            <div class="font-serif italic text-sm text-slate-800 mb-1">${cert.instructorName}</div>
            <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-t border-slate-300 pt-1">Authorized Instructor</div>
          </div>

          <div class="text-center">
            <div class="inline-block p-2 border border-dashed border-slate-300 rounded-lg">
              <div class="text-[9px] font-mono text-slate-400 uppercase">Verification Code</div>
              <div class="text-xs font-mono font-bold text-indigo-700">${cert.certificateNumber}</div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs text-slate-800 mb-1">${cert.issueDate}</div>
            <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-t border-slate-300 pt-1">Date of Issuance</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-3">
        <button onclick="window.print()" class="btn-primary py-2.5 px-6 text-xs rounded-xl">
          <i data-lucide="printer" class="w-4 h-4"></i> Print / Save PDF
        </button>
        <button onclick="navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#/verify-cert/' + '${cert.certificateNumber}'); window.App.showToast('Verification URL copied to clipboard!', 'success');" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
          <i data-lucide="copy" class="w-4 h-4"></i> Copy Verification Link
        </button>
      </div>
    </div>
  `);
};

// Public Certificate Verification View
window.Views.renderVerifyCertificate = async function(params) {
  const container = document.getElementById('main-content');
  const certNumber = params.id;
  const cert = await window.API.getCertificateByNumber(certNumber);

  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      <div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${cert ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border border-rose-200'} text-xs font-bold mb-4">
          <i data-lucide="${cert ? 'shield-check' : 'shield-alert'}" class="w-4 h-4"></i>
          <span>${cert ? 'VALID & DIGITALLY VERIFIED' : 'CERTIFICATE NOT FOUND'}</span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">LearnHub Credential Verification</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Official registry record for certificate serial: <strong class="font-mono text-indigo-600">${certNumber}</strong></p>
      </div>

      ${cert ? `
        <div class="lh-card p-8 text-left space-y-6 shadow-xl border-2 border-emerald-100 dark:border-emerald-950">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Recipient</div>
              <div class="text-base font-extrabold text-slate-900 dark:text-white">${cert.userName}</div>
            </div>
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Status</div>
              <span class="badge badge-success">Authentic & Active</span>
            </div>
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Masterclass Completed</div>
              <div class="font-bold text-indigo-600 dark:text-indigo-400">${cert.courseTitle}</div>
            </div>
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Instructor of Record</div>
              <div class="font-semibold text-slate-800 dark:text-slate-200">${cert.instructorName}</div>
            </div>
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Date of Completion</div>
              <div class="text-slate-800 dark:text-slate-200">${cert.issueDate}</div>
            </div>
            <div>
              <div class="text-slate-400 text-xs font-semibold mb-1">Issuing Authority</div>
              <div class="text-slate-800 dark:text-slate-200">LearnHub Global Academic Board</div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary py-2 px-5 text-xs rounded-xl">
              Preview Full Certificate
            </button>
          </div>
        </div>
      ` : `
        <div class="lh-card p-8 space-y-4">
          <p class="text-xs text-slate-500">No active certificate records match the serial <strong>${certNumber}</strong>.</p>
          <a href="#/courses" class="btn-secondary py-2 px-4 text-xs">Explore Verified Courses</a>
        </div>
      `}
    </div>
  `;
};
