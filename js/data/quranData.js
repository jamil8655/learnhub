/**
 * LearnHub Complete Quran Master Data Module
 * Authentic metadata for all 114 Surahs, 30 Juz, Reciters, Translations, and Classical Tafsirs.
 */

window.QURAN_DATA = (function() {
  'use strict';

  // 1. ALL 114 SURAHS (Strict standard order 1 to 114)
  const SURAHS = [
    { number: 1, nameArabic: 'الفَاتِحَة', nameTranslit: 'Al-Fatihah', nameEnglish: 'The Opening', nameUrdu: 'سورۃ الفاتحہ', meaning: 'The Opening', type: 'Meccan', ayahCount: 7, juz: 1, page: 1, rukuCount: 1 },
    { number: 2, nameArabic: 'البَقَرَة', nameTranslit: 'Al-Baqarah', nameEnglish: 'The Cow', nameUrdu: 'سورۃ البقرہ', meaning: 'The Cow', type: 'Medinan', ayahCount: 286, juz: 1, page: 2, rukuCount: 40 },
    { number: 3, nameArabic: 'آلِ عِمْرَان', nameTranslit: 'Aal-e-Imran', nameEnglish: 'Family of Imran', nameUrdu: 'سورۃ آل عمران', meaning: 'Family of Imran', type: 'Medinan', ayahCount: 200, juz: 3, page: 50, rukuCount: 20 },
    { number: 4, nameArabic: 'النِّسَاء', nameTranslit: 'An-Nisa', nameEnglish: 'The Women', nameUrdu: 'سورۃ النساء', meaning: 'The Women', type: 'Medinan', ayahCount: 176, juz: 4, page: 77, rukuCount: 24 },
    { number: 5, nameArabic: 'المَائِدَة', nameTranslit: 'Al-Ma\'idah', nameEnglish: 'The Table Spread', nameUrdu: 'سورۃ المائدہ', meaning: 'The Table Spread', type: 'Medinan', ayahCount: 120, juz: 6, page: 106, rukuCount: 16 },
    { number: 6, nameArabic: 'الأَنْعَام', nameTranslit: 'Al-An\'am', nameEnglish: 'The Cattle', nameUrdu: 'سورۃ الانعام', meaning: 'The Cattle', type: 'Meccan', ayahCount: 165, juz: 7, page: 128, rukuCount: 20 },
    { number: 7, nameArabic: 'الأَعْرَاف', nameTranslit: 'Al-A\'raf', nameEnglish: 'The Heights', nameUrdu: 'سورۃ الاعراف', meaning: 'The Heights', type: 'Meccan', ayahCount: 206, juz: 8, page: 151, rukuCount: 24, sajdaAyahs: [206] },
    { number: 8, nameArabic: 'الأَنْفَال', nameTranslit: 'Al-Anfal', nameEnglish: 'The Spoils of War', nameUrdu: 'سورۃ الانفال', meaning: 'The Spoils of War', type: 'Medinan', ayahCount: 75, juz: 9, page: 177, rukuCount: 10 },
    { number: 9, nameArabic: 'التَّوْبَة', nameTranslit: 'At-Tawbah', nameEnglish: 'The Repentance', nameUrdu: 'سورۃ التوبہ', meaning: 'The Repentance', type: 'Medinan', ayahCount: 129, juz: 10, page: 187, rukuCount: 16 },
    { number: 10, nameArabic: 'يُونُس', nameTranslit: 'Yunus', nameEnglish: 'Jonah', nameUrdu: 'سورۃ یونس', meaning: 'Jonah', type: 'Meccan', ayahCount: 109, juz: 11, page: 208, rukuCount: 11 },
    { number: 11, nameArabic: 'هُود', nameTranslit: 'Hud', nameEnglish: 'Hud', nameUrdu: 'سورۃ ہود', meaning: 'Hud', type: 'Meccan', ayahCount: 123, juz: 11, page: 221, rukuCount: 10 },
    { number: 12, nameArabic: 'يُوسُف', nameTranslit: 'Yusuf', nameEnglish: 'Joseph', nameUrdu: 'سورۃ یوسف', meaning: 'Joseph', type: 'Meccan', ayahCount: 111, juz: 12, page: 235, rukuCount: 12 },
    { number: 13, nameArabic: 'الرَّعْد', nameTranslit: 'Ar-Ra\'d', nameEnglish: 'The Thunder', nameUrdu: 'سورۃ الرعد', meaning: 'The Thunder', type: 'Medinan', ayahCount: 43, juz: 13, page: 249, rukuCount: 6, sajdaAyahs: [15] },
    { number: 14, nameArabic: 'إِبْرَاهِيم', nameTranslit: 'Ibrahim', nameEnglish: 'Abraham', nameUrdu: 'سورۃ ابراہیم', meaning: 'Abraham', type: 'Meccan', ayahCount: 52, juz: 13, page: 255, rukuCount: 7 },
    { number: 15, nameArabic: 'الحِجْر', nameTranslit: 'Al-Hijr', nameEnglish: 'The Rocky Tract', nameUrdu: 'سورۃ الحجر', meaning: 'The Rocky Tract', type: 'Meccan', ayahCount: 99, juz: 14, page: 262, rukuCount: 6 },
    { number: 16, nameArabic: 'النَّحْل', nameTranslit: 'An-Nahl', nameEnglish: 'The Bee', nameUrdu: 'سورۃ النحل', meaning: 'The Bee', type: 'Meccan', ayahCount: 128, juz: 14, page: 267, rukuCount: 16, sajdaAyahs: [50] },
    { number: 17, nameArabic: 'الإِسْرَاء', nameTranslit: 'Al-Isra', nameEnglish: 'The Night Journey', nameUrdu: 'سورۃ الاسراء', meaning: 'The Night Journey', type: 'Meccan', ayahCount: 111, juz: 15, page: 282, rukuCount: 12, sajdaAyahs: [109] },
    { number: 18, nameArabic: 'الكَهْف', nameTranslit: 'Al-Kahf', nameEnglish: 'The Cave', nameUrdu: 'سورۃ الکہف', meaning: 'The Cave', type: 'Meccan', ayahCount: 110, juz: 15, page: 293, rukuCount: 12 },
    { number: 19, nameArabic: 'مَرْيَم', nameTranslit: 'Maryam', nameEnglish: 'Mary', nameUrdu: 'سورۃ مریم', meaning: 'Mary', type: 'Meccan', ayahCount: 98, juz: 16, page: 305, rukuCount: 6, sajdaAyahs: [58] },
    { number: 20, nameArabic: 'طه', nameTranslit: 'Ta-Ha', nameEnglish: 'Ta-Ha', nameUrdu: 'سورۃ طٰہٰ', meaning: 'Ta-Ha', type: 'Meccan', ayahCount: 135, juz: 16, page: 312, rukuCount: 8 },
    { number: 21, nameArabic: 'الأَنْبِيَاء', nameTranslit: 'Al-Anbiya', nameEnglish: 'The Prophets', nameUrdu: 'سورۃ الانبیاء', meaning: 'The Prophets', type: 'Meccan', ayahCount: 112, juz: 17, page: 322, rukuCount: 7 },
    { number: 22, nameArabic: 'الحَجّ', nameTranslit: 'Al-Hajj', nameEnglish: 'The Pilgrimage', nameUrdu: 'سورۃ الحج', meaning: 'The Pilgrimage', type: 'Medinan', ayahCount: 78, juz: 17, page: 332, rukuCount: 10, sajdaAyahs: [18, 77] },
    { number: 23, nameArabic: 'المُؤْمِنُون', nameTranslit: 'Al-Mu\'minun', nameEnglish: 'The Believers', nameUrdu: 'سورۃ المؤمنون', meaning: 'The Believers', type: 'Meccan', ayahCount: 118, juz: 18, page: 342, rukuCount: 6 },
    { number: 24, nameArabic: 'النُّور', nameTranslit: 'An-Nur', nameEnglish: 'The Light', nameUrdu: 'سورۃ النور', meaning: 'The Light', type: 'Medinan', ayahCount: 64, juz: 18, page: 350, rukuCount: 9 },
    { number: 25, nameArabic: 'الفُرْقَان', nameTranslit: 'Al-Furqan', nameEnglish: 'The Criterion', nameUrdu: 'سورۃ الفرقان', meaning: 'The Criterion', type: 'Meccan', ayahCount: 77, juz: 18, page: 359, rukuCount: 6, sajdaAyahs: [60] },
    { number: 26, nameArabic: 'الشُّعَرَاء', nameTranslit: 'Ash-Shu\'ara', nameEnglish: 'The Poets', nameUrdu: 'سورۃ الشعراء', meaning: 'The Poets', type: 'Meccan', ayahCount: 227, juz: 19, page: 367, rukuCount: 11 },
    { number: 27, nameArabic: 'النَّمْل', nameTranslit: 'An-Naml', nameEnglish: 'The Ant', nameUrdu: 'سورۃ النمل', meaning: 'The Ant', type: 'Meccan', ayahCount: 93, juz: 19, page: 377, rukuCount: 7, sajdaAyahs: [26] },
    { number: 28, nameArabic: 'القَصَص', nameTranslit: 'Al-Qasas', nameEnglish: 'The Stories', nameUrdu: 'سورۃ القصص', meaning: 'The Stories', type: 'Meccan', ayahCount: 88, juz: 20, page: 385, rukuCount: 9 },
    { number: 29, nameArabic: 'العَنْكَبُوت', nameTranslit: 'Al-\'Ankabut', nameEnglish: 'The Spider', nameUrdu: 'سورۃ العنکبوت', meaning: 'The Spider', type: 'Meccan', ayahCount: 69, juz: 20, page: 396, rukuCount: 7 },
    { number: 30, nameArabic: 'الرُّوم', nameTranslit: 'Ar-Rum', nameEnglish: 'The Romans', nameUrdu: 'سورۃ الروم', meaning: 'The Romans', type: 'Meccan', ayahCount: 60, juz: 21, page: 404, rukuCount: 6 },
    { number: 31, nameArabic: 'لُقْمَان', nameTranslit: 'Luqman', nameEnglish: 'Luqman', nameUrdu: 'سورۃ لقمان', meaning: 'Luqman', type: 'Meccan', ayahCount: 34, juz: 21, page: 411, rukuCount: 4 },
    { number: 32, nameArabic: 'السَّجْدَة', nameTranslit: 'As-Sajdah', nameEnglish: 'The Prostration', nameUrdu: 'سورۃ السجدہ', meaning: 'The Prostration', type: 'Meccan', ayahCount: 30, juz: 21, page: 415, rukuCount: 3, sajdaAyahs: [15] },
    { number: 33, nameArabic: 'الأَحْزَاب', nameTranslit: 'Al-Ahzab', nameEnglish: 'The Combined Forces', nameUrdu: 'سورۃ الاحزاب', meaning: 'The Combined Forces', type: 'Medinan', ayahCount: 73, juz: 21, page: 418, rukuCount: 9 },
    { number: 34, nameArabic: 'سَبَأ', nameTranslit: 'Saba', nameEnglish: 'Sheba', nameUrdu: 'سورۃ سبا', meaning: 'Sheba', type: 'Meccan', ayahCount: 54, juz: 22, page: 428, rukuCount: 6 },
    { number: 35, nameArabic: 'فَاطِر', nameTranslit: 'Fatir', nameEnglish: 'Originator', nameUrdu: 'سورۃ فاطر', meaning: 'Originator', type: 'Meccan', ayahCount: 45, juz: 22, page: 434, rukuCount: 5 },
    { number: 36, nameArabic: 'يس', nameTranslit: 'Ya-Sin', nameEnglish: 'Ya-Sin', nameUrdu: 'سورۃ یٰسٓ', meaning: 'Ya-Sin', type: 'Meccan', ayahCount: 83, juz: 22, page: 440, rukuCount: 5 },
    { number: 37, nameArabic: 'الصَّافَّات', nameTranslit: 'As-Saffat', nameEnglish: 'Those who set the Ranks', nameUrdu: 'سورۃ الصافات', meaning: 'Those who set the Ranks', type: 'Meccan', ayahCount: 182, juz: 23, page: 446, rukuCount: 5 },
    { number: 38, nameArabic: 'ص', nameTranslit: 'Sad', nameEnglish: 'The Letter Sad', nameUrdu: 'سورۃ ص', meaning: 'The Letter Sad', type: 'Meccan', ayahCount: 88, juz: 23, page: 453, rukuCount: 5, sajdaAyahs: [24] },
    { number: 39, nameArabic: 'الزُّمَر', nameTranslit: 'Az-Zumar', nameEnglish: 'The Troops', nameUrdu: 'سورۃ الزمر', meaning: 'The Troops', type: 'Meccan', ayahCount: 75, juz: 23, page: 458, rukuCount: 8 },
    { number: 40, nameArabic: 'غَافِر', nameTranslit: 'Ghafir', nameEnglish: 'The Forgiver', nameUrdu: 'سورۃ غافر', meaning: 'The Forgiver', type: 'Meccan', ayahCount: 85, juz: 24, page: 467, rukuCount: 9 },
    { number: 41, nameArabic: 'فُصِّلَت', nameTranslit: 'Fussilat', nameEnglish: 'Explained in Detail', nameUrdu: 'سورۃ فصلت', meaning: 'Explained in Detail', type: 'Meccan', ayahCount: 54, juz: 24, page: 477, rukuCount: 6, sajdaAyahs: [38] },
    { number: 42, nameArabic: 'الشُّورَى', nameTranslit: 'Ash-Shura', nameEnglish: 'The Consultation', nameUrdu: 'سورۃ الشوریٰ', meaning: 'The Consultation', type: 'Meccan', ayahCount: 53, juz: 25, page: 483, rukuCount: 5 },
    { number: 43, nameArabic: 'الزُّخْرُف', nameTranslit: 'Az-Zukhruf', nameEnglish: 'The Ornaments of Gold', nameUrdu: 'سورۃ الزخرف', meaning: 'The Ornaments of Gold', type: 'Meccan', ayahCount: 89, juz: 25, page: 489, rukuCount: 7 },
    { number: 44, nameArabic: 'الدُّخَان', nameTranslit: 'Ad-Dukhan', nameEnglish: 'The Smoke', nameUrdu: 'سورۃ الدخان', meaning: 'The Smoke', type: 'Meccan', ayahCount: 59, juz: 25, page: 496, rukuCount: 3 },
    { number: 45, nameArabic: 'الجَاثِيَة', nameTranslit: 'Al-Jathiyah', nameEnglish: 'The Crouching', nameUrdu: 'سورۃ الجاثیہ', meaning: 'The Crouching', type: 'Meccan', ayahCount: 37, juz: 25, page: 499, rukuCount: 4 },
    { number: 46, nameArabic: 'الأَحْقَاف', nameTranslit: 'Al-Ahqaf', nameEnglish: 'The Wind-Curved Sandhills', nameUrdu: 'سورۃ الاحقاف', meaning: 'The Wind-Curved Sandhills', type: 'Meccan', ayahCount: 35, juz: 26, page: 502, rukuCount: 4 },
    { number: 47, nameArabic: 'مُحَمَّد', nameTranslit: 'Muhammad', nameEnglish: 'Muhammad', nameUrdu: 'سورۃ محمد ﷺ', meaning: 'Muhammad', type: 'Medinan', ayahCount: 38, juz: 26, page: 507, rukuCount: 4 },
    { number: 48, nameArabic: 'الفَتْح', nameTranslit: 'Al-Fath', nameEnglish: 'The Victory', nameUrdu: 'سورۃ الفتح', meaning: 'The Victory', type: 'Medinan', ayahCount: 29, juz: 26, page: 511, rukuCount: 4 },
    { number: 49, nameArabic: 'الحُجُرَات', nameTranslit: 'Al-Hujurat', nameEnglish: 'The Rooms', nameUrdu: 'سورۃ الحجرات', meaning: 'The Rooms', type: 'Medinan', ayahCount: 18, juz: 26, page: 515, rukuCount: 2 },
    { number: 50, nameArabic: 'ق', nameTranslit: 'Qaf', nameEnglish: 'The Letter Qaf', nameUrdu: 'سورۃ ق', meaning: 'The Letter Qaf', type: 'Meccan', ayahCount: 45, juz: 26, page: 518, rukuCount: 3 },
    { number: 51, nameArabic: 'الذَّارِيَات', nameTranslit: 'Adh-Dhariyat', nameEnglish: 'The Winnowing Winds', nameUrdu: 'سورۃ الذاریات', meaning: 'The Winnowing Winds', type: 'Meccan', ayahCount: 60, juz: 26, page: 520, rukuCount: 3 },
    { number: 52, nameArabic: 'الطُّور', nameTranslit: 'At-Tur', nameEnglish: 'The Mount', nameUrdu: 'سورۃ الطور', meaning: 'The Mount', type: 'Meccan', ayahCount: 49, juz: 27, page: 523, rukuCount: 2 },
    { number: 53, nameArabic: 'النَّجْم', nameTranslit: 'An-Najm', nameEnglish: 'The Star', nameUrdu: 'سورۃ النجم', meaning: 'The Star', type: 'Meccan', ayahCount: 62, juz: 27, page: 526, rukuCount: 3, sajdaAyahs: [62] },
    { number: 54, nameArabic: 'القَمَر', nameTranslit: 'Al-Qamar', nameEnglish: 'The Moon', nameUrdu: 'سورۃ القمر', meaning: 'The Moon', type: 'Meccan', ayahCount: 55, juz: 27, page: 528, rukuCount: 3 },
    { number: 55, nameArabic: 'الرَّحْمَٰن', nameTranslit: 'Ar-Rahman', nameEnglish: 'The Beneficent', nameUrdu: 'سورۃ الرحمن', meaning: 'The Beneficent', type: 'Medinan', ayahCount: 78, juz: 27, page: 531, rukuCount: 3 },
    { number: 56, nameArabic: 'الوَاقِعَة', nameTranslit: 'Al-Waqi\'ah', nameEnglish: 'The Inevitable', nameUrdu: 'سورۃ الواقعہ', meaning: 'The Inevitable', type: 'Meccan', ayahCount: 96, juz: 27, page: 534, rukuCount: 3 },
    { number: 57, nameArabic: 'الحَدِيد', nameTranslit: 'Al-Hadid', nameEnglish: 'The Iron', nameUrdu: 'سورۃ الحدید', meaning: 'The Iron', type: 'Medinan', ayahCount: 29, juz: 27, page: 537, rukuCount: 4 },
    { number: 58, nameArabic: 'المُجَادَلَة', nameTranslit: 'Al-Mujadila', nameEnglish: 'The Pleading Woman', nameUrdu: 'سورۃ المجادلہ', meaning: 'The Pleading Woman', type: 'Medinan', ayahCount: 22, juz: 28, page: 542, rukuCount: 3 },
    { number: 59, nameArabic: 'الحَشْر', nameTranslit: 'Al-Hashr', nameEnglish: 'The Exile', nameUrdu: 'سورۃ الحشر', meaning: 'The Exile', type: 'Medinan', ayahCount: 24, juz: 28, page: 545, rukuCount: 3 },
    { number: 60, nameArabic: 'المُمْتَحَنَة', nameTranslit: 'Al-Mumtahanah', nameEnglish: 'She that is to be examined', nameUrdu: 'سورۃ الممتحنہ', meaning: 'She that is to be examined', type: 'Medinan', ayahCount: 13, juz: 28, page: 549, rukuCount: 2 },
    { number: 61, nameArabic: 'الصَّفّ', nameTranslit: 'As-Saff', nameEnglish: 'The Ranks', nameUrdu: 'سورۃ الصف', meaning: 'The Ranks', type: 'Medinan', ayahCount: 14, juz: 28, page: 551, rukuCount: 2 },
    { number: 62, nameArabic: 'الجُمُعَة', nameTranslit: 'Al-Jumu\'ah', nameEnglish: 'The Congregation', nameUrdu: 'سورۃ الجمعہ', meaning: 'The Congregation', type: 'Medinan', ayahCount: 11, juz: 28, page: 553, rukuCount: 2 },
    { number: 63, nameArabic: 'المُنَافِقُون', nameTranslit: 'Al-Munafiqun', nameEnglish: 'The Hypocrites', nameUrdu: 'سورۃ المنافقون', meaning: 'The Hypocrites', type: 'Medinan', ayahCount: 11, juz: 28, page: 554, rukuCount: 2 },
    { number: 64, nameArabic: 'التَّغَابُن', nameTranslit: 'At-Taghabun', nameEnglish: 'The Mutual Disillusion', nameUrdu: 'سورۃ التغابن', meaning: 'The Mutual Disillusion', type: 'Medinan', ayahCount: 18, juz: 28, page: 556, rukuCount: 2 },
    { number: 65, nameArabic: 'الطَّلَاق', nameTranslit: 'At-Talaq', nameEnglish: 'The Divorce', nameUrdu: 'سورۃ الطلاق', meaning: 'The Divorce', type: 'Medinan', ayahCount: 12, juz: 28, page: 558, rukuCount: 2 },
    { number: 66, nameArabic: 'التَّحْرِيم', nameTranslit: 'At-Tahrim', nameEnglish: 'The Prohibition', nameUrdu: 'سورۃ التحریم', meaning: 'The Prohibition', type: 'Medinan', ayahCount: 12, juz: 28, page: 560, rukuCount: 2 },
    { number: 67, nameArabic: 'المُلْك', nameTranslit: 'Al-Mulk', nameEnglish: 'The Sovereignty', nameUrdu: 'سورۃ الملک', meaning: 'The Sovereignty', type: 'Meccan', ayahCount: 30, juz: 29, page: 562, rukuCount: 2 },
    { number: 68, nameArabic: 'القَلَم', nameTranslit: 'Al-Qalam', nameEnglish: 'The Pen', nameUrdu: 'سورۃ القلم', meaning: 'The Pen', type: 'Meccan', ayahCount: 52, juz: 29, page: 564, rukuCount: 2 },
    { number: 69, nameArabic: 'الحَاقَّة', nameTranslit: 'Al-Haqqah', nameEnglish: 'The Reality', nameUrdu: 'سورۃ الحاقہ', meaning: 'The Reality', type: 'Meccan', ayahCount: 52, juz: 29, page: 566, rukuCount: 2 },
    { number: 70, nameArabic: 'المَعَارِج', nameTranslit: 'Al-Ma\'arij', nameEnglish: 'The Ascending Stairways', nameUrdu: 'سورۃ المعارج', meaning: 'The Ascending Stairways', type: 'Meccan', ayahCount: 44, juz: 29, page: 568, rukuCount: 2 },
    { number: 71, nameArabic: 'نُوح', nameTranslit: 'Nuh', nameEnglish: 'Noah', nameUrdu: 'سورۃ نوح', meaning: 'Noah', type: 'Meccan', ayahCount: 28, juz: 29, page: 570, rukuCount: 2 },
    { number: 72, nameArabic: 'الجِنّ', nameTranslit: 'Al-Jinn', nameEnglish: 'The Jinn', nameUrdu: 'سورۃ الجن', meaning: 'The Jinn', type: 'Meccan', ayahCount: 28, juz: 29, page: 572, rukuCount: 2 },
    { number: 73, nameArabic: 'المُزَّمِّل', nameTranslit: 'Al-Muzzammil', nameEnglish: 'The Enshrouded One', nameUrdu: 'سورۃ المزمل', meaning: 'The Enshrouded One', type: 'Meccan', ayahCount: 20, juz: 29, page: 574, rukuCount: 2 },
    { number: 74, nameArabic: 'المُدَّثِّر', nameTranslit: 'Al-Muddaththir', nameEnglish: 'The Cloaked One', nameUrdu: 'سورۃ المدثر', meaning: 'The Cloaked One', type: 'Meccan', ayahCount: 56, juz: 29, page: 575, rukuCount: 2 },
    { number: 75, nameArabic: 'القِيَامَة', nameTranslit: 'Al-Qiyamah', nameEnglish: 'The Resurrection', nameUrdu: 'سورۃ القیامہ', meaning: 'The Resurrection', type: 'Meccan', ayahCount: 40, juz: 29, page: 577, rukuCount: 2 },
    { number: 76, nameArabic: 'الإِنْسَان', nameTranslit: 'Al-Insan', nameEnglish: 'The Man', nameUrdu: 'سورۃ الدھر / الانسان', meaning: 'The Man', type: 'Medinan', ayahCount: 31, juz: 29, page: 578, rukuCount: 2 },
    { number: 77, nameArabic: 'المُرْسَلَات', nameTranslit: 'Al-Mursalat', nameEnglish: 'The Emissaries', nameUrdu: 'سورۃ المرسلات', meaning: 'The Emissaries', type: 'Meccan', ayahCount: 50, juz: 29, page: 580, rukuCount: 2 },
    { number: 78, nameArabic: 'النَّبَأ', nameTranslit: 'An-Naba', nameEnglish: 'The Tidings', nameUrdu: 'سورۃ النباء', meaning: 'The Tidings', type: 'Meccan', ayahCount: 40, juz: 30, page: 582, rukuCount: 2 },
    { number: 79, nameArabic: 'النَّازِعَات', nameTranslit: 'An-Nazi\'at', nameEnglish: 'Those who drag forth', nameUrdu: 'سورۃ النازعات', meaning: 'Those who drag forth', type: 'Meccan', ayahCount: 46, juz: 30, page: 583, rukuCount: 2 },
    { number: 80, nameArabic: 'عَبَسَ', nameTranslit: '\'Abasa', nameEnglish: 'He Frowned', nameUrdu: 'سورۃ عبس', meaning: 'He Frowned', type: 'Meccan', ayahCount: 42, juz: 30, page: 585, rukuCount: 1 },
    { number: 81, nameArabic: 'التَّكْوِير', nameTranslit: 'At-Takwir', nameEnglish: 'The Overthrowing', nameUrdu: 'سورۃ التکویر', meaning: 'The Overthrowing', type: 'Meccan', ayahCount: 29, juz: 30, page: 586, rukuCount: 1 },
    { number: 82, nameArabic: 'الانْفِطَار', nameTranslit: 'Al-Infitar', nameEnglish: 'The Cleaving', nameUrdu: 'سورۃ الانفطار', meaning: 'The Cleaving', type: 'Meccan', ayahCount: 19, juz: 30, page: 587, rukuCount: 1 },
    { number: 83, nameArabic: 'المُطَفِّفِين', nameTranslit: 'Al-Mutaffifin', nameEnglish: 'The Defrauding', nameUrdu: 'سورۃ المطففین', meaning: 'The Defrauding', type: 'Meccan', ayahCount: 36, juz: 30, page: 587, rukuCount: 1 },
    { number: 84, nameArabic: 'الانْشِقَاق', nameTranslit: 'Al-Inshiqaq', nameEnglish: 'The Splitting Asunder', nameUrdu: 'سورۃ الانشقاق', meaning: 'The Splitting Asunder', type: 'Meccan', ayahCount: 25, juz: 30, page: 589, rukuCount: 1, sajdaAyahs: [21] },
    { number: 85, nameArabic: 'البُرُوج', nameTranslit: 'Al-Buruj', nameEnglish: 'The Mansions of the Stars', nameUrdu: 'سورۃ البروج', meaning: 'The Mansions of the Stars', type: 'Meccan', ayahCount: 22, juz: 30, page: 590, rukuCount: 1 },
    { number: 86, nameArabic: 'الطَّارِق', nameTranslit: 'At-Tariq', nameEnglish: 'The Morning Star', nameUrdu: 'سورۃ الطارق', meaning: 'The Morning Star', type: 'Meccan', ayahCount: 17, juz: 30, page: 591, rukuCount: 1 },
    { number: 87, nameArabic: 'الأَعْلَىٰ', nameTranslit: 'Al-A\'la', nameEnglish: 'The Most High', nameUrdu: 'سورۃ الاعلیٰ', meaning: 'The Most High', type: 'Meccan', ayahCount: 19, juz: 30, page: 591, rukuCount: 1 },
    { number: 88, nameArabic: 'الغَاشِيَة', nameTranslit: 'Al-Ghashiyah', nameEnglish: 'The Overwhelming', nameUrdu: 'سورۃ الغاشیہ', meaning: 'The Overwhelming', type: 'Meccan', ayahCount: 26, juz: 30, page: 592, rukuCount: 1 },
    { number: 89, nameArabic: 'الفَجْر', nameTranslit: 'Al-Fajr', nameEnglish: 'The Dawn', nameUrdu: 'سورۃ الفجر', meaning: 'The Dawn', type: 'Meccan', ayahCount: 30, juz: 30, page: 593, rukuCount: 1 },
    { number: 90, nameArabic: 'البَلَد', nameTranslit: 'Al-Balad', nameEnglish: 'The City', nameUrdu: 'سورۃ البلد', meaning: 'The City', type: 'Meccan', ayahCount: 20, juz: 30, page: 594, rukuCount: 1 },
    { number: 91, nameArabic: 'الشَّمْس', nameTranslit: 'Ash-Shams', nameEnglish: 'The Sun', nameUrdu: 'سورۃ الشمس', meaning: 'The Sun', type: 'Meccan', ayahCount: 15, juz: 30, page: 595, rukuCount: 1 },
    { number: 92, nameArabic: 'اللَّيْل', nameTranslit: 'Al-Layl', nameEnglish: 'The Night', nameUrdu: 'سورۃ اللیل', meaning: 'The Night', type: 'Meccan', ayahCount: 21, juz: 30, page: 595, rukuCount: 1 },
    { number: 93, nameArabic: 'الضُّحَىٰ', nameTranslit: 'Ad-Duhaa', nameEnglish: 'The Morning Hours', nameUrdu: 'سورۃ الضحیٰ', meaning: 'The Morning Hours', type: 'Meccan', ayahCount: 11, juz: 30, page: 596, rukuCount: 1 },
    { number: 94, nameArabic: 'الشَّرْح', nameTranslit: 'Ash-Sharh', nameEnglish: 'The Relief', nameUrdu: 'سورۃ الشرح', meaning: 'The Relief', type: 'Meccan', ayahCount: 8, juz: 30, page: 596, rukuCount: 1 },
    { number: 95, nameArabic: 'التِّين', nameTranslit: 'At-Tin', nameEnglish: 'The Fig', nameUrdu: 'سورۃ التین', meaning: 'The Fig', type: 'Meccan', ayahCount: 8, juz: 30, page: 597, rukuCount: 1 },
    { number: 96, nameArabic: 'العَلَق', nameTranslit: 'Al-\'Alaq', nameEnglish: 'The Clot', nameUrdu: 'سورۃ العلق', meaning: 'The Clot', type: 'Meccan', ayahCount: 19, juz: 30, page: 597, rukuCount: 1, sajdaAyahs: [19] },
    { number: 97, nameArabic: 'القَدْر', nameTranslit: 'Al-Qadr', nameEnglish: 'The Power', nameUrdu: 'سورۃ القدر', meaning: 'The Power', type: 'Meccan', ayahCount: 5, juz: 30, page: 598, rukuCount: 1 },
    { number: 98, nameArabic: 'البَيِّنَة', nameTranslit: 'Al-Bayyinah', nameEnglish: 'The Clear Proof', nameUrdu: 'سورۃ البینہ', meaning: 'The Clear Proof', type: 'Medinan', ayahCount: 8, juz: 30, page: 598, rukuCount: 1 },
    { number: 99, nameArabic: 'الزَّلْزَلَة', nameTranslit: 'Az-Zalzalah', nameEnglish: 'The Earthquake', nameUrdu: 'سورۃ الزلزال', meaning: 'The Earthquake', type: 'Medinan', ayahCount: 8, juz: 30, page: 599, rukuCount: 1 },
    { number: 100, nameArabic: 'العَادِيَات', nameTranslit: 'Al-\'Adiyat', nameEnglish: 'The Courser', nameUrdu: 'سورۃ العادیات', meaning: 'The Courser', type: 'Meccan', ayahCount: 11, juz: 30, page: 599, rukuCount: 1 },
    { number: 101, nameArabic: 'القَارِعَة', nameTranslit: 'Al-Qari\'ah', nameEnglish: 'The Calamity', nameUrdu: 'سورۃ القارعہ', meaning: 'The Calamity', type: 'Meccan', ayahCount: 11, juz: 30, page: 600, rukuCount: 1 },
    { number: 102, nameArabic: 'التَّكَاثُر', nameTranslit: 'At-Takathur', nameEnglish: 'The Rivalry in world increase', nameUrdu: 'سورۃ التکاثر', meaning: 'The Rivalry in world increase', type: 'Meccan', ayahCount: 8, juz: 30, page: 600, rukuCount: 1 },
    { number: 103, nameArabic: 'العَصْر', nameTranslit: 'Al-\'Asr', nameEnglish: 'The Declining Day', nameUrdu: 'سورۃ العصر', meaning: 'The Declining Day', type: 'Meccan', ayahCount: 3, juz: 30, page: 601, rukuCount: 1 },
    { number: 104, nameArabic: 'الهُمَزَة', nameTranslit: 'Al-Humazah', nameEnglish: 'The Traducer', nameUrdu: 'سورۃ الہمزہ', meaning: 'The Traducer', type: 'Meccan', ayahCount: 9, juz: 30, page: 601, rukuCount: 1 },
    { number: 105, nameArabic: 'الفِيل', nameTranslit: 'Al-Fil', nameEnglish: 'The Elephant', nameUrdu: 'سورۃ الفیل', meaning: 'The Elephant', type: 'Meccan', ayahCount: 5, juz: 30, page: 601, rukuCount: 1 },
    { number: 106, nameArabic: 'قُرَيْش', nameTranslit: 'Quraysh', nameEnglish: 'Quraysh', nameUrdu: 'سورۃ قریش', meaning: 'Quraysh', type: 'Meccan', ayahCount: 4, juz: 30, page: 602, rukuCount: 1 },
    { number: 107, nameArabic: 'المَاعُون', nameTranslit: 'Al-Ma\'un', nameEnglish: 'The Small Kindness', nameUrdu: 'سورۃ الماعون', meaning: 'The Small Kindness', type: 'Meccan', ayahCount: 7, juz: 30, page: 602, rukuCount: 1 },
    { number: 108, nameArabic: 'الكَوْثَر', nameTranslit: 'Al-Kawthar', nameEnglish: 'The Abundance', nameUrdu: 'سورۃ الکوثر', meaning: 'The Abundance', type: 'Meccan', ayahCount: 3, juz: 30, page: 602, rukuCount: 1 },
    { number: 109, nameArabic: 'الكَافِرُون', nameTranslit: 'Al-Kafirun', nameEnglish: 'The Disbelievers', nameUrdu: 'سورۃ الکافرون', meaning: 'The Disbelievers', type: 'Meccan', ayahCount: 6, juz: 30, page: 603, rukuCount: 1 },
    { number: 110, nameArabic: 'النَّصْر', nameTranslit: 'An-Nasr', nameEnglish: 'The Divine Support', nameUrdu: 'سورۃ النصر', meaning: 'The Divine Support', type: 'Medinan', ayahCount: 3, juz: 30, page: 603, rukuCount: 1 },
    { number: 111, nameArabic: 'المَسَد', nameTranslit: 'Al-Masad', nameEnglish: 'The Palm Fiber', nameUrdu: 'سورۃ المسد / اللھب', meaning: 'The Palm Fiber', type: 'Meccan', ayahCount: 5, juz: 30, page: 603, rukuCount: 1 },
    { number: 112, nameArabic: 'الإِخْلَاص', nameTranslit: 'Al-Ikhlas', nameEnglish: 'The Sincerity', nameUrdu: 'سورۃ الاخلاص', meaning: 'The Sincerity', type: 'Meccan', ayahCount: 4, juz: 30, page: 604, rukuCount: 1 },
    { number: 113, nameArabic: 'الفَلَق', nameTranslit: 'Al-Falaq', nameEnglish: 'The Daybreak', nameUrdu: 'سورۃ الفلق', meaning: 'The Daybreak', type: 'Meccan', ayahCount: 5, juz: 30, page: 604, rukuCount: 1 },
    { number: 114, nameArabic: 'النَّاس', nameTranslit: 'An-Nas', nameEnglish: 'Mankind', nameUrdu: 'سورۃ الناس', meaning: 'Mankind', type: 'Meccan', ayahCount: 6, juz: 30, page: 604, rukuCount: 1 }
  ];

  // 2. ALL 30 JUZ DIRECTORY
  const JUZ_LIST = [
    { juz: 1, nameArabic: 'الم', nameTranslit: 'Alif Lam Meem', nameUrdu: 'پارہ ۱: الم', startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
    { juz: 2, nameArabic: 'سَيَقُولُ', nameTranslit: 'Sayaqool', nameUrdu: 'پارہ ۲: سیقول', startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
    { juz: 3, nameArabic: 'تِلْكَ الرُّسُلُ', nameTranslit: 'Tilka ar-Rusul', nameUrdu: 'پارہ ۳: تلک الرسل', startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
    { juz: 4, nameArabic: 'لَنْ تَنَالُوا', nameTranslit: 'Lan Tanaaloo', nameUrdu: 'پارہ ۴: لن تنالوا', startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
    { juz: 5, nameArabic: 'وَالمُحْصَنَاتُ', nameTranslit: 'Wal-Muhsanat', nameUrdu: 'پارہ ۵: والمحصنات', startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
    { juz: 6, nameArabic: 'لَا يُحِبُّ اللَّهُ', nameTranslit: 'La Yuhibbullah', nameUrdu: 'پارہ ۶: لا یحب اللہ', startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
    { juz: 7, nameArabic: 'وَإِذَا سَمِعُوا', nameTranslit: 'Wa Iza Sami\'oo', nameUrdu: 'پارہ ۷: واذا سمعوا', startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
    { juz: 8, nameArabic: 'وَلَوْ أَنَّنَا', nameTranslit: 'Wa Law Annana', nameUrdu: 'پارہ ۸: ولو اننا', startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
    { juz: 9, nameArabic: 'قَالَ المَلَأُ', nameTranslit: 'Qalal-Mala\'u', nameUrdu: 'پارہ ۹: قال الملا', startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
    { juz: 10, nameArabic: 'وَاعْلَمُوا', nameTranslit: 'Wa\'lamoo', nameUrdu: 'پارہ ۱۰: واعلموا', startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
    { juz: 11, nameArabic: 'يَعْتَذِرُونَ', nameTranslit: 'Ya\'taziroon', nameUrdu: 'پارہ ۱۱: یعتذرون', startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
    { juz: 12, nameArabic: 'وَمَا مِنْ دَابَّةٍ', nameTranslit: 'Wa Ma Min Dabbah', nameUrdu: 'پارہ ۱۲: وما من دابۃ', startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
    { juz: 13, nameArabic: 'وَمَا أُبَرِّئُ', nameTranslit: 'Wa Ma Ubarri\'u', nameUrdu: 'پارہ ۱۳: وما ابریء', startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
    { juz: 14, nameArabic: 'رُبَمَا', nameTranslit: 'Rubama', nameUrdu: 'پارہ ۱۴: ربما', startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
    { juz: 15, nameArabic: 'سُبْحَانَ الَّذِي', nameTranslit: 'Subhanallazi', nameUrdu: 'پارہ ۱۵: سبحان الذی', startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
    { juz: 16, nameArabic: 'قَالَ أَلَمْ', nameTranslit: 'Qala Alam', nameUrdu: 'پارہ ۱۶: قال الم', startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
    { juz: 17, nameArabic: 'اقْتَرَبَ', nameTranslit: 'Iqtaraba', nameUrdu: 'پارہ ۱۷: اقترب', startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
    { juz: 18, nameArabic: 'قَدْ أَفْلَحَ', nameTranslit: 'Qad Aflaha', nameUrdu: 'پارہ ۱۸: قد افلح', startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
    { juz: 19, nameArabic: 'وَقَالَ الَّذِينَ', nameTranslit: 'Wa Qalal-Lazeena', nameUrdu: 'پارہ ۱۹: وقال الذین', startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
    { juz: 20, nameArabic: 'أَمَّنْ خَلَقَ', nameTranslit: 'Amman Khalaq', nameUrdu: 'پارہ ۲۰: امن خلق', startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
    { juz: 21, nameArabic: 'اتْلُ مَا أُوحِيَ', nameTranslit: 'Utlu Ma Oohiya', nameUrdu: 'پارہ ۲۱: اتل ما اوحی', startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
    { juz: 22, nameArabic: 'وَمَنْ يَقْنُتْ', nameTranslit: 'Wa Man Yaqnut', nameUrdu: 'پارہ ۲۲: ومن یقنت', startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
    { juz: 23, nameArabic: 'وَمَا لِيَ', nameTranslit: 'Wa Maliya', nameUrdu: 'پارہ ۲۳: وما لی', startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
    { juz: 24, nameArabic: 'فَمَنْ أَظْلَمُ', nameTranslit: 'Faman Azlamu', nameUrdu: 'پارہ ۲۴: فمن اظلم', startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
    { juz: 25, nameArabic: 'إِلَيْهِ يُرَدُّ', nameTranslit: 'Ilayhi Yuraddu', nameUrdu: 'پارہ ۲۵: الیہ یرد', startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
    { juz: 26, nameArabic: 'حم', nameTranslit: 'Ha-Meem', nameUrdu: 'پارہ ۲۶: حٰمٓ', startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
    { juz: 27, nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', nameTranslit: 'Qala Fama Khatbukum', nameUrdu: 'پارہ ۲۷: قال فما خطبکم', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
    { juz: 28, nameArabic: 'قَدْ سَمِعَ اللَّهُ', nameTranslit: 'Qad Sami\'allah', nameUrdu: 'پارہ ۲۸: قد سمع اللہ', startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
    { juz: 29, nameArabic: 'تَبَارَكَ الَّذِي', nameTranslit: 'Tabarakallazi', nameUrdu: 'پارہ ۲۹: تبارک الذی', startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
    { juz: 30, nameArabic: 'عَمَّ يَتَسَاءَلُونَ', nameTranslit: '\'Amma Yatasa\'aloon', nameUrdu: 'پارہ ۳۰: عم یتساءلون (عمّ پاره)', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 }
  ];

  // 3. AUTHENTIC HIGH-QUALITY RECITERS
  const RECITERS = [
    { 
      id: 'alafasy', 
      name: 'شیخ مشاری راشد العفاسی (Mishary Alafasy)', 
      style: 'حدر و ترتيل عذب',
      subfolder: 'Alafasy_128kbps',
      surahUrl: (num) => `https://server8.mp3quran.net/afs/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Alafasy_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'abdulbasit', 
      name: 'شیخ عبد الباسط عبد الصمد — ترتیل (Abdul Basit Murattal)', 
      style: 'ترتيل مصري أصيل',
      subfolder: 'Abdul_Basit_Murattal_192kbps',
      surahUrl: (num) => `https://server7.mp3quran.net/basit/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'sudais', 
      name: 'شیخ عبد الرحمن السدیس — إمام الحرم المكي (Al-Sudais)', 
      style: 'تلاوة الحرم المكي الشريف',
      subfolder: 'Abdurrahmaan_As-Sudais_192kbps',
      surahUrl: (num) => `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'maher', 
      name: 'شیخ ماهر المعیقلی — إمام الحرم المكي (Maher Al-Muaiqly)', 
      style: 'تلاوة خاشعة هادئة',
      subfolder: 'MaherAlMuaiqly128kbps',
      surahUrl: (num) => `https://server12.mp3quran.net/maher/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/MaherAlMuaiqly128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'minshawi', 
      name: 'شیخ محمد صدیق المنشاوی — ترتیل (Mohamed Al-Minshawi)', 
      style: 'الصوت الباكي الخاشع',
      subfolder: 'Minshawy_Murattal_128kbps',
      surahUrl: (num) => `https://server10.mp3quran.net/minsh/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Minshawy_Murattal_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'husary', 
      name: 'شیخ محمود خلیل الحصری — شیخ المقارئ (Mahmoud Al-Husary)', 
      style: 'مرجع التجويد والإتقان',
      subfolder: 'Husary_128kbps',
      surahUrl: (num) => `https://server13.mp3quran.net/husr/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Husary_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'ghamdi', 
      name: 'شیخ سعد الغامدی (Saad Al-Ghamdi)', 
      style: 'ترتيل مميز وسريع',
      subfolder: 'Ghamadi_40kbps',
      surahUrl: (num) => `https://server7.mp3quran.net/ghamdi/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Ghamadi_40kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'hudhaify', 
      name: 'شیخ علی الحذیفی — إمام المسجد النبوي (Ali Al-Hudhaify)', 
      style: 'تلاوة المسجد النبوي الشريف',
      subfolder: 'Hudhaify_128kbps',
      surahUrl: (num) => `https://server9.mp3quran.net/hudh/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Hudhaify_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'shuraym', 
      name: 'شیخ سعود الشریم (Saud Ash-Shuraim)', 
      style: 'تلاوة نجدية أصيلة',
      subfolder: 'Saood_ash-Shuraym_128kbps',
      surahUrl: (num) => `https://download.quranicaudio.com/quran/sa3ood_al-shuraym/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Saood_ash-Shuraym_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    },
    { 
      id: 'dosari', 
      name: 'شیخ یاسر الدوسری (Yasser Al-Dosari)', 
      style: 'تلاوة حجازية رخيمة',
      subfolder: 'Yasser_Ad-Dussary_128kbps',
      surahUrl: (num) => `https://server11.mp3quran.net/yasser/${String(num).padStart(3, '0')}.mp3`,
      ayahUrl: (surah, ayah) => `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
    }
  ];

  // 4. TRANSLATIONS REGISTRY
  const TRANSLATIONS = [
    {
      id: 'ur_jalandhri',
      language: 'ur',
      languageLabel: 'اردو (Urdu)',
      author: 'مولانا فتح محمد جالندھری',
      title: 'ترجمہ جالندھری',
      editionId: 'ur.jalandhry',
      isDefault: true
    },
    {
      id: 'ur_junagarhi',
      language: 'ur',
      languageLabel: 'اردو (Urdu)',
      author: 'مولانا محمد جوناگڑھی',
      title: 'تفسیر و ترجمہ احسن البیان',
      editionId: 'ur.junagarhi'
    },
    {
      id: 'ur_qadri',
      language: 'ur',
      languageLabel: 'اردو (Urdu)',
      author: 'ڈاکٹر محمد طاہر القادری',
      title: 'عرفان القرآن',
      editionId: 'ur.qadri'
    },
    {
      id: 'en_sahih',
      language: 'en',
      languageLabel: 'English',
      author: 'Saheeh International',
      title: 'Sahih International Translation',
      editionId: 'en.sahih'
    },
    {
      id: 'en_yusufali',
      language: 'en',
      languageLabel: 'English',
      author: 'Abdullah Yusuf Ali',
      title: 'The Meaning of the Holy Qur\'an',
      editionId: 'en.yusufali'
    },
    {
      id: 'en_usmani',
      language: 'en',
      languageLabel: 'English',
      author: 'Mufti Muhammad Taqi Usmani',
      title: 'The Noble Quran Translation',
      editionId: 'en.usmani'
    },
    {
      id: 'hi_farooq',
      language: 'hi',
      languageLabel: 'हिन्दी (Hindi)',
      author: 'मौलाना फ़ारूक़ ख़ान व मुहम्मद अहमद',
      title: 'आसान क़ुरआन तर्जुमा',
      editionId: 'hi.farooq'
    }
  ];

  
  
  // 5. CLASSICAL TAFSIRS REGISTRY (With Multi-Volume Support & Device Upload Slots)
  const TAFSIRS = [
    {
      id: 'ibnkathir',
      name: 'تفسیر ابن کثیر — عماد الدین ابن کثیر',
      nameUrdu: 'تفسیر ابن کثیر (جامع و مستند سلفی تفسیر)',
      nameEnglish: 'Tafseer Ibn Kathir (Complete)',
      author: 'الإمام الحافظ عماد الدين أبو الفداء إسماعيل بن عمر بن كثير القرشي الدمشقي (المتوفى 774هـ)',
      volumes: '8 مجلدات / جلدیں',
      volumesCount: 8,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'أشهر وأوثق تفاسير أهل السنة والجماعة بالأثر، يعتمد على تفسير القرآن بالقرآن، ثم بالحديث الصحيح، ثم بآثار الصحابة والتابعين مع نقد الإسرائيليات.',
      downloadUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Complete.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: سورۃ الفاتحہ تا سورۃ البقرہ', surahRange: '1 تا 2', pages: '650 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: سورۃ آل عمران تا سورۃ النساء', surahRange: '3 تا 4', pages: '620 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ المائدہ تا سورۃ الانعام', surahRange: '5 تا 6', pages: '590 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: سورۃ الاعراف تا سورۃ یونس', surahRange: '7 تا 10', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: سورۃ ہود تا سورۃ الکہف', surahRange: '11 تا 18', pages: '640 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-05.pdf' },
        { volumeNumber: 6, title: 'جلد 6: سورۃ مریم تا سورۃ القصص', surahRange: '19 تا 28', pages: '580 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-06.pdf' },
        { volumeNumber: 7, title: 'جلد 7: سورۃ العنکبوت تا سورۃ الزمر', surahRange: '29 تا 39', pages: '600 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-07.pdf' },
        { volumeNumber: 8, title: 'جلد 8: سورۃ غافر تا سورۃ الناس', surahRange: '40 تا 114', pages: '680 صفحات', pdfUrl: 'https://archive.org/download/tafseer-ibn-e-kaseer-urdu/Tafseer-Ibn-Katheer-Vol-08.pdf' }
      ]
    },
    {
      id: 'ahsanulbayan',
      name: 'تفسیر احسن البیان — حافظ صلاح الدین یوسف',
      nameUrdu: 'تفسیر احسن البیان (سلفی منہج و صحیح احادیث)',
      nameEnglish: 'Tafseer Ahsan ul-Bayan (Salafi Methodology)',
      author: 'حافظ صلاح الدین یوسف (رحمہ اللہ) و مولانا محمد جوناگڑھی',
      volumes: 'مجلد واحد / 5 جلدیں',
      volumesCount: 5,
      language: 'ur',
      languageLabel: 'اردو',
      description: 'مستند و عصر حاضر کی بہترین سلفی تفسیر، جس میں عقیدہ توحید، رد شرک و بدعت، اتباع سنت اور صحیح احادیث کی روشنی میں آیات کی مدلل تشریح کی گئی ہے۔',
      downloadUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Complete.pdf',
      isMajor: true,
      isDefault: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: پارے 1 تا 6 (سورۃ الفاتحہ تا سورۃ النساء)', surahRange: '1 تا 4', pages: '450 صفحات', pdfUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: پارے 7 تا 12 (سورۃ المائدہ تا سورۃ ہود)', surahRange: '5 تا 11', pages: '480 صفحات', pdfUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: پارے 13 تا 18 (سورۃ یوسف تا سورۃ الفرقان)', surahRange: '12 تا 25', pages: '460 صفحات', pdfUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: پارے 19 تا 24 (سورۃ الشعراء تا سورۃ فصلت)', surahRange: '26 تا 41', pages: '470 صفحات', pdfUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: پارے 25 تا 30 (سورۃ الشوریٰ تا سورۃ الناس)', surahRange: '42 تا 114', pages: '510 صفحات', pdfUrl: 'https://archive.org/download/ahsan-ul-bayan-urdu/Ahsan-ul-Bayan-Vol-05.pdf' }
      ]
    },
    {
      id: 'saadi',
      name: 'تفسير السعدي — تيسير الكريم الرحمن في تفسير كلام المنان',
      nameUrdu: 'تفسیر السعدی (تيسير الكريم الرحمن)',
      nameEnglish: 'Tafseer As-Saadi (Tayseer al-Kareem ar-Rahman)',
      author: 'الشيخ العلامة عبد الرحمن بن ناصر السعدي التميمي (المتوفى 1376هـ)',
      volumes: '3 مجلدات / جلد واحد',
      volumesCount: 3,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'تفسير ميسر بأسلوب واضح يركز على مقاصد القرآن، ترسيخ العقيدة السلفية، واستنباط الفوائد والأحكام والتربية الإيمانية بدون تعقيد.',
      downloadUrl: 'https://archive.org/download/tafseer-as-sadi-urdu/Tafseer-As-Sadi-Urdu.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: سورۃ الفاتحہ تا سورۃ الکہف', surahRange: '1 تا 18', pages: '560 صفحات', pdfUrl: 'https://archive.org/download/tafseer-as-sadi-urdu/Tafseer-As-Sadi-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: سورۃ مریم تا سورۃ فاطر', surahRange: '19 تا 35', pages: '520 صفحات', pdfUrl: 'https://archive.org/download/tafseer-as-sadi-urdu/Tafseer-As-Sadi-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ یس تا سورۃ الناس', surahRange: '36 تا 114', pages: '580 صفحات', pdfUrl: 'https://archive.org/download/tafseer-as-sadi-urdu/Tafseer-As-Sadi-Vol-03.pdf' }
      ]
    },
    {
      id: 'tabari',
      name: 'تفسیر طبری — جامع البيان عن تأويل آي القرآن',
      nameUrdu: 'تفسیر طبری (ام التفاسیر)',
      nameEnglish: 'Tafseer At-Tabari (Jami al-Bayan)',
      author: 'الإمام أبو جعفر محمد بن جرير الطبري (المتوفى 310هـ)',
      volumes: '12 مجلداً',
      volumesCount: 12,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'أم التفاسير وأقدمها وأعظمها قدراً ومكانة، حوى آلاف الأسانيد والمرويات عن الصحابة والتابعين واللغة وأسباب النزول.',
      downloadUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Urdu.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: سورۃ الفاتحہ و نصف سورۃ البقرہ', surahRange: '1 تا 2 (آیت 141)', pages: '620 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: بقیہ سورۃ البقرہ', surahRange: '2 (آیت 142 تا 286)', pages: '590 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ آل عمران و النساء', surahRange: '3 تا 4', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: سورۃ المائدہ و الانعام', surahRange: '5 تا 6', pages: '630 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: سورۃ الاعراف تا سورۃ التوبہ', surahRange: '7 تا 9', pages: '640 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-05.pdf' },
        { volumeNumber: 6, title: 'جلد 6: سورۃ یونس تا سورۃ الرعد', surahRange: '10 تا 13', pages: '600 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-06.pdf' },
        { volumeNumber: 7, title: 'جلد 7: سورۃ ابراہیم تا سورۃ الاسراء', surahRange: '14 تا 17', pages: '580 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-07.pdf' },
        { volumeNumber: 8, title: 'جلد 8: سورۃ الکہف تا سورۃ الانبیاء', surahRange: '18 تا 21', pages: '590 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-08.pdf' },
        { volumeNumber: 9, title: 'جلد 9: سورۃ الحج تا سورۃ النمل', surahRange: '22 تا 27', pages: '620 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-09.pdf' },
        { volumeNumber: 10, title: 'جلد 10: سورۃ القصص تا سورۃ الصافات', surahRange: '28 تا 37', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-10.pdf' },
        { volumeNumber: 11, title: 'جلد 11: سورۃ ص تا سورۃ الواقعہ', surahRange: '38 تا 56', pages: '630 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-11.pdf' },
        { volumeNumber: 12, title: 'جلد 12: سورۃ الحدید تا سورۃ الناس', surahRange: '57 تا 114', pages: '670 صفحات', pdfUrl: 'https://archive.org/download/tafseer-tabari-urdu/Tafseer-Tabari-Vol-12.pdf' }
      ]
    },
    {
      id: 'maarif',
      name: 'تفسیر معارف القرآن — مفتی محمد شفیع عثمانی',
      nameUrdu: 'تفسیر معارف القرآن (8 جلدیں مکمل)',
      nameEnglish: "Tafseer Ma'arif-ul-Quran (Complete 8 Vols)",
      author: 'مفتی اعظم پاکستان مفتی محمد شفیع عثمانی (رحمہ اللہ)',
      volumes: '8 جلدیں مکمل',
      volumesCount: 8,
      language: 'ur',
      languageLabel: 'اردو',
      description: 'اردو زبان کی سب سے جامع و مفصل تفسیر جس میں روزمرہ مسائل، معاشی و معاشرتی احکام، اور حکمتِ قرآنی کو عام فہم انداز میں پیش کیا گیا ہے۔',
      downloadUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Complete.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: سورۃ الفاتحہ تا سورۃ البقرہ', surahRange: '1 تا 2', pages: '690 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: سورۃ آل عمران تا سورۃ النساء', surahRange: '3 تا 4', pages: '670 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ المائدہ تا سورۃ الانعام', surahRange: '5 تا 6', pages: '640 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: سورۃ الاعراف تا سورۃ التوبہ', surahRange: '7 تا 9', pages: '660 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: سورۃ یونس تا سورۃ بنی اسرائیل', surahRange: '10 تا 17', pages: '680 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-05.pdf' },
        { volumeNumber: 6, title: 'جلد 6: سورۃ الکہف تا سورۃ القصص', surahRange: '18 تا 28', pages: '650 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-06.pdf' },
        { volumeNumber: 7, title: 'جلد 7: سورۃ العنکبوت تا سورۃ الاحقاف', surahRange: '29 تا 46', pages: '670 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-07.pdf' },
        { volumeNumber: 8, title: 'جلد 8: سورۃ محمد تا سورۃ الناس', surahRange: '47 تا 114', pages: '720 صفحات', pdfUrl: 'https://archive.org/download/maarif-ul-quran-urdu-complete/Maarif-ul-Quran-Vol-08.pdf' }
      ]
    },
    {
      id: 'qurtubi',
      name: 'تفسیر قرطبی — الجامع لأحكام القرآن',
      nameUrdu: 'تفسیر قرطبی (الجامع لاحکام القرآن)',
      nameEnglish: 'Tafseer Al-Qurtubi (Fiqh & Ahkam)',
      author: 'الإمام أبو عبد الله محمد بن أحمد الأنصاري القرطبي (المتوفى 671هـ)',
      volumes: '10 مجلدات',
      volumesCount: 10,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'من أعظم تفاسير الأحكام الفقهية واللغوية والقراءات، يستنبط الأحکام الشرعية بدقة وإنصاف علمي.',
      downloadUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Tafseer-Qurtubi-Urdu.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: مقدمہ و سورۃ الفاتحہ و البقرہ (حصہ اول)', surahRange: '1 تا 2 (آیت 141)', pages: '580 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: بقیہ سورۃ البقرہ و آل عمران', surahRange: '2 تا 3', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ النساء و المائدہ', surahRange: '4 تا 5', pages: '600 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: سورۃ الانعام تا سورۃ التوبہ', surahRange: '6 تا 9', pages: '620 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: سورۃ یونس تا سورۃ النحل', surahRange: '10 تا 16', pages: '590 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-05.pdf' },
        { volumeNumber: 6, title: 'جلد 6: سورۃ الاسراء تا سورۃ الحج', surahRange: '17 تا 22', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-06.pdf' },
        { volumeNumber: 7, title: 'جلد 7: سورۃ المؤمنون تا سورۃ القصص', surahRange: '23 تا 28', pages: '580 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-07.pdf' },
        { volumeNumber: 8, title: 'جلد 8: سورۃ العنکبوت تا سورۃ ص', surahRange: '29 تا 38', pages: '600 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-08.pdf' },
        { volumeNumber: 9, title: 'جلد 9: سورۃ الزمر تا سورۃ الحدید', surahRange: '39 تا 57', pages: '630 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-09.pdf' },
        { volumeNumber: 10, title: 'جلد 10: سورۃ المجادلہ تا سورۃ الناس', surahRange: '58 تا 114', pages: '650 صفحات', pdfUrl: 'https://archive.org/download/tafseer-qurtubi-urdu/Qurtubi-Vol-10.pdf' }
      ]
    },
    {
      id: 'fathulqadeer',
      name: 'تفسیر فتح القدیر — امام محمد بن علی الشوکانی',
      nameUrdu: 'تفسیر فتح القدیر (الجامع بین فني الروایۃ والدرایۃ)',
      nameEnglish: 'Tafseer Fath ul-Qadeer (Ash-Shawkani)',
      author: 'الإمام المحدث الفقيه محمد بن علي الشوكاني (المتوفى 1250هـ)',
      volumes: '5 مجلدات',
      volumesCount: 5,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'تفسير فريد جمع بين فني الرواية والدراية، وتحرير المسائل الفقهية بالدلیل من الكتاب والسنة الصحيحة بعيداً عن التعصب المذهبي.',
      downloadUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Urdu.pdf',
      isMajor: true,
      volumesList: [
        { volumeNumber: 1, title: 'جلد 1: سورۃ الفاتحہ تا سورۃ النساء', surahRange: '1 تا 4', pages: '640 صفحات', pdfUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Vol-01.pdf' },
        { volumeNumber: 2, title: 'جلد 2: سورۃ المائدہ تا سورۃ التوبہ', surahRange: '5 تا 9', pages: '620 صفحات', pdfUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Vol-02.pdf' },
        { volumeNumber: 3, title: 'جلد 3: سورۃ یونس تا سورۃ مریم', surahRange: '10 تا 19', pages: '610 صفحات', pdfUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Vol-03.pdf' },
        { volumeNumber: 4, title: 'جلد 4: سورۃ طٰہٰ تا سورۃ الصافات', surahRange: '20 تا 37', pages: '630 صفحات', pdfUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Vol-04.pdf' },
        { volumeNumber: 5, title: 'جلد 5: سورۃ ص تا سورۃ الناس', surahRange: '38 تا 114', pages: '680 صفحات', pdfUrl: 'https://archive.org/download/fath-ul-qadeer-urdu/Fath-ul-Qadeer-Vol-05.pdf' }
      ]
    },
    {
      id: 'jalalayn',
      name: 'تفسیر جلالین — جلال الدین محلی و سیوطی',
      nameUrdu: 'تفسیر جلالین (مختصر لغوی و اعرابی تفسیر)',
      nameEnglish: 'Tafseer al-Jalalayn',
      author: 'الإمام جلال الدين المحلي والإمام جلال الدين السيوطي',
      volumes: 'مجلد واحد',
      volumesCount: 1,
      language: 'ur',
      languageLabel: 'اردو و عربی',
      description: 'تفسير لغوي موجز ودقيق معتمد في معاهد وجامعات العالم الإسلامي في تدريس علوم القرآن.',
      downloadUrl: 'https://archive.org/download/tafseer-jalalain-urdu/Tafseer-Jalalain.pdf',
      isMajor: false,
      volumesList: [
        { volumeNumber: 1, title: 'مجلد واحد مکمل: از سورۃ الفاتحہ تا سورۃ الناس', surahRange: '1 تا 114', pages: '520 صفحات', pdfUrl: 'https://archive.org/download/tafseer-jalalain-urdu/Tafseer-Jalalain.pdf' }
      ]
    }
  ];



  // 5.5 MUSHAF PRINT EDITIONS (15-Line Pakistani, 16-Line Taj, Madani Uthmani, etc.)
  const MUSHAF_EDITIONS = [
    {
      id: 'pak_15line',
      title: '15 سطری شاہی مصحف (پاکستانی و انڈو-پاک رسم الخط)',
      titleEnglish: '15-Line Indo-Pak Standard Mushaf',
      lines: 15,
      totalPages: 611,
      script: 'Indo-Pak / Nastaliq Naskh',
      publisher: 'شاہی قرآن پریس و مکتبہ سلفیہ',
      description: 'حفاظ کرام اور عام قارئین کے لیے سب سے مقبول 15 سطری قرآنی رسم الخط جس میں ہر صفحہ آیت کے اختتام پر ختم ہوتا ہے (آیت معلق نہیں ہوتی)۔',
      downloadUrl: 'https://archive.org/download/quran-15-lines-pakistani/Quran-15-Lines.pdf',
      isDefault: true,
      features: ['ہر صفحہ آیت پر ختم', '15 متوازن سطور', 'تجویدی علامات', 'آف لائن کیشنگ دستیاب']
    },
    {
      id: 'taj_16line',
      title: '16 سطری مصحف تاج کمپنی (16-Line Taj Company)',
      titleEnglish: '16-Line Taj Company Mushaf',
      lines: 16,
      totalPages: 848,
      script: 'Indo-Pak Naskh',
      publisher: 'تاج کمپنی لمیٹڈ',
      description: 'برصغیر پاک و ہند کا معروف ترین 16 سطری مصحف جو صدیوں سے حفظ قرآن اور تلاوت کے لیے مستعمل ہے۔',
      downloadUrl: 'https://archive.org/download/quran-16-lines-taj/Quran-16-Lines-Taj.pdf',
      features: ['16 سطری کشادہ متن', 'خوبصورت حواشی', 'رکوعات کی واضح تقسیم']
    },
    {
      id: 'madani_uthmani',
      title: 'مصحف المدینۃ المنورۃ (عثمانی رسم الخط - 15 سطری)',
      titleEnglish: 'Madani Uthmani Mushaf (King Fahd Complex)',
      lines: 15,
      totalPages: 604,
      script: 'Uthmani Naskh',
      publisher: 'مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة',
      description: 'مسجد حرام اور مسجد نبوی کا مستند ترین سرکاری عثمانی رسم الخط جو عالمی سطح پر مروج ہے۔',
      downloadUrl: 'https://archive.org/download/quran-madani-604/Madani-Mushaf-604.pdf',
      features: ['مستند ترین عثمانی رسم الخط', '604 صفحات کی معیاری تقسیم', 'حرمین شریفین کا مصحف']
    },
    {
      id: 'tajweed_color',
      title: 'مصحف التجوید الملون (رنگین تجویدی مصحف)',
      titleEnglish: 'Color-Coded Tajweed Quran',
      lines: 15,
      totalPages: 604,
      script: 'Tajweed Uthmani',
      publisher: 'دار المعرفہ دمشق',
      description: 'تجوید کے قواعد (ادغام، اخفاء، قلقلہ، مدات و غنہ) کو رنگوں کی مدد سے آسان بنانے والا بین الاقوامی تجویدی مصحف۔',
      downloadUrl: 'https://archive.org/download/quran-tajweed-color/Tajweed-Quran-Color.pdf',
      features: ['رنگین تجویدی علامات', 'تجوید کے آسان اصول', 'صحیح مخارج کی رہنمائی']
    },
    {
      id: 'classic_13line',
      title: '13 سطری قدیم مصحف (13-Line Classic Mushaf)',
      titleEnglish: '13-Line Classic Bold Mushaf',
      lines: 13,
      totalPages: 848,
      script: 'Indo-Pak Bold',
      publisher: 'قدیم کتب خانہ کراچی',
      description: 'بزرگوں اور کمزور بینائی والے افراد کے لیے بڑے اور موٹے حروف والا 13 سطری پرسکون مصحف۔',
      downloadUrl: 'https://archive.org/download/quran-13-lines/Quran-13-Lines.pdf',
      features: ['بڑے جلی حروف', 'آسان قراءت', 'موٹا خط']
    }
  ];


  // 6. BUILT-IN OFFLINE CACHED SURAHS
  const CORE_OFFLINE_VERSES = {
    1: [
      { number: 1, numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے', english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', tafsir: 'یہ تسمیہ تمام سورتوں کے شروع میں برکت کے لیے ہے سوائے سورۃ التوبہ کے۔' },
      { number: 2, numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urdu: 'سب طرح کی تعریف خدا ہی کو (سزاوار) ہے جو تمام مخلوقات کا پروردگار ہے', english: '[All] praise is [due] to Allah, Lord of the worlds -', tafsir: 'الحمدللہ تمام نعمتوں اور صفاتِ کمال کا اعتراف ہے۔ رب العالمین سے مراد تمام جہانوں کا تنہا خالق اور رازق ہے۔' },
      { number: 3, numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'بڑا مہربان نہایت رحم والا', english: 'The Entirely Merciful, the Especially Merciful,', tafsir: 'رحمن عام رحمت والے کو کہتے ہیں جو دنیا میں سب پر ہے، اور رحیم خاص رحمت والے کو جو آخرت میں مومنین کے لیے ہے۔' },
      { number: 4, numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', urdu: 'انصاف اور جزا کے دن کا مالک و حاکم', english: 'Sovereign of the Day of Recompense.', tafsir: 'یوم الدین سے مراد حساب اور بدلے کا دن یعنی قیامت ہے۔ اس دن اللہ کے سوا کسی کی کوئی بادشاہی نہ ہوگی۔' },
      { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urdu: '(اے پروردگار!) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں', english: 'It is You we worship and You we ask for help.', tafsir: 'یہ توحیدِ عبادت اور توحیدِ استعانت کا خلاصہ ہے۔ غیر اللہ کی عبادت اور غیر اللہ سے غائبانہ مدد کا شرک سے اعلانِ برات ہے۔' },
      { number: 6, numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urdu: 'ہم کو سیدھے اور سچے راستے پر چلا', english: 'Guide us to the straight path -', tafsir: 'صراط مستقیم سے مراد اسلام، قرآن اور نبی کریم ﷺ اور صحابہ کرام کا راستہ ہے۔' },
      { number: 7, numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urdu: 'ان لوگوں کے راستے جن پر تو نے انعام فرمایا، نہ ان کے جن پر غضب ہوا اور نہ گمراہوں کے', english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', tafsir: 'انعام یافتہ لوگ انبیاء، صدیقین، شہداء اور صالحین ہیں۔ مغضوب علیہم سے مراد یہودی جنہوں نے حق جان کر چھوڑا اور ضالین سے مراد عیسائی جنہوں نے بغیر علم کے گمراہی اختیار کی۔' }
    ],
    112: [
      { number: 6222, numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', urdu: 'آپ فرما دیجیے کہ وہ اللہ ایک ہے', english: 'Say, "He is Allah, [who is] One,', tafsir: 'یہ توحید خالص کا اعلان ہے، اللہ اپنی ذات، صفات اور افعال میں یکتا و لاشریک ہے۔' },
      { number: 6223, numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', urdu: 'اللہ بے نیاز اور سب کا سہارا ہے', english: 'Allah, the Eternal Refuge.', tafsir: 'الصمد وہ ہستی ہے جس کی طرف تمام مخلوق اپنی حاجات میں رجوع کرتی ہے اور وہ خود ہر چیز سے بے پرواہ ہے۔' },
      { number: 6224, numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', urdu: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے', english: 'He neither begets nor is born,', tafsir: 'اس میں شرکِ فی النسب اور عیسائیوں و مشرکین کے عقیدہ ولدیت کی صریح تردید ہے۔' },
      { number: 6225, numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', urdu: 'اور کوئی بھی اس کے برابر و ہمسر نہیں ہے', english: 'Nor is there to Him any equivalent."', tafsir: 'کائنات میں کوئی شے نہ اللہ کے مشابہ ہے اور نہ اس کی مثل۔' }
    ],
    113: [
      { number: 6226, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', urdu: 'آپ کہہ دیجیے کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں', english: 'Say, "I seek refuge in the Lord of daybreak', tafsir: 'الفلق صبح کی روشنی یا تمام مخلوقات کو تاریکی سے نکالنے والا رب۔' },
      { number: 6227, numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', urdu: 'ہر اس چیز کی برائی سے جو اس نے پیدا کی', english: 'From the evil of that which He created', tafsir: 'تمام مخلوقات، شیاطین، زہریلے جانور اور شرور سے پناہ کا طلبگار ہونا۔' },
      { number: 6228, numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', urdu: 'اور اندھیری رات کی برائی سے جب وہ چھا جائے', english: 'And from the evil of darkness when it settles', tafsir: 'رات کے اندھیرے میں برائیوں اور شیاطین کا غلبہ بڑھ جاتا ہے۔' },
      { number: 6229, numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', urdu: 'اور گرہوں پر پھونکنے والی جادوگرنیوں کے شر سے', english: 'And from the evil of the blowers in knots', tafsir: 'جادو اور ٹونے کے منفی اثرات سے بچاؤ کی مسنون دعا ہے۔' },
      { number: 6230, numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', urdu: 'اور حسد کرنے والے کی برائی سے جب وہ حسد کرے', english: 'And from the evil of an envier when he envies."', tafsir: 'حاسد اور نظر بد کے نقصان سے بچنے کی حفاظت کا حصار۔' }
    ],
    114: [
      { number: 6231, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', urdu: 'آپ کہیے کہ میں تمام انسانوں کے رب کی پناہ میں آتا ہوں', english: 'Say, "I seek refuge in the Lord of mankind,', tafsir: 'انسانوں کا خالق اور مربی۔' },
      { number: 6232, numberInSurah: 2, text: 'مَلِكِ النَّاسِ', urdu: 'تمام انسانوں کے حقیقی بادشاہ کی', english: 'The Sovereign of mankind,', tafsir: 'قیامت کے دن اور دنیا میں ہر اختیار کا اصل مالک۔' },
      { number: 6233, numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', urdu: 'تمام انسانوں کے معبود برحق کی', english: 'The God of mankind,', tafsir: 'جس کی عبادت اور اطاعت کا ہر انسان مکلف ہے۔' },
      { number: 6234, numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', urdu: 'وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے شیطان کے شر سے', english: 'From the evil of the retreating whisperer -', tafsir: 'الوسواس الخناس وہ شیطان ہے جو اللہ کے ذکر سے بھاگ جاتا ہے اور غفلت میں وسوسہ ڈالتا ہے۔' },
      { number: 6235, numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', urdu: 'جو لوگوں کے سینوں اور دلوں میں وسوسے ڈالتا ہے', english: 'Who whispers into the breasts of mankind -', tafsir: 'دل میں شکوک، شبہات اور گناہوں کی ترغیب پیدا کرتا ہے۔' },
      { number: 6236, numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', urdu: 'خواہ وہ جنات میں سے ہو یا انسانوں میں سے', english: 'From among the jinn and mankind."', tafsir: 'شیطان جنات میں سے بھی ہوتے ہیں اور انسانوں کے روپ میں بھی برائی کی ترغیب دیتے ہیں۔' }
    ]
  };

  return {
    SURAHS,
    JUZ_LIST,
    RECITERS,
    TRANSLATIONS,
    TAFSIRS,
    MUSHAF_EDITIONS,
    CORE_OFFLINE_VERSES
  };
})();
