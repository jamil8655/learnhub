/**
 * LearnHub Live Online Classes & Webinar Scheduler Module
 * Features countdown timers, integrated Zoom/Google Meet launchers,
 * and archived video lecture replays for registered courses.
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
      platform: 'گوگل میٹ (Google Meet)',
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
      platform: 'زوم (Zoom Cloud Meeting)',
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
      platform: 'گوگل میٹ (Google Meet)',
      course: 'سیرت النبی ﷺ اور اسلامی تاریخ',
      attendees: 210
    }
  ];

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Live Classes Hero Banner -->
      <div class="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-rose-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold shadow-sm">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>لائیو آن لائن کلاس روم (Live Interactive Classes)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">براہِ راست درس و انٹرایکٹو کلاسز</h1>
        <p class="text-xs sm:text-sm text-rose-100/90 max-w-2xl mx-auto leading-relaxed">
          اساتذہ کے ساتھ آمنے سامنے براہ راست سوال و جواب، تلاوت کی مشق، اور لائیو دروس میں شرکت فرمائیں۔
        </p>
      </div>

      <!-- Schedule Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${liveSchedule.map(cls => {
          const isLiveSoon = cls.status === 'live_soon';

          return `
            <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border-2 ${isLiveSoon ? 'border-rose-500 shadow-rose-500/10' : 'border-slate-200 dark:border-slate-800'} shadow-xl p-6 space-y-5 flex flex-col justify-between">
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="badge ${isLiveSoon ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} font-bold text-xs">
                    ${isLiveSoon ? '🔴 لائیو شروع ہونے والا ہے' : '📅 شیڈول شدہ'}
                  </span>
                  <span class="text-[11px] font-mono font-bold text-amber-500">${cls.countdown}</span>
                </div>

                <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">${cls.title}</h3>
                
                <div class="space-y-1 text-xs text-slate-500">
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="user" class="w-3.5 h-3.5 text-emerald-500"></i>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${cls.instructor}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                    <span>${cls.time}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="video" class="w-3.5 h-3.5 text-indigo-500"></i>
                    <span>پلیٹ فارم: ${cls.platform}</span>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>کورس: ${cls.course}</span>
                  <span class="font-mono font-bold text-emerald-600">${cls.attendees} شرکاء</span>
                </div>
              </div>

              <div class="pt-2">
                <a 
                  href="${cls.meetingUrl}" 
                  target="_blank"
                  onclick="window.App?.showToast('لائیو کلاس میں خوش آمدید! روم کھولا جا رہا ہے... 🎥', 'success')"
                  class="btn-primary w-full py-3 px-4 text-xs rounded-2xl ${isLiveSoon ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-black shadow-lg flex items-center justify-center gap-2"
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
  `;

  if (window.lucide) window.lucide.createIcons();
};
