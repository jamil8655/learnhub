# LearnHub ProGuard / R8 Rules
# Applied in release builds (minifyEnabled true)

# ── TWA / Custom Tabs ────────────────────────────────────────────────────────
-keep class androidx.browser.** { *; }
-keep class com.google.androidbrowserhelper.** { *; }
-keep class com.google.androidbrowserhelper.trusted.** { *; }

# ── Application class ────────────────────────────────────────────────────────
-keep class com.learnhubplatform.app.LearnHubApplication { *; }

# ── AndroidX / Material ──────────────────────────────────────────────────────
-keep class androidx.core.splashscreen.** { *; }
-keepclassmembers class * {
    @androidx.lifecycle.OnLifecycleEvent *;
}

# ── Remove debug logging in release ─────────────────────────────────────────
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}

# ── Standard Android ─────────────────────────────────────────────────────────
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
