# LearnHub Enterprise ProGuard & R8 Security Rules (v166.0.0)
-repackageclasses 'com.learnhubplatform.app.sec'
-allowaccessmodification

# Strip ALL Android Log & Debug Output completely in release
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
    public static int e(...);
    public static int println(...);
}

-assumenosideeffects class java.io.PrintStream {
    public void println(...);
    public void print(...);
}

-assumenosideeffects class java.lang.Throwable {
    public void printStackTrace();
}

# Keep TWA classes
-keep class androidx.browser.** { *; }
-keep class com.google.androidbrowserhelper.** { *; }
-keep class com.google.androidbrowserhelper.trusted.** { *; }
-keep class com.learnhubplatform.app.LearnHubApplication { *; }
-keep class androidx.core.splashscreen.** { *; }
-keepclassmembers class * {
    @androidx.lifecycle.OnLifecycleEvent *;
}

-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
