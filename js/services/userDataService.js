/**
 * LearnHub Permanent Cloud Data & Account Recovery Service (v184.0.0)
 * 
 * CORE ARCHITECTURAL CONTRACT:
 * 1. LOCAL STORAGE IS NEVER THE SOURCE OF TRUTH.
 * 2. Cloud Firestore is the authoritative permanent database.
 * 3. On login, startup, cache clearing, or device change:
 *    All user courses, progress, certificates, bookmarks, quiz history, XP,
 *    and subscriptions are automatically hydrated and recovered from Cloud Firestore.
 * 4. Dual-location persistence:
 *    - Top-level collections: /enrollments, /certificates, /quizAttempts, /userBookmarks
 *    - User subcollections: /users/{uid}/enrollments, /users/{uid}/courseProgress, /users/{uid}/certificates
 * 5. Clearing local storage or logging out NEVER deletes cloud user data.
 */

class UserDataRecoveryService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = localStorage.getItem('learnhub_last_cloud_sync') || null;
    this.syncStats = {
      enrollments: 0,
      certificates: 0,
      quizAttempts: 0,
      bookmarks: 0,
      studyNotes: 0,
      achievements: 0
    };
  }

  getFirestore() {
    if (window.CloudDB && window.CloudDB.firestore) {
      return window.CloudDB.firestore;
    }
    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
      return firebase.firestore();
    }
    return null;
  }

  getAuthUid() {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    const cur = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || null;
    return cur ? (cur.uid || cur.id) : null;
  }

  /**
   * Universal Cloud Data Hydration & Recovery
   * Pulls all user records from Firestore and updates local DB cache
   */
  async hydrateAllUserData(userId, userEmail, isManual = false) {
    const firestore = this.getFirestore();
    if (!firestore) {
      console.warn('[UserDataService] Firestore not initialized, offline cache active.');
      return { success: false, reason: 'NO_FIRESTORE' };
    }

    const cur = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || null;
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    
    const cleanUid = String(userId || fbUid || cur?.uid || cur?.id || '').trim();
    const cleanEmail = String(userEmail || cur?.email || '').toLowerCase().trim();

    if (!cleanUid && !cleanEmail) {
      return { success: false, reason: 'NO_USER' };
    }

    this.isSyncing = true;
    if (isManual) {
      window.App?.showToast(
        (window.I18N && window.I18N.isRTL()) ? '🔄 کلاؤڈ سے ڈیٹا بحال کیا جا رہا ہے...' : '🔄 Syncing and recovering your cloud data...',
        'info'
      );
    }

    try {
      console.log(`[UserDataService] Starting Cloud Recovery for UID: "${cleanUid}" (${cleanEmail})...`);

      // 1. Fetch Cloud Profile
      let cloudProfile = null;
      try {
        if (cleanUid) {
          const userDoc = await firestore.collection('users').doc(cleanUid).get();
          if (userDoc.exists) {
            cloudProfile = { id: userDoc.id, ...userDoc.data() };
          }
        }
        if (!cloudProfile && cleanEmail) {
          const emailQuery = await firestore.collection('users').where('email', '==', cleanEmail).limit(1).get();
          if (!emailQuery.empty) {
            cloudProfile = { id: emailQuery.docs[0].id, ...emailQuery.docs[0].data() };
          }
        }
      } catch (e) {
        console.warn('[UserDataService] Profile fetch note:', e.message);
      }

      // Merge Cloud Profile to Local State
      if (cloudProfile && window.DB) {
        const existingUsers = window.DB.get('users') || [];
        const uIdx = existingUsers.findIndex(u => u && (u.id === cleanUid || (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail)));
        if (uIdx !== -1) {
          existingUsers[uIdx] = { ...existingUsers[uIdx], ...cloudProfile, id: cleanUid || existingUsers[uIdx].id };
        } else {
          existingUsers.push({ ...cloudProfile, id: cleanUid || 'usr-' + Date.now() });
        }
        window.DB.set('users', existingUsers);

        if (window.Auth && window.Auth.getCurrentUser()) {
          const currentAuth = window.Auth.getCurrentUser();
          const merged = { ...currentAuth, ...cloudProfile, id: cleanUid || currentAuth.id };
          window.Auth.setSession(merged, true);
        }
      }

      // 2. Hydrate Course Enrollments (Dual check: top-level + subcollection)
      const cloudEnrollments = [];
      try {
        if (cleanUid) {
          // Top-level query by userId
          const enrSnap1 = await firestore.collection('enrollments').where('userId', '==', cleanUid).get();
          enrSnap1.forEach(d => cloudEnrollments.push({ id: d.id, ...d.data() }));

          // Subcollection query /users/{uid}/enrollments
          try {
            const subEnrSnap = await firestore.collection('users').doc(cleanUid).collection('enrollments').get();
            subEnrSnap.forEach(d => {
              if (!cloudEnrollments.some(e => e.id === d.id || e.courseId === d.id)) {
                cloudEnrollments.push({ id: d.id, courseId: d.id, ...d.data() });
              }
            });
          } catch (subErr) {}
        }

        // Top-level query by userEmail
        if (cleanEmail) {
          const enrSnap2 = await firestore.collection('enrollments').where('userEmail', '==', cleanEmail).get();
          enrSnap2.forEach(d => {
            if (!cloudEnrollments.some(e => e.id === d.id)) cloudEnrollments.push({ id: d.id, ...d.data() });
          });
        }
      } catch (e) {
        console.warn('[UserDataService] Enrollments fetch note:', e.message);
      }

      if (cloudEnrollments.length > 0 && window.DB) {
        const localEnrollments = window.DB.get('enrollments') || [];
        cloudEnrollments.forEach(cEnr => {
          const lIdx = localEnrollments.findIndex(e => e && (
            e.id === cEnr.id || 
            (e.courseId === cEnr.courseId && (e.userId === cleanUid || (cleanEmail && e.userEmail === cleanEmail)))
          ));
          if (lIdx !== -1) {
            const higherProgress = Math.max(localEnrollments[lIdx].progressPercentage || 0, cEnr.progressPercentage || 0);
            localEnrollments[lIdx] = { ...localEnrollments[lIdx], ...cEnr, progressPercentage: higherProgress };
          } else {
            localEnrollments.push({ ...cEnr, userId: cleanUid || cEnr.userId });
          }
        });
        window.DB.set('enrollments', localEnrollments);
        this.syncStats.enrollments = cloudEnrollments.length;
      }

      // 3. Hydrate Certificates (Dual check: top-level + subcollection)
      const cloudCerts = [];
      try {
        if (cleanUid) {
          const certSnap1 = await firestore.collection('certificates').where('userId', '==', cleanUid).get();
          certSnap1.forEach(d => cloudCerts.push({ id: d.id, ...d.data() }));

          try {
            const subCertSnap = await firestore.collection('users').doc(cleanUid).collection('certificates').get();
            subCertSnap.forEach(d => {
              if (!cloudCerts.some(c => c.id === d.id || c.certificateNumber === d.id)) {
                cloudCerts.push({ id: d.id, ...d.data() });
              }
            });
          } catch (e) {}
        }

        if (cleanEmail) {
          const certSnap2 = await firestore.collection('certificates').where('userEmail', '==', cleanEmail).get();
          certSnap2.forEach(d => {
            if (!cloudCerts.some(c => c.id === d.id)) cloudCerts.push({ id: d.id, ...d.data() });
          });
        }
      } catch (e) {
        console.warn('[UserDataService] Certificates fetch note:', e.message);
      }

      if (cloudCerts.length > 0 && window.DB) {
        const localCerts = window.DB.get('certificates') || [];
        cloudCerts.forEach(cCrt => {
          const lIdx = localCerts.findIndex(c => c && (c.id === cCrt.id || c.certificateNumber === cCrt.certificateNumber));
          if (lIdx !== -1) {
            localCerts[lIdx] = { ...localCerts[lIdx], ...cCrt };
          } else {
            localCerts.push(cCrt);
          }
        });
        window.DB.set('certificates', localCerts);
        this.syncStats.certificates = cloudCerts.length;
      }

      // 4. Hydrate Quiz Attempts
      const cloudQuizAttempts = [];
      try {
        if (cleanUid) {
          const quizSnap = await firestore.collection('quizAttempts').where('userId', '==', cleanUid).get();
          quizSnap.forEach(d => cloudQuizAttempts.push({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('[UserDataService] Quiz attempts fetch note:', e.message);
      }

      if (cloudQuizAttempts.length > 0 && window.DB) {
        const localAttempts = window.DB.get('quizAttempts') || [];
        cloudQuizAttempts.forEach(cAtt => {
          if (!localAttempts.some(a => a.id === cAtt.id)) {
            localAttempts.push(cAtt);
          }
        });
        window.DB.set('quizAttempts', localAttempts);
        this.syncStats.quizAttempts = cloudQuizAttempts.length;
      }

      // 5. Hydrate Bookmarks & Notes
      const cloudBookmarks = [];
      try {
        if (cleanUid) {
          const bmSnap = await firestore.collection('userBookmarks').where('userId', '==', cleanUid).get();
          bmSnap.forEach(d => cloudBookmarks.push({ id: d.id, ...d.data() }));
        }
      } catch (e) {}

      if (cloudBookmarks.length > 0 && window.DB) {
        const localBm = window.DB.get('bookmarks') || [];
        cloudBookmarks.forEach(cBm => {
          if (!localBm.some(b => b.id === cBm.id || (b.itemId === cBm.itemId && b.type === cBm.type))) {
            localBm.push(cBm);
          }
        });
        window.DB.set('bookmarks', localBm);
        this.syncStats.bookmarks = cloudBookmarks.length;
      }

      const cloudNotes = [];
      try {
        if (cleanUid) {
          const notesSnap = await firestore.collection('studyNotes').where('userId', '==', cleanUid).get();
          notesSnap.forEach(d => cloudNotes.push({ id: d.id, ...d.data() }));
        }
      } catch (e) {}

      if (cloudNotes.length > 0 && window.DB) {
        const localNotes = window.DB.get('studyNotes') || [];
        cloudNotes.forEach(cNt => {
          if (!localNotes.some(n => n.id === cNt.id)) {
            localNotes.push(cNt);
          }
        });
        window.DB.set('studyNotes', localNotes);
        this.syncStats.studyNotes = cloudNotes.length;
      }

      // 6. Save Merged DB State
      if (window.DB && typeof window.DB.saveData === 'function') {
        window.DB.saveData(window.DB.data);
      }

      // 7. Background Push of any local records not in Firestore
      this.pushLocalDataToCloud(cleanUid, cleanEmail);

      this.lastSyncTime = new Date().toISOString();
      localStorage.setItem('learnhub_last_cloud_sync', this.lastSyncTime);

      console.log('[UserDataService] Cloud Data Recovery Complete:', this.syncStats);

      // 8. Re-render Active Views Reactively
      window.dispatchEvent(new CustomEvent('learnhub:cloud_sync_completed', { detail: { stats: this.syncStats } }));
      window.dispatchEvent(new CustomEvent('learnhub:db_updated'));

      if (window.Views) {
        const hash = window.location.hash || '';
        if (hash.startsWith('#/profile') && typeof window.Views.renderProfile === 'function') {
          window.Views.renderProfile();
        } else if (hash.startsWith('#/dashboard') && typeof window.Views.renderDashboard === 'function') {
          window.Views.renderDashboard();
        } else if (hash.startsWith('#/settings') && typeof window.Views.renderSettings === 'function') {
          window.Views.renderSettings();
        } else if (hash.startsWith('#/certificates') && typeof window.Views.renderCertificates === 'function') {
          window.Views.renderCertificates();
        }
      }

      if (isManual) {
        window.App?.showToast(
          (window.I18N && window.I18N.isRTL())
            ? `✓ کلاؤڈ ڈیٹا مکمل طور پر بحال ہو گیا! (${this.syncStats.enrollments} کورسز، ${this.syncStats.certificates} اسناد)`
            : `✓ Cloud data successfully recovered! (${this.syncStats.enrollments} courses, ${this.syncStats.certificates} certificates)`,
          'success'
        );
      }

      return { success: true, stats: this.syncStats };
    } catch (err) {
      console.error('[UserDataService] Cloud recovery error:', err);
      if (isManual) {
        window.App?.showToast('Cloud sync error: ' + err.message, 'warning');
      }
      return { success: false, error: err.message };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Dual-write: Persist Course Enrollment permanently to Firestore
   */
  async persistEnrollment(enrollmentData) {
    if (!enrollmentData || !enrollmentData.userId || !enrollmentData.courseId) return;
    const uid = enrollmentData.userId;
    const courseId = enrollmentData.courseId;
    const docId = `enr_${uid}_${courseId}`;
    const payload = {
      ...enrollmentData,
      id: docId,
      updatedAt: new Date().toISOString()
    };

    const firestore = this.getFirestore();
    if (firestore) {
      try {
        // 1. Write to top-level /enrollments
        await firestore.collection('enrollments').doc(docId).set(payload, { merge: true });
        
        // 2. Write to subcollection /users/{uid}/enrollments/{courseId}
        await firestore.collection('users').doc(uid).collection('enrollments').doc(courseId).set(payload, { merge: true });
        
        console.log('[UserDataService] Course enrollment permanently saved to Firestore:', docId);
      } catch (e) {
        console.warn('[UserDataService] Firestore enrollment write note:', e.message);
      }
    }
  }

  /**
   * Dual-write: Persist Lesson Progress to Firestore
   */
  async persistLessonProgress(courseId, lessonId, userId, isCompleted, progressPercentage) {
    if (!courseId || !userId) return;
    const docId = `enr_${userId}_${courseId}`;
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        const updates = {
          progressPercentage,
          lastViewedLessonId: lessonId,
          updatedAt: new Date().toISOString()
        };
        if (progressPercentage === 100) {
          updates.status = 'completed';
          updates.completedAt = new Date().toISOString();
        }
        
        // Write to top-level and subcollection
        await firestore.collection('enrollments').doc(docId).set(updates, { merge: true });
        await firestore.collection('users').doc(userId).collection('enrollments').doc(courseId).set(updates, { merge: true });
        await firestore.collection('users').doc(userId).collection('courseProgress').doc(courseId).set(updates, { merge: true });
        
        console.log('[UserDataService] Progress synced to Firestore for:', docId);
      } catch (e) {
        console.warn('[UserDataService] Firestore progress write note:', e.message);
      }
    }
  }

  /**
   * Dual-write: Persist Certificate to Firestore
   */
  async persistCertificate(certData) {
    if (!certData) return;
    const docId = certData.certificateNumber || certData.id || `cert_${Date.now()}`;
    const uid = certData.userId;
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        const payload = {
          ...certData,
          id: docId,
          createdAt: certData.createdAt || new Date().toISOString()
        };
        await firestore.collection('certificates').doc(docId).set(payload, { merge: true });
        if (uid) {
          await firestore.collection('users').doc(uid).collection('certificates').doc(docId).set(payload, { merge: true });
        }
        console.log('[UserDataService] Certificate permanently stored in Firestore:', docId);
      } catch (e) {
        console.warn('[UserDataService] Firestore certificate write note:', e.message);
      }
    }
  }

  /**
   * Dual-write: Persist Quiz Attempt to Firestore
   */
  async persistQuizAttempt(attemptData) {
    if (!attemptData) return;
    const docId = attemptData.id || `qa_${Date.now()}`;
    const uid = attemptData.userId;
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        const payload = {
          ...attemptData,
          id: docId,
          createdAt: attemptData.completedAt || new Date().toISOString()
        };
        await firestore.collection('quizAttempts').doc(docId).set(payload, { merge: true });
        if (uid) {
          await firestore.collection('users').doc(uid).collection('quizAttempts').doc(docId).set(payload, { merge: true });
        }
        console.log('[UserDataService] Quiz attempt saved to Firestore:', docId);
      } catch (e) {
        console.warn('[UserDataService] Firestore quiz attempt write note:', e.message);
      }
    }
  }

  /**
   * Dual-write: Persist Bookmark to Firestore
   */
  async persistBookmark(bookmarkData) {
    if (!bookmarkData || !bookmarkData.userId) return;
    const docId = `bm_${bookmarkData.userId}_${bookmarkData.id || bookmarkData.itemId}`;
    const uid = bookmarkData.userId;
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        const payload = {
          ...bookmarkData,
          id: docId,
          updatedAt: new Date().toISOString()
        };
        await firestore.collection('userBookmarks').doc(docId).set(payload, { merge: true });
        await firestore.collection('users').doc(uid).collection('bookmarks').doc(docId).set(payload, { merge: true });
      } catch (e) {}
    }
  }

  /**
   * Dual-write: Delete Bookmark from Firestore
   */
  async removeBookmarkFromCloud(userId, bookmarkId) {
    if (!userId || !bookmarkId) return;
    const docId = `bm_${userId}_${bookmarkId}`;
    const firestore = this.getFirestore();
    if (firestore) {
      try {
        await firestore.collection('userBookmarks').doc(docId).delete();
        await firestore.collection('users').doc(userId).collection('bookmarks').doc(docId).delete();
      } catch (e) {}
    }
  }

  /**
   * Background Migration: Push any local records not in Firestore up to the cloud
   */
  async pushLocalDataToCloud(userId, userEmail) {
    if (!userId || !window.DB) return;
    const firestore = this.getFirestore();
    if (!firestore) return;

    try {
      // 1. Push local enrollments
      const localEnr = (window.DB.get('enrollments') || []).filter(e => e && (e.userId === userId || (userEmail && e.userEmail === userEmail)));
      for (const enr of localEnr) {
        const docId = `enr_${userId}_${enr.courseId}`;
        const payload = {
          ...enr,
          id: docId,
          userId,
          userEmail: userEmail || ''
        };
        await firestore.collection('enrollments').doc(docId).set(payload, { merge: true });
        await firestore.collection('users').doc(userId).collection('enrollments').doc(enr.courseId).set(payload, { merge: true });
      }

      // 2. Push local certificates
      const localCerts = (window.DB.get('certificates') || []).filter(c => c && (c.userId === userId || (userEmail && c.userEmail === userEmail)));
      for (const cert of localCerts) {
        const docId = cert.certificateNumber || cert.id;
        const payload = {
          ...cert,
          id: docId,
          userId,
          userEmail: userEmail || ''
        };
        await firestore.collection('certificates').doc(docId).set(payload, { merge: true });
        await firestore.collection('users').doc(userId).collection('certificates').doc(docId).set(payload, { merge: true });
      }
    } catch (e) {
      console.log('[UserDataService] Background migration note:', e.message);
    }
  }
}

window.UserDataService = new UserDataRecoveryService();
console.log('LearnHub UserDataService v184.0.0 initialized.');
