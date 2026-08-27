/**
 * LearnHub AI Scholar & Master Platform Assistant View
 * Features: Rich Markdown rendering, live tool action buttons, audio pronunciation,
 * voice STT, authentic citations and clean multi-turn chat bubbles.
 */

window.Views = window.Views || {};

window.Views.aiChatMessages = window.Views.aiChatMessages || [
  {
    sender: 'ai',
    title: 'السلام علیکم ورحمۃ اللہ وبرکاتہ!',
    content: 'میں **LearnHub AI ماسٹر اسسٹنٹ** ہوں۔\n\nآپ مجھ سے لرن ہب کے تمام کورسز، فیس، اساتذہ، امتحانی کوئزز، سرٹیفکیٹس، اپنی فیس/پیمنٹ کی تفصیلات، نیز قرآن، حدیث اور شرعی مسائل کے متعلق مستند معلومات حاصل کر سکتے ہیں۔',
    references: ['لرن ہب لائیو ڈیٹا بیس', 'صحیح بخاری و صحیح مسلم'],
    actions: [
      { type: 'COURSES', label: '📖 تمام کورسز دیکھیں', route: '#/courses' },
      { type: 'QUIZZES', label: '🏆 امتحانی کوئزز', route: '#/quizzes' },
      { type: 'TASBIH', label: '📿 سمارٹ تسبیح', route: '#/tasbih' }
    ]
  }
];

window.Views.renderAIScholar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const quickPrompts = [
    'قرآن تجوید کورس کی فیس اور تفصیلات کیا ہیں؟',
    'آزادانہ امتحانی کوئزز اور سرٹیفکیٹ کا طریقہ؟',
    'کیا میرا payment یا آرڈر ریکارڈ موجود ہے؟',
    'میرے داخل شدہ کورسز اور پڑھائی کی پروگریس؟',
    'نماز کا مسنون نبوی طریقہ اور ارکان',
    'زکوٰۃ کا نصاب اور حساب کا طریقہ'
  ];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-urdu text-right w-full overflow-hidden" dir="rtl">
      
      <!-- AI Assistant Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
          <span>لرن ہب ماسٹر اے آئی نالج و لائیو ڈیٹا اسسٹنٹ</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-white">LearnHub AI اسسٹنٹ و اسلامک ریسرچ</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          کورسز، فیس، کوئزز، سرٹیفکیٹس، پیمنٹ اسٹیٹس اور قرآن و حدیث کے مستند شرعی مراجع کا واحد معتبر ذریعہ۔
        </p>
      </div>

      <!-- Quick Prompt Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span class="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>فوری سوالات:</span>
        </span>
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
      <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        <!-- Header Bar with Clear Memory -->
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>لائیو جیمنائی 3.6 فلیش انجن • فعال</span>
          </div>
          <button onclick="window.Views.clearAiChat()" class="text-slate-500 hover:text-rose-500 text-[11px] font-bold flex items-center gap-1">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>چیٹ صاف کریں</span>
          </button>
        </div>

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
              placeholder="لرن ہب، کورسز، فیس، کوئزز یا اسلامی مسائل کے متعلق سوال پوچھیں..." 
              class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-urdu"
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
              class="btn-primary py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shrink-0"
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

        <div class="max-w-[88%] sm:max-w-2xl rounded-3xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm leading-loose shadow-sm ${isAi ? 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100' : 'bg-emerald-600 text-white'}">
          ${msg.title ? `<h4 class="font-black text-sm sm:text-base ${isAi ? 'text-emerald-700 dark:text-emerald-400' : 'text-white'}">${msg.title}</h4>` : ''}
          <div class="whitespace-pre-line font-urdu">${window.Views._formatAiMarkdown(msg.content)}</div>

          <!-- Structured Action Buttons -->
          ${msg.actions && msg.actions.length ? `
            <div class="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-700">
              ${msg.actions.map(act => `
                <a href="${act.route || '#'}" class="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow hover:scale-105 active:scale-95 transition">
                  <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                  <span>${act.label || 'صفحہ کھولیں'}</span>
                </a>
              `).join('')}
            </div>
          ` : ''}

          <!-- Citations & References -->
          ${msg.references && msg.references.length ? `
            <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span>📚 مصادر و مراجع:</span>
              ${msg.references.map(r => `<span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">${r}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
};

window.Views._formatAiMarkdown = function(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b class="text-emerald-700 dark:text-emerald-300 font-bold">$1</b>')
    .replace(/\*(.*?)\*/g, '<i class="text-amber-600 dark:text-amber-400">$1</i>')
    .replace(/^### (.*$)/gim, '<h4 class="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-2 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-black text-base text-slate-900 dark:text-white mt-3 mb-1.5">$1</h3>');
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
    container.innerHTML = window.Views.renderAiChatMessagesHtml() + `
      <div id="ai-typing-indicator" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-base shadow-md">
          🕌
        </div>
        <div class="rounded-3xl p-4 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span class="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
          <span class="inline-block w-2 h-2 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
          <span class="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
          <span>لرن ہب لائیو ڈیٹا بیس اور نالج بیس سے تصدیق کی جا رہی ہے...</span>
        </div>
      </div>
    `;
    container.scrollTop = container.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  // Call Orchestrator
  const response = await window.AIScholarService.askScholar(query);

  const typingElem = document.getElementById('ai-typing-indicator');
  if (typingElem) typingElem.remove();

  if (response) {
    window.Views.aiChatMessages.push({
      sender: 'ai',
      title: response.title,
      content: response.content,
      references: response.references,
      actions: response.actions
    });
  }

  if (container) {
    container.innerHTML = window.Views.renderAiChatMessagesHtml();
    container.scrollTop = container.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.Views.clearAiChat = function() {
  window.Views.aiChatMessages = [
    {
      sender: 'ai',
      title: 'چیٹ ری سیٹ ہو گئی',
      content: 'نئی گفتگو کا آغاز کریں۔ لرن ہب کے کورسز، فیس، کوئزز یا اسلامی احکام کے متعلق دریافت فرمائیں۔',
      references: ['لرن ہب لائیو ڈیٹا بیس']
    }
  ];
  if (window.AIScholarService && typeof window.AIScholarService.clearHistory === 'function') {
    window.AIScholarService.clearHistory();
  }
  const container = document.getElementById('ai-chat-messages-container');
  if (container) {
    container.innerHTML = window.Views.renderAiChatMessagesHtml();
    if (window.lucide) window.lucide.createIcons();
  }
  window.App?.showToast('چیٹ اور گفتگو کی ہسٹری ری سیٹ ہو گئی', 'info');
};

window.Views.startAiVoiceInput = function() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    window.App?.showToast('براؤزر میں آواز سے بولنے کی سہولت میسر نہیں ہے۔', 'warning');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ur-PK';
  recognition.interimResults = false;

  window.App?.showToast('مائیکروفون فعال ہے، بولیے... 🎙️', 'info');

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ai-scholar-input');
    if (input) {
      input.value = transcript;
      window.Views.sendAiScholarQuery(transcript);
    }
  };

  recognition.onerror = function() {
    window.App?.showToast('آواز ریکارڈ نہیں ہو سکی۔ براہ کرم دوبارہ کوشش فرمائیں۔', 'warning');
  };

  recognition.start();
};
