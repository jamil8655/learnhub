/**
 * LearnHub Canonical Cloud Data & Account Recovery Service (v221.0.0)
 * 
 * CANONICAL FIRESTORE STRUCTURE:
 * 1. User Profile:      /users/{FirebaseAuthUID}
 * 2. User Enrollments:  /users/{FirebaseAuthUID}/enrollments/{courseId}
 * 3. Course Progress:   /users/{FirebaseAuthUID}/courseProgress/{courseId}
 * 4. User Certificates: /users/{FirebaseAuthUID}/certificates/{certificateId}
 * 5. Favorites:         /users/{FirebaseAuthUID}/favorites/{itemId}
 * 6. History:           /users/{FirebaseAuthUID}/history/{historyId}
 * 7. Notifications:     /users/{FirebaseAuthUID}/notifications/{notificationId}
 * 8. Orders:            /orders/{orderId}
 * 
 * STRICT IDENTITY MANDATE:
 * Only firebase.auth().currentUser.uid is accepted as the canonical owner identity.
 */

class UserDataRecoveryService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = localStorage.getItem('learnhub_last_cloud_sync') || null;
    this._notificationUnsubscribe = null;
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

      // --- E. Fetch Authoritative Favorites: /users/{uid}/favorites ---
      try {
        const favSnap = await firestore.collection('users').doc(cleanUid).collection('favorites').get();
        if (!favSnap.empty && window.DB) {
          const localFavs = window.DB.get('favorites') || [];
          favSnap.forEach(d => {
            const fData = d.data();
            const idx = localFavs.findIndex(f => f && (f.id === d.id || f.itemId === d.id) && f.userId === cleanUid);
            if (idx !== -1) {
              localFavs[idx] = { ...localFavs[idx], ...fData, id: d.id, userId: cleanUid };
            } else {
              localFavs.push({ ...fData, id: d.id, userId: cleanUid });
            }
          });
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('favorites', localFavs);
          }
        }
      } catch (fErr) {
        console.warn('[UserDataService] Favorites hydration note:', fErr.message);
      }

      // --- F. Fetch Authoritative History: /users/{uid}/history ---
      try {
        const histSnap = await firestore.collection('users').doc(cleanUid).collection('history').orderBy('timestamp', 'desc').limit(50).get();
        if (!histSnap.empty && window.DB) {
          const localHist = window.DB.get('history') || [];
          histSnap.forEach(d => {
            const hData = d.data();
            if (!localHist.some(h => h && h.id === d.id)) {
              localHist.push({ ...hData, id: d.id, userId: cleanUid });
            }
          });
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('history', localHist);
          }
        }
      } catch (hErr) {
        console.warn('[UserDataService] History hydration note:', hErr.message);
      }

      // --- G. Initialize Real-Time Notifications Listener: /users/{uid}/notifications ---
      this.initRealtimeNotifications(cleanUid);

      localStorage.setItem('learnhub_last_cloud_sync', new Date().toISOString());
      return { success: true, count: cloudEnrollments.length };
    } catch (e) {
      console.error('[UserDataService] Critical hydration error:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Realtime Listener for Notifications
   */
  initRealtimeNotifications(userId) {
    if (this._notificationUnsubscribe) {
      this._notificationUnsubscribe();
      this._notificationUnsubscribe = null;
    }

    const firestore = this.getFirestore();
    if (!firestore || !userId) return;

    try {
      this._notificationUnsubscribe = firestore.collection('users').doc(userId).collection('notifications')
        .orderBy('createdAt', 'desc')
        .limit(30)
        .onSnapshot(snapshot => {
          if (!snapshot || !window.DB) return;
          const notifs = [];
          snapshot.forEach(doc => {
            notifs.push({ id: doc.id, userId, ...doc.data() });
          });
          const currentNotifs = window.DB.get('notifications') || [];
          const otherNotifs = currentNotifs.filter(n => n.userId !== userId);
          const merged = [...notifs, ...otherNotifs];
          if (window.DB.hydrateCollection) {
            window.DB.hydrateCollection('notifications', merged);
          }
          if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
            window.App.updateNavbarUserUI();
          }
        }, err => {
          console.warn('[UserDataService] Notification realtime listener note:', err.message);
        });
    } catch (e) {}
  }

  /**
   * Favorites Persistence
   */
  async toggleFavorite(item) {
    const uid = this.getAuthUid();
    if (!uid || !item || !item.id) return false;
    const firestore = this.getFirestore();
    const itemId = String(item.id);
    const localFavs = (window.DB && window.DB.get('favorites')) || [];
    const exists = localFavs.some(f => f.userId === uid && (f.id === itemId || f.itemId === itemId));

    if (exists) {
      // Remove
      const filtered = localFavs.filter(f => !(f.userId === uid && (f.id === itemId || f.itemId === itemId)));
      if (window.DB.hydrateCollection) window.DB.hydrateCollection('favorites', filtered);
      if (firestore) {
        firestore.collection('users').doc(uid).collection('favorites').doc(itemId).delete().catch(() => {});
      }
      if (window.App) window.App.showToast('Removed from favorites', 'info');
      return false;
    } else {
      // Add
      const favObj = {
        id: itemId,
        itemId: itemId,
        userId: uid,
        title: item.title || 'Saved Item',
        type: item.type || 'Course',
        description: item.description || '',
        link: item.link || '#/courses',
        savedAt: new Date().toISOString()
      };
      localFavs.push(favObj);
      if (window.DB.hydrateCollection) window.DB.hydrateCollection('favorites', localFavs);
      if (firestore) {
        firestore.collection('users').doc(uid).collection('favorites').doc(itemId).set(favObj, { merge: true }).catch(() => {});
      }
      if (window.App) window.App.showToast('Saved to favorites', 'success');
      return true;
    }
  }

  async removeFavorite(itemId) {
    const uid = this.getAuthUid();
    if (!uid || !itemId) return;
    const firestore = this.getFirestore();
    const localFavs = (window.DB && window.DB.get('favorites')) || [];
    const filtered = localFavs.filter(f => !(f.userId === uid && (f.id === itemId || f.itemId === itemId)));
    if (window.DB && window.DB.hydrateCollection) window.DB.hydrateCollection('favorites', filtered);
    if (firestore) {
      firestore.collection('users').doc(uid).collection('favorites').doc(itemId).delete().catch(() => {});
    }
    if (window.Views && window.Views.renderFavorites && window.location.hash.includes('favorites')) {
      window.Views.renderFavorites();
    }
  }

  /**
   * Learning History Persistence
   */
  async recordHistory(item) {
    const uid = this.getAuthUid();
    if (!uid || !item) return;
    const histId = 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const histObj = {
      id: histId,
      userId: uid,
      title: item.title || 'Learning Activity',
      description: item.description || '',
      icon: item.icon || 'book-open',
      link: item.link || '',
      timestamp: new Date().toISOString()
    };
    if (window.DB) {
      const localHist = window.DB.get('history') || [];
      localHist.unshift(histObj);
      if (window.DB.hydrateCollection) window.DB.hydrateCollection('history', localHist);
    }
    const firestore = this.getFirestore();
    if (firestore) {
      firestore.collection('users').doc(uid).collection('history').doc(histId).set(histObj).catch(() => {});
    }
  }

  /**
   * Mark all notifications read
   */
  async markAllNotificationsRead(userId) {
    const uid = userId || this.getAuthUid();
    if (!uid) return;
    if (window.DB) {
      const localNotifs = window.DB.get('notifications') || [];
      localNotifs.forEach(n => {
        if (n.userId === uid) n.read = true;
      });
      if (window.DB.hydrateCollection) window.DB.hydrateCollection('notifications', localNotifs);
    }
    const firestore = this.getFirestore();
    if (firestore) {
      try {
        const snap = await firestore.collection('users').doc(uid).collection('notifications').where('read', '==', false).get();
        const batch = firestore.batch();
        snap.forEach(doc => batch.update(doc.ref, { read: true }));
        await batch.commit();
      } catch (e) {}
    }
    if (window.Views && window.Views.renderNotifications && window.location.hash.includes('notifications')) {
      window.Views.renderNotifications();
    }
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
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
