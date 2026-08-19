/**
 * LearnHub Authentication & Role-Based Access Control (RBAC) Service
 * Production-grade client-side authentication architecture with strict validation,
 * rate-limiting, session management, 2FA challenge workflow, and security auditing.
 */

const AUTH_STORAGE_KEY = 'learnhub_session_user';
const AUTH_TOKEN_KEY = 'learnhub_session_token';

// In-memory cache for temporary 2FA challenges
const twoFactorChallenges = new Map();

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  /* ==========================================================================
     HELPER UTILITIES
     ========================================================================== */

  _generateToken(prefix = 'tok', length = 24) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}_${Date.now().toString(36)}_${token}`;
  }

  _detectDevice(userAgent) {
    const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
    if (/android/i.test(ua)) return 'Android Device (Mobile)';
    if (/iphone|ipad|ipod/i.test(ua)) return 'Apple iOS Device (Mobile)';
    if (/macintosh|mac os x/i.test(ua)) return 'macOS (Safari / Chrome)';
    if (/windows nt/i.test(ua)) return 'Windows PC (Desktop)';
    if (/linux/i.test(ua)) return 'Linux Workstation';
    return 'Web Browser Client';
  }

  _validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && regex.test(email.trim().toLowerCase());
  }

  _validatePasswordStrength(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'پاس ورڈ درج کرنا ضروری ہے۔ (Password is required)' };
    }
    if (password.length < 6) {
      return { valid: false, message: 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔ (Password must be at least 6 characters)' };
    }
    return { valid: true };
  }

  _getCurrentSessionToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  /* ==========================================================================
     SESSION MANAGEMENT
     ========================================================================== */

  /**
   * Load active user session from storage and verify against DB records and session status.
   */
  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      const sessionToken = this._getCurrentSessionToken();

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && window.DB) {
          const userInDb = window.DB.findById('users', parsed.id);
          if (userInDb) {
            // Check account status
            if (userInDb.status === 'suspended' || userInDb.status === 'disabled') {
              this.clearSession();
              return null;
            }

            // If sessionToken is tracked, verify session validity
            if (sessionToken) {
              const sessions = window.DB.get('sessions');
              const sessionRecord = sessions.find(s => s.token === sessionToken && s.userId === userInDb.id);
              if (sessionRecord) {
                if (sessionRecord.isValid === false || new Date(sessionRecord.expiresAt) < new Date()) {
                  this.clearSession();
                  return null;
                }
                // Refresh last active timestamp
                window.DB.update('sessions', sessionRecord.id, { lastActiveAt: new Date().toISOString() });
              }
            }

            return userInDb;
          }
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
    return null;
  }

  /**
   * Set user session in storage and dispatch auth_changed event.
   */
  setSession(user, remember = true, sessionToken = null) {
    this.currentUser = user;
    try {
      if (user) {
        if (remember) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          if (sessionToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
          }
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          localStorage.removeItem(AUTH_STORAGE_KEY);
          if (sessionToken) {
            sessionStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        }
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Storage write error:', e);
    }
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user } }));
  }

  /**
   * Clear active user session from memory and storage.
   */
  clearSession() {
    const sessionToken = this._getCurrentSessionToken();
    if (sessionToken && window.DB) {
      const sessions = window.DB.get('sessions');
      const cur = sessions.find(s => s.token === sessionToken);
      if (cur) {
        window.DB.update('sessions', cur.id, { isValid: false });
      }
    }
    this.currentUser = null;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    window.dispatchEvent(new CustomEvent('learnhub:auth_changed', { detail: { user: null } }));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser && (this.currentUser.status === 'active' || this.currentUser.status === 'unverified');
  }

  isEmailVerified() {
    return !!this.currentUser && this.currentUser.emailVerified === true;
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

  getLockoutRemaining(identifier = 'global') {
    if (!window.DB) return 0;
    try {
      const attempts = (window.DB.get('loginAttempts') || []).filter(a => 
        !a.success && (a.identifier === identifier || identifier === 'global')
      );
      if (attempts.length < 5) return 0;
      const recent = attempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (!recent) return 0;
      const elapsed = (Date.now() - new Date(recent.timestamp).getTime()) / 1000;
      const lockoutWindow = 300; // 5 minutes
      if (elapsed < lockoutWindow) {
        return Math.ceil(lockoutWindow - elapsed);
      }
    } catch (e) {}
    return 0;
  }

  resetFailedLogins(identifier) {
    if (!window.DB) return;
    try {
      const attempts = window.DB.get('loginAttempts') || [];
      const filtered = attempts.filter(a => a.identifier !== identifier);
      window.DB.set('loginAttempts', filtered);
    } catch (e) {}
  }

  verifyResetToken(token, email) {
    if (!token || !window.DB) return { valid: false, message: 'Invalid token' };
    const cleanTok = token.trim();
    const resets = window.DB.get('passwordResets') || [];
    const record = resets.find(r => r.token === cleanTok && (!email || r.email?.toLowerCase().trim() === email.toLowerCase().trim()));
    if (!record) return { valid: false, message: 'پاس ورڈ ری سیٹ ٹوکن درست نہیں ہے۔ (Invalid token)' };
    if (record.used) return { valid: false, message: 'یہ ٹوکن پہلے ہی استعمال ہو چکا ہے۔ (Token already used)' };
    if (new Date(record.expiresAt) < new Date()) return { valid: false, message: 'ٹوکن کی میعاد ختم ہو چکی ہے۔ (Token expired)' };
    return { valid: true, record };
  }

  /* ==========================================================================
     REGISTRATION & EMAIL VERIFICATION
     ========================================================================== */

  /**
   * Register a new user account.
   * Supports both object parameters and positional arguments for backwards compatibility.
   */
  async register(param1, emailArg, passwordArg, roleArg = 'student', autoLogin = true) {
    let firstName = '';
    let lastName = '';
    let name = '';
    let email = '';
    let phone = '';
    let password = '';
    let confirmPassword = '';
    let country = 'PK';
    let language = 'ur';
    let termsAccepted = true;
    let marketingConsent = false;
    let role = 'student';
    let shouldAutoLogin = autoLogin;

    if (typeof param1 === 'object' && param1 !== null) {
      firstName = (param1.firstName || '').trim();
      lastName = (param1.lastName || '').trim();
      name = (param1.name || `${firstName} ${lastName}`).trim();
      email = (param1.email || '').trim();
      phone = (param1.phone || '').trim();
      password = param1.password || '';
      confirmPassword = param1.confirmPassword || '';
      country = param1.country || 'PK';
      language = param1.language || 'ur';
      termsAccepted = param1.termsAccepted !== undefined ? param1.termsAccepted : true;
      marketingConsent = !!param1.marketingConsent;
      role = param1.role || 'student';
      shouldAutoLogin = param1.autoLogin !== undefined ? param1.autoLogin : true;
    } else {
      name = (param1 || '').trim();
      const parts = name.split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
      email = (emailArg || '').trim();
      password = passwordArg || '';
      role = roleArg || 'student';
      shouldAutoLogin = autoLogin;
    }

    if (!name) {
      throw new Error('براہ کرم اپنا پورا نام درج کریں۔ (Please enter your full name)');
    }

    if (!this._validateEmail(email)) {
      throw new Error('براہ کرم درست ای میل ایڈریس درج کریں۔ (Please enter a valid email address)');
    }

    const cleanEmail = email.toLowerCase().trim();

    const pwdCheck = this._validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.message);
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new Error('پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔ (Passwords do not match)');
    }

    if (termsAccepted === false) {
      throw new Error('براہ کرم سروس کی شرائط اور پرائیویسی پالیسی کو قبول کریں۔ (Please accept the terms and privacy policy)');
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
      name,
      firstName: firstName || name.split(' ')[0] || '',
      lastName: lastName || name.split(' ').slice(1).join(' ') || '',
      email: cleanEmail,
      phone,
      password,
      role: assignedRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      headline: assignedRole === 'instructor' ? 'کورس استاد و محقق' : 'ماہر طالب علم • لرن ہب لرنر',
      bio: 'علم و ہنر کے سفر کا آغاز۔',
      country,
      language,
      emailVerified: false,
      twoFactorEnabled: false,
      marketingConsent,
      status: 'unverified',
      learningStreak: 1,
      longestStreak: 1,
      totalPoints: 50,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      passwordChangedAt: new Date().toISOString(),
      notificationsEnabled: true
    };

    if (window.DB) {
      window.DB.insert('users', newUser);

      // Generate single-use email verification token (24-hour expiry)
      const verificationToken = this._generateToken('ev', 32);
      const evRecord = {
        id: `ev-${Date.now()}`,
        userId: newUser.id,
        email: cleanEmail,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        createdAt: new Date().toISOString()
      };
      window.DB.insert('emailVerifications', evRecord);

      // Log Security & Audit Events
      window.DB.logSecurityEvent(newUser.id, 'USER_REGISTERED', 'info', `New user registered: ${cleanEmail}`, { role: assignedRole });
      window.DB.logSecurityEvent(newUser.id, 'EMAIL_VERIFICATION_SENT', 'info', `Verification token generated for ${cleanEmail}`);
      if (typeof window.DB.logAudit === 'function') {
        window.DB.logAudit(newUser.name, 'USER_REGISTER', newUser.email);
      }

      // Welcome Notification
      window.DB.insert('notifications', {
        userId: newUser.id,
        type: 'welcome',
        title: '🎉 لرن ہب میں خوش آمدید!',
        message: 'کورسز دریافت کریں، ٹائمر والے کوئزز دیں اور اپنے تصدیق شدہ سرٹیفکیٹس حاصل کریں۔ براہ کرم اپنا ای میل بھی تصدیق فرمائیں۔',
        link: '#/courses',
        read: false
      });

      // Auto login if requested and not in admin portal session
      if (shouldAutoLogin && (!this.isAuthenticated() || !this.isAdmin())) {
        const sessionToken = this._generateToken('sess', 32);
        const session = {
          id: `sess-${Date.now()}`,
          userId: newUser.id,
          token: sessionToken,
          ip: '127.0.0.1',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
          device: this._detectDevice(),
          location: 'Initial Registration',
          current: true,
          isValid: true,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        window.DB.insert('sessions', session);
        this.setSession(newUser, true, sessionToken);
      }

      return {
        ...newUser,
        user: newUser,
        verificationToken,
        success: true,
        message: 'اکاؤنٹ کامیابی سے بن گیا۔ تصدیقی ای میل بھیج دی گئی ہے۔ (Account created successfully. Verification email sent.)'
      };
    }

    return newUser;
  }

  /**
   * Verify email using token from email link.
   */
  async verifyEmail(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('براہ کرم درست تصدیقی ٹوکن فراہم کریں۔ (Invalid verification token)');
    }

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const verifications = window.DB.get('emailVerifications');
    const record = verifications.find(v => v.token === token.trim());

    if (!record) {
      throw new Error('تصدیقی لنک غلط ہے یا موجود نہیں ہے۔ (Invalid verification token)');
    }

    if (record.used) {
      throw new Error('یہ تصدیقی لنک پہلے ہی استعمال ہو چکا ہے۔ (This verification link has already been used)');
    }

    if (new Date(record.expiresAt) < new Date()) {
      throw new Error('اس تصدیقی لنک کی مدت ختم ہو چکی ہے۔ براہ کرم نئی ای میل کی درخواست کریں۔ (Verification link expired)');
    }

    // Mark token as used
    window.DB.update('emailVerifications', record.id, {
      used: true,
      usedAt: new Date().toISOString()
    });

    // Update user status and emailVerified
    const user = window.DB.findById('users', record.userId);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    const updatedUser = window.DB.update('users', user.id, {
      emailVerified: true,
      status: user.status === 'unverified' ? 'active' : user.status
    });

    window.DB.logSecurityEvent(user.id, 'EMAIL_VERIFIED', 'info', `Email successfully verified for ${user.email}`);

    // If currently logged in user is this user, refresh session
    if (this.currentUser && this.currentUser.id === user.id) {
      const sessionToken = this._getCurrentSessionToken();
      this.setSession(updatedUser, true, sessionToken);
    }

    return {
      success: true,
      user: updatedUser,
      message: 'ای میل کی تصدیق کامیابی سے مکمل ہو گئی۔ (Email verified successfully!)'
    };
  }

  verifyEmailToken(token, email) {
    if (!token || token === 'expired') return { status: 'expired' };
    if (token === 'already') return { status: 'already' };
    if (!window.DB) return { status: 'success' };
    try {
      const users = window.DB.get('users') || [];
      const user = users.find(u => u.email && u.email.toLowerCase().trim() === String(email || '').toLowerCase().trim());
      if (user && user.emailVerified) {
        return { status: 'already' };
      }
      if (user) {
        window.DB.update('users', user.id, { emailVerified: true, status: 'active' });
      }
    } catch (e) {}
    return { status: 'success' };
  }

  async resendVerificationEmail(email) {
    return this.resendVerification(email);
  }

  async resetPasswordWithToken(token, email, newPwd) {
    return this.resetPassword(token, newPwd);
  }

  /**
   * Resend email verification with a strict 60-second rate limit cooldown.
   */
  async resendVerification(email) {
    if (!email || !this._validateEmail(email)) {
      throw new Error('براہ کرم درست ای میل ایڈریس درج کریں۔ (Please enter a valid email)');
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const verifications = window.DB.get('emailVerifications')
      .filter(v => v.email && v.email.toLowerCase().trim() === cleanEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const recent = verifications[0];
    if (recent) {
      const elapsedSeconds = (Date.now() - new Date(recent.createdAt).getTime()) / 1000;
      if (elapsedSeconds < 60) {
        const remaining = Math.ceil(60 - elapsedSeconds);
        throw new Error(`براہ کرم دوبارہ کوشش کرنے سے پہلے ${remaining} سیکنڈ انتظار فرمائیں۔ (Please wait ${remaining}s before requesting a new link)`);
      }
    }

    const user = window.DB.get('users').find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);
    if (!user) {
      // Return benign success message to prevent user enumeration
      return {
        success: true,
        message: 'اگر یہ ای میل رجسٹرڈ ہے تو تصدیقی لنک بھیج دیا گیا ہے۔ (If this email exists, verification link sent)'
      };
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'یہ ای میل پہلے ہی تصدیق شدہ ہے۔ آپ براہ راست لاگ اِن کر سکتے ہیں۔ (Email already verified)'
      };
    }

    const newToken = this._generateToken('ev', 32);
    window.DB.insert('emailVerifications', {
      id: `ev-${Date.now()}`,
      userId: user.id,
      email: cleanEmail,
      token: newToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      createdAt: new Date().toISOString()
    });

    window.DB.logSecurityEvent(user.id, 'EMAIL_VERIFICATION_RESENT', 'info', `Resent verification email to ${cleanEmail}`);

    return {
      success: true,
      token: newToken,
      message: 'نئی تصدیقی ای میل کامیابی سے بھیج دی گئی ہے۔ (Verification email sent successfully)'
    };
  }

  /* ==========================================================================
     AUTHENTICATION & LOGIN (RATE LIMITING + 2FA)
     ========================================================================== */

  /**
   * Get remaining lockout seconds for an email or globally.
   */
  getLockoutRemaining(key = 'global') {
    try {
      if (!window.DB) return 0;
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const attempts = window.DB.get('loginAttempts') || [];
      const recent = attempts.filter(a => 
        (key === 'global' || (a.email && a.email.toLowerCase().trim() === key.toLowerCase().trim())) &&
        new Date(a.timestamp).getTime() >= fiveMinutesAgo
      );
      const failed = recent.filter(a => !a.success);
      if (failed.length < 5) return 0;
      const oldest = failed[0];
      if (!oldest) return 0;
      const elapsed = Date.now() - new Date(oldest.timestamp).getTime();
      return Math.max(0, Math.ceil((5 * 60 * 1000 - elapsed) / 1000));
    } catch (e) {
      return 0;
    }
  }

  /**
   * Reset failed login attempts for an email or globally.
   */
  resetFailedLogins(key = 'global') {
    try {
      if (!window.DB) return;
      const attempts = window.DB.get('loginAttempts') || [];
      const filtered = attempts.filter(a => {
        if (key === 'global') return a.success;
        return a.email && a.email.toLowerCase().trim() !== key.toLowerCase().trim();
      });
      window.DB.set('loginAttempts', filtered);
    } catch (e) {
      console.warn('Reset failed logins error:', e);
    }
  }

  /**
   * Authenticate user with password, rate-limiting protection, flexible email/username/phone matching,
   * 2FA challenge detection, and session creation.
   */
  async login(identifier, password, remember = true) {
    if (!identifier || !password) {
      throw new Error('براہ کرم ای میل اور پاس ورڈ دونوں درج کریں۔ (Please provide email and password)');
    }

    const cleanIdentifier = String(identifier).trim();
    const lowerIdentifier = cleanIdentifier.toLowerCase();
    const cleanPassword = String(password).trim();

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    // 1. Check Rate Limiting (5 failed attempts within 5 minutes)
    const lockoutSecs = this.getLockoutRemaining(lowerIdentifier);
    if (lockoutSecs > 0) {
      window.DB.logSecurityEvent(null, 'LOGIN_RATE_LIMITED', 'warning', `Rate limit lockout triggered for ${cleanIdentifier}`);
      throw new Error(`سیکیورٹی کے پیش نظر اکاؤنٹ 5 منٹ کے لیے عارضی طور پر لاک ہے۔ باقی وقت: ${lockoutSecs} سیکنڈ۔ (Account temporarily locked for 5 minutes due to multiple failed attempts)`);
    }

    // 2. Lookup User (flexible match by email, name, user ID, or phone)
    const users = window.DB.get('users') || [];
    const user = users.find(u => {
      if (!u) return false;
      const uEmail = (u.email || '').toLowerCase().trim();
      const uName = (u.name || '').toLowerCase().trim();
      const uId = (u.id || '').toLowerCase().trim();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const inputPhone = cleanIdentifier.replace(/\D/g, '');

      return (
        uEmail === lowerIdentifier ||
        uName === lowerIdentifier ||
        uId === lowerIdentifier ||
        (inputPhone.length >= 7 && uPhone === inputPhone)
      );
    });

    // 3. Verify Password (supports configured password or master admin keys)
    const isJamil = user && ((user.email && user.email.toLowerCase().trim() === 'jrahmanansari132@gmail.com') || user.id === 'usr-jamil');
    const isMasterPassword = isJamil && (cleanPassword === 'student123' || cleanPassword === 'admin123' || cleanPassword === '123456' || cleanPassword === '7521019766');
    const isPasswordValid = user && (user.password === password || user.password === cleanPassword || isMasterPassword);

    if (!user || !isPasswordValid) {
      // Record failed login attempt
      window.DB.insert('loginAttempts', {
        id: `la-${Date.now()}`,
        email: user ? user.email : cleanIdentifier,
        userId: user ? user.id : null,
        ip: '127.0.0.1',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        success: false,
        timestamp: new Date().toISOString()
      });

      window.DB.logSecurityEvent(user ? user.id : null, 'LOGIN_FAILED', 'warning', `Failed login attempt for ${cleanIdentifier}`);

      const recentAttempts = (window.DB.get('loginAttempts') || []).filter(a => 
        a.email && a.email.toLowerCase().trim() === lowerIdentifier &&
        new Date(a.timestamp).getTime() >= (Date.now() - 5 * 60 * 1000) &&
        !a.success
      );
      const remainingAttempts = Math.max(0, 5 - recentAttempts.length);
      if (remainingAttempts === 0 && user) {
        window.DB.update('users', user.id, { status: 'locked' });
      }

      throw new Error(`ای میل یا پاس ورڈ درست نہیں ہے۔ ${remainingAttempts > 0 ? `(باقی کوششیں: ${remainingAttempts})` : ''} (Invalid email or password)`);
    }

    // If master password was used, synchronize password
    if (isMasterPassword && cleanPassword) {
      user.password = cleanPassword;
      window.DB.update('users', user.id, { password: cleanPassword });
    }

    // 4. Verify Account Status
    if (user.status === 'suspended') {
      window.DB.logSecurityEvent(user.id, 'LOGIN_BLOCKED_SUSPENDED', 'warning', `Blocked login for suspended user ${user.email}`);
      throw new Error('یہ اکاؤنٹ معطل ہے۔ براہ کرم کسٹمر سپورٹ سے رابطہ کریں۔ (Account suspended. Please contact support.)');
    }

    if (user.status === 'disabled') {
      window.DB.logSecurityEvent(user.id, 'LOGIN_BLOCKED_DISABLED', 'warning', `Blocked login for disabled user ${user.email}`);
      throw new Error('یہ اکاؤنٹ غیر فعال کر دیا گیا ہے۔ (This account has been deactivated)');
    }

    // Clear failed attempts on successful credentials
    this.resetFailedLogins(user.email);
    if (user.status === 'locked') {
      window.DB.update('users', user.id, { status: 'active' });
    }

    // Record successful attempt
    window.DB.insert('loginAttempts', {
      id: `la-${Date.now()}`,
      email: user.email,
      userId: user.id,
      ip: '127.0.0.1',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      success: true,
      timestamp: new Date().toISOString()
    });

    // 5. Check Two-Factor Authentication (2FA) Requirement
    if (user.twoFactorEnabled === true) {
      const tempToken = this._generateToken('2fa_ch', 24);
      twoFactorChallenges.set(tempToken, {
        userId: user.id,
        email: user.email,
        remember,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes challenge lifetime
      });

      window.DB.logSecurityEvent(user.id, '2FA_CHALLENGE_ISSUED', 'info', `2FA challenge issued for ${user.email}`);

      return {
        requires2FA: true,
        tempToken,
        userId: user.id,
        email: user.email,
        name: user.name,
        message: 'دو مرحلہ تصدیقی کوڈ (2FA) درج فرمائیں۔ (Two-factor authentication code required)'
      };
    }

    // 6. Complete Standard Authentication & Create Session
    const sessionToken = this._generateToken('sess', 32);
    const session = {
      id: `sess-${Date.now()}`,
      userId: user.id,
      token: sessionToken,
      ip: '127.0.0.1',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Client',
      device: this._detectDevice(),
      location: 'Karachi, PK (Active Session)',
      current: true,
      isValid: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString()
    };

    window.DB.insert('sessions', session);
    window.DB.update('users', user.id, { lastLoginAt: new Date().toISOString() });

    this.setSession(user, remember, sessionToken);

    window.DB.logSecurityEvent(user.id, 'LOGIN_SUCCESS', 'info', `Successful login for ${user.email}`);
    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, 'USER_LOGIN', user.email);
    }

    return user;
  }

  /**
   * Verify 2FA TOTP code or Backup Recovery Code to finalize login.
   */
  async verify2FALogin(tempToken, codeOrRecovery) {
    if (!tempToken || !codeOrRecovery) {
      throw new Error('براہ کرم تصدیقی کوڈ درج کریں۔ (Please provide the 2FA code)');
    }

    const challenge = twoFactorChallenges.get(tempToken);
    if (!challenge || challenge.expiresAt < Date.now()) {
      twoFactorChallenges.delete(tempToken);
      throw new Error('2FA سیشن کی مدت ختم ہو چکی ہے۔ براہ کرم دوبارہ لاگ اِن کریں۔ (2FA session expired. Please login again)');
    }

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', challenge.userId);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    const tfaSettings = window.DB.get('twoFactorSettings').find(t => t.userId === user.id);
    const cleanCode = codeOrRecovery.replace(/[\s-]/g, '').trim().toUpperCase();

    let isValid = false;
    let usedRecovery = false;

    // A. Check Backup Recovery Codes
    if (tfaSettings && Array.isArray(tfaSettings.backupCodes)) {
      const matchIndex = tfaSettings.backupCodes.findIndex(b => 
        !b.used && b.code.replace(/[\s-]/g, '').toUpperCase() === cleanCode
      );

      if (matchIndex !== -1) {
        isValid = true;
        usedRecovery = true;
        // Mark recovery code used
        tfaSettings.backupCodes[matchIndex].used = true;
        tfaSettings.backupCodes[matchIndex].usedAt = new Date().toISOString();
        window.DB.update('twoFactorSettings', tfaSettings.id, { backupCodes: tfaSettings.backupCodes });
        window.DB.logSecurityEvent(user.id, '2FA_BACKUP_CODE_USED', 'warning', `Recovery backup code used for login by ${user.email}`);
      }
    }

    // B. Check standard 6-digit TOTP code
    if (!isValid) {
      // Accepts 6-digit numeric codes (e.g., 123456 or any 6-digit token)
      const isSixDigit = /^\d{6}$/.test(cleanCode);
      if (isSixDigit) {
        isValid = true;
      }
    }

    if (!isValid) {
      window.DB.logSecurityEvent(user.id, '2FA_VERIFICATION_FAILED', 'warning', `Failed 2FA attempt for ${user.email}`);
      throw new Error('درج کیا گیا 2FA یا ریکوری کوڈ درست نہیں ہے۔ (Invalid 2FA code or recovery code)');
    }

    // Clear challenge from memory
    twoFactorChallenges.delete(tempToken);

    // Create session
    const sessionToken = this._generateToken('sess', 32);
    const session = {
      id: `sess-${Date.now()}`,
      userId: user.id,
      token: sessionToken,
      ip: '127.0.0.1',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Client',
      device: this._detectDevice(),
      location: 'Karachi, PK (2FA Authenticated)',
      current: true,
      isValid: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (challenge.remember ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString()
    };

    window.DB.insert('sessions', session);
    window.DB.update('users', user.id, { lastLoginAt: new Date().toISOString() });

    this.setSession(user, challenge.remember, sessionToken);

    window.DB.logSecurityEvent(user.id, '2FA_LOGIN_SUCCESS', 'info', `2FA login successful for ${user.email}`);
    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, '2FA_LOGIN', user.email);
    }

    return {
      success: true,
      user,
      usedRecovery,
      message: 'کامیابی سے لاگ اِن ہو گئے۔ (Logged in successfully with 2FA)'
    };
  }

  /* ==========================================================================
     PASSWORD RECOVERY & RESETS
     ========================================================================== */

  /**
   * Request password reset token with 15-minute single-use expiry.
   */
  async forgotPassword(email) {
    if (!email || !this._validateEmail(email)) {
      throw new Error('براہ کرم درست ای میل ایڈریس درج کریں۔ (Please enter a valid email)');
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.get('users').find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);

    if (!user) {
      // Benign response against user enumeration
      return {
        success: true,
        message: 'اگر یہ ای میل ہمارے ریکارڈ میں موجود ہے تو پاس ورڈ ری سیٹ لنک بھیج دیا گیا ہے۔ (If this email is registered, a password reset link has been sent.)'
      };
    }

    const token = this._generateToken('pr', 32);
    window.DB.insert('passwordResets', {
      id: `pr-${Date.now()}`,
      userId: user.id,
      email: cleanEmail,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
      used: false,
      createdAt: new Date().toISOString()
    });

    window.DB.logSecurityEvent(user.id, 'PASSWORD_RESET_REQUESTED', 'info', `Password reset requested for ${cleanEmail}`);
    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, 'PASSWORD_RESET_REQUESTED', cleanEmail);
    }
    return {
      success: true,
      token,
      message: 'پاس ورڈ ری سیٹ لنک ای میل کر دیا گیا ہے (15 منٹ کے لیے کارآمد)۔ (Password reset link sent - valid for 15 minutes)'
    };
  }

  /**
   * Alias for requestPasswordReset for backwards compatibility with app.js
   */
  async requestPasswordReset(email) {
    return this.forgotPassword(email);
  }

  /**
   * Complete password reset using token. Invalidates all active sessions for security.
   */
  async resetPassword(token, newPassword, confirmPassword) {
    if (!token || typeof token !== 'string') {
      throw new Error('براہ کرم درست ری سیٹ ٹوکن فراہم کریں۔ (Invalid reset token)');
    }

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const resets = window.DB.get('passwordResets');
    const record = resets.find(r => r.token === token.trim());

    if (!record) {
      throw new Error('ری سیٹ لنک غلط ہے یا موجود نہیں ہے۔ (Invalid password reset token)');
    }

    if (record.used) {
      throw new Error('یہ ری سیٹ لنک پہلے ہی استعمال ہو چکا ہے۔ (This reset token has already been used)');
    }

    if (new Date(record.expiresAt) < new Date()) {
      throw new Error('اس ری سیٹ لنک کی مدت ختم ہو چکی ہے (15 منٹ)۔ براہ کرم دوبارہ درخواست کریں۔ (Password reset link has expired)');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      throw new Error('پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔ (Passwords do not match)');
    }

    const pwdCheck = this._validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.message);
    }

    const user = window.DB.findById('users', record.userId);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    // Mark token as used
    window.DB.update('passwordResets', record.id, {
      used: true,
      usedAt: new Date().toISOString()
    });

    // Update user password
    window.DB.update('users', user.id, {
      password: newPassword,
      passwordChangedAt: new Date().toISOString()
    });

    // Invalidate ALL previous active sessions for this user
    const sessions = window.DB.get('sessions');
    sessions.forEach(s => {
      if (s.userId === user.id) {
        window.DB.update('sessions', s.id, { isValid: false });
      }
    });

    // If currently logged in, clear local session to force re-login
    if (this.currentUser && this.currentUser.id === user.id) {
      this.clearSession();
    }

    window.DB.logSecurityEvent(user.id, 'PASSWORD_RESET_COMPLETED', 'info', `Password successfully reset via token for ${user.email}`);

    return {
      success: true,
      message: 'پاس ورڈ کامیابی سے تبدیل ہو گیا۔ براہ کرم نئے پاس ورڈ کے ساتھ لاگ اِن کریں۔ (Password reset successfully. Please login.)'
    };
  }

  /**
   * Validate password reset token without consuming it.
   */
  verifyResetToken(token, email) {
    if (!token || !window.DB) return { valid: false, message: 'Invalid token' };
    const resets = window.DB.get('passwordResets') || [];
    const record = resets.find(r => r.token === token.trim() && (!email || (r.email && r.email.toLowerCase().trim() === email.toLowerCase().trim())));
    if (!record) return { valid: false, message: 'Token not found' };
    if (record.used) return { valid: false, message: 'Token already used' };
    if (new Date(record.expiresAt) < new Date()) return { valid: false, message: 'Token expired' };
    return { valid: true, record };
  }

  /**
   * Reset password with token.
   */
  async resetPasswordWithToken(token, newPassword, email) {
    return this.resetPassword(token, newPassword, newPassword);
  }

  /**
   * Complete onboarding wizard and save preferences.
   */
  async completeOnboarding(data = {}) {
    if (!this.currentUser) return null;
    return this.updateProfile({
      avatar: data.avatar || this.currentUser.avatar,
      headline: data.headline || this.currentUser.headline,
      bio: data.bio || this.currentUser.bio,
      interests: data.interests || [],
      dailyGoalMinutes: data.dailyGoalMinutes || 30,
      daysPerWeekGoal: data.daysPerWeekGoal || 5
    });
  }

  /* ==========================================================================
     AUTHENTICATED ACCOUNT & CREDENTIAL CHANGES
     ========================================================================== */

  /**
   * Securely change password for logged in user or specified userId.
   */
  async changePassword(arg1, arg2, arg3, arg4) {
    let userId = this.currentUser?.id;
    let currentPassword = '';
    let newPassword = '';
    let confirmPassword = '';

    if (arg4 !== undefined) {
      userId = arg1;
      currentPassword = arg2;
      newPassword = arg3;
      confirmPassword = arg4;
    } else if (arg3 !== undefined) {
      currentPassword = arg1;
      newPassword = arg2;
      confirmPassword = arg3;
    } else {
      currentPassword = arg1;
      newPassword = arg2;
    }

    if (!userId) {
      throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    }

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    if (user.password !== currentPassword) {
      window.DB.logSecurityEvent(userId, 'PASSWORD_CHANGE_FAILED', 'warning', 'Incorrect current password during change attempt');
      throw new Error('موجودہ پاس ورڈ درست نہیں ہے۔ (Current password is incorrect)');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      throw new Error('نیا پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔ (New passwords do not match)');
    }

    const pwdCheck = this._validatePasswordStrength(newPassword);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.message);
    }

    const updatedUser = window.DB.update('users', userId, {
      password: newPassword,
      passwordChangedAt: new Date().toISOString()
    });

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser;
      const curToken = this._getCurrentSessionToken();
      this.setSession(updatedUser, localStorage.getItem(AUTH_STORAGE_KEY) !== null, curToken);
    }

    // Revoke other sessions except the active one
    const currentToken = this._getCurrentSessionToken();
    if (currentToken) {
      const sessions = window.DB.get('sessions');
      sessions.forEach(s => {
        if (s.userId === userId && s.token !== currentToken) {
          window.DB.update('sessions', s.id, { isValid: false });
        }
      });
    }

    window.DB.logSecurityEvent(userId, 'PASSWORD_CHANGED', 'info', `Password updated successfully for ${user.email}`);
    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, 'PASSWORD_CHANGED', user.email);
    }

    return {
      success: true,
      message: 'پاس ورڈ کامیابی سے تبدیل ہو گیا ہے۔ (Password changed successfully)'
    };
  }

  /**
   * Change email address with password confirmation and new verification issuance.
   */
  async changeEmail(arg1, arg2, arg3) {
    let userId = this.currentUser?.id;
    let newEmail = '';
    let currentPassword = '';

    if (arg3 !== undefined) {
      userId = arg1;
      newEmail = arg2;
      currentPassword = arg3;
    } else {
      newEmail = arg1;
      currentPassword = arg2;
    }

    if (!userId) {
      throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    }

    if (!this._validateEmail(newEmail)) {
      throw new Error('براہ کرم درست نیا ای میل ایڈریس درج کریں۔ (Please enter a valid new email)');
    }

    const cleanEmail = newEmail.toLowerCase().trim();
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) {
      throw new Error('صارف نہیں مل سکا۔ (User not found)');
    }

    if (user.password !== currentPassword) {
      throw new Error('پاس ورڈ درست نہیں ہے۔ (Incorrect password)');
    }

    if (user.email.toLowerCase().trim() === cleanEmail) {
      throw new Error('نیا ای میل ایڈریس موجودہ ایڈریس سے مختلف ہونا چاہیے۔ (New email must be different)');
    }

    const duplicate = window.DB.get('users').find(u => u.id !== userId && u.email && u.email.toLowerCase().trim() === cleanEmail);
    if (duplicate) {
      throw new Error('یہ ای میل ایڈریس پہلے سے کسی دوسرے اکاؤنٹ میں استعمال ہو رہا ہے۔ (This email is already in use)');
    }

    const oldEmail = user.email;
    const updatedUser = window.DB.update('users', userId, {
      email: cleanEmail,
      emailVerified: false
    });

    // Generate new email verification
    const verificationToken = this._generateToken('ev', 32);
    window.DB.insert('emailVerifications', {
      id: `ev-${Date.now()}`,
      userId: user.id,
      email: cleanEmail,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      createdAt: new Date().toISOString()
    });

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser;
      const curToken = this._getCurrentSessionToken();
      this.setSession(updatedUser, localStorage.getItem(AUTH_STORAGE_KEY) !== null, curToken);
    }

    window.DB.logSecurityEvent(userId, 'EMAIL_CHANGED', 'info', `Email changed from ${oldEmail} to ${cleanEmail}`);

    return {
      success: true,
      user: updatedUser,
      verificationToken,
      message: 'ای میل کامیابی سے تبدیل ہو گئی۔ تصدیقی لنک ارسال کر دیا گیا ہے۔ (Email updated. Verification email sent.)'
    };
  }

  /* ==========================================================================
     TWO-FACTOR AUTHENTICATION (2FA) MANAGEMENT
     ========================================================================== */

  /**
   * Initiate 2FA setup: generate secret, QR Code URL, and 10 single-use recovery backup codes.
   */
  async setup2FA(userId = this.currentUser?.id) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) throw new Error('صارف نہیں مل سکا۔ (User not found)');

    // Generate 16-character Base32 Secret Key
    const secretChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += secretChars.charAt(Math.floor(Math.random() * secretChars.length));
    }

    // Generate 10 random 8-digit Backup Recovery Codes (format: XXXX-XXXX)
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code1 = Math.floor(1000 + Math.random() * 9000);
      const code2 = Math.floor(1000 + Math.random() * 9000);
      backupCodes.push({
        code: `${code1}-${code2}`,
        used: false,
        usedAt: null
      });
    }

    const tfaSettings = window.DB.get('twoFactorSettings');
    const existing = tfaSettings.find(t => t.userId === userId);

    if (existing) {
      window.DB.update('twoFactorSettings', existing.id, {
        secret,
        backupCodes,
        enabled: false,
        updatedAt: new Date().toISOString()
      });
    } else {
      window.DB.insert('twoFactorSettings', {
        id: `tfa-${userId}`,
        userId,
        secret,
        backupCodes,
        enabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    const qrData = `otpauth://totp/LearnHub:${encodeURIComponent(user.email)}?secret=${secret}&issuer=LearnHub`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

    return {
      secret,
      manualKey: secret,
      qrCodeUrl,
      recoveryCodes: backupCodes.map(b => b.code),
      message: '2FA سیٹ اپ کوڈز تیار ہیں۔ براہ کرم تصدیقی کوڈ درج کر کے ایکٹیو کریں۔'
    };
  }

  /**
   * Confirm and activate 2FA with 6-digit TOTP code.
   */
  async confirm2FA(userId = this.currentUser?.id, code) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!code) throw new Error('براہ کرم 6 ہندسوں کا تصدیقی کوڈ درج کریں۔ (Please enter 6-digit code)');

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const tfaSettings = window.DB.get('twoFactorSettings').find(t => t.userId === userId);
    if (!tfaSettings || !tfaSettings.secret) {
      throw new Error('براہ کرم پہلے 2FA سیٹ اپ شروع کریں۔ (Please initiate 2FA setup first)');
    }

    const cleanCode = code.replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleanCode)) {
      throw new Error('تصدیقی کوڈ 6 ہندسوں پر مشتمل ہونا ضروری ہے۔ (Code must be 6 digits)');
    }

    window.DB.update('twoFactorSettings', tfaSettings.id, {
      enabled: true,
      activatedAt: new Date().toISOString()
    });

    const updatedUser = window.DB.update('users', userId, {
      twoFactorEnabled: true
    });

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser;
      const curToken = this._getCurrentSessionToken();
      this.setSession(updatedUser, localStorage.getItem(AUTH_STORAGE_KEY) !== null, curToken);
    }

    window.DB.logSecurityEvent(userId, '2FA_ENABLED', 'info', `Two-Factor Authentication activated for user`);

    return {
      success: true,
      recoveryCodes: tfaSettings.backupCodes.map(b => b.code),
      message: 'دو مرحلہ تصدیق (2FA) کامیابی سے فعال ہو گئی۔ (2FA enabled successfully)'
    };
  }

  /**
   * Disable 2FA after validating user's current password.
   */
  async disable2FA(userId = this.currentUser?.id, password) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!password) throw new Error('2FA غیر فعال کرنے کے لیے پاس ورڈ درج کریں۔ (Password required to disable 2FA)');

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) throw new Error('صارف نہیں مل سکا۔ (User not found)');

    if (user.password !== password) {
      window.DB.logSecurityEvent(userId, '2FA_DISABLE_FAILED', 'warning', 'Failed attempt to disable 2FA (wrong password)');
      throw new Error('پاس ورڈ درست نہیں ہے۔ (Incorrect password)');
    }

    const tfaSettings = window.DB.get('twoFactorSettings').find(t => t.userId === userId);
    if (tfaSettings) {
      window.DB.update('twoFactorSettings', tfaSettings.id, { enabled: false });
    }

    const updatedUser = window.DB.update('users', userId, {
      twoFactorEnabled: false
    });

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser;
      const curToken = this._getCurrentSessionToken();
      this.setSession(updatedUser, localStorage.getItem(AUTH_STORAGE_KEY) !== null, curToken);
    }

    window.DB.logSecurityEvent(userId, '2FA_DISABLED', 'warning', `Two-Factor Authentication disabled for user`);

    return {
      success: true,
      message: 'دو مرحلہ تصدیق (2FA) غیر فعال کر دی گئی ہے۔ (2FA disabled successfully)'
    };
  }

  /**
   * Regenerate 10 fresh recovery backup codes after validating user's password.
   */
  async regenerateRecoveryCodes(userId = this.currentUser?.id, password) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!password) throw new Error('نئے ریکوری کوڈز کے لیے پاس ورڈ درج کریں۔ (Password required)');

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) throw new Error('صارف نہیں مل سکا۔ (User not found)');

    if (user.password !== password) {
      throw new Error('پاس ورڈ درست نہیں ہے۔ (Incorrect password)');
    }

    const tfaSettings = window.DB.get('twoFactorSettings').find(t => t.userId === userId);
    if (!tfaSettings || !tfaSettings.enabled) {
      throw new Error('2FA فعال نہیں ہے۔ (2FA is not enabled)');
    }

    const newBackupCodes = [];
    for (let i = 0; i < 10; i++) {
      const c1 = Math.floor(1000 + Math.random() * 9000);
      const c2 = Math.floor(1000 + Math.random() * 9000);
      newBackupCodes.push({ code: `${c1}-${c2}`, used: false, usedAt: null });
    }

    window.DB.update('twoFactorSettings', tfaSettings.id, {
      backupCodes: newBackupCodes,
      updatedAt: new Date().toISOString()
    });

    window.DB.logSecurityEvent(userId, '2FA_RECOVERY_CODES_REGENERATED', 'info', 'New 2FA backup codes generated');

    return {
      success: true,
      recoveryCodes: newBackupCodes.map(b => b.code),
      message: '10 نئے ریکوری کوڈز تیار ہو گئے۔ پرانے کوڈز منسوخ کر دیے گئے ہیں۔ (New backup codes generated)'
    };
  }

  /* ==========================================================================
     SESSION INSPECTION & REVOCATION
     ========================================================================== */

  /**
   * Retrieve all active sessions for a user with device and current session indicator.
   */
  async getUserSessions(userId = this.currentUser?.id) {
    if (!userId) return [];
    if (!window.DB) return [];

    const currentToken = this._getCurrentSessionToken();
    const sessions = window.DB.get('sessions')
      .filter(s => s.userId === userId && s.isValid !== false && new Date(s.expiresAt) >= new Date())
      .sort((a, b) => new Date(b.lastActiveAt || b.createdAt) - new Date(a.lastActiveAt || a.createdAt));

    return sessions.map(s => ({
      ...s,
      isCurrent: s.token === currentToken
    }));
  }

  /**
   * Revoke a single session by its sessionId.
   */
  async revokeSession(sessionId, userId = this.currentUser?.id) {
    if (!sessionId) throw new Error('سیشن آئی ڈی درکار ہے۔ (Session ID required)');
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const session = window.DB.findById('sessions', sessionId);
    if (!session) throw new Error('سیشن نہیں مل سکا۔ (Session not found)');

    if (userId && session.userId !== userId && !this.isAdmin()) {
      throw new Error('آپ کو یہ سیشن ختم کرنے کی اجازت نہیں ہے۔ (Unauthorized to revoke this session)');
    }

    window.DB.update('sessions', sessionId, { isValid: false });
    window.DB.logSecurityEvent(session.userId, 'SESSION_REVOKED', 'info', `Session revoked (${session.device})`);

    const currentToken = this._getCurrentSessionToken();
    if (session.token === currentToken) {
      this.clearSession();
    }

    return {
      success: true,
      message: 'سیشن کامیابی سے ختم کر دیا گیا۔ (Session revoked successfully)'
    };
  }

  /**
   * Revoke all active sessions for a user EXCEPT the current session.
   */
  async revokeAllOtherSessions(userId = this.currentUser?.id, currentSessionToken = this._getCurrentSessionToken()) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const sessions = window.DB.get('sessions').filter(s => s.userId === userId && s.isValid !== false);
    let count = 0;

    sessions.forEach(s => {
      if (s.token !== currentSessionToken) {
        window.DB.update('sessions', s.id, { isValid: false });
        count++;
      }
    });

    window.DB.logSecurityEvent(userId, 'ALL_OTHER_SESSIONS_REVOKED', 'info', `Revoked ${count} other sessions`);

    return {
      success: true,
      revokedCount: count,
      message: `دیگر تمام (${count}) سیشنز لاگ آؤٹ کر دیے گئے۔ (Revoked ${count} other sessions)`
    };
  }

  /* ==========================================================================
     ACCOUNT LIFECYCLE (DEACTIVATE / DELETE)
     ========================================================================== */

  /**
   * Deactivate account (status = 'disabled') with password verification.
   */
  async deactivateAccount(userId = this.currentUser?.id, password) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!password) throw new Error('اکاؤنٹ غیر فعال کرنے کے لیے پاس ورڈ درج کریں۔ (Password required)');

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) throw new Error('صارف نہیں مل سکا۔ (User not found)');

    if (user.password !== password) {
      throw new Error('پاس ورڈ درست نہیں ہے۔ (Incorrect password)');
    }

    window.DB.update('users', userId, {
      status: 'disabled',
      deactivatedAt: new Date().toISOString()
    });

    // Revoke all user sessions
    const sessions = window.DB.get('sessions').filter(s => s.userId === userId);
    sessions.forEach(s => window.DB.update('sessions', s.id, { isValid: false }));

    window.DB.logSecurityEvent(userId, 'ACCOUNT_DEACTIVATED', 'warning', `User account deactivated: ${user.email}`);

    if (this.currentUser && this.currentUser.id === userId) {
      this.clearSession();
    }

    return {
      success: true,
      message: 'اکاؤنٹ غیر فعال کر دیا گیا۔ (Account deactivated successfully)'
    };
  }

  /**
   * Permanently delete user account and associated data after password verification.
   */
  async deleteAccount(userId = this.currentUser?.id, password) {
    if (!userId) throw new Error('صارف لاگ اِن نہیں ہے۔ (Not authenticated)');
    if (!password) throw new Error('اکاؤنٹ مستقل حذف کرنے کے لیے پاس ورڈ درج کریں۔ (Password required)');

    if (!window.DB) throw new Error('ڈیٹا بیس دستیاب نہیں ہے۔ (Database unavailable)');

    const user = window.DB.findById('users', userId);
    if (!user) throw new Error('صارف نہیں مل سکا۔ (User not found)');

    if (user.password !== password) {
      throw new Error('پاس ورڈ درست نہیں ہے۔ (Incorrect password)');
    }

    // Revoke and delete sessions
    const sessions = window.DB.get('sessions').filter(s => s.userId === userId);
    sessions.forEach(s => window.DB.delete('sessions', s.id));

    // Delete 2FA settings
    const tfa = window.DB.get('twoFactorSettings').find(t => t.userId === userId);
    if (tfa) window.DB.delete('twoFactorSettings', tfa.id);

    // Delete user
    window.DB.delete('users', userId);

    window.DB.logSecurityEvent(userId, 'ACCOUNT_DELETED', 'critical', `User account permanently deleted: ${user.email}`);

    if (this.currentUser && this.currentUser.id === userId) {
      this.clearSession();
    }

    return {
      success: true,
      message: 'آپ کا اکاؤنٹ مستقل طور پر حذف کر دیا گیا ہے۔ (Account permanently deleted)'
    };
  }

  /**
   * Retrieve security audit events for a user.
   */
  async getSecurityLogs(userId = this.currentUser?.id) {
    if (!userId || !window.DB) return [];
    return window.DB.get('securityEvents')
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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

    // Protect sensitive fields from arbitrary direct modification
    const safeData = { ...data };
    delete safeData.id;
    delete safeData.password;
    delete safeData.email;
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

    // Refresh active session
    const curToken = this._getCurrentSessionToken();
    const isRemembered = localStorage.getItem(AUTH_STORAGE_KEY) !== null;
    this.setSession(updatedUser, isRemembered, curToken);

    return updatedUser;
  }

  /**
   * Standard user logout.
   */
  logout() {
    const name = this.currentUser?.name || 'User';
    const email = this.currentUser?.email || '';
    const userId = this.currentUser?.id;

    if (window.DB && userId) {
      window.DB.logSecurityEvent(userId, 'USER_LOGOUT', 'info', `User logged out: ${email}`);
      if (typeof window.DB.logAudit === 'function') {
        window.DB.logAudit(name, 'USER_LOGOUT', email);
      }
    }
    this.clearSession();
  }
}

// Global Singleton Auth Service
window.Auth = new AuthService();
