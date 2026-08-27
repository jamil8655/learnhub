/**
 * LearnHub Live Data Tools & Secure Authorization Layer
 * Bridges Gemini AI with real-time application state, DB, and authenticated user sessions.
 * Enforces role-based permissions, ownership checks, and audit logging.
 */

(function() {
  'use strict';

  class AIToolsSystem {
    constructor() {
      this.toolsRegistry = {};
      this.auditLogs = [];
      this.init();
    }

    init() {
      this._registerAllTools();
      console.log('[AIToolsEngine] Initialized with', Object.keys(this.toolsRegistry).length, 'secure live tools.');
    }

    /**
     * Get Current Authenticated User & Session
     */
    getCurrentUser() {
      if (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === 'function') {
        return window.Auth.getCurrentUser();
      }
      return null;
    }

    /**
     * Tool Registry
     */
    registerTool(name, meta, handler) {
      this.toolsRegistry[name] = {
        name,
        description: meta.description || '',
        category: meta.category || 'public', // 'public' | 'user' | 'teacher' | 'admin'
        requiredRole: meta.requiredRole || null,
        parameters: meta.parameters || {},
        handler
      };
    }

    /**
     * Secure Tool Execution Gateway with Permission & Ownership Validation
     */
    async executeTool(name, params = {}) {
      const tool = this.toolsRegistry[name];
      const user = this.getCurrentUser();

      if (!tool) {
        return {
          success: false,
          error: `ٹول "${name}" دستیاب نہیں ہے۔`
        };
      }

      // 1. Authorization Check
      if (tool.category !== 'public') {
        if (!user) {
          return {
            success: false,
            requiresAuth: true,
            message: 'یہ ذاتی معلومات دیکھنے کے لیے آپ کا لاگ ان ہونا ضروری ہے۔ براہ کرم لاگ ان فرمائیں:',
            action: { type: 'OPEN_LOGIN', label: 'لاگ ان کریں', route: '#/login' }
          };
        }

        if (tool.requiredRole === 'teacher' && user.role !== 'instructor' && user.role !== 'super_admin' && user.role !== 'admin') {
          return {
            success: false,
            error: 'یہ معلومات صرف مستند اساتذہ کے لیے مخصوص ہے۔'
          };
        }

        if (tool.requiredRole === 'admin' && user.role !== 'super_admin' && user.role !== 'admin') {
          return {
            success: false,
            error: 'یہ معلومات صرف ایڈمنسٹریٹر کے لیے دستیاب ہے۔'
          };
        }
      }

      // 2. Execute Handler
      try {
        const result = await tool.handler(params, user);
        this.logExecution(name, user, params, true);
        return {
          success: true,
          toolName: name,
          data: result
        };
      } catch (err) {
        console.error(`[AIToolsEngine] Error executing tool "${name}":`, err);
        this.logExecution(name, user, params, false, err.message);
        return {
          success: false,
          error: 'معلومات حاصل کرنے میں وقتی دشواری پیش آئی ہے۔'
        };
      }
    }

    /**
     * Audit Logger
     */
    logExecution(toolName, user, params, success, errorMsg = null) {
      const entry = {
        id: `ai_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        toolName,
        userId: user ? user.id : 'guest',
        userRole: user ? user.role : 'anonymous',
        timestamp: Date.now(),
        success,
        error: errorMsg
      };
      this.auditLogs.push(entry);
      if (this.auditLogs.length > 200) this.auditLogs.shift();

      // Persist in DB auditLogs
      if (typeof window !== 'undefined' && window.DB && window.DB.data) {
        window.DB.data.aiAuditLogs = window.DB.data.aiAuditLogs || [];
        window.DB.data.aiAuditLogs.unshift(entry);
        if (window.DB.data.aiAuditLogs.length > 100) window.DB.data.aiAuditLogs.pop();
      }
    }

    /* ==========================================================================
       REGISTER ALL OFFICIAL SECURE TOOLS
       ========================================================================== */
    _registerAllTools() {
      const db = () => (typeof window !== 'undefined' && window.DB && window.DB.data) ? window.DB.data : {};

      // 1. PUBLIC: Search Courses
      this.registerTool('search_courses', {
        description: 'Search courses by title, category, level, or free/paid status.',
        category: 'public',
        parameters: { query: 'string', category: 'string', isFree: 'boolean' }
      }, async (params) => {
        const courses = db().courses || [];
        const categories = db().categories || [];
        const instructors = db().instructors || [];

        let results = courses.filter(c => c.status !== 'archived' && c.status !== 'draft');

        if (params.query) {
          const q = params.query.toLowerCase();
          results = results.filter(c => 
            c.title.toLowerCase().includes(q) || 
            (c.description && c.description.toLowerCase().includes(q))
          );
        }

        if (params.category) {
          const cat = categories.find(ct => ct.slug === params.category || ct.name.includes(params.category));
          if (cat) results = results.filter(c => c.categoryId === cat.id);
        }

        if (params.isFree !== undefined) {
          results = results.filter(c => Boolean(c.isFree) === Boolean(params.isFree));
        }

        return results.map(c => {
          const cat = categories.find(ct => ct.id === c.categoryId);
          const inst = instructors.find(i => i.id === c.instructorId);
          return {
            id: c.id,
            title: c.title,
            category: cat ? cat.name : '',
            instructor: inst ? inst.name : '',
            price: c.isFree ? 'مفت (Free)' : `$${c.price}`,
            level: c.level,
            duration: `${c.durationHours || 10} گھنٹے`,
            action: { type: 'OPEN_COURSE', label: 'کورس دیکھیں', route: `#/course/${c.slug || c.id}` }
          };
        });
      });

      // 2. PUBLIC: Get Course Details & Price
      this.registerTool('get_course_details', {
        description: 'Get deep syllabus, instructor, price, and enrollment info for a specific course.',
        category: 'public',
        parameters: { courseIdOrSlug: 'string' }
      }, async (params) => {
        const courses = db().courses || [];
        const lessons = db().lessons || [];
        const instructors = db().instructors || [];

        const target = (params.courseIdOrSlug || '').toLowerCase();
        const course = courses.find(c => c.id === target || c.slug === target || c.title.toLowerCase().includes(target));

        if (!course) {
          return { found: false, message: 'مطلوبہ کورس لرن ہب ڈیٹا بیس میں موجود نہیں ہے۔' };
        }

        const inst = instructors.find(i => i.id === course.instructorId);
        const courseLessons = lessons.filter(l => l.courseId === course.id);

        return {
          found: true,
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.isFree ? 'مفت' : `$${course.price}`,
          originalPrice: course.originalPrice ? `$${course.originalPrice}` : null,
          instructor: inst ? { name: inst.name, title: inst.title, rating: inst.rating } : null,
          lessonsCount: courseLessons.length || course.lessonsCount || 8,
          syllabusPreview: courseLessons.slice(0, 5).map(l => l.title),
          action: { type: 'OPEN_COURSE', label: 'کورس میں داخلہ لیں', route: `#/course/${course.slug || course.id}` }
        };
      });

      // 3. PUBLIC: Search Quizzes
      this.registerTool('search_quizzes', {
        description: 'Get list of standalone examination quizzes with passing scores and timers.',
        category: 'public',
        parameters: { query: 'string' }
      }, async (params) => {
        const quizzes = db().quizzes || [];
        let list = quizzes;
        if (params.query) {
          const q = params.query.toLowerCase();
          list = list.filter(qz => qz.title.toLowerCase().includes(q) || (qz.category && qz.category.toLowerCase().includes(q)));
        }

        return list.map(q => ({
          id: q.id,
          title: q.title,
          category: q.category,
          duration: `${q.durationMinutes || 15} منٹ`,
          passingScore: `${q.passingScore || 70}%`,
          action: { type: 'OPEN_QUIZ', label: 'کوئز شروع کریں', route: `#/quiz/${q.id}` }
        }));
      });

      // 4. PUBLIC: Get Teacher Information
      this.registerTool('get_teacher_information', {
        description: 'Get profile, qualifications, and courses of an Islamic instructor / scholar.',
        category: 'public',
        parameters: { nameOrId: 'string' }
      }, async (params) => {
        const instructors = db().instructors || [];
        const courses = db().courses || [];
        const q = (params.nameOrId || '').toLowerCase();

        const inst = instructors.find(i => i.id === q || i.name.toLowerCase().includes(q) || (i.expertise && i.expertise.some(e => e.toLowerCase().includes(q))));
        if (!inst) {
          return { found: false, message: 'مطلوبہ استاذ کا ریکارڈ نہیں ملا۔' };
        }

        const taughtCourses = courses.filter(c => c.instructorId === inst.id);
        return {
          found: true,
          name: inst.name,
          title: inst.title,
          bio: inst.bio,
          rating: inst.rating,
          students: inst.studentsCount,
          expertise: inst.expertise,
          courses: taughtCourses.map(c => ({ title: c.title, route: `#/course/${c.slug || c.id}` }))
        };
      });

      // 5. PUBLIC: Website Navigation Helper
      this.registerTool('get_website_navigation', {
        description: 'Get exact internal application route and deep-link action for any feature.',
        category: 'public',
        parameters: { destination: 'string' }
      }, async (params) => {
        const dest = (params.destination || '').toLowerCase();
        const routesMap = {
          'quiz': { title: 'امتحانی کوئزز', route: '#/quizzes', label: 'کوئزز کھولیں' },
          'course': { title: 'کورسز لائبریری', route: '#/courses', label: 'کورسز دیکھیں' },
          'quran': { title: 'قرآن مجید اسٹوڈیو', route: '#/quran', label: 'قرآن پڑھیں' },
          'tafsir': { title: 'تفاسیر لائبریری', route: '#/tafsir', label: 'تفاسیر دیکھیں' },
          'hadith': { title: 'احادیث مبارکہ', route: '#/hadith', label: 'احادیث تلاش کریں' },
          'tasbih': { title: 'سمارٹ ڈیجیٹل تسبیح', route: '#/tasbih', label: 'تسبیح شروع کریں' },
          'azkar': { title: 'مسنون اذکار', route: '#/azkar', label: 'اذکار پڑھیں' },
          'zakat': { title: 'زکوٰۃ کیلکولیٹر', route: '#/zakat-calculator', label: 'زکوٰۃ کا حساب لگائیں' },
          'mirath': { title: 'وراثت کیلکولیٹر', route: '#/mirath-calculator', label: 'وراثت تقسیم کریں' },
          'profile': { title: 'پروفائل سیٹنگز', route: '#/profile', label: 'پروفائل کھولیں' },
          'dashboard': { title: 'طالب علم ڈیش بورڈ', route: '#/dashboard', label: 'ڈیش بورڈ دیکھیں' },
          'certificate': { title: 'سرٹیفکیٹس پورٹ فولیو', route: '#/certificates', label: 'اسناد دیکھیں' },
          'payment': { title: 'آرڈرز و ادائیگی کی تاریخ', route: '#/dashboard', label: 'ادائیگی دیکھیں' },
          'support': { title: 'ہیلپ و سپورٹ ڈیسک', route: '#/support', label: 'سپورٹ ٹکٹ درج کریں' }
        };

        let matched = null;
        for (let key in routesMap) {
          if (dest.includes(key)) {
            matched = routesMap[key];
            break;
          }
        }

        if (!matched) matched = routesMap['course'];
        return {
          title: matched.title,
          route: matched.route,
          action: { type: 'NAVIGATE', label: matched.label, route: matched.route }
        };
      });

      // 6. AUTHENTICATED: Get User Enrollments & Progress
      this.registerTool('get_user_enrollments', {
        description: 'Get logged-in user enrolled courses and completion percentages.',
        category: 'user'
      }, async (params, user) => {
        const enrollments = db().enrollments || [];
        const courses = db().courses || [];

        const myEnrolls = enrollments.filter(e => e.userId === user.id);
        if (myEnrolls.length === 0) {
          return {
            hasEnrollments: false,
            message: 'آپ ابھی تک کسی کورس میں داخل نہیں ہیں۔ آپ مفت کورسز میں فوری داخلہ لے سکتے ہیں!',
            action: { type: 'OPEN_COURSES', label: 'کورسز دریافت کریں', route: '#/courses' }
          };
        }

        const list = myEnrolls.map(e => {
          const c = courses.find(crs => crs.id === e.courseId) || { title: 'کورس' };
          return {
            courseId: e.courseId,
            title: c.title,
            progress: `${e.progress || 0}%`,
            enrolledAt: e.enrolledAt,
            completed: e.status === 'completed',
            action: { type: 'CONTINUE_LEARNING', label: 'سبق جاری رکھیں', route: `#/learn/${e.courseId}` }
          };
        });

        return { hasEnrollments: true, count: list.length, enrollments: list };
      });

      // 7. AUTHENTICATED: Get Payment & Order Status
      this.registerTool('get_payment_or_order_status', {
        description: 'Get live transaction status, order history, and payment verification for logged-in user.',
        category: 'user'
      }, async (params, user) => {
        const orders = db().orders || [];
        const myOrders = orders.filter(o => o.userId === user.id);

        if (myOrders.length === 0) {
          return {
            hasOrders: false,
            message: 'آپ کے اکاؤنٹ کے تحت ابھی کوئی ادائیگی یا ٹرانزیکشن ریکارڈ موجود نہیں ہے۔'
          };
        }

        const formatted = myOrders.map(o => ({
          orderId: o.id || o.orderNumber,
          amount: `$${o.totalAmount || o.amount}`,
          status: o.status, // 'successful', 'pending', 'failed', 'refunded'
          statusUrdu: o.status === 'successful' || o.status === 'paid' ? 'کامیاب و تصدیق شدہ (Successful)' :
                      o.status === 'pending' ? 'زیرِ جائزہ (Pending)' :
                      o.status === 'refunded' ? 'واپس شدہ (Refunded)' : 'ناکام (Failed)',
          courseName: o.items && o.items[0] ? o.items[0].title : (o.courseTitle || 'کورس'),
          date: o.createdAt || new Date().toISOString().slice(0, 10),
          action: { type: 'OPEN_ORDER', label: 'تفصیل دیکھیں', route: '#/dashboard' }
        }));

        return {
          hasOrders: true,
          orders: formatted
        };
      });

      // 8. AUTHENTICATED: Get User Quiz Results & Certificates
      this.registerTool('get_user_quiz_results_and_certificates', {
        description: 'Get quiz scores, pass status, and verified certificate credentials for logged-in user.',
        category: 'user'
      }, async (params, user) => {
        const attempts = db().quizAttempts || [];
        const certificates = db().certificates || [];
        const quizzes = db().quizzes || [];

        const myAttempts = attempts.filter(a => a.userId === user.id);
        const myCerts = certificates.filter(c => c.userId === user.id);

        return {
          totalAttempts: myAttempts.length,
          recentAttempts: myAttempts.slice(0, 5).map(att => {
            const q = quizzes.find(qz => qz.id === att.quizId);
            return {
              quizTitle: q ? q.title : 'کوئز',
              score: `${att.score}%`,
              passed: att.passed,
              date: att.completedAt
            };
          }),
          certificates: myCerts.map(cert => ({
            serialNumber: cert.serialNumber || cert.id,
            title: cert.courseTitle || cert.title,
            grade: cert.grade || 'ممتاز',
            action: { type: 'OPEN_CERTIFICATE', label: 'سرٹیفکیٹ دیکھیں', route: `#/verify-cert/${cert.serialNumber || cert.id}` }
          }))
        };
      });

      // 9. AUTHENTICATED: Get Account Information
      this.registerTool('get_account_information', {
        description: 'Get verified profile information, email status, streak, and points for logged-in user.',
        category: 'user'
      }, async (params, user) => {
        return {
          name: user.name,
          email: user.email,
          role: user.role,
          learningStreak: `${user.learningStreak || 1} دن`,
          totalPoints: `${user.totalPoints || 0} پوائنٹس`,
          emailVerified: user.emailVerified ? 'تصدیق شدہ ✓' : 'غیر تصدیق شدہ'
        };
      });

    }
  }

  window.AIToolsEngine = new AIToolsSystem();
})();
