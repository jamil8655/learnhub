/**
 * LearnHub Universal Admin Release Manager & Staging Console
 * Central control room to review, preview, and deploy staged drafts across
 * all platform modules (Courses, Books, Quizzes, Articles, Announcements, Game Stages)
 * to live students and public visitors with 1-click.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderReleaseManager = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = window.DB;
  const summary = (db && typeof db.getStagedDraftsSummary === 'function') 
    ? db.getStagedDraftsSummary() 
    : { totalDrafts: 0, byCollection: {}, draftItems: [] };

  const coursesCount = (db && typeof db.get === 'function' ? db.get('courses', { includeDrafts: true }) : []) || [].length;
  const booksCount = (db && typeof db.get === 'function' ? db.get('books', { includeDrafts: true }) : []) || [].length;
  const quizzesCount = (db && typeof db.get === 'function' ? db.get('quizzes', { includeDrafts: true }) : []) || [].length;
  const articlesCount = (db && typeof db.get === 'function' ? db.get('articles', { includeDrafts: true }) : []) || [].length;
  const totalItems = (coursesCount?.length || 0) + (booksCount?.length || 0) + (quizzesCount?.length || 0) + (articlesCount?.length || 0);

  container.innerHTML = `
    <div class="space-y-6 font-urdu text-right select-none" dir="rtl">
      
      <!-- Top Release Hero Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl text-white">
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="p-3 rounded-2xl bg-indigo-500/20 text-amber-400 border border-indigo-400/40 shadow-inner">
                <i data-lucide="rocket" class="w-8 h-8"></i>
              </span>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-indigo-200">
                  یونیورسل ریلیز مینیجر (Universal Release Hub)
                </h1>
                <p class="text-xs sm:text-sm text-slate-300">
                  تمام زیرِ کار مسودات (Drafts) کا مرکزی کنٹرول روم — آپ جب چاہیں ایک کلک سے لائیو ریلیز کریں۔
                </p>
              </div>
            </div>
          </div>

          <!-- Master 1-Click Deploy Action -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            ${summary.totalDrafts > 0 ? `
              <button 
                onclick="window.Views.admin.deployAllStagedDrafts()" 
                class="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02] active:scale-95 border border-emerald-200"
              >
                <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                <span>تمام ${summary.totalDrafts} ترامیم لائیو شائع کریں 🚀</span>
              </button>
            ` : `
              <div class="py-3 px-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>تمام مواد 100% لائیو اور اپ ٹو ڈیٹ ہے</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Release Status KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        
        <!-- Pending Staged Drafts Card -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 ${summary.totalDrafts > 0 ? 'border-amber-400/60 bg-amber-50/10' : 'border-slate-200 dark:border-slate-800'} shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-black text-amber-600 dark:text-amber-400">غیر شائع شدہ مسودات</span>
            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-3xl font-black ${summary.totalDrafts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}">${summary.totalDrafts}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">ایڈمن ٹیسٹنگ میں موجود</div>
        </div>

        <!-- Live Published Content Card -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-black text-emerald-600 dark:text-emerald-400">شائع شدہ لائیو مواد</span>
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${Math.max(0, totalItems - summary.totalDrafts)}</div>
          <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-urdu mt-1">طلباء کے لیے دستیاب</div>
        </div>

        <!-- Courses in Staging -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold text-indigo-600 dark:text-indigo-400">کورسز و اسباق مسودات</span>
            <i data-lucide="book-open" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${summary.byCollection.courses || 0}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">زیرِ تکمیل کورسز</div>
        </div>

        <!-- Quizzes & Puzzles in Staging -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold text-purple-600 dark:text-purple-400">امتحانات و گیم سوالات</span>
            <i data-lucide="zap" class="w-4 h-4 text-purple-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${(summary.byCollection.quizzes || 0) + (summary.byCollection.gameQuestions || 0)}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">زیرِ جانچ معمیات</div>
        </div>

      </div>

      <!-- Pending Staging Queue Table -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>زیرِ کار اسٹیجنگ کیو (Staging Deployment Queue)</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                ${summary.draftItems.length} آئٹمز
              </span>
            </h3>
            <p class="text-xs text-slate-500">یہ تمام ترامیم ابھی صرف ایڈمن کو نظر آ رہی ہیں۔ آپ فرداً فرداً یا ایک ساتھ لائیو ریلیز کر سکتے ہیں۔</p>
          </div>
        </div>

        ${summary.draftItems.length === 0 ? `
          <div class="text-center py-8 space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <i data-lucide="check-check" class="w-6 h-6"></i>
            </div>
            <h4 class="font-extrabold text-xs text-slate-800 dark:text-slate-200">کوئی مسودہ یا غیر شائع شدہ ترمیم باقی نہیں ہے</h4>
            <p class="text-[11px] text-slate-400">آپ کا تمام تخلیق کردہ مواد لائیو طلباء اور قارئین کے لیے شائع شدہ حالت میں ہے۔</p>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-right border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th class="py-3 px-3">عنوانِ آئٹم</th>
                  <th class="py-3 px-3">شعبہ (Category)</th>
                  <th class="py-3 px-3">حالت (Status)</th>
                  <th class="py-3 px-3">تاریخِ اندراج</th>
                  <th class="py-3 px-3 text-center">ایکشنز</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                ${summary.draftItems.map(item => {
                  const typeLabel = 
                    item.collection === 'courses' ? 'کورسز و نصاب' :
                    item.collection === 'books' ? 'اسلامی کتب خانہ' :
                    item.collection === 'quizzes' ? 'معروضی امتحان' :
                    item.collection === 'gameQuestions' ? 'گیم ایڈونچر سوال' :
                    item.collection === 'articles' ? 'مضمون / آرٹیکل' : 'اعلان';

                  const badgeColor = 
                    item.collection === 'courses' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                    item.collection === 'books' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                    item.collection === 'quizzes' ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300';

                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td class="py-3.5 px-3 max-w-sm truncate text-slate-900 dark:text-white">${item.title}</td>
                      <td class="py-3.5 px-3">
                        <span class="px-2.5 py-1 rounded-xl text-[10px] font-bold ${badgeColor}">
                          ${typeLabel}
                        </span>
                      </td>
                      <td class="py-3.5 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 w-fit">
                          <i data-lucide="eye-off" class="w-3 h-3"></i> <span>مسودہ (Draft)</span>
                        </span>
                      </td>
                      <td class="py-3.5 px-3 text-slate-400 font-mono text-[11px]" dir="ltr">
                        ${new Date(item.createdAt).toLocaleDateString('ur-PK')}
                      </td>
                      <td class="py-3.5 px-3 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            onclick="window.Views.admin.publishSingleStagedItem('${item.collection}', '${item.id}')" 
                            class="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                            title="لائیو شائع کریں"
                          >
                            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                            <span>شائع کریں</span>
                          </button>
                          <button 
                            onclick="window.Views.admin.discardStagedDraft('${item.collection}', '${item.id}')" 
                            class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition" 
                            title="ڈرافٹ خارج کریں"
                          >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Master Features Inventory & Test Suite -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-amber-500"></i>
              <span>تمام تیار شدہ جدید ماڈیولز اور فیچرز (Master Feature Inventory)</span>
            </h3>
            <p class="text-xs text-slate-500">ایڈمن کے لیے تمام 9 بڑے جدید سسٹمز کا مکمل جائزہ، لائیو معائنہ اور کنٹرول روم۔</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-urdu">
          
          <!-- 1. Adventure Game Studio -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold"><i data-lucide="gamepad-2" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">100% فعال</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">🎮 اسلامی ایڈونچر گیم و 9 جہان</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">9 قرآنی و دینی جہان، 7 منی گیمز، بوس اسٹیجز، XP، لائفز، اور ایڈمن گیم اسٹوڈیو۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-amber-500/20">
              <a href="#/adventure" class="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs text-center">پریویو کھیلیں</a>
              <a href="#/admin/game-studio" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">اسٹوڈیو</a>
            </div>
          </div>

          <!-- 2. Royal Certificates -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-emerald-600 text-white font-bold"><i data-lucide="award" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">100% فعال</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">📜 شاہی اسناد و بلک مارکنگ</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">منفرد سیریل LH-CERT-2026، کیو آر ویریفکیشن، اور ایک ساتھ طلباء کو ریمارک و اسناد جاری کرنے کا بلک سسٹم۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
              <a href="#/certificates" class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs text-center">اسناد پورٹل</a>
              <a href="#/admin/certificates" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">ایڈمن مینجمنٹ</a>
            </div>
          </div>

          <!-- 3. Islamic Classical Library -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-indigo-600 text-white font-bold"><i data-lucide="book" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">300+ کتب لائیو</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">📚 اسلامی کتب خانہ و پی ڈی ایف ریڈر</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">تفاسیر، کتبِ صحاح ستہ، عقیدہ، فقہ اور سیرت کی 300+ کتب، ان-ایپ ریڈر اور ایڈمن کتب کنٹرول۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-indigo-500/20">
              <a href="#/library" class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs text-center">کتب خانہ کھولیں</a>
              <a href="#/admin/books" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">کتب ایڈمن</a>
            </div>
          </div>

          <!-- 4. AI Islamic Scholar -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-cyan-600 text-white font-bold"><i data-lucide="bot" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">RAG فعال</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">🤖 مصنوعی ذہانت اسلامک اسکالر</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">قرآن و حدیث کی روشنی میں سائنسی جوابات، سخت علمی تنبیہ (Disclaimer) اور پرامپٹ سیکیورٹی۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-cyan-500/20">
              <a href="#/ai-scholar" class="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs text-center">AI اسکالر ٹیسٹ کریں</a>
            </div>
          </div>

          <!-- 5. Voice Tajweed & Makharij -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-purple-600 text-white font-bold"><i data-lucide="mic" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">آڈیو فعال</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">🎙️ وائس تجوید و مخارج اسٹوڈیو</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">حروف کے 17 مخارج کی صوتی ادائیگی، آڈیو ریسیٹیشن اور طلباء کی عملی قراءت مشق۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-purple-500/20">
              <a href="#/voice-tajweed" class="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs text-center">وائس تجوید</a>
              <a href="#/makharij" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">مخارج چارٹ</a>
            </div>
          </div>

          <!-- 6. Quiz Battle Arena -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-rose-600 text-white font-bold"><i data-lucide="swords" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">1v1 ایرینا</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">⚔️ کوئز بیٹل و انعامی وہیل</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">طلباء کا براہِ راست علمی مقابلہ، ریئل ٹائم اسکور کارڈز اور روزانہ لکی ڈرا اسپن وہیل۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-rose-500/20">
              <a href="#/battle-arena" class="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs text-center">بیٹل ایرینا</a>
              <a href="#/quiz-wheel" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">اسپن وہیل</a>
            </div>
          </div>

          <!-- 7. Islamic Mirath Calculator -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-teal-600 text-white font-bold"><i data-lucide="calculator" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">شرعی حساب</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">🕌 شرعی میراث و وراثت کیلکولیٹر</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">اصحاب الفروض اور عصبات کے شرعی حصص، قرآنی دلائل اور درست وراثتی تقسیم نامہ۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-teal-500/20">
              <a href="#/mirath" class="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs text-center">میراث کیلکولیٹر کھولیں</a>
            </div>
          </div>

          <!-- 8. Moon Sighting & Qibla -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-blue-600 text-white font-bold"><i data-lucide="compass" class="w-5 h-5"></i></span>
                <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">GPS و کیمرہ</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">🌙 رویتِ ہلال و قبلہ کیمرہ کمپاس</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">قمری تاریخیں، چاند کے منازل اور اے آر کیمرہ کے ذریعے خانہ کعبہ کی سمت کی شناخت۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-blue-500/20">
              <a href="#/moon-sighting" class="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center">رویت ہلال</a>
              <a href="#/qibla-camera" class="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">قبلہ کیمرہ</a>
            </div>
          </div>

          <!-- 9. Centralized Admin Console -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold"><i data-lucide="shield-check" class="w-5 h-5"></i></span>
                <span class="badge bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">سینٹرل کنٹرول</span>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">👑 ایڈمن کنٹرول روم و گورننس</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">صارفین، کورسز، اساتذہ، امتحانات، آرڈرز، سیکیورٹی آڈٹ لاگز اور ڈیٹا بیس بیک اپ۔</p>
            </div>
            <div class="flex items-center gap-2 pt-2 border-t border-amber-500/20">
              <a href="#/admin" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs text-center">ایڈمن ڈیش بورڈ</a>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.deployAllStagedDrafts = function() {
  if (confirm('کیا آپ تمام مسودات اور ترامیم کو ایک ساتھ لائیو طلباء اور قارئین کے لیے شائع کرنا چاہتے ہیں؟')) {
    const count = window.DB.publishAllStagedDrafts();
    window.App.showToast(`🎉 مبارک! تمام ${count} مسودات اور ترامیم کامیابی کے ساتھ لائیو شائع ہو گئیں!`, 'success');
    window.Views.admin.renderReleaseManager();
  }
};

window.Views.admin.publishSingleStagedItem = function(collectionName, id) {
  const success = window.DB.publishItem(collectionName, id);
  if (success) {
    window.App.showToast('آئٹم کامیابی سے لائیو شائع ہو گیا!', 'success');
    window.Views.admin.renderReleaseManager();
  }
};

window.Views.admin.discardStagedDraft = function(collectionName, id) {
  if (confirm('کیا آپ واقعی اس مسودے کو خارج (Delete) کرنا چاہتے ہیں؟')) {
    window.DB.delete(collectionName, id);
    window.App.showToast('مسودہ خارج کر دیا گیا۔', 'info');
    window.Views.admin.renderReleaseManager();
  }
};
