/**
 * LearnHub Interactive Learning Player
 * Distraction-free multi-format curriculum player with progress tracking.
 */

window.Views = window.Views || {};

window.Views.renderLearningPlayer = async function(params) {
  const container = document.getElementById('main-content');
  const courseId = params.courseId;
  const lessonId = params.lessonId;
  const currentUser = window.Auth.getCurrentUser();

  if (!currentUser) {
    window.App.showToast('Please sign in to access the course player.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const course = await window.API.getCourseById(courseId);
  if (!course || !course.lessons || course.lessons.length === 0) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 class="text-2xl font-bold">No Lessons Available</h2>
        <p class="text-slate-500">This course does not have published curriculum materials yet.</p>
        <a href="#/courses" class="btn-primary py-2 px-4 text-xs">Return to Courses</a>
      </div>
    `;
    return;
  }

  // Ensure user is enrolled (or auto-enroll if free)
  let enrollments = await window.API.getEnrollments(currentUser.id);
  let enrollment = enrollments.find(e => e.courseId === courseId);

  if (!enrollment) {
    if (course.isFree) {
      enrollment = await window.API.enrollInCourse(courseId, currentUser.id);
    } else {
      window.App.showToast('You must enroll in this masterclass to access lessons.', 'warning');
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

  // Auto record activity & last viewed
  window.API.updateLessonProgress(courseId, activeLesson.id, currentUser.id, isCompleted);

  container.innerHTML = `
    <!-- Top Player Bar -->
    <div class="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <a href="#/courses/${course.id}" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition shrink-0">
          <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </a>
        <div class="min-w-0 flex-1">
          <div class="text-xs text-indigo-400 font-semibold truncate">${course.title}</div>
          <div class="text-sm font-bold text-white truncate">${activeLesson.title}</div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4 shrink-0">
        <!-- Progress Bar -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="text-right">
            <div class="text-[11px] text-slate-400">Course Progress</div>
            <div class="text-xs font-bold text-white">${progressPercent}% Completed</div>
          </div>
          <div class="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        ${progressPercent === 100 ? `
          <a href="#/certificates" class="btn-primary py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 border-none">
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>View Certificate</span>
          </a>
        ` : ''}

        <!-- Toggle Curriculum Sidebar -->
        <button onclick="document.getElementById('curriculum-sidebar').classList.toggle('hidden')" class="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 lg:hidden">
          <i data-lucide="menu" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Main Learning Layout -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-130px)]">
      
      <!-- Center Content Workspace (70% on Laptop, 100% on Mobile/Tablet) -->
      <div class="w-full lg:w-[70%] flex-1 bg-slate-950 flex flex-col justify-between overflow-y-auto">
        <div class="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          
          <!-- Media Player Wrapper -->
          <div class="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            ${activeLesson.type === 'video' ? `
              <div class="aspect-video w-full">
                <iframe 
                  src="${activeLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" 
                  class="w-full h-full border-none" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              </div>
            ` : activeLesson.type === 'audio' ? `
              <div class="p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center space-y-6">
                <div class="w-20 h-20 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center animate-pulse">
                  <i data-lucide="headphones" class="w-10 h-10"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white mb-1">${activeLesson.title}</h3>
                  <p class="text-xs text-slate-400">Audio Lecture • ${activeLesson.durationMinutes} Minutes</p>
                </div>
                <audio controls class="w-full max-w-md mt-4">
                  <source src="${activeLesson.audioUrl || ''}" type="audio/mp3">
                  Your browser does not support the audio element.
                </audio>
              </div>
            ` : `
              <div class="p-6 sm:p-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl space-y-6">
                <div class="flex items-center gap-2 text-xs text-indigo-500 font-bold uppercase tracking-wider">
                  <i data-lucide="book-open" class="w-4 h-4"></i> Reading Lesson
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold">${activeLesson.title}</h2>
                <div class="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
                  ${activeLesson.contentBody || activeLesson.description || 'Welcome to this reading module.'}
                </div>
              </div>
            `}
          </div>

          <!-- Lesson Info & Actions Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 text-white">
            <div>
              <h3 class="text-lg font-bold">${activeLesson.title}</h3>
              <p class="text-xs text-slate-400 mt-1">${activeLesson.description || 'Complete this module to advance your progress.'}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <button 
                onclick="window.Views.toggleLessonCompletion('${course.id}', '${activeLesson.id}', ${!isCompleted})"
                class="btn-primary py-2.5 px-4 text-xs rounded-xl ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-500' : ''}">
                <i data-lucide="${isCompleted ? 'check-circle' : 'circle'}" class="w-4 h-4"></i>
                <span>${isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>

              ${(activeLesson.resources || []).length > 0 ? `
                <button onclick="window.Views.showLessonResourcesModal('${activeLesson.id}')" class="btn-secondary py-2.5 px-3 text-xs bg-slate-800 text-slate-200 border-slate-700">
                  <i data-lucide="paperclip" class="w-4 h-4"></i>
                  <span>Resources (${activeLesson.resources.length})</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Bottom Navigation Controls -->
        <div class="border-t border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-white">
          ${prevLesson ? `
            <a href="#/learn/${course.id}/${prevLesson.id}" class="btn-secondary py-2 px-3 sm:px-4 text-xs bg-slate-800 text-slate-200 border-slate-700 rounded-xl flex items-center gap-1.5">
              <i data-lucide="arrow-left" class="w-3.5 h-3.5 shrink-0"></i>
              <span class="truncate max-w-[120px] sm:max-w-[180px]">پچھلا: ${prevLesson.title}</span>
            </a>
          ` : `<div></div>`}

          ${nextLesson ? `
            <a href="#/learn/${course.id}/${nextLesson.id}" class="btn-primary py-2 px-3 sm:px-4 text-xs rounded-xl flex items-center gap-1.5">
              <span class="truncate max-w-[120px] sm:max-w-[180px]">اگلا: ${nextLesson.title}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 shrink-0"></i>
            </a>
          ` : `
            <button onclick="window.Views.finishCoursePrompt('${course.id}')" class="btn-primary py-2 px-4 text-xs bg-emerald-600 hover:bg-emerald-500 rounded-xl">
              <span>Finish Masterclass 🎓</span>
            </button>
          `}
        </div>
      </div>

      <!-- Curriculum Sidebar (30% on Laptop, Below Media Player on Mobile/Tablet) -->
      <div id="curriculum-sidebar" class="w-full lg:w-[30%] bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div>
            <h4 class="font-bold text-sm">Course Curriculum</h4>
            <span class="text-xs text-slate-400">${(enrollment.completedLessons || []).length} / ${course.lessons.length} Completed</span>
          </div>
          <span class="badge badge-primary text-xs">${progressPercent}%</span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          ${course.lessons.map((lesson, idx) => {
            const isLessonDone = (enrollment.completedLessons || []).includes(lesson.id);
            const isCurrent = lesson.id === activeLesson.id;

            return `
              <a href="#/learn/${course.id}/${lesson.id}" class="p-4 flex items-start gap-3 hover:bg-slate-800/70 transition block ${isCurrent ? 'bg-indigo-950/70 border-l-4 border-indigo-500' : ''}">
                <div class="mt-0.5">
                  <i data-lucide="${isLessonDone ? 'check-circle-2' : isCurrent ? 'play-circle' : 'circle'}" class="w-4 h-4 ${isLessonDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-400' : 'text-slate-600'}"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-white truncate ${isCurrent ? 'text-indigo-300' : ''}">${idx + 1}. ${lesson.title}</div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                    <span class="capitalize">${lesson.type}</span>
                    <span>•</span>
                    <span>${lesson.durationMinutes} mins</span>
                  </div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

window.Views.toggleLessonCompletion = async function(courseId, lessonId, isCompleted) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const updated = await window.API.updateLessonProgress(courseId, lessonId, user.id, isCompleted);
  
  if (updated && updated.progressPercentage === 100 && isCompleted) {
    // Launch celebration confetti
    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    window.App.showModal('🎉 Course Completed!', `
      <div class="text-center space-y-4 py-4">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
          🎓
        </div>
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Congratulations, ${user.name}!</h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          You have mastered 100% of this course curriculum. Your official verifiable certificate has been issued.
        </p>
        <div class="pt-2 flex justify-center gap-3">
          <a href="#/certificates" onclick="window.App.closeModal()" class="btn-primary py-2.5 px-5 text-xs">View My Certificate</a>
          <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs">Close</button>
        </div>
      </div>
    `);
  }

  window.Router.handleRouting();
};

window.Views.showLessonResourcesModal = function(lessonId) {
  const lesson = window.DB.findById('lessons', lessonId);
  if (!lesson || !lesson.resources) return;

  window.App.showModal('Downloadable Resources', `
    <div class="space-y-3">
      ${lesson.resources.map(res => `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <i data-lucide="file-text" class="w-5 h-5 text-indigo-600"></i>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">${res.title}</div>
              <div class="text-[10px] text-slate-400 uppercase">${res.type} • ${res.size}</div>
            </div>
          </div>
          <a href="${res.url}" target="_blank" class="btn-primary py-1 px-3 text-xs rounded-lg">Download</a>
        </div>
      `).join('')}
    </div>
  `);
};

window.Views.finishCoursePrompt = function(courseId) {
  window.App.showToast('Masterclass finished! Check your certificates section.', 'success');
  window.Router.navigate('/certificates');
};
