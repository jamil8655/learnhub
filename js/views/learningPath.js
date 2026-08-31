/**
 * LearnHub Interactive Learning Path & Milestones Arena (v173.0.0)
 * Visual chronological milestones with locked, unlocked, completed stages and XP progression.
 */

window.Views = window.Views || {};

window.Views.renderLearningPath = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'ur';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  const milestones = [
    { id: 1, title: 'ایمان، توحید و کلمہ طیبہ', sub: 'عقیدہ کے بنیادی اصول اور ارکانِ ایمان', icon: '✨', xp: 100, status: 'completed' },
    { id: 2, title: 'طہارت و طریقہ نماز نبوی ﷺ', sub: 'وضو، غسل اور مسنون طریقہ نماز', icon: '🕌', xp: 150, status: 'completed' },
    { id: 3, title: 'تجوید القرآن و مخارج الحروف', sub: 'حروف کے مخارج اور ادغام و قلقلہ کے قواعد', icon: '📖', xp: 200, status: 'current' },
    { id: 4, title: 'سیرتِ رسولِ اکرم ﷺ و صحابہ کرام', sub: 'مکی و مدنی ادوار اور غزوات کی تاریخ', icon: '📜', xp: 250, status: 'locked' },
    { id: 5, title: 'اصولِ حدیث و فقہ السنہ', sub: 'صحیح، حسن اور ضعیف احادیث کی تمیز', icon: '⚖️', xp: 300, status: 'locked' },
    { id: 6, title: 'میراث و احکامِ شریعت', sub: 'قرآنی حصص اور تقسیمِ ترکہ کا مکمل حساب', icon: '🏆', xp: 500, status: 'locked' }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        <!-- Header Banner -->
        <div class="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-950 text-white border border-teal-600/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-start">
            <span class="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono">
              🎓 تعلیمی شاہراہ (Learning Path)
            </span>
            <h1 class="text-xl sm:text-2xl font-black text-white">علم و عمل کا مرحلہ وار سفر</h1>
            <p class="text-xs text-teal-200">بنیادی عقائد سے لے کر علومِ شریعت کی تکمیل تک شاہی اسناد کا سفر</p>
          </div>
          <div class="px-4 py-2 rounded-2xl bg-teal-950/80 border border-teal-600/60 text-center font-mono shrink-0">
            <div class="text-xs text-slate-300 font-bold">مجموعی پیش رفت</div>
            <div class="text-xl font-black text-amber-300">33% مکمل</div>
          </div>
        </div>

        <!-- Milestones Timeline -->
        <div class="space-y-4 relative">
          ${milestones.map((m, idx) => `
            <div class="p-5 rounded-2xl border transition shadow-xs flex items-center justify-between gap-4 ${
              m.status === 'completed' ? 'bg-white dark:bg-slate-900 border-emerald-500/60' :
              m.status === 'current' ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-2 border-emerald-500 shadow-md' :
              'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
            }">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 shadow-xs ${
                  m.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700' :
                  m.status === 'current' ? 'bg-emerald-600 text-white animate-pulse' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }">
                  ${m.status === 'completed' ? '✓' : (m.status === 'locked' ? '🔒' : m.icon)}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                      m.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700' :
                      m.status === 'current' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }">مرحلہ ${m.id}</span>
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">${m.title}</h3>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">${m.sub}</p>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-2">
                <span class="text-xs font-bold text-amber-500 font-mono hidden sm:inline">+${m.xp} XP</span>
                ${m.status === 'current' ? `
                  <button onclick="window.Router.navigate('/courses')" class="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition">
                    جاری رکھیں
                  </button>
                ` : (m.status === 'completed' ? `
                  <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">کامیاب</span>
                ` : `
                  <span class="text-xs text-slate-400 font-bold">مقفل</span>
                `)}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};
