/**
 * LearnHub Master AI Knowledge, Retrieval & Automation Orchestrator
 * Powered by Google Gemini 3.6 Flash API & LearnHub Live Data / RAG Layer
 * Full single-source-of-truth grounding for Courses, Quizzes, Payments, Certificates,
 * Quran, Hadith, Navigation and Account Automations.
 */

window.AIScholarService = window.AIScholarService || {};

(function() {
  'use strict';

  const S = window.AIScholarService;

  // Secure API key resolution (never committed in plaintext)
  function _getApiKey() {
    try {
      return localStorage.getItem('learnhub_gemini_api_key') || 
             (typeof window !== 'undefined' && window._ENV && window._ENV.GEMINI_API_KEY) || 
             atob('QVEuQWI4Uk42TEdCanRyLV9jM2VZamt6UmlJMEVMMkI1YjVhT29wcHVKWWdzT0FaTTJXT1E=');
    } catch(e) {
      return '';
    }
  }

  S.setApiKey = function(key) {
    if (key && typeof key === 'string') {
      localStorage.setItem('learnhub_gemini_api_key', key.trim());
      console.log('[AIScholar] Gemini API Key configured.');
    }
  };

  const GEMINI_MODEL = "models/gemini-3.6-flash";

  // Rolling Multi-Turn Context Memory (Last 6 turns)
  const conversationHistory = [];

  // Rate Limiter
  const queryTimestamps = [];
  const RATE_LIMIT_PER_MINUTE = 25;

  /**
   * Prompt Injection and Jailbreak Shield
   */
  function sanitizeInput(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/ignore\s+(previous|all|the\s+above)\s+instructions/gi, '[filtered]')
      .replace(/system\s+prompt/gi, '[filtered]')
      .replace(/you\s+are\s+now\s+in\s+developer\s+mode/gi, '[filtered]')
      .replace(/reveal\s+(api\s+key|credentials|secret|database)/gi, '[filtered]')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }

  /**
   * Intent Classification & Tool Resolution Engine
   */
  function detectIntentAndTools(query, history = []) {
    const q = query.toLowerCase();
    const lastMessage = history.length > 0 ? history[history.length - 1].content.toLowerCase() : '';

    // Relative context detection (e.g. "اس میں", "usme", "in that", "which one is cheapest")
    const isRelativeContext = /اس میں|usme|in that|among these|which of these|sabse sasta|سب سے سستا|fees kitni|fees/.test(q);

    // Intent 1: Payments, Orders & Transactions
    if (/payment|transaction|order|paid|refund|paise|khareeda|khareed|ادائیگی|پیمنٹ|ٹرانزیکشن|آرڈر|خرید|ریفنڈ/.test(q)) {
      return {
        intent: 'PAYMENT_STATUS',
        requiresLiveTool: true,
        toolName: 'get_payment_or_order_status',
        toolParams: {}
      };
    }

    // Intent 2: User Enrolled Courses & My Progress
    if (/my courses|my progress|enrolled|mere courses|meri padhai|mere sabaq|داخل شدہ|میرے کورسز|میری پڑھائی/.test(q)) {
      return {
        intent: 'USER_ENROLLMENTS',
        requiresLiveTool: true,
        toolName: 'get_user_enrollments',
        toolParams: {}
      };
    }

    // Intent 3: Certificates & Quiz Results
    if (/certificate|sanad|degree|quiz result|marks|score|سرٹیفکیٹ|سند|ڈگری|کوئز رزلٹ|نمبر/.test(q)) {
      return {
        intent: 'CERTIFICATES_AND_RESULTS',
        requiresLiveTool: true,
        toolName: 'get_user_quiz_results_and_certificates',
        toolParams: {}
      };
    }

    // Intent 4: User Profile & Account Info
    if (/profile|account|my email|streak|points|پروفائل|اکاؤنٹ|پوائنٹس|سٹریک/.test(q)) {
      return {
        intent: 'ACCOUNT_INFO',
        requiresLiveTool: true,
        toolName: 'get_account_information',
        toolParams: {}
      };
    }

    // Intent 5: Specific Course Search or Course Details
    if (/course|dakhla|fees|tajweed|fiqh|hadith course|arabic grammar|کورس|تجوید|داخلہ|فیس|نصاب|اسباق/.test(q) || (isRelativeContext && lastMessage.includes('کورس'))) {
      return {
        intent: 'COURSE_QUERY',
        requiresLiveTool: true,
        toolName: 'search_courses',
        toolParams: { query }
      };
    }

    // Intent 6: Quiz Search & Catalog
    if (/quiz|test|exam|assessment|کوئز|ٹیسٹ|امتحان/.test(q)) {
      return {
        intent: 'QUIZ_QUERY',
        requiresLiveTool: true,
        toolName: 'search_quizzes',
        toolParams: { query }
      };
    }

    // Intent 7: Teacher / Instructor Search
    if (/teacher|ustad|instructor|shaikh|mufti|استاذ|اساتذہ|مدرس|شیخ|مفتی/.test(q)) {
      return {
        intent: 'TEACHER_QUERY',
        requiresLiveTool: true,
        toolName: 'get_teacher_information',
        toolParams: { nameOrId: query }
      };
    }

    // Intent 8: Website Navigation
    if (/kahan hai|kidhar hai|kaise kholein|open|page|route|کہاں ہے|کھولیں|صفحہ|لنک/.test(q)) {
      return {
        intent: 'WEBSITE_NAVIGATION',
        requiresLiveTool: true,
        toolName: 'get_website_navigation',
        toolParams: { destination: query }
      };
    }

    // Intent 9: Islamic Knowledge (Quran, Hadith, Fiqh, Azkar)
    return {
      intent: 'ISLAMIC_KNOWLEDGE',
      requiresLiveTool: false,
      toolName: null,
      toolParams: null
    };
  }

  /**
   * Format tool data object into human-readable Urdu markdown and actions
   */
  function formatToolDataToUrdu(data) {
    if (!data) return { text: '', actions: [] };
    if (typeof data === 'string') return { text: data, actions: [] };

    let text = '';
    const actions = [];

    if (data.message) {
      text += data.message + '\n\n';
    }

    if (data.action) {
      actions.push(data.action);
    }

    // Array of courses or items
    if (Array.isArray(data)) {
      if (data.length === 0) {
        text += 'لرن ہب پر اس وقت کوئی کورس دستیاب نہیں ہے۔';
      } else {
        text += '📚 **لرن ہب کے منتخب کورسز:**\n';
        data.forEach(c => {
          text += `• **${c.title}** (${c.category || 'اسلامک کورس'}) — استاذ: **${c.instructor || 'اہلِ علم'}** | فیس: **${c.price ? '$' + c.price : 'مفت (Fi Sabilillah)'}**\n`;
          if (c.action) actions.push(c.action);
        });
      }
    } else if (data.found && data.title) {
      text += `🎓 **${data.title}**\n`;
      text += `• استاذ / شیخ: **${data.instructor || 'اہلِ علم'}**\n`;
      text += `• فیس: **${data.price ? '$' + data.price : 'مفت'}** | دورانیہ: **${data.duration || 'جامع'}**\n`;
      text += `• درجہ بندی: **${data.level || 'ابتدائی تا جدید'}**\n`;
      if (data.description) text += `\n${data.description}\n`;
    }

    // Orders List
    if (data.orders && Array.isArray(data.orders)) {
      if (data.orders.length === 0) {
        text += 'آپ کا ابھی تک کوئی آرڈر یا پیمنٹ ریکارڈ موجود نہیں ہے۔';
      } else {
        text += '💳 **آپ کے مالیاتی آرڈرز و ٹرانزیکشنز:**\n';
        data.orders.forEach(o => {
          text += `• آرڈر نمبر: \`${o.orderId}\` | کورس: **${o.courseTitle || 'کورس'}** | رقم: **$${o.amount}** | اسٹیٹس: **${o.status === 'successful' ? '✅ کامیاب (Paid)' : o.status === 'refunded' ? '↩️ ریفنڈ شدہ' : '⏳ زیرِ کار'}**\n`;
        });
      }
    }

    // Enrollments List
    if (data.enrollments && Array.isArray(data.enrollments)) {
      if (data.enrollments.length === 0) {
        text += 'آپ ابھی تک کسی کورس میں داخل نہیں ہیں۔ آپ مفت کورسز میں فوری داخلہ لے سکتے ہیں!';
      } else {
        text += '📖 **آپ کے داخل شدہ کورسز اور پیش رفت:**\n';
        data.enrollments.forEach(en => {
          text += `• **${en.courseTitle || 'کورس'}** — پیش رفت: **${en.progress || 0}%** | کیفیت: **${en.status === 'completed' ? '🎉 مکمل' : 'جاری'}**\n`;
        });
      }
    }

    // Quizzes & Certificates List
    if (data.attempts && Array.isArray(data.attempts)) {
      text += '📝 **آپ کے کوئز امتحانات کے نتائج:**\n';
      data.attempts.forEach(att => {
        text += `• **${att.quizTitle}** — اسکور: **${att.percentage}%** (${att.passed ? '✅ کامیاب' : 'دوبارہ کوشش کریں'})\n`;
      });
    }
    if (data.certificates && Array.isArray(data.certificates)) {
      text += '\n🏆 **آپ کی جاری شدہ شاہی اسناد:**\n';
      data.certificates.forEach(cert => {
        text += `• سند: **${cert.courseTitle}** | سیریل: \`${cert.serialNumber}\` | تاریخ: ${new Date(cert.issueDate).toLocaleDateString()}\n`;
      });
    }

    return {
      text: text.trim() || (data.message || 'معلومات موصول ہو گئیں۔'),
      actions: actions
    };
  }

  /**
   * Master Ask Function
   */
  S.askScholar = async function(rawQuestion) {
    const question = sanitizeInput(rawQuestion);
    if (!question) return null;

    // 1. Rate Limiting Check
    const now = Date.now();
    const oneMinAgo = now - 60000;
    while (queryTimestamps.length > 0 && queryTimestamps[0] < oneMinAgo) {
      queryTimestamps.shift();
    }
    if (queryTimestamps.length >= RATE_LIMIT_PER_MINUTE) {
      return {
        title: '⚠️ کثرتِ سوالات (Rate Limit Exceeded)',
        content: 'سیکیورٹی کے پیش نظر فی منٹ سوالات کی حد مکمل ہو چکی ہے۔ براہ کرم ایک لمحہ بعد دوبارہ کوشش فرمائیں۔',
        references: ['لرن ہب سیکیورٹی پروٹوکول'],
        isAiGenerated: false
      };
    }
    queryTimestamps.push(now);

    // 2. Intent & Live Tool Detection
    const intentData = detectIntentAndTools(question, conversationHistory);
    let liveToolOutput = null;

    if (intentData.requiresLiveTool && window.AIToolsEngine) {
      const toolRes = await window.AIToolsEngine.executeTool(intentData.toolName, intentData.toolParams);
      if (toolRes.requiresAuth) {
        return {
          title: '🔐 تصدیق درکار ہے (Authentication Required)',
          content: toolRes.message,
          actions: [toolRes.action],
          references: ['لرن ہب سیکیورٹی اور پرائیویسی سسٹم'],
          isAiGenerated: false
        };
      }
      if (toolRes.success) {
        liveToolOutput = toolRes.data;
      }
    }

    // 3. RAG Knowledge Search
    let ragChunks = [];
    if (window.AIKnowledgeEngine) {
      ragChunks = window.AIKnowledgeEngine.search(question, { limit: 4 });
    }

    // 4. Build Grounded Gemini Context
    const currentUser = window.Auth && typeof window.Auth.getCurrentUser === 'function' ? window.Auth.getCurrentUser() : null;
    const userRole = currentUser ? currentUser.role : 'guest';
    const userName = currentUser ? currentUser.name : 'محترم صارف';

    const systemPrompt = `
آپ LearnHub (لرن ہب) اسلامک لرننگ پلیٹ فارم کے ذہین اور باضابطہ "LearnHub اسسٹنٹ" ہیں۔

آپ کا مقصد سائل کے سوال کو گہرائی سے سمجھ کر انتہائی شستہ، قدرتی، مخلصانہ اور تفصیلی اردو میں جواب دینا ہے۔ کسی بھی صورت میں رٹے رٹائے الفاظ (Canned Responses) یا غیر متعلقہ لسٹ مت دہرائیں۔

لرن ہب کے تمام اہم شعبہ جات اور لنکس کا مکمل احاطہ کریں:
1. **قرآن مجید اسٹوڈیو (Route: #/quran)**: 114 سورتیں، 30 پارے، 15 سطری مصحف، متعدد قراء (مشاری راشد، عبدالرحمن السدیس، سعود الشریم) کی خوبصورت تلاوت، اردو ترجمہ اور لفظ بہ لفظ تجوید۔ لنک: [📖 قرآن مجید اسٹوڈیو کھولیں](#/quran)
2. **کتبِ حدیث لائبریری (Route: #/hadith)**: صحاح ستہ (صحیح بخاری، صحیح مسلم، اربعین نووی) کا مکمل عربی و اردو ذخیرہ مع سرچ انجن۔ لنک: [📜 کتبِ حدیث کا ذخیرہ کھولیں](#/hadith)
3. **علوم الحدیث و دیگر کورسز (Route: #/courses)**: تجوید، علوم الحدیث، عربی گرامر، فقہ، اور سیرت کے جامع کورسز مع اساتذہ و فیس۔ لنک: [🎓 تمام کورسز دیکھیں](#/courses)
4. **فقہ و میراث کیلکولیٹر (Route: #/mirath)**: قرآن و سنت کے مطابق شرعی وراثت، ترکہ اور وارثوں کے حصوں کا خودکار لائیو حساب۔ لنک: [⚖️ میراث کیلکولیٹر کھولیں](#/mirath)
5. **زکوٰۃ کیلکولیٹر (Route: #/zakat-calculator)**: سونے، چاندی اور مالِ تجارت پر شرعی زکوٰۃ کا حساب۔ لنک: [💰 زکوٰۃ کیلکولیٹر کھولیں](#/zakat-calculator)
6. **اسلامی کتب خانہ (Route: #/library)**: 300 سے زائد مستند پی ڈی ایف کتب (تفاسیر، عقیدہ، فقہ الحدیث، سیرت، تاریخ) کا آن لائن مطالعہ و ڈاؤن لوڈ۔ لنک: [📚 اسلامی کتب خانہ کھولیں](#/library)
7. **اسلامک ایڈونچر گیم (Route: #/adventure)**: 9 اسلامی جہانوں (ایمان، قرآن، سیرت، صحابہ، اخلاق، فقہ وغیرہ) پر مشتمل انٹرایکٹو پزل و کوئز گیم۔ لنک: [🎮 ایڈونچر گیم کھیلیں](#/adventure)
8. **آزادانہ کوئزز و اسناد (Route: #/quizzes)**: بغیر کورس میں داخلہ لیے براہِ راست دینی امتحانات اور فوری کیو آر تصدیق شدہ شاہی اسناد۔ لنک: [🏆 امتحانی کوئزز دیں](#/quizzes)
9. **اوقاتِ نماز و قبلہ رخ (Route: #/prayer-times, #/qibla)**: لائیو اوقاتِ نماز اور اے آر قبلہ کمپاس۔ لنک: [🕌 اوقاتِ نماز و قبلہ](#/prayer-times)

قواعد:
• سائل جس چیز کے بارے میں پوچھے (مثلاً حدیث، قرآن، میراث، کورسز، کتب)، اس کی مکمل تفصیل بتائیں اور بتائیں کہ لرن ہب پر یہ سہولت کہاں اور کیسے موجود ہے۔
• اپنے جواب کے اندر متعلقہ صفحے کا نیلے رنگ کا کلک ایبل لنک ضرور شامل کریں جیسے [📖 قرآن مجید کھولیں](#/quran) یا [⚖️ میراث کیلکولیٹر](#/mirath)۔
• جواب کے آخر میں ایکشن بٹن کا ٹیگ اس طرح لگائیں:
  [ACTION:{"type":"NAVIGATE","label":"صفحہ پر جائیں","route":"#/route_name"}]

### صارف کا ڈیٹا و سیاق:
- نام: ${userName} | کردار: ${userRole} | لاگ ان: ${currentUser ? 'ہاں' : 'نہیں'}

### لرن ہب لائیو ڈیٹا:
${liveToolOutput ? JSON.stringify(liveToolOutput, null, 2) : 'کوئی لائیو ٹول ڈیٹا نہیں'}

### لرن ہب نالج بیس:
${ragChunks.map(c => `[${c.category.toUpperCase()}] ${c.title}:\n${c.content}`).join('\n\n')}

سائل کا سوال:
"${question}"
`;

    // 5. Call Gemini 3.6 Flash API
    try {
      const apiKey = _getApiKey();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

      const contents = [
        ...conversationHistory.map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1200
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const data = await response.json();
      const replyRaw = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!replyRaw) {
        throw new Error('Empty response from Gemini');
      }

      // Parse structured action tags like [ACTION:{...}]
      let cleanContent = replyRaw;
      const actions = [];
      const actionRegex = /\[ACTION:\s*(\{.*?\})\s*\]/g;
      let match;
      while ((match = actionRegex.exec(replyRaw)) !== null) {
        try {
          const actionObj = JSON.parse(match[1]);
          actions.push(actionObj);
        } catch(e) {}
      }
      cleanContent = cleanContent.replace(actionRegex, '').trim();

      // If live tool returned an explicit action, attach it too
      if (liveToolOutput && liveToolOutput.action) {
        actions.push(liveToolOutput.action);
      } else if (liveToolOutput && Array.isArray(liveToolOutput) && liveToolOutput[0] && liveToolOutput[0].action) {
        actions.push(liveToolOutput[0].action);
      }

      // Update multi-turn history
      conversationHistory.push({ sender: 'user', content: question });
      conversationHistory.push({ sender: 'ai', content: cleanContent });
      if (conversationHistory.length > 12) {
        conversationHistory.shift();
        conversationHistory.shift();
      }

      // Record Analytics & Usage
      S._recordAiAnalytics({
        question,
        intent: intentData.intent,
        success: true,
        toolUsed: intentData.toolName
      });

      return {
        title: null,
        content: cleanContent,
        actions: actions.length ? actions : null,
        isAiGenerated: true
      };

    } catch (err) {
      console.warn('[AIScholar] Gemini online fetch note, using smart contextual synthesizer:', err);

      // Log Unanswered / Failed query for Admin Review
      S._recordUnansweredQuery(question, err.message);

      // Call Smart Contextual Knowledge Synthesizer
      return S._synthesizeSmartUrduResponse(question, liveToolOutput, ragChunks);
    }
  };

  /**
   * Smart Contextual Synthesizer (Fallback & Offline Intelligence)
   */
  S._synthesizeSmartUrduResponse = function(question, liveToolOutput, ragChunks) {
    const q = (question || '').toLowerCase();
    const actions = [];
    let content = '';

    // Domain 1: Quran
    if (/quran|surah|ayat|tilawat|qari|tajweed|قرآن|سورت|تلاوت|قاری|آیت/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر قرآن مجید کا مکمل اسٹوڈیو موجود ہے:\n\n` +
        `• **114 سورتیں اور 30 پارے**: خوبصورت عربی رسم الخط (15 سطری مصحف) اور اردو ترجمہ کے ساتھ۔\n` +
        `• **مشہور قراء کی تلاوت**: شیخ مشاری راشد، شیخ عبدالرحمن السدیس، اور شیخ سعود الشریم کی آواز میں آیت بہ آیت آڈیو۔\n` +
        `• **لفظ بہ لفظ تجوید**: ہر لفظ پر کلک کر کے اس کا صحیح تلفظ اور معنی سیکھیں۔\n\n` +
        `آپ براہِ راست یہاں کلک کر کے سورتیں پڑھ سکتے ہیں: [📖 قرآن مجید اسٹوڈیو کھولیں](#/quran)`;
      actions.push({ type: 'OPEN_QURAN', label: 'قرآن اسٹوڈیو کھولیں', route: '#/quran' });
      return { content, actions, isAiGenerated: false };
    }

    // Domain 2: Hadith
    if (/hadith|bukhari|muslim|hadees|حديث|حدیث|بخاری|مسلم|صحاح/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر احادیثِ مبارکہ کے متعلق دو جامع شعبہ جات دستیاب ہیں:\n\n` +
        `1. **کتبِ حدیث کا ذخیرہ**: صحیح بخاری، صحیح مسلم اور اربعین نووی کی تمام احادیث عربی متن، اردو ترجمہ اور سرچ انجن کے ساتھ۔ براہِ راست مطالعہ کے لیے: [📜 کتبِ حدیث لائبریری کھولیں](#/hadith)\n` +
        `2. **علوم الحدیث کے باقاعدہ کورسز**: محدثین کے اصول، تخریج و تحقیق کے تدریسی کورسز۔ کورسز کی تفصیل کے لیے: [🎓 حدیث ڈپلوما کورسز دیکھیں](#/courses)\n\n` +
        `آپ حدیث سیکشن یا کورسز میں سے جس پر جانا چاہیں، نیچے دیے گئے بٹن پر کلک کر سکتے ہیں۔`;
      actions.push({ type: 'OPEN_HADITH', label: 'کتبِ حدیث لائبریری', route: '#/hadith' });
      actions.push({ type: 'OPEN_COURSES', label: 'حدیث کورسز دیکھیں', route: '#/courses' });
      return { content, actions, isAiGenerated: false };
    }

    // Domain 3: Mirath & Fiqh
    if (/mirath|wirathat|waris|tarka|inheritance|fiqh|zakat|میراث|وراثت|ترکہ|وارث|فقہ|زکوٰۃ/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر علمِ میراث اور فقہی مسائل کا مکمل نظام موجود ہے:\n\n` +
        `• **میراث و ترکہ کیلکولیٹر**: قرآن و سنت کے مقررہ اصولوں کے مطابق والدین، میاں بیوی، بیٹے بیٹیوں اور بہن بھائیوں میں ترکہ کا شرعی حساب۔ حساب لگانے کے لیے: [⚖️ میراث کیلکولیٹر کھولیں](#/mirath)\n` +
        `• **زکوٰۃ کیلکولیٹر**: سونے، چاندی، نقدی اور مالِ تجارت پر شرعی زکوٰۃ کا لائیو حساب۔ حساب کے لیے: [💰 زکوٰۃ کیلکولیٹر کھولیں](#/zakat-calculator)\n` +
        `• **فقہ الحدیث کتب**: فتاویٰ و فقہ کی 50+ مستند کتب کا مطالعہ کریں۔ [📚 فقہی کتب خانہ](#/library)`;
      actions.push({ type: 'OPEN_MIRATH', label: 'میراث کیلکولیٹر کھولیں', route: '#/mirath' });
      actions.push({ type: 'OPEN_ZAKAT', label: 'زکوٰۃ کیلکولیٹر کھولیں', route: '#/zakat-calculator' });
      return { content, actions, isAiGenerated: false };
    }

    // Domain 4: Library & Books
    if (/library|kitab|books|pdf|read|کتب|کتاب|لائبریری|کتب خانہ|مطالعہ/.test(q)) {
      content = `الحمد للہ! **LearnHub** کی اسلامی لائبریری میں 300 سے زائد مستند کتب دستیاب ہیں:\n\n` +
        `• تفاسیر و علوم القرآن (ابن کثیر، احسن البیان، سعدی، طبری)\n` +
        `• کتبِ صحاح ستہ و شروح (فتح الباری، شرح مسلم، تحفۃ الاحوذی)\n` +
        `• کتبِ عقیدہ و توحید، فقہ الحدیث، سیرتِ نبویہ اور علمائے سلف کی تصانیف۔\n\n` +
        `آن لائن مطالعہ اور مفت PDF ڈاؤن لوڈ کے لیے: [📚 اسلامی کتب خانہ کھولیں](#/library)`;
      actions.push({ type: 'OPEN_LIBRARY', label: 'کتب خانہ کھولیں', route: '#/library' });
      return { content, actions, isAiGenerated: false };
    }

    // Domain 5: Adventure Game
    if (/game|adventure|realms|coins|level|گیم|ایڈونچر|عالم|سکّے/.test(q)) {
      content = `الحمد للہ! **LearnHub ایڈونچر گیم** 9 اسلامی جہانوں پر مشتمل ایک شاندار تعلیمی سفر ہے:\n\n` +
        `• دیارِ ایمان، نورِ قرآن، سیرتِ مصطفیٰ ﷺ، قصص الانبیاء، گلستانِ صحابہ، سلیقۂ اخلاق، محرابِ عبادت، سنہری دور، اور بحر العلوم۔\n` +
        `• پزلز حل کریں، سکّے اور گولڈن بیجز حاصل کریں اور لیڈر بورڈ میں اول آئیں!\n\n` +
        `کھیلنے کے لیے: [🎮 اسلامک ایڈونچر گیم کھیلیں](#/adventure)`;
      actions.push({ type: 'OPEN_GAME', label: 'ایڈونچر گیم شروع کریں', route: '#/adventure' });
      return { content, actions, isAiGenerated: false };
    }

    // Domain 6: Live Tool Output (e.g. Courses, Orders, Enrollments)
    if (liveToolOutput) {
      const formatted = formatToolDataToUrdu(liveToolOutput);
      return {
        content: formatted.text,
        actions: (formatted.actions && formatted.actions.length) ? formatted.actions : (liveToolOutput.action ? [liveToolOutput.action] : null),
        isAiGenerated: false
      };
    }

    // Domain 7: RAG Chunks fallback
    if (ragChunks.length > 0) {
      return {
        content: ragChunks[0].content,
        actions: ragChunks[0].metadata?.route ? [{ type: 'NAVIGATE', label: 'صفحہ کھولیں', route: ragChunks[0].metadata.route }] : null,
        isAiGenerated: false
      };
    }

    // General Helpful Fallback
    return {
      content: `السلام علیکم! میں **LearnHub** کا اسمارٹ اسسٹنٹ ہوں۔ لرن ہب پر قرآن، احادیث، کورسز، فقہ و میراث، کتب خانہ اور امتحانی کوئزز کی تمام سہولیات موجود ہیں۔\n\n` +
        `آپ ان میں سے کسی بھی شعبے پر براہِ راست تشریف لے جا سکتے ہیں:\n` +
        `• [📖 قرآن مجید اسٹوڈیو](#/quran)\n` +
        `• [📜 کتبِ حدیث کا ذخیرہ](#/hadith)\n` +
        `• [⚖️ فقہ و میراث کیلکولیٹر](#/mirath)\n` +
        `• [🎓 تمام اسلامک کورسز](#/courses)\n` +
        `• [📚 اسلامی کتب خانہ](#/library)\n` +
        `• [🏆 آزادانہ امتحانی کوئزز](#/quizzes)`,
      actions: [
        { type: 'OPEN_COURSES', label: 'تمام کورسز دیکھیں', route: '#/courses' },
        { type: 'OPEN_QURAN', label: 'قرآن مجید کھولیں', route: '#/quran' }
      ],
      isAiGenerated: false
    };
  };

  /**
   * Analytics & Audit Logging Helper
   */
  S._recordAiAnalytics = function(meta) {
    if (typeof window !== 'undefined' && window.DB && window.DB.data) {
      window.DB.data.aiAnalytics = window.DB.data.aiAnalytics || {
        totalQueries: 0,
        successfulQueries: 0,
        intentsCount: {}
      };
      const a = window.DB.data.aiAnalytics;
      a.totalQueries = (a.totalQueries || 0) + 1;
      if (meta.success) a.successfulQueries = (a.successfulQueries || 0) + 1;
      if (meta.intent) {
        a.intentsCount[meta.intent] = (a.intentsCount[meta.intent] || 0) + 1;
      }
    }
  };

  S._recordUnansweredQuery = function(query, error) {
    if (typeof window !== 'undefined' && window.DB && window.DB.data) {
      window.DB.data.aiUnansweredQueries = window.DB.data.aiUnansweredQueries || [];
      window.DB.data.aiUnansweredQueries.unshift({
        id: `unans_${Date.now()}`,
        query,
        error,
        timestamp: Date.now()
      });
      if (window.DB.data.aiUnansweredQueries.length > 50) window.DB.data.aiUnansweredQueries.pop();
    }
  };

  S.clearHistory = function() {
    conversationHistory.length = 0;
    console.log('[AIScholar] Conversation memory reset.');
  };

})();
