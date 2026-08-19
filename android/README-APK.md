# LearnHub Android App & APK Package 📱
**LearnHub — مستند اسلامی اکیڈمی و امتحانات**

یہ فولڈر LearnHub کا مکمل اور آفیشل **Android Studio / Gradle پروجیکٹ** ہے جس سے آپ ڈائریکٹ **APK** یا گوگل پلے اسٹور کے لیے **AAB (Android App Bundle)** جنریٹ کر سکتے ہیں۔

---

## 📁 پروجیکٹ اسٹرکچر (Project Structure)
```
android/
├── app/
│   ├── build.gradle                              # ایپ ماڈیول سیٹنگز، Target SDK 34، پیکیج ID
│   └── src/main/
│       ├── AndroidManifest.xml                   # اجازتیں (Camera, Storage, Internet) اور Deep Links
│       ├── java/com/learnhub/academy/
│       │   └── MainActivity.java                 # ویب ویو رن ٹائم، گیلری و کیمرہ اپلوڈ، ریفریش
│       └── res/
│           ├── layout/activity_main.xml          # ڈیزائن لے آؤٹ اور پروگریس بار
│           ├── values/                           # strings.xml, colors.xml, styles.xml
│           └── xml/file_paths.xml                # محفوظ فائل پرووائیڈر برائے تصویر اپلوڈ
├── build.gradle                                  # روٹ گریڈل کنفیگریشن
├── gradle.properties                             # اینڈرائیڈ ایکس و جی وی ایم آپٹمائزیشن
├── settings.gradle                               # پروجیکٹ کا نام اور ریپوزٹریز
└── README-APK.md                                 # یہ مکمل رہنمائی فائل
```

---

## 🚀 APK جنریٹ کرنے کے آسان طریقے:

### طریقہ 1: Android Studio میں کھولیں اور Build کریں (سب سے مستند)
1. **Android Studio** کھولیں اور `Open an Existing Project` منتخب کریں۔
2. اس `android` فولڈر کا انتخاب کریں۔
3. گریڈل سنک (Gradle Sync) مکمل ہونے دیں۔
4. اوپر مینو بار سے کلک کریں:
   👉 **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**
5. چند سیکنڈز میں `app-debug.apk` یا `app-release.apk` تیار ہو جائے گی جسے آپ کسی بھی موبائل پر انسٹال کر سکتے ہیں!

---

### طریقہ 2: 1-کلک آن لائن کلاؤڈ بلڈر سے فوری Signed APK حاصل کریں
اگر آپ کے پاس کمپیوٹر میں Android Studio انسٹال نہیں ہے، تو آپ مائیکروسافٹ کے آفیشل کلاؤڈ ٹول **PWABuilder** سے 1 منٹ میں تیار شدہ APK اور پلے اسٹور بنڈل ڈاؤن لوڈ کر سکتے ہیں:

1. وزٹ کریں: 👉 **[https://www.pwabuilder.com/](https://www.pwabuilder.com/)**
2. اپنی لائیو ویب سائٹ کا URL درج کریں:
   `https://jamil8655.github.io/learnhub/`
3. **Start** پر کلک کریں۔ (LearnHub کا اسکور 100/100 پرفیکٹ گرین آئے گا کیونکہ `manifest.json`, `sw.js` اور `assetlinks.json` مکمل تیار ہیں)۔
4. **Package for Stores** -> **Android** منتخب کریں۔
5. **Download Package** پر کلک کریں!
6. آپ کو فوراً سائنڈ **`learnhub.apk`** اور **`learnhub.aab`** (گوگل پلے اسٹور کے لیے) مل جائے گی۔

---

## 📲 موبائل پر ڈائریکٹ انسٹالیشن (PWA 1-Click Install)
موبائل صارفین بغیر کسی فائل ڈاؤن لوڈ کے بھی ایپ کے طور پر چلا سکتے ہیں:
1. اپنے موبائل کروم میں **[https://jamil8655.github.io/learnhub/](https://jamil8655.github.io/learnhub/)** کھولیں۔
2. اوپر مینو میں **"انسٹال کریں ایپ (Play Store / App)"** پر کلک کریں۔
3. ایپ خود بخود آپ کے موبائل کی ہوم اسکرین پر اصلی اینڈرائیڈ ایپ کے طور پر شامل ہو جائے گی!
