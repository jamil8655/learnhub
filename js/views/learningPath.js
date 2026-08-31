/**
 * LearnHub Interactive Learning Paths & Academic Journey (v179.0.0)
 * Visual chronological milestones with locked, unlocked, completed stages and XP progression.
 * Trilingual Edition: English (Default), Urdu, Arabic
 */

window.Views = window.Views || {};

window.Views.renderLearningPath = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  const L = {
    badge: isRtl ? (currentLang === 'ur' ? '🎓 تعلیمی شاہراہ' : '🎓 المسار التعليمي') : '🎓 Academic Learning Journey',
    title: isRtl ? (currentLang === 'ur' ? 'علم و عمل کا مرحلہ وار سفر' : 'رحلة التعلم والتفقه المنهجي') : 'Structured Islamic Knowledge Path',
    sub: isRtl ? (currentLang === 'ur' ? 'بنیادی عقائد سے لے کر علومِ شریعت کی تکمیل تک شاہی اسناد کا سفر' : 'من العقيدة والقرآن إلى علوم الحديث والاجتهاد') : 'From fundamental Aqeedah and Quranic Tajweed to Hadith and Shariah sciences.',
    overallProgress: isRtl ? (currentLang === 'ur' ? 'مجموعی پیش رفت' : 'التقدم العام') : 'Overall Progress',
    completedText: isRtl ? (currentLang === 'ur' ? '33% مکمل' : '33% مكتمل') : '33% Completed',
    stageLabel: isRtl ? (currentLang === 'ur' ? 'مرحلہ' : 'المرحلة') : 'Stage',
    continueBtn: isRtl ? (currentLang === 'ur' ? 'جاری رکھیں' : 'متابعة') : 'Continue',
    completedBadge: isRtl ? (currentLang === 'ur' ? 'کامیاب' : 'مكتمل') : 'Completed',
    lockedBadge: isRtl ? (currentLang === 'ur' ? 'مقفل' : 'مغلق') : 'Locked',
    
    stages: [
      { 
        id: 1, 
        title: isRtl ? (currentLang === 'ur' ? 'ایمان، توحید و کلمہ طیبہ' : 'الإيمان والتوحيد وأركان الإسلام') : 'Faith, Tawheed & Core Pillars', 
        sub: isRtl ? (currentLang === 'ur' ? 'عقیدہ کے بنیادی اصول اور ارکانِ ایمان' : 'أسس العقيدة الصحيحة ومعرفة أركان الإيمان') : 'Foundations of Islamic Aqeedah and Articles of Faith', 
        icon: '✨', 
        xp: 100, 
        status: 'completed' 
      },
      { 
        id: 2, 
        title: isRtl ? (currentLang === 'ur' ? 'طہارت و طریقہ نماز نبوی ﷺ' : 'الطهارة وصفة صلاة النبي ﷺ') : 'Purification & Prophetic Prayer', 
        sub: isRtl ? (currentLang === 'ur' ? 'وضو، غسل اور مسنون طریقہ نماز' : 'أحكام الوضوء والغسل وصفة الصلاة الصحيحة') : 'Step-by-step Wudu, Ghusl, and authentic Salah format', 
        icon: '🕌', 
        xp: 150, 
        status: 'completed' 
      },
      { 
        id: 3, 
        title: isRtl ? (currentLang === 'ur' ? 'تجوید القرآن و مخارج الحروف' : 'تجويد القرآن الكريم ومخارج الحروف') : 'Quranic Tajweed & Articulation Rules', 
        sub: isRtl ? (currentLang === 'ur' ? 'حروف کے مخارج اور ادغام و قلقلہ کے قواعد' : 'مخارج الحروف وقواعد النون الساكنة والإدغام') : 'Makharij, Idgham, Ikhfa, and Qalqalah recitation mastery', 
        icon: '📖', 
        xp: 200, 
        status: 'current' 
      },
      { 
        id: 4, 
        title: isRtl ? (currentLang === 'ur' ? 'سیرتِ رسولِ اکرم ﷺ و صحابہ کرام' : 'السيرة النبوية العطرة وتاريخ الصحابة') : 'Prophetic Seerah & Companions Timeline', 
        sub: isRtl ? (currentLang === 'ur' ? 'مکی و مدنی ادوار اور غزوات کی تاریخ' : 'العهدين المكي والمدني وغزوات الإسلام الكبرى') : 'Chronology of Makkan & Madinan milestones and lessons', 
        icon: '📜', 
        xp: 250, 
        status: 'locked' 
      },
      { 
        id: 5, 
        title: isRtl ? (currentLang === 'ur' ? 'اصولِ حدیث و فقہ السنہ' : 'أصول الحديث ومصطلحه وفقه السنة') : 'Hadith Methodology & Usul al-Fiqh', 
        sub: isRtl ? (currentLang === 'ur' ? 'صحیح، حسن اور ضعیف احادیث کی تمیز' : 'درجات الحديث وقواعد الاستنباط الفقهي') : 'Grading authentic vs weak traditions and legal deduction', 
        icon: '⚖️', 
        xp: 300, 
        status: 'locked' 
      },
      { 
        id: 6, 
        title: isRtl ? (currentLang === 'ur' ? 'علم الفرائض و میراث' : 'علم الفرائض وقسمة التركات') : 'Islamic Mirath & Inheritance Law', 
        sub: isRtl ? (currentLang === 'ur' ? 'قرآنی حصص اور تقسیمِ ترکہ کا مکمل حساب' : 'توزيع الأنصبة الشرعية وحساب المواريث') : 'Quranic shares, legal calculations, and estate distribution', 
        icon: '🏆', 
        xp: 500, 
        status: 'locked' 
      }
    ]
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        <!-- Header Banner -->
        <div class="p-6 rounded-3xl bg-teal-800 text-white border border-teal-600/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-start">
            <span class="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono">
              ${L.badge}
            </span>
            <h1 class="text-xl sm:text-2xl font-black text-white font-arabic">${L.title}</h1>
            <p class="text-xs text-teal-200">${L.sub}</p>
          </div>
          <div class="px-4 py-2 rounded-2xl bg-teal-950/80 border border-teal-600/60 text-center font-mono shrink-0">
            <div class="text-xs text-slate-300 font-bold">${L.overallProgress}</div>
            <div class="text-xl font-black text-amber-300">${L.completedText}</div>
          </div>
        </div>

        <!-- Milestones Timeline -->
        <div class="space-y-4 relative">
          ${L.stages.map((m) => `
            <div class="p-5 rounded-2xl border transition shadow-xs flex items-center justify-between gap-4 ${
              m.status === 'completed' ? 'bg-white dark:bg-slate-900 border-teal-500/60' :
              m.status === 'current' ? 'bg-teal-50/50 dark:bg-teal-950/30 border-2 border-teal-500 shadow-md' :
              'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
            }">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 shadow-xs ${
                  m.status === 'completed' ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700' :
                  m.status === 'current' ? 'bg-teal-600 text-white animate-pulse' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }">
                  ${m.status === 'completed' ? '✓' : (m.status === 'locked' ? '🔒' : m.icon)}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                      m.status === 'completed' ? 'bg-teal-100 dark:bg-teal-950 text-teal-700' :
                      m.status === 'current' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }">${L.stageLabel} ${m.id}</span>
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">${m.title}</h3>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">${m.sub}</p>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-2">
                <span class="text-xs font-bold text-amber-500 font-mono hidden sm:inline">+${m.xp} XP</span>
                ${m.status === 'current' ? `
                  <button onclick="window.Router.navigate('/courses')" class="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer">
                    ${L.continueBtn}
                  </button>
                ` : (m.status === 'completed' ? `
                  <span class="text-xs font-bold text-teal-600 flex items-center gap-1">${L.completedBadge}</span>
                ` : `
                  <span class="text-xs text-slate-400 font-bold">${L.lockedBadge}</span>
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
