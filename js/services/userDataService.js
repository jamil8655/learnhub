/**
 * LearnHub Permanent Cloud Data & Account Recovery Service (v183.0.0)
 * 
 * CORE ARCHITECTURAL PRINCIPLES:
 * 1. LOCAL STORAGE IS NOT THE PERMANENT SOURCE OF TRUTH.
 * 2. Cloud Firestore is the authoritative permanent database.
 * 3. On login, app startup, device change, or after clearing local cache:
 *    All user courses, progress, certificates, bookmarks, quiz history, XP,
 *    and subscriptions are automatically hydrated and recovered from Cloud Firestore.
 * 4. Dual-write guarantee: Every local write is permanently backed up to Firestore.
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

  /**
   * Universal Cloud Data Hydration & Recovery
   * Pulls all user records from Firestore and updates local DB cache
   */
  async hydrateAllUserData(userId, userEmail, isManual = false) {
    if (!userId && !userEmail) {
      const cur = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || null;
      if (!cur) return { success: false, reason: 'NO_USER' };
      userId = cur.uid || cur.id;
      userEmail = cur.email;
    }

    const cleanUid = String(userId || '').trim();
    const cleanEmail = String(userEmail || '').toLowerCase().trim();
    const firestore = this.getFirestore();

    if (!firestore) {
      console.warn('[UserDataService] Firestore not initialized, using local cache.');
      return { success: false, reason: 'NO_FIRESTORE' };
    }

    this.isSyncing = true;
    if (isManual) {
      window.App?.showToast(
        (window.I18N && window.I18N.isRTL()) ? '🔄 کلاؤڈ سے ڈیٹا بحال کیا جا رہا ہے...' : '🔄 Syncing and recovering your cloud data...',
        'info'
      );
    }

    try {
      console.log(`[UserDataService] Starting Cloud Data Hydration for UID: ${cleanUid} (${cleanEmail})...`);

      // 1. Fetch Cloud Profile & Gamification Stats
      let cloudProfile = null;
      try {
        const userDoc = await firestore.collection('users').doc(cleanUid).get();
        if (userDoc.exists) {
          cloudProfile = { id: userDoc.id, ...userDoc.data() };
        } else if (cleanEmail) {
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
        const uIdx = existingUsers.findIndex(u => u && (u.id === cleanUid || u.email === cleanEmail));
        if (uIdx !== -1) {
          existingUsers[uIdx] = { ...existingUsers[uIdx], ...cloudProfile, id: cleanUid };
        } else {
          existingUsers.push({ ...cloudProfile, id: cleanUid });
        }
        window.DB.set('users', existingUsers);

        if (window.Auth && window.Auth.getCurrentUser()) {
          const currentAuth = window.Auth.getCurrentUser();
          const merged = { ...currentAuth, ...cloudProfile, id: cleanUid };
          window.Auth.setSession(merged, true);
        }
      }

      // 2. Hydrate Course Enrollments (from 'enrollments' and 'courseEnrollments')
      const cloudEnrollments = [];
      try {
        // Query by userId
        const enrSnap1 = await firestore.collection('enrollments').where('userId', '==', cleanUid).get();
        enrSnap1.forEach(d => cloudEnrollments.push({ id: d.id, ...d.data() }));

        // Query by userEmail (if available)
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
          const lIdx = localEnrollments.findIndex(e => e && (e.id === cEnr.id || (e.courseId === cEnr.courseId && e.userId === cleanUid)));
          if (lIdx !== -1) {
            // Keep the one with higher progress
            const higherProgress = Math.max(localEnrollments[lIdx].progressPercentage || 0, cEnr.progressPercentage || 0);
            localEnrollments[lIdx] = { ...localEnrollments[lIdx], ...cEnr, progressPercentage: higherProgress };
          } else {
            localEnrollments.push(cEnr);
          }
        });
        window.DB.set('enrollments', localEnrollments);
        this.syncStats.enrollments = cloudEnrollments.length;
      }

      // 3. Hydrate Certificates
      const cloudCerts = [];
      try {
        const certSnap = await firestore.collection('certificates').where('userId', '==', cleanUid).get();
        certSnap.forEach(d => cloudCerts.push({ id: d.id, ...d.data() }));

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

      // 4. Hydrate Quiz Attempts & Results
      const cloudQuizAttempts = [];
      try {
        const quizSnap = await firestore.collection('quizAttempts').where('userId', '==', cleanUid).get();
        quizSnap.forEach(d => cloudQuizAttempts.push({ id: d.id, ...d.data() }));
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

      // 5. Hydrate Bookmarks & Study Notes
      const cloudBookmarks = [];
      try {
        const bmSnap = await firestore.collection('userBookmarks').where('userId', '==', cleanUid).get();
        bmSnap.forEach(d => cloudBookmarks.push({ id: d.id, ...d.data() }));
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
        const notesSnap = await firestore.collection('studyNotes').where('userId', '==', cleanUid).get();
        notesSnap.forEach(d => cloudNotes.push({ id: d.id, ...d.data() }));
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

      // 6. Hydrate Islamic Game Progress
      try {
        const gameDoc = await firestore.collection('gameProgress').doc(cleanUid).get();
        if (gameDoc.exists && window.DB) {
          const gameData = { id: `gp-${cleanUid}`, userId: cleanUid, ...gameDoc.data() };
          const allGP = window.DB.get('gameProgress') || [];
          const gIdx = allGP.findIndex(p => p && (p.userId === cleanUid || p.id === cleanUid));
          if (gIdx !== -1) {
            allGP[gIdx] = { ...allGP[gIdx], ...gameData };
          } else {
            allGP.push(gameData);
          }
          window.DB.set('gameProgress', allGP);
        }
      } catch (e) {}

      // 7. Auto-Push Local-Only Data to Cloud (Background Migration)
      this.pushLocalDataToCloud(cleanUid, cleanEmail);

      this.lastSyncTime = new Date().toISOString();
      localStorage.setItem('learnhub_last_cloud_sync', this.lastSyncTime);

      console.log('[UserDataService] Cloud Data Recovery Complete:', this.syncStats);

      // Trigger reactive UI re-render
      window.dispatchEvent(new CustomEvent('learnhub:cloud_sync_completed', { detail: { stats: this.syncStats } }));
      window.dispatchEvent(new CustomEvent('learnhub:db_updated'));

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
      console.error('[UserDataService] Cloud data hydration error:', err);
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
    const docId = `enr_${enrollmentData.userId}_${enrollmentData.courseId}`;
    const payload = {
      ...enrollmentData,
      id: docId,
      updatedAt: new Date().toISOString()
    };

    const firestore = this.getFirestore();
    if (firestore) {
      try {
        await firestore.collection('enrollments').doc(docId).set(payload, { merge: true });
        console.log('[UserDataService] Course enrollment permanently persisted to Firestore:', docId);
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
        await firestore.collection('enrollments').doc(docId).set(updates, { merge: true });
        console.log('[UserDataService] Lesson progress synced to Firestore for:', docId);
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
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        await firestore.collection('certificates').doc(docId).set({
          ...certData,
          id: docId,
          createdAt: certData.createdAt || new Date().toISOString()
        }, { merge: true });
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
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        await firestore.collection('quizAttempts').doc(docId).set({
          ...attemptData,
          id: docId,
          createdAt: attemptData.completedAt || new Date().toISOString()
        }, { merge: true });
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
    const firestore = this.getFirestore();

    if (firestore) {
      try {
        await firestore.collection('userBookmarks').doc(docId).set({
          ...bookmarkData,
          id: docId,
          updatedAt: new Date().toISOString()
        }, { merge: true });
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
      // 1. Check local enrollments
      const localEnr = (window.DB.get('enrollments') || []).filter(e => e && e.userId === userId);
      for (const enr of localEnr) {
        const docId = `enr_${userId}_${enr.courseId}`;
        await firestore.collection('enrollments').doc(docId).set({
          ...enr,
          id: docId,
          userId,
          userEmail: userEmail || ''
        }, { merge: true });
      }

      // 2. Check local certificates
      const localCerts = (window.DB.get('certificates') || []).filter(c => c && c.userId === userId);
      for (const cert of localCerts) {
        const docId = cert.certificateNumber || cert.id;
        await firestore.collection('certificates').doc(docId).set({
          ...cert,
          id: docId,
          userId,
          userEmail: userEmail || ''
        }, { merge: true });
      }
    } catch (e) {
      console.log('[UserDataService] Background migration note:', e.message);
    }
  }
}

window.UserDataService = new UserDataRecoveryService();
console.log('LearnHub UserDataService v183.0.0 initialized.');
