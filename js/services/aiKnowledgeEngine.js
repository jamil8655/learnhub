/**
 * LearnHub AI Knowledge Engine & RAG Retrieval Layer
 * Indexes courses, quizzes, FAQs, instructors, policies, and navigation metadata.
 * Provides high-speed semantic & ranked retrieval with automatic DB change synchronization.
 */

(function() {
  'use strict';

  class AIKnowledgeBase {
    constructor() {
      this.chunks = [];
      this.isIndexed = false;
      this.lastIndexedAt = null;
      this.init();
    }

    init() {
      this.buildIndex();
      this.setupAutoSync();
      console.log('[AIKnowledgeEngine] Initialized with', this.chunks.length, 'indexed chunks.');
    }

    /**
     * Build / Rebuild entire knowledge index from DB & Official Docs
     */
    buildIndex() {
      const chunks = [];
      const db = (typeof window !== 'undefined' && window.DB && window.DB.data) ? window.DB.data : null;

      // 1. Platform Core & General Navigation
      const navigationRoutes = [
        { route: '#/', title: 'ہوم پیج (Home Page)', desc: 'مرکزی صفحہ، نمایاں کورسز، ایڈونچر گیم، لائیو اسٹریمز اور پلیٹ فارم کا تعارف۔', intent: 'HOME' },
        { route: '#/courses', title: 'تمام کورسز لائبریری (Courses Library)', desc: 'قرآنی تجوید، علوم الحدیث، فقہ، سیرت، اور عربی گرامر کے تمام کورسز کی فہرست۔', intent: 'COURSES' },
        { route: '#/quizzes', title: 'آزادانہ امتحانی کوئزز (Quizzes Hub)', desc: 'بغیر کورس میں داخلہ لیے براہِ راست ٹیسٹ دیں اور فوری سرٹیفکیٹ حاصل کریں۔', intent: 'QUIZZES' },
        { route: '#/quran', title: 'قرآن مجید اسٹوڈیو (Quran Hub)', desc: '114 سورتیں، 30 پارے، 15 سطری مصحف، قراء کی تلاوت اور سمارٹ بک مارکس۔', intent: 'QURAN' },
        { route: '#/tafsir', title: 'کتب تفاسیر لائبریری (Tafsir Hub)', desc: 'تفسیر ابن کثیر، معارف القرآن، طبری، قرطبی اور سعدی کے 8 مکمل تفاسیر کے والیمز۔', intent: 'TAFSIR' },
        { route: '#/hadith', title: 'کتبِ حدیث سرچ انجن (Hadith Library)', desc: 'صحیح بخاری، صحیح مسلم، اربعین نووی اور مشہور احادیث کا عربی و اردو مجموعہ۔', intent: 'HADITH' },
        { route: '#/azkar', title: 'مسنون اذکار و سمارٹ تسبیح (Azkar & Tasbih)', desc: 'صبح و شام کے اذکار، بعد از نماز دعائیں، اور وائبریشن والی سمارٹ ڈیجیٹل تسبیح۔', intent: 'AZKAR' },
        { route: '#/tasbih', title: 'سمارٹ ڈیجیٹل تسبیح (Smart Tasbih)', desc: 'موبائل وائبریشن، 33 اور 100 کے ہدف اور گولڈن کنفیٹی کے ساتھ تسبیح کاؤنٹر۔', intent: 'TASBIH' },
        { route: '#/zakat-calculator', title: 'زکوٰۃ کیلکولیٹر (Zakat Calculator)', desc: 'سونے، چاندی، نقدی اور مالِ تجارت پر درست شرعی زکوٰۃ کا لائیو حساب کتاب۔', intent: 'ZAKAT' },
        { route: '#/mirath-calculator', title: 'میراث و وراثت کیلکولیٹر (Mirath)', desc: 'قرآن و سنت کے اصولوں کے مطابق شرعی ترکہ اور وارثوں کے حصوں کی تقسیم۔', intent: 'MIRATH' },
        { route: '#/adventure', title: 'اسلامک لرننگ ایڈونچر گیم (9 Realms Game)', desc: '9 اسلامی جہانوں پر مشتمل پزلز، کوئزز، لائف ہارٹس، اور لیڈر بورڈ والا گیم۔', intent: 'GAME' },
        { route: '#/library', title: 'کتب خانہ و پی ڈی ایف لائبریری (Islamic Library)', desc: 'اہل حدیث و کلاسیکل ائمہ کی 300 سے زائد مستند پی ڈی ایف کتب اور آن لائن ریڈر۔', intent: 'LIBRARY' },
        { route: '#/dashboard', title: 'طالب علم ڈیش بورڈ (Student Dashboard)', desc: 'داخل شدہ کورسز، جاری اسباق، حاصل کردہ پوائنٹس اور پڑھائی کا ریکارڈ۔', intent: 'DASHBOARD' },
        { route: '#/profile', title: 'پروفائل و اکاؤنٹ سیٹنگز (Profile)', desc: 'نام، ای میل، پاس ورڈ، او ٹی پی ویریفکیشن اور سیکیورٹی سیٹنگز۔', intent: 'PROFILE' },
        { route: '#/certificates', title: 'میرے اسناد و سرٹیفکیٹس (Certificates)', desc: 'کامیابی سے مکمل کیے گئے کورسز اور پاس شدہ کوئزز کے کیو آر کوڈ والے سرٹیفکیٹس۔', intent: 'CERTIFICATES' },
        { route: '#/support', title: 'مدد و ہیلپ ڈیسک (Support)', desc: 'کسی بھی دشواری، فیس، یا تکنیکی مسئلے کے لیے سپورٹ ٹکٹ درج کریں۔', intent: 'SUPPORT' }
      ];

      navigationRoutes.forEach(nav => {
        chunks.push({
          id: `nav_${nav.intent.toLowerCase()}`,
          category: 'navigation',
          title: nav.title,
          content: `${nav.title}: ${nav.desc} (صفحہ کا لنک: ${nav.route})`,
          keywords: [nav.title, nav.desc, nav.route, 'page', 'route', 'link', 'kahan hai', 'open'],
          metadata: { route: nav.route, intent: nav.intent }
        });
      });

      // 2. Official FAQs & Help Policies
      if (db && db.cmsContent && Array.isArray(db.cmsContent.faqs)) {
        db.cmsContent.faqs.forEach((faq, i) => {
          chunks.push({
            id: `faq_${faq.id || i}`,
            category: 'faq',
            title: faq.question,
            content: `سوال: ${faq.question}\nجواب: ${faq.answer}\nزمرہ: ${faq.category || 'عمومی'}`,
            keywords: [faq.question, faq.answer, faq.category || '', 'faq', 'help', 'madad'],
            metadata: { type: 'faq', category: faq.category }
          });
        });
      }

      // Add Standard Official LearnHub Policies
      const officialPolicies = [
        {
          id: 'policy_refund',
          title: 'لرن ہب ریفنڈ اور رقم واپسی پالیسی (Refund Policy)',
          content: 'لرن ہب پر تمام فیس والے کورسز پر 7 یوم کی 100% رقم واپسی گارنٹی ہے۔ اگر آپ مطمئن نہیں ہیں تو داخلہ کے 7 دن کے اندر سپورٹ ڈیسک یا ای میل support@learnhubplatform.com پر رابطہ کر کے فوری ریفنڈ حاصل کر سکتے ہیں۔',
          keywords: ['refund', 'money back', 'wapsi', 'paise', 'fees', 'policy']
        },
        {
          id: 'policy_certificate',
          title: 'سرٹیفکیٹ تصدیق اور اجراء پالیسی (Certificate Verification)',
          content: 'کورس مکمل کرنے پر یا آزاد کوئز میں 70% یا زائد نمبر حاصل کرنے پر ڈیجیٹل سرٹیفکیٹ فوری جاری ہوتا ہے۔ ہر سرٹیفکیٹ پر منفرد سیریل نمبر (LH-CERT-2026-XXXX) اور کیو آر کوڈ ہوتا ہے جسے #/verify-cert/:id پر لائیو چیک کیا جا سکتا ہے۔',
          keywords: ['certificate', 'sanad', 'degree', 'verify', 'serial', 'qr code']
        },
        {
          id: 'policy_free_learning',
          title: 'مفت اسلامی تعلیم کا مشن (Free Islamic Education Mission)',
          content: 'لرن ہب کا بنیادی مقصد علمِ نافع کو عام کرنا ہے۔ تجوید القرآن، بنیادی عقائد، نماز کا طریقہ، مسنون اذکار، اور تفاسیر لائبریری تمام طلباء کے لیے 100% مفت اور فی سبیل اللہ فراہم کی گئی ہیں۔',
          keywords: ['free', 'muft', 'cost', 'fees', 'charges', 'paisa']
        }
      ];

      officialPolicies.forEach(p => {
        chunks.push({
          id: p.id,
          category: 'policy',
          title: p.title,
          content: p.content,
          keywords: [p.title, p.content, ...p.keywords],
          metadata: { type: 'policy' }
        });
      });

      // 3. Courses Indexing
      if (db && Array.isArray(db.courses)) {
        db.courses.forEach(c => {
          const category = db.categories ? db.categories.find(cat => cat.id === c.categoryId) : null;
          const instructor = db.instructors ? db.instructors.find(inst => inst.id === c.instructorId) : null;
          const priceText = c.isFree || c.price === 0 ? 'مفت (Free)' : `$${c.price} (اصل قیمت: $${c.originalPrice || c.price})`;

          chunks.push({
            id: `course_${c.id}`,
            category: 'course',
            title: c.title,
            content: `کورس کا نام: ${c.title}\nزمرہ: ${category ? category.name : 'اسلامی تعلیم'}\nاستاذ: ${instructor ? instructor.name : 'مستند مدرس'}\nقیمت: ${priceText}\nسطح: ${c.level === 'beginner' ? 'ابتدائی (Beginner)' : c.level === 'intermediate' ? 'متوسط (Intermediate)' : 'اعلیٰ (Advanced)'}\nمدت: ${c.durationHours || 10} گھنٹے\nتفصیل: ${c.description || ''}\nاسباق کی تعداد: ${c.lessonsCount || 8}\nلنک: #/course/${c.slug || c.id}`,
            keywords: [c.title, c.description || '', category ? category.name : '', instructor ? instructor.name : '', c.level || '', 'course', 'fees', 'enroll'],
            metadata: { courseId: c.id, slug: c.slug, price: c.price, isFree: c.isFree, instructorId: c.instructorId, route: `#/course/${c.slug || c.id}` }
          });
        });
      }

      // 4. Instructors / Ustads Indexing
      if (db && Array.isArray(db.instructors)) {
        db.instructors.forEach(inst => {
          chunks.push({
            id: `instructor_${inst.id}`,
            category: 'instructor',
            title: inst.name,
            content: `استاذ کا نام: ${inst.name}\nعہدہ و ڈگری: ${inst.title || ''}\nریٹنگ: ⭐ ${inst.rating || 5.0}\nطلباء کی تعداد: ${inst.studentsCount || 0}+\nتخصص و مہارت: ${(inst.expertise || []).join('، ')}\nتعارف: ${inst.bio || ''}`,
            keywords: [inst.name, inst.title || '', inst.bio || '', ...(inst.expertise || []), 'teacher', 'ustad', 'shaikh', 'mufti'],
            metadata: { instructorId: inst.id }
          });
        });
      }

      // 5. Standalone Quizzes Indexing
      if (db && Array.isArray(db.quizzes)) {
        db.quizzes.forEach(q => {
          chunks.push({
            id: `quiz_${q.id}`,
            category: 'quiz',
            title: q.title,
            content: `کوئز کا نام: ${q.title}\nزمرہ: ${q.category || 'دینی معلومات'}\nوقت: ${q.durationMinutes || 15} منٹ\nکل سوالات: ${q.questionsCount || (db.quizQuestions ? db.quizQuestions.filter(qq => qq.quizId === q.id).length : 10)}\nکامیابی کی شرح: ${q.passingScore || 70}%\nتفصیل: ${q.description || 'اپنی دینی قابلیت اور معلومات کا ٹیسٹ لیں۔'}\nلنک: #/quiz/${q.id}`,
            keywords: [q.title, q.category || '', q.description || '', 'quiz', 'test', 'exam', 'questions', 'pass marks'],
            metadata: { quizId: q.id, route: `#/quiz/${q.id}` }
          });
        });
      }

      this.chunks = chunks;
      this.isIndexed = true;
      this.lastIndexedAt = Date.now();
    }

    /**
     * Ranked Semantic / Keyword Search across Chunks
     */
    search(query, options = {}) {
      if (!query || typeof query !== 'string') return [];
      if (!this.isIndexed) this.buildIndex();

      const limit = options.limit || 5;
      const categoryFilter = options.category || null;

      const q = query.toLowerCase().trim();
      const qTokens = q.split(/[\s,،.?؟!]+/).filter(t => t.length > 1);

      if (qTokens.length === 0) return [];

      const scored = [];

      this.chunks.forEach(chunk => {
        if (categoryFilter && chunk.category !== categoryFilter) return;

        let score = 0;
        const fullText = (chunk.title + ' ' + chunk.content + ' ' + (chunk.keywords || []).join(' ')).toLowerCase();

        // Exact match boost
        if (fullText.includes(q)) {
          score += 50;
        }

        // Title match boost
        if (chunk.title.toLowerCase().includes(q)) {
          score += 40;
        }

        // Token matches
        qTokens.forEach(token => {
          if (chunk.title.toLowerCase().includes(token)) score += 15;
          if (fullText.includes(token)) score += 5;
        });

        if (score > 0) {
          scored.push({
            chunk,
            score
          });
        }
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, limit).map(s => s.chunk);
    }

    /**
     * Subscribe to DB changes for Automatic Live Synchronization
     */
    setupAutoSync() {
      if (typeof window !== 'undefined') {
        const originalSave = window.DB ? window.DB.save : null;
        if (originalSave && !window.DB._aiSyncHooked) {
          const self = this;
          window.DB.save = function() {
            const result = originalSave.apply(this, arguments);
            // Incrementally rebuild knowledge index in background
            setTimeout(() => {
              self.buildIndex();
              console.log('[AIKnowledgeEngine] Knowledge index auto-synchronized with latest DB changes.');
            }, 200);
            return result;
          };
          window.DB._aiSyncHooked = true;
        }
      }
    }

    /**
     * Add Custom Admin Document / Chunk
     */
    addChunk(chunk) {
      if (!chunk || !chunk.title) return false;
      const id = chunk.id || `custom_${Date.now()}`;
      const newChunk = {
        id,
        category: chunk.category || 'custom',
        title: chunk.title,
        content: chunk.content || '',
        keywords: chunk.keywords || [chunk.title],
        metadata: chunk.metadata || {}
      };
      this.chunks.push(newChunk);
      return true;
    }

    getIndexStats() {
      return {
        totalChunks: this.chunks.length,
        lastIndexedAt: this.lastIndexedAt,
        categories: {
          navigation: this.chunks.filter(c => c.category === 'navigation').length,
          faq: this.chunks.filter(c => c.category === 'faq').length,
          policy: this.chunks.filter(c => c.category === 'policy').length,
          course: this.chunks.filter(c => c.category === 'course').length,
          instructor: this.chunks.filter(c => c.category === 'instructor').length,
          quiz: this.chunks.filter(c => c.category === 'quiz').length,
          custom: this.chunks.filter(c => c.category === 'custom').length
        }
      };
    }
  }

  window.AIKnowledgeEngine = new AIKnowledgeBase();
})();
