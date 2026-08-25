# LearnHub Android — Release Signing & Play Store Guide

## ⚠️ CRITICAL WARNING
> Losing your keystore file = permanent inability to update your app.
> Back up to at minimum 3 locations (Google Drive, USB, cloud storage).

---

## Step 1: Generate Release Keystore (ONE TIME ONLY)

Run in PowerShell or Command Prompt:

```powershell
keytool -genkey -v `
  -keystore learnhub-release.keystore `
  -alias learnhub `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

When prompted, enter:
- First and last name: `LearnHub`
- Organizational unit: `LearnHub`
- Organization: `LearnHub Platform`
- City: `(your city)`
- State: `(your state)`
- Country code: `PK`
- Password: choose a STRONG password (remember it forever!)

---

## Step 2: Get SHA Fingerprints

```powershell
keytool -list -v -keystore learnhub-release.keystore -alias learnhub
```

Copy:
- **SHA1:** (needed for Firebase Console)
- **SHA256:** (needed for assetlinks.json)

---

## Step 3: Register Android App in Firebase Console

1. Go to: https://console.firebase.google.com/project/studio-5305763939-bdcf7/settings/general
2. Click **Add app** → Android icon
3. Fill:
   - Android package name: `com.learnhubplatform.app`
   - App nickname: `LearnHub Android`
   - Debug signing certificate SHA-1: (your SHA1 from Step 2)
4. Click **Register app**
5. Download `google-services.json`
6. Place at: `android/app/google-services.json`
   ⚠️ This file is in .gitignore — never commit it to GitHub

> **Note:** For TWA architecture, google-services.json is technically optional
> since Firebase runs in the web layer. However, if you add Firebase Crashlytics
> or FCM later, it becomes required.

---

## Step 4: Update assetlinks.json with Real SHA256

1. Open: `learnhub/.well-known/assetlinks.json`
2. Replace `PLACEHOLDER_SHA256_REPLACE_WITH_YOUR_KEYSTORE_FINGERPRINT`
   with your SHA256 from Step 2
3. Format: `AB:CD:EF:01:23:...` (colon-separated hex pairs)
4. Deploy: run `sync-to-github.ps1`
5. Verify: visit https://learnhubplatform.com/.well-known/assetlinks.json

---

## Step 5: Add Firebase Authorized Domain

1. Go to: https://console.firebase.google.com/project/studio-5305763939-bdcf7/authentication/settings
2. In **Authorized domains**, confirm `learnhubplatform.com` is listed
3. This allows Google Sign-In redirects from the production domain

---

## Step 6: Configure Signing in build.gradle

Open `android/app/build.gradle` and fill in the signingConfig section:

```groovy
android {
    signingConfigs {
        release {
            storeFile file('path/to/learnhub-release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'learnhub'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

⚠️ **NEVER commit real passwords to GitHub!**
Use `local.properties` or environment variables instead.

---

## Step 7: Build Release AAB

Open PowerShell and run:

```powershell
cd C:\Users\jrahm\.gemini\antigravity\scratch\learnhub\android

# Windows:
.\gradlew.bat bundleRelease

# Or (if gradlew.bat not available):
gradle bundleRelease
```

AAB location after build:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Step 8: Upload to Google Play Console

1. Go to: https://play.google.com/console
2. **Create app** (if first time) → Android → LearnHub
3. Fill: app name, default language, app type (App), free
4. Go to **Release** → **Testing** → **Internal testing**
5. Click **Create new release**
6. Upload `app-release.aab`
7. Add release notes (in Urdu + English)
8. **Save** and **Review release** → **Start rollout to Internal testing**

---

## Step 9: Complete Play Console Requirements

Before production release:
- [ ] Store listing: app name, descriptions, screenshots, icon
- [ ] Content rating: complete questionnaire
- [ ] Data safety: fill all fields
- [ ] Privacy policy: https://learnhubplatform.com/privacy-policy
- [ ] App content declarations
- [ ] App access (provide test account for reviewers)

---

## Step 10: Digital Asset Links Verification

Test that App Links work after deployment:

```powershell
# Test assetlinks.json is accessible
Invoke-WebRequest "https://learnhubplatform.com/.well-known/assetlinks.json" | Select-Object -Expand Content
```

Expected: JSON with your SHA256 fingerprint and package name `com.learnhubplatform.app`

---

## Version Update Process (Future Releases)

For every update:
1. Increment `versionCode` in app/build.gradle (1 → 2 → 3...)
2. Update `versionName` (1.0.0 → 1.0.1 → 1.1.0)
3. Build new AAB: `.\gradlew.bat bundleRelease`
4. Upload to Play Console → create new release
5. Add release notes

---

## Play Console Personal Account Requirement

If your Play Console account was created **after November 13, 2023**:
- You must run a **Closed testing track** first
- Minimum **12 testers** must opt in
- They must remain opted in for **14 consecutive days**
- Then apply for production access via the Play Console

This requirement takes **2-4 weeks** minimum.
Plan accordingly before expecting to go live.
