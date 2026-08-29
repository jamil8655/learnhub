/**
 * LearnHub Student Assignments & Homework Submission Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderAssignments = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

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
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Banner -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="file-check-2" class="w-4 h-4 text-teal-600"></i>
            <span>تعلیمی اسائنمنٹس و ہوم ورک پورٹل (Student Assignments)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">اسائنمنٹس اور ہوم ورک</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            اپنے اسباق کے تحریری ہوم ورک، تلاوت کی آڈیو ریکارڈنگ اور پی ڈی ایف فائلیں جمع کرائیں اور اساتذہ سے تفصیلی ریمارکس پائیں۔
          </p>
        </div>

        <!-- Assignments Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${assignments.map(asg => {
            const isSubmitted = asg.status === 'submitted' || asg.status === 'graded';
            const isGraded = asg.status === 'graded';

            return `
              <div class="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-md ${isGraded ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30' : isSubmitted ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-500/30'} font-bold text-[11px]">
                      ${isGraded ? 'چیک ہو گئی ✓' : isSubmitted ? 'زیرِ جائزہ ⏳' : 'جمع کرانا باقی ⚠️'}
                    </span>
                    <span class="text-[11px] font-mono text-slate-400">آخری تاریخ: ${asg.dueDate}</span>
                  </div>

                  <h3 class="font-black text-sm text-slate-900 dark:text-white leading-snug">${asg.courseTitle}</h3>
                  <h4 class="text-xs font-bold text-teal-700 dark:text-teal-400">${asg.lessonTitle}</h4>
                  
                  <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong class="text-slate-900 dark:text-white block mb-0.5 font-bold">📋 مطلوبہ کام:</strong>
                    ${asg.taskDescription}
                  </div>

                  ${asg.feedback ? `
                    <div class="p-3 bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl border border-teal-600/30 text-xs text-teal-950 dark:text-teal-200 leading-relaxed">
                      <strong class="text-teal-700 dark:text-teal-400 block mb-0.5 font-bold">🌟 استاد کا تبصرہ (گریڈ: ${asg.grade}):</strong>
                      ${asg.feedback}
                    </div>
                  ` : ''}
                </div>

                <div class="pt-2">
                  <button 
                    onclick="window.Views.openSubmitAssignmentModal('${asg.id}', '${asg.lessonTitle.replace(/'/g, "\\'")}')"
                    class="w-full py-2.5 px-4 text-xs rounded-xl ${isSubmitted ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'} font-bold flex items-center justify-center gap-2 transition active:scale-95"
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
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.openSubmitAssignmentModal = function(asgId, lessonTitle) {
  const modal = document.getElementById('global-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="p-6 sm:p-8 text-center space-y-5 font-urdu text-right" dir="rtl">
      
      <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 flex items-center justify-center mx-auto text-2xl shadow-sm">
        📝
      </div>

      <div class="space-y-1 text-center">
        <h3 class="text-lg font-black text-slate-900 dark:text-white">ہوم ورک / اسائنمنٹ جمع کرائیں</h3>
        <p class="text-xs text-teal-700 dark:text-teal-400 font-bold">${lessonTitle}</p>
      </div>

      <div class="space-y-3 text-right">
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">تحریری جواب درج کریں:</label>
          <textarea 
            id="assignment-text-input" 
            rows="4" 
            placeholder="اپنا تفصیلی جواب یا خلاصہ یہاں لکھیں..."
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-center">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">پی ڈی ایف / تصویر فائل:</span>
            <input type="file" accept=".pdf,image/*" class="w-full text-[10px] text-slate-500 font-sans">
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-center">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">تلاوت کی آڈیو ریکارڈنگ:</span>
            <button type="button" onclick="window.App?.showToast('مائیکروفون ریکارڈنگ شروع ہو گئی 🎙️', 'info')" class="py-1.5 px-3 rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-600/30 text-xs font-bold w-full">
              آڈیو ریکارڈ کریں 🎙️
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button 
          onclick="window.App?.closeModal(); window.App?.showToast('ماشاء اللہ! آپ کا ہوم ورک کامیابی سے جمع ہو گیا۔ استاد جلد جائزہ لیں گے! ✨', 'success');"
          class="w-full sm:w-auto py-2.5 px-6 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm transition active:scale-95"
        >
          ہوم ورک سبمٹ کریں (Submit)
        </button>
        <button onclick="window.App?.closeModal()" class="w-full sm:w-auto py-2.5 px-5 text-xs rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition">
          منسوخ کریں
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};
