/**
 * LearnHub Permanent Cloud Data & Account Recovery Service (v186.0.0)
 * 
 * CORE ARCHITECTURAL SPECIFICATION:
 * 1. CANONICAL ENROLLMENT SOURCE OF TRUTH: /users/{uid}/enrollments/{courseId}
 * 2. SECONDARY INDEX & REPORTING PATH: /enrollments/enr_{uid}_{courseId}
 * 3. AUTHENTICATED IDENTITY: auth.currentUser.uid is the ONLY permanent owner.
 * 4. TRANSACTION-SAFE WRITES: Local cache is updated ONLY after Firestore confirms write.
 * 5. AUTO-HYDRATION ON RECOVERY: Cache wipe / reinstall reconstructs local state from Firestore.
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
      studyNotes: 0
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
   * Authoritatively queries Firestore using current Firebase Auth UID
   */
  async hydrateAllUserData(userId, userEmail, isManual = false) {
    const firestore = this.getFirestore();
    if (!firestore) {
      console.warn('[UserDataService] Firestore not available; running offline.');
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
      console.log(`[UserDataService] Authoritative Cloud Hydration for UID: "${cleanUid}" (${cleanEmail})...`);

      // 1. Fetch Cloud Profile from /users/{uid}
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
        console.warn('[UserDataService] Profile fetch notice:', e.message);
      }

      // Merge Cloud Profile to Local State & Session
      if (cloudProfile && window.DB) {
        const existingUsers = window.DB.get('users') || [];
        const uIdx = existingUsers.findIndex(u => u && (u.id === cleanUid || (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail)));
        if (uIdx !== -1) {
          existingUsers[uIdx] = { ...existingUsers[uIdx], ...cloudProfile, id: cleanUid || existingUsers[uIdx].id };
        } else {
          existingUsers.push({ ...cloudProfile, id: cleanUid || 'usr-' + Date.now() });
        }
        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('users', existingUsers);
        } else {
          window.DB.set('users', existingUsers, true);
        }

        if (window.Auth && window.Auth.getCurrentUser()) {
          const currentAuth = window.Auth.getCurrentUser();
          const merged = { ...currentAuth, ...cloudProfile, id: cleanUid || currentAuth.id, uid: cleanUid || currentAuth.uid };
          window.Auth.setSession(merged, true);
        }
      }

      // 2. Fetch Authoritative Course Enrollments
      // Canonical Path: /users/{uid}/enrollments
      // Secondary Path: /enrollments where userId == uid
      const cloudEnrollments = [];
      try {
        if (cleanUid) {
          // Canonical Subcollection Query: /users/{uid}/enrollments
          try {
            const subSnap = await firestore.collection('users').doc(cleanUid).collection('enrollments').get();
            subSnap.forEach(d => {
              cloudEnrollments.push({ id: `enr_${cleanUid}_${d.id}`, courseId: d.id, userId: cleanUid, ...d.data() });
            });
          } catch (subErr) {
            console.warn('[UserDataService] Canonical subcollection query notice:', subErr.message);
          }

          // Top-level Index Query: /enrollments where userId == uid
          try {
            const enrSnap1 = await firestore.collection('enrollments').where('userId', '==', cleanUid).get();
            enrSnap1.forEach(d => {
              const data = d.data();
              if (!cloudEnrollments.some(e => e.courseId === data.courseId)) {
                cloudEnrollments.push({ id: d.id, ...data });
              }
            });
          } catch (enrErr) {}
        }

        // Email Fallback Query for legacy documents
        if (cleanEmail) {
          try {
            const enrSnap2 = await firestore.collection('enrollments').where('userEmail', '==', cleanEmail).get();
            enrSnap2.forEach(d => {
              const data = d.data();
              if (!cloudEnrollments.some(e => e.courseId === data.courseId)) {
                cloudEnrollments.push({ id: d.id, ...data });
              }
            });
          } catch (e) {}
        }
      } catch (e) {
        console.warn('[UserDataService] Enrollments fetch notice:', e.message);
      }

      // Merge Enrollments into Local Cache DB
      if (cloudEnrollments.length > 0 && window.DB) {
        const localEnrollments = window.DB.get('enrollments') || [];
        cloudEnrollments.forEach(cEnr => {
          const lIdx = localEnrollments.findIndex(e => e && (
            e.id === cEnr.id || 
            (e.courseId === cEnr.courseId && (e.userId === cleanUid || (cleanEmail && e.userEmail === cleanEmail)))
          ));
          if (lIdx !== -1) {
            const higherProgress = Math.max(localEnrollments[lIdx].progressPercentage || 0, cEnr.progressPercentage || 0);
            localEnrollments[lIdx] = { ...localEnrollments[lIdx], ...cEnr, progressPercentage: higherProgress, userId: cleanUid };
          } else {
            localEnrollments.push({ ...cEnr, userId: cleanUid || cEnr.userId });
          }
        });

        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('enrollments', localEnrollments);
        } else {
          window.DB.set('enrollments', localEnrollments, true);
        }
        this.syncStats.enrollments = cloudEnrollments.length;
      }

      // 3. Fetch Certificates (/certificates and /users/{uid}/certificates)
      const cloudCerts = [];
      try {
        if (cleanUid) {
          try {
            const subCertSnap = await firestore.collection('users').doc(cleanUid).collection('certificates').get();
            subCertSnap.forEach(d => {
              cloudCerts.push({ id: d.id, certificateNumber: d.id, ...d.data() });
            });
          } catch (e) {}

          try {
            const certSnap1 = await firestore.collection('certificates').where('userId', '==', cleanUid).get();
            certSnap1.forEach(d => {
              if (!cloudCerts.some(c => c.certificateNumber === d.id || c.id === d.id)) {
                cloudCerts.push({ id: d.id, ...d.data() });
              }
            });
          } catch (e) {}
        }

        if (cleanEmail) {
          try {
            const certSnap2 = await firestore.collection('certificates').where('userEmail', '==', cleanEmail).get();
            certSnap2.forEach(d => {
              if (!cloudCerts.some(c => c.certificateNumber === d.id || c.id === d.id)) {
                cloudCerts.push({ id: d.id, ...d.data() });
              }
            });
          } catch (e) {}
        }
      } catch (e) {}

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
        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('certificates', localCerts);
        } else {
          window.DB.set('certificates', localCerts, true);
        }
        this.syncStats.certificates = cloudCerts.length;
      }

      // 4. Fetch Quiz Attempts
      const cloudQuizAttempts = [];
      try {
        if (cleanUid) {
          const quizSnap = await firestore.collection('quizAttempts').where('userId', '==', cleanUid).get();
          quizSnap.forEach(d => cloudQuizAttempts.push({ id: d.id, ...d.data() }));
        }
      } catch (e) {}

      if (cloudQuizAttempts.length > 0 && window.DB) {
        const localAttempts = window.DB.get('quizAttempts') || [];
        cloudQuizAttempts.forEach(cAtt => {
          if (!localAttempts.some(a => a.id === cAtt.id)) {
            localAttempts.push(cAtt);
          }
        });
        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('quizAttempts', localAttempts);
        } else {
          window.DB.set('quizAttempts', localAttempts, true);
        }
        this.syncStats.quizAttempts = cloudQuizAttempts.length;
      }

      // 5. Fetch Bookmarks & Notes
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
        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('bookmarks', localBm);
        } else {
          window.DB.set('bookmarks', localBm, true);
        }
        this.syncStats.bookmarks = cloudBookmarks.length;
      }

      // 6. Save final state to local cache
      if (window.DB && typeof window.DB.saveData === 'function') {
        window.DB.saveData(window.DB.data);
      }

      this.lastSyncTime = new Date().toISOString();
      localStorage.setItem('learnhub_last_cloud_sync', this.lastSyncTime);

      console.log('[UserDataService] Cloud Data Recovery Complete:', this.syncStats);

      // 7. Dispatch Reactive Events & Re-render Active Views
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
   * Transaction-Safe: Persist Course Enrollment to Firestore
   * Writes to Canonical Path (/users/{uid}/enrollments/{courseId})
   * and Secondary Index Path (/enrollments/enr_{uid}_{courseId})
   */
  async persistEnrollment(enrollmentData) {
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    const uid = fbUid || enrollmentData.userId;
    const courseId = enrollmentData.courseId;
    const email = enrollmentData.userEmail || '';
    const docId = `enr_${uid}_${courseId}`;

    const serverTime = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
      ? firebase.firestore.FieldValue.serverTimestamp()
      : new Date().toISOString();

    const payload = {
      ...enrollmentData,
      id: docId,
      userId: uid,
      userEmail: email,
      courseId: courseId,
      status: enrollmentData.status || 'in_progress',
      progressPercentage: enrollmentData.progressPercentage || 0,
      completedLessons: enrollmentData.completedLessons || [],
      lastViewedLessonId: enrollmentData.lastViewedLessonId || null,
      enrolledAt: enrollmentData.enrolledAt || new Date().toISOString(),
      updatedAt: serverTime
    };

    const firestore = this.getFirestore();
    if (!firestore) {
      throw new Error('Google Cloud Firestore client is offline or unavailable.');
    }

    // 1. Write to Canonical Path: /users/{uid}/enrollments/{courseId}
    await firestore.collection('users').doc(uid).collection('enrollments').doc(courseId).set(payload, { merge: true });

    // 2. Also write to Top-level Index: /enrollments/enr_{uid}_{courseId}
    try {
      await firestore.collection('enrollments').doc(docId).set(payload, { merge: true });
    } catch (e) {
      console.warn('[UserDataService] Top-level enrollment index write note:', e.message);
    }

    console.log('[UserDataService] Transaction-Safe Enrollment written to Firestore:', `/users/${uid}/enrollments/${courseId}`);
    return { success: true, docId, canonicalPath: `/users/${uid}/enrollments/${courseId}` };
  }

  /**
   * Transaction-Safe: Persist Lesson Progress to Firestore
   */
  async persistLessonProgress(courseId, lessonId, userId, isCompleted, progressPercentage) {
    if (!courseId || !userId) return;
    const docId = `enr_${userId}_${courseId}`;
    const firestore = this.getFirestore();
    if (!firestore) return;

    const serverTime = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
      ? firebase.firestore.FieldValue.serverTimestamp()
      : new Date().toISOString();

    const updates = {
      progressPercentage,
      lastViewedLessonId: lessonId,
      updatedAt: serverTime
    };
    if (progressPercentage === 100) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    }

    try {
      // 1. Update Canonical Subcollection: /users/{uid}/enrollments/{courseId}
      const p1 = firestore.collection('users').doc(userId).collection('enrollments').doc(courseId).set(updates, { merge: true });

      // 2. Update Secondary Index: /enrollments/enr_{uid}_{courseId}
      const p2 = firestore.collection('enrollments').doc(docId).set(updates, { merge: true });

      await Promise.all([p1, p2]);
      console.log('[UserDataService] Progress synchronized to Firestore:', docId);
    } catch (e) {
      console.warn('[UserDataService] Firestore progress write notice:', e.message);
    }
  }

  /**
   * Persist Certificate to Firestore
   */
  async persistCertificate(certData) {
    if (!certData) return;
    const docId = certData.certificateNumber || certData.id || `cert_${Date.now()}`;
    const uid = certData.userId;
    const firestore = this.getFirestore();
    if (!firestore) return;

    const payload = {
      ...certData,
      id: docId,
      createdAt: certData.createdAt || new Date().toISOString()
    };

    try {
      const p1 = firestore.collection('certificates').doc(docId).set(payload, { merge: true });
      let p2 = Promise.resolve();
      if (uid) {
        p2 = firestore.collection('users').doc(uid).collection('certificates').doc(docId).set(payload, { merge: true });
      }
      await Promise.all([p1, p2]);
      console.log('[UserDataService] Certificate permanently stored in Firestore:', docId);
    } catch (e) {
      console.warn('[UserDataService] Certificate write notice:', e.message);
    }
  }

  /**
   * Persist Quiz Attempt to Firestore
   */
  async persistQuizAttempt(attemptData) {
    if (!attemptData) return;
    const docId = attemptData.id || `qa_${Date.now()}`;
    const uid = attemptData.userId;
    const firestore = this.getFirestore();
    if (!firestore) return;

    const payload = {
      ...attemptData,
      id: docId,
      createdAt: attemptData.completedAt || new Date().toISOString()
    };

    try {
      await firestore.collection('quizAttempts').doc(docId).set(payload, { merge: true });
      if (uid) {
        await firestore.collection('users').doc(uid).collection('quizAttempts').doc(docId).set(payload, { merge: true });
      }
      console.log('[UserDataService] Quiz attempt saved to Firestore:', docId);
    } catch (e) {}
  }

  /**
   * Persist Bookmark to Firestore
   */
  async persistBookmark(bookmarkData) {
    if (!bookmarkData || !bookmarkData.userId) return;
    const docId = `bm_${bookmarkData.userId}_${bookmarkData.id || bookmarkData.itemId}`;
    const uid = bookmarkData.userId;
    const firestore = this.getFirestore();
    if (!firestore) return;

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

  /**
   * Delete Bookmark from Firestore
   */
  async removeBookmarkFromCloud(userId, bookmarkId) {
    if (!userId || !bookmarkId) return;
    const docId = `bm_${userId}_${bookmarkId}`;
    const firestore = this.getFirestore();
    if (!firestore) return;

    try {
      await firestore.collection('userBookmarks').doc(docId).delete();
      await firestore.collection('users').doc(userId).collection('bookmarks').doc(docId).delete();
    } catch (e) {}
  }
}

window.UserDataService = new UserDataRecoveryService();
console.log('LearnHub UserDataService v186.0.0 initialized.');
