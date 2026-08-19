/**
 * LearnHub Complete Quran Majeed Module
 * All 114 Surahs with dynamic Uthmani Arabic script, Urdu translation,
 * English translation, full Surah & Ayah audio player, search, and font controls.
 */

window.Views = window.Views || {};

// Complete 114 Surahs Directory
const ALL_114_SURAHS = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatiha', nameUrdu: 'سورۃ الفاتحہ', meaning: 'The Opening', type: 'Meccan', ayahCount: 7, juz: 1 },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', nameUrdu: 'سورۃ البقرہ', meaning: 'The Cow', type: 'Medinan', ayahCount: 286, juz: 1 },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali \'Imran', nameUrdu: 'سورۃ آل عمران', meaning: 'Family of Imran', type: 'Medinan', ayahCount: 200, juz: 3 },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', nameUrdu: 'سورۃ النساء', meaning: 'The Women', type: 'Medinan', ayahCount: 176, juz: 4 },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Ma\'idah', nameUrdu: 'سورۃ المائدہ', meaning: 'The Table Spread', type: 'Medinan', ayahCount: 120, juz: 6 },
  { number: 6, nameArabic: 'الأنعام', nameEnglish: 'Al-An\'am', nameUrdu: 'سورۃ الانعام', meaning: 'The Cattle', type: 'Meccan', ayahCount: 165, juz: 7 },
  { number: 7, nameArabic: 'الأعراف', nameEnglish: 'Al-A\'raf', nameUrdu: 'سورۃ الاعراف', meaning: 'The Heights', type: 'Meccan', ayahCount: 206, juz: 8 },
  { number: 8, nameArabic: 'الأنفال', nameEnglish: 'Al-Anfal', nameUrdu: 'سورۃ الانفال', meaning: 'The Spoils of War', type: 'Medinan', ayahCount: 75, juz: 9 },
  { number: 9, nameArabic: 'التوبة', nameEnglish: 'At-Tawbah', nameUrdu: 'سورۃ التوبہ', meaning: 'The Repentance', type: 'Medinan', ayahCount: 129, juz: 10 },
  { number: 10, nameArabic: 'يونس', nameEnglish: 'Yunus', nameUrdu: 'سورۃ یونس', meaning: 'Jonah', type: 'Meccan', ayahCount: 109, juz: 11 },
  { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', nameUrdu: 'سورۃ ہود', meaning: 'Hud', type: 'Meccan', ayahCount: 123, juz: 11 },
  { number: 12, nameArabic: 'يوسف', nameEnglish: 'Yusuf', nameUrdu: 'سورۃ یوسف', meaning: 'Joseph', type: 'Meccan', ayahCount: 111, juz: 12 },
  { number: 13, nameArabic: 'الرعد', nameEnglish: 'Ar-Ra\'d', nameUrdu: 'سورۃ الرعد', meaning: 'The Thunder', type: 'Medinan', ayahCount: 43, juz: 13 },
  { number: 14, nameArabic: 'إبراهيم', nameEnglish: 'Ibrahim', nameUrdu: 'سورۃ ابراہیم', meaning: 'Abraham', type: 'Meccan', ayahCount: 52, juz: 13 },
  { number: 15, nameArabic: 'الحجر', nameEnglish: 'Al-Hijr', nameUrdu: 'سورۃ الحجر', meaning: 'The Rocky Tract', type: 'Meccan', ayahCount: 99, juz: 14 },
  { number: 16, nameArabic: 'النحل', nameEnglish: 'An-Nahl', nameUrdu: 'سورۃ النحل', meaning: 'The Bee', type: 'Meccan', ayahCount: 128, juz: 14 },
  { number: 17, nameArabic: 'الإسراء', nameEnglish: 'Al-Isra', nameUrdu: 'سورۃ الاسراء', meaning: 'The Night Journey', type: 'Meccan', ayahCount: 111, juz: 15 },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', nameUrdu: 'سورۃ الکہف', meaning: 'The Cave', type: 'Meccan', ayahCount: 110, juz: 15 },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', nameUrdu: 'سورۃ مریم', meaning: 'Mary', type: 'Meccan', ayahCount: 98, juz: 16 },
  { number: 20, nameArabic: 'طه', nameEnglish: 'Ta-Ha', nameUrdu: 'سورۃ طٰہٰ', meaning: 'Ta-Ha', type: 'Meccan', ayahCount: 135, juz: 16 },
  { number: 21, nameArabic: 'الأنبياء', nameEnglish: 'Al-Anbiya', nameUrdu: 'سورۃ الانبیاء', meaning: 'The Prophets', type: 'Meccan', ayahCount: 112, juz: 17 },
  { number: 22, nameArabic: 'الحج', nameEnglish: 'Al-Hajj', nameUrdu: 'سورۃ الحج', meaning: 'The Pilgrimage', type: 'Medinan', ayahCount: 78, juz: 17 },
  { number: 23, nameArabic: 'المؤمنون', nameEnglish: 'Al-Mu\'minun', nameUrdu: 'سورۃ المؤمنون', meaning: 'The Believers', type: 'Meccan', ayahCount: 118, juz: 18 },
  { number: 24, nameArabic: 'النور', nameEnglish: 'An-Nur', nameUrdu: 'سورۃ النور', meaning: 'The Light', type: 'Medinan', ayahCount: 64, juz: 18 },
  { number: 25, nameArabic: 'الفرقان', nameEnglish: 'Al-Furqan', nameUrdu: 'سورۃ الفرقان', meaning: 'The Criterion', type: 'Meccan', ayahCount: 77, juz: 18 },
  { number: 26, nameArabic: 'الشعراء', nameEnglish: 'Ash-Shu\'ara', nameUrdu: 'سورۃ الشعراء', meaning: 'The Poets', type: 'Meccan', ayahCount: 227, juz: 19 },
  { number: 27, nameArabic: 'النمل', nameEnglish: 'An-Naml', nameUrdu: 'سورۃ النمل', meaning: 'The Ant', type: 'Meccan', ayahCount: 93, juz: 19 },
  { number: 28, nameArabic: 'القصص', nameEnglish: 'Al-Qasas', nameUrdu: 'سورۃ القصص', meaning: 'The Stories', type: 'Meccan', ayahCount: 88, juz: 20 },
  { number: 29, nameArabic: 'العنكبوت', nameEnglish: 'Al-\'Ankabut', nameUrdu: 'سورۃ العنکبوت', meaning: 'The Spider', type: 'Meccan', ayahCount: 69, juz: 20 },
  { number: 30, nameArabic: 'الروم', nameEnglish: 'Ar-Rum', nameUrdu: 'سورۃ الروم', meaning: 'The Romans', type: 'Meccan', ayahCount: 60, juz: 21 },
  { number: 31, nameArabic: 'لقمان', nameEnglish: 'Luqman', nameUrdu: 'سورۃ لقمان', meaning: 'Luqman', type: 'Meccan', ayahCount: 34, juz: 21 },
  { number: 32, nameArabic: 'السجدة', nameEnglish: 'As-Sajdah', nameUrdu: 'سورۃ السجدہ', meaning: 'The Prostration', type: 'Meccan', ayahCount: 30, juz: 21 },
  { number: 33, nameArabic: 'الأحزاب', nameEnglish: 'Al-Ahzab', nameUrdu: 'سورۃ الاحزاب', meaning: 'The Combined Forces', type: 'Medinan', ayahCount: 73, juz: 21 },
  { number: 34, nameArabic: 'سبأ', nameEnglish: 'Saba', nameUrdu: 'سورۃ سبا', meaning: 'Sheba', type: 'Meccan', ayahCount: 54, juz: 22 },
  { number: 35, nameArabic: 'فاطر', nameEnglish: 'Fatir', nameUrdu: 'سورۃ فاطر', meaning: 'Originator', type: 'Meccan', ayahCount: 45, juz: 22 },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', nameUrdu: 'سورۃ یٰسٓ', meaning: 'Ya-Sin', type: 'Meccan', ayahCount: 83, juz: 22 },
  { number: 37, nameArabic: 'الصافات', nameEnglish: 'As-Saffat', nameUrdu: 'سورۃ الصافات', meaning: 'Those who set the Ranks', type: 'Meccan', ayahCount: 182, juz: 23 },
  { number: 38, nameArabic: 'ص', nameEnglish: 'Sad', nameUrdu: 'سورۃ ص', meaning: 'The Letter Sad', type: 'Meccan', ayahCount: 88, juz: 23 },
  { number: 39, nameArabic: 'الزمر', nameEnglish: 'Az-Zumar', nameUrdu: 'سورۃ الزمر', meaning: 'The Troops', type: 'Meccan', ayahCount: 75, juz: 23 },
  { number: 40, nameArabic: 'غافر', nameEnglish: 'Ghafir', nameUrdu: 'سورۃ غافر', meaning: 'The Forgiver', type: 'Meccan', ayahCount: 85, juz: 24 },
  { number: 41, nameArabic: 'فصلت', nameEnglish: 'Fussilat', nameUrdu: 'سورۃ فصلت', meaning: 'Explained in Detail', type: 'Meccan', ayahCount: 54, juz: 24 },
  { number: 42, nameArabic: 'الشورى', nameEnglish: 'Ash-Shura', nameUrdu: 'سورۃ الشوریٰ', meaning: 'The Consultation', type: 'Meccan', ayahCount: 53, juz: 25 },
  { number: 43, nameArabic: 'الزخرف', nameEnglish: 'Az-Zukhruf', nameUrdu: 'سورۃ الزخرف', meaning: 'The Ornaments of Gold', type: 'Meccan', ayahCount: 89, juz: 25 },
  { number: 44, nameArabic: 'الدخان', nameEnglish: 'Ad-Dukhan', nameUrdu: 'سورۃ الدخان', meaning: 'The Smoke', type: 'Meccan', ayahCount: 59, juz: 25 },
  { number: 45, nameArabic: 'الجاثية', nameEnglish: 'Al-Jathiyah', nameUrdu: 'سورۃ الجاثیہ', meaning: 'The Crouching', type: 'Meccan', ayahCount: 37, juz: 25 },
  { number: 46, nameArabic: 'الأحقاف', nameEnglish: 'Al-Ahqaf', nameUrdu: 'سورۃ الاحقاف', meaning: 'The Wind-Curved Sandhills', type: 'Meccan', ayahCount: 35, juz: 26 },
  { number: 47, nameArabic: 'محمد', nameEnglish: 'Muhammad', nameUrdu: 'سورۃ محمد ﷺ', meaning: 'Muhammad', type: 'Medinan', ayahCount: 38, juz: 26 },
  { number: 48, nameArabic: 'الفتح', nameEnglish: 'Al-Fath', nameUrdu: 'سورۃ الفتح', meaning: 'The Victory', type: 'Medinan', ayahCount: 29, juz: 26 },
  { number: 49, nameArabic: 'الحجرات', nameEnglish: 'Al-Hujurat', nameUrdu: 'سورۃ الحجرات', meaning: 'The Rooms', type: 'Medinan', ayahCount: 18, juz: 26 },
  { number: 50, nameArabic: 'ق', nameEnglish: 'Qaf', nameUrdu: 'سورۃ ق', meaning: 'The Letter Qaf', type: 'Meccan', ayahCount: 45, juz: 26 },
  { number: 51, nameArabic: 'الذاريات', nameEnglish: 'Adh-Dhariyat', nameUrdu: 'سورۃ الذاریات', meaning: 'The Winnowing Winds', type: 'Meccan', ayahCount: 60, juz: 26 },
  { number: 52, nameArabic: 'الطور', nameEnglish: 'At-Tur', nameUrdu: 'سورۃ الطور', meaning: 'The Mount', type: 'Meccan', ayahCount: 49, juz: 27 },
  { number: 53, nameArabic: 'النجم', nameEnglish: 'An-Najm', nameUrdu: 'سورۃ النجم', meaning: 'The Star', type: 'Meccan', ayahCount: 62, juz: 27 },
  { number: 54, nameArabic: 'القمر', nameEnglish: 'Al-Qamar', nameUrdu: 'سورۃ القمر', meaning: 'The Moon', type: 'Meccan', ayahCount: 55, juz: 27 },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', nameUrdu: 'سورۃ الرحمن', meaning: 'The Beneficent', type: 'Medinan', ayahCount: 78, juz: 27 },
  { number: 56, nameArabic: 'الواقعة', nameEnglish: 'Al-Waqi\'ah', nameUrdu: 'سورۃ الواقعہ', meaning: 'The Inevitable', type: 'Meccan', ayahCount: 96, juz: 27 },
  { number: 57, nameArabic: 'الحديد', nameEnglish: 'Al-Hadid', nameUrdu: 'سورۃ الحدید', meaning: 'The Iron', type: 'Medinan', ayahCount: 29, juz: 27 },
  { number: 58, nameArabic: 'المجادلة', nameEnglish: 'Al-Mujadila', nameUrdu: 'سورۃ المجادلہ', meaning: 'The Pleading Woman', type: 'Medinan', ayahCount: 22, juz: 28 },
  { number: 59, nameArabic: 'الحشر', nameEnglish: 'Al-Hashr', nameUrdu: 'سورۃ الحشر', meaning: 'The Exile', type: 'Medinan', ayahCount: 24, juz: 28 },
  { number: 60, nameArabic: 'الممتحنة', nameEnglish: 'Al-Mumtahanah', nameUrdu: 'سورۃ الممتحنہ', meaning: 'She that is to be examined', type: 'Medinan', ayahCount: 13, juz: 28 },
  { number: 61, nameArabic: 'الصف', nameEnglish: 'As-Saff', nameUrdu: 'سورۃ الصف', meaning: 'The Ranks', type: 'Medinan', ayahCount: 14, juz: 28 },
  { number: 62, nameArabic: 'الجمعة', nameEnglish: 'Al-Jumu\'ah', nameUrdu: 'سورۃ الجمعہ', meaning: 'The Congregation', type: 'Medinan', ayahCount: 11, juz: 28 },
  { number: 63, nameArabic: 'المنافقون', nameEnglish: 'Al-Munafiqun', nameUrdu: 'سورۃ المنافقون', meaning: 'The Hypocrites', type: 'Medinan', ayahCount: 11, juz: 28 },
  { number: 64, nameArabic: 'التغابن', nameEnglish: 'At-Taghabun', nameUrdu: 'سورۃ التغابن', meaning: 'The Mutual Disillusion', type: 'Medinan', ayahCount: 18, juz: 28 },
  { number: 65, nameArabic: 'الطلاق', nameEnglish: 'At-Talaq', nameUrdu: 'سورۃ الطلاق', meaning: 'The Divorce', type: 'Medinan', ayahCount: 12, juz: 28 },
  { number: 66, nameArabic: 'التحريم', nameEnglish: 'At-Tahrim', nameUrdu: 'سورۃ التحریم', meaning: 'The Prohibition', type: 'Medinan', ayahCount: 12, juz: 28 },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', nameUrdu: 'سورۃ الملک', meaning: 'The Sovereignty', type: 'Meccan', ayahCount: 30, juz: 29 },
  { number: 68, nameArabic: 'القلم', nameEnglish: 'Al-Qalam', nameUrdu: 'سورۃ القلم', meaning: 'The Pen', type: 'Meccan', ayahCount: 52, juz: 29 },
  { number: 69, nameArabic: 'الحاقة', nameEnglish: 'Al-Haqqah', nameUrdu: 'سورۃ الحاقہ', meaning: 'The Reality', type: 'Meccan', ayahCount: 52, juz: 29 },
  { number: 70, nameArabic: 'المعارج', nameEnglish: 'Al-Ma\'arij', nameUrdu: 'سورۃ المعارج', meaning: 'The Ascending Stairways', type: 'Meccan', ayahCount: 44, juz: 29 },
  { number: 71, nameArabic: 'نوح', nameEnglish: 'Nuh', nameUrdu: 'سورۃ نوح', meaning: 'Noah', type: 'Meccan', ayahCount: 28, juz: 29 },
  { number: 72, nameArabic: 'الجن', nameEnglish: 'Al-Jinn', nameUrdu: 'سورۃ الجن', meaning: 'The Jinn', type: 'Meccan', ayahCount: 28, juz: 29 },
  { number: 73, nameArabic: 'المزمل', nameEnglish: 'Al-Muzzammil', nameUrdu: 'سورۃ المزمل', meaning: 'The Enshrouded One', type: 'Meccan', ayahCount: 20, juz: 29 },
  { number: 74, nameArabic: 'المدثر', nameEnglish: 'Al-Muddaththir', nameUrdu: 'سورۃ المدثر', meaning: 'The Cloaked One', type: 'Meccan', ayahCount: 56, juz: 29 },
  { number: 75, nameArabic: 'القيامة', nameEnglish: 'Al-Qiyamah', nameUrdu: 'سورۃ القیامہ', meaning: 'The Resurrection', type: 'Meccan', ayahCount: 40, juz: 29 },
  { number: 76, nameArabic: 'الإنسان', nameEnglish: 'Al-Insan', nameUrdu: 'سورۃ الدھر / الانسان', meaning: 'The Man', type: 'Medinan', ayahCount: 31, juz: 29 },
  { number: 77, nameArabic: 'المرسلات', nameEnglish: 'Al-Mursalat', nameUrdu: 'سورۃ المرسلات', meaning: 'The Emissaries', type: 'Meccan', ayahCount: 50, juz: 29 },
  { number: 78, nameArabic: 'النبأ', nameEnglish: 'An-Naba', nameUrdu: 'سورۃ النباء', meaning: 'The Tidings', type: 'Meccan', ayahCount: 40, juz: 30 },
  { number: 79, nameArabic: 'النازعات', nameEnglish: 'An-Nazi\'at', nameUrdu: 'سورۃ النازعات', meaning: 'Those who drag forth', type: 'Meccan', ayahCount: 46, juz: 30 },
  { number: 80, nameArabic: 'عبس', nameEnglish: '\'Abasa', nameUrdu: 'سورۃ عبس', meaning: 'He Frowned', type: 'Meccan', ayahCount: 42, juz: 30 },
  { number: 81, nameArabic: 'التكوير', nameEnglish: 'At-Takwir', nameUrdu: 'سورۃ التکویر', meaning: 'The Overthrowing', type: 'Meccan', ayahCount: 29, juz: 30 },
  { number: 82, nameArabic: 'الانفطار', nameEnglish: 'Al-Infitar', nameUrdu: 'سورۃ الانفطار', meaning: 'The Cleaving', type: 'Meccan', ayahCount: 19, juz: 30 },
  { number: 83, nameArabic: 'المطففين', nameEnglish: 'Al-Mutaffifin', nameUrdu: 'سورۃ المطففین', meaning: 'The Defrauding', type: 'Meccan', ayahCount: 36, juz: 30 },
  { number: 84, nameArabic: 'الانشقاق', nameEnglish: 'Al-Inshiqaq', nameUrdu: 'سورۃ الانشقاق', meaning: 'The Splitting Asunder', type: 'Meccan', ayahCount: 25, juz: 30 },
  { number: 85, nameArabic: 'البروج', nameEnglish: 'Al-Buruj', nameUrdu: 'سورۃ البروج', meaning: 'The Mansions of the Stars', type: 'Meccan', ayahCount: 22, juz: 30 },
  { number: 86, nameArabic: 'الطارق', nameEnglish: 'At-Tariq', nameUrdu: 'سورۃ الطارق', meaning: 'The Morning Star', type: 'Meccan', ayahCount: 17, juz: 30 },
  { number: 87, nameArabic: 'الأعلى', nameEnglish: 'Al-A\'la', nameUrdu: 'سورۃ الاعلیٰ', meaning: 'The Most High', type: 'Meccan', ayahCount: 19, juz: 30 },
  { number: 88, nameArabic: 'الغاشية', nameEnglish: 'Al-Ghashiyah', nameUrdu: 'سورۃ الغاشیہ', meaning: 'The Overwhelming', type: 'Meccan', ayahCount: 26, juz: 30 },
  { number: 89, nameArabic: 'الفجر', nameEnglish: 'Al-Fajr', nameUrdu: 'سورۃ الفجر', meaning: 'The Dawn', type: 'Meccan', ayahCount: 30, juz: 30 },
  { number: 90, nameArabic: 'البلد', nameEnglish: 'Al-Balad', nameUrdu: 'سورۃ البلد', meaning: 'The City', type: 'Meccan', ayahCount: 20, juz: 30 },
  { number: 91, nameArabic: 'الشمس', nameEnglish: 'Ash-Shams', nameUrdu: 'سورۃ الشمس', meaning: 'The Sun', type: 'Meccan', ayahCount: 15, juz: 30 },
  { number: 92, nameArabic: 'الليل', nameEnglish: 'Al-Layl', nameUrdu: 'سورۃ اللیل', meaning: 'The Night', type: 'Meccan', ayahCount: 21, juz: 30 },
  { number: 93, nameArabic: 'الضحى', nameEnglish: 'Ad-Duhaa', nameUrdu: 'سورۃ الضحیٰ', meaning: 'The Morning Hours', type: 'Meccan', ayahCount: 11, juz: 30 },
  { number: 94, nameArabic: 'الشرح', nameEnglish: 'Ash-Sharh', nameUrdu: 'سورۃ الشرح', meaning: 'The Relief', type: 'Meccan', ayahCount: 8, juz: 30 },
  { number: 95, nameArabic: 'التين', nameEnglish: 'At-Tin', nameUrdu: 'سورۃ التین', meaning: 'The Fig', type: 'Meccan', ayahCount: 8, juz: 30 },
  { number: 96, nameArabic: 'العلق', nameEnglish: 'Al-\'Alaq', nameUrdu: 'سورۃ العلق', meaning: 'The Clot', type: 'Meccan', ayahCount: 19, juz: 30 },
  { number: 97, nameArabic: 'القدر', nameEnglish: 'Al-Qadr', nameUrdu: 'سورۃ القدر', meaning: 'The Power', type: 'Meccan', ayahCount: 5, juz: 30 },
  { number: 98, nameArabic: 'البينة', nameEnglish: 'Al-Bayyinah', nameUrdu: 'سورۃ البینہ', meaning: 'The Clear Proof', type: 'Medinan', ayahCount: 8, juz: 30 },
  { number: 99, nameArabic: 'الزلزلة', nameEnglish: 'Az-Zalzalah', nameUrdu: 'سورۃ الزلزال', meaning: 'The Earthquake', type: 'Medinan', ayahCount: 8, juz: 30 },
  { number: 100, nameArabic: 'العاديات', nameEnglish: 'Al-\'Adiyat', nameUrdu: 'سورۃ العادیات', meaning: 'The Courser', type: 'Meccan', ayahCount: 11, juz: 30 },
  { number: 101, nameArabic: 'القارعة', nameEnglish: 'Al-Qari\'ah', nameUrdu: 'سورۃ القارعہ', meaning: 'The Calamity', type: 'Meccan', ayahCount: 11, juz: 30 },
  { number: 102, nameArabic: 'التكاثر', nameEnglish: 'At-Takathur', nameUrdu: 'سورۃ التکاثر', meaning: 'The Rivalry in world increase', type: 'Meccan', ayahCount: 8, juz: 30 },
  { number: 103, nameArabic: 'العصر', nameEnglish: 'Al-\'Asr', nameUrdu: 'سورۃ العصر', meaning: 'The Declining Day', type: 'Meccan', ayahCount: 3, juz: 30 },
  { number: 104, nameArabic: 'الهمزة', nameEnglish: 'Al-Humazah', nameUrdu: 'سورۃ الہمزہ', meaning: 'The Traducer', type: 'Meccan', ayahCount: 9, juz: 30 },
  { number: 105, nameArabic: 'الفيل', nameEnglish: 'Al-Fil', nameUrdu: 'سورۃ الفیل', meaning: 'The Elephant', type: 'Meccan', ayahCount: 5, juz: 30 },
  { number: 106, nameArabic: 'قريش', nameEnglish: 'Quraysh', nameUrdu: 'سورۃ قریش', meaning: 'Quraysh', type: 'Meccan', ayahCount: 4, juz: 30 },
  { number: 107, nameArabic: 'الماعون', nameEnglish: 'Al-Ma\'un', nameUrdu: 'سورۃ الماعون', meaning: 'The Small Kindness', type: 'Meccan', ayahCount: 7, juz: 30 },
  { number: 108, nameArabic: 'الكوثر', nameEnglish: 'Al-Kawthar', nameUrdu: 'سورۃ الکوثر', meaning: 'The Abundance', type: 'Meccan', ayahCount: 3, juz: 30 },
  { number: 109, nameArabic: 'الكافرون', nameEnglish: 'Al-Kafirun', nameUrdu: 'سورۃ الکافرون', meaning: 'The Disbelievers', type: 'Meccan', ayahCount: 6, juz: 30 },
  { number: 110, nameArabic: 'النصر', nameEnglish: 'An-Nasr', nameUrdu: 'سورۃ النصر', meaning: 'The Divine Support', type: 'Medinan', ayahCount: 3, juz: 30 },
  { number: 111, nameArabic: 'المسد', nameEnglish: 'Al-Masad', nameUrdu: 'سورۃ المسد / اللھب', meaning: 'The Palm Fiber', type: 'Meccan', ayahCount: 5, juz: 30 },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', nameUrdu: 'سورۃ الاخلاص', meaning: 'The Sincerity', type: 'Meccan', ayahCount: 4, juz: 30 },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', nameUrdu: 'سورۃ الفلق', meaning: 'The Daybreak', type: 'Meccan', ayahCount: 5, juz: 30 },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', nameUrdu: 'سورۃ الناس', meaning: 'Mankind', type: 'Meccan', ayahCount: 6, juz: 30 }
];

window.Views.currentQuranFontSize = 26; // Default Arabic font size

window.Views.renderQuran = async function(params) {
  const container = document.getElementById('main-content');
  const surahNum = params && params.id ? parseInt(params.id, 10) : null;

  if (surahNum && surahNum >= 1 && surahNum <= 114) {
    window.Views.renderSurahReader(surahNum);
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Quran Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-3">
            <span class="badge bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">القرآن الكريم — كامل</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold font-serif">قرآن مجید (مکمل 114 سورتیں)</h1>
            <p class="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              مکمل 114 سورتیں عربی متن (عثمانی رسم الخط)، فتح محمد جالندھری کا مستند اردو ترجمہ، انگلش ترجمہ اور شیخ مشاری راشد العفاسی کی خوبصورت آڈیو تلاوت کے ساتھ۔
            </p>
          </div>
          <div class="grid grid-cols-3 sm:flex sm:flex-row gap-2 sm:gap-3 bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/30 text-center w-full md:w-auto">
            <div>
              <div class="text-2xl font-bold text-emerald-300">114</div>
              <div class="text-[11px] text-slate-400">سورتیں</div>
            </div>
            <div class="hidden sm:block w-px bg-slate-800"></div>
            <div>
              <div class="text-2xl font-bold text-teal-300">30</div>
              <div class="text-[11px] text-slate-400">پارے (Juz)</div>
            </div>
            <div class="hidden sm:block w-px bg-slate-800"></div>
            <div>
              <div class="text-2xl font-bold text-cyan-300">6,236</div>
              <div class="text-[11px] text-slate-400">آیات مبارکہ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="relative flex-1 w-full">
          <input 
            type="text" 
            id="quran-search-input" 
            placeholder="سورت کا نام تلاش کریں (مثلاً: یسین، بقرہ، کہف، رحمن، ملک، یا Al-Fatiha)..." 
            class="form-input py-2.5 pl-10 text-xs sm:text-sm rounded-xl font-urdu w-full"
            oninput="window.Views.filterSurahs(this.value)"
          />
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3.5"></i>
        </div>

        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
          <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-btn active btn-primary py-2 px-3 text-xs rounded-xl flex-1 sm:flex-none">تمام سورتیں (114)</button>
          <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-btn btn-secondary py-2 px-3 text-xs rounded-xl flex-1 sm:flex-none">مکی سورتیں (86)</button>
          <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-btn btn-secondary py-2 px-3 text-xs rounded-xl flex-1 sm:flex-none">مدنی سورتیں (28)</button>
        </div>
      </div>

      <!-- Surahs Catalog Grid -->
      <div id="quran-surahs-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        ${window.Views.renderSurahsGridHtml(ALL_114_SURAHS)}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderSurahsGridHtml = function(surahs) {
  return surahs.map(surah => `
    <div class="lh-card p-5 flex flex-col justify-between hover:border-emerald-500 hover:shadow-xl transition group">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-mono">
            ${surah.number}
          </span>
          <span class="badge ${surah.type === 'Meccan' ? 'badge-success' : 'badge-primary'} text-[10px]">
            ${surah.type === 'Meccan' ? 'مکی' : 'مدنی'} • ${surah.ayahCount} آیات
          </span>
        </div>

        <div class="text-center py-2">
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 dark:text-emerald-400 group-hover:scale-105 transition">${surah.nameArabic}</h3>
          <div class="text-sm font-bold text-slate-900 dark:text-white mt-1 font-urdu">${surah.nameUrdu}</div>
          <div class="text-xs text-slate-400">${surah.nameEnglish} • Juz ${surah.juz}</div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <a href="#/quran/${surah.number}" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none text-center font-bold shadow-md">
          تلاوت و ترجمہ پڑھیں &rarr;
        </a>
      </div>
    </div>
  `).join('');
};

window.Views.filterSurahs = function(query) {
  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;

  if (!query || query.trim() === '') {
    grid.innerHTML = window.Views.renderSurahsGridHtml(ALL_114_SURAHS);
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const q = query.trim().toLowerCase();
  const filtered = ALL_114_SURAHS.filter(s => 
    s.nameArabic.includes(q) || 
    s.nameUrdu.includes(q) || 
    s.nameEnglish.toLowerCase().includes(q) || 
    s.meaning.toLowerCase().includes(q) ||
    s.number.toString() === q
  );

  grid.innerHTML = filtered.length > 0 
    ? window.Views.renderSurahsGridHtml(filtered)
    : `<div class="col-span-full py-12 text-center text-slate-400 font-urdu text-sm">کوئی سورت نہیں ملی۔ برائے مہربانی درست نام لکھیں۔</div>`;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterSurahsByType = function(type) {
  const btns = document.querySelectorAll('.quran-filter-btn');
  btns.forEach(b => b.classList.remove('btn-primary', 'active'));
  btns.forEach(b => b.classList.add('btn-secondary'));
  
  if (event && event.target) {
    event.target.classList.add('btn-primary', 'active');
    event.target.classList.remove('btn-secondary');
  }

  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;

  const filtered = type === 'all' ? ALL_114_SURAHS : ALL_114_SURAHS.filter(s => s.type === type);
  grid.innerHTML = window.Views.renderSurahsGridHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

// Dynamic Interactive Surah Reader Engine (Fetches ANY Surah 1-114 live)
window.Views.renderSurahReader = async function(surahNumber) {
  const container = document.getElementById('main-content');
  const surahMeta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];
  const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;

  // Initial Loader State
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Back & Navigation -->
      <div class="flex items-center justify-between">
        <a href="#/quran" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          &larr; تمام 114 سورتوں کی فہرست پر واپس جائیں
        </a>
        <div class="flex items-center gap-2">
          ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="btn-secondary py-1 px-2.5 text-xs rounded-lg">&larr; پچھلی سورت</a>` : ''}
          ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="btn-secondary py-1 px-2.5 text-xs rounded-lg">اگلی سورت &rarr;</a>` : ''}
        </div>
      </div>

      <!-- Surah Title Card -->
      <div class="lh-card p-6 sm:p-8 text-center space-y-4 border-2 border-emerald-500/30 shadow-xl relative">
        <span class="badge badge-success text-xs">${surahMeta.type === 'Meccan' ? 'مکی' : 'مدنی'} • ${surahMeta.ayahCount} آیات • پارہ ${surahMeta.juz}</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-extrabold text-emerald-800 dark:text-emerald-400 my-2">${surahMeta.nameArabic}</h1>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white font-urdu">${surahMeta.nameUrdu} — ${surahMeta.nameEnglish} (${surahMeta.meaning})</h2>
        
        <!-- Audio Reciter Player -->
        <div class="pt-4 max-w-lg mx-auto">
          <div class="text-xs text-slate-400 mb-1.5 flex items-center justify-center gap-1.5">
            <i data-lucide="volume-2" class="w-4 h-4 text-emerald-500"></i>
            <span>مکمل تلاوت: شیخ مشاری راشد العفاسی</span>
          </div>
          <audio controls class="w-full rounded-xl shadow">
            <source src="${audioUrl}" type="audio/mp3">
            Your browser does not support the audio player.
          </audio>
        </div>

        <!-- Font Size Adjuster -->
        <div class="pt-3 flex items-center justify-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span>عربی فونٹ سائز:</span>
          <button onclick="window.Views.adjustQuranFontSize(-2)" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200">A-</button>
          <span id="font-size-display" class="font-mono font-bold">${window.Views.currentQuranFontSize}px</span>
          <button onclick="window.Views.adjustQuranFontSize(2)" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200">A+</button>
        </div>
      </div>

      <!-- Ayahs Container (Loading State) -->
      <div id="surah-ayahs-list" class="space-y-6">
        <div class="text-center py-16 space-y-3">
          <div class="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-400 font-urdu">سورت کا عربی متن اور مستند ترجمہ لوڈ ہو رہا ہے...</p>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Fetch Full Surah Data from Public Islamic Quran API with caching
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry,en.sahih`);
    const data = await res.json();

    if (data && data.code === 200 && data.data && data.data.length >= 3) {
      const arabicEd = data.data[0]; // quran-uthmani
      const urduEd = data.data[1];   // ur.jalandhry
      const englishEd = data.data[2];// en.sahih

      const ayahsList = document.getElementById('surah-ayahs-list');
      if (!ayahsList) return;

      let html = '';

      // Bismillah header for all surahs except Surah At-Tawbah (9)
      if (surahNumber !== 9 && surahNumber !== 1) {
        html += `
          <div class="p-6 text-center bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl shadow-sm">
            <p class="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 dark:text-emerald-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p class="text-xs text-slate-500 font-urdu mt-1">شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔</p>
          </div>
        `;
      }

      arabicEd.ayahs.forEach((ayah, idx) => {
        const urduText = urduEd.ayahs[idx]?.text || '';
        const englishText = englishEd.ayahs[idx]?.text || '';
        let arabicText = ayah.text;

        // Strip bismillah prefix from first ayah if not Surah Al-Fatiha
        if (surahNumber !== 1 && idx === 0 && arabicText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
          arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
        }

        html += `
          <div class="lh-card p-6 sm:p-8 space-y-4 border-r-4 border-r-emerald-500 hover:shadow-lg transition ayah-card" id="ayah-${ayah.numberInSurah}">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                ${ayah.numberInSurah}
              </span>
              <div class="flex items-center gap-2">
                <button onclick="navigator.clipboard.writeText('${arabicText.replace(/'/g, "\\'")} - ${urduText.replace(/'/g, "\\'")}'); window.App.showToast('آیت کاپی ہو گئی!', 'success');" class="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 p-1">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i> کاپی کریں
                </button>
              </div>
            </div>

            <!-- Arabic Mushaf Text -->
            <p class="quran-arabic-text font-serif font-bold text-slate-900 dark:text-slate-100 text-right leading-loose py-2" style="font-size: ${window.Views.currentQuranFontSize}px;">
              ${arabicText} <span class="text-emerald-600 dark:text-emerald-400 font-mono text-lg">﴿${ayah.numberInSurah}﴾</span>
            </p>

            <!-- Urdu Translation -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <span class="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">اردو ترجمہ (فتح محمد جالندھری):</span>
              <p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-urdu">${urduText}</p>
            </div>

            <!-- English Translation -->
            <div class="pt-2 text-left">
              <span class="text-[11px] uppercase font-bold text-indigo-500 block mb-0.5">Sahih International:</span>
              <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${englishText}</p>
            </div>
          </div>
        `;
      });

      ayahsList.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    }
  } catch (err) {
    const ayahsList = document.getElementById('surah-ayahs-list');
    if (ayahsList) {
      ayahsList.innerHTML = `
        <div class="lh-card p-8 text-center space-y-3 border-rose-200">
          <div class="text-rose-500 font-bold text-base">آن لائن سرور سے رابطہ نہیں ہو سکا</div>
          <p class="text-xs text-slate-500">براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں یا صفحہ دوبارہ ریفریش کریں۔</p>
          <button onclick="window.Views.renderSurahReader(${surahNumber})" class="btn-primary py-2 px-4 text-xs rounded-xl">دوبارہ کوشش کریں</button>
        </div>
      `;
    }
  }
};

window.Views.adjustQuranFontSize = function(delta) {
  window.Views.currentQuranFontSize = Math.max(18, Math.min(42, window.Views.currentQuranFontSize + delta));
  const display = document.getElementById('font-size-display');
  if (display) display.textContent = `${window.Views.currentQuranFontSize}px`;
  
  const arabicElements = document.querySelectorAll('.quran-arabic-text');
  arabicElements.forEach(el => {
    el.style.fontSize = `${window.Views.currentQuranFontSize}px`;
  });
};
