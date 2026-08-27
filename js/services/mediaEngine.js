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
  },

  /**
   * =========================================================================
   * ROYAL ISLAMIC SOCIAL STATUS & CARD GENERATOR (WhatsApp / Instagram)
   * High-Resolution Canvas Exporter for Ayahs, Hadiths & Duas
   * =========================================================================
   */
  openStatusCardGenerator(data = {}) {
    const arabic = data.arabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    const translation = data.translation || 'اللہ کے نام سے شروع جو نہایت مہربان، ہمیشہ رحم فرمانے والا ہے۔';
    const ref = data.reference || 'قرآن مجید';
    const title = data.title || 'آیتِ مبارکہ';

    const modalId = 'islamic-status-card-modal';
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modalHtml = `
      <div id="${modalId}" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-urdu" dir="rtl">
        <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-amber-400/50 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">✨</span>
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white">شاہی اسلامک اسٹیٹس کارڈ جنریٹر</h3>
                <p class="text-[11px] text-slate-500">واٹس ایپ، انسٹاگرام اور فیس بک پر خوبصورت کارڈ شیئر کریں</p>
              </div>
            </div>
            <button onclick="document.getElementById('${modalId}').remove()" class="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Theme Selector -->
          <div class="flex items-center justify-center gap-2 text-xs font-bold">
            <button onclick="window.MediaEngine._updateCanvasTheme('emerald')" class="py-1 px-3 rounded-xl bg-emerald-900 text-emerald-200 border border-emerald-500/50">زمردی سبز</button>
            <button onclick="window.MediaEngine._updateCanvasTheme('midnight')" class="py-1 px-3 rounded-xl bg-slate-950 text-amber-200 border border-amber-500/50">شاہی نائٹ</button>
            <button onclick="window.MediaEngine._updateCanvasTheme('gold')" class="py-1 px-3 rounded-xl bg-amber-950 text-amber-100 border border-amber-400/50">گولڈن رائل</button>
          </div>

          <!-- Canvas Preview -->
          <div class="flex items-center justify-center bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner">
            <canvas id="status-card-canvas" width="800" height="800" class="max-w-full h-auto rounded-xl shadow-lg"></canvas>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button onclick="window.MediaEngine.downloadStatusCard()" class="btn-primary flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>ڈاؤن لوڈ ایچ ڈی کارڈ (PNG)</span>
            </button>
            <button onclick="window.MediaEngine.shareStatusCard()" class="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="share-2" class="w-4 h-4"></i>
              <span>شیئر کریں</span>
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    this._currentCardData = { arabic, translation, ref, title, theme: 'emerald' };
    this._renderCardToCanvas();
  },

  _updateCanvasTheme(theme) {
    if (this._currentCardData) {
      this._currentCardData.theme = theme;
      this._renderCardToCanvas();
    }
  },

  _renderCardToCanvas() {
    const canvas = document.getElementById('status-card-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const d = this._currentCardData || {};

    const w = canvas.width;
    const h = canvas.height;

    // 1. Background Gradient
    let bgGrad;
    if (d.theme === 'midnight') {
      bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 500);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
    } else if (d.theme === 'gold') {
      bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 500);
      bgGrad.addColorStop(0, '#451a03');
      bgGrad.addColorStop(1, '#1c0a00');
    } else {
      bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 500);
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Ornate Double Gold Borders
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // 3. Corner Ornaments
    ctx.fillStyle = '#fbbf24';
    ctx.font = '24px serif';
    ctx.fillText('✦', 48, 68);
    ctx.fillText('✦', w - 68, 68);
    ctx.fillText('✦', 48, h - 50);
    ctx.fillText('✦', w - 68, h - 50);

    // 4. Header Badge / LearnHub Logo
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px "Noto Nastaliq Urdu", serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('لرن ہب اسلامک اکیڈمی • ' + (d.title || 'فرمانِ الٰہی'), w/2, 85);

    // 5. Arabic Ayah / Hadith Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Amiri", "Traditional Arabic", serif';
    this._wrapText(ctx, d.arabic, w/2, 220, w - 140, 52);

    // 6. Gold Divider Line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w/2 - 120, h/2 + 70);
    ctx.lineTo(w/2 + 120, h/2 + 70);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px serif';
    ctx.fillText('۞', w/2, h/2 + 75);

    // 7. Urdu Translation
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 20px "Noto Nastaliq Urdu", serif';
    this._wrapText(ctx, d.translation, w/2, h/2 + 125, w - 150, 40);

    // 8. Reference Badge
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.fillRect(w/2 - 150, h - 110, 300, 36);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(w/2 - 150, h - 110, 300, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Noto Nastaliq Urdu", sans-serif';
    ctx.fillText(d.ref, w/2, h - 86);

    // 9. Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px sans-serif';
    ctx.fillText('learnhubplatform.com', w/2, h - 45);
  },

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  },

  downloadStatusCard() {
    const canvas = document.getElementById('status-card-canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `LearnHub_Islamic_Card_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    window.App?.showToast('🎉 خوبصورت کارڈ کامیابی سے ڈاؤن لوڈ ہو گیا!', 'success');
  },

  async shareStatusCard() {
    const canvas = document.getElementById('status-card-canvas');
    if (!canvas) return;

    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'LearnHub_Card.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: 'LearnHub Islamic Card',
            text: 'لرن ہب اسلامک اکیڈمی سے شیئر شدہ خوبصورت آیت و حدیث',
            files: [file]
          });
        } catch (e) {
          this.downloadStatusCard();
        }
      });
    } else {
      this.downloadStatusCard();
    }
  }
};
