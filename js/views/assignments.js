/**
 * LearnHub Student Assignments & Homework Submission Module
 * Enables students to submit written essays, PDF files, and audio recitations for course lessons,
 * with live teacher grading (ممتاز / جید جداً / جید) and audio/text feedback remarks.
 */

window.Views = window.Views || {};

window.Views.renderAssignments = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const assignments = [
    {
      id: 'asg-1',
      courseTitle: 'قرآنی تجوید و قراءت ماسٹر کلاس',
      lessonTitle: 'سبق 4: مخارج الحروف اور صفاتِ لازمہ',
      dueDate: '2026-08-28',
      status: 'submitted',
      grade: 'ممتاز (95%)',
      feedback: 'ماشاء اللہ! حروفِ حلقی کی ادائیگی اور غنہ کا تلفظ انتہائی شاندار ہے۔',
      taskDescription: 'سورۃ الفاتحہ کی پہلی 4 آیات کو ترتیل کے ساتھ اپنی آواز میں ریکارڈ کر کے اپلوڈ فرمائیں۔'
    },
    {
      id: 'asg-2',
      courseTitle: 'اربعین نووی شرح و فقہ الحدیث',
      lessonTitle: 'سبق 2: حدیثِ جبریل اور ارکانِ دین',
      dueDate: '2026-08-30',
      status: 'pending',
      grade: null,
      feedback: null,
      taskDescription: 'حدیثِ جبریل سے مستنبط ہونے والے 5 اہم فقہی و اخلاقی فوائد تحریری طور پر درج کریں۔'
    },
    {
      id: 'asg-3',
      courseTitle: 'سیرت النبی ﷺ اور اسلامی تاریخ',
      lessonTitle: 'سبق 5: ہجرتِ مدینہ کے اہم تاریخی اسباق',
      dueDate: '2026-09-05',
      status: 'graded',
      grade: 'جید جداً (88%)',
      feedback: 'مواخاتِ مدینہ اور میثاقِ مدینہ کے نکات بہت اچھے طریقے سے واضح کیے گئے ہیں۔',
      taskDescription: 'ہجرتِ مدینہ کے دوران نبی کریم ﷺ اور حضرت ابوبکر صدیق رضی اللہ عنہ کے سفر کے اہم مراحل کا نقشہ تیار کریں۔'
    }
  ];

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Assignments Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400"></i>
          <span>تعلیمی اسائنمنٹس و ہوم ورک پورٹل (Student Assignments)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">اسائنمنٹس اور ہوم ورک</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          اپنے اسباق کے تحریری ہوم ورک، تلاوت کی آڈیو ریکارڈنگ اور پی ڈی ایف فائلیں جمع کرائیں اور اساتذہ سے تفصیلی ریمارکس پائیں۔
        </p>
      </div>

      <!-- Assignments List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${assignments.map(asg => {
          const isSubmitted = asg.status === 'submitted' || asg.status === 'graded';
          const isGraded = asg.status === 'graded';

          return `
            <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-5 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="badge ${isGraded ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : isSubmitted ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'} font-bold text-xs">
                    ${isGraded ? 'چیک ہو گئی ✓' : isSubmitted ? 'زیرِ جائزہ ⏳' : 'جمع کرانا باقی ⚠️'}
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">آخری تاریخ: ${asg.dueDate}</span>
                </div>

                <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">${asg.courseTitle}</h3>
                <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400">${asg.lessonTitle}</h4>
                
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-urdu">
                  <strong class="text-slate-900 dark:text-white block mb-0.5">📋 مطلوبہ کام:</strong>
                  ${asg.taskDescription}
                </div>

                ${asg.feedback ? `
                  <div class="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-urdu leading-relaxed">
                    <strong class="text-emerald-700 dark:text-emerald-400 block mb-0.5">🌟 استاد کا تبصرہ (گریڈ: ${asg.grade}):</strong>
                    ${asg.feedback}
                  </div>
                ` : ''}
              </div>

              <div class="pt-2">
                <button 
                  onclick="window.Views.openSubmitAssignmentModal('${asg.id}', '${asg.lessonTitle.replace(/'/g, "\\'")}')"
                  class="btn-primary w-full py-2.5 px-4 text-xs rounded-2xl ${isSubmitted ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-black shadow-md flex items-center justify-center gap-2"
                >
                  <i data-lucide="${isSubmitted ? 'refresh-cw' : 'upload'}" class="w-4 h-4"></i>
                  <span>${isSubmitted ? 'دوبارہ جمع کرائیں (Re-submit)' : 'ہوم ورک جمع کرائیں 📤'}</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.openSubmitAssignmentModal = function(asgId, lessonTitle) {
  const modal = document.getElementById('global-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="p-6 sm:p-8 text-center space-y-6 font-urdu text-right" dir="rtl">
      
      <div class="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-lg">
        📝
      </div>

      <div class="space-y-1 text-center">
        <h3 class="text-xl font-black text-slate-900 dark:text-white">ہوم ورک / اسائنمنٹ جمع کرائیں</h3>
        <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">${lessonTitle}</p>
      </div>

      <!-- Submission Tabs: Text / File / Audio -->
      <div class="space-y-4 text-right">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">تحریری جواب درج کریں:</label>
          <textarea 
            id="assignment-text-input" 
            rows="4" 
            placeholder="اپنا تفصیلی جواب، حدیث کا اعراب یا خلاصہ یہاں لکھیں..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-urdu"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- File / PDF upload -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1 text-center">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">پی ڈی ایف / تصویر فائل:</span>
            <input type="file" accept=".pdf,image/*" class="w-full text-[10px] text-slate-500 font-sans">
          </div>

          <!-- Audio Record -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1 text-center">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">تلاوت کی آڈیو ریکارڈنگ:</span>
            <button type="button" onclick="window.App?.showToast('مائیکروفون ریکارڈنگ شروع ہو گئی 🎙️', 'info')" class="py-1.5 px-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold w-full">
              آڈیو ریکارڈ کریں 🎙️
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button 
          onclick="window.App?.closeModal(); window.App?.showToast('ماشاء اللہ! آپ کا ہوم ورک کامیابی سے جمع ہو گیا۔ استاد جلد جائزہ لیں گے! ✨', 'success');"
          class="btn-primary w-full sm:w-auto py-3 px-8 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl"
        >
          ہوم ورک سبمٹ کریں (Submit)
        </button>
        <button onclick="window.App?.closeModal()" class="btn-secondary w-full sm:w-auto py-3 px-6 text-xs rounded-2xl font-bold">
          منسوخ کریں
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};
