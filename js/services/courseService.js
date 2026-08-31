/**
 * LearnHub Dedicated Course & Curriculum Service (v173.0.0)
 * Handles course discovery, filtering, progress tracking, and secure lesson completion.
 */

class CourseService {
  constructor() {
    this.cachedCourses = null;
  }

  async getCourses(filters = {}) {
    let courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
    
    if (window.CloudDB && window.CloudDB.firestore) {
      try {
        const snap = await window.CloudDB.firestore.collection('courses').where('status', '==', 'published').get();
        if (snap && !snap.empty) {
          const cloudCourses = [];
          snap.forEach(doc => cloudCourses.push({ id: doc.id, ...doc.data() }));
          if (cloudCourses.length > 0) {
            courses = cloudCourses;
          }
        }
      } catch (e) {}
    }

    if (filters.category && filters.category !== 'all') {
      courses = courses.filter(c => c.category === filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      courses = courses.filter(c => c.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      courses = courses.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) || 
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.instructor && c.instructor.toLowerCase().includes(q))
      );
    }

    this.cachedCourses = courses;
    return courses;
  }

  async getCourseById(courseId) {
    if (this.cachedCourses) {
      const found = this.cachedCourses.find(c => c.id === courseId);
      if (found) return found;
    }
    if (window.DB && typeof window.DB.findById === 'function') {
      const c = window.DB.findById('courses', courseId);
      if (c) return c;
    }
    return null;
  }

  async markLessonComplete(courseId, lessonId) {
    const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || null;
    if (!user) return { success: false, message: 'User not authenticated' };

    const progressKey = 'progress_' + user.id + '_' + courseId;
    let progress = {};
    try {
      progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    } catch(e) {}

    progress.completedLessons = progress.completedLessons || [];
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.lastCompletedAt = new Date().toISOString();
      progress.courseId = courseId;
      progress.userId = user.id;

      try {
        localStorage.setItem(progressKey, JSON.stringify(progress));
      } catch(e) {}

      if (window.CloudDB && typeof window.CloudDB.recordXpTransaction === 'function') {
        window.CloudDB.recordXpTransaction(user.id, 25, 'lesson_completed', 'Completed Lesson ' + lessonId);
      }
    }

    return { success: true, progress };
  }
}

window.CourseService = new CourseService();
