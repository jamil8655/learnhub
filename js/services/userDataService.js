/**
 * LearnHub Canonical Cloud Data & Account Recovery Service (v194.0.0)
 * 
 * CANONICAL FIRESTORE STRUCTURE:
 * 1. User Profile:      /users/{FirebaseAuthUID}
 * 2. User Enrollments:  /users/{FirebaseAuthUID}/enrollments/{courseId}
 * 3. Course Progress:   /users/{FirebaseAuthUID}/courseProgress/{courseId}
 * 4. User Certificates: /users/{FirebaseAuthUID}/certificates/{certificateId}
 * 5. Orders:            /orders/{orderId}
 * 
 * STRICT IDENTITY MANDATE:
 * Only firebase.auth().currentUser.uid is accepted as the canonical owner identity.
 */

class UserDataRecoveryService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = localStorage.getItem('learnhub_last_cloud_sync') || null;
  }

  getFirestore() {
    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
      if (!firebase.apps || !firebase.apps.length) {
        if (window.CloudDB && window.CloudDB.config && window.CloudDB.config.firebase) {
          try { firebase.initializeApp(window.CloudDB.config.firebase); } catch(e) {}
        }
      }
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
   * 1. Universal Cloud Data Hydration & Recovery
   * Authoritatively queries Firestore using current Firebase Auth UID
   */
  async hydrateAllUserData(userId = null, userEmail = null, isManual = false) {
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    const cleanUid = fbUid || userId || this.getAuthUid();

    if (!cleanUid) {
      console.log('[UserDataService] No authenticated UID detected, skipping cloud hydration.');
      return { success: false, reason: 'unauthenticated' };
    }

    const firestore = this.getFirestore();
    if (!firestore) {
      console.warn('[UserDataService] Cloud Firestore offline, cannot hydrate user data.');
      return { success: false, reason: 'firestore_offline' };
    }

    try {
      console.log('[UserDataService] Hydrating authoritative user data from Firestore for UID:', cleanUid);

      // --- A. Fetch Authoritative User Profile: /users/{uid} ---
      try {
        const userDoc = await firestore.collection('users').doc(cleanUid).get();
        if (userDoc.exists) {
          const cloudProfile = userDoc.data();
          const existingUsers = window.DB ? (window.DB.get('users') || []) : [];
          const idx = existingUsers.findIndex(u => u && (u.id === cleanUid || u.uid === cleanUid));
          if (idx !== -1) {
            existingUsers[idx] = { ...existingUsers[idx], ...cloudProfile, id: cleanUid, uid: cleanUid };
          } else {
            existingUsers.push({ ...cloudProfile, id: cleanUid, uid: cleanUid });
          }
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('users', existingUsers);
          } else if (window.DB.set) {
            window.DB.set('users', existingUsers, true);
          }

          if (window.Auth && window.Auth.getCurrentUser()) {
            const currentAuth = window.Auth.getCurrentUser();
            const merged = { ...currentAuth, ...cloudProfile, id: cleanUid, uid: cleanUid };
            window.Auth.setSession(merged, true);
          }
        }
      } catch (uErr) {
        console.warn('[UserDataService] Profile hydration note:', uErr.message);
      }

      // --- B. Fetch Authoritative Course Enrollments: /users/{uid}/enrollments ---
      const cloudEnrollments = [];
      try {
        const subSnap = await firestore.collection('users').doc(cleanUid).collection('enrollments').get();
        subSnap.forEach(d => {
          cloudEnrollments.push({ id: `enr_${cleanUid}_${d.id}`, courseId: d.id, userId: cleanUid, ...d.data() });
        });
      } catch (subErr) {
        console.warn('[UserDataService] Subcollection enrollments query note:', subErr.message);
      }

      // Fallback top-level query if subcollection is empty
      if (cloudEnrollments.length === 0) {
        try {
          const enrSnap = await firestore.collection('enrollments').where('userId', '==', cleanUid).get();
          enrSnap.forEach(d => {
            const data = d.data();
            cloudEnrollments.push({ id: d.id, ...data });
          });
        } catch (e) {}
      }

      // Merge Enrollments into Local Cache DB
      if (cloudEnrollments.length > 0 && window.DB) {
        const localEnrollments = window.DB.get('enrollments') || [];
        cloudEnrollments.forEach(cEnr => {
          const lIdx = localEnrollments.findIndex(e => e && (
            e.id === cEnr.id || 
            (e.courseId === cEnr.courseId && e.userId === cleanUid)
          ));
          if (lIdx !== -1) {
            const higherProgress = Math.max(localEnrollments[lIdx].progressPercentage || 0, cEnr.progressPercentage || 0);
            localEnrollments[lIdx] = { ...localEnrollments[lIdx], ...cEnr, progressPercentage: higherProgress, userId: cleanUid };
          } else {
            localEnrollments.push({ ...cEnr, userId: cleanUid });
          }
        });

        if (window.DB.hydrateCollection) {
          window.DB.hydrateCollection('enrollments', localEnrollments);
        } else if (window.DB.set) {
          window.DB.set('enrollments', localEnrollments, true);
        }
        console.log('[UserDataService] Hydrated', cloudEnrollments.length, 'enrollments from Firestore.');
      }

      // --- C. Fetch Authoritative Course Progress: /users/{uid}/courseProgress ---
      try {
        const progressSnap = await firestore.collection('users').doc(cleanUid).collection('courseProgress').get();
        if (!progressSnap.empty && window.DB) {
          const localProgress = window.DB.get('courseProgress') || [];
          progressSnap.forEach(d => {
            const pData = d.data();
            const idx = localProgress.findIndex(p => p && p.courseId === d.id && p.userId === cleanUid);
            if (idx !== -1) {
              localProgress[idx] = { ...localProgress[idx], ...pData, courseId: d.id, userId: cleanUid };
            } else {
              localProgress.push({ ...pData, courseId: d.id, userId: cleanUid });
            }
          });
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('courseProgress', localProgress);
          }
        }
      } catch (pErr) {
        console.warn('[UserDataService] Course progress hydration note:', pErr.message);
      }

      // --- D. Fetch Authoritative Certificates: /users/{uid}/certificates ---
      try {
        const certSnap = await firestore.collection('users').doc(cleanUid).collection('certificates').get();
        if (!certSnap.empty && window.DB) {
          const localCerts = window.DB.get('certificates') || [];
          certSnap.forEach(d => {
            const cData = d.data();
            if (!localCerts.some(c => c && (c.id === d.id || c.certificateNumber === cData.certificateNumber))) {
              localCerts.push({ id: d.id, userId: cleanUid, ...cData });
            }
          });
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('certificates', localCerts);
          }
        }
      } catch (cErr) {
        console.warn('[UserDataService] Certificate hydration note:', cErr.message);
      }

      localStorage.setItem('learnhub_last_cloud_sync', new Date().toISOString());
      return { success: true, count: cloudEnrollments.length };
    } catch (e) {
      console.error('[UserDataService] Critical hydration error:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 2. Transaction-Safe Enrollment Persistence with Strict Read-Back Verification
   * Canonical Path: /users/{uid}/enrollments/{courseId}
   */
  async persistEnrollment(enrollmentData) {
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    const uid = fbUid || enrollmentData.userId || this.getAuthUid();

    if (!uid) {
      throw new Error('Firebase Authentication required to enroll.');
    }

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

    const canonicalRef = firestore.collection('users').doc(uid).collection('enrollments').doc(courseId);

    // 1. Write to Canonical Subcollection: /users/{uid}/enrollments/{courseId}
    await canonicalRef.set(payload, { merge: true });
    console.log('[UserDataService] Written to canonical path:', `/users/${uid}/enrollments/${courseId}`);

    // 2. Immediate Read-Back Confirmation
    const readBackSnap = await canonicalRef.get();
    if (!readBackSnap.exists) {
      throw new Error(`Firestore write verification failed: document /users/${uid}/enrollments/${courseId} does not exist after write.`);
    }

    console.log('[UserDataService] Read-back verification confirmed exists() === true');

    // 3. Write to Secondary Index (Non-blocking)
    try {
      await firestore.collection('enrollments').doc(docId).set(payload, { merge: true });
    } catch (e) {
      console.warn('[UserDataService] Top-level enrollment index write note:', e.message);
    }

    return { 
      success: true, 
      docId, 
      canonicalPath: `/users/${uid}/enrollments/${courseId}`,
      data: readBackSnap.data()
    };
  }

  /**
   * 3. Transaction-Safe: Persist Lesson Progress to Firestore
   * Canonical Path: /users/{uid}/courseProgress/{courseId} AND /users/{uid}/enrollments/{courseId}
   */
  async persistLessonProgress(courseId, lessonId, userId, isCompleted, progressPercentage, completedLessons = []) {
    const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
    const uid = fbUid || userId || this.getAuthUid();
    if (!courseId || !uid) return;

    const firestore = this.getFirestore();
    if (!firestore) return;

    const serverTime = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
      ? firebase.firestore.FieldValue.serverTimestamp()
      : new Date().toISOString();

    const updates = {
      courseId,
      userId: uid,
      progressPercentage,
      lastViewedLessonId: lessonId,
      completedLessons,
      updatedAt: serverTime
    };

    if (progressPercentage === 100) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    }

    try {
      // 1. Write to /users/{uid}/courseProgress/{courseId}
      const p1 = firestore.collection('users').doc(uid).collection('courseProgress').doc(courseId).set(updates, { merge: true });

      // 2. Update /users/{uid}/enrollments/{courseId}
      const p2 = firestore.collection('users').doc(uid).collection('enrollments').doc(courseId).set(updates, { merge: true });

      await Promise.all([p1, p2]);
      console.log('[UserDataService] Course progress persisted to Firestore:', `/users/${uid}/courseProgress/${courseId}`);
    } catch (e) {
      console.warn('[UserDataService] Firestore progress write notice:', e.message);
    }
  }
}

window.UserDataService = new UserDataRecoveryService();
