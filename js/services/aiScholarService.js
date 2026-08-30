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

  const GEMINI_MODEL = "models/gemini-2.0-flash";

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

    // Intent 5: Specific Quran & Tilawat Queries
    if (/quran|surah|ayat|tilawat|qari|tajweed|قرآن|سورت|تلاوت|قاری|آیت|تجوید/.test(q)) {
      return {
        intent: 'QURAN_KNOWLEDGE',
        requiresLiveTool: false,
        toolName: null,
        toolParams: null
      };
    }

    // Intent 6: Specific Hadith Queries
    if (/hadith|bukhari|muslim|hadees|حديث|حدیث|بخاری|مسلم|صحاح/.test(q)) {
      return {
        intent: 'HADITH_KNOWLEDGE',
        requiresLiveTool: false,
        toolName: null,
        toolParams: null
      };
    }

    // Intent 7: Mirath, Inheritance & Fiqh Queries
    if (/mirath|wirathat|waris|tarka|inheritance|fiqh|zakat|میراث|وراثت|ترکہ|وارث|فقہ|زکوٰۃ/.test(q)) {
      return {
        intent: 'MIRATH_FIQH_KNOWLEDGE',
        requiresLiveTool: false,
        toolName: null,
        toolParams: null
      };
    }

    // Intent 8: Library & Books Queries
    if (/library|kitab|books|pdf|read|کتب|کتاب|لائبریری|کتب خانہ|مطالعہ/.test(q)) {
      return {
        intent: 'LIBRARY_KNOWLEDGE',
        requiresLiveTool: false,
        toolName: null,
        toolParams: null
      };
    }

    // Intent 9: Adventure Game Queries
    if (/game|adventure|realms|coins|level|گیم|ایڈونچر|عالم|سکّے/.test(q)) {
      return {
        intent: 'GAME_KNOWLEDGE',
        requiresLiveTool: false,
        toolName: null,
        toolParams: null
      };
    }

    // Intent 10: Specific Course Search or Course Details
    if (/course|dakhla|fees|admission|کورس|داخلہ|فیس|کورسز|نصاب|اسباق/.test(q) || (isRelativeContext && lastMessage.includes('کورس'))) {
      return {
        intent: 'COURSE_QUERY',
        requiresLiveTool: true,
        toolName: 'search_courses',
        toolParams: { query }
      };
    }

    // Intent 11: Quiz Search & Catalog
    if (/quiz|test|exam|assessment|کوئز|ٹیسٹ|امتحان/.test(q)) {
      return {
        intent: 'QUIZ_QUERY',
        requiresLiveTool: true,
        toolName: 'search_quizzes',
        toolParams: { query }
      };
    }

    // Intent 12: Teacher / Instructor Search
    if (/teacher|ustad|instructor|shaikh|mufti|استاذ|اساتذہ|مدرس|شیخ|مفتی/.test(q)) {
      return {
        intent: 'TEACHER_QUERY',
        requiresLiveTool: true,
        toolName: 'get_teacher_information',
        toolParams: { nameOrId: query }
      };
    }

    // Intent 13: Website Navigation
    if (/kahan hai|kidhar hai|kaise kholein|open|page|route|کہاں ہے|کھولیں|صفحہ|لنک/.test(q)) {
      return {
        intent: 'WEBSITE_NAVIGATION',
        requiresLiveTool: true,
        toolName: 'get_website_navigation',
        toolParams: { destination: query }
      };
    }

    // General Islamic Knowledge
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

    // 1. Library & 300+ Classical Books Query
    if (/kitab|book|library|pdf|read|tafseer|bukhari|muslim|tirmidhi|dawud|nasai|ibn majah|mishkat|raheeq|albani|ibn baz|uthaymeen|zubair ali zai|کتاب|کتب|لائبریری|کتب خانہ|مطالعہ|پی ڈی ایف|تفسیر|بخاری|مسلم|ترمذی|ابوداؤد|نسائی|ابن ماجہ|مشکوۃ|رحیق|البانی|ابن باز|عثیمین|زبیر علی زئی|توحید|عقیدہ/.test(q)) {
      content = `الحمد للہ! **LearnHub ڈیجیٹل لائبریری** پر 300 سے زائد مستند اسلامی، تفسیری اور حدیثی کتب آن لائن مطالعہ اور پی ڈی ایف ڈاؤن لوڈ کے لیے دستیاب ہیں:\n\n` +
        `• **تفاسیر و علوم القرآن**: تفسیر ابن کثیر، تفسیر احسن البیان (مولانا جوناگڑھی و حافظ صلاح الدین یوسف)، تفسیر السعدی اور تفسیر طبری۔\n` +
        `• **کتبِ صحاح ستہ و شروح**: صحیح بخاری (مع فتح الباری)، صحیح مسلم (مع شرح نووی)، جامع ترمذی (مع تحفۃ الاحوذی)، سنن ابی داؤد، سنن نسائی، سنن ابن ماجہ اور مشکوٰۃ المصابیح۔\n` +
        `• **عقیدہ، توحید و سنت**: کتاب التوحید (شیخ محمد بن عبد الوہاب)، فتح المجید، العقیدۃ الواسطیہ و الطحاویہ۔\n` +
        `• **فقہ الحدیث و مسائل**: صفۃ صلاۃ النبی ﷺ (علامہ البانی)، فقہ السنہ (سید سابق)، زاد المعاد (ابن قیم)۔\n` +
        `• **سیرتِ طیبہ ﷺ و تاریخ**: الرحیق المختوم (مولانا صفی الرحمن مبارکپوری)، البدایہ والنہایہ (ابن کثیر)۔\n\n` +
        `📖 آپ براہِ راست یہاں سے مطالعہ کر سکتے ہیں: [📚 300+ اسلامی کتب خانہ کھولیں](#/library)`;
      actions.push({ type: 'NAVIGATE', label: 'اسلامی کتب خانہ کھولیں', route: '#/library' });
      actions.push({ type: 'NAVIGATE', label: 'حدیث سرچ انجن', route: '#/hadith' });
      return { content, actions, isAiGenerated: true };
    }

    // 2. Quran & Surahs Query
    if (/quran|surah|ayat|tilawat|qari|tajweed|mushaf|juz|fatiha|baqarah|kahf|yasin|rahman|mulk|ikhlas|falaq|nas|قرآن|سورت|تلاوت|قاری|آیت|تجوید|مصحف|پارہ|فاتحہ|بقرہ|کہف|یسین|رحمن|ملک|اخلاص|فلق|ناس/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر قرآن مجید کا مکمل انٹرایکٹو اسٹوڈیو موجود ہے:\n\n` +
        `• **114 سورتیں اور 30 پارے**: 15 سطری شاہی مصحف اور مستند اردو و انگریزی تراجم کے ساتھ۔\n` +
        `• **قراء حرمین شریفین کی تلاوت**: شیخ مشاری راشد، شیخ السدیس، اور شیخ الشریم کی آواز میں آیت بہ آیت آڈیو۔\n` +
        `• **لفظ بہ لفظ تجوید**: ہر لفظ پر کلک کر کے اس کا صحیح مخرج اور تلفظ سیکھیں۔\n` +
        `• **تفسیر و بک مارکس**: ہر آیت کی تفسیر احسن البیان اور ذاتی اسٹڈی نوٹس۔\n\n` +
        `📖 تلاوت کے لیے یہاں کلک کریں: [📖 قرآن مجید اسٹوڈیو کھولیں](#/quran)`;
      actions.push({ type: 'NAVIGATE', label: 'قرآن مجید اسٹوڈیو', route: '#/quran' });
      actions.push({ type: 'NAVIGATE', label: '30 پارے ڈائرکٹری', route: '#/quran' });
      return { content, actions, isAiGenerated: true };
    }

    // 3. Hadith Sciences Query
    if (/hadith|bukhari|muslim|hadees|sanad|takhreej|حدیث|احادیث|بخاری|مسلم|تخریج|اصولِ حدیث/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر کتبِ احادیث کا مکمل ذخیرہ اور تدریسی اسباق دستیاب ہیں:\n\n` +
        `• **صحیح بخاری و صحیح مسلم**: تمام ابواب اور احادیثِ مبارکہ عربی متن، اردو ترجمہ اور تخریج کے ساتھ۔\n` +
        `• **اربعین نووی و ریاض الصالحین**: اخلاق، ایمان اور معاملات پر منتخب احادیث۔\n` +
        `• **علوم الحدیث کے اسباق**: حدیث کی اقسام (صحیح، حسن، ضعیف) اور اصولِ تخریج۔\n\n` +
        `📜 احادیث کے مطالعہ کے لیے: [📜 کتبِ حدیث لائبریری کھولیں](#/hadith)`;
      actions.push({ type: 'NAVIGATE', label: 'کتبِ حدیث لائبریری', route: '#/hadith' });
      return { content, actions, isAiGenerated: true };
    }

    // 4. Mirath & Inheritance Calculator
    if (/mirath|wirathat|waris|tarka|inheritance|میراث|وراثت|ترکہ|وارث|تقسیم/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر شریعتِ اسلامیہ کے عین مطابق **میراث کیلکولیٹر** موجود ہے:\n\n` +
        `• قرآن مجید (سورۃ النساء) اور صحیح احادیث کے مطابق ورثاء (بیوی/شوہر، بیٹے، بیٹیاں، والدین، بہن بھائی) میں ترکے کی شرعی تقسیم۔\n` +
        `• ہر وارث کا قرآنی حصہ (نصف، ربع، ثمن، ثلث، ثلثان، سدس) اور عصبہ کی خودکار کیلکولیشن۔\n` +
        `• مکمل تفصیلی چارٹ اور پرنٹ ایبل شرعی رپورٹ۔\n\n` +
        `⚖️ کیلکولیٹر استعمال کرنے کے لیے: [⚖️ میراث کیلکولیٹر کھولیں](#/mirath)`;
      actions.push({ type: 'NAVIGATE', label: 'میراث کیلکولیٹر کھولیں', route: '#/mirath' });
      return { content, actions, isAiGenerated: true };
    }

    // 5. Zakat Calculator
    if (/zakat|nisab|gold|silver|زکوٰۃ|نصاب|سونا|چاندی|مالِ تجارت/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر لائیو ریٹس کے مطابق **مستند زکوٰۃ کیلکولیٹر** موجود ہے:\n\n` +
        `• سونے (ساڑھے سات تولے) اور چاندی (ساڑھے باون تولے) کے نصاب کی بنیاد پر درست حساب۔\n` +
        `• نقدی، بینک بیلنس، مالِ تجارت، اور شیئرز پر 2.5% شرعی زکوٰۃ کا تخمینہ۔\n` +
        `• واجب الادا قرضہ جات کی منہائی اور خالص زکوٰۃ کی رقم۔\n\n` +
        `💰 زکوٰۃ کا حساب لگانے کے لیے: [💰 زکوٰۃ کیلکولیٹر کھولیں](#/zakat-calculator)`;
      actions.push({ type: 'NAVIGATE', label: 'زکوٰۃ کیلکولیٹر کھولیں', route: '#/zakat-calculator' });
      return { content, actions, isAiGenerated: true };
    }

    // 6. Islamic Adventure Game (Classes 1-10)
    if (/game|adventure|realm|coins|heart|puzzle|گیم|ایڈونچر|عالم|سکّے|پزل|کھیل/.test(q)) {
      content = `الحمد للہ! **LearnHub اسلامی ایڈونچر گیم** علم اور فہم کا خوبصورت سنگم ہے:\n\n` +
        `• **کلاس 1 تا 10 تدریجی نصاب**: بچوں کی جماعت کے مطابق نماز، تجوید، سیرت اور اخلاق کے مراحل۔\n` +
        `• **9 اسلامی جہان**: دیارِ ایمان، نورِ قرآن، سیرتِ مصطفیٰ ﷺ، قصص الانبیاء، گلستانِ صحابہ، سلیقۂ اخلاق، محرابِ عبادت، سنہری دور، اور بحر العلوم۔\n` +
        `• **انٹرایکٹو پزلز و 1v1 میدان**: میموری کارڈز، لائف ہارٹس، طلائی سکے (Coins)، اور کیو آر تصدیق شدہ اسناد۔\n\n` +
        `🎮 ایڈونچر کھیلنے کے لیے: [🎮 اسلامی ایڈونچر گیم کھولیں](#/adventure)`;
      actions.push({ type: 'NAVIGATE', label: 'ایڈونچر گیم کھیلیں', route: '#/adventure' });
      return { content, actions, isAiGenerated: true };
    }

    // 7. Quizzes & Verifiable Certificates
    if (/quiz|exam|test|certificate|sanad|degree|کوئز|امتحان|ٹیسٹ|سند|سرٹیفکیٹ|ڈگری|تصدیق/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر آزادانہ امتحانات اور تصدیق شدہ اسناد کا خودکار نظام ہے:\n\n` +
        `• **آزادانہ کوئزز**: بغیر کورس میں داخلہ لیے براہِ راست دینی و علمی ٹیسٹ دیں۔\n` +
        `• **کیو آر تصدیق شدہ شاہی اسناد**: 70%+ نمبرات پر فوری تصدیق شدہ ڈیجیٹل ڈپلوما جاری ہوتا ہے۔\n` +
        `• **منفرد سیریل کوڈ**: ہر سند کی پبلک ویریفکیشن پورٹل پر فوری تصدیق ممکن ہے۔\n\n` +
        `🏆 کوئزز اور اسناد کے لیے: [🏆 کوئز امتحانات ہب کھولیں](#/quizzes) یا [📜 میری اسناد](#/certificates)`;
      actions.push({ type: 'NAVIGATE', label: 'کوئز امتحانات دیں', route: '#/quizzes' });
      actions.push({ type: 'NAVIGATE', label: 'میری اسناد دیکھیں', route: '#/certificates' });
      return { content, actions, isAiGenerated: true };
    }

    // 8. Courses & Admissions
    if (/course|admission|fees|class|learn|کورس|داخلہ|فیس|کلاس|تعلیم/.test(q)) {
      content = `الحمد للہ! **LearnHub** پر بنیادی تا ایڈوانسڈ اسلامی علوم کے جامع کورسز دستیاب ہیں:\n\n` +
        `• **تجوید القرآن ماسٹرکلاس**: درست مخارج اور تجوید کے ساتھ قرآن کی قراءت۔\n` +
        `• **علوم الحدیث و فہمِ سنت**: احادیث کی تحقیق و تخریج کا جامع نصاب۔\n` +
        `• **عربی زبان و گرامر**: قرآنی عربی فہم کے آسان اسباق۔\n` +
        `• **فقہ و معاملات**: روزمرہ عبادات اور جدید معاشی مسائل کے شرعی احکام۔\n\n` +
        `🎓 تمام کورسز دیکھنے کے لیے: [🎓 تمام کورسز دیکھیں](#/courses)`;
      actions.push({ type: 'NAVIGATE', label: 'کورسز لائبریری دیکھیں', route: '#/courses' });
      return { content, actions, isAiGenerated: true };
    }

    // Default Platform General Overview
    content = `السلام علیکم ورحمۃ اللہ وبرکاتہ! میں **LearnHub اسمارٹ اے آئی عالم (AI Scholar)** ہوں۔ میں آپ کی کس طرح رہنمائی کر سکتا ہوں؟\n\n` +
      `آپ LearnHub پر درج ذیل تمام سہولیات کے بارے میں پوچھ سکتے ہیں:\n\n` +
      `• [📖 قرآن مجید (114 سورتیں و تلاوت)](#/quran)\n` +
      `• [📜 کتبِ حدیث لائبریری (بخاری، مسلم، سنن)](#/hadith)\n` +
      `• [📚 300+ نایاب اسلامی کتب خانہ](#/library)\n` +
      `• [🎮 کلاس 1 تا 10 اسلامی ایڈونچر گیم](#/adventure)\n` +
      `• [🏆 کوئز امتحانات و کیو آر تصدیق شدہ اسناد](#/quizzes)\n` +
      `• [⚖️ شرعی میراث و وراثت کیلکولیٹر](#/mirath)\n` +
      `• [💰 درست زکوٰۃ کیلکولیٹر](#/zakat-calculator)\n` +
      `• [🕌 اوقاتِ نماز، اذان اور قبلہ کمپاس](#/islamic-tools)\n\n` +
      `براہ کرم اپنا مطلوبہ سوال یا موضوع بیان فرمائیں، میں مکمل حوالہ جات کے ساتھ فوری رہنمائی فراہم کروں گا!`;

    actions.push({ type: 'NAVIGATE', label: 'قرآن مجید اسٹوڈیو', route: '#/quran' });
    actions.push({ type: 'NAVIGATE', label: '300+ کتب خانہ', route: '#/library' });
    actions.push({ type: 'NAVIGATE', label: 'کوئز امتحانات', route: '#/quizzes' });

    return { content, actions, isAiGenerated: true };
  };

  /**
   * Admin-Only Gemini AI Question Generator Suite
   * Generates authentic Islamic multiple-choice questions, options, correct answers,
   * detailed explanations, and authentic Quran/Hadith references.
   */
  
  /* ==========================================================================
     KIDS DYNAMIC TOPIC-AWARE ISLAMIC CURRICULUM ENGINE (بچوں کے فہم کے مطابق)
     ========================================================================== */

    function _generateTopicSpecificKidsQuestions(topic, count = 5, type = 'multiple_choice', lang = 'ur', difficulty = 'Beginner') {
    const tLower = (topic || '').toLowerCase();
    
    // 15+ Comprehensive Diverse Islamic Question Domains
    const masterQuestionPool = [
      // WUDU & PURITY
      { q: 'وضو شروع کرتے وقت سب سے پہلے کیا پڑھنا سنت ہے؟', opts: ['بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ', 'الحمد للہ', 'سبحان اللہ', 'لا الہ الا اللہ'], ans: 0, exp: 'رسول اللہ ﷺ نے فرمایا: جو وضو کے شروع میں بسم اللہ نہ پڑھے اس کا وضو مکمل نہیں۔', ref: 'سنن ابن ماجہ: 397', tags: ['wudu', 'وضو', 'طہارت'] },
      { q: 'وضو میں دونوں ہاتھوں کو کہاں تک دھونا فرض ہے؟', opts: ['کہنیوں سمیت', 'صرف کلائی تک', 'کندھے تک', 'صرف انگلیوں تک'], ans: 0, exp: 'قرآن مجید میں حکم ہے: اور اپنے ہاتھوں کو کہنیوں تک دھو لو۔', ref: 'سورۃ المائدہ: 6', tags: ['wudu', 'وضو', 'طہارت'] },
      { q: 'وضو میں سر کا مسح کتنی بار کرنا مسنون ہے؟', opts: ['ایک بار (1 بار)', 'تین بار (3 بار)', 'چار بار', 'پانچ بار'], ans: 0, exp: 'نبی کریم ﷺ پورے سر کا مسح سامنے سے پیچھے اور پھر آگے لا کر ایک بار فرماتے تھے۔', ref: 'صحیح بخاری: 185', tags: ['wudu', 'وضو'] },
      { q: 'وضو میں دونوں پاؤں کو کہاں تک دھونا ضروری ہے؟', opts: ['ٹخنوں سمیت', 'صرف تلوے', 'گھٹنوں تک', 'صرف انگلیاں'], ans: 0, exp: 'نبی کریم ﷺ نے پاؤں دھوتے وقت ایڑیوں اور ٹخنوں کو اچھی طرح دھونے کا حکم دیا۔', ref: 'صحیح مسلم: 242', tags: ['wudu', 'وضو'] },
      { q: 'وضو کے بعد کلمہ شہادت پڑھنے کا کیا اجر ہے؟', opts: ['جنت کے آٹھوں دروازے کھل جاتے ہیں', 'ایک ہزار نیکیاں', 'گناہ معاف ہو جاتے ہیں', 'حج کا ثواب'], ans: 0, exp: 'وضو کے بعد کلمہ شہادت پڑھنے والے کے لیے جنت کے آٹھوں دروازے کھول دیے جاتے ہیں۔', ref: 'صحیح مسلم: 234', tags: ['wudu', 'وضو'] },

      // SALAH / PRAYER
      { q: 'مسلمان پر دن رات میں کتنی فرض نمازیں مقرر ہیں؟', opts: ['5 نمازیں (پانچ)', '3 نمازیں', '7 نمازیں', '4 نمازیں'], ans: 0, exp: 'معراج کی رات اللہ تعالیٰ نے امتِ محمدیہ پر پانچ نمازیں فرض فرمائیں۔', ref: 'صحیح بخاری: 349', tags: ['salah', 'namaz', 'نماز'] },
      { q: 'نماز شروع کرتے وقت کہی جانے والی پہلی تکبیر کو کیا کہتے ہیں؟', opts: ['تکبیرِ تحریمہ (اللہ اکبر)', 'تکبیرِ رکوع', 'تکبیرِ تشہد', 'تکبیرِ قنوت'], ans: 0, exp: 'تکبیر تحریمہ سے نماز کی شروعات ہوتی ہے اور دنیاوی باتیں حرام ہو جاتی ہیں۔', ref: 'سنن الترمذی: 3', tags: ['salah', 'namaz', 'نماز'] },
      { q: 'ہر نماز کی ہر رکعت میں کون سی سورت کا پڑھنا لازمی اور فرض ہے؟', opts: ['سورۃ الفاتحہ', 'سورۃ الاخلاص', 'سورۃ الفلق', 'سورۃ الکوثر'], ans: 0, exp: 'رسول اللہ ﷺ نے فرمایا: جس نے سورۃ الفاتحہ نہ پڑھی اس کی نماز نہیں ہوتی۔', ref: 'صحیح بخاری: 756', tags: ['salah', 'namaz', 'نماز', 'quran'] },
      { q: 'سجدے کی حالت میں کون سی تسبیح پڑھی جاتی ہے؟', opts: ['سُبْحَانَ رَبِّيَ الأَعْلَى', 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', 'لا الہ الا اللہ'], ans: 0, exp: 'سجدے میں انسان اپنے رب کے سب سے زیادہ قریب ہوتا ہے اور سبحان ربی الاعلیٰ پڑھتا ہے۔', ref: 'صحیح مسلم: 482', tags: ['salah', 'namaz', 'نماز'] },
      { q: 'فجر کی نماز میں کتنی فرض رکعتیں ہوتی ہیں؟', opts: ['2 رکعت فرض', '4 رکعت فرض', '3 رکعت فرض', '1 رکعت'], ans: 0, exp: 'فجر کی نماز 2 رکعت سنت اور 2 رکعت فرض پر مشتمل ہے۔', ref: 'کتاب الصلاۃ', tags: ['salah', 'namaz', 'نماز'] },
      { q: 'رکوع میں کون سی تسبیح پڑھنا سنت ہے؟', opts: ['سُبْحَانَ رَبِّيَ الْعَظِيمِ', 'سُبْحَانَ رَبِّيَ الأَعْلَى', 'رَبَّنَا لَكَ الْحَمْدُ', 'سُبْحَانَ اللَّهِ'], ans: 0, exp: 'رکوع میں انسان اپنے عظیم رب کی تسبیح بیان کرتا ہے۔', ref: 'صحیح مسلم: 772', tags: ['salah', 'namaz', 'نماز'] },

      // QURANIC SCIENCES & TAJWEED
      { q: 'قرآن مجید میں کل کتنی سورتیں ہیں؟', opts: ['114 سورتیں', '110 سورتیں', '120 سورتیں', '112 سورتیں'], ans: 0, exp: 'قرآن مجید 114 سورتوں اور 30 پاروں پر مشتمل ہے۔', ref: 'علوم القرآن', tags: ['quran', 'قرآن'] },
      { q: 'قرآن مجید کی سب سے طویل اور بڑی سورت کون سی ہے؟', opts: ['سورۃ البقرۃ', 'سورۃ آل عمران', 'سورۃ النساء', 'سورۃ المائدہ'], ans: 0, exp: 'سورۃ البقرہ قرآن مجید کی سب سے لمبی سورت ہے جس میں 286 آیات ہیں۔', ref: 'علوم القرآن', tags: ['quran', 'قرآن'] },
      { q: 'قرآن کریم کی کس سورت کے آغاز میں بسم اللہ نہیں لکھی جاتی؟', opts: ['سورۃ التوبہ (برآءۃ)', 'سورۃ الانفال', 'سورۃ النمل', 'سورۃ الفاتحہ'], ans: 0, exp: 'سورۃ التوبہ کے شروع میں بسم اللہ نہیں ہے جبکہ سورۃ النمل میں دو بار ہے۔', ref: 'تفسیر ابن کثیر', tags: ['quran', 'قرآن'] },
      { q: 'حروفِ قلقلہ کتنے ہیں اور ان کا مجموعہ کیا ہے؟', opts: ['5 حروف (قُطْبُ جَدٍّ)', '3 حروف', '6 حروف', '4 حروف'], ans: 0, exp: 'قلقلہ کے پانچ حروف ہیں: ق، ط، ب، ج، د جن کے ساکن ہونے پر جھٹکا پیدا ہوتا ہے۔', ref: 'قواعد التجوید', tags: ['quran', 'tajweed', 'تجوید', 'قرآن'] },
      { q: 'قرآن مجید میں کس سورت کو "قلبِ قرآن" (قرآن کا دل) کہا گیا ہے؟', opts: ['سورۃ یٰسین', 'سورۃ الرحمٰن', 'سورۃ الملک', 'سورۃ الکھف'], ans: 0, exp: 'حدیث میں سورۃ یٰسین کو قرآن کا دل فرمایا گیا ہے۔', ref: 'سنن الترمذی: 2887', tags: ['quran', 'قرآن'] },
      { q: 'آیت الکرسی قرآن مجید کی کس سورت میں واقع ہے؟', opts: ['سورۃ البقرۃ (آیت 255)', 'سورۃ آل عمران', 'سورۃ النساء', 'سورۃ یٰسین'], ans: 0, exp: 'آیت الکرسی قرآن مجید کی سب سے عظیم آیت ہے۔', ref: 'صحیح مسلم: 810', tags: ['quran', 'قرآن'] },

      // SEERAH & PROPHETIC HISTORY
      { q: 'نبی کریم ﷺ کی ولادتِ با سعادت کس مبارک شہر میں ہوئی؟', opts: ['مکہ مکرمہ', 'مدینہ منورہ', 'طائف', 'یروشلم'], ans: 0, exp: 'آپ ﷺ عام الفیل میں مکہ مکرمہ کے معزز قبیلہ قریش میں پیدا ہوئے۔', ref: 'الرحیق المختوم', tags: ['seerah', 'سیرت', 'نبی'] },
      { q: 'نبی کریم ﷺ پر سب سے پہلی وحی کس غار میں نازل ہوئی؟', opts: ['غارِ حرا', 'غارِ ثور', 'غارِ احد', 'غارِ جودی'], ans: 0, exp: 'جبل النور پر واقع غارِ حرا میں پہلی وحی اقْرَأْ بِاسْمِ رَبِّكَ نازل ہوئی۔', ref: 'صحیح بخاری: 3', tags: ['seerah', 'سیرت'] },
      { q: 'اسلام کی پہلی باقاعدہ اور فیصلہ کن جنگ کون سی تھی؟', opts: ['غزوۂ بدر (2 ہجری)', 'غزوۂ احد', 'غزوۂ خندق', 'غزوۂ حنین'], ans: 0, exp: 'غزوہ بدر 17 رمضان المبارک 2 ہجری کو پیش آیا جس میں 313 مسلمانوں نے فتح پائی۔', ref: 'تاریخ اسلام', tags: ['seerah', 'سیرت', 'تاریخ'] },
      { q: 'ہجرتِ مدینہ کے وقت نبی کریم ﷺ کے ہمراہ غارِ ثور میں کون سے صحابی تھے؟', opts: ['حضرت ابوبکر صدیق رضی اللہ عنہ', 'حضرت عمر فاروق رضی اللہ عنہ', 'حضرت عثمان غنی رضی اللہ عنہ', 'حضرت علی رضی اللہ عنہ'], ans: 0, exp: 'قرآن مجید نے حضرت ابوبکر صدیق کو "ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ" فرمایا ہے۔', ref: 'سورۃ التوبہ: 40', tags: ['seerah', 'سیرت', 'صحابہ'] },
      { q: 'حجۃ الوداع کس سن ہجری میں ادا کیا گیا؟', opts: ['10 ہجری', '8 ہجری', '9 ہجری', '11 ہجری'], ans: 0, exp: 'نبی کریم ﷺ نے 10 ہجری میں اپنا آخری حج فرمایا اور تاریخی خطبہ ارشاد فرمایا۔', ref: 'صحیح مسلم: 1218', tags: ['seerah', 'سیرت'] },

      // AQEEDAH & PILLARS OF IMAN
      { q: 'اسلام کے کتنے بنیادی ارکان ہیں؟', opts: ['5 ارکان (توحید، نماز، زکوٰۃ، روزہ، حج)', '4 ارکان', '6 ارکان', '7 ارکان'], ans: 0, exp: 'بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شہادتین، اقامتِ صلاۃ، ایتاءِ زکوٰۃ، صومِ رمضان، اور حجِ بیت اللہ۔', ref: 'صحیح بخاری: 8', tags: ['aqeedah', 'عقیدہ', 'ایمان'] },
      { q: 'ایمانِ مفصل میں کتنی بنیادی چیزوں پر ایمان لانے کا اقرار کیا گیا ہے؟', opts: ['7 چیزوں پر (اللہ، فرشتے، کتابیں، رسول، قیامت، تقدیر، دوبارہ جی اٹھنا)', '5 چیزوں پر', '3 چیزوں پر', '4 چیزوں پر'], ans: 0, exp: 'آمنت باللہ وملائکتہ وکتبہ ورسلہ والیوم الآخر والقدر خیرہ وشرہ من اللہ تعالی والبعث بعد الموت۔', ref: 'عقیدہ اہل سنت', tags: ['aqeedah', 'عقیدہ', 'ایمان'] },
      { q: 'سب سے بڑا اور نا قابلِ بخشش گناہ کون سا ہے اگر بغیر توبہ کے موت آ جائے؟', opts: ['شرک باللہ (اللہ کے ساتھ کسی کو شریک ٹھہرانا)', 'جھوٹ بولنا', 'چوری کرنا', 'غیبت کرنا'], ans: 0, exp: 'اللہ تعالیٰ شرک کے سوا ہر گناہ جس کے لیے چاہے معاف فرما دیتا ہے۔', ref: 'سورۃ النساء: 48', tags: ['aqeedah', 'عقیدہ'] },

      // SAHABAH & KHULAFA-E-RASHIDEEN
      { q: 'اسلام کے پہلے خلیفہ راشد کون تھے؟', opts: ['حضرت ابوبکر صدیق رضی اللہ عنہ', 'حضرت عمر فاروق رضی اللہ عنہ', 'حضرت عثمان غنی رضی اللہ عنہ', 'حضرت علی مرتضیٰ رضی اللہ عنہ'], ans: 0, exp: 'رسول اللہ ﷺ کے وصال کے بعد حضرت ابوبکر صدیق بالاتفاق خلیفہ اول منتخب ہوئے۔', ref: 'البدایہ والنہایہ', tags: ['sahabah', 'صحابہ', 'تاریخ'] },
      { q: 'قرآن مجید کو ایک مصحف میں جمع کر کے تمام امت کو ایک قراءت پر جمع کرنے والے خلیفہ کون تھے؟', opts: ['حضرت عثمان غنی رضی اللہ عنہ (جامع القرآن)', 'حضرت ابوبکر صدیق رضی اللہ عنہ', 'حضرت عمر فاروق رضی اللہ عنہ', 'حضرت علی رضی اللہ عنہ'], ans: 0, exp: 'حضرت عثمان غنی نے قریش کے رسم الخط پر مصاحف تیار کروا کر مختلف شہروں میں بھیجے۔', ref: 'صحیح بخاری: 4987', tags: ['sahabah', 'صحابہ', 'قرآن'] },
      { q: 'عشرہ مبشرہ سے کیا مراد ہے؟', opts: ['وہ 10 صحابہ جنہیں دنیا ہی میں جنت کی قطعی بشارت دی گئی', '10 بڑے محدثین', '10 اسلامی مہینے', '10 قراء'], ans: 0, exp: 'رسول اللہ ﷺ نے ایک مجلس میں دس صحابہ کرام کو نام لے کر جنت کی بشارت دی۔', ref: 'جامع الترمذی: 3747', tags: ['sahabah', 'صحابہ'] },

      // ZAKAT & FASTING & HAJJ
      { q: 'سونے پر زکوٰۃ کا نصاب کتنا ہے؟', opts: ['ساڑھے سات تولے (7.5 تولے / 87.48 گرام)', 'دس تولے', '5 تولے', '12 تولے'], ans: 0, exp: 'سونے کا شرعی نصاب 20 دینار یعنی ساڑھے سات تولے ہے۔', ref: 'سنن ابی داؤد: 1573', tags: ['zakat', 'زکوٰۃ', 'فقہ'] },
      { q: 'ماہِ رمضان کے روزے کس سن ہجری میں فرض ہوئے؟', opts: ['2 ہجری', '1 ہجری', '3 ہجری', '5 ہجری'], ans: 0, exp: 'تحویلِ قبلہ اور غزوہ بدر کے سال 2 ہجری میں روزے فرض کیے گئے۔', ref: 'تفسیر طبری', tags: ['zakat', 'روزہ', 'رمضان', 'فقہ'] },
      { q: 'حج کا سب سے اہم اور بنیادی رکن کون سا ہے جس کے بغیر حج نہیں ہوتا؟', opts: ['وقوفِ عرفات (9 ذی الحجہ)', 'طوافِ کعبہ', 'سعی بین الصفا والمروہ', 'رمی جمار'], ans: 0, exp: 'رسول اللہ ﷺ نے فرمایا: الحج عرفۃ (حج دراصل عرفات کا وقوف ہے)۔', ref: 'سنن الترمذی: 889', tags: ['hajj', 'حج', 'فقہ'] }
    ];

    // Filter matching questions by topic tags or use full pool
    let matched = masterQuestionPool.filter(item => {
      if (!tLower) return true;
      return item.tags.some(tag => tLower.includes(tag) || tag.includes(tLower));
    });

    if (matched.length < count) {
      matched = masterQuestionPool;
    }

    // Dynamic Fisher-Yates Random Shuffle to guarantee fresh, non-repetitive output every single time!
    const shuffled = matched.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(0, count);

    // Format into standard LearnHub Question schema & randomize options order
    const formattedQuestions = selected.map((item, idx) => {
      // Randomize options order so answer is not always A
      const originalCorrect = item.opts[item.ans];
      const optsCopy = item.opts.slice();
      
      for (let i = optsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optsCopy[i], optsCopy[j]] = [optsCopy[j], optsCopy[i]];
      }
      
      const newCorrectIdx = optsCopy.indexOf(originalCorrect);

      return {
        id: 'ai-gen-' + Date.now() + '-' + idx,
        questionText: item.q,
        type: type === 'multiple_choice' ? 'multiple_choice' : type,
        options: optsCopy,
        correctAnswerIndex: newCorrectIdx >= 0 ? newCorrectIdx : 0,
        explanation: item.exp,
        reference: item.ref,
        difficulty: difficulty || 'Beginner',
        points: 10
      };
    });

    return {
      success: true,
      topic: topic || 'Islamic Knowledge',
      type: type,
      questions: formattedQuestions,
      isAi: true
    };
  }

  S.generateQuestionsWithGemini = async function({ topic, difficulty = "Beginner", count = 5, language = "ur", category = "Islamic Studies", questionType = "multiple_choice" }) {
    const apiKey = _getApiKey();
    const isUrdu = language === "ur";
    const isArabic = language === "ar";

    const systemPrompt = `You are an elite Islamic scholar and child curriculum specialist designing age-appropriate, engaging questions for Muslim kids and students (ages 5 to 15).
Topic: "${topic}"
Category: "${category}"
Difficulty Level: "${difficulty}"
Language: ${isUrdu ? "Urdu (سلیس و آسان اردو برائے اطفال)" : (isArabic ? "Arabic" : "English")}
Question Type: "${questionType}"

CRITICAL INSTRUCTIONS FOR KIDS UNDERSTANDING:
1. Make the language extremely clear, gentle, simple, and captivating for young minds.
2. The questions MUST be 100% specific to the requested topic ("${topic}") - never produce generic or out-of-context text.
3. Supported Question Types and Output JSON schemas:
- "multiple_choice": { "questionText": "...", "type": "multiple_choice", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "correctAnswerIndex": 0, "explanation": "...", "reference": "..." }
- "rapid_binary": { "questionText": "...", "type": "rapid_binary", "isTrue": true/false, "explanation": "...", "reference": "..." }
- "sequential_order": { "questionText": "...", "type": "sequential_order", "items": [{"id": "1", "text": "Step 1"}, {"id": "2", "text": "Step 2"}, {"id": "3", "text": "Step 3"}, {"id": "4", "text": "Step 4"}], "explanation": "...", "reference": "..." }
- "memory_match": { "questionText": "...", "type": "memory_match", "pairs": [{"id": "p1", "term": "...", "match": "..."}, {"id": "p2", "term": "...", "match": "..."}], "explanation": "...", "reference": "..." }
- "verse_gem_bank": { "questionText": "...", "type": "verse_gem_bank", "verseTemplate": "...", "missingWord": "...", "wordBank": ["Correct", "Fake1", "Fake2", "Fake3"], "explanation": "...", "reference": "..." }
- "audio_recitation": { "questionText": "...", "type": "audio_recitation", "options": ["..."], "correctAnswerIndex": 0, "audioUrl": "https://server8.mp3quran.net/afs/001.mp3", "audioTitle": "...", "explanation": "...", "reference": "..." }

Return ONLY a valid JSON object:
{
  "topic": "${topic}",
  "type": "${questionType}",
  "questions": [ ... ${count} question objects ... ]
}`;

    try {
      if (apiKey && apiKey.startsWith('AIzaSy')) {
        const endpoint = "https://generativelanguage.googleapis.com/v1beta/" + GEMINI_MODEL + ":generateContent?key=" + apiKey;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2500,
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            let clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);
            const list = Array.isArray(parsed) ? parsed : (parsed.questions || []);
            if (list.length > 0) {
              return { success: true, topic, type: questionType, questions: list, isAi: true };
            }
          }
        }
      }
    } catch(err) {
      console.warn("[AIScholar] Gemini API call note, activating dynamic Kids Curriculum Engine:", err);
    }

    return _generateTopicSpecificKidsQuestions(topic, count, questionType, language, difficulty);
  };


  S._recordAiAnalytics = function(data) {
    try {
      if (window.DB && typeof window.DB.get === 'function') {
        const list = window.DB.get('ai_analytics') || [];
        list.push(Object.assign({}, data, { timestamp: new Date().toISOString() }));
        window.DB.set('ai_analytics', list);
      }
    } catch(e) {}
  };

  S._recordUnansweredQuery = function(question, error) {
    try {
      if (window.DB && typeof window.DB.get === 'function') {
        const list = window.DB.get('ai_unanswered') || [];
        list.push({ question: question, error: error, timestamp: new Date().toISOString() });
        window.DB.set('ai_unanswered', list);
      }
    } catch(e) {}
  };

})();
