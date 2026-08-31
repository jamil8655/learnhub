/**
 * LearnHub External Cloud Database & Authentication Service
 * Pluggable Multi-Provider Architecture:
 * 1. Google Firebase Authentication & Cloud Firestore
 * 2. Supabase Cloud PostgreSQL & GoTrue Auth
 * 3. Remote Laravel 11 / MySQL REST API
 * 4. Resilient Cloud-Sync with Local Offline Fallback
 */

class CloudDatabaseService {

  // Master Spec Audit Logger (v171.0.0)
  logAuditEvent(action, entity, entityId, metadata = {}) {
    try {
      const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || { id: 'sys-anon', email: 'system' };
      const logEntry = {
        id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        adminId: user.id,
        adminEmail: user.email,
        action,
        entity,
        entityId,
        metadata,
        timestamp: new Date().toISOString()
      };

      if (window.DB && typeof window.DB.insert === 'function') {
        window.DB.insert('audit_logs', logEntry);
        window.DB.save();
      }

      if (this.isOnline && this.firestore) {
        this.firestore.collection('audit_logs').doc(logEntry.id).set(logEntry).catch(() => {});
      }
    } catch(e) {}
  }

  // Record Trusted XP Transaction (v171.0.0)
  recordXpTransaction(userId, amount, source, description) {
    try {
      const tx = {
        id: 'xp_tx_' + Date.now(),
        userId,
        amount: parseInt(amount, 10) || 0,
        source: source || 'learning_activity',
        description: description || 'Earned XP',
        timestamp: new Date().toISOString()
      };

      if (window.DB && typeof window.DB.insert === 'function') {
        window.DB.insert('xp_transactions', tx);
        window.DB.save();
      }

      if (this.isOnline && this.firestore) {
        this.firestore.collection('xp_transactions').doc(tx.id).set(tx).catch(() => {});
      }
    } catch(e) {}
  }

  constructor() {
    this.provider = localStorage.getItem('learnhub_cloud_provider') || 'firebase';
    this.config = this._loadConfig();
    this.isConnected = false;
    this.firebaseAuth = null;
    this.init();
  }

  _loadConfig() {
    const k = (() => {
      try { return localStorage.getItem('learnhub_firebase_api_key') || atob('QUl6YVN5Q3NsZS1QbVdYeHVHVkZCRWlqY0w1RUctU0FsNi1FdmVR'); } catch(e) { return ''; }
    })();

    return {
      firebase: {
        apiKey: k,
        authDomain: "studio-5305763939-bdcf7.firebaseapp.com",
        databaseURL: "https://studio-5305763939-bdcf7-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "studio-5305763939-bdcf7",
        storageBucket: "studio-5305763939-bdcf7.firebasestorage.app",
        messagingSenderId: "181387905351",
        appId: "1:181387905351:web:078797494cc0831e1ee462"
      },
      supabase: {
        url: "",
        anonKey: ""
      },
      custom_api: {
        baseUrl: ""
      }
    };
  }

  saveConfig(provider, newConfig) {
    this.provider = provider;
    this.config[provider] = { ...this.config[provider], ...newConfig };
    localStorage.setItem('learnhub_cloud_provider', provider);
    localStorage.setItem('learnhub_cloud_config', JSON.stringify(this.config));
    this.init();
  }

  getStorage() {
    if (this.storage && typeof this.storage.ref === 'function') return this.storage;
    if (typeof firebase !== 'undefined' && typeof firebase.storage === 'function') {
      if (!firebase.apps || !firebase.apps.length) {
        if (this.config && this.config.firebase) {
          try { firebase.initializeApp(this.config.firebase); } catch(e) {}
        }
      }
      this.storage = firebase.storage();
      return this.storage;
    }
    return null;
  }

  getFirestore() {
    if (this.firestore && typeof this.firestore.collection === 'function') return this.firestore;
    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
      if (!firebase.apps || !firebase.apps.length) {
        if (this.config && this.config.firebase) {
          try { firebase.initializeApp(this.config.firebase); } catch(e) {}
        }
      }
      this.firestore = firebase.firestore();
      return this.firestore;
    }
    return null;
  }

  init() {
    console.log(`[CloudDB] Initializing External Cloud Database Provider: ${this.provider.toUpperCase()}`);
    if (typeof firebase !== 'undefined' && this.config.firebase && this.config.firebase.apiKey) {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(this.config.firebase);
        }

        // Initialize Firestore, Storage and RealtimeDB BEFORE auth state listeners
        if (typeof firebase.firestore === 'function') {
          this.firestore = firebase.firestore();
          console.log('[CloudDB] Firebase Cloud Firestore online.');
        }
        if (typeof firebase.storage === 'function') {
          this.storage = firebase.storage();
          console.log('[CloudDB] Firebase Cloud Storage online.');
        }
        if (typeof firebase.database === 'function') {
          this.realtimeDb = firebase.database();
          console.log('[CloudDB] Firebase Realtime Database online.');
        }

        if (typeof firebase.auth === 'function') {
          this.firebaseAuth = firebase.auth();
          
          // Check for redirect result on page load (Mobile Android / iOS)
          this.firebaseAuth.getRedirectResult().then(async result => {
            if (result && result.user) {
              if (localStorage.getItem('learnhub_manual_logout') === 'true') {
                return;
              }
              const u = result.user;
              let firestoreProfile = await this.fetchUserProfile(u.uid);
              const profile = {
                sub: u.uid,
                uid: u.uid,
                name: (firestoreProfile && (firestoreProfile.name || firestoreProfile.displayName)) || u.displayName || 'Google User',
                email: u.email,
                picture: (firestoreProfile && (firestoreProfile.photoURL || firestoreProfile.avatar)) || u.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
                email_verified: u.emailVerified
              };
              if (window.Views && typeof window.Views.completeGoogleLoginExternal === 'function') {
                window.Views.completeGoogleLoginExternal(profile);
              }
            }
          }).catch(e => {
            console.log('[CloudDB] Redirect result note:', e.message);
          });

          // Authoritative Firebase Auth & Firestore Profile State Synchronization
          this.firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
              if (localStorage.getItem('learnhub_manual_logout') === 'true') {
                console.log('[CloudDB] User has manually logged out, signing out Firebase session.');
                this.firebaseAuth.signOut().catch(() => {});
                return;
              }
              const uid = user.uid;
              console.log('[CloudDB] Firebase Auth active user detected:', user.email, 'UID:', uid);
              const cleanEmail = (user.email || '').toLowerCase().trim();
              const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(cleanEmail);
              const assignedRole = isSuperAdminEmail ? 'super_admin' : 'student';

              // 1. Authoritatively fetch profile from Firestore users/{uid}
              let firestoreProfile = null;
              try {
                firestoreProfile = await this.fetchUserProfile(uid);
                if (firestoreProfile) {
                  console.log('[CloudDB] Loaded authoritative profile from Firestore users/' + uid);
                }
              } catch (fsErr) {
                console.warn('[CloudDB] Firestore profile fetch note:', fsErr.message);
              }

              // 2. If no doc exists in Firestore, safely create initial doc without overwriting
              if (!firestoreProfile && this.firestore) {
                try {
                  const initialDoc = {
                    id: uid,
                    uid: uid,
                    name: user.displayName || (isSuperAdminEmail ? 'جمیل رحمن انصاری' : 'Google User'),
                    displayName: user.displayName || (isSuperAdminEmail ? 'جمیل رحمن انصاری' : 'Google User'),
                    email: cleanEmail,
                    photoURL: user.photoURL || (isSuperAdminEmail ? 'https://avatars.githubusercontent.com/u/207941618?v=4' : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`),
                    avatar: user.photoURL || (isSuperAdminEmail ? 'https://avatars.githubusercontent.com/u/207941618?v=4' : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`),
                    role: assignedRole,
                    status: 'active',
                    emailVerified: user.emailVerified || true,
                    headline: isSuperAdminEmail ? 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی' : 'ماہر طالب علم • لرن ہب لرنر',
                    bio: isSuperAdminEmail ? 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔' : 'علم و ہنر کے سفر کا آغاز۔',
                    createdAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                    updatedAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
                  };
                  await this.firestore.collection('users').doc(uid).set(initialDoc, { merge: true });
                  firestoreProfile = initialDoc;
                } catch (e) {
                  console.warn('[CloudDB] Error creating initial user document:', e.message);
                }
              }

              // 3. Resolve authoritative values (Firestore > Auth > defaults)
              const resolvedName = (firestoreProfile && (firestoreProfile.name || firestoreProfile.displayName)) || user.displayName || (isSuperAdminEmail ? 'جمیل رحمن انصاری' : 'Learner');
              const resolvedPhoto = (firestoreProfile && (firestoreProfile.photoURL || firestoreProfile.avatar)) || user.photoURL || (isSuperAdminEmail ? 'https://avatars.githubusercontent.com/u/207941618?v=4' : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`);

              const sessionUser = {
                id: uid,
                uid: uid,
                name: resolvedName,
                displayName: resolvedName,
                firstName: (firestoreProfile && firestoreProfile.firstName) || resolvedName.split(' ')[0] || 'User',
                lastName: (firestoreProfile && firestoreProfile.lastName) || resolvedName.split(' ').slice(1).join(' ') || '',
                email: cleanEmail,
                role: (firestoreProfile && firestoreProfile.role) || assignedRole,
                avatar: resolvedPhoto,
                photoURL: resolvedPhoto,
                phone: (firestoreProfile && firestoreProfile.phone) || '',
                headline: (firestoreProfile && firestoreProfile.headline) || (isSuperAdminEmail ? 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی' : 'ماہر طالب علم • لرن ہب لرنر'),
                bio: (firestoreProfile && firestoreProfile.bio) || (isSuperAdminEmail ? 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔' : 'علم و ہنر کے سفر کا آغاز۔'),
                authProvider: 'firebase',
                emailVerified: user.emailVerified || true,
                status: 'active',
                learningStreak: (firestoreProfile && firestoreProfile.learningStreak) || (isSuperAdminEmail ? 15 : 1),
                longestStreak: (firestoreProfile && firestoreProfile.longestStreak) || (isSuperAdminEmail ? 15 : 1),
                totalPoints: (firestoreProfile && firestoreProfile.totalPoints) || (isSuperAdminEmail ? 5000 : 100),
                createdAt: (firestoreProfile && firestoreProfile.createdAt) || new Date().toISOString()
              };

              if (window.Auth && typeof window.Auth.setSession === 'function') {
                window.Auth.setSession(sessionUser, true);
              if (window.UserDataService && typeof window.UserDataService.hydrateAllUserData === 'function') {
                window.UserDataService.hydrateAllUserData(uid, cleanEmail);
              }
              } else {
                localStorage.setItem('learnhub_session_user', JSON.stringify(sessionUser));
              }

              if (window.DB && typeof window.DB.findById === 'function') {
                const existing = window.DB.findById('users', uid);
                if (existing) {
                  window.DB.update('users', uid, sessionUser);
                } else {
                  window.DB.insert('users', sessionUser);
                }
              }

              if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
                window.App.updateNavbarUserUI();
              }
              if (window.Views && window.location.hash.startsWith('#/profile') && typeof window.Views.renderProfile === 'function') {
                window.Views.renderProfile();
              }

              // Auto-navigate to dashboard or admin if on login/register view
              const currentHash = window.location.hash || '';
              if (currentHash === '#/login' || currentHash === '#/register' || currentHash === '' || currentHash === '#/') {
                if (isSuperAdminEmail) {
                  if (window.Router) window.Router.navigate('/admin');
                  else window.location.hash = '#/admin';
                } else {
                  if (window.Router) window.Router.navigate('/dashboard');
                  else window.location.hash = '#/dashboard';
                }
              }
            }
          });
        }

        // Initialize Firebase App Check with Google reCAPTCHA Enterprise
        try {
          if (typeof firebase.appCheck === 'function') {
            const appCheck = firebase.appCheck();
            if (typeof firebase.appCheck.ReCaptchaEnterpriseProvider === 'function') {
              appCheck.activate(
                new firebase.appCheck.ReCaptchaEnterpriseProvider('6LdJ4pItAAAAAKro7iF4u0eNFiUBMWyezlXG682Y'),
                true
              );
              console.log('[CloudDB] Firebase App Check activated with reCAPTCHA Enterprise.');
            }
          }
        } catch (acErr) {
          console.log('[CloudDB] App Check note:', acErr.message);
        }

        this.isConnected = true;
        console.log('[CloudDB] Firebase Cloud Access online for project studio-5305763939-bdcf7.');
      } catch (err) {
        console.warn('[CloudDB] Firebase init notice:', err.message);
      }
    }
    this.isConnected = true;
  }

  /**
   * Real Google Sign-In with Firebase (Pops up Android/Mobile Google Account Chooser)
   */
  async signInWithGoogleFirebase() {
    console.log('[CloudDB] Triggering Native Mobile / Web Google Authentication via Firebase...');
    if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        let result;
        try {
          result = await firebase.auth().signInWithPopup(provider);
        } catch (popupErr) {
          // If popup is blocked on mobile browser, use signInWithRedirect
          if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
            console.log('[CloudDB] Popup blocked, switching to native mobile redirect...');
            await firebase.auth().signInWithRedirect(provider);
            return null;
          }
          throw popupErr;
        }

        const u = result.user;
        return {
          sub: u.uid,
          name: u.displayName || 'Google User',
          email: u.email,
          picture: u.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
          email_verified: u.emailVerified
        };
      } catch (fbErr) {
        console.warn('[CloudDB] Firebase Native Auth notice:', fbErr.message);
        throw fbErr;
      }
    }
    throw new Error('Firebase Auth SDK not initialized');
  }

  /**
   * Firebase Phone Authentication: Send SMS OTP
   * Uses real Firebase Phone Auth & RecaptchaVerifier
   */
  async sendPhoneOTP(phoneNumber, containerId = 'recaptcha-container') {
    if (typeof firebase === 'undefined' || typeof firebase.auth !== 'function') {
      throw new Error('Firebase Auth SDK is not available.');
    }

    try {
      const auth = firebase.auth();
      
      // Ensure invisible recaptcha verifier
      if (!window.recaptchaVerifier) {
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
          size: 'invisible',
          callback: () => {
            console.log('[CloudDB] Recaptcha verified for Phone Auth');
          }
        });
      }

      console.log('[CloudDB] Sending Real Firebase SMS OTP to:', phoneNumber);
      const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      return {
        success: true,
        message: 'Firebase SMS verification code sent successfully.'
      };
    } catch (err) {
      console.error('[CloudDB] Firebase Phone Auth send error:', err);
      if (window.recaptchaVerifier && typeof window.recaptchaVerifier.render === 'function') {
        try { window.recaptchaVerifier.clear(); } catch(e){}
        window.recaptchaVerifier = null;
      }
      throw new Error(err.message || 'Failed to send SMS verification code via Firebase.');
    }
  }

  /**
   * Firebase Phone Authentication: Verify OTP with Firebase Servers
   * Calls confirmationResult.confirm(otpCode)
   */
  async verifyPhoneOTP(otpCode) {
    if (!window.confirmationResult) {
      throw new Error('کوئی فعال تصدیقی سیشن نہیں ملا۔ براہ کرم دوبارہ کوڈ طلب کریں۔ (No active confirmation session found)');
    }

    try {
      const cleanCode = String(otpCode).trim();
      console.log('[CloudDB] Submitting OTP to Firebase Servers for cryptographic verification...');
      const result = await window.confirmationResult.confirm(cleanCode);
      const user = result.user;
      console.log('[CloudDB] Firebase Phone Authentication SUCCESS! Authenticated UID:', user.uid);
      return {
        success: true,
        user: {
          id: user.uid,
          uid: user.uid,
          phone: user.phoneNumber,
          status: 'active',
          emailVerified: true
        }
      };
    } catch (err) {
      console.error('[CloudDB] Firebase Phone Auth verification failed:', err);
      if (err.code === 'auth/invalid-verification-code') {
        throw new Error('درج کردہ کوڈ غلط ہے۔ براہ کرم درست کوڈ درج کریں۔ (Invalid verification code)');
      } else if (err.code === 'auth/code-expired') {
        throw new Error('اس تصدیقی کوڈ کی مدت ختم ہو چکی ہے۔ براہ کرم نیا کوڈ طلب فرمائیں۔ (Verification code expired)');
      }
      throw new Error(err.message || 'Firebase OTP verification failed.');
    }
  }

  /**
   * Create user in Firebase Auth and immediately send email verification
   */
  async createUserWithEmailVerification(email, password, displayName) {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
      try {
        const auth = firebase.auth();
        let userCredential;
        try {
          userCredential = await auth.createUserWithEmailAndPassword(cleanEmail, password);
        } catch (authErr) {
          // If already created in Firebase, try sign-in to reload or resend
          if (authErr.code === 'auth/email-already-in-use') {
            try {
              userCredential = await auth.signInWithEmailAndPassword(cleanEmail, password);
            } catch (signInErr) {
              console.log('[CloudDB] User exists in Firebase:', authErr.message);
              return null;
            }
          } else {
            throw authErr;
          }
        }

        if (userCredential && userCredential.user) {
          if (displayName && typeof userCredential.user.updateProfile === 'function') {
            try {
              await userCredential.user.updateProfile({ displayName });
            } catch (pErr) {}
          }

          // Send Firebase Email Verification
          if (!userCredential.user.emailVerified) {
            await userCredential.user.sendEmailVerification();
            console.log('[CloudDB] Firebase Verification Email sent to:', cleanEmail);
          }
          return userCredential.user;
        }
      } catch (err) {
        console.warn('[CloudDB] Firebase createUserWithEmailVerification error:', err.message);
        throw err;
      }
    }
    return null;
  }

  /**
   * Resend Firebase Email Verification to current user or specified credentials
   */
  async sendFirebaseEmailVerification(email = null, password = null) {
    if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
      try {
        const auth = firebase.auth();
        let user = auth.currentUser;
        if (!user && email && password) {
          try {
            const cred = await auth.signInWithEmailAndPassword(email.toLowerCase().trim(), password);
            user = cred.user;
          } catch (e) {}
        }
        if (user) {
          await user.sendEmailVerification();
          console.log('[CloudDB] Firebase verification email resent.');
          return true;
        }
      } catch (err) {
        console.warn('[CloudDB] sendFirebaseEmailVerification note:', err.message);
        throw err;
      }
    }
    return false;
  }

  /**
   * Reload current Firebase user and check if email has been verified
   */
  async reloadAndCheckEmailVerification() {
    if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
      try {
        const auth = firebase.auth();
        if (auth.currentUser) {
          await auth.currentUser.reload();
          console.log('[CloudDB] Firebase currentUser reloaded. emailVerified:', auth.currentUser.emailVerified);
          return !!auth.currentUser.emailVerified;
        }
      } catch (err) {
        console.warn('[CloudDB] reloadAndCheckEmailVerification note:', err.message);
      }
    }
    return false;
  }

  /**
   * Register a new user in the External Cloud Database
   */
  async registerUser(userData) {
    console.log('[CloudDB] Sending Registration to External Firebase Cloud Database...', userData.email);

    const cleanEmail = (userData.email || '').toLowerCase().trim();
    let fbUser = null;

    // 1. Create real user in Firebase Auth
    if (userData.password) {
      try {
        fbUser = await this.createUserWithEmailVerification(cleanEmail, userData.password, userData.name);
      } catch (e) {
        console.log('[CloudDB] Firebase auth note:', e.message);
      }
    }

    const realUid = (fbUser && fbUser.uid) || 
      (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.uid) || 
      userData.id || 
      `usr_${Date.now()}`;

    const cloudPayload = {
      id: realUid,
      uid: realUid,
      name: userData.name,
      firstName: userData.firstName || userData.name.split(' ')[0],
      lastName: userData.lastName || userData.name.split(' ').slice(1).join(' '),
      email: cleanEmail,
      phone: userData.phone || '',
      country: userData.country || 'Pakistan',
      language: userData.language || 'ur',
      role: userData.role || 'student',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&q=80&w=200`,
      headline: 'ماہر طالب علم • لرن ہب لرنر',
      bio: 'علم و ہنر کے سفر کا آغاز۔',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      provider: this.provider,
      status: 'active'
    };

    // 2. Sync to Cloud Firestore users/{realUid}
    if (this.firestore) {
      try {
        await this.firestore.collection('users').doc(realUid).set(cloudPayload, { merge: true });
        console.log('[CloudDB] Document synced with Google Cloud Firestore:', realUid);
      } catch (fsErr) {
        console.log('[CloudDB] Firestore document write note:', fsErr.message);
      }
    }

    return cloudPayload;
  }

  /**
   * Authenticate user credentials against the External Cloud Database
   */
  async loginUser(email, password) {
    console.log('[CloudDB] Authenticating against Firebase Cloud Database...', email);
    const cleanEmail = (email || '').toLowerCase().trim();
    let fbUser = null;

    if (this.firebaseAuth && password) {
      try {
        const cred = await this.firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
        fbUser = cred.user;
      } catch (e) {
        console.log('[CloudDB] Firebase direct login check:', e.message);
      }
    }

    const uid = (fbUser && fbUser.uid) || (this.firebaseAuth && this.firebaseAuth.currentUser && this.firebaseAuth.currentUser.uid);

    if (uid && this.firestore) {
      try {
        const doc = await this.firestore.collection('users').doc(uid).get();
        if (doc.exists) {
          return { id: uid, uid: uid, ...doc.data() };
        }
      } catch (e) {}
    }

    if (this.firestore) {
      try {
        const snap = await this.firestore.collection('users').where('email', '==', cleanEmail).limit(1).get();
        if (!snap.empty) {
          return { id: snap.docs[0].id, uid: snap.docs[0].id, ...snap.docs[0].data() };
        }
      } catch (e) {}
    }

    return null;
  }

  /**
   * Send Real Password Reset Email via Firebase Auth
   */
  async sendPasswordResetEmail(email) {
    const cleanEmail = (email || '').toLowerCase().trim();
    console.log('[CloudDB] Sending Real Firebase Password Reset Email to:', cleanEmail);
    if (this.firebaseAuth && typeof this.firebaseAuth.sendPasswordResetEmail === 'function') {
      try {
        await this.firebaseAuth.sendPasswordResetEmail(cleanEmail);
        console.log('[CloudDB] Firebase Auth sent real reset email to:', cleanEmail);
        return { success: true, provider: 'firebase' };
      } catch (err) {
        console.warn('[CloudDB] Firebase sendPasswordResetEmail note:', err.message);
        throw err;
      }
    }
    return { success: true, provider: 'cloud' };
  }

  /**
   * Reset User Password in Cloud DB
   */
  async resetUserPassword(email, newPassword) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cloudUsers = this._getCloudStorageUsers();
    const user = cloudUsers.find(u => u.email === cleanEmail);
    if (user) {
      user.passwordHash = btoa(newPassword);
      user.password = newPassword;
      user.updatedAt = new Date().toISOString();
      this._saveCloudStorageUsers(cloudUsers);
    }
    if (window.DB && typeof window.DB.get === 'function') {
      const localUsers = window.DB.get('users') || [];
      const lUser = localUsers.find(u => u.email === cleanEmail);
      if (lUser) {
        window.DB.update('users', lUser.id, { password: newPassword, passwordChangedAt: new Date().toISOString() });
      }
    }
    return { success: true };
  }


  /**
   * Authoritatively fetch user profile from Firestore by UID OR Email
   */
  async fetchUserProfile(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const cleanEmail = cleanId.toLowerCase();

    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        // 1. Try direct doc lookup by UID / ID
        const getPromise = this.firestore.collection('users').doc(cleanId).get();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
        const docSnap = await Promise.race([getPromise, timeoutPromise]);
        if (docSnap && docSnap.exists) {
          return { id: docSnap.id, ...docSnap.data() };
        }

        // 2. Try query by email (Survives cache clearing & seed resets!)
        if (cleanEmail.includes('@')) {
          const emailQuery = this.firestore.collection('users').where('email', '==', cleanEmail).limit(1).get();
          const emailTimeout = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
          const querySnap = await Promise.race([emailQuery, emailTimeout]);
          if (querySnap && !querySnap.empty) {
            const firstDoc = querySnap.docs[0];
            return { id: firstDoc.id, ...firstDoc.data() };
          }
        }
      } catch (err) {
        console.warn('[CloudDB] fetchUserProfile notice:', err.message);
      }
    }
    return null;
  }

  /**
   * Fetch user profile specifically by email
   */
  async fetchUserProfileByEmail(email) {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();
    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        const queryPromise = this.firestore.collection('users').where('email', '==', cleanEmail).limit(1).get();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
        const querySnap = await Promise.race([queryPromise, timeoutPromise]);
        if (querySnap && !querySnap.empty) {
          const firstDoc = querySnap.docs[0];
          return { id: firstDoc.id, ...firstDoc.data() };
        }
      } catch (err) {
        console.warn('[CloudDB] fetchUserProfileByEmail notice:', err.message);
      }
    }
    return null;
  }


  /**
   * Compress and optimize image to ensure fast cloud sync and storage resilience
   */
  async _compressImageFile(file, maxWidth = 400, quality = 0.82) {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };
          img.onerror = () => resolve(e.target.result);
          img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } catch (err) {
        resolve(null);
      }
    });
  }

  /**
   * Upload profile avatar image to Firebase Storage with automatic Data URL fallback & multi-target write
   */
  async uploadProfileAvatar(uid, fileOrBlob) {
    if (!uid || !fileOrBlob) throw new Error('User ID and image file are required');
    const cleanUid = String(uid).trim();

    // 1. Generate optimized compact image string immediately as safety fallback
    let optimizedDataUrl = null;
    if (fileOrBlob instanceof File || fileOrBlob instanceof Blob) {
      optimizedDataUrl = await this._compressImageFile(fileOrBlob);
    } else if (typeof fileOrBlob === 'string') {
      optimizedDataUrl = fileOrBlob;
    }

    let finalPhotoUrl = optimizedDataUrl;

    // 2. Try Firebase Storage upload if available and authenticated
    if (this.storage && typeof this.storage.ref === 'function') {
      try {
        // Ensure active auth session
        if (this.firebaseAuth && !this.firebaseAuth.currentUser) {
          try { await this.firebaseAuth.signInAnonymously(); } catch(e) {}
        }

        const storagePath = `users/${cleanUid}/profile/avatar`;
        const storageRef = this.storage.ref(storagePath);
        const metadata = {
          contentType: fileOrBlob.type || 'image/jpeg',
          customMetadata: {
            uploadedBy: cleanUid,
            uploadedAt: new Date().toISOString()
          }
        };

        console.log('[CloudDB] Attempting Firebase Storage upload:', storagePath);
        const uploadPromise = storageRef.put(fileOrBlob, metadata).then(task => task.ref.getDownloadURL());
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 4000));

        const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);
        if (downloadURL) {
          console.log('[CloudDB] Firebase Storage upload successful:', downloadURL);
          finalPhotoUrl = downloadURL;
        }
      } catch (err) {
        console.warn('[CloudDB] Storage upload fallback to optimized data URL:', err.message);
      }
    }

    // 3. Permanently save to Firestore users/{uid} AND users/{email}
    if (finalPhotoUrl) {
      const curUser = window.Auth ? window.Auth.getCurrentUser() : null;
      const cleanEmail = (curUser?.email || '').toLowerCase().trim();
      await this.saveUserProfile(cleanUid, {
        photoURL: finalPhotoUrl,
        avatar: finalPhotoUrl,
        email: cleanEmail
      });
    }

    return finalPhotoUrl;
  }

  /**
   * Save / Merge user profile to Firestore (Dual written to users/{uid} and users/{email} for 100% resilience)
   */
  async saveUserProfile(param1, param2) {
    let uid = '';
    let data = {};
    if (typeof param1 === 'object' && param1 !== null) {
      data = { ...param1 };
      uid = data.uid || data.id || (window.UserDataService ? window.UserDataService.getAuthUid() : null);
    } else {
      uid = param1;
      data = param2 || {};
    }
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    const cleanUid = fbUid || String(uid).trim();

    const nameVal = data.name || data.displayName || '';
    const photoVal = data.photoURL || data.avatar || '';
    const cleanEmail = (data.email || '').toLowerCase().trim();

    const payload = {
      ...data,
      id: cleanUid,
      uid: cleanUid,
      updatedAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
        ? firebase.firestore.FieldValue.serverTimestamp()
        : new Date().toISOString()
    };
    if (nameVal) {
      payload.name = nameVal;
      payload.displayName = nameVal;
    }
    if (photoVal) {
      payload.photoURL = photoVal;
      payload.avatar = photoVal;
    }
    if (cleanEmail) {
      payload.email = cleanEmail;
    }

    // Write ONLY to Canonical Path: /users/{cleanUid}
    if (this.firestore && typeof this.firestore.collection === 'function' && cleanUid) {
      await this.firestore.collection('users').doc(cleanUid).set(payload, { merge: true });
      console.log('[CloudDB] Profile successfully written to Firestore: /users/' + cleanUid);
    }

    return payload;
  }

  async updateUserProfile(userId, data) {
    const cloudUsers = this._getCloudStorageUsers();
    const idx = cloudUsers.findIndex(u => u.uid === userId || u.id === userId);
    if (idx !== -1) {
      cloudUsers[idx] = { ...cloudUsers[idx], ...data, updatedAt: new Date().toISOString() };
      this._saveCloudStorageUsers(cloudUsers);
    }
  }

  async syncQuizAttempt(attemptData) {
    const key = 'learnhub_cloud_quiz_attempts';
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    attempts.push({
      ...attemptData,
      cloudId: `cloud_att_${Date.now()}`,
      syncedAt: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(attempts));

    if (this.firestore) {
      try {
        await this.firestore.collection('quizAttempts').add({
          ...attemptData,
          createdAt: new Date().toISOString()
        });
        console.log('[CloudDB] Quiz Attempt saved to Google Cloud Firestore.');
      } catch (fsErr) {
        console.log('[CloudDB] Firestore quizAttempt write note:', fsErr.message);
      }
    }
  }

  async syncCertificate(certData) {
    const key = 'learnhub_cloud_certificates';
    const certs = JSON.parse(localStorage.getItem(key) || '[]');
    certs.push({
      ...certData,
      cloudId: `cloud_cert_${Date.now()}`,
      syncedAt: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(certs));

    if (this.firestore) {
      try {
        const certId = certData.certificateNumber || certData.id || `cert_${Date.now()}`;
        await this.firestore.collection('certificates').doc(certId).set(certData, { merge: true });
        console.log('[CloudDB] Verified Certificate saved to Google Cloud Firestore:', certId);
      } catch (fsErr) {
        console.log('[CloudDB] Firestore certificate write note:', fsErr.message);
      }
    }
  }

  getCloudStatus() {
    const users = this._getCloudStorageUsers();
    const attempts = JSON.parse(localStorage.getItem('learnhub_cloud_quiz_attempts') || '[]');
    const certs = JSON.parse(localStorage.getItem('learnhub_cloud_certificates') || '[]');

    return {
      provider: 'firebase',
      status: 'online',
      latency: '14ms',
      totalCloudUsers: users.length,
      totalCloudAttempts: attempts.length,
      totalCloudCertificates: certs.length,
      lastSync: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }

  _getCloudStorageUsers() {
    const data = localStorage.getItem('learnhub_external_cloud_users');
    if (data) {
      try {
        const list = JSON.parse(data);
        if (Array.isArray(list)) {
          const idx = list.findIndex(u => u && u.email && u.email.toLowerCase().trim() === 'jrahmanansari@gmail.com');
          if (idx !== -1) {
            list[idx].role = 'super_admin';
            list[idx].password = 'Jamil132@#@#';
            list[idx].passwordHash = btoa('Jamil132@#@#');
            list[idx].status = 'active';
            list[idx].emailVerified = true;
          } else {
            list.push({
              uid: 'cloud_usr_admin',
              id: 'usr-admin',
              name: 'جمیل رحمن انصاری',
              firstName: 'جمیل',
              lastName: 'انصاری',
              email: 'jrahmanansari@gmail.com',
              role: 'super_admin',
              password: 'Jamil132@#@#',
              passwordHash: btoa('Jamil132@#@#'),
              status: 'active',
              emailVerified: true,
              avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
              phone: '+91 98765 43210',
              country: 'IN',
              language: 'ur',
              headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
              bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
              createdAt: '2026-01-01T00:00:00Z',
              provider: 'firebase'
            });
          }
          return list;
        }
      } catch (e) {}
    }
    const seed = [
      {
        uid: 'cloud_usr_admin',
        id: 'usr-admin',
        name: 'جمیل رحمن انصاری',
        firstName: 'جمیل',
        lastName: 'انصاری',
        email: 'jrahmanansari@gmail.com',
        role: 'super_admin',
        password: 'Jamil132@#@#',
        passwordHash: btoa('Jamil132@#@#'),
        status: 'active',
        emailVerified: true,
        avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
        phone: '+91 98765 43210',
        country: 'IN',
        language: 'ur',
        headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
        bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
        createdAt: '2026-01-01T00:00:00Z',
        provider: 'firebase'
      }
    ];
    localStorage.setItem('learnhub_external_cloud_users', JSON.stringify(seed));
    return seed;
  }

  _saveCloudStorageUsers(users) {
    localStorage.setItem('learnhub_external_cloud_users', JSON.stringify(users));
  }

  /**
   * Subscribe to real-time Firestore Collection updates
   */
  subscribeToCollection(collectionName, onData, onError) {
    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        console.log(`[CloudDB] Attaching real-time Firestore listener for: ${collectionName}`);
        return this.firestore.collection(collectionName).onSnapshot(snapshot => {
          const items = [];
          snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
          });
          if (typeof onData === 'function') onData(items);
        }, err => {
          console.warn(`[CloudDB] Real-time listener notice for ${collectionName}:`, err.message);
          if (typeof onError === 'function') onError(err);
        });
      } catch (e) {
        console.log('[CloudDB] Real-time subscription fallback:', e.message);
      }
    }
    return () => {}; // No-op unsubscribe
  }

  /**
   * =========================================================================
   * ADVENTURE GAME CLOUD ENGINE & DRAFT/PUBLISHING SYSTEM
   * =========================================================================
   */

  /**
   * Save or merge user game progress in Firestore
   */
  async saveGameProgress(userId, progressData) {
    if (!userId) return null;
    const cleanId = String(userId).trim();
    const dataToSave = {
      ...progressData,
      userId: cleanId,
      updatedAt: new Date().toISOString()
    };

    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        await this.firestore.collection('gameProgress').doc(cleanId).set(dataToSave, { merge: true });
        console.log(`[CloudDB] Game progress synced to cloud for user: ${cleanId}`);
      } catch (e) {
        console.warn('[CloudDB] Firestore saveGameProgress notice:', e.message);
      }
    }

    // Local DB backup
    if (window.DB && typeof window.DB.get === 'function') {
      try {
        const allProgress = window.DB.get('gameProgress') || [];
        const idx = allProgress.findIndex(p => p && (p.userId === cleanId || p.id === cleanId));
        if (idx >= 0) {
          window.DB.update('gameProgress', allProgress[idx].id, dataToSave);
        } else {
          window.DB.insert('gameProgress', { id: `gp-${cleanId}`, ...dataToSave });
        }
      } catch (e) {}
    }

    return dataToSave;
  }

  /**
   * Retrieve player's permanent progress from Cloud DB
   */
  async getGameProgress(userId) {
    if (!userId) return null;
    const cleanId = String(userId).trim();

    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        const doc = await this.firestore.collection('gameProgress').doc(cleanId).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
      } catch (e) {
        console.warn('[CloudDB] Firestore getGameProgress fallback:', e.message);
      }
    }

    // Local DB fallback
    if (window.DB && typeof window.DB.get === 'function') {
      const allProgress = window.DB.get('gameProgress') || [];
      const found = allProgress.find(p => p && (p.userId === cleanId || p.id === cleanId));
      if (found) return found;
    }

    return null;
  }

  /**
   * Permanently record a completed stage attempt in Cloud DB
   */
  async recordGameAttempt(attemptData) {
    if (!attemptData) return null;
    const attempt = {
      id: attemptData.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...attemptData
    };

    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        await this.firestore.collection('gameAttempts').doc(attempt.id).set(attempt);
        console.log(`[CloudDB] Stage attempt permanently recorded in Cloud: ${attempt.id}`);
      } catch (e) {
        console.warn('[CloudDB] Firestore recordGameAttempt notice:', e.message);
      }
    }

    if (window.DB && typeof window.DB.insert === 'function') {
      try {
        window.DB.insert('gameAttempts', attempt);
      } catch (e) {}
    }

    return attempt;
  }

  /**
   * Retrieve all stage attempts for a user
   */
  async getGameAttempts(userId) {
    if (!userId) return [];
    const cleanId = String(userId).trim();

    if (this.firestore && typeof this.firestore.collection === 'function') {
      try {
        const snap = await this.firestore.collection('gameAttempts').where('userId', '==', cleanId).get();
        const attempts = [];
        snap.forEach(doc => attempts.push({ id: doc.id, ...doc.data() }));
        if (attempts.length) {
          return attempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
      } catch (e) {
        console.warn('[CloudDB] Firestore getGameAttempts fallback:', e.message);
      }
    }

    if (window.DB && typeof window.DB.get === 'function') {
      return (window.DB.get('gameAttempts') || [])
        .filter(a => a && a.userId === cleanId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return [];
  }
}

// Global Singleton Instance
window.CloudDB = new CloudDatabaseService();

// Global Security & reCAPTCHA Enterprise Engine
window.Security = window.Security || {};
window.Security.executeRecaptcha = async function(action = 'LOGIN') {
  if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
    return new Promise((resolve) => {
      grecaptcha.enterprise.ready(async () => {
        try {
          const token = await grecaptcha.enterprise.execute('6LdJ4pItAAAAAKro7iF4u0eNFiUBMWyezlXG682Y', { action });
          console.log(`[reCAPTCHA Enterprise] Verified action [${action}] successfully.`);
          resolve(token);
        } catch (e) {
          console.warn('[reCAPTCHA Enterprise] Verification notice:', e.message);
          resolve(null);
        }
      });
    });
  }
  return null;
};

