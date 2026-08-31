/**
 * LearnHub Professional Quran Voice Recitation & Strict Word-by-Word Practice Studio (v182.0.0)
 * 
 * Features:
 * 1. 114 Surahs Directory with Single Ayah, Range, and Complete Surah Practice Modes.
 * 2. Strict Word-by-Word Alignment: Cursor NEVER advances past an incorrect word.
 * 3. Live Mistakes, Retries, and Real Mathematical Accuracy Counters.
 * 4. Ayah Audio Reference Player (0.75x Slow Tajweed & 1.0x Normal).
 * 5. Immediate Educational Feedback: Red indicator on incorrect words with retry prompt.
 * 6. Comprehensive Final Recitation Result with Detailed Mistake Review Breakdown.
 * 7. Trilingual (English, Urdu, Arabic) with pure UI language separation.
 */

window.Views = window.Views || {};
window.Views.selectedTajweedSurahNumber = 1;
window.Views.tajweedPracticeMode = 'single_ayah'; // 'single_ayah' | 'range' | 'full_surah'
window.Views.tajweedStartAyah = 1;
window.Views.tajweedEndAyah = 1;
window.Views.tajweedAudioSpeed = 1.0;
window.Views.currentAyahAudio = null;

window.Views.renderVoiceTajweed = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) || [];
  const curSurahMeta = surahs.find(s => s.number === window.Views.selectedTajweedSurahNumber) || surahs[0] || { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', ayahCount: 7 };

  let verses = [];
  if (window.QuranService && typeof window.QuranService.getSurahVerses === 'function') {
    verses = await window.QuranService.getSurahVerses(curSurahMeta.number);
  }

  if (!verses || verses.length === 0) {
    verses = [
      { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'اللہ کے نام سے جو رحمن و رحیم ہے', english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urdu: 'تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا رب ہے', english: '[All] praise is [due] to Allah, Lord of the worlds.' },
      { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'نہایت مہربان، بہت رحم فرمانے والا', english: 'The Entirely Merciful, the Especially Merciful,' },
      { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', urdu: 'روزِ جزا کا مالک', english: 'Sovereign of the Day of Recompense.' },
      { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urdu: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں', english: 'It is You we worship and You we ask for help.' },
      { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urdu: 'ہمیں سیدھے راستے کی ہدایت فرما', english: 'Guide us to the straight path -' },
      { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urdu: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا', english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' }
    ];
  }

  // Bound range values
  if (window.Views.tajweedStartAyah > verses.length) window.Views.tajweedStartAyah = 1;
  if (window.Views.tajweedEndAyah > verses.length) window.Views.tajweedEndAyah = verses.length;
  if (window.Views.tajweedStartAyah < 1) window.Views.tajweedStartAyah = 1;

  // Load scope into QuranVoiceEngine
  window.QuranVoiceEngine.loadScope(
    curSurahMeta.number,
    verses,
    window.Views.tajweedPracticeMode,
    window.Views.tajweedStartAyah,
    window.Views.tajweedEndAyah
  );

  const engine = window.QuranVoiceEngine;

  const L = {
    title: isRtl ? (lang === 'ur' ? 'قرآن وائس ریٹیشن و تجوید پریکٹس اسٹوڈیو' : 'استوديو التلاوة الصوتية وتدريب التجويد') : 'Quran Voice Recitation & Word-by-Word Practice Studio',
    sub: isRtl ? (lang === 'ur' ? 'لفظ بہ لفظ صوتی تصدیق: جب تک درست ادائیگی نہ ہو اگلا لفظ فعال نہیں ہوگا۔' : 'التحقق الصوتي كلمة بكلمة مع التنبيه الفوري عند الخطأ.') : 'Strict word-by-word recitation practice. The system will NOT advance past an incorrect word until accurately recited.',
    selectSurah: isRtl ? 'سورت منتخب کریں:' : 'Select Surah:',
    modeSingle: isRtl ? '🎯 واحد آیت' : '🎯 Single Ayah',
    modeRange: isRtl ? '📏 آیات کی حد' : '📏 Ayah Range',
    modeFull: isRtl ? '📖 مکمل سورت' : '📖 Complete Surah',
    fromAyah: isRtl ? 'آیت سے:' : 'From Ayah:',
    toAyah: isRtl ? 'آیت تک:' : 'To Ayah:',
    btnStart: isRtl ? '🎙️ تلاوت شروع کریں (Start Recitation)' : '🎙️ Start Recitation',
    btnPause: isRtl ? '⏸️ تلاوت روکیں (Pause)' : '⏸️ Pause Recitation',
    btnPlayAudio: isRtl ? '🔊 قاری کی تلاوت سنیں' : '🔊 Listen to Qari',
    btnSlowAudio: isRtl ? '🐢 سست رفتار تجوید (0.75x)' : '🐢 Slow Tajweed (0.75x)',
    btnNormalAudio: isRtl ? '⚡ عام رفتار (1.0x)' : '⚡ Normal (1.0x)',
    statusReady: isRtl ? 'مائیکروفون کا بٹن دبائیں اور واضح آواز میں تلاوت فرمائیں۔' : 'Press "Start Recitation" and recite clearly into your microphone.',
    kpiMistakes: isRtl ? 'غلطیاں (Mistakes):' : 'Mistakes:',
    kpiRetries: isRtl ? 'کوششیں (Retries):' : 'Retries:',
    kpiAccuracy: isRtl ? 'درستگی (Accuracy):' : 'Accuracy:',
    kpiWords: isRtl ? 'الفاظ کی پیش رفت:' : 'Words Progress:',
    btnSkip: isRtl ? 'اگلا لفظ (Skip)' : 'Skip Word',
    btnRestartAyah: isRtl ? '🔄 آیت دوبارہ شروع کریں' : '🔄 Reset Ayah'
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
            
            <a href="#/quran/${curSurahMeta.number}" class="py-1.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition flex items-center gap-1">
              <span>📖 Quran Hub</span>
            </a>
          </div>
        </div>

        <!-- Scope & Surah Configuration Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-3">
          <div class="max-w-4xl mx-auto px-3 space-y-2.5 text-xs">
            
            <!-- Row 1: Surah Dropdown & Mode Selector -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-teal-200 font-bold shrink-0">${L.selectSurah}</span>
                <select 
                  id="voice-surah-select"
                  onchange="window.Views.selectedTajweedSurahNumber = parseInt(this.value, 10); window.Views.tajweedStartAyah = 1; window.Views.tajweedEndAyah = 1; window.Views.renderVoiceTajweed();"
                  class="py-1.5 px-3 rounded-xl bg-teal-950 text-amber-300 font-bold border border-teal-600 focus:outline-none cursor-pointer"
                >
                  ${surahs.map(s => `
                    <option value="${s.number}" ${s.number === curSurahMeta.number ? 'selected' : ''}>
                      ${s.number}. ${s.nameArabic} (${s.nameEnglish}) - ${s.ayahCount || s.totalAyahs || 7} Ayahs
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Scope Modes: Single, Range, Full -->
              <div class="flex items-center gap-1 bg-teal-950 p-1 rounded-xl border border-teal-700/60 font-bold text-xs">
                <button 
                  onclick="window.Views.tajweedPracticeMode = 'single_ayah'; window.Views.renderVoiceTajweed();"
                  class="py-1 px-2.5 rounded-lg transition ${window.Views.tajweedPracticeMode === 'single_ayah' ? 'bg-amber-400 text-teal-950 font-black' : 'text-teal-200 hover:text-white'}"
                >
                  ${L.modeSingle}
                </button>
                <button 
                  onclick="window.Views.tajweedPracticeMode = 'range'; window.Views.renderVoiceTajweed();"
                  class="py-1 px-2.5 rounded-lg transition ${window.Views.tajweedPracticeMode === 'range' ? 'bg-amber-400 text-teal-950 font-black' : 'text-teal-200 hover:text-white'}"
                >
                  ${L.modeRange}
                </button>
                <button 
                  onclick="window.Views.tajweedPracticeMode = 'full_surah'; window.Views.renderVoiceTajweed();"
                  class="py-1 px-2.5 rounded-lg transition ${window.Views.tajweedPracticeMode === 'full_surah' ? 'bg-amber-400 text-teal-950 font-black' : 'text-teal-200 hover:text-white'}"
                >
                  ${L.modeFull}
                </button>
              </div>
            </div>

            <!-- Row 2: Ayah Numbers selector (if Single or Range) -->
            ${window.Views.tajweedPracticeMode === 'single_ayah' ? `
              <div class="flex items-center gap-2 pt-1">
                <span class="text-teal-200 font-bold">${isRtl ? 'آیت نمبر منتخب کریں:' : 'Select Ayah:'}</span>
                <select 
                  onchange="window.Views.tajweedStartAyah = parseInt(this.value, 10); window.Views.tajweedEndAyah = parseInt(this.value, 10); window.Views.renderVoiceTajweed();"
                  class="py-1 px-3 rounded-lg bg-teal-950 text-white font-bold border border-teal-700"
                >
                  ${verses.map(v => `
                    <option value="${v.numberInSurah}" ${v.numberInSurah === window.Views.tajweedStartAyah ? 'selected' : ''}>
                      Ayah ${v.numberInSurah}
                    </option>
                  `).join('')}
                </select>
              </div>
            ` : ''}

            ${window.Views.tajweedPracticeMode === 'range' ? `
              <div class="flex items-center gap-3 pt-1">
                <div class="flex items-center gap-1.5">
                  <span class="text-teal-200 font-bold">${L.fromAyah}</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="${verses.length}" 
                    value="${window.Views.tajweedStartAyah}" 
                    onchange="window.Views.tajweedStartAyah = parseInt(this.value, 10); window.Views.renderVoiceTajweed();" 
                    class="w-16 p-1 rounded-lg bg-teal-950 text-white font-mono text-center font-bold border border-teal-700" 
                  />
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-teal-200 font-bold">${L.toAyah}</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="${verses.length}" 
                    value="${window.Views.tajweedEndAyah}" 
                    onchange="window.Views.tajweedEndAyah = parseInt(this.value, 10); window.Views.renderVoiceTajweed();" 
                    class="w-16 p-1 rounded-lg bg-teal-950 text-white font-mono text-center font-bold border border-teal-700" 
                  />
                </div>
              </div>
            ` : ''}

          </div>
        </div>
      </div>

      <!-- Main Live Recitation Workspace -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <!-- Live Metrics & Counter Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
          
          <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span class="block text-[10px] text-slate-500 font-bold uppercase">${L.kpiWords}</span>
            <span id="live-words-counter" class="text-base sm:text-lg font-black font-mono text-teal-700 dark:text-teal-400">
              0 / ${engine.totalSessionWords}
            </span>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 shadow-xs">
            <span class="block text-[10px] text-rose-500 font-bold uppercase">${L.kpiMistakes}</span>
            <span id="live-mistakes-counter" class="text-base sm:text-lg font-black font-mono text-rose-600">
              0
            </span>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950/60 shadow-xs">
            <span class="block text-[10px] text-amber-500 font-bold uppercase">${L.kpiRetries}</span>
            <span id="live-retries-counter" class="text-base sm:text-lg font-black font-mono text-amber-600 dark:text-amber-400">
              0
            </span>
          </div>

          <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-950/60 shadow-xs">
            <span class="block text-[10px] text-emerald-600 font-bold uppercase">${L.kpiAccuracy}</span>
            <span id="live-accuracy-badge" class="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              100%
            </span>
          </div>

        </div>

        <!-- Reference Qari Audio Strip (Listen before reciting) -->
        <div class="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔊</span>
            <div>
              <span class="font-bold text-teal-900 dark:text-teal-200">
                ${isRtl ? 'آیت سنیں اور تجوید کا مشاہدہ فرمائیں:' : 'Listen to Reference Ayah Audio:'}
              </span>
              <span id="active-qari-ayah-label" class="text-[11px] text-teal-700 dark:text-teal-400 font-mono font-bold">
                (Ayah ${engine.currentAyah ? engine.currentAyah.number : 1})
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              id="qari-audio-btn"
              onclick="window.Views.toggleQariReferenceAudio()"
              class="py-1.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>▶️ ${L.btnPlayAudio}</span>
            </button>
            <button 
              onclick="window.Views.toggleTajweedAudioSpeed()"
              id="speed-toggle-btn"
              class="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-600/40 text-teal-800 dark:text-teal-300 font-bold font-mono transition"
            >
              1.0x
            </button>
          </div>
        </div>

        <!-- 1. LIVE ACTIVE AYAH CANVAS -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-600/40 shadow-xl space-y-5 text-center relative overflow-hidden">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span id="mic-status-indicator" class="w-3 h-3 rounded-full bg-slate-400"></span>
              <span id="mic-status-label" class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                🎙️ Ready to Recite
              </span>
            </div>
            
            <span id="active-ayah-tag" class="font-arabic font-bold text-teal-700 dark:text-teal-300 text-sm sm:text-base">
              ${curSurahMeta.nameArabic} • آية ${engine.currentAyah ? engine.currentAyah.number : 1}
            </span>
          </div>

          <!-- Words Container with Active Highlighting -->
          <div class="py-6 min-h-32 flex items-center justify-center">
            <h2 id="live-words-container" class="text-2xl sm:text-4xl font-arabic font-extrabold text-slate-900 dark:text-slate-50 leading-[2.8] select-none flex flex-wrap justify-center gap-3">
              ${engine.words.map((w, idx) => `
                <span id="qword-${idx}" class="quran-word-pill px-3 py-1.5 rounded-2xl transition-all duration-200 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/60 scale-105 ring-2 ring-amber-400/30 font-black' : 'text-slate-800 dark:text-slate-200'}">
                  ${w.raw}
                </span>
              `).join('')}
            </h2>
          </div>

          <!-- Translation Snippet for Context -->
          <div id="live-ayah-translation" class="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto italic font-sans">
            ${isRtl ? (engine.currentAyah?.urdu || '') : (engine.currentAyah?.english || '')}
          </div>

          <!-- Contextual Educational Feedback Box -->
          <div id="live-feedback-box" class="min-h-12 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 transition-all">
            ${L.statusReady}
          </div>

          <!-- Main Interactive Controls -->
          <div class="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button 
              id="continuous-voice-btn"
              onclick="window.Views.toggleQuranVoiceRecitation()"
              class="py-3.5 px-8 rounded-2xl bg-teal-700 hover:bg-teal-800 text-amber-300 font-black text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-amber-400 cursor-pointer"
            >
              <span id="mic-pulse-icon" class="text-xl">🎙️</span>
              <span id="continuous-btn-text">${L.btnStart}</span>
            </button>

            <button 
              onclick="window.Views.skipCurrentTajweedWord()"
              class="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <span>⏭️ ${L.btnSkip}</span>
            </button>

            <button 
              onclick="window.Views.resetCurrentAyahRecitation()"
              class="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <span>${L.btnRestartAyah}</span>
            </button>
          </div>

        </div>

        <!-- 2. VERIFIED ACCUMULATING RECITED STREAM -->
        <div class="p-6 rounded-3xl bg-slate-900 text-white border border-teal-700/50 shadow-xl space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">✍️</span>
              <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">
                ${isRtl ? 'مستند مکمل تلاوت شدہ ریکارڈ' : 'Verified Recited Stream'}
              </h3>
            </div>
            <span class="text-[10px] font-mono text-teal-200 font-bold bg-teal-950 px-2.5 py-1 rounded-lg border border-teal-600/40">
              STRICT WORD-BY-WORD VALIDATION
            </span>
          </div>

          <div id="full-surah-recited-stream" class="min-h-20 p-4 rounded-2xl bg-slate-950/70 border border-teal-800/40 flex flex-wrap items-center gap-3 text-lg sm:text-2xl font-arabic font-extrabold text-emerald-400 leading-loose">
            <span class="text-xs text-slate-400 font-sans italic font-normal">
              ${isRtl ? 'جیسے جیسے آپ درست تلاوت فرماتے جائیں گے، تصدیق شدہ آیات یہاں مرتب ہوتی جائیں گی...' : 'As you recite correctly, verified Quranic verses will accumulate here...'}
            </span>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleQuranVoiceRecitation = function() {
  const engine = window.QuranVoiceEngine;
  const btnText = document.getElementById('continuous-btn-text');
  const micIcon = document.getElementById('mic-pulse-icon');
  const micIndicator = document.getElementById('mic-status-indicator');
  const micStatusLabel = document.getElementById('mic-status-label');
  const feedbackBox = document.getElementById('live-feedback-box');
  const wordsContainer = document.getElementById('live-words-container');
  const fullStream = document.getElementById('full-surah-recited-stream');
  const mistakesCounter = document.getElementById('live-mistakes-counter');
  const retriesCounter = document.getElementById('live-retries-counter');
  const accuracyBadge = document.getElementById('live-accuracy-badge');
  const wordsCounter = document.getElementById('live-words-counter');
  const ayahTag = document.getElementById('active-ayah-tag');
  const translationBox = document.getElementById('live-ayah-translation');

  if (engine.isListening) {
    engine.stopListening();
    if (btnText) btnText.textContent = '🎙️ Resume Recitation';
    if (micIcon) micIcon.classList.remove('animate-ping');
    if (micIndicator) micIndicator.className = 'w-3 h-3 rounded-full bg-amber-400';
    if (micStatusLabel) micStatusLabel.textContent = '⏸️ Recitation Paused';
    if (feedbackBox) feedbackBox.innerHTML = '⏹️ Recitation paused. Click Resume anytime.';
    return;
  }

  if (btnText) btnText.textContent = '⏹️ Pause Recitation';
  if (micIcon) micIcon.classList.add('animate-ping');
  if (micIndicator) micIndicator.className = 'w-3 h-3 rounded-full bg-rose-500 animate-pulse';
  if (micStatusLabel) micStatusLabel.textContent = '🔴 Listening (Recite now)';
  if (feedbackBox) feedbackBox.innerHTML = '<span class="text-teal-600 dark:text-teal-400 font-bold animate-pulse">🎙️ Listening... Recite the highlighted word clearly!</span>';
  if (fullStream && engine.fullSessionRecitedVerses.length === 0) fullStream.innerHTML = '';

  const started = engine.startListening({
    onWordStatusChange: (update) => {
      // 1. Update Word Pill Highlighting
      if (wordsContainer) {
        update.words.forEach((w, idx) => {
          const el = document.getElementById('qword-' + idx);
          if (!el) return;

          el.className = 'quran-word-pill px-3 py-1.5 rounded-2xl transition-all duration-200 border ';
          if (w.state === 'correct') {
            el.className += 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 font-black scale-105';
          } else if (w.state === 'incorrect') {
            el.className += 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500 font-black animate-shake scale-105';
          } else if (w.state === 'active') {
            el.className += 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/60 font-black scale-105 ring-2 ring-amber-400/30';
          } else {
            el.className += 'text-slate-800 dark:text-slate-200 border-transparent';
          }
        });

        // Auto-Scroll to active word
        const activeWordEl = document.getElementById('qword-' + update.currentWordIndex);
        if (activeWordEl && typeof activeWordEl.scrollIntoView === 'function') {
          activeWordEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      // 2. Update KPI Counters
      if (mistakesCounter) mistakesCounter.textContent = update.mistakesCount;
      if (retriesCounter) retriesCounter.textContent = update.retriesCount;
      if (accuracyBadge) accuracyBadge.textContent = update.accuracy + '%';
      if (wordsCounter) wordsCounter.textContent = `${engine.completedWordsCount} / ${engine.totalSessionWords}`;

      // 3. Update Stream
      if (fullStream) {
        const completedAyahsHtml = engine.fullSessionRecitedVerses.map(a => `<span class="text-emerald-300">${a.text} <span class="text-amber-400 text-sm font-mono font-bold">(${a.ayahNumber})</span></span>`).join(' ');
        const activeWordsHtml = engine.recitedStream.map(w => `<span class="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs">${w}</span>`).join(' ');
        fullStream.innerHTML = completedAyahsHtml + (completedAyahsHtml ? ' ' : '') + activeWordsHtml;
      }

      // 4. Update Educational Feedback
      if (feedbackBox) {
        if (update.isCorrect) {
          feedbackBox.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-black">✓ Correct: "${update.matchedWord}" — Keep reciting!</span>`;
        } else if (update.isSkipped) {
          feedbackBox.innerHTML = `<span class="text-amber-600 font-bold">Word Skipped. Moving to: "${update.nextExpectedWord}"</span>`;
        } else {
          feedbackBox.innerHTML = `
            <div class="space-y-0.5">
              <span class="text-rose-600 dark:text-rose-400 font-black">❌ Incorrect on "${update.expectedWord}" (Heard: "${update.spokenWord || ''}")</span>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Please repeat this word. Cursor will remain on "${update.expectedWord}".</div>
            </div>
          `;
        }
      }
    },

    onAyahAdvanced: (advance) => {
      if (ayahTag) {
        ayahTag.textContent = `${engine.surahMeta.nameArabic} • آية ${advance.newAyahNumber}`;
      }

      if (translationBox) {
        const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'en';
        translationBox.textContent = (lang === 'ur' || lang === 'ar') ? (engine.currentAyah?.urdu || '') : (engine.currentAyah?.english || '');
      }

      if (wordsContainer) {
        wordsContainer.innerHTML = advance.words.map((w, idx) => `
          <span id="qword-${idx}" class="quran-word-pill px-3 py-1.5 rounded-2xl transition-all duration-200 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/60 scale-105 ring-2 ring-amber-400/30 font-black' : 'text-slate-800 dark:text-slate-200'}">
            ${w.raw}
          </span>
        `).join('');
      }

      const qariLabel = document.getElementById('active-qari-ayah-label');
      if (qariLabel) qariLabel.textContent = `(Ayah ${advance.newAyahNumber})`;

      if (feedbackBox) {
        feedbackBox.innerHTML = `<span class="text-emerald-500 font-black text-sm">🎉 Ayah ${advance.completedAyahNumber} Completed! Moving to Ayah ${advance.newAyahNumber}...</span>`;
      }
      window.App?.showToast(`✓ Ayah ${advance.completedAyahNumber} Cleared!`, 'success');
    },

    onSessionComplete: (result) => {
      window.Views.showRecitationResultModal(result);
    },

    onError: (err, code) => {
      if (feedbackBox) feedbackBox.innerHTML = `<span class="text-rose-500 font-bold">${err}</span>`;
      window.App?.showToast(err, 'error');
    }
  });

  if (!started) {
    window.App?.showToast('Microphone access is required for voice recitation.', 'error');
  }
};

window.Views.skipCurrentTajweedWord = function() {
  window.QuranVoiceEngine.skipCurrentWord();
};

window.Views.resetCurrentAyahRecitation = function() {
  window.QuranVoiceEngine._loadCurrentAyahInternal();
  const wordsContainer = document.getElementById('live-words-container');
  if (wordsContainer) {
    wordsContainer.innerHTML = window.QuranVoiceEngine.words.map((w, idx) => `
      <span id="qword-${idx}" class="quran-word-pill px-3 py-1.5 rounded-2xl transition-all duration-200 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/60 scale-105 ring-2 ring-amber-400/30 font-black' : 'text-slate-800 dark:text-slate-200'}">
        ${w.raw}
      </span>
    `).join('');
  }
  window.App?.showToast('Ayah reset for fresh practice', 'info');
};

/**
 * Qari Reference Audio Player
 */
window.Views.toggleQariReferenceAudio = function() {
  const engine = window.QuranVoiceEngine;
  const currentAyah = engine.currentAyah;
  if (!currentAyah) return;

  const btn = document.getElementById('qari-audio-btn');

  if (window.Views.currentAyahAudio && !window.Views.currentAyahAudio.paused) {
    window.Views.currentAyahAudio.pause();
    if (btn) btn.innerHTML = '<span>▶️ Listen to Qari</span>';
    return;
  }

  // Generate Global Ayah Index or Fetch from Audio CDN
  const surahNum = String(engine.surahNumber).padStart(3, '0');
  const ayahNum = String(currentAyah.number).padStart(3, '0');
  const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahNum}${ayahNum}.mp3`;

  if (window.Views.currentAyahAudio) {
    window.Views.currentAyahAudio.pause();
  }

  const audio = new Audio(audioUrl);
  audio.playbackRate = window.Views.tajweedAudioSpeed || 1.0;
  window.Views.currentAyahAudio = audio;

  if (btn) btn.innerHTML = '<span>⏸️ Pause Audio</span>';

  audio.onended = function() {
    if (btn) btn.innerHTML = '<span>▶️ Listen to Qari</span>';
  };

  audio.onerror = function() {
    window.App?.showToast('Could not load online audio for this verse', 'warning');
    if (btn) btn.innerHTML = '<span>▶️ Listen to Qari</span>';
  };

  audio.play().catch(e => {
    console.warn('Audio play exception:', e);
    if (btn) btn.innerHTML = '<span>▶️ Listen to Qari</span>';
  });
};

window.Views.toggleTajweedAudioSpeed = function() {
  const btn = document.getElementById('speed-toggle-btn');
  if (window.Views.tajweedAudioSpeed === 1.0) {
    window.Views.tajweedAudioSpeed = 0.75;
    if (btn) btn.textContent = '0.75x (Slow)';
    window.App?.showToast('Audio playback speed set to 0.75x (Slow Tajweed)', 'info');
  } else {
    window.Views.tajweedAudioSpeed = 1.0;
    if (btn) btn.textContent = '1.0x (Normal)';
    window.App?.showToast('Audio playback speed set to 1.0x (Normal)', 'info');
  }

  if (window.Views.currentAyahAudio) {
    window.Views.currentAyahAudio.playbackRate = window.Views.tajweedAudioSpeed;
  }
};

/**
 * Detailed Recitation Result & Mistake Review Modal
 */
window.Views.showRecitationResultModal = function(result) {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const modalHtml = `
    <div id="recitation-result-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 my-8">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-lg border border-emerald-500/40">
            👑
          </div>
          <h3 class="text-xl sm:text-2xl font-black font-arabic text-slate-900 dark:text-white">
            ${isRtl ? 'تلاوت مکمل! الحمد للہ' : 'Recitation Completed!'}
          </h3>
          <p class="text-xs text-slate-500">
            ${result.surahMeta.nameArabic} (${result.surahMeta.nameEnglish}) • ${result.totalAyahs} Ayahs
          </p>
        </div>

        <!-- 4 KPI Summary Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="block text-[10px] text-slate-500 font-sans font-bold">ACCURACY</span>
            <span class="text-lg font-black text-emerald-600">${result.accuracy}%</span>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="block text-[10px] text-slate-500 font-sans font-bold">WORDS</span>
            <span class="text-lg font-black text-teal-600">${result.completedWords} / ${result.totalWords}</span>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="block text-[10px] text-slate-500 font-sans font-bold">MISTAKES</span>
            <span class="text-lg font-black text-rose-600">${result.totalMistakes}</span>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="block text-[10px] text-slate-500 font-sans font-bold">RETRIES</span>
            <span class="text-lg font-black text-amber-600">${result.totalRetries}</span>
          </div>
        </div>

        <!-- Detailed Mistake Review Breakdown -->
        <div class="space-y-2">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            ${isRtl ? '📝 غلطیوں کا تفصیلی جائزہ (Mistakes Review):' : '📝 Mistakes Review Breakdown:'}
          </h4>

          <div class="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-2 text-xs">
            ${result.mistakeLog.length === 0 ? `
              <div class="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                🎉 ماشاء اللہ! آپ نے بغیر کسی غلطی کے مکمل تلاوت فرمائی۔ (Flawless recitation with 0 mistakes!)
              </div>
            ` : result.mistakeLog.map((m, idx) => `
              <div class="p-2.5 flex items-center justify-between gap-2">
                <div>
                  <div class="font-arabic font-extrabold text-base text-slate-900 dark:text-white">
                    ${m.expectedWord}
                  </div>
                  <div class="text-[10px] text-slate-500">
                    Ayah ${m.ayahNumber} • Heard: <span class="font-bold text-rose-500">${m.lastSpokenWord || 'Unknown'}</span>
                  </div>
                </div>
                <div class="text-right font-mono text-[11px]">
                  <span class="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                    ${m.attempts} Attempts
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-bold text-xs">
          <button 
            onclick="document.getElementById('recitation-result-modal')?.remove(); window.Views.renderVoiceTajweed();" 
            class="py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black transition cursor-pointer shadow-md active:scale-95"
          >
            🔄 ${isRtl ? 'دوبارہ مشق کریں' : 'Practice Again'}
          </button>
          <button 
            onclick="document.getElementById('recitation-result-modal')?.remove(); window.location.hash = '#/quran/' + ${result.surahNumber};" 
            class="btn-secondary py-3 px-4 rounded-xl text-center transition cursor-pointer"
          >
            📖 ${isRtl ? 'قرآن ہب میں دیکھیں' : 'View in Quran Hub'}
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('recitation-result-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};
