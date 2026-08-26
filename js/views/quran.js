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
window.Views.selectedQari = window.Views.selectedQari || 'alafasy';
window.Views.activePlayingAyah = null;
window.Views.quranAudioPlayer = null;

const QURAN_QARIS = [
  { 
    id: 'alafasy', 
    name: 'شیخ مشاری راشد العفاسی (Mishary Alafasy)', 
    ayahFolder: 'Alafasy_128kbps',
    surahUrl: (num) => `https://server8.mp3quran.net/afs/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'abdulbasit', 
    name: 'شیخ عبد الباسط عبد الصمد - ترتیل (Abdul Basit)', 
    ayahFolder: 'Abdul_Basit_Murattal_192kbps',
    surahUrl: (num) => `https://server7.mp3quran.net/basit/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'sudais', 
    name: 'شیخ عبد الرحمن السدیس - امام کعبہ (Al-Sudais)', 
    ayahFolder: 'Abdurrahmaan_As-Sudais_192kbps',
    surahUrl: (num) => `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'maher', 
    name: 'شیخ ماهر المعیقلی - امام کعبہ (Maher Al-Muaiqly)', 
    ayahFolder: 'MaherAlMuaiqly128kbps',
    surahUrl: (num) => `https://server12.mp3quran.net/maher/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'minshawi', 
    name: 'شیخ محمد صدیق المنشاوی (Mohamed Al-Minshawi)', 
    ayahFolder: 'Minshawy_Murattal_128kbps',
    surahUrl: (num) => `https://server10.mp3quran.net/minsh/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'husary', 
    name: 'شیخ محمود خلیل الحصری (Mahmoud Al-Husary)', 
    ayahFolder: 'Husary_128kbps',
    surahUrl: (num) => `https://server13.mp3quran.net/husr/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'ghamdi', 
    name: 'شیخ سعد الغامدی (Saad Al-Ghamdi)', 
    ayahFolder: 'Ghamadi_40kbps',
    surahUrl: (num) => `https://server7.mp3quran.net/basit/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'hudhaify', 
    name: 'شیخ علی الحذیفی - امام مسجد نبوی (Ali Al-Hudhaify)', 
    ayahFolder: 'Hudhaify_128kbps',
    surahUrl: (num) => `https://server9.mp3quran.net/hudh/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'shuraym', 
    name: 'شیخ سعود الشریم (Saud Ash-Shuraim)', 
    ayahFolder: 'Saood_ash-Shuraym_128kbps',
    surahUrl: (num) => `https://download.quranicaudio.com/quran/sa3ood_al-shuraym/${String(num).padStart(3, '0')}.mp3`
  },
  { 
    id: 'shatri', 
    name: 'شیخ ابو بکر الشاطری (Abu Bakr Ash-Shatri)', 
    ayahFolder: 'Abu_Bakr_Ash-Shaatree_128kbps',
    surahUrl: (num) => `https://server11.mp3quran.net/shatri/${String(num).padStart(3, '0')}.mp3`
  }
];

window.Views.renderQuran = async function(params) {
  const container = document.getElementById('main-content');
  const surahNum = params && params.id ? parseInt(params.id, 10) : null;

  if (surahNum && surahNum >= 1 && surahNum <= 114) {
    window.Views.renderSurahReader(surahNum);
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      
      <!-- Quran Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-950 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden border border-emerald-500/40">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 text-right" dir="rtl">
          <div class="space-y-2.5 sm:space-y-3">
            <span class="badge bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-400/30">القرآن الكريم — كامل</span>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif">قرآن مجید (مکمل 114 سورتیں)</h1>
            <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-urdu leading-relaxed">
              مکمل 114 سورتیں عربی متن (عثمانی رسم الخط)، فتح محمد جالندھری کا مستند اردو ترجمہ، انگلش ترجمہ اور شیخ مشاری راشد العفاسی کی خوبصورت آڈیو تلاوت کے ساتھ۔
            </p>
          </div>
          <div class="grid grid-cols-3 sm:flex sm:flex-row gap-2 sm:gap-3 bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-emerald-500/30 text-center w-full md:w-auto shrink-0" dir="ltr">
            <div class="p-1 sm:p-2">
              <div class="text-xl sm:text-2xl font-bold text-emerald-300 font-mono">114</div>
              <div class="text-[10px] sm:text-[11px] text-slate-400 font-urdu">سورتیں</div>
            </div>
            <div class="hidden sm:block w-px bg-slate-800"></div>
            <div class="p-1 sm:p-2">
              <div class="text-xl sm:text-2xl font-bold text-teal-300 font-mono">30</div>
              <div class="text-[10px] sm:text-[11px] text-slate-400 font-urdu">پارے (Juz)</div>
            </div>
            <div class="hidden sm:block w-px bg-slate-800"></div>
            <div class="p-1 sm:p-2">
              <div class="text-xl sm:text-2xl font-bold text-cyan-300 font-mono">6,236</div>
              <div class="text-[10px] sm:text-[11px] text-slate-400 font-urdu">آیات مبارکہ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
        <div class="relative flex-1 w-full" dir="rtl">
          <input 
            type="text" 
            id="quran-search-input" 
            placeholder="سورت تلاش کریں (مثلاً: یسین، بقرہ، کہف، رحمن، ملک، یا Al-Fatiha)..." 
            class="form-input py-2.5 pl-4 pr-10 text-xs sm:text-sm rounded-xl font-urdu w-full text-right"
            oninput="window.Views.filterSurahs(this.value)"
          />
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5"></i>
        </div>

        <!-- Filter Buttons (Smooth Horizontal Scroll on Mobile) -->
        <div class="flex items-center gap-2 overflow-x-auto flex-nowrap sm:flex-wrap w-full md:w-auto pb-1 sm:pb-0 scrollbar-none font-urdu" dir="rtl">
          <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-btn active btn-primary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap shrink-0">تمام سورتیں (114)</button>
          <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-btn btn-secondary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap shrink-0">مکی سورتیں (86)</button>
          <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-btn btn-secondary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap shrink-0">مدنی سورتیں (28)</button>
        </div>
      </div>

      <!-- Surahs Catalog Grid -->
      <div id="quran-surahs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        ${window.Views.renderSurahsGridHtml(ALL_114_SURAHS)}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderSurahsGridHtml = function(surahs) {
  return surahs.map(surah => `
    <div class="lh-card p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500 hover:shadow-xl transition group rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 w-full overflow-hidden">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-mono border border-emerald-300/30">
            ${surah.number}
          </span>
          <span class="badge ${surah.type === 'Meccan' ? 'badge-success bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'badge-primary bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'} text-[10px] sm:text-xs font-urdu font-bold">
            ${surah.type === 'Meccan' ? 'مکی' : 'مدنی'} • ${surah.ayahCount} آیات
          </span>
        </div>

        <div class="text-center py-2 space-y-1">
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 dark:text-emerald-400 group-hover:scale-105 transition font-arabic">${surah.nameArabic}</h3>
          <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-urdu">${surah.nameUrdu}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-sans">${surah.nameEnglish} • Juz ${surah.juz}</div>
        </div>
      </div>

      <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <a href="#/quran/${surah.number}" class="btn-primary w-full py-2.5 px-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-none text-center font-bold font-urdu shadow-md flex items-center justify-center gap-1.5">
          <span>تلاوت و ترجمہ پڑھیں</span>
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
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
    : `<div class="col-span-full py-12 text-center text-slate-400 font-urdu text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">کوئی سورت نہیں ملی۔ برائے مہربانی درست نام لکھیں۔</div>`;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterSurahsByType = function(type) {
  const btns = document.querySelectorAll('.quran-filter-btn');
  btns.forEach(b => b.classList.remove('btn-primary', 'active'));
  btns.forEach(b => b.classList.add('btn-secondary'));
  
  if (window.event && window.event.target) {
    const target = window.event.target.closest('.quran-filter-btn') || window.event.target;
    target.classList.add('btn-primary', 'active');
    target.classList.remove('btn-secondary');
  }

  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;

  const filtered = type === 'all' ? ALL_114_SURAHS : ALL_114_SURAHS.filter(s => s.type === type);
  grid.innerHTML = window.Views.renderSurahsGridHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

// Offline built-in backup for essential Surahs
const OFFLINE_SURAHS_DATA = {
  1: {
    ayahs: [
      { number: 1, numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے', english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { number: 2, numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urdu: 'سب طرح کی تعریف خدا ہی کو (سزاوار) ہے جو تمام مخلوقات کا پروردگار ہے', english: '[All] praise is [due] to Allah, Lord of the worlds -' },
      { number: 3, numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'بڑا مہربان نہایت رحم والا', english: 'The Entirely Merciful, the Especially Merciful,' },
      { number: 4, numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', urdu: 'انصاف کے دن کا حاکم', english: 'Sovereign of the Day of Recompense.' },
      { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urdu: '(اے پروردگار) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں', english: 'It is You we worship and You we ask for help.' },
      { number: 6, numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urdu: 'ہم کو سیدھے رستے چلا', english: 'Guide us to the straight path -' },
      { number: 7, numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urdu: 'ان لوگوں کے رستے جن پر تو اپنا فضل وکرم کرتا رہا نہ ان کے جن پر غصہ ہوتا رہا اور نہ گمراہوں کے', english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' }
    ]
  },
  112: {
    ayahs: [
      { number: 6222, numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', urdu: 'کہو کہ وہ (ذات پاک جس کا نام) اللہ (ہے) ایک ہے', english: 'Say, "He is Allah, [who is] One,' },
      { number: 6223, numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', urdu: 'معبود برحق جو بےنیاز ہے', english: 'Allah, the Eternal Refuge.' },
      { number: 6224, numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', urdu: 'نہ کسی کا باپ ہے اور نہ کسی کا بیٹا', english: 'He neither begets nor is born,' },
      { number: 6225, numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', urdu: 'اور کوئی اس کا ہمسر نہیں', english: 'Nor is there to Him any equivalent."' }
    ]
  },
  113: {
    ayahs: [
      { number: 6226, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', urdu: 'کہو کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں', english: 'Say, "I seek refuge in the Lord of daybreak' },
      { number: 6227, numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', urdu: 'ہر چیز کی بدی سے جو اس نے پیدا کی', english: 'From the evil of that which He created' },
      { number: 6228, numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', urdu: 'اور اندھیری رات کی برائی سے جب اس کا اندھیرا چھا جائے', english: 'And from the evil of darkness when it settles' },
      { number: 6229, numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', urdu: 'اور گنڈوں پر (پڑھ پڑھ کر) پھونکنے والیوں کی برائی سے', english: 'And from the evil of the blowers in knots' },
      { number: 6230, numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', urdu: 'اور حسد کرنے والے کی برائی سے جب حسد کرنے لگے', english: 'And from the evil of an envier when he envies."' }
    ]
  },
  114: {
    ayahs: [
      { number: 6231, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', urdu: 'کہو کہ میں لوگوں کے پروردگار کی پناہ مانگتا ہوں', english: 'Say, "I seek refuge in the Lord of mankind,' },
      { number: 6232, numberInSurah: 2, text: 'مَلِكِ النَّاسِ', urdu: '(یعنی) لوگوں کے بادشاہ کی', english: 'The Sovereign of mankind,' },
      { number: 6233, numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', urdu: 'لوگوں کے معبود برحق کی', english: 'The God of mankind,' },
      { number: 6234, numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', urdu: '(شیطان) وسوسہ انداز کی برائی سے جو (خدا کا نام سن کر) پیچھے ہٹ جاتا ہے', english: 'From the evil of the retreating whisperer -' },
      { number: 6235, numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', urdu: 'جو لوگوں کے دلوں میں وسوسے ڈالتا ہے', english: 'Who whispers into the breasts of mankind -' },
      { number: 6236, numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', urdu: 'وہ جنات میں سے ہو یا انسانوں میں سے', english: 'From among the jinn and mankind."' }
    ]
  }
};

// Dynamic Interactive Surah Reader Engine (Fetches ANY Surah 1-114 live)
window.Views.renderSurahReader = async function(surahNumber) {
  const container = document.getElementById('main-content');
  const surahMeta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];
  const qariId = window.Views.selectedQari || 'alafasy';
  const currentQariObj = QURAN_QARIS.find(q => q.id === qariId) || QURAN_QARIS[0];
  const audioUrl = currentQariObj.surahUrl(surahNumber);
  const bookmarks = JSON.parse(localStorage.getItem('learnhub_quran_bookmarks') || '[]');

  // Initial Loader State
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 sm:space-y-8 w-full max-w-full overflow-hidden text-right" dir="rtl">
      <!-- Back & Navigation -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 font-urdu" dir="rtl">
        <a href="#/quran" class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          <i data-lucide="arrow-right" class="w-4 h-4"></i> تمام 114 سورتوں کی فہرست
        </a>
        <div class="flex items-center gap-1.5 sm:gap-2" dir="ltr">
          ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="btn-secondary py-1.5 px-2.5 sm:px-3 text-xs rounded-xl font-urdu flex items-center gap-1">پچھلی سورت &rarr;</a>` : ''}
          ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="btn-secondary py-1.5 px-2.5 sm:px-3 text-xs rounded-xl font-urdu flex items-center gap-1">&larr; اگلی سورت</a>` : ''}
        </div>
      </div>

      <!-- Surah Title Card -->
      <div class="lh-card p-5 sm:p-8 text-center space-y-4 border-2 border-emerald-500/30 shadow-xl relative rounded-3xl bg-white dark:bg-slate-900 w-full overflow-hidden">
        <div class="flex items-center justify-center gap-2">
          <span class="badge badge-success text-[11px] sm:text-xs font-urdu font-bold">${surahMeta.type === 'Meccan' ? 'مکی سورت' : 'مدنی سورت'} • ${surahMeta.ayahCount} آیات • پارہ ${surahMeta.juz}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-arabic font-extrabold text-emerald-800 dark:text-emerald-400 my-1 sm:my-2">${surahMeta.nameArabic}</h1>
        <h2 class="text-base sm:text-xl font-black text-slate-900 dark:text-white font-urdu">${surahMeta.nameUrdu} — ${surahMeta.nameEnglish} (${surahMeta.meaning})</h2>
        
        <!-- Multi-Qari Selector & Audio Reciter Player -->
        <div class="pt-2 sm:pt-4 max-w-lg mx-auto w-full space-y-3">
          <div class="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 font-urdu shrink-0 flex items-center gap-1">
              <i data-lucide="mic" class="w-4 h-4 text-emerald-500"></i> قاری منتخب کریں:
            </span>
            <select 
              id="qari-selector-dropdown"
              onchange="window.Views.selectedQari = this.value; window.Views.renderSurahReader(${surahNumber});" 
              class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold font-urdu p-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
            >
              ${QURAN_QARIS.map(q => `
                <option value="${q.id}" ${q.id === qariId ? 'selected' : ''}>${q.name}</option>
              `).join('')}
            </select>
          </div>

        <!-- Reading Mode Bar & Translation Toggle -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 font-urdu">
          <!-- View Mode Selector -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button 
              onclick="window.Views.setQuranViewMode('mushaf15', ${surahNumber})"
              class="py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranViewMode === 'mushaf15' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
            >
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>📖 15 سطری مصحف (15-Line Page)</span>
            </button>
            <button 
              onclick="window.Views.setQuranViewMode('full_surah', ${surahNumber})"
              class="py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranViewMode === 'full_surah' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
            >
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              <span>📜 مکمل سورت صفحہ (Continuous)</span>
            </button>
            <button 
              onclick="window.Views.setQuranViewMode('ayah_cards', ${surahNumber})"
              class="py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
            >
              <i data-lucide="layout-list" class="w-3.5 h-3.5"></i>
              <span>📝 آیت بہ آیت مطالعہ (Cards)</span>
            </button>
          </div>

          <!-- Translation On/Off Toggle & Font Sizer -->
          <div class="flex items-center gap-3">
            <button 
              onclick="window.Views.toggleQuranTranslation(${surahNumber})"
              class="py-1.5 px-3.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${window.Views.showTranslation ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'}"
            >
              <i data-lucide="${window.Views.showTranslation ? 'eye' : 'eye-off'}" class="w-3.5 h-3.5"></i>
              <span>${window.Views.showTranslation ? '📜 ترجمہ: آن (شامل ہے)' : '📖 صرف تلاوت (ترجمہ بند)'}</span>
            </button>

            <!-- Font Sizer -->
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold hover:bg-slate-200 transition flex items-center justify-center font-mono text-xs">A-</button>
              <span id="font-size-display" class="font-mono font-bold text-xs text-slate-900 dark:text-white px-1.5">${window.Views.currentQuranFontSize}px</span>
              <button onclick="window.Views.adjustQuranFontSize(2)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold hover:bg-slate-200 transition flex items-center justify-center font-mono text-xs">A+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ayahs Container (Loading State) -->
      <div id="surah-ayahs-list" class="space-y-4 sm:space-y-6">
        <div class="text-center py-16 space-y-3">
          <div class="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs sm:text-sm text-slate-400 font-urdu">سورت کا عربی متن اور مصحف صفحات لوڈ ہو رہے ہیں...</p>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const renderAyahsToDom = (ayahItems) => {
    const ayahsList = document.getElementById('surah-ayahs-list');
    if (!ayahsList) return;

    window.Views.currentSurahAyahs = ayahItems;
    const viewMode = window.Views.quranViewMode || 'mushaf15';
    const showTranslation = window.Views.showTranslation !== undefined ? window.Views.showTranslation : false;
    let html = '';

    // =========================================================================
    // MODE 1: 15-LINE MUSHAF PAGE MODE (15 سطری شاہی مصحف - صفحہ وار تلاوت)
    // =========================================================================
    if (viewMode === 'mushaf15') {
      const itemsPerPage = 15;
      const totalPages = Math.ceil(ayahItems.length / itemsPerPage);
      const curPage = Math.min(Math.max(1, window.Views.currentMushafPage || 1), totalPages);
      const startIndex = (curPage - 1) * itemsPerPage;
      const pageAyahs = ayahItems.slice(startIndex, startIndex + itemsPerPage);

      html += `
        <!-- 15-Line Royal Golden Framed Mushaf Page -->
        <div class="p-4 sm:p-8 rounded-3xl bg-[#fffef7] dark:bg-[#090e17] border-4 border-amber-400/60 dark:border-amber-600/40 shadow-2xl space-y-5 text-right relative overflow-hidden" dir="rtl">
          
          <!-- Top Header Bar with Surah & Page Info -->
          <div class="flex items-center justify-between border-b-2 border-amber-300/60 dark:border-amber-700/60 pb-3 font-urdu">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md font-sans">
                ${curPage}
              </span>
              <div>
                <span class="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300">${surahMeta.nameArabic} (${surahMeta.nameUrdu})</span>
                <span class="text-[10px] text-slate-500 block font-sans">15-Line Mushaf Edition • پینل صفحہ ${curPage} از ${totalPages}</span>
              </div>
            </div>

            <!-- Page Navigation Buttons -->
            <div class="flex items-center gap-1 font-sans">
              <button 
                onclick="window.Views.changeMushafPage(-1, ${surahNumber})"
                ${curPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}
                class="py-1 px-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 hover:bg-amber-200 text-xs font-black transition flex items-center gap-1 font-urdu"
              >
                <span>&larr; صفحہ پیچھے</span>
              </button>
              <button 
                onclick="window.Views.changeMushafPage(1, ${surahNumber})"
                ${curPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}
                class="py-1 px-3 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-black transition flex items-center gap-1 font-urdu shadow-sm"
              >
                <span>صفحہ آگے &rarr;</span>
              </button>
            </div>
          </div>

          <!-- Bismillah Calligraphy (Only on Page 1) -->
          ${curPage === 1 && surahNumber !== 9 && surahNumber !== 1 ? `
            <div class="py-3 my-2 text-center bg-gradient-to-r from-amber-50 via-emerald-50/50 to-amber-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 rounded-2xl border border-amber-300/40">
              <p class="text-2xl sm:text-3xl font-arabic font-bold text-amber-900 dark:text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
          ` : ''}

          <!-- Continuous 15-Line Mushaf Text Flow -->
          <div class="p-3 sm:p-5 leading-[2.6] sm:leading-[2.9] text-justify font-arabic font-bold text-slate-950 dark:text-slate-50 tracking-wide select-all" style="font-size: ${window.Views.currentQuranFontSize}px;" dir="rtl">
            ${pageAyahs.map((ayah, idx) => {
              let text = ayah.text;
              if (surahNumber !== 1 && (startIndex + idx) === 0 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
                text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
              }
              return `
                <span class="hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer" onclick="window.Views.playAyahAudio(${ayah.number}, ${ayah.numberInSurah}, ${surahNumber})" title="آیت ${ayah.numberInSurah} کی تلاوت سنیں">
                  ${text}
                </span>
                <span class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-amber-500/60 bg-amber-100/60 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-mono text-xs font-black mx-1 align-middle cursor-pointer shadow-sm hover:scale-110 transition" onclick="window.Views.playAyahAudio(${ayah.number}, ${ayah.numberInSurah}, ${surahNumber})" title="آیت ${ayah.numberInSurah}">
                  ۝${ayah.numberInSurah}
                </span>
              `;
            }).join(' ')}
          </div>

          <!-- Optional Translation Under Page if Enabled -->
          ${showTranslation ? `
            <div class="pt-4 border-t-2 border-amber-200 dark:border-slate-800 space-y-3 font-urdu">
              <div class="text-xs font-black text-emerald-800 dark:text-emerald-400 mb-2">📜 اس صفحے کا اردو ترجمہ:</div>
              <div class="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-loose">
                ${pageAyahs.map(a => `
                  <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                    <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-sans font-bold shrink-0">${a.numberInSurah}</span>
                    <p class="font-urdu leading-relaxed font-semibold">${a.urdu || ''}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Bottom Footer Pagination Bar -->
          <div class="flex items-center justify-between border-t border-amber-300/40 dark:border-slate-800 pt-3 text-xs font-urdu text-slate-500">
            <span>پارہ ${surahMeta.juz} • سورت ${surahMeta.nameArabic}</span>
            <span class="font-sans font-bold text-amber-700 dark:text-amber-400">Page ${curPage} / ${totalPages}</span>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // MODE 2: FULL CONTINUOUS SURAH PAGE (مکمل سورت ایک نظر میں)
    // =========================================================================
    else if (viewMode === 'full_surah') {
      html += `
        <div class="p-5 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-800 shadow-xl space-y-6 text-right" dir="rtl">
          ${surahNumber !== 9 && surahNumber !== 1 ? `
            <div class="py-4 text-center bg-emerald-50/50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700">
              <p class="text-2xl sm:text-3xl font-arabic font-bold text-emerald-800 dark:text-emerald-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
          ` : ''}

          <div class="p-3 sm:p-5 leading-[2.7] sm:leading-[3.0] text-justify font-arabic font-bold text-slate-950 dark:text-slate-50 tracking-wide select-all" style="font-size: ${window.Views.currentQuranFontSize}px;" dir="rtl">
            ${ayahItems.map((ayah, idx) => {
              let text = ayah.text;
              if (surahNumber !== 1 && idx === 0 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
                text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
              }
              return `
                <span class="hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer" onclick="window.Views.playAyahAudio(${ayah.number}, ${ayah.numberInSurah}, ${surahNumber})">
                  ${text}
                </span>
                <span class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-black mx-1 align-middle shadow-sm">
                  ۝${ayah.numberInSurah}
                </span>
              `;
            }).join(' ')}
          </div>

          ${showTranslation ? `
            <div class="pt-6 border-t-2 border-slate-200 dark:border-slate-800 space-y-3 font-urdu">
              <h3 class="text-sm font-black text-emerald-800 dark:text-emerald-400 mb-3">📜 مکمل سورت کا اردو ترجمہ (فتح محمد جالندھری):</h3>
              <div class="space-y-2.5">
                ${ayahItems.map(a => `
                  <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-sans font-bold shrink-0">${a.numberInSurah}</span>
                    <p class="text-xs sm:text-sm font-urdu leading-loose text-slate-800 dark:text-slate-200 font-semibold">${a.urdu || ''}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // MODE 3: DETAILED AYAH CARDS (آیت بہ آیت کارڈز و مطالعہ)
    // =========================================================================
    else {
      if (surahNumber !== 9 && surahNumber !== 1) {
        html += `
          <div class="p-5 sm:p-7 text-center bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 rounded-3xl shadow-sm">
            <p class="text-2xl sm:text-3xl font-arabic font-bold text-emerald-800 dark:text-emerald-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p class="text-xs text-slate-500 font-urdu mt-1">شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔</p>
          </div>
        `;
      }

      ayahItems.forEach((ayah, idx) => {
        const ayahKey = `${surahNumber}:${ayah.numberInSurah}`;
        const isBookmarked = bookmarks.includes(ayahKey);
        let arabicText = ayah.text;

        if (surahNumber !== 1 && idx === 0 && arabicText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
          arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
        }

        html += `
          <div class="lh-card p-5 sm:p-7 space-y-4 border-r-4 border-r-emerald-500 hover:shadow-lg transition-all ayah-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden" id="ayah-${ayah.numberInSurah}">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black font-mono border border-emerald-300/40">
                ${ayah.numberInSurah}
              </span>
              <div class="flex items-center gap-2">
                <button onclick="window.Views.playAyahAudio(${ayah.number}, ${ayah.numberInSurah}, ${surahNumber})" class="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition font-urdu font-bold" title="آیت کی تلاوت سنیں">
                  <i data-lucide="volume-2" class="w-4 h-4 text-emerald-500"></i>
                  <span>تلاوت سنیں</span>
                </button>
                <button onclick="window.Views.copyAyahText('${surahMeta.nameUrdu}', ${ayah.numberInSurah}, \`${arabicText.replace(/`/g, "\\`")}\`, \`${(ayah.urdu || '').replace(/`/g, "\\`")}\`)" class="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-urdu" title="کاپی کریں">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.Views.toggleQuranBookmark('${ayahKey}')" class="text-xs ${isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'} flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-urdu" title="${isBookmarked ? 'بک مارک ہٹائیں' : 'محفوظ کریں'}">
                  <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}"></i>
                </button>
              </div>
            </div>

            <p class="quran-arabic-text font-arabic font-bold text-slate-900 dark:text-slate-50 text-right leading-loose py-2 tracking-wide break-words select-all" style="font-size: ${window.Views.currentQuranFontSize}px;" dir="rtl">
              ${arabicText} <span class="text-emerald-600 dark:text-emerald-400 font-mono text-base sm:text-xl">﴿${ayah.numberInSurah}﴾</span>
            </p>

            ${showTranslation ? `
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right font-urdu space-y-1">
                <span class="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">اردو ترجمہ (فتح محمد جالندھری):</span>
                <p class="text-xs sm:text-base text-slate-800 dark:text-slate-200 leading-loose font-urdu break-words font-semibold">${ayah.urdu || ''}</p>
              </div>
              <div class="pt-2 text-left" dir="ltr">
                <span class="text-[11px] uppercase font-bold text-indigo-500 dark:text-indigo-400 block mb-0.5 font-sans">Sahih International:</span>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">${ayah.english || ''}</p>
              </div>
            ` : ''}
          </div>
        `;
      });
    }

    ayahsList.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  };

  // Fetch Full Surah Data from Public Islamic Quran API with caching & offline fallback
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry,en.sahih`);
    const data = await res.json();

    if (data && data.code === 200 && data.data && data.data.length >= 3) {
      const arabicEd = data.data[0];
      const urduEd = data.data[1];
      const englishEd = data.data[2];

      const ayahsFormatted = arabicEd.ayahs.map((ayah, idx) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        urdu: urduEd.ayahs[idx]?.text || '',
        english: englishEd.ayahs[idx]?.text || ''
      }));

      renderAyahsToDom(ayahsFormatted);
      return;
    }
  } catch (err) {
    console.warn('Quran API online fetch failed, trying local fallback:', err);
  }

  // Fallback to offline data if available
  if (OFFLINE_SURAHS_DATA[surahNumber]) {
    renderAyahsToDom(OFFLINE_SURAHS_DATA[surahNumber].ayahs);
  } else {
    const ayahsList = document.getElementById('surah-ayahs-list');
    if (ayahsList) {
      ayahsList.innerHTML = `
        <div class="lh-card p-6 sm:p-8 text-center space-y-3 border-rose-300 dark:border-rose-900 rounded-2xl bg-white dark:bg-slate-900">
          <div class="text-rose-500 font-bold text-sm sm:text-base font-urdu">آن لائن سرور سے رابطہ نہیں ہو سکا</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-urdu">براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں یا دوبارہ کوشش کریں۔</p>
          <button onclick="window.Views.renderSurahReader(${surahNumber})" class="btn-primary py-2 px-4 text-xs rounded-xl font-urdu">دوبارہ کوشش کریں 🔄</button>
        </div>
      `;
    }
  }
};

window.Views.setQuranViewMode = function(mode, surahNumber) {
  window.Views.quranViewMode = mode;
  window.Views.currentMushafPage = 1;
  window.Views.renderSurahReader(surahNumber);
  window.App?.showToast(mode === 'mushaf15' ? '📖 15 سطری مصحف موڈ فعال ہو گیا!' : (mode === 'full_surah' ? '📜 مکمل سورت موڈ فعال ہو گیا!' : '📝 آیت بہ آیت موڈ فعال ہو گیا!'), 'info');
};

window.Views.toggleQuranTranslation = function(surahNumber) {
  window.Views.showTranslation = !window.Views.showTranslation;
  window.Views.renderSurahReader(surahNumber);
  window.App?.showToast(window.Views.showTranslation ? '📜 ترجمہ آن کر دیا گیا' : '📖 ترجمہ بند (صرف عربی تلاوت)', 'info');
};

window.Views.changeMushafPage = function(delta, surahNumber) {
  window.Views.currentMushafPage = Math.max(1, (window.Views.currentMushafPage || 1) + delta);
  window.Views.renderSurahReader(surahNumber);
};

window.Views.adjustQuranFontSize = function(delta) {
  window.Views.currentQuranFontSize = Math.max(18, Math.min(44, window.Views.currentQuranFontSize + delta));
  const display = document.getElementById('font-size-display');
  if (display) display.textContent = `${window.Views.currentQuranFontSize}px`;
  
  const arabicElements = document.querySelectorAll('.quran-arabic-text');
  arabicElements.forEach(el => {
    el.style.fontSize = `${window.Views.currentQuranFontSize}px`;
  });
};

window.Views.copyAyahText = function(surahName, ayahNum, arabicText, urduText) {
  const text = `${arabicText} ﴿${ayahNum}﴾\n\nاردو ترجمہ:\n${urduText}\n\n[${surahName} - آیت ${ayahNum}]\nماخوذ از LearnHub: https://learnhubplatform.com/#/quran`;
  navigator.clipboard.writeText(text).then(() => {
    window.App.showToast(`آیت مبارکہ (${surahName}: ${ayahNum}) کاپی ہو گئی! 📋`, 'success');
  }).catch(() => {
    window.App.showToast('کاپی نہیں ہو سکی', 'warning');
  });
};

window.Views.playAyahAudio = function(ayahGlobalNumber, numberInSurah, surahNum) {
  if (!ayahGlobalNumber) return;
  const qariId = window.Views.selectedQari || 'alafasy';
  const currentQariObj = QURAN_QARIS.find(q => q.id === qariId) || QURAN_QARIS[0];
  
  // Highlight active Ayah
  document.querySelectorAll('.ayah-card').forEach(el => {
    el.classList.remove('ring-4', 'ring-amber-400', 'bg-amber-50/20');
  });

  const card = document.getElementById(`ayah-${numberInSurah}`);
  if (card) {
    card.classList.add('ring-4', 'ring-amber-400', 'bg-amber-50/20');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (window.Views.quranAudioPlayer) {
    window.Views.quranAudioPlayer.pause();
  }

  // Calculate 6-digit EveryAyah format: SSSAAA e.g. 001001
  const sNum = surahNum || parseInt(window.location.hash.split('/').pop(), 10) || 1;
  const paddedSurah = String(sNum).padStart(3, '0');
  const paddedAyah = String(numberInSurah).padStart(3, '0');
  const everyAyahCode = `${paddedSurah}${paddedAyah}`;

  const primaryAyahUrl = `https://everyayah.com/data/${currentQariObj.ayahFolder}/${everyAyahCode}.mp3`;
  const fallbackAyahUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;

  window.Views.quranAudioPlayer = new Audio(primaryAyahUrl);
  window.Views.quranAudioPlayer.onerror = function() {
    console.warn('Primary ayah audio failed, trying fallback...');
    window.Views.quranAudioPlayer = new Audio(fallbackAyahUrl);
    window.Views.quranAudioPlayer.play().catch(e => console.error('Fallback failed', e));
  };

  window.Views.quranAudioPlayer.play().then(() => {
    window.App.showToast(`آیت نمبر ${numberInSurah} کی تلاوت جاری ہے (${currentQariObj.name.split('(')[0].trim()}) 🔊`, 'info');
  }).catch(() => {
    window.App.showToast('آڈیو پلے ہو رہی ہے...', 'info');
  });
};

window.Views.toggleQuranBookmark = function(ayahKey) {
  let bookmarks = JSON.parse(localStorage.getItem('learnhub_quran_bookmarks') || '[]');
  if (bookmarks.includes(ayahKey)) {
    bookmarks = bookmarks.filter(k => k !== ayahKey);
    window.App.showToast('آیت بک مارکس سے ہٹا دی گئی۔', 'info');
  } else {
    bookmarks.push(ayahKey);
    window.App.showToast('آیت بک مارک میں محفوظ ہو گئی! ⭐', 'success');
  }
  localStorage.setItem('learnhub_quran_bookmarks', JSON.stringify(bookmarks));
  const surahNum = parseInt(ayahKey.split(':')[0], 10);
  if (surahNum) window.Views.renderSurahReader(surahNum);
};

window.Views.toggleWordByWordMode = function(surahNumber) {
  window.Views.wordByWordActive = !window.Views.wordByWordActive;
  window.Views.renderSurahReader(surahNumber);
  window.App?.showToast(window.Views.wordByWordActive ? 'لفظ بہ لفظ موڈ فعال ہو گیا! 📖' : 'معیاری مصحف موڈ فعال ہو گیا۔', 'info');
};

window.Views.speakWord = function(word) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'ar-SA';
    utter.rate = 0.75;
    window.speechSynthesis.speak(utter);
  }
  window.App?.showToast(`لفظ: ${word} 🔊`, 'info');
};


