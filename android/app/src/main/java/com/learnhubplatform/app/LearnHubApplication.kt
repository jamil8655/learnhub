package com.learnhubplatform.app

import android.app.Application
import android.util.Log

/**
 * LearnHub Application class.
 *
 * Architecture: Trusted Web Activity (TWA)
 * Production URL: https://learnhubplatform.com
 *
 * The TWA opens the production website in Chrome — meaning:
 * - Firebase Authentication works via the web (no Android Firebase SDK needed)
 * - Google Sign-In works (not blocked like WebView)
 * - Firestore reads/writes happen through the web app
 * - App Check is handled by the web (reCAPTCHA Enterprise)
 * - All features update automatically when the website updates
 *
 * No private Firebase credentials are stored in this app.
 */
class LearnHubApplication : Application() {

    companion object {
        private const val TAG = "LearnHub"
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "LearnHub v${BuildConfig.VERSION_NAME} started (TWA mode)")
    }
}
