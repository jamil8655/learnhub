/**
 * LearnHub Authentication & Role-Based Access Control (RBAC) Service
 */

const AUTH_STORAGE_KEY = 'learnhub_session_user';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify user still exists in DB
        const userInDb = window.DB.findById('users', parsed.id);
        if (userInDb && userInDb.status === 'active') {
          return userInDb;
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
    // Default to student demo user for instant interactive exploration if empty
    const defaultUser = window.DB.findById('users', 'usr-1');
    if (defaultUser) {
      this.setSession(defaultUser, true);
      return defaultUser;
    }
    return null;
  }

  setSession(user, remember = true) {
    this.currentUser = user;
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user } }));
  }

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

  async login(email, password, remember = true) {
    const users = window.DB.get('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'suspended') {
      throw new Error('This account has been suspended. Please contact support.');
    }

    this.setSession(user, remember);
    window.DB.logAudit(user.name, 'USER_LOGIN', user.email);
    return user;
  }

  async register(name, email, password, role = 'student') {
    const users = window.DB.get('users');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: ['student', 'instructor'].includes(role) ? role : 'student',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      headline: 'Passionate Learner',
      bio: 'Ready to build new skills on LearnHub.',
      status: 'active',
      learningStreak: 1,
      longestStreak: 1,
      totalPoints: 50,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true
    };

    window.DB.insert('users', newUser);
    this.setSession(newUser, true);
    window.DB.logAudit(newUser.name, 'USER_REGISTER', newUser.email);

    // Send welcome notification
    window.DB.insert('notifications', {
      userId: newUser.id,
      type: 'welcome',
      title: '🎉 Welcome to LearnHub!',
      message: 'Explore courses, challenge yourself with standalone quizzes, and start earning certificates today.',
      link: '#/explore',
      read: false
    });

    return newUser;
  }

  async updateProfile(updates) {
    if (!this.currentUser) throw new Error('Not authenticated');

    const updatedUser = window.DB.update('users', this.currentUser.id, updates);
    this.currentUser = updatedUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user: updatedUser } }));
    window.DB.logAudit(updatedUser.name, 'PROFILE_UPDATED', updatedUser.email);
    return updatedUser;
  }

  async changePassword(currentPassword, newPassword) {
    if (!this.currentUser) throw new Error('Not authenticated');

    const user = window.DB.findById('users', this.currentUser.id);
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect.');
    }

    window.DB.update('users', this.currentUser.id, { password: newPassword });
    window.DB.logAudit(this.currentUser.name, 'PASSWORD_CHANGED', this.currentUser.email);
    return true;
  }

  async requestPasswordReset(email) {
    const user = window.DB.get('users').find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      // Return true to avoid leaking user email existence
      return true;
    }
    // Simulation: Create audit log
    window.DB.logAudit(user.name, 'PASSWORD_RESET_REQUESTED', email);
    return true;
  }

  logout() {
    const name = this.currentUser?.name || 'User';
    window.DB.logAudit(name, 'USER_LOGOUT', this.currentUser?.email || '');
    this.clearSession();
  }

  // Quick switch for development / paired testing
  quickSwitchUser(role) {
    let user;
    if (role === 'student') user = window.DB.findById('users', 'usr-1');
    if (role === 'instructor') user = window.DB.findById('users', 'usr-2');
    if (role === 'admin' || role === 'super_admin') user = window.DB.findById('users', 'usr-3');

    if (user) {
      this.setSession(user, true);
      return user;
    }
    return null;
  }
}

window.Auth = new AuthService();
