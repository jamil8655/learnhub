/**
 * LearnHub Voice Tajweed & Live Recitation Follower Studio (v158.0.0)
 * Real-time word-by-word Quran speech verification, live error detection,
 * and dynamic recited stream rendering.
 */

window.Views = window.Views || {};

window.Views.selectedTajweedSurah = 1;
window.Views.selectedTajweedAyah = 1;

const TAJWEED_STUDIO_SURAHS = [
  {
    id: 1,
    title: 'Surah Al-Fatihah (الفاتحة)',
    ayahs: [
      { num: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے' },
      { num: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urdu: 'تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا پروردگار ہے' },
      { num: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'بہت مہربان، نہایت رحم فرمانے والا ہے' },
      { num: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', urdu: 'روزِ جزا کا تنہا مالک و مختار ہے' },
      { num: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urdu: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں' },
      { num: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urdu: 'ہمیں سیدھے اور سچے راستے پر چلا' },
      { num: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urdu: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا' }
    ]
  },
  {
    id: 112,
    title: 'Surah Al-Ikhlas (الإخلاص)',
    ayahs: [
      { num: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', urdu: 'کہو کہ اللہ ایک ہے' },
      { num: 2, arabic: 'اللَّهُ الصَّمَدُ', urdu: 'اللہ بے نیاز ہے' },
      { num: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', urdu: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے' },
      { num: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', urdu: 'اور کوئی اس کا ہمسر و برابر نہیں' }
    ]
  },
  {
    id: 114,
    title: 'Surah An-Nas (الناس)',
    ayahs: [
      { num: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', urdu: 'کہو کہ میں انسانوں کے پروردگار کی پناہ مانگتا ہوں' },
      { num: 2, arabic: 'مَلِكِ النَّاسِ', urdu: 'جو انسانوں کا حقیقی بادشاہ ہے' },
      { num: 3, arabic: 'إِلَٰهِ النَّاسِ', urdu: 'جو انسانوں کا معبودِ برحق ہے' },
      { num: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', urdu: 'پیچھے ہٹ جانے والے وسوسہ ڈالنے والے کے شر سے' }
    ]
  }
];

window.Views.renderVoiceTajweed = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const curSurah = TAJWEED_STUDIO_SURAHS.find(s => s.id === window.Views.selectedTajweedSurah) || TAJWEED_STUDIO_SURAHS[0];
  const curAyah = curSurah.ayahs.find(a => a.num === window.Views.selectedTajweedAyah) || curSurah.ayahs[0];

  window.QuranVoiceEngine.loadAyah(curAyah.arabic, curAyah.num);

  const L = {
    title: isRtl ? 'صوتی تلاوت، لائیو تجوید ٹریکر و خودکار تصحیح' : 'Live Quran Voice Reciter & Real-Time Tajweed Verification',
    sub: isRtl ? 'مائیکروفون میں تلاوت فرمائیں؛ الفاظ خودکار آگے بڑھیں گے، غلطی پر سرخ نشان اور درست پر الفاظ نیچے لائیو درج ہوں گے۔' : 'Recite into your microphone: words advance in real time, errors flash red, and verified recited words stream live below!',
    surahLabel: isRtl ? 'سورت منتخب کریں:' : 'Select Surah:',
    ayahLabel: isRtl ? 'آیت نمبر:' : 'Ayah:',
    targetHeader: isRtl ? '📖 تلاوت فرمائیے (Recite This Ayah):' : '📖 Recite Aloud Into Microphone:',
    recitedStreamHeader: isRtl ? '✍️ آپ کی تصدیق شدہ لائیو تلاوت (Live Verified Recited Stream):' : '✍️ Live Verified Recited Stream (Auto-Written on Correct Recitation):',
    btnStart: isRtl ? '🎙️ لائیو صوتی تلاوت شروع کریں' : '🎙️ Start Live Voice Recitation',
    btnStop: isRtl ? '⏹️ تلاوت روکیں' : '⏹️ Stop Recitation',
    accuracyLabel: isRtl ? 'درست ادائیگی:' : 'Live Accuracy:',
    statusWaiting: isRtl ? 'مائیک پر کلک کر کے واضح عربی تلفظ میں تلاوت شروع کریں۔' : 'Click the microphone button and start reciting with clear Arabic pronunciation.'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28 select-none" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl animate-pulse">🎙️</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${L.title}</h1>
                <p class="text-[11px] text-teal-200 font-sans">${L.sub}</p>
              </div>
            </div>
            
            <a href="#/quran" class="py-1.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition">
              📖 114 Surahs Directory
            </a>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Surah Selector Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 font-bold shrink-0">${L.surahLabel}</span>
            ${TAJWEED_STUDIO_SURAHS.map(s => `
              <button 
                onclick="window.Views.selectedTajweedSurah = ${s.id}; window.Views.selectedTajweedAyah = 1; window.Views.renderVoiceTajweed();"
                class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${s.id === curSurah.id ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}"
              >
                <span>${s.title}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Main Live Voice Recitation Studio Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-5">
        
        <!-- Ayah Selector Buttons -->
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
          <span class="text-slate-500 font-bold shrink-0">${L.ayahLabel}</span>
          ${curSurah.ayahs.map(a => `
            <button 
              onclick="window.Views.selectedTajweedAyah = ${a.num}; window.Views.renderVoiceTajweed();"
              class="w-8 h-8 rounded-xl font-mono transition flex items-center justify-center font-bold shrink-0 ${a.num === curAyah.num ? 'bg-teal-700 text-amber-300 font-black border border-amber-400/40 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}"
            >
              ${a.num}
            </button>
          `).join('')}
        </div>

        <!-- 1. LIVE ARABIC WORDS TRACKER CARD -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-600/30 shadow-xl space-y-5 text-center">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span class="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-600/30">
              ${curSurah.title} • Ayah ${curAyah.num}
            </span>
            <div class="flex items-center gap-1.5 font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
              <span>${L.accuracyLabel}</span>
              <span id="live-accuracy-badge" class="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">100%</span>
            </div>
          </div>

          <!-- Dynamic Arabic Words Container -->
          <div class="py-4">
            <h2 id="live-quran-words-box" class="text-2xl sm:text-4xl font-arabic font-extrabold text-slate-900 dark:text-slate-50 leading-[2.5] select-none flex flex-wrap justify-center gap-3">
              ${window.QuranVoiceEngine.words.map((w, idx) => `
                <span id="qword-${idx}" class="px-2 py-1 rounded-2xl transition-all duration-300 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/40 scale-105 ring-2 ring-amber-400/30' : 'text-slate-800 dark:text-slate-200'}">
                  ${w.raw}
                </span>
              `).join('')}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">${curAyah.urdu}</p>
          </div>

          <!-- Live Feedback Alert & Status Bar -->
          <div id="live-feedback-box" class="min-h-10 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            ${L.statusWaiting}
          </div>

          <!-- Microphone Big Control Button -->
          <div class="pt-2 flex justify-center">
            <button 
              id="voice-toggle-btn"
              onclick="window.Views.toggleLiveVoiceRecitation()"
              class="py-3.5 px-8 rounded-2xl bg-teal-700 hover:bg-teal-800 text-amber-300 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-amber-400"
            >
              <span id="mic-icon" class="text-xl animate-pulse">🎙️</span>
              <span id="mic-btn-text">${L.btnStart}</span>
            </button>
          </div>

        </div>

        <!-- 2. AUTO-WRITTEN VERIFIED STREAM (WORDS AUTO-WRITE HERE AS USER RECITES CORRECTLY) -->
        <div class="p-6 rounded-3xl bg-gradient-to-br from-teal-900/90 to-slate-900 text-white border-2 border-amber-400/60 shadow-xl space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">
              ${L.recitedStreamHeader}
            </h3>
            <span class="text-[10px] font-mono text-teal-200 font-bold bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-600/40">
              AI VERIFIED STREAM
            </span>
          </div>

          <div id="live-recited-stream-box" class="min-h-16 p-4 rounded-2xl bg-slate-950/60 border border-teal-700/50 flex flex-wrap items-center gap-2 text-lg sm:text-2xl font-arabic font-extrabold text-emerald-400">
            <span class="text-xs text-slate-400 font-sans italic font-normal">
              Words correctly recited into the microphone will automatically flow and appear here in sequence...
            </span>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Toggle Voice Recitation
window.Views.toggleLiveVoiceRecitation = function() {
  const engine = window.QuranVoiceEngine;
  const btnText = document.getElementById('mic-btn-text');
  const micIcon = document.getElementById('mic-icon');
  const feedbackBox = document.getElementById('live-feedback-box');
  const streamBox = document.getElementById('live-recited-stream-box');
  const accBadge = document.getElementById('live-accuracy-badge');

  if (engine.isListening) {
    engine.stopListening();
    if (btnText) btnText.textContent = '🎙️ Start Live Voice Recitation';
    if (micIcon) micIcon.classList.remove('animate-ping');
    if (feedbackBox) feedbackBox.innerHTML = '⏹️ Recitation paused. Click to resume.';
    window.App?.showToast('Voice recitation paused', 'info');
    return;
  }

  if (btnText) btnText.textContent = '⏹️ Listening... Stop Recitation';
  if (micIcon) micIcon.classList.add('animate-ping');
  if (feedbackBox) feedbackBox.innerHTML = '<span class="text-teal-600 dark:text-teal-400 animate-pulse">🎙️ Listening to your recitation... Recite clearly word by word!</span>';
  if (streamBox) streamBox.innerHTML = '';

  const started = engine.startListening(
    // 1. On Word Update
    (update) => {
      // Update words styling
      update.words.forEach((w, idx) => {
        const el = document.getElementById('qword-' + idx);
        if (!el) return;

        el.className = 'px-2 py-1 rounded-2xl transition-all duration-300 border ';
        if (w.state === 'correct') {
          el.className += 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 font-black scale-105';
        } else if (w.state === 'error') {
          el.className += 'bg-rose-500/20 text-rose-600 border-rose-500 font-black animate-shake';
        } else if (w.state === 'active') {
          el.className += 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/60 font-black scale-105 ring-2 ring-amber-400/30';
        } else {
          el.className += 'text-slate-800 dark:text-slate-200 border-transparent';
        }
      });

      // Update Live Recited Stream
      if (streamBox && update.recitedStream.length > 0) {
        streamBox.innerHTML = update.recitedStream.map(w => `<span class="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs animate-scale">${w}</span>`).join(' ');
      }

      // Update Accuracy
      if (accBadge) {
        accBadge.textContent = update.accuracy + '%';
        accBadge.className = 'px-2 py-0.5 rounded-lg ' + (update.accuracy >= 80 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300');
      }

      // Update Feedback message
      if (feedbackBox) {
        if (update.isCorrect) {
          feedbackBox.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-black">✓ Correct: "${update.matchedWord}" — Continue reciting!</span>`;
        } else {
          feedbackBox.innerHTML = `<span class="text-rose-600 font-bold">⚠️ Pronunciation Error on "${update.expectedWord}" (Heard: "${update.spokenWord || ''}"). Please repeat the word.</span>`;
        }
      }
    },

    // 2. On Ayah Complete
    (result) => {
      if (feedbackBox) {
        feedbackBox.innerHTML = `<span class="text-emerald-500 font-black text-sm">🎉 MUBARAK! Ayah ${result.ayahNumber} successfully recited with ${result.accuracy}% accuracy!</span>`;
      }
      window.App?.showToast(`🎉 Ayah ${result.ayahNumber} Complete! (+50 XP)`, 'success');
      
      setTimeout(() => {
        const curSurah = TAJWEED_STUDIO_SURAHS.find(s => s.id === window.Views.selectedTajweedSurah) || TAJWEED_STUDIO_SURAHS[0];
        if (window.Views.selectedTajweedAyah < curSurah.ayahs.length) {
          window.Views.selectedTajweedAyah++;
          window.Views.renderVoiceTajweed();
          window.Views.toggleLiveVoiceRecitation();
        }
      }, 1800);
    },

    // 3. On Error
    (errMsg) => {
      if (feedbackBox) feedbackBox.innerHTML = `<span class="text-rose-500">${errMsg}</span>`;
    }
  );

  if (!started) {
    window.App?.showToast('Microphone access is required for live voice recitation.', 'error');
  }
};
