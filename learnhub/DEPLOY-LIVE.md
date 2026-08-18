# 🌐 LearnHub کو انٹرنیٹ پر لائیو (Live) کرنے کا مکمل طریقہ کار

LearnHub کو انٹرنیٹ پر لائیو ہوسٹ کرنے کے لیے **3 سب سے تیز اور مفت (100% Free)** طریقے درج ذیل ہیں جن سے آپ کی ویب سائٹ پوری دنیا کے لیے 2 منٹ میں آن لائن ہو جائے گی:

---

## طریقہ نمبر 1: Vercel پر 1-Click لائیو ہوسٹنگ (سب سے تیز اور آسان ترین)

1. [Vercel.com](https://vercel.com) پر جائیں اور مفت اکاؤنٹ بنائیں۔
2. **"Add New Project"** پر کلک کریں۔
3. اس فولڈر (`learnhub`) کو ڈریگ اینڈ ڈراپ (Drag & Drop) کریں یا گٹ ہب سے امپورٹ کریں۔
4. **"Deploy"** بٹن پر کلک کریں۔
5. آپ کو فوراً ایک لائیو لنک مل جائے گا:
   👉 **`https://learnhub-yourname.vercel.app`**
*(ہم نے پراجیکٹ میں پہلے سے `vercel.json` فائل بنا دی ہے جو خودکار طور پر تمام پیجز کو لائیو کنفیگر کر دے گی)*

---

## طریقہ نمبر 2: Netlify پر 1-Click لائیو ہوسٹنگ

1. [Netlify.com](https://netlify.com) پر جائیں اور مفت سائن اپ کریں۔
2. **"Sites"** سیکشن میں جائیں اور **"Drag and drop your site output folder"** والے باکس میں اس فولڈر (`learnhub`) کو ڈریگ اینڈ ڈراپ کریں۔
3. 5 سیکنڈ کے اندر آپ کی سائٹ لائیو ہو جائے گی:
   👉 **`https://your-site-name.netlify.app`**
*(ہم نے پراجیکٹ میں `netlify.toml` کنفیگریشن فائل شامل کر دی ہے)*

---

## طریقہ نمبر 3: GitHub Pages کے ذریعے مستقل لائیو ہوسٹنگ

1. [GitHub.com](https://github.com) پر نیا Repository بنائیں (مثلاً `learnhub`).
2. یہ کمانڈز اپنے کمپیوٹر کے ٹرمینل میں چلائیں:
   ```bash
   git init
   git add .
   git commit -m "LearnHub Live Release with Quran, Hadith, Articles & Quizzes"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/learnhub.git
   git push -u origin main
   ```
3. GitHub پر اپنے ریپوزٹری کی **Settings &rarr; Pages** میں جائیں۔
4. Source میں **"GitHub Actions"** منتخب کریں۔
5. ہماری بنی ہوئی ایکشن فائل `.github/workflows/deploy.yml` خودکار طور پر آپ کی سائٹ کو اس لائیو ایڈریس پر ہوسٹ کر دے گی:
   👉 **`https://YOUR-USERNAME.github.io/learnhub`**

---

## 📱 کسٹم ڈومین (Custom Domain):
اگر آپ کے پاس اپنا ڈومین ہے (مثلاً `www.youracademy.com`) تو آپ Vercel یا Netlify کی سیٹنگز میں جا کر **1 کلک** میں اپنا ڈومین بھی منسلک کر سکتے ہیں!
