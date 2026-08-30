/**
 * LearnHub Voice Tajweed & Non-Stop Hifz Testing Studio (v160.0.0)
 * Features:
 * 1. Full 114 Surahs Selector (Al-Fatihah, Al-Baqarah, Ya-Sin, Al-Mulk, Juz Amma, etc.)
 * 2. 1-Click Continuous Voice Reciter (Engine never stops until the Surah ends)
 * 3. Blind Hifz Mode (Hafiz recites from memory; Arabic text auto-writes on the page)
 * 4. Error warnings with repeat prompts & live accuracy scoring
 */

window.Views = window.Views || {};
window.Views.selectedTajweedSurahNumber = 1;
window.Views.isBlindHifzMode = false;

window.Views.renderVoiceTajweed = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) || [];
  const curSurahMeta = surahs.find(s => s.number === window.Views.selectedTajweedSurahNumber) || surahs[0] || { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', totalAyahs: 7 };

  let verses = [];
  if (window.QuranService && typeof window.QuranService.getSurahVerses === 'function') {
    verses = await window.QuranService.getSurahVerses(curSurahMeta.number);
  }

  if (!verses || verses.length === 0) {
    verses = [
      { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
      { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' },
      { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ' },
      { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
      { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
      { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' }
    ];
  }

  window.QuranVoiceEngine.loadSurah(curSurahMeta.number, verses);
  window.QuranVoiceEngine.isHifzBlindMode = window.Views.isBlindHifzMode;

  const engine = window.QuranVoiceEngine;

  const L = {
    title: isRtl ? 'صوتی تلاوت، لائیو تجوید ٹریکر و خودکار حفظ سامع' : 'Live Quran Voice Reciter & Continuous Hifz Partner',
    sub: isRtl ? 'تمام 114 سورتوں میں مسلسل صوتی تلاوت؛ ایک بار مائیک دبائیں، اے آئی پیچھے پیچھے لکھتا جائے گا اور غلطی پر تنبیہ کرے گا۔' : 'Continuous voice recitation across all 114 Surahs. Start once and recite non-stop; the AI transcribes, catches mistakes, and guides you to the end of the Surah!',
    selectSurah: isRtl ? 'سورت منتخب کریں:' : 'Select Surah (1 to 114):',
    btnStart: isRtl ? '🎙️ مسلسل صوتی تلاوت شروع کریں (ایک کلک)' : '🎙️ Start Continuous Recitation',
    btnStop: isRtl ? '⏹️ تلاوت روکیں' : '⏹️ Pause Recitation',
    modeFollower: isRtl ? '👁️ متنی رہنمائی موڈ (Visible)' : '👁️ Text Follower Mode',
    modeBlindHifz: isRtl ? '🧠 غائبانہ حفظ موڈ (Blind Hifz)' : '🧠 Blind Hifz Mode (Recite from Memory)',
    statusReady: isRtl ? 'مائیکروفون کا بٹن دبائیں اور مسلسل تلاوت فرمائیں۔ سورت مکمل ہونے تک سسٹم خودکار آگے بڑھتا رہے گا۔' : 'Press Start Continuous Recitation and recite aloud. The AI will listen and advance verse by verse until the Surah ends!',
    ayahProgress: isRtl ? 'آیت کی پیش رفت:' : 'Ayah Progress:',
    accuracy: isRtl ? 'درست ادائیگی:' : 'Live Accuracy:'
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
            
            <a href="#/quran/${curSurahMeta.number}" class="py-1.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition">
              📖 Open in Quran Hub
            </a>
          </div>
        </div>

        <!-- 114 Surahs Search & Quick Select Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-2">
          <div class="max-w-4xl mx-auto px-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-teal-200 font-bold shrink-0">${L.selectSurah}</span>
              <select 
                id="voice-surah-select"
                onchange="window.Views.selectedTajweedSurahNumber = parseInt(this.value, 10); window.Views.renderVoiceTajweed();"
                class="py-1 px-3 rounded-xl bg-teal-950 text-amber-300 font-bold border border-teal-600 focus:outline-none"
              >
                ${surahs.map(s => `
                  <option value="${s.number}" ${s.number === curSurahMeta.number ? 'selected' : ''}>
                    ${s.number}. ${s.nameArabic} (${s.nameEnglish}) - ${s.totalAyahs} Ayahs
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Mode Selector (Visible Follower vs Blind Hifz) -->
            <div class="flex items-center gap-1.5 font-bold">
              <button 
                onclick="window.Views.isBlindHifzMode = false; window.Views.renderVoiceTajweed();"
                class="py-1 px-2.5 rounded-xl transition ${!window.Views.isBlindHifzMode ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950 text-teal-200 hover:text-white'}"
              >
                ${L.modeFollower}
              </button>
              <button 
                onclick="window.Views.isBlindHifzMode = true; window.Views.renderVoiceTajweed();"
                class="py-1 px-2.5 rounded-xl transition ${window.Views.isBlindHifzMode ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950 text-teal-200 hover:text-white'}"
              >
                ${L.modeBlindHifz}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Live Recitation Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-5">
        
        <!-- Active Status & Progress Bar -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs font-bold">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/30">
              ${curSurahMeta.number}. ${curSurahMeta.nameArabic} (${curSurahMeta.nameEnglish})
            </span>
            <span id="live-ayah-counter" class="font-mono text-slate-500">
              Ayah <strong>1</strong> of <strong>${verses.length}</strong>
            </span>
          </div>

          <div class="flex items-center gap-2 font-mono">
            <span class="text-slate-400">${L.accuracy}</span>
            <span id="live-accuracy-badge" class="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">100%</span>
          </div>
        </div>

        <!-- 1. LIVE ACTIVE AYAH WORDS / HIFZ CANVAS -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-600/30 shadow-xl space-y-4 text-center">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <span class="text-xs font-bold text-amber-500 uppercase tracking-wider">
              ${window.Views.isBlindHifzMode ? '🧠 Blind Hifz Mode (Reciting from Memory)' : '📖 Live Word Tracking'}
            </span>
            <span id="active-ayah-tag" class="font-arabic font-bold text-teal-700 dark:text-teal-300 text-sm">
              آية رقم 1
            </span>
          </div>

          <!-- Words Container (Concealed if Blind Hifz Mode) -->
          <div class="py-4 min-h-24 flex items-center justify-center">
            ${window.Views.isBlindHifzMode ? `
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-teal-600/40 text-center space-y-2 max-w-lg">
                <span class="text-3xl animate-bounce">🧠</span>
                <h3 class="text-sm font-black text-slate-900 dark:text-white">Recite from Memory without looking</h3>
                <p class="text-xs text-slate-500">The verified Quranic verses will automatically write themselves below as you speak!</p>
              </div>
            ` : `
              <h2 id="live-words-container" class="text-2xl sm:text-4xl font-arabic font-extrabold text-slate-900 dark:text-slate-50 leading-[2.6] select-none flex flex-wrap justify-center gap-3">
                ${engine.words.map((w, idx) => `
                  <span id="qword-${idx}" class="px-2.5 py-1 rounded-2xl transition-all duration-300 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/50 scale-105 ring-2 ring-amber-400/30' : 'text-slate-800 dark:text-slate-200'}">
                    ${w.raw}
                  </span>
                `).join('')}
              </h2>
            `}
          </div>

          <!-- Live Feedback / Error Prompt Box -->
          <div id="live-feedback-box" class="min-h-12 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            ${L.statusReady}
          </div>

          <!-- Main 1-Click Continuous Audio Trigger -->
          <div class="pt-2 flex justify-center">
            <button 
              id="continuous-voice-btn"
              onclick="window.Views.toggleContinuousRecitation()"
              class="py-3.5 px-8 rounded-2xl bg-teal-700 hover:bg-teal-800 text-amber-300 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-amber-400"
            >
              <span id="mic-pulse-icon" class="text-xl animate-pulse">🎙️</span>
              <span id="continuous-btn-text">${L.btnStart}</span>
            </button>
          </div>

        </div>

        <!-- 2. AUTO-WRITING FULL SURAH VERIFIED STREAM -->
        <div class="p-6 rounded-3xl bg-gradient-to-br from-teal-900/95 to-slate-900 text-white border-2 border-amber-400/60 shadow-xl space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">✍️</span>
              <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">
                Full Surah Auto-Written Verified Stream
              </h3>
            </div>
            <span class="text-[10px] font-mono text-teal-200 font-bold bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-600/40">
              NON-STOP AI HIFZ SAMI'
            </span>
          </div>

          <div id="full-surah-recited-stream" class="min-h-24 p-5 rounded-2xl bg-slate-950/70 border border-teal-700/50 flex flex-wrap items-center gap-3 text-xl sm:text-2xl font-arabic font-extrabold text-emerald-400 leading-loose">
            <span class="text-xs text-slate-400 font-sans italic font-normal">
              As you recite the Surah out loud, your verified verses will auto-write and accumulate here continuously from start to finish...
            </span>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleContinuousRecitation = function() {
  const engine = window.QuranVoiceEngine;
  const btnText = document.getElementById('continuous-btn-text');
  const micIcon = document.getElementById('mic-pulse-icon');
  const feedbackBox = document.getElementById('live-feedback-box');
  const fullStream = document.getElementById('full-surah-recited-stream');
  const ayahCounter = document.getElementById('live-ayah-counter');
  const accuracyBadge = document.getElementById('live-accuracy-badge');
  const activeAyahTag = document.getElementById('active-ayah-tag');
  const wordsContainer = document.getElementById('live-words-container');

  if (engine.isListening) {
    engine.stopListening();
    if (btnText) btnText.textContent = '🎙️ Resume Continuous Recitation';
    if (micIcon) micIcon.classList.remove('animate-ping');
    if (feedbackBox) feedbackBox.innerHTML = '⏹️ Recitation paused. Click to resume anytime.';
    window.App?.showToast('Voice recitation paused', 'info');
    return;
  }

  if (btnText) btnText.textContent = '⏹️ Listening Non-Stop... Pause';
  if (micIcon) micIcon.classList.add('animate-ping');
  if (feedbackBox) feedbackBox.innerHTML = '<span class="text-teal-500 dark:text-teal-400 animate-pulse">🎙️ Listening continuously... Recite your Surah from memory or text!</span>';
  if (fullStream && engine.fullSurahRecitedText.length === 0) fullStream.innerHTML = '';

  const started = engine.startContinuousListening({
    onWordUpdate: (update) => {
      if (!window.Views.isBlindHifzMode && wordsContainer) {
        update.words.forEach((w, idx) => {
          const el = document.getElementById('qword-' + idx);
          if (!el) return;

          el.className = 'px-2.5 py-1 rounded-2xl transition-all duration-300 border ';
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
      }

      if (fullStream) {
        const completedAyahsHtml = update.fullSurahRecitedText.map(a => `<span class="text-emerald-300">${a.text} <span class="text-amber-400 text-sm font-mono font-bold">(${a.ayahNumber})</span></span>`).join(' ');
        const activeWordsHtml = update.recitedStream.map(w => `<span class="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs">${w}</span>`).join(' ');
        fullStream.innerHTML = completedAyahsHtml + (completedAyahsHtml ? ' ' : '') + activeWordsHtml;
      }

      if (accuracyBadge) {
        accuracyBadge.textContent = update.accuracy + '%';
      }

      if (feedbackBox) {
        if (update.isCorrect) {
          feedbackBox.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-black">✓ Correct: "${update.matchedWord}" — Continue reciting!</span>`;
        } else {
          feedbackBox.innerHTML = `<span class="text-rose-600 font-bold">⚠️ Pronunciation Error on "${update.expectedWord}" (Heard: "${update.spokenWord || ''}"). Please repeat this word.</span>`;
        }
      }
    },

    onAyahAdvanced: (advance) => {
      if (ayahCounter) {
        ayahCounter.innerHTML = `Ayah <strong>${advance.newAyahNumber}</strong> of <strong>${advance.totalAyahs}</strong>`;
      }
      if (activeAyahTag) {
        activeAyahTag.textContent = `آية رقم ${advance.newAyahNumber}`;
      }

      if (!window.Views.isBlindHifzMode && wordsContainer) {
        wordsContainer.innerHTML = advance.words.map((w, idx) => `
          <span id="qword-${idx}" class="px-2.5 py-1 rounded-2xl transition-all duration-300 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/50 scale-105 ring-2 ring-amber-400/30' : 'text-slate-800 dark:text-slate-200'}">
            ${w.raw}
          </span>
        `).join('');
      }

      if (feedbackBox) {
        feedbackBox.innerHTML = `<span class="text-emerald-500 font-black text-sm">🎉 Ayah ${advance.completedAyahNum} Complete! Moving to Ayah ${advance.newAyahNumber}... Keep reciting!</span>`;
      }
      window.App?.showToast(`✓ Ayah ${advance.completedAyahNum} Cleared! (+50 XP)`, 'success');
    },

    onSurahComplete: (result) => {
      if (feedbackBox) {
        feedbackBox.innerHTML = `<span class="text-amber-400 font-black text-base">👑 ALLAHU AKBAR! Full Surah successfully completed with ${result.accuracy}% accuracy!</span>`;
      }
      window.App?.showToast(`🏆 MUBARAK! Full Surah Completed (+500 XP)!`, 'success');
    },

    onError: (err) => {
      if (feedbackBox) feedbackBox.innerHTML = `<span class="text-rose-500">${err}</span>`;
    }
  });

  if (!started) {
    window.App?.showToast('Microphone access is required for continuous voice recitation.', 'error');
  }
};
