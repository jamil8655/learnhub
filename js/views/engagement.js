/**
 * LearnHub Engagement Views: Wishlist, Bookmarks, Notifications, Discussions & Resources
 */

window.Views = window.Views || {};

// Wishlist View
window.Views.renderWishlist = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  if (!user) { window.Router.navigate('/login'); return; }

  const wishlist = window.DB.get('wishlist').filter(w => w.userId === user.id);
  const courses = window.DB.get('courses');
  const quizzes = window.DB.get('quizzes');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">My Wishlist</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Saved courses and quizzes for future learning.</p>
        </div>
      </div>

      ${wishlist.length === 0 ? `
        <div class="lh-card p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <i data-lucide="heart" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Click the heart icon on any masterclass or quiz card to save it here.</p>
          <a href="#/courses" class="btn-primary py-2 px-4 text-xs">Explore Courses</a>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${wishlist.map(item => {
            if (item.itemType === 'course') {
              const c = courses.find(course => course.id === item.itemId);
              if (!c) return '';
              return `
                <div class="lh-card p-5 space-y-4 flex flex-col justify-between">
                  <div class="space-y-3">
                    <img src="${c.thumbnail}" class="w-full aspect-video rounded-xl object-cover">
                    <div class="flex items-center justify-between">
                      <span class="badge badge-primary text-[10px]">Course</span>
                      <button onclick="window.Views.toggleWishlist('course', '${c.id}')" class="text-rose-500 text-xs hover:underline flex items-center gap-1">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
                      </button>
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">${c.title}</h4>
                    <div class="text-base font-extrabold text-slate-900 dark:text-white">${c.isFree ? 'FREE' : '$' + c.price}</div>
                  </div>
                  <a href="#/courses/${c.id}" class="btn-primary py-2 text-xs rounded-xl text-center">View Course</a>
                </div>
              `;
            } else {
              const q = quizzes.find(quiz => quiz.id === item.itemId);
              if (!q) return '';
              return `
                <div class="lh-card p-5 space-y-4 flex flex-col justify-between border-cyan-200 dark:border-cyan-900">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="badge badge-warning text-[10px]">Standalone Quiz</span>
                      <button onclick="window.Views.toggleWishlist('quiz', '${q.id}')" class="text-rose-500 text-xs hover:underline flex items-center gap-1">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
                      </button>
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">${q.title}</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">${q.shortDescription}</p>
                  </div>
                  <a href="#/quiz-take/${q.id}" class="btn-primary py-2 text-xs rounded-xl text-center bg-cyan-600 hover:bg-cyan-500">Start Quiz</a>
                </div>
              `;
            }
          }).join('')}
        </div>
      `}
    </div>
  `;
};

// Bookmarks View
window.Views.renderBookmarks = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  if (!user) { window.Router.navigate('/login'); return; }

  const bookmarks = window.DB.get('bookmarks').filter(b => b.userId === user.id);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Saved Bookmarks</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Quick access to key lessons, articles, and references.</p>
      </div>

      <div class="space-y-3">
        ${bookmarks.map(bm => `
          <div class="lh-card p-4 flex items-center justify-between hover:shadow-md transition">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <i data-lucide="${bm.itemType === 'lesson' ? 'play-circle' : 'paperclip'}" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">${bm.title}</h4>
                <span class="text-[11px] text-slate-400">Saved on ${bm.addedAt}</span>
              </div>
            </div>
            <a href="${bm.url || '#/learn/' + bm.courseId + '/' + bm.itemId}" class="btn-secondary py-1.5 px-3 text-xs rounded-lg">
              Open &rarr;
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Notification Center View
window.Views.renderNotifications = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  if (!user) { window.Router.navigate('/login'); return; }

  const notifications = window.DB.get('notifications').filter(n => n.userId === user.id);

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Platform updates, certificate alerts, and quiz results.</p>
        </div>
        <button onclick="window.Views.markAllNotificationsRead()" class="btn-secondary py-1.5 px-3 text-xs">
          Mark all as read
        </button>
      </div>

      <div class="space-y-3">
        ${notifications.length === 0 ? `
          <div class="lh-card p-8 text-center text-xs text-slate-500">No notifications at this time.</div>
        ` : notifications.map(notif => `
          <div class="lh-card p-4 flex items-start gap-4 transition ${notif.read ? 'opacity-70' : 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20'}">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'certificate' ? 'bg-emerald-100 text-emerald-600' : notif.type === 'quiz' ? 'bg-cyan-100 text-cyan-600' : 'bg-indigo-100 text-indigo-600'}">
              <i data-lucide="${notif.type === 'certificate' ? 'award' : notif.type === 'quiz' ? 'zap' : 'bell'}" class="w-5 h-5"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${notif.title}</h4>
                <span class="text-[10px] text-slate-400">${new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${notif.message}</p>
              ${notif.link ? `
                <a href="${notif.link}" class="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 hover:underline">View details &rarr;</a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.Views.markAllNotificationsRead = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const notifs = window.DB.get('notifications');
  notifs.forEach(n => {
    if (n.userId === user.id) n.read = true;
  });
  window.DB.set('notifications', notifs);
  window.App.showToast('All notifications marked as read.', 'info');
  window.Router.handleRouting();
};

// Discussion Forum View
window.Views.renderDiscussions = async function() {
  const container = document.getElementById('main-content');
  const discussions = window.DB.get('discussions');
  const user = window.Auth.getCurrentUser();

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Community Discussion Forum</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Ask questions, share insights, and learn with peers and instructors.</p>
        </div>
        <button onclick="window.Views.openCreateDiscussionModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Start Discussion
        </button>
      </div>

      <div class="space-y-4">
        ${discussions.map(disc => `
          <div class="lh-card p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="${disc.userAvatar}" class="w-9 h-9 rounded-full object-cover">
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white">${disc.userName}</div>
                  <span class="text-[10px] text-slate-400">${new Date(disc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onclick="window.Views.upvoteDiscussion('${disc.id}')" class="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100">
                <i data-lucide="thumbs-up" class="w-3.5 h-3.5"></i> ${disc.upvotes || 0}
              </button>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white">${disc.title}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${disc.body}</p>

            <!-- Nested Replies -->
            <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h5 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Replies (${(disc.replies || []).length})</h5>
              ${(disc.replies || []).map(rep => `
                <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 ${rep.isInstructor ? 'border-l-4 border-l-indigo-500' : ''}">
                  <div class="flex items-center gap-2">
                    <img src="${rep.userAvatar}" class="w-6 h-6 rounded-full object-cover">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">${rep.userName}</span>
                    ${rep.isInstructor ? '<span class="badge badge-primary text-[9px]">Instructor</span>' : ''}
                    <span class="text-[10px] text-slate-400 ml-auto">${new Date(rep.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${rep.body}</p>
                </div>
              `).join('')}

              <div class="pt-2 flex gap-2">
                <input type="text" id="reply-input-${disc.id}" placeholder="Write a response..." class="form-input text-xs">
                <button onclick="window.Views.submitDiscussionReply('${disc.id}')" class="btn-primary py-1.5 px-3 text-xs rounded-lg">Reply</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.Views.openCreateDiscussionModal = function() {
  window.App.showModal('Start New Discussion', `
    <form onsubmit="window.Views.submitNewDiscussion(event)" class="space-y-4">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic / Question Title</label>
        <input type="text" id="disc-title" required placeholder="e.g. Best practices for Server Action error handling" class="form-input text-xs">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Details & Context</label>
        <textarea id="disc-body" rows="4" required placeholder="Describe your question or findings in detail..." class="form-input text-xs"></textarea>
      </div>
      <button type="submit" class="btn-primary w-full py-2.5 text-xs">Post Discussion</button>
    </form>
  `);
};

window.Views.submitNewDiscussion = function(e) {
  e.preventDefault();
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const title = document.getElementById('disc-title').value;
  const body = document.getElementById('disc-body').value;

  window.DB.insert('discussions', {
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    title,
    body,
    upvotes: 1,
    upvotedBy: [user.id],
    createdAt: new Date().toISOString(),
    replies: []
  });

  window.App.closeModal();
  window.App.showToast('Discussion thread created!', 'success');
  window.Router.handleRouting();
};

window.Views.submitDiscussionReply = function(discId) {
  const user = window.Auth.getCurrentUser();
  if (!user) { window.App.showToast('Please sign in to reply.', 'warning'); return; }

  const input = document.getElementById(`reply-input-${discId}`);
  const text = input?.value?.trim();
  if (!text) return;

  const disc = window.DB.findById('discussions', discId);
  if (!disc) return;

  const newReply = {
    id: `rep-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    isInstructor: user.role === 'instructor' || user.role === 'admin',
    body: text,
    createdAt: new Date().toISOString(),
    upvotes: 0
  };

  disc.replies = disc.replies || [];
  disc.replies.push(newReply);
  window.DB.update('discussions', discId, { replies: disc.replies });

  window.App.showToast('Reply added!', 'success');
  window.Router.handleRouting();
};

window.Views.upvoteDiscussion = function(discId) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const disc = window.DB.findById('discussions', discId);
  if (!disc) return;

  disc.upvotedBy = disc.upvotedBy || [];
  if (disc.upvotedBy.includes(user.id)) {
    disc.upvotes = Math.max(0, (disc.upvotes || 1) - 1);
    disc.upvotedBy = disc.upvotedBy.filter(id => id !== user.id);
  } else {
    disc.upvotes = (disc.upvotes || 0) + 1;
    disc.upvotedBy.push(user.id);
  }

  window.DB.update('discussions', discId, { upvotes: disc.upvotes, upvotedBy: disc.upvotedBy });
  window.Router.handleRouting();
};

// Standalone Learning Resource Library
window.Views.renderResources = async function() {
  const container = document.getElementById('main-content');
  const resources = window.DB.get('resources');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
          <i data-lucide="folder-open" class="w-3.5 h-3.5"></i> Open Knowledge Base
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Learning Resources & Cheat Sheets</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Downloadable architectural guides, syntax cheat sheets, and source code blueprints.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${resources.map(res => `
          <div class="lh-card p-6 flex items-start justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                <i data-lucide="file-text" class="w-6 h-6"></i>
              </div>
              <div class="space-y-1">
                <span class="badge badge-neutral text-[10px]">${res.category}</span>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${res.title}</h4>
                <div class="text-xs text-slate-400">${res.format} • ${res.size} • ${res.downloadsCount.toLocaleString()} downloads</div>
              </div>
            </div>
            <a href="${res.url}" target="_blank" onclick="window.App.showToast('Resource download started!', 'success')" class="btn-primary py-2 px-4 text-xs rounded-xl shrink-0">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Download
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// ============================================================================
// IN-APP GOOGLE PLAY STORE 5-STAR RATING & REVIEW MODAL
// ============================================================================

window.Views.openPlayStoreRatingModal = function() {
  const modal = document.getElementById('global-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="p-6 sm:p-8 text-center space-y-5 font-urdu text-right" dir="rtl">
      
      <div class="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center mx-auto text-4xl shadow-xl animate-bounce">
        ⭐
      </div>

      <div class="space-y-2 text-center">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white">لرن ہب اکیڈمی ایپ کیسی لگی؟</h3>
        <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          اگر آپ کو ہماری اسلامی اور جدید تعلیمی ایپ پسند آئی تو براہ کرم گوگل پلے اسٹور پر 5 اسٹار ریٹنگ دے کر ہمارا حوصلہ بڑھائیں۔
        </p>
      </div>

      <!-- Interactive 5 Stars -->
      <div class="flex items-center justify-center gap-2 py-2 text-3xl cursor-pointer" dir="ltr">
        <span onclick="window.Views.selectStarRating(1)" class="star-item hover:scale-125 transition">⭐</span>
        <span onclick="window.Views.selectStarRating(2)" class="star-item hover:scale-125 transition">⭐</span>
        <span onclick="window.Views.selectStarRating(3)" class="star-item hover:scale-125 transition">⭐</span>
        <span onclick="window.Views.selectStarRating(4)" class="star-item hover:scale-125 transition">⭐</span>
        <span onclick="window.Views.selectStarRating(5)" class="star-item hover:scale-125 transition">⭐</span>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <a 
          href="https://play.google.com/store/apps" 
          target="_blank" 
          onclick="window.App?.closeModal(); window.App?.showToast('آپ کے تعاون کا بہت بہت شکریہ! جزاکم اللہ خیراً ⭐', 'success');"
          class="btn-primary w-full sm:w-auto py-3 px-8 text-xs rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xl flex items-center justify-center gap-2"
        >
          <span>پلے اسٹور پر ریٹنگ دیں (5 Stars) 🌟</span>
        </a>
        <button onclick="window.App?.closeModal()" class="btn-secondary w-full sm:w-auto py-3 px-6 text-xs rounded-2xl font-bold text-slate-500">
          بعد میں کریں گے
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.selectStarRating = function(count) {
  window.App?.showToast(`آپ نے ${count} اسٹارز منتخب کیے! پلے اسٹور پر تبصرہ لکھیں ⭐`, 'success');
};

