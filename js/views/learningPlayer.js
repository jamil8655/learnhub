/**
 * LearnHub Interactive Learning Player (LMS Pro)
 * Distraction-free multi-format curriculum player with:
 * - Timestamped Video Notes Engine
 * - Lesson Q&A & Community Discussion Board
 * - Downloadable Lesson Attachments & PDF Hub
 * - Automated 100% Sequential Certificate Issuance & Confetti Celebration
 * - Video Playback Speeds, Auto-Advance & Theater Mode
 */

window.Views = window.Views || {};

window.Views.renderLearningPlayer = async function(params) {
  const container = document.getElementById('main-content');
  const courseId = params.courseId;
  const lessonId = params.lessonId;
  const currentUser = window.Auth.getCurrentUser();

  if (!currentUser) {
    window.App.showToast('براہ کرم کورس پلیئر تک رسائی کے لیے لاگ اِن کریں۔ (Please login)', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const course = await window.API.getCourseById(courseId);
  if (!course || !course.lessons || course.lessons.length === 0) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl font-bold">
          <i data-lucide="book-x" class="w-8 h-8"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">کوئی اسباق دستیاب نہیں ہیں (No Lessons Available)</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">اس کورس میں فی الحال تدریسی مواد اپلوڈ نہیں کیا گیا ہے۔</p>
        <a href="#/courses" class="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
          <span>کورسز کی فہرست پر واپس جائیں</span>
        </a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Ensure user is enrolled
  let enrollments = await window.API.getEnrollments(currentUser.id);
  let enrollment = enrollments.find(e => e.courseId === courseId);

  if (!enrollment) {
    if (course.isFree) {
      enrollment = await window.API.enrollInCourse(courseId, currentUser.id);
    } else {
      window.App.showToast('اس کورس کے اسباق دیکھنے کے لیے داخلہ (Enrollment) ضروری ہے۔', 'warning');
      window.Router.navigate(`/courses/${courseId}`);
      return;
    }
  }

  // Determine active lesson
  let activeLesson = course.lessons.find(l => l.id === lessonId);
  if (!activeLesson) {
    activeLesson = course.lessons.find(l => l.id === enrollment.lastViewedLessonId) || course.lessons[0];
  }

  const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  const isCompleted = (enrollment.completedLessons || []).includes(activeLesson.id);
  const progressPercent = enrollment.progressPercentage || 0;

  // Auto record last viewed lesson
  window.API.updateLessonProgress(courseId, activeLesson.id, currentUser.id, undefined);

  // Helper to format video embed URLs
  let videoEmbedUrl = activeLesson.videoUrl || '';
  if (videoEmbedUrl.includes('youtube.com/watch?v=')) {
    videoEmbedUrl = videoEmbedUrl.replace('watch?v=', 'embed/');
  } else if (videoEmbedUrl.includes('youtu.be/')) {
    const videoId = videoEmbedUrl.split('youtu.be/')[1]?.split('?')[0];
    videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  } else if (!videoEmbedUrl.includes('embed')) {
    videoEmbedUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ`;
  }

  // Load User's Timestamped Notes for this Course & Lesson
  const notesStorageKey = `learnhub_notes_${currentUser.id}_${courseId}`;
  const allCourseNotes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
  const currentLessonNotes = allCourseNotes.filter(n => n.lessonId === activeLesson.id);

  // Load Q&A Discussions for this lesson
  const qaStorageKey = `learnhub_qa_${courseId}_${activeLesson.id}`;
  const lessonQuestions = JSON.parse(localStorage.getItem(qaStorageKey) || JSON.stringify([
    {
      id: 'qa_1',
      author: 'محمد عثمان',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      question: 'استاد محترم! کیا اس قاعدے کا اطلاق تمام قراءتوں میں یکساں ہے؟',
      timestamp: '2 گھنٹے پہلے',
      votes: 5,
      answer: {
        author: 'مفتی عبدالرحمن (استادِ کورس)',
        badge: 'مستند استاد',
        text: 'جی ہاں، حفص عن عاصم اور اکثر قراءتِ سبعہ میں اس کا بنیادی اصول یکساں ہے۔',
        timestamp: '1 گھنٹہ پہلے'
      }
    }
  ]));

  container.innerHTML = `
    <!-- Top Royal Player Header Bar -->
    <div class="bg-slate-900/95 backdrop-blur text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <a href="#/courses/${course.id}" class="text-slate-400 hover:text-emerald-400 p-2 rounded-xl hover:bg-slate-800 transition shrink-0" title="کورس کے صفحہ پر واپس جائیں">
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </a>
        <div class="min-w-0 flex-1">
          <div class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 truncate">
            <i data-lucide="graduation-cap" class="w-3.5 h-3.5 shrink-0"></i>
            <span>${course.title}</span>
          </div>
          <div class="text-sm sm:text-base font-extrabold text-white truncate flex items-center gap-2">
            <span>${currentIndex + 1}. ${activeLesson.title}</span>
            ${isCompleted ? '<span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] py-0.5 px-2">مکمل شدہ ✓</span>' : ''}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-5 shrink-0">
        <!-- Progress Counter -->
        <div class="hidden md:flex items-center gap-3 bg-slate-800/80 py-1.5 px-3.5 rounded-xl border border-slate-700/60">
          <div class="text-right">
            <div class="text-[10px] text-slate-400">کورس کی پیش رفت</div>
            <div class="text-xs font-extrabold text-amber-400">${progressPercent}% مکمل</div>
          </div>
          <div class="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        ${progressPercent === 100 ? `
          <button onclick="window.Views.openRoyalCertificateModal('${course.id}')" class="btn-primary py-1.5 px-3.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold border-none shadow-lg shadow-amber-500/20 flex items-center gap-1.5 animate-pulse">
            <i data-lucide="award" class="w-4 h-4"></i>
            <span>شاہی سند حاصل کریں</span>
          </button>
        ` : ''}

        <!-- Toggle Curriculum Sidebar on Mobile -->
        <button onclick="document.getElementById('curriculum-sidebar').classList.toggle('hidden')" class="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-200 lg:hidden border border-slate-700">
          <i data-lucide="list-video" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Main Learning Layout -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-130px)] bg-slate-950">
      
      <!-- Center Content & Video Workspace (70% on Desktop) -->
      <div class="w-full lg:w-[70%] flex-1 flex flex-col justify-between overflow-y-auto">
        <div class="p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          
          <!-- Multi-Format Media Player Wrapper -->
          <div class="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
            ${(activeLesson.type === 'video' || (activeLesson.videoUrl && !activeLesson.audioUrl)) ? `
              <div class="aspect-video w-full relative bg-black">
                ${activeLesson.videoUrl && activeLesson.videoUrl.startsWith('data:') ? `
                  <video src="${activeLesson.videoUrl}" controls class="w-full h-full object-contain" autoplay></video>
                ` : `
                  <iframe 
                    id="course-video-frame"
                    src="${videoEmbedUrl}" 
                    class="w-full h-full border-none" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>
                `}
              </div>
            ` : (activeLesson.type === 'audio' || activeLesson.audioUrl) ? `
              <div class="p-8 sm:p-12 text-center bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex flex-col items-center justify-center space-y-6">
                <div class="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 animate-pulse shadow-xl">
                  <i data-lucide="headphones" class="w-12 h-12"></i>
                </div>
                <div class="max-w-xl">
                  <span class="badge bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">صوتی درس و تلاوت (Audio Lecture)</span>
                  <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${activeLesson.title}</h3>
                  <p class="text-xs text-emerald-400/90 font-mono">${activeLesson.sectionTitle || 'عام اسباق'} • دورانیہ: ${activeLesson.durationMinutes || '15'} منٹ</p>
                </div>

                <!-- Custom Audio Studio Player -->
                <div class="w-full max-w-xl bg-slate-900/90 rounded-3xl p-5 border border-emerald-500/30 shadow-2xl space-y-4">
                  <audio id="main-lesson-audio" src="${activeLesson.audioUrl || ''}" controls class="w-full h-10 rounded-xl"></audio>
                  <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800" dir="ltr">
                    <div class="flex items-center gap-2">
                      <button type="button" onclick="document.getElementById('main-lesson-audio').currentTime -= 15" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200" title="15s پیچھے">-15s</button>
                      <button type="button" onclick="document.getElementById('main-lesson-audio').currentTime += 15" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200" title="15s آگے">+15s</button>
                    </div>
                    <div class="flex items-center gap-1.5 font-mono text-[11px]">
                      <button type="button" onclick="document.getElementById('main-lesson-audio').playbackRate = 1.0; window.App.showToast('Speed: 1x', 'info')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold">1x</button>
                      <button type="button" onclick="document.getElementById('main-lesson-audio').playbackRate = 1.25; window.App.showToast('Speed: 1.25x', 'info')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">1.25x</button>
                      <button type="button" onclick="document.getElementById('main-lesson-audio').playbackRate = 1.5; window.App.showToast('Speed: 1.5x', 'info')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">1.5x</button>
                    </div>
                  </div>
                </div>
              </div>
            ` : (activeLesson.type === 'image' || activeLesson.imageUrl) ? `
              <div class="p-4 sm:p-8 bg-slate-900 flex flex-col items-center justify-center space-y-4">
                <div class="max-w-3xl w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-black">
                  <img src="${activeLesson.imageUrl}" class="w-full h-auto max-h-[500px] object-contain mx-auto" alt="${activeLesson.title}">
                </div>
                <p class="text-xs text-slate-400">${activeLesson.title} — تفصیلی انفوگرافک و ڈایاگرام</p>
              </div>
            ` : `
              <div class="p-6 sm:p-12 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800">
                <div class="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                  <span>تحریری مطالعہ کا سبق (Reading Module)</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${activeLesson.title}</h2>
              </div>
            `}

            <!-- Arabic Ayah / Hadith Vocalized Banner if present in lesson -->
            ${activeLesson.arabicText ? `
              <div class="p-5 sm:p-6 bg-gradient-to-l from-amber-950/40 via-slate-900 to-amber-950/40 border-t border-amber-500/30 text-center font-arabic text-amber-200 text-lg sm:text-xl leading-loose">
                <div class="text-[11px] font-urdu text-amber-400/80 mb-1">📖 قرآنی آیت / حدیث شریف مع اعراب:</div>
                <div class="select-all">« ${activeLesson.arabicText} »</div>
              </div>
            ` : ''}
          </div>

          <!-- Lesson Notes / Text Content Body if available -->
          ${activeLesson.contentBody ? `
            <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 space-y-3 font-urdu text-right" dir="rtl">
              <h4 class="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>خلاصۂ درس و تفصیلی شرعی تشریح:</span>
              </h4>
              <div class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-300">
                ${activeLesson.contentBody}
              </div>
            </div>
          ` : ''}

          <!-- Downloadable PDF Handouts & Files Bar if attached -->
          ${(activeLesson.attachments && activeLesson.attachments.length > 0) ? `
            <div class="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 font-urdu text-right" dir="rtl">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <i data-lucide="folder-down" class="w-4 h-4 text-amber-400"></i> نصابی کتب و پی ڈی ایف فائلز (${activeLesson.attachments.length})
                </span>
                <span class="text-[10px] text-slate-400">ڈاؤن لوڈ کے لیے دستیاب</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${activeLesson.attachments.map(att => `
                  <a href="${att.url}" target="_blank" download class="p-3 bg-slate-900 rounded-xl border border-amber-500/20 hover:border-amber-400 flex items-center justify-between gap-3 text-xs transition group">
                    <span class="font-bold text-slate-200 group-hover:text-amber-300 flex items-center gap-2 truncate">
                      <i data-lucide="file-text" class="w-4 h-4 text-amber-400 shrink-0"></i>
                      <span class="truncate">${att.title || 'دستاویز'}</span>
                    </span>
                    <span class="badge bg-amber-500/20 text-amber-300 text-[10px] shrink-0 font-mono flex items-center gap-1">
                      <i data-lucide="download" class="w-3 h-3"></i> محفوظ کریں
                    </span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Lesson Action & Completion Control Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 text-white shadow-lg">
            <div>
              <h3 class="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>${activeLesson.title}</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">سبق #${currentIndex + 1}</span>
              </h3>
              <p class="text-xs text-slate-400 mt-1">${activeLesson.description || 'اس سبق کو دیکھ کر اپنے نوٹس درج کریں اور مارک کریں تاکہ آپ کی پیش رفت محفوظ ہو۔'}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onclick="window.Views.toggleLessonCompletion('${course.id}', '${activeLesson.id}', ${!isCompleted})"
                class="btn-primary py-2.5 px-5 text-xs rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-emerald-600 text-slate-200'}">
                <i data-lucide="${isCompleted ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
                <span>${isCompleted ? 'سبق مکمل ہو گیا ✓' : 'مکمل قرار دیں'}</span>
              </button>

              <button onclick="window.Views.openTimestampNoteModal('${courseId}', '${activeLesson.id}', '${activeLesson.title}')" class="btn-secondary py-2.5 px-3.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl flex items-center gap-1.5 shadow-sm">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
                <span>نوٹ لکھیں (+ Note)</span>
              </button>
            </div>
          </div>

          <!-- LMS Pro Interactive Workspace Tabs -->
          <div class="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <!-- Tab Headers -->
            <div class="flex items-center border-b border-slate-800 overflow-x-auto no-scrollbar bg-slate-950/50">
              <button onclick="window.Views.switchLmsTab('notes')" id="lms-tab-btn-notes" class="lms-tab-btn py-3.5 px-5 text-xs font-bold border-b-2 border-emerald-500 text-emerald-400 flex items-center gap-2 shrink-0">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>ذاتی نوٹس (${currentLessonNotes.length})</span>
              </button>
              <button onclick="window.Views.switchLmsTab('qa')" id="lms-tab-btn-qa" class="lms-tab-btn py-3.5 px-5 text-xs font-bold border-b-2 border-transparent text-slate-400 hover:text-white flex items-center gap-2 shrink-0">
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span>سوال و جواب و ڈسکشن (${lessonQuestions.length})</span>
              </button>
              <button onclick="window.Views.switchLmsTab('resources')" id="lms-tab-btn-resources" class="lms-tab-btn py-3.5 px-5 text-xs font-bold border-b-2 border-transparent text-slate-400 hover:text-white flex items-center gap-2 shrink-0">
                <i data-lucide="folder-down" class="w-4 h-4"></i>
                <span>متعلقہ پی ڈی ایف و کتب (${(activeLesson.resources || []).length || 1})</span>
              </button>
            </div>

            <!-- Tab 1: Timestamped Notes Panel -->
            <div id="lms-tab-content-notes" class="p-5 sm:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-extrabold text-white flex items-center gap-2">
                    <i data-lucide="bookmark" class="w-4 h-4 text-amber-400"></i>
                    <span>اس سبق کے ٹائم اسٹیمپ نوٹس</span>
                  </h4>
                  <p class="text-xs text-slate-400">اپنے اہم نکات لکھیں، ٹائم پر کلک کرنے سے ویڈیو وہیں سے چلے گی۔</p>
                </div>
                ${currentLessonNotes.length > 0 ? `
                  <button onclick="window.Views.exportNotesTxt('${course.title}', '${activeLesson.title}')" class="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                    <span>ایکسپورٹ نوٹس</span>
                  </button>
                ` : ''}
              </div>

              <!-- Notes List -->
              <div class="space-y-2.5">
                ${currentLessonNotes.length === 0 ? `
                  <div class="p-6 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                    <i data-lucide="pen-tool" class="w-8 h-8 text-slate-600 mx-auto mb-2"></i>
                    <p class="text-xs text-slate-400">آپ نے ابھی اس سبق میں کوئی نوٹ شامل نہیں کیا۔</p>
                    <button onclick="window.Views.openTimestampNoteModal('${courseId}', '${activeLesson.id}', '${activeLesson.title}')" class="mt-3 btn-primary py-1.5 px-4 text-xs inline-flex items-center gap-1.5">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                      <span>پہلا نوٹ شامل کریں</span>
                    </button>
                  </div>
                ` : currentLessonNotes.map((n, idx) => `
                  <div class="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start justify-between gap-3 group hover:border-emerald-500/40 transition">
                    <div class="flex items-start gap-3 min-w-0 flex-1">
                      <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono py-1 px-2.5 rounded-lg shrink-0 cursor-pointer hover:bg-emerald-500 hover:text-slate-950 transition">
                        ⏱ ${n.timestamp || '00:00'}
                      </span>
                      <div class="text-xs text-slate-200 leading-relaxed break-words">${n.text}</div>
                    </div>
                    <button onclick="window.Views.deleteTimestampNote('${courseId}', '${n.id}')" class="text-slate-500 hover:text-red-400 p-1 opacity-60 group-hover:opacity-100 transition" title="ڈیلیٹ کریں">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tab 2: Lesson Q&A Forum -->
            <div id="lms-tab-content-qa" class="p-5 sm:p-6 space-y-5 hidden">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-extrabold text-white">استاد و طلباء سے سوال و جواب (Lesson Q&A)</h4>
                  <p class="text-xs text-slate-400">سبق کے متعلق کوئی شبہ ہو تو یہاں سوال پوچھیں۔</p>
                </div>
                <button onclick="window.Views.openAskQuestionModal('${courseId}', '${activeLesson.id}')" class="btn-primary py-2 px-3.5 text-xs rounded-xl flex items-center gap-1.5">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i>
                  <span>نیا سوال پوچھیں</span>
                </button>
              </div>

              <div class="space-y-3">
                ${lessonQuestions.map(q => `
                  <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <img src="${q.avatar}" class="w-7 h-7 rounded-full object-cover border border-slate-700" alt="${q.author}">
                        <div>
                          <div class="text-xs font-bold text-white">${q.author}</div>
                          <div class="text-[10px] text-slate-400">${q.timestamp}</div>
                        </div>
                      </div>
                      <span class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i> ${q.votes}
                      </span>
                    </div>

                    <p class="text-xs text-slate-200 leading-relaxed font-semibold">${q.question}</p>

                    ${q.answer ? `
                      <div class="p-3 bg-slate-900/90 rounded-xl border-r-4 border-emerald-500 space-y-1 text-right">
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="font-bold text-emerald-400 flex items-center gap-1">
                            <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
                            ${q.answer.author} (${q.answer.badge})
                          </span>
                          <span class="text-slate-400 text-[10px]">${q.answer.timestamp}</span>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${q.answer.text}</p>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tab 3: Downloadable Resources & PDFs -->
            <div id="lms-tab-content-resources" class="p-5 sm:p-6 space-y-4 hidden">
              <div>
                <h4 class="text-sm font-extrabold text-white">ڈاؤن لوڈ کے قابل تدریسی مواد (Course Resources)</h4>
                <p class="text-xs text-slate-400">اس سبق کے متعلقہ خلاصہ جات، پی ڈی ایف اور کتب یہاں سے ڈاؤن لوڈ کریں۔</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <i data-lucide="file-text" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-white">خلاصۂ سبق و اہم قواعد (PDF)</div>
                      <div class="text-[10px] text-slate-400 uppercase">PDF • 1.2 MB</div>
                    </div>
                  </div>
                  <a href="#/library" class="btn-primary py-1.5 px-3 text-xs rounded-lg">ڈاؤن لوڈ</a>
                </div>

                <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <i data-lucide="book-marked" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-white">کتابِ متن و شروحات</div>
                      <div class="text-[10px] text-slate-400 uppercase">Library Book</div>
                    </div>
                  </div>
                  <a href="#/library" class="btn-secondary py-1.5 px-3 text-xs bg-slate-800 rounded-lg">مطالعہ کریں</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Lesson Navigation Controls -->
        <div class="border-t border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-white sticky bottom-0 z-20">
          ${prevLesson ? `
            <a href="#/learn/${course.id}/${prevLesson.id}" class="btn-secondary py-2.5 px-4 text-xs bg-slate-800 text-slate-200 border-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition">
              <i data-lucide="chevron-right" class="w-4 h-4 shrink-0"></i>
              <span class="truncate max-w-[140px] sm:max-w-[200px]">پچھلا سبق: ${prevLesson.title}</span>
            </a>
          ` : `<div></div>`}

          ${nextLesson ? `
            <a href="#/learn/${course.id}/${nextLesson.id}" class="btn-primary py-2.5 px-5 text-xs rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-500/20">
              <span class="truncate max-w-[140px] sm:max-w-[200px]">اگلا سبق: ${nextLesson.title}</span>
              <i data-lucide="chevron-left" class="w-4 h-4 shrink-0"></i>
            </a>
          ` : `
            <button onclick="window.Views.finishCoursePrompt('${course.id}')" class="btn-primary py-2.5 px-6 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl shadow-xl flex items-center gap-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>کورس مکمل کریں اور شاہی سند لیں 🎓</span>
            </button>
          `}
        </div>
      </div>

      <!-- Curriculum Sidebar (30% on Desktop, Collapsible Drawer on Mobile) -->
      <div id="curriculum-sidebar" class="w-full lg:w-[30%] bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-white bg-slate-950/40">
          <div>
            <h4 class="font-extrabold text-sm flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-emerald-400"></i>
              <span>کورس کا مکمل نصاب</span>
            </h4>
            <span class="text-xs text-slate-400">${(enrollment.completedLessons || []).length} / ${course.lessons.length} اسباق مکمل</span>
          </div>
          <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-1 px-3 rounded-full">${progressPercent}%</span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[calc(100vh-220px)]">
          ${course.lessons.map((lesson, idx) => {
            const isLessonDone = (enrollment.completedLessons || []).includes(lesson.id);
            const isCurrent = lesson.id === activeLesson.id;

            return `
              <a href="#/learn/${course.id}/${lesson.id}" class="p-4 flex items-start gap-3.5 hover:bg-slate-800/80 transition block ${isCurrent ? 'bg-emerald-950/40 border-r-4 border-emerald-500' : ''}">
                <div class="mt-0.5 shrink-0">
                  <i data-lucide="${isLessonDone ? 'check-circle-2' : isCurrent ? 'play-circle' : 'circle'}" class="w-4 h-4 ${isLessonDone ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-slate-600'}"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-white truncate ${isCurrent ? 'text-emerald-300' : ''}">${idx + 1}. ${lesson.title}</div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                    <span class="capitalize">${lesson.type === 'video' ? 'ویڈیو' : lesson.type === 'audio' ? 'آڈیو' : 'مطالعہ'}</span>
                    <span>•</span>
                    <span>${lesson.durationMinutes || '10'} منٹ</span>
                  </div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Toggle Tab switcher in LMS workspace
 */
window.Views.switchLmsTab = function(tabName) {
  ['notes', 'qa', 'resources'].forEach(tab => {
    const btn = document.getElementById(`lms-tab-btn-${tab}`);
    const content = document.getElementById(`lms-tab-content-${tab}`);
    if (btn && content) {
      if (tab === tabName) {
        btn.classList.add('border-emerald-500', 'text-emerald-400');
        btn.classList.remove('border-transparent', 'text-slate-400');
        content.classList.remove('hidden');
      } else {
        btn.classList.remove('border-emerald-500', 'text-emerald-400');
        btn.classList.add('border-transparent', 'text-slate-400');
        content.classList.add('hidden');
      }
    }
  });
};

/**
 * Open Modal to Add a Timestamped Note
 */
window.Views.openTimestampNoteModal = function(courseId, lessonId, lessonTitle) {
  window.App.showModal('📝 نیا ٹائم اسٹیمپ نوٹ شامل کریں', `
    <form onsubmit="window.Views.saveTimestampNote(event, '${courseId}', '${lessonId}')" class="space-y-4 text-right">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سبق کا عنوان</label>
        <input type="text" value="${lessonTitle}" disabled class="input-field text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وقت / ٹائم اسٹیمپ (مثلاً: 03:45)</label>
        <input type="text" id="note-timestamp" placeholder="02:30" required class="input-field text-xs text-left" dir="ltr">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">آپ کا ذاتی نوٹ یا اہم نکتہ</label>
        <textarea id="note-text" rows="3" placeholder="یہاں اہم قاعدہ یا نکتہ درج کریں..." required class="input-field text-xs"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 text-xs">منسوخ کریں</button>
        <button type="submit" class="btn-primary py-2 px-5 text-xs font-bold">نوٹ محفوظ کریں</button>
      </div>
    </form>
  `);
};

/**
 * Save Timestamp Note to LocalStorage & re-render
 */
window.Views.saveTimestampNote = function(event, courseId, lessonId) {
  event.preventDefault();
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const timestamp = document.getElementById('note-timestamp').value.trim();
  const text = document.getElementById('note-text').value.trim();

  const notesStorageKey = `learnhub_notes_${user.id}_${courseId}`;
  const notes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
  
  notes.unshift({
    id: 'note_' + Date.now(),
    lessonId: lessonId,
    timestamp: timestamp,
    text: text,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  window.App.closeModal();
  window.App.showToast('نوٹ کامیابی سے محفوظ کر لیا گیا! ✓', 'success');
  window.Views.renderLearningPlayer({ courseId: courseId, lessonId: lessonId });
};

/**
 * Delete a Timestamp Note
 */
window.Views.deleteTimestampNote = function(courseId, noteId) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const notesStorageKey = `learnhub_notes_${user.id}_${courseId}`;
  let notes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
  notes = notes.filter(n => n.id !== noteId);
  localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  window.App.showToast('نوٹ ڈیلیٹ ہو گیا۔', 'info');
  window.Router.handleRouting();
};

/**
 * Export Notes as TXT
 */
window.Views.exportNotesTxt = function(courseTitle, lessonTitle) {
  const user = window.Auth.getCurrentUser();
  const notesStorageKey = `learnhub_notes_${user.id}_${courseTitle}`;
  const notes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
  
  let content = `LearnHub Course Notes\nCourse: ${courseTitle}\nStudent: ${user.name}\nDate: ${new Date().toLocaleDateString()}\n\n`;
  notes.forEach((n, i) => {
    content += `${i + 1}. [${n.timestamp}] ${n.text}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LearnHub-Notes-${courseTitle}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Ask Question in Lesson Q&A Modal
 */
window.Views.openAskQuestionModal = function(courseId, lessonId) {
  window.App.showModal('❓ استاد محترم سے سوال پوچھیں', `
    <form onsubmit="window.Views.saveLessonQuestion(event, '${courseId}', '${lessonId}')" class="space-y-4 text-right">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">آپ کا سوال</label>
        <textarea id="qa-question-input" rows="4" placeholder="اس سبق کے بارے میں واضح سوال لکھیں..." required class="input-field text-xs"></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 text-xs">منسوخ کریں</button>
        <button type="submit" class="btn-primary py-2 px-5 text-xs font-bold">سوال ارسال کریں</button>
      </div>
    </form>
  `);
};

window.Views.saveLessonQuestion = function(event, courseId, lessonId) {
  event.preventDefault();
  const user = window.Auth.getCurrentUser();
  const questionText = document.getElementById('qa-question-input').value.trim();

  const qaStorageKey = `learnhub_qa_${courseId}_${lessonId}`;
  const questions = JSON.parse(localStorage.getItem(qaStorageKey) || '[]');

  questions.unshift({
    id: 'qa_' + Date.now(),
    author: user ? user.name : 'طالب علم',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    question: questionText,
    timestamp: 'ابھی',
    votes: 1,
    answer: null
  });

  localStorage.setItem(qaStorageKey, JSON.stringify(questions));
  window.App.closeModal();
  window.App.showToast('آپ کا سوال کامیابی سے بھیج دیا گیا! ✓', 'success');
  window.Views.renderLearningPlayer({ courseId: courseId, lessonId: lessonId });
};

/**
 * Toggle Lesson Completion & Milestone Celebration
 */
window.Views.toggleLessonCompletion = async function(courseId, lessonId, isCompleted) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const updated = await window.API.updateLessonProgress(courseId, lessonId, user.id, isCompleted);
  
  if (updated && updated.progressPercentage === 100 && isCompleted) {
    // Generate sequential verified Certificate in window.DB
    const course = await window.API.getCourseById(courseId);
    const certNumber = 'LH-CERT-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
    
    const newCert = {
      id: 'cert_' + Date.now(),
      certificateNumber: certNumber,
      userId: user.id,
      userName: user.name,
      courseId: courseId,
      title: course ? course.title : 'کامیاب تکمیلِ کورس',
      grade: 'ممتاز (Distinction)',
      issueDate: new Date().toISOString().split('T')[0],
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://learnhub.academy/%23/verify-cert/${certNumber}`,
      verificationUrl: `https://learnhub.academy/#/verify-cert/${certNumber}`,
      verified: true
    };

    window.DB.create('certificates', newCert);
    window.DB.save();

    // Launch celebration confetti
    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }

    window.App.showModal('🎉 مبارک ہو! کورس کی شاندار تکمیل', `
      <div class="text-center space-y-4 py-4">
        <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto text-3xl font-extrabold shadow-xl shadow-amber-500/30 animate-bounce">
          🎓
        </div>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">مبارک ہو، محترم ${user.name}!</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          آپ نے اس کورس کا تمام نصاب کامیابی اور فضیلت کے ساتھ 100% مکمل کر لیا ہے۔ آپ کی باضابطہ تصدیق شدہ <strong>شاہی سند (#${certNumber})</strong> جاری کر دی گئی ہے۔
        </p>
        <div class="pt-3 flex flex-wrap justify-center gap-3">
          <a href="#/certificates" onclick="window.App.closeModal()" class="btn-primary py-2.5 px-6 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold border-none shadow-lg">اپنی شاہی سند دیکھیں و پرنٹ کریں</a>
          <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs">بند کریں</button>
        </div>
      </div>
    `);
  }

  window.Views.renderLearningPlayer({ courseId: courseId, lessonId: lessonId });
};

window.Views.finishCoursePrompt = function(courseId) {
  window.App.showToast('ما شاء اللہ! آپ کی اسناد کے سیکشن میں سرٹیفکیٹ دستیاب ہے۔', 'success');
  window.Router.navigate('/certificates');
};
