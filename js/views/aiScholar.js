/**
 * LearnHub AI Islamic Scholar & Research Assistant View
 * Royal Urdu RTL Chatbot for authentic Islamic Research with Quran/Hadith citations.
 */

window.Views = window.Views || {};

window.Views.aiChatMessages = window.Views.aiChatMessages || [
  {
    sender: 'ai',
    title: 'السلام علیکم ورحمۃ اللہ وبرکاتہ!',
    content: 'میں آپ کا **اے آئی اسلامی ریسرچ اسسٹنٹ** ہوں۔ آپ مجھ سے قرآن، صحیح احادیث، فقہ العبادات، سیرت النبی ﷺ اور روزمرہ کے شرعی مسائل پر مستند حوالوں کے ساتھ رہنمائی حاصل کر سکتے ہیں۔',
    references: ['صحیح بخاری', 'صحیح مسلم', 'قرآن مجید']
  }
];

window.Views.renderAIScholar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const quickPrompts = [
    'نماز کا مسنون نبوی طریقہ کیا ہے؟',
    'وضو کے فرائض اور مسنون طریقہ بتائیں',
    'افضل ترین اذکار اور سید الاستغفار',
    'والدین کے حقوق اور اطاعت',
    'زکوٰۃ کا نصاب اور حساب کا طریقہ'
  ];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- AI Scholar Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="bot" class="w-4 h-4 text-emerald-400"></i>
          <span>مستند اسلامی ریسرچ اسسٹنٹ (AI Islamic Research Assistant)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-white">اے آئی اسلامی ریسرچ اسسٹنٹ</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          قرآن مجید، صحیح بخاری، صحیح مسلم اور معتبر تفاسیر کی روشنی میں علمی و تعلیمی مراجع کی فوری تلاش۔
        </p>

        <!-- Mandatory Islamic Educational Disclaimer (Phase 11 Compliance) -->
        <div class="p-3 bg-amber-500/20 border border-amber-400/50 rounded-2xl text-amber-200 text-xs font-bold max-w-xl mx-auto flex items-center justify-center gap-2">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400 shrink-0"></i>
          <span>یہ علمی و تعلیمی معلومات ہیں، فتویٰ نہیں۔ مخصوص مسائل کے لیے مستند دار الافتاء سے رجوع فرمائیں۔</span>
        </div>
      </div>

      <!-- Quick Prompt Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span class="text-xs font-bold text-slate-400 shrink-0">فوری سوالات:</span>
        ${quickPrompts.map(qp => `
          <button 
            onclick="window.Views.sendAiScholarQuery('${qp}')"
            class="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition whitespace-nowrap shadow-sm"
          >
            ${qp}
          </button>
        `).join('')}
      </div>

      <!-- Chat Stream Container -->
      <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[550px]">
        
        <!-- Messages Area -->
        <div id="ai-chat-messages-container" class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          ${window.Views.renderAiChatMessagesHtml()}
        </div>

        <!-- Chat Input Bar -->
        <div class="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <form onsubmit="window.Views.handleAiChatSubmit(event)" class="flex items-center gap-2">
            <input 
              type="text" 
              id="ai-scholar-input" 
              placeholder="اپنا اسلامی سوال یہاں لکھیں (مثلاً: وتر کی نماز کا طریقہ، صدقہ فطر...)" 
              class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            
            <button 
              type="button" 
              onclick="window.Views.startAiVoiceInput()" 
              class="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 transition"
              title="آواز سے بول کر سوال پوچھیں 🎙️"
            >
              <i data-lucide="mic" class="w-5 h-5"></i>
            </button>

            <button 
              type="submit" 
              class="btn-primary py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shrink-0"
            >
              <span>پوچھیں</span>
              <i data-lucide="send" class="w-4 h-4"></i>
            </button>
          </form>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderAiChatMessagesHtml = function() {
  return window.Views.aiChatMessages.map(msg => {
    const isAi = msg.sender === 'ai';
    return `
      <div class="flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0 shadow-md ${isAi ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white' : 'bg-indigo-600 text-white'}">
          ${isAi ? '🕌' : '👤'}
        </div>

        <div class="max-w-[85%] sm:max-w-2xl rounded-3xl p-4 sm:p-5 space-y-2 text-xs sm:text-sm leading-loose shadow-sm ${isAi ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100' : 'bg-emerald-600 text-white'}">
          ${msg.title ? `<h4 class="font-black text-sm sm:text-base ${isAi ? 'text-emerald-700 dark:text-emerald-400' : 'text-white'}">${msg.title}</h4>` : ''}
          <div class="whitespace-pre-line font-urdu">${msg.content}</div>

          ${msg.references && msg.references.length ? `
            <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
              <span>📚 مراجع و کتب:</span>
              ${msg.references.map(r => `<span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">${r}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
};

window.Views.handleAiChatSubmit = async function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('ai-scholar-input');
  if (!input || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  await window.Views.sendAiScholarQuery(query);
};

window.Views.sendAiScholarQuery = async function(query) {
  window.Views.aiChatMessages.push({
    sender: 'user',
    content: query
  });

  const container = document.getElementById('ai-chat-messages-container');
  if (container) {
    container.innerHTML = window.Views.renderAiChatMessagesHtml();
    container.scrollTop = container.scrollHeight;
  }

  // Show Typing Indicator
  if (container) {
    container.innerHTML += `
      <div id="ai-typing-indicator" class="flex items-center gap-2 text-xs text-slate-400 font-urdu p-3">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>تحقیق کی جا رہی ہے...</span>
      </div>
    `;
    container.scrollTop = container.scrollHeight;
  }

  const result = await window.AIScholarService.askScholar(query);

  const typing = document.getElementById('ai-typing-indicator');
  if (typing) typing.remove();

  if (result) {
    window.Views.aiChatMessages.push({
      sender: 'ai',
      title: result.title,
      content: result.content,
      references: result.references
    });
  }

  if (container) {
    container.innerHTML = window.Views.renderAiChatMessagesHtml();
    container.scrollTop = container.scrollHeight;
  }

  if (window.lucide) window.lucide.createIcons();
};

window.Views.startAiVoiceInput = function() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    window.App?.showToast('آپ کے براؤزر میں وائس ریکگنیشن کی سہولت دستیاب نہیں۔', 'warning');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ur-PK';

  window.App?.showToast('🎤 بولنا شروع کریں... آواز سنی جا رہی ہے', 'info');

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ai-scholar-input');
    if (input) {
      input.value = transcript;
      window.Views.sendAiScholarQuery(transcript);
    }
  };

  recognition.onerror = function() {
    window.App?.showToast('آواز کی شناخت نہیں ہو سکی۔', 'warning');
  };

  recognition.start();
};
