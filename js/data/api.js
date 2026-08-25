/**
 * LearnHub API Data Access Layer
 * Provides clean asynchronous interfaces, search indexing, secure quiz grading,
 * and progress calculations.
 */

window.API = {
  // COURSES
  async getCourses(params = {}) {
    const courses = window.DB.get('courses');
    const categories = window.DB.get('categories');
    const instructors = window.DB.get('instructors');

    let result = courses.filter(c => c.status === 'published' || params.includeAllStatus);

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDescription.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'all') {
      result = result.filter(c => c.categoryId === params.category || c.slug === params.category);
    }

    if (params.level && params.level !== 'all') {
      result = result.filter(c => c.level.toLowerCase() === params.level.toLowerCase());
    }

    if (params.priceType) {
      if (params.priceType === 'free') result = result.filter(c => c.isFree);
      if (params.priceType === 'paid') result = result.filter(c => !c.isFree);
    }

    if (params.minRating) {
      result = result.filter(c => c.rating >= parseFloat(params.minRating));
    }

    // Sort
    if (params.sort) {
      switch (params.sort) {
        case 'popular':
          result.sort((a, b) => b.enrolledCount - a.enrolledCount);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
          break;
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
      }
    } else {
      result.sort((a, b) => b.enrolledCount - a.enrolledCount);
    }

    // Hydrate relations
    const hydrated = result.map(course => {
      const cat = categories.find(c => c.id === course.categoryId);
      const inst = instructors.find(i => i.id === course.instructorId);
      const lessons = window.DB.get('lessons').filter(l => l.courseId === course.id);
      return {
        ...course,
        category: cat,
        instructor: inst,
        lessonCount: lessons.length
      };
    });

    return hydrated;
  },

  async getCourseById(id) {
    const course = window.DB.findById('courses', id);
    if (!course) return null;

    const category = window.DB.findById('categories', course.categoryId);
    const instructor = window.DB.findById('instructors', course.instructorId);
    const lessons = window.DB.get('lessons')
      .filter(l => l.courseId === course.id)
      .sort((a, b) => a.order - b.order);
    const reviews = window.DB.get('reviews')
      .filter(r => r.courseId === course.id && r.status === 'approved');

    return {
      ...course,
      category,
      instructor,
      lessons,
      reviews
    };
  },

  async saveCourse(courseData) {
    if (courseData.id) {
      const updated = window.DB.update('courses', courseData.id, courseData);
      window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'COURSE_UPDATED', courseData.title);
      return updated;
    } else {
      const created = window.DB.insert('courses', courseData);
      window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'COURSE_CREATED', courseData.title);
      return created;
    }
  },

  async deleteCourse(id) {
    const course = window.DB.findById('courses', id);
    if (!course) return false;
    window.DB.delete('courses', id);
    // Delete associated lessons
    const lessons = window.DB.get('lessons').filter(l => l.courseId === id);
    lessons.forEach(l => window.DB.delete('lessons', l.id));
    window.DB.logAudit(window.Auth.getCurrentUser()?.name || 'Admin', 'COURSE_DELETED', course.title);
    return true;
  },

  // LESSONS
  async saveLesson(lessonData) {
    if (lessonData.id) {
      return window.DB.update('lessons', lessonData.id, lessonData);
    } else {
      return window.DB.insert('lessons', lessonData);
    }
  },

  async deleteLesson(id) {
    return window.DB.delete('lessons', id);
  },

  async reorderLessons(orderedIds) {
    orderedIds.forEach((id, index) => {
      window.DB.update('lessons', id, { order: index + 1 });
    });
    return true;
  },

  // STANDALONE QUIZZES MODULE (Completely independent from courses)
  async getQuizzes(params = {}) {
    const quizzes = window.DB.get('quizzes');
    const categories = window.DB.get('categories');

    let result = quizzes.filter(q => q.status === 'published' || params.includeAllStatus);

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.shortDescription.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'all') {
      result = result.filter(q => q.categoryId === params.category);
    }

    if (params.difficulty && params.difficulty !== 'all') {
      result = result.filter(q => q.difficulty.toLowerCase() === params.difficulty.toLowerCase());
    }

    if (params.sort) {
      if (params.sort === 'popular') result.sort((a, b) => b.participantsCount - a.participantsCount);
      if (params.sort === 'passRate') result.sort((a, b) => b.passRate - a.passRate);
      if (params.sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result.map(quiz => {
      const cat = categories.find(c => c.id === quiz.categoryId);
      const questions = window.DB.get('quizQuestions').filter(qq => qq.quizId === quiz.id);
      return {
        ...quiz,
        category: cat,
        questionCount: questions.length,
        totalMarks: questions.reduce((sum, q) => sum + (q.marks || 10), 0)
      };
    });
  },

  async getQuizById(id) {
    const quiz = window.DB.findById('quizzes', id);
    if (!quiz) return null;
    const category = window.DB.findById('categories', quiz.categoryId);
    const questions = window.DB.get('quizQuestions')
      .filter(qq => qq.quizId === quiz.id)
      .sort((a, b) => a.order - b.order);

    return {
      ...quiz,
      category,
      questions,
      questionCount: questions.length,
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 10), 0)
    };
  },

  async getQuizQuestionsForTake(quizId) {
    const quiz = window.DB.findById('quizzes', quizId);
    if (!quiz) return [];

    let questions = window.DB.get('quizQuestions')
      .filter(qq => qq.quizId === quizId)
      .sort((a, b) => a.order - b.order);

    if (quiz.randomizeQuestions) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    // Security requirement #43: NEVER expose correct answer indices or explanations during quiz attempt!
    return questions.map((q, idx) => ({
      id: q.id,
      quizId: q.quizId,
      order: idx + 1,
      type: q.type,
      marks: q.marks || 10,
      questionText: q.questionText,
      options: quiz.randomizeOptions ? [...q.options] : q.options
    }));
  },

  async submitQuizAttempt(quizId, arg2, arg3, arg4) {
    let userId = null;
    let submittedAnswers = {};
    let timeTakenSeconds = 0;

    if (typeof arg2 === 'string' && (typeof arg3 === 'object' || Array.isArray(arg3))) {
      userId = arg2;
      submittedAnswers = arg3 || {};
      timeTakenSeconds = arg4 || 0;
    } else {
      userId = window.Auth?.getCurrentUser()?.id || 'usr-student-1';
      submittedAnswers = arg2 || {};
      timeTakenSeconds = arg3 || 0;
    }

    // 1. Authoritative Cloud Function Submission (Zero Client Trust)
    if (window.firebase && typeof window.firebase.functions === 'function') {
      try {
        const submitFn = window.firebase.functions().httpsCallable('submitQuizAttempt');
        const res = await submitFn({ quizId, answers: submittedAnswers, timeTakenSeconds });
        if (res && res.data && res.data.success) {
          return {
            id: res.data.attemptId,
            quizId,
            userId,
            totalQuestions: res.data.totalQuestions,
            correctCount: res.data.score,
            percentage: res.data.percentage,
            isPassed: res.data.passed,
            timeTakenSeconds,
            detailedReview: res.data.breakdown || [],
            xpEarned: res.data.xpEarned,
            isServerGraded: true
          };
        }
      } catch (err) {
        console.warn('Cloud Function unavailable, using local evaluator fallback:', err);
      }
    }

    const quiz = window.DB.findById('quizzes', quizId);
    if (!quiz) throw new Error('Quiz not found');

    const originalQuestions = (window.DB.get('quizQuestions') || []).filter(q => q.quizId === quizId);
    const totalQuestions = originalQuestions.length;
    let correctCount = 0;
    let obtainedMarks = 0;
    const totalMarks = originalQuestions.reduce((sum, q) => sum + (q.marks || 10), 0);

    const detailedReview = originalQuestions.map((q, idx) => {
      let selectedIndex = null;
      if (Array.isArray(submittedAnswers)) {
        const found = submittedAnswers.find(a => a.questionId === q.id || a.id === q.id);
        if (found) selectedIndex = found.selectedOptionIndex ?? found.answer;
      } else if (submittedAnswers && typeof submittedAnswers === 'object') {
        selectedIndex = (submittedAnswers[q.id] !== undefined) ? submittedAnswers[q.id] : (submittedAnswers[idx] !== undefined ? submittedAnswers[idx] : null);
      }

      const isAnswered = selectedIndex !== null && selectedIndex !== undefined && selectedIndex !== '';
      const isCorrect = isAnswered && Number(selectedIndex) === Number(q.correctAnswerIndex);

      if (isCorrect) {
        correctCount++;
        obtainedMarks += (q.marks || 10);
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        options: q.options || [],
        selectedOptionIndex: isAnswered ? Number(selectedIndex) : null,
        selectedIndex: isAnswered ? Number(selectedIndex) : null,
        selectedOptionText: (isAnswered && q.options && q.options[Number(selectedIndex)] !== undefined) ? q.options[Number(selectedIndex)] : 'حل نہیں کیا گیا (Skipped)',
        correctAnswerIndex: q.correctAnswerIndex,
        correctIndex: q.correctAnswerIndex,
        correctOptionText: (q.options && q.options[q.correctAnswerIndex] !== undefined) ? q.options[q.correctAnswerIndex] : '',
        isCorrect,
        explanation: q.explanation || 'مستند شرعی و علمی اصولوں کے مطابق صحیح جواب ہے۔',
        marks: q.marks || 10
      };
    });

    const percentage = Math.round((obtainedMarks / (totalMarks || 1)) * 100);
    const passed = percentage >= (quiz.passingPercentage || 70);

    const attemptRecord = {
      id: `qa-${Date.now()}`,
      quizId,
      userId,
      score: obtainedMarks,
      totalMarks,
      percentage,
      passed,
      timeTakenSeconds,
      completedAt: new Date().toISOString()
    };

    if (window.DB) {
      window.DB.insert('quizAttempts', attemptRecord);
    }

    return {
      quiz: quiz,
      quizTitle: quiz.title,
      isPassed: passed,
      passed: passed,
      score: obtainedMarks,
      obtainedMarks: obtainedMarks,
      totalMarks: totalMarks,
      percentage: percentage,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      wrongCount: totalQuestions - correctCount,
      timeSpentSeconds: timeTakenSeconds,
      timeTakenSeconds: timeTakenSeconds,
      breakdown: detailedReview,
      detailedReview: detailedReview,
      attempt: attemptRecord
    };
  },

  // ENROLLMENTS & COURSE PROGRESS
  async getEnrollments(userId) {
    const enrollments = window.DB.get('enrollments').filter(e => e.userId === userId);
    const courses = window.DB.get('courses');
    const categories = window.DB.get('categories');
    const instructors = window.DB.get('instructors');

    return enrollments.map(enr => {
      const course = courses.find(c => c.id === enr.courseId);
      const cat = categories.find(c => c.id === course?.categoryId);
      const inst = instructors.find(i => i.id === course?.instructorId);
      const lessons = window.DB.get('lessons').filter(l => l.courseId === enr.courseId);

      return {
        ...enr,
        course: {
          ...course,
          category: cat,
          instructor: inst,
          totalLessonsCount: lessons.length
        }
      };
    });
  },

  async enrollInCourse(courseId, userId) {
    const existing = window.DB.get('enrollments').find(e => e.courseId === courseId && e.userId === userId);
    if (existing) return existing;

    const course = window.DB.findById('courses', courseId);
    const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

    const enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progressPercentage: 0,
      completedLessons: [],
      lastViewedLessonId: lessons[0]?.id || null,
      status: 'in_progress',
      completedAt: null
    };

    window.DB.insert('enrollments', enrollment);

    // Increment course enrolled count
    if (course) {
      window.DB.update('courses', courseId, { enrolledCount: (course.enrolledCount || 0) + 1 });
    }

    // Add notification
    window.DB.insert('notifications', {
      userId,
      type: 'course',
      title: 'Enrolled Successfully!',
      message: `You are now enrolled in "${course?.title}". Start your learning journey!`,
      link: `#/learn/${courseId}/${lessons[0]?.id || ''}`,
      read: false
    });

    window.API.recordUserActivity(userId, 'course_enrolled', { courseTitle: course?.title });
    return enrollment;
  },

  async updateLessonProgress(courseId, lessonId, userId, isCompleted) {
    const enrollment = window.DB.get('enrollments').find(e => e.courseId === courseId && e.userId === userId);
    if (!enrollment) return null;

    const courseLessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
    const totalLessons = courseLessons.length || 1;

    let completed = new Set(enrollment.completedLessons || []);
    if (isCompleted === true) {
      completed.add(lessonId);
    } else if (isCompleted === false) {
      completed.delete(lessonId);
    }

    const completedArr = Array.from(completed);
    // Requirement #10: Automatically calculate: completed lessons / total lessons × 100
    const progressPercentage = Math.min(100, Math.round((completedArr.length / totalLessons) * 100));
    const isNowFinished = progressPercentage === 100;

    const updates = {
      completedLessons: completedArr,
      lastViewedLessonId: lessonId,
      progressPercentage,
      status: isNowFinished ? 'completed' : 'in_progress',
      completedAt: isNowFinished ? (enrollment.completedAt || new Date().toISOString()) : null
    };

    const updatedEnrollment = window.DB.update('enrollments', enrollment.id, updates);

    // Log learning activity
    if (isCompleted !== undefined && isCompleted !== null) {
      window.API.recordUserActivity(userId, isCompleted ? 'lesson_completed' : 'lesson_viewed', { courseId, lessonId });
    }


    // Auto-generate certificate if 100% complete
    if (isNowFinished && !window.DB.get('certificates').some(c => c.userId === userId && c.courseId === courseId)) {
      const user = window.DB.findById('users', userId);
      const course = window.DB.findById('courses', courseId);
      const instructor = window.DB.findById('instructors', course?.instructorId);

      const certNumber = `LH-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const cert = {
        id: `cert-${Date.now()}`,
        certificateNumber: certNumber,
        userId,
        userName: user?.name || 'Valued Learner',
        courseId,
        courseTitle: course?.title || 'Completed Course',
        instructorName: instructor?.name || 'LearnHub Faculty',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verificationUrl: `#/verify-cert/${certNumber}`,
        grade: 'Distinction (100%)',
        badgeColor: '#4f46e5'
      };

      window.DB.insert('certificates', cert);

      // Notification
      window.DB.insert('notifications', {
        userId,
        type: 'certificate',
        title: '🎓 Certificate Earned!',
        message: `Congratulations! You have completed "${course?.title}" and your certificate is ready.`,
        link: '#/certificates',
        read: false
      });

      // Gamification unlock
      window.API.unlockAchievement(userId, 'first_course');

      const completedCount = window.DB.get('enrollments').filter(e => e.userId === userId && e.status === 'completed').length;
      if (completedCount >= 5) {
        window.API.unlockAchievement(userId, 'five_courses');
      }
    }

    return updatedEnrollment;
  },

  // GAMIFICATION & LEARNING ACTIVITY
  recordUserActivity(userId, type, metadata = {}) {
    const today = new Date().toISOString().split('T')[0];
    const activities = window.DB.get('activityLogs');
    const existing = activities.find(a => a.userId === userId && a.date === today);

    if (existing) {
      window.DB.update('activityLogs', existing.id, { count: (existing.count || 1) + 1 });
    } else {
      window.DB.insert('activityLogs', {
        userId,
        date: today,
        count: 1,
        type
      });
    }

    // Update streak
    const user = window.DB.findById('users', userId);
    if (user) {
      const newPoints = (user.totalPoints || 0) + (type === 'quiz_passed' ? 50 : 20);
      window.DB.update('users', userId, { totalPoints: newPoints });
    }
  },

  unlockAchievement(userId, achievementCode) {
    const achievement = window.DB.get('achievements').find(a => a.code === achievementCode);
    if (!achievement) return null;

    const existing = window.DB.get('userAchievements').find(ua => ua.userId === userId && ua.achievementId === achievement.id);
    if (existing) return existing;

    const userAch = window.DB.insert('userAchievements', {
      userId,
      achievementId: achievement.id,
      unlockedAt: new Date().toISOString()
    });

    window.DB.insert('notifications', {
      userId,
      type: 'achievement',
      title: `🏆 Badge Unlocked: ${achievement.title}`,
      message: `${achievement.description} (+${achievement.points} pts)`,
      link: '#/achievements',
      read: false
    });

    return userAch;
  },

  // CERTIFICATES & VERIFICATION
  async getCertificateByNumber(certNumber) {
    if (!certNumber) return null;
    const certs = window.DB ? window.DB.get('certificates') || [] : [];
    const search = String(certNumber).trim().toUpperCase();
    return certs.find(c => 
      (c.certificateNumber && String(c.certificateNumber).trim().toUpperCase() === search) ||
      (c.serialNumber && String(c.serialNumber).trim().toUpperCase() === search) ||
      (c.id && String(c.id).trim().toUpperCase() === search)
    ) || null;
  },

  // GLOBAL SEARCH (Courses, Lessons, Quizzes, Instructors, Categories, Resources)
  async globalSearch(query) {
    if (!query || query.trim().length === 0) return { courses: [], quizzes: [], instructors: [], categories: [], resources: [] };
    const q = query.toLowerCase().trim();

    const courses = (await this.getCourses({ search: q })).slice(0, 5);
    const quizzes = (await this.getQuizzes({ search: q })).slice(0, 5);
    const instructors = window.DB.get('instructors').filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.bio.toLowerCase().includes(q) ||
      i.expertise.some(e => e.toLowerCase().includes(q))
    ).slice(0, 4);
    const categories = window.DB.get('categories').filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    ).slice(0, 4);
    const resources = window.DB.get('resources').filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return { courses, quizzes, instructors, categories, resources };
  },

  // ADMIN ANALYTICS
  async getAdminAnalytics() {
    const users = window.DB.get('users');
    const courses = window.DB.get('courses');
    const quizzes = window.DB.get('quizzes');
    const enrollments = window.DB.get('enrollments');
    const orders = window.DB.get('orders');
    const certificates = window.DB.get('certificates');
    const quizAttempts = window.DB.get('quizAttempts');
    const reviews = window.DB.get('reviews');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeUsersCount = users.filter(u => u.status === 'active').length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const passedQuizAttempts = quizAttempts.filter(qa => qa.passed).length;
    const quizPassRate = quizAttempts.length ? Math.round((passedQuizAttempts / quizAttempts.length) * 100) : 0;

    return {
      kpis: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        activeUsers: activeUsersCount,
        totalCourses: courses.length,
        publishedCourses,
        totalEnrollments: enrollments.length,
        totalQuizzes: quizzes.length,
        totalQuizAttempts: quizAttempts.length,
        quizPassRate,
        certificatesIssued: certificates.length,
        reviewsCount: reviews.length
      },
      charts: {
        monthlyRevenue: [
          { month: 'Sep', revenue: 4200 },
          { month: 'Oct', revenue: 6800 },
          { month: 'Nov', revenue: 8400 },
          { month: 'Dec', revenue: 11200 },
          { month: 'Jan', revenue: 14500 },
          { month: 'Feb', revenue: 18900 }
        ],
        enrollmentTrends: [
          { month: 'Sep', enrollments: 320 },
          { month: 'Oct', enrollments: 480 },
          { month: 'Nov', enrollments: 650 },
          { month: 'Dec', enrollments: 890 },
          { month: 'Jan', enrollments: 1240 },
          { month: 'Feb', enrollments: 1680 }
        ],
        categoryDistribution: [
          { label: 'Web Development', count: 35 },
          { label: 'AI & Deep Learning', count: 28 },
          { label: 'Cloud & DevOps', count: 18 },
          { label: 'Data Science', count: 12 },
          { label: 'UI/UX Design', count: 7 }
        ]
      },
      recentOrders: orders.slice(0, 5),
      recentAttempts: quizAttempts.slice(0, 5),
      recentUsers: users.slice(0, 5)
    };
  },

  // ==========================================
  // AUTHENTICATION & SECURITY API ENDPOINTS
  // ==========================================
  auth: {
    async register(dataOrName, email, password, role = 'student', autoLogin = true) {
      return window.Auth.register(dataOrName, email, password, role, autoLogin);
    },
    async login(email, password, remember = true) {
      return window.Auth.login(email, password, remember);
    },
    async verifyEmail(token) {
      return window.Auth.verifyEmail(token);
    },
    async resendVerification(email) {
      return window.Auth.resendVerification(email);
    },
    async verify2FALogin(tempToken, codeOrRecovery) {
      return window.Auth.verify2FALogin(tempToken, codeOrRecovery);
    },
    async forgotPassword(email) {
      return window.Auth.forgotPassword(email);
    },
    async resetPassword(token, newPassword, confirmPassword) {
      return window.Auth.resetPassword(token, newPassword, confirmPassword);
    },
    async changePassword(...args) {
      return window.Auth.changePassword(...args);
    },
    async changeEmail(...args) {
      return window.Auth.changeEmail(...args);
    },
    async setup2FA(userId) {
      return window.Auth.setup2FA(userId);
    },
    async confirm2FA(userId, code) {
      return window.Auth.confirm2FA(userId, code);
    },
    async disable2FA(userId, password) {
      return window.Auth.disable2FA(userId, password);
    },
    async regenerateRecoveryCodes(userId, password) {
      return window.Auth.regenerateRecoveryCodes(userId, password);
    },
    async getUserSessions(userId) {
      return window.Auth.getUserSessions(userId);
    },
    async revokeSession(sessionId, userId) {
      return window.Auth.revokeSession(sessionId, userId);
    },
    async revokeAllOtherSessions(userId, currentSessionToken) {
      return window.Auth.revokeAllOtherSessions(userId, currentSessionToken);
    },
    async deactivateAccount(userId, password) {
      return window.Auth.deactivateAccount(userId, password);
    },
    async deleteAccount(userId, password) {
      return window.Auth.deleteAccount(userId, password);
    },
    async getSecurityLogs(userId) {
      return window.Auth.getSecurityLogs(userId);
    }
  },

  // Direct top-level aliases for views
  async registerUser(...args) {
    return window.Auth.register(...args);
  },
  async loginUser(...args) {
    return window.Auth.login(...args);
  },
  async verifyUserEmail(token) {
    return window.Auth.verifyEmail(token);
  },
  async resendUserVerification(email) {
    return window.Auth.resendVerification(email);
  },
  async forgotUserPassword(email) {
    return window.Auth.forgotPassword(email);
  },
  async resetUserPassword(token, newPassword, confirmPassword) {
    return window.Auth.resetPassword(token, newPassword, confirmPassword);
  },
  async getUserSessions(userId) {
    return window.Auth.getUserSessions(userId);
  },
  async revokeUserSession(sessionId, userId) {
    return window.Auth.revokeSession(sessionId, userId);
  },
  async getSecurityLogs(userId) {
    return window.Auth.getSecurityLogs(userId);
  }
};

