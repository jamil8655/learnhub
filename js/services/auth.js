/**
 * LearnHub Authentication & Role-Based Access Control (RBAC) Service
 * Production-ready client-side authentication with strict validation,
 * session persistence, and role guards.
 */

const AUTH_STORAGE_KEY = 'learnhub_session_user';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  /**
   * Load active user session from localStorage / sessionStorage.
   * If no valid stored session exists, returns null.
   */
  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && window.DB) {
          // Verify user still exists in DB and is active
          const userInDb = window.DB.findById('users', parsed.id);
          if (userInDb && userInDb.status === 'active') {
            return userInDb;
          }
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
    // No fallback default user: strictly unauthenticated
    return null;
  }

  /**
   * Set user session in storage and dispatch auth_changed event.
   */
  setSession(user, remember = true) {
    this.currentUser = user;
    if (user) {
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user } }));
  }

  /**
   * Clear active user session from memory and storage.
   */
  clearSession() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user: null } }));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser && this.currentUser.status === 'active';
  }

  isAdmin() {
    return this.isAuthenticated() && (this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin');
  }

  isInstructor() {
    return this.isAuthenticated() && (this.currentUser.role === 'instructor' || this.isAdmin());
  }

  isSuperAdmin() {
    return this.isAuthenticated() && this.currentUser.role === 'super_admin';
  }

  /**
   * Authenticate user against database records.
   */
  async login(email, password, remember = true) {
    if (!email || !password) {
      throw new Error('براہ کرم ای میل اور پاس ورڈ دونوں درج کریں۔ (Please provide email and password)');
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = (window.DB && typeof window.DB.get === 'function') ? window.DB.get('users') : [];
    const user = users.find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);

    if (!user) {
      throw new Error('ای میل یا پاس ورڈ درست نہیں ہے۔ (Invalid email or password)');
    }

    if (user.password !== password) {
      throw new Error('ای میل یا پاس ورڈ درست نہیں ہے۔ (Invalid email or password)');
    }

    if (user.status === 'suspended' || user.status === 'inactive') {
      throw new Error('یہ اکاؤنٹ معطل ہے۔ براہ کرم کسٹمر سپورٹ سے رابطہ کریں۔ (Account suspended)');
    }

    this.setSession(user, remember);
    if (window.DB && typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, 'USER_LOGIN', user.email);
    }
    return user;
  }

  /**
   * Register a new user with validation and store in database.
   */
  async register(name, email, password, role = 'student', autoLogin = true) {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanName) {
      throw new Error('براہ کرم اپنا پورا نام درج کریں۔ (Please enter your full name)');
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error('براہ کرم درست ای میل ایڈریس درج کریں۔ (Please enter a valid email)');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error('پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا ضروری ہے۔ (Password must be at least 6 characters)');
    }

    const users = (window.DB && typeof window.DB.get === 'function') ? window.DB.get('users') : [];
    const existing = users.find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);

    if (existing) {
      throw new Error('اس ای میل سے پہلے ہی ایک اکاؤنٹ موجود ہے۔ (An account with this email already exists)');
    }

    const allowedRoles = ['student', 'instructor', 'admin', 'super_admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'student';

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: assignedRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      headline: assignedRole === 'instructor' ? 'کورس استاد و محقق' : 'ماہر طالب علم • لرن ہب لرنر',
      bio: 'علم و ہنر کے سفر کا آغاز۔',
      status: 'active',
      learningStreak: 1,
      longestStreak: 1,
      totalPoints: 50,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true
    };

    if (window.DB) {
      window.DB.insert('users', newUser);
      if (typeof window.DB.logAudit === 'function') {
        window.DB.logAudit(newUser.name, 'USER_REGISTER', newUser.email);
      }

      // Send welcome notification
      window.DB.insert('notifications', {
        userId: newUser.id,
        type: 'welcome',
        title: '🎉 لرن ہب میں خوش آمدید!',
        message: 'کورسز دریافت کریں، ٹائمر والے کوئزز دیں اور اپنے تصدیق شدہ سرٹیفکیٹس حاصل کریں۔',
        link: '#/courses',
        read: false
      });
    }

    // Auto-login unless the creator is an active admin in admin portal
    if (autoLogin && (!this.isAuthenticated() || !this.isAdmin())) {
      this.setSession(newUser, true);
    }

    return newUser;
  }

  /**
   * Update active user profile in DB and active session.
   */
  async updateProfile(data) {
    if (!this.currentUser) {
      throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('غلط ڈیٹا فراہم کیا گیا۔ (Invalid profile data)');
    }

    // Protect sensitive fields from arbitrary modification
    const safeData = { ...data };
    delete safeData.id;
    delete safeData.password;
    delete safeData.createdAt;

    // Only administrators can change roles
    if (!this.isAdmin()) {
      delete safeData.role;
    }

    let updatedUser = { ...this.currentUser, ...safeData };

    if (window.DB) {
      updatedUser = window.DB.update('users', this.currentUser.id, safeData);
      if (typeof window.DB.logAudit === 'function') {
        window.DB.logAudit(updatedUser.name || this.currentUser.name, 'PROFILE_UPDATED', updatedUser.email);
      }
    }

    // Refresh active session and notify UI listeners
    const isRemembered = localStorage.getItem(AUTH_STORAGE_KEY) !== null;
    this.setSession(updatedUser, isRemembered);

    return updatedUser;
  }

  /**
   * Securely change user password after verifying current password.
   */
  async changePassword(oldPassword, newPassword) {
    if (!this.currentUser) {
      throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new Error('نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا ضروری ہے۔ (New password must be at least 6 characters)');
    }

    if (!window.DB) {
      throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');
    }

    const user = window.DB.findById('users', this.currentUser.id);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    if (user.password !== oldPassword) {
      throw new Error('موجودہ پاس ورڈ درست نہیں ہے۔ (Current password is incorrect)');
    }

    const updatedUser = window.DB.update('users', this.currentUser.id, { password: newPassword });
    this.currentUser = updatedUser;

    // Update storage if session active
    if (localStorage.getItem(AUTH_STORAGE_KEY)) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem(AUTH_STORAGE_KEY)) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(this.currentUser.name, 'PASSWORD_CHANGED', this.currentUser.email);
    }

    return true;
  }

  async requestPasswordReset(email) {
    if (!email) throw new Error('براہ کرم ای میل درج کریں۔ (Please enter email)');
    const cleanEmail = email.toLowerCase().trim();
    const user = window.DB ? window.DB.get('users').find(u => u.email && u.email.toLowerCase().trim() === cleanEmail) : null;
    if (user && typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, 'PASSWORD_RESET_REQUESTED', cleanEmail);
    }
    return true;
  }

  logout() {
    const name = this.currentUser?.name || 'User';
    const email = this.currentUser?.email || '';
    if (window.DB && typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(name, 'USER_LOGOUT', email);
    }
    this.clearSession();
  }
}

window.Auth = new AuthService();
