/**
 * LearnHub Live Online Classes & Interactive Webinars
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderLiveClasses = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const liveSchedule = [
    {
      id: 'live-1',
      title: 'براہِ راست درسِ صحیح بخاری (کتاب العلم)',
      instructor: 'فضیلۃ الشیخ مولانا عبد الرحمٰن سلفی',
      time: 'آج شام 08:30 PM (بھارتی/پاکستانی وقت)',
      status: 'live_soon',
      countdown: '35 منٹ باقی ہیں',
      meetingUrl: 'https://meet.google.com',
      platform: 'Google Meet',
      course: 'اربعین نووی و صحیح بخاری ماسٹر کلاس',
      attendees: 142
    },
    {
      id: 'live-2',
      title: 'تجوید الحروف اور عملی تلاوت کی اصلاح',
      instructor: 'قاری محمد عمران انصاری',
      time: 'کل صبح 10:00 AM',
      status: 'scheduled',
      countdown: '15 گھنٹے باقی ہیں',
      meetingUrl: 'https://zoom.us',
      platform: 'Zoom Cloud Meeting',
      course: 'قرآنی تجوید و قراءت ماسٹر کلاس',
      attendees: 88
    },
    {
      id: 'live-3',
      title: 'سیرت النبی ﷺ: غزوات کا تاریخی و جغرافیائی جائزہ',
      instructor: 'ڈاکٹر حافظ صہیب حسن',
      time: 'اتوار شام 05:00 PM',
      status: 'scheduled',
      countdown: '2 دن باقی ہیں',
      meetingUrl: 'https://meet.google.com',
      platform: 'Google Meet',
      course: 'سیرت النبی ﷺ اور اسلامی تاریخ',
      attendees: 210
    }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Luxury Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm relative overflow-hidden text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>لائیو آن لائن کلاس روم (Interactive Live Classes)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">براہِ راست درس و انٹرایکٹو کلاسز</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            مستند اساتذہ کے ساتھ آمنے سامنے براہِ راست سوال و جواب، تلاوت کی مشق اور لائیو دروس میں شرکت فرمائیں۔
          </p>
        </div>

        <!-- Schedule Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${liveSchedule.map(cls => {
            const isLiveSoon = cls.status === 'live_soon';

            return `
              <div class="rounded-3xl bg-white dark:bg-slate-800 border ${isLiveSoon ? 'border-rose-400/80 shadow-md shadow-rose-500/5 ring-1 ring-rose-500/20' : 'border-slate-200/90 dark:border-slate-700'} shadow-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${isLiveSoon ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
                      ${isLiveSoon ? '<span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> لائیو شروع ہونے والا ہے' : '📅 شیڈول شدہ'}
                    </span>
                    <span class="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400">${cls.countdown}</span>
                  </div>

                  <h3 class="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug">${cls.title}</h3>
                  
                  <div class="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div class="flex items-center gap-2">
                      <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
                      <span class="font-bold text-slate-800 dark:text-slate-200">${cls.instructor}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                      <span>${cls.time}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i data-lucide="video" class="w-3.5 h-3.5 text-indigo-500"></i>
                      <span>پلیٹ فارم: ${cls.platform}</span>
                    </div>
                  </div>

                  <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span class="truncate">${cls.course}</span>
                    <span class="font-mono font-bold text-teal-700 dark:text-teal-400 shrink-0 mr-2">${cls.attendees} شرکاء</span>
                  </div>
                </div>

                <div class="pt-2">
                  <a 
                    href="${cls.meetingUrl}" 
                    target="_blank"
                    onclick="window.App?.showToast('لائیو کلاس روم میں خوش آمدید! روم کھولا جا رہا ہے... 🎥', 'success')"
                    class="w-full py-2.5 px-4 text-xs rounded-xl ${isLiveSoon ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20' : 'bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-700/20'} font-bold flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <i data-lucide="video" class="w-4 h-4"></i>
                    <span>لائیو کلاس میں شامل ہوں (Join Live)</span>
                  </a>
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
