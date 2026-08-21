/**
 * LearnHub Multimedia & Audio-Visual Engine
 * Manages Quranic Audio Recitations, Qari Voice Streams, Masnoon Duas,
 * Islamic Educational Video Clips, 3D Makharij Visuals, and Waveform Visualizers.
 */

window.MediaEngine = {
  activeAudio: null,
  activeVideo: null,
  currentPlayingId: null,
  playbackSpeed: 1.0,

  // Standard high-speed Quran Reciters CDN Resolvers
  reciters: {
    mishary: {
      name: 'شیخ مشاری بن راشد العفاسی',
      baseUrl: 'https://everyayah.com/data/Alafasy_128kbps/'
    },
    abdulbasit: {
      name: 'شیخ عبد الباسط عبد الصمد (مرتل)',
      baseUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/'
    },
    sudais: {
      name: 'شیخ عبد الرحمن السدیس',
      baseUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/'
    },
    minshawi: {
      name: 'شیخ محمد صدیق المنشاوی',
      baseUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps/'
    },
    ghamdi: {
      name: 'شیخ سعد الغامدی',
      baseUrl: 'https://everyayah.com/data/Ghamadi_40kbps/'
    }
  },

  /**
   * Resolve Aya Audio URL (e.g. Surah 1, Ayah 1 -> 001001.mp3)
   */
  getAyahAudioUrl(surahNumber, ayahNumber, reciterKey = 'mishary') {
    const s = String(surahNumber).padStart(3, '0');
    const a = String(ayahNumber).padStart(3, '0');
    const reciter = this.reciters[reciterKey] || this.reciters.mishary;
    return `${reciter.baseUrl}${s}${a}.mp3`;
  },

  /**
   * Play any Audio stream with callbacks and speed
   */
  playAudio(audioUrl, elementId, onEndCallback) {
    this.stopAllMedia();

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.playbackRate = this.playbackSpeed;
    this.activeAudio = audio;
    this.currentPlayingId = elementId;

    const playerContainer = elementId ? document.getElementById(elementId) : null;
    const playBtn = playerContainer ? playerContainer.querySelector('.media-play-btn') : null;
    const waveElem = playerContainer ? playerContainer.querySelector('.audio-wave-anim') : null;

    if (playBtn) {
      playBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
    if (waveElem) {
      waveElem.classList.remove('opacity-30');
      waveElem.classList.add('animate-pulse');
    }

    audio.play().catch(err => {
      console.warn('[MediaEngine] Audio playback error:', err);
    });

    audio.onended = () => {
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
        if (window.lucide) window.lucide.createIcons();
      }
      if (waveElem) {
        waveElem.classList.add('opacity-30');
        waveElem.classList.remove('animate-pulse');
      }
      this.activeAudio = null;
      this.currentPlayingId = null;
      if (typeof onEndCallback === 'function') onEndCallback();
    };

    audio.onerror = () => {
      console.warn('[MediaEngine] Failed to load audio stream from CDN, applying fallback.');
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
        if (window.lucide) window.lucide.createIcons();
      }
      if (waveElem) {
        waveElem.classList.add('opacity-30');
        waveElem.classList.remove('animate-pulse');
      }
      this.activeAudio = null;
      this.currentPlayingId = null;
    };
  },

  /**
   * Toggle Play / Pause on active Audio
   */
  toggleAudio(audioUrl, elementId) {
    if (this.activeAudio && this.currentPlayingId === elementId) {
      if (this.activeAudio.paused) {
        this.activeAudio.play();
        const playerContainer = document.getElementById(elementId);
        const playBtn = playerContainer ? playerContainer.querySelector('.media-play-btn') : null;
        if (playBtn) {
          playBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
          if (window.lucide) window.lucide.createIcons();
        }
      } else {
        this.activeAudio.pause();
        const playerContainer = document.getElementById(elementId);
        const playBtn = playerContainer ? playerContainer.querySelector('.media-play-btn') : null;
        if (playBtn) {
          playBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
          if (window.lucide) window.lucide.createIcons();
        }
      }
    } else {
      this.playAudio(audioUrl, elementId);
    }
  },

  /**
   * Change playback rate (0.75x, 1x, 1.25x)
   */
  setPlaybackSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.activeAudio) {
      this.activeAudio.playbackRate = speed;
    }
  },

  /**
   * Stop any currently playing audio / video
   */
  stopAllMedia() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }
    this.currentPlayingId = null;
  },

  /**
   * Render Standalone Audio Player Card HTML
   */
  renderAudioPlayerHtml(audioUrl, title = 'صوتی تلاوت و قراءت', containerId = 'game-audio-player') {
    return `
      <div id="${containerId}" class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-700 shadow-md flex items-center justify-between gap-4 my-4 font-urdu select-none" dir="rtl">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.MediaEngine.toggleAudio('${audioUrl}', '${containerId}')" 
            class="media-play-btn w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
            title="چلائیں یا روکیں"
          >
            <i data-lucide="play" class="w-6 h-6"></i>
          </button>
          <div>
            <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="text-emerald-600">🎧</span>
              <span>${title}</span>
            </h4>
            <div class="audio-wave-anim flex items-center gap-1 mt-1 opacity-30 transition-all duration-300">
              <span class="w-1 h-3 bg-emerald-500 rounded-full animate-bounce"></span>
              <span class="w-1 h-5 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
              <span class="w-1 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-1 h-4 bg-cyan-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              <span class="w-1 h-3 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
              <span class="text-[10px] text-slate-500 font-sans mr-2">صوتی پلے بیک</span>
            </div>
          </div>
        </div>

        <!-- Audio Speed Controls -->
        <div class="flex items-center gap-1 font-sans text-xs">
          <button type="button" onclick="window.MediaEngine.setPlaybackSpeed(0.75)" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300 text-[10px] font-bold">0.75x</button>
          <button type="button" onclick="window.MediaEngine.setPlaybackSpeed(1.0)" class="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">1.0x</button>
          <button type="button" onclick="window.MediaEngine.setPlaybackSpeed(1.25)" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300 text-[10px] font-bold">1.25x</button>
        </div>
      </div>
    `;
  },

  /**
   * Render Responsive Educational Video Player HTML
   */
  renderVideoPlayerHtml(videoUrl, posterUrl, title = 'ویڈیو کلپ مشاہدہ فرمائیں', containerId = 'game-video-player') {
    return `
      <div id="${containerId}" class="rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-300 dark:border-slate-700 shadow-xl my-4 text-right select-none font-urdu" dir="rtl">
        <div class="p-2.5 bg-slate-900 text-white flex items-center justify-between text-xs px-4">
          <span class="font-black flex items-center gap-1.5 text-emerald-400">
            <i data-lucide="video" class="w-4 h-4"></i>
            <span>${title}</span>
          </span>
          <span class="text-[10px] text-slate-400">غور سے مشاہدہ کریں</span>
        </div>
        <div class="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
          <video 
            src="${videoUrl}" 
            poster="${posterUrl || ''}"
            controls 
            playsinline 
            class="w-full h-full object-contain"
          >
            آپ کا براؤزر ویڈیو پلے بیک سپورٹ نہیں کرتا۔
          </video>
        </div>
      </div>
    `;
  }
};
