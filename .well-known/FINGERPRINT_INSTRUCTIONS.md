# SHA256 Fingerprint Instructions

The assetlinks.json file currently contains a PLACEHOLDER fingerprint.
You MUST replace it with your actual keystore SHA256 before the app
can handle deep links from learnhubplatform.com.

## How to get the real fingerprint:

1. Generate your release keystore (see android/SIGNING_GUIDE.md Step 1)
2. Run: keytool -list -v -keystore learnhub-release.keystore -alias learnhub
3. Copy the SHA256 fingerprint (format: XX:XX:XX:... colon-separated hex)
4. Open: .well-known/assetlinks.json
5. Replace: PLACEHOLDER_SHA256_REPLACE_WITH_YOUR_KEYSTORE_FINGERPRINT
   with: your actual SHA256
6. Deploy to GitHub: run sync-to-github.ps1
7. Verify: https://learnhubplatform.com/.well-known/assetlinks.json

## Current status: ⚠️ PLACEHOLDER - App Links will NOT work until updated

## After updating:
- Deep links from learnhubplatform.com will open in the app
- TWA verification will succeed
- Chrome will show the app without the browser URL bar
