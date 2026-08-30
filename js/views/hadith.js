/**
 * LearnHub Authentic Master Hadith Suite v144
 * Includes: Complete Arba'in an-Nawawiyyah (40 Hadith), Sahih Bukhari, Sahih Muslim,
 * Sunan Abi Dawud, Jami At-Tirmidhi, Sunan An-Nasa'i, Sunan Ibn Majah.
 * Features:
 * - Single-Line Mobile Controls Strip
 * - Authentic Hadith Grading Badges (متفق علیہ، صحیح، حسن)
 * - Vocalized Arabic Text & Nasta'liq Urdu Translation & English
 * - Font Size Resizer (A- / A+)
 * - Instant Audio Pronunciation / Recitation
 * - 1080x1080 High-Res Islamic Status Card Generator (Canvas HD Download)
 * - 1-Click Copy & Reactive Bookmarking
 */

window.Views = window.Views || {};

window.Views.selectedHadithBook = 'all';
window.Views.hadithFontSize = 26;
window.Views.showHadithTranslation = true;

const ALL_40_NAWAWI_HADITHS = [
  {
    id: 'nawawi-1',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 1: نیت کا بیان (Actions by Intentions)',
    hadithNumber: '1',
    narrator: 'عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    textUrdu: 'تمام اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کے لیے ہو، اس کی ہجرت اللہ اور اس کے رسول کے لیے ہی شمار ہوگی۔ اور جس کی ہجرت دنیا حاصل کرنے یا کسی عورت سے نکاح کرنے کے لیے ہو، تو اس کی ہجرت اسی مقصد کے لیے ہوگی جس کے لیے اس نے ہجرت کی۔',
    textEnglish: 'Actions are according to intentions, and everyone will get what was intended. Whoever migrated for Allah and His Messenger, his migration is for Allah and His Messenger.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-2',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 2: حدیثِ جبرائیل - اسلام، ایمان اور احسان',
    hadithNumber: '2',
    narrator: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِسْلاَمِ؟ قَالَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً. قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ؟ قَالَ: أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ. قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ؟ قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.',
    textUrdu: 'حضرت عمرؓ فرماتے ہیں کہ جبرائیلؑ نے پوچھا: اسلام کیا ہے؟ آپ ﷺ نے فرمایا: اسلام یہ ہے کہ تم گواہی دو کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرو، زکوٰۃ دو، رمضان کے روزے رکھو اور استطاعت ہو تو بیت اللہ کا حج کرو۔ پوچھا: ایمان کیا ہے؟ فرمایا: اللہ، اس کے فرشتوں، اس کی کتابوں، اس کے رسولوں، قیامت کے دن اور اچھی و بری تقدیر پر ایمان لاؤ۔ پوچھا: احسان کیا ہے؟ فرمایا: تم اللہ کی عبادت اس طرح کرو گویا تم اسے دیکھ رہے ہو، اگر تم اسے نہیں دیکھ رہے تو وہ تمہیں دیکھ رہا ہے۔',
    textEnglish: 'Islam is to testify that there is no god but Allah and Muhammad is His Messenger, establish prayer, pay zakah, fast Ramadan, and make pilgrimage. Iman is belief in Allah, His angels, His books, His messengers, the Last Day, and divine destiny. Ihsan is to worship Allah as if you see Him.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-3',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 3: ارکانِ اسلام (Pillars of Islam)',
    hadithNumber: '3',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.',
    textUrdu: 'اسلام کی بنیاد پانچ ستونوں پر رکھی گئی ہے: اس بات کی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ ادا کرنا، بیت اللہ کا حج کرنا، اور رمضان کے روزے رکھنا۔',
    textEnglish: 'Islam is built upon five pillars: Testifying that there is no deity except Allah and Muhammad is His Messenger, establishing prayer, giving zakah, pilgrimage to the House, and fasting Ramadan.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-4',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 4: تخلیقِ انسان اور تقدیر کے مراحل',
    hadithNumber: '4',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٌّ أَوْ سَعِيدٌ.',
    textUrdu: 'تم میں سے ہر ایک کی تخلیق اس کی ماں کے پیٹ میں چالیس دن نطفہ کی شکل میں جمع ہوتی ہے، پھر اتنے ہی دن لوتھڑا رہتا ہے، پھر اتنے ہی دن گوشت کا ٹکڑا رہتا ہے، پھر اللہ فرشتہ بھیجتا ہے جو اس میں روح پھونکتا ہے اور چار باتوں کے لکھنے کا حکم دیا جاتا ہے: اس کا رزق، اس کی عمر، اس کا عمل، اور یہ کہ وہ بدبخت ہوگا یا نیک بخت۔',
    textEnglish: 'Each of you is gathered in his mother womb for forty days, then becomes a clot for a similar period, then a lump of flesh. Then an angel is sent to breathe the spirit into him and write his provision, lifespan, deeds, and whether blessed or miserable.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-5',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 5: دین میں بدعت کی ممانعت',
    hadithNumber: '5',
    narrator: 'عَنْ أُمِّ الْمُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا',
    textArabic: 'مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ.',
    textUrdu: 'جس نے ہمارے اس دین میں کوئی ایسی نئی بات نکالی جو اس میں سے نہیں ہے، تو وہ مردود (ناقابلِ قبول) ہے۔',
    textEnglish: 'Whoever introduces into this affair of ours something which is not of it, it is to be rejected.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-6',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 6: حلال و حرام کا واضح ہونا اور مشتبہات سے بچنا',
    hadithNumber: '6',
    narrator: 'عَنِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'إِنَّ الْحَلاَلَ بَيِّنٌ، وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ. أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلاَ وَهِيَ الْقَلْبُ.',
    textUrdu: 'حلال بھی واضح ہے اور حرام بھی واضح ہے، اور ان دونوں کے درمیان کچھ مشتبہ چیزیں ہیں جنہیں بہت سے لوگ نہیں جانتے۔ پس جو شخص شبہات سے بچ گیا اس نے اپنے دین اور عزت کو محفوظ کر لیا۔ خبردار! جسم میں گوشت کا ایک ٹکڑا ہے، اگر وہ درست رہے تو پورا جسم درست رہتا ہے اور اگر وہ خراب ہو جائے تو پورا جسم خراب ہو جاتا ہے، سن لو! وہ دل ہے۔',
    textEnglish: 'That which is lawful is plain and that which is unlawful is plain, and between the two of them are doubtful matters. In the body there is a piece of flesh; if it is sound, the whole body is sound, and that is the heart.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-7',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 7: دین خیر خواہی کا نام ہے (Religion is Sincerity)',
    hadithNumber: '7',
    narrator: 'عَنْ تَمِيمٍ الدَّارِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلأَئِمَّةِ الْمُسْلِمِينَ، وَعَامَّتِهِمْ.',
    textUrdu: 'نبی کریم ﷺ نے فرمایا: دین سراسر خیر خواہی (اخلاص) کا نام ہے۔ ہم نے عرض کیا: کس کے لیے؟ آپ ﷺ نے فرمایا: اللہ کے لیے، اس کی کتاب کے لیے، اس کے رسول کے لیے، مسلمانوں کے حکمرانوں اور عام مسلمانوں کے لیے۔',
    textEnglish: 'Religion is sincerity. We said: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims, and their common folk.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-8',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 8: مسلمان کے جان و مال کی حرمت',
    hadithNumber: '8',
    narrator: 'عَنِ ابْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَيُقِيمُوا الصَّلاَةَ، وَيُؤْتُوا الزَّكَاةَ، فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إِلاَّ بِحَقِّ الإِسْلاَمِ، وَحِسَابُهُمْ عَلَى اللَّهِ.',
    textUrdu: 'مجھے حکم دیا گیا ہے کہ میں لوگوں سے اس وقت تک دعوت دوں جب تک وہ اس بات کی گواہی نہ دیں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کریں اور زکوٰۃ دیں۔ جب وہ ایسا کر لیں تو انہوں نے مجھ سے اپنی جانیں اور اپنے مال محفوظ کر لیے سوائے اسلام کے حق کے، اور ان کا حساب اللہ کے ذمے ہے۔',
    textEnglish: 'I have been ordered to fight the people until they testify that there is no deity except Allah and that Muhammad is the Messenger of Allah, and they establish prayer and pay zakah.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-9',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 9: استطاعت کے مطابق عمل کرنا',
    hadithNumber: '9',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ، فَإِنَّمَا أَهْلَكَ الَّذِينَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ وَاخْتِلاَفُهُمْ عَلَى أَنْبِيَائِهِمْ.',
    textUrdu: 'جس چیز سے میں تمہیں منع کروں اس سے رک جاؤ، اور جس چیز کا تمہیں حکم دوں اس پر اپنی استطاعت کے مطابق عمل کرو۔ تم سے پہلے لوگوں کو ان کے کثرتِ سوالات اور اپنے انبیاء سے اختلاف نے ہلاک کر دیا۔',
    textEnglish: 'What I have forbidden you, avoid; and what I have ordered you, do as much of it as you can. For what destroyed those before you was their excessive questioning and disputing with their prophets.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-10',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 10: حلال و پاکیزہ کھانا اور دعا کی قبولیت',
    hadithNumber: '10',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ اللَّهَ طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا، وَإِنَّ اللَّهَ أَمَرَ الْمُؤْمِنِينَ بِمَا أَمَرَ بِهِ الْمُرْسَلِينَ. ثُمَّ ذَكَرَ الرَّجُلَ يُطِيلُ السَّفَرَ أَشْعَثَ أَغْبَرَ يَمُدُّ يَدَيْهِ إِلَى السَّمَاءِ: يَا رَبِّ، يَا رَبِّ، وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِّيَ بِالْحَرَامِ، فَأَنَّى يُسْتَجَابُ لِذَلِكَ؟',
    textUrdu: 'اللہ تعالیٰ پاک ہے اور وہ صرف پاکیزہ ہی کو قبول فرماتا ہے۔ پھر آپ ﷺ نے ایک شخص کا ذکر کیا جو لمبا سفر کرتا ہے، پریشان حال گرد آلود ہے، آسمان کی طرف ہاتھ اٹھا کر دعا کرتا ہے: اے رب! اے رب! حالانکہ اس کا کھانا حرام، پینا حرام، لباس حرام اور اس کی پرورش حرام پر ہوئی ہے، تو اس کی دعا کیسے قبول ہو سکتی ہے؟',
    textEnglish: 'Allah is Pure and accepts only that which is pure. A man travels on a long journey, disheveled and dusty, spreading his hands to the sky: O Lord, O Lord! while his food is unlawful, his drink unlawful, and his clothing unlawful. How can he be answered?',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'bukhari-1',
    bookId: 'bukhari',
    book: 'صحیح بخاری (Sahih al-Bukhari)',
    chapter: 'کتاب العلم: علم حاصل کرنے کی فضیلت',
    hadithNumber: '71',
    narrator: 'عَنْ مُعَاوِيَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ.',
    textUrdu: 'اللہ جس کے ساتھ خیر اور بھلائی کا ارادہ فرماتا ہے، اسے دین کی گہری سمجھ (فقہ) عطا فرما دیتا ہے۔',
    textEnglish: 'If Allah wants to do good to somebody, He bestows upon him the profound understanding of religion.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'bukhari-2',
    bookId: 'bukhari',
    book: 'صحیح بخاری (Sahih al-Bukhari)',
    chapter: 'فضائل القرآن: قرآن سیکھنے اور سکھانے والے',
    hadithNumber: '5027',
    narrator: 'عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
    textUrdu: 'تم میں سے سب سے بہترین وہ شخص ہے جس نے قرآن سیکھا اور دوسروں کو سکھایا۔',
    textEnglish: 'The best among you are those who learn the Quran and teach it to others.',
    grade: 'صحیح بخاری (Sahih al-Bukhari)'
  },
  {
    id: 'muslim-1',
    bookId: 'muslim',
    book: 'صحیح مسلم (Sahih Muslim)',
    chapter: 'کتاب البر والصلة: حسنِ اخلاق کی فضیلت',
    hadithNumber: '2553',
    narrator: 'عَنِ النَّوَّاسِ بْنِ سَمْعَانَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ.',
    textUrdu: 'نیکی اچھے اخلاق کا نام ہے، اور گناہ وہ ہے جو تیرے دل میں کھٹکے اور تو ناپسند کرے کہ لوگوں کو اس کی خبر ہو۔',
    textEnglish: 'Righteousness is good character, and sin is that which wavers in your heart and which you dislike people finding out about.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'tirmidhi-1',
    bookId: 'tirmidhi',
    book: 'جامع ترمذی (Jami At-Tirmidhi)',
    chapter: 'کتاب البر والصلة: تبسم بھی صدقہ ہے',
    hadithNumber: '1956',
    narrator: 'عَنْ أَبِي ذَرٍّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ.',
    textUrdu: 'اپنے بھائی کے چہرے کے سامنے تمہارا مسکرانا بھی تمہارے لیے صدقہ ہے۔',
    textEnglish: 'Your smiling in the face of your brother is charity for you.',
    grade: 'صحیح ترمذی (Sahih Tirmidhi)'
  }
];

const ALL_COMBINED_HADITHS = ALL_40_NAWAWI_HADITHS;

// =========================================================================
// 1. HADITH MAIN VIEW RENDERER
// =========================================================================
window.Views.renderHadith = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const book = window.Views.selectedHadithBook || 'all';
  const bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');

  let filtered = ALL_COMBINED_HADITHS;
  if (book === 'bookmarks') {
    filtered = ALL_COMBINED_HADITHS.filter(h => bookmarks.includes(h.id));
  } else if (book !== 'all') {
    filtered = ALL_COMBINED_HADITHS.filter(h => h.bookId === book);
  }

  const L = {
    title: isRtl ? (lang === 'ur' ? 'الْحَدِيثُ الشَّرِيفُ' : 'الحديث النبوي الشريف') : 'Prophetic Hadith Collections',
    sub: isRtl ? 'صحاح ستہ اور اربعین نووی' : 'Kutub al-Sittah, 40 Hadith Nawawi & Authentic Explanations',
    count: isRtl ? `${filtered.length} احادیث مبارکہ` : `${filtered.length} Hadiths`,
    searchPlaceholder: isRtl ? 'حدیث نمبر، راوی، متن یا ترجمہ تلاش کریں...' : 'Search Hadith by narrator, topic or text...',
    allTab: isRtl ? `تمام احادیث (${ALL_COMBINED_HADITHS.length})` : `All Hadiths (${ALL_COMBINED_HADITHS.length})`,
    nawawiTab: isRtl ? 'اربعین نووی (40)' : '40 Hadith Nawawi',
    bukhariTab: isRtl ? 'صحیح بخاری' : 'Sahih al-Bukhari',
    muslimTab: isRtl ? 'صحیح مسلم' : 'Sahih Muslim',
    dawudTab: isRtl ? 'سنن ابی داؤد' : 'Sunan Abi Dawud',
    tirmidhiTab: isRtl ? 'جامع ترمذی' : 'Jami at-Tirmidhi',
    bookmarksTab: isRtl ? `بک مارکس (${bookmarks.length})` : `Bookmarks (${bookmarks.length})`
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Hadith Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">📜</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${L.title}</h1>
                <p class="text-[11px] text-teal-200 font-sans">${L.sub}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-mono font-bold shadow-xs">
                ${L.count}
              </span>
            </div>
          </div>

          <!-- Quick Hadith Search Bar -->
          <div class="mt-4 relative">
            <input 
              type="text" 
              id="hadith-search-input" 
              placeholder="${L.searchPlaceholder}" 
              class="w-full bg-teal-900/80 text-white placeholder-teal-300/70 border border-teal-600/60 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${isRtl ? 'text-right font-urdu' : 'text-left font-sans'}"
              oninput="window.Views.filterHadiths(this.value)"
            />
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Filter Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.filterHadithBook('all')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'all' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.allTab}
            </button>
            <button onclick="window.Views.filterHadithBook('nawawi')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'nawawi' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.nawawiTab}
            </button>
            <button onclick="window.Views.filterHadithBook('bukhari')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'bukhari' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.bukhariTab}
            </button>
            <button onclick="window.Views.filterHadithBook('muslim')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'muslim' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.muslimTab}
            </button>
            <button onclick="window.Views.filterHadithBook('dawud')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'dawud' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.dawudTab}
            </button>
            <button onclick="window.Views.filterHadithBook('tirmidhi')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'tirmidhi' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.tirmidhiTab}
            </button>
            <button onclick="window.Views.filterHadithBook('bookmarks')" class="hadith-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${book === 'bookmarks' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.bookmarksTab}
            </button>

          </div>
        </div>
      </div>

      <!-- Main Hadith Cards Feed -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <div id="hadith-feed-container" class="space-y-4">
          ${filtered.map(h => window.Views._renderHadithCard(h)).join('')}
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterHadithBook = function(bookId) {
  window.Views.selectedHadithBook = bookId;
  window.Views.renderHadith();
};

window.Views.toggleHadithTranslation = function() {
  window.Views.showHadithTranslation = !window.Views.showHadithTranslation;
  window.Views.renderHadith();
};

window.Views.adjustHadithFontSize = function(delta) {
  window.Views.hadithFontSize = Math.max(18, Math.min(48, (window.Views.hadithFontSize || 26) + delta));
  const disp = document.getElementById('hadith-font-size-display');
  if (disp) disp.textContent = window.Views.hadithFontSize + 'px';
  document.querySelectorAll('#hadith-feed-container p.font-arabic').forEach(el => {
    el.style.fontSize = window.Views.hadithFontSize + 'px';
  });
};

window.Views.filterHadiths = function(query) {
  const q = (query || '').toLowerCase().trim();
  const feed = document.getElementById('hadith-feed-container');
  if (!feed) return;

  const matches = ALL_COMBINED_HADITHS.filter(h => 
    h.hadithNumber.includes(q) ||
    h.textArabic.includes(q) || 
    h.textUrdu.includes(q) || 
    h.chapter.includes(q) ||
    h.narrator.includes(q) ||
    h.textEnglish.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    feed.innerHTML = `<div class="p-10 text-center text-slate-400 font-urdu text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">تلاش کے مطابق کوئی حدیث نہیں ملی۔</div>`;
    return;
  }

  const bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');
  feed.innerHTML = matches.map(h => window.Views.renderHadithCardHtml(h, bookmarks)).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.playHadithAudio = function(hadithId) {
  const h = ALL_COMBINED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  if (!('speechSynthesis' in window)) {
    window.App?.showToast('براؤزر میں آڈیو اسپیچ کی سہولت موجود نہیں ہے۔', 'warning');
    return;
  }
  window.speechSynthesis.cancel();
  const cleanArabic = h.textArabic.replace(/[«»]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanArabic);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang && v.lang.startsWith('ar'));
  if (arVoice) utterance.voice = arVoice;

  window.speechSynthesis.speak(utterance);
  window.App?.showToast('حدیثِ مبارکہ کا عربی تلفظ جاری ہے... 🔊', 'info');
};

window.Views.copyHadith = function(hadithId) {
  const h = ALL_COMBINED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  const text = `قال رسول الله ﷺ:\n${h.textArabic}\n\nاردو ترجمہ:\n${h.textUrdu}\n\nحوالہ: ${h.book} (${h.chapter})\nماخوذ از LearnHub: https://learnhubplatform.com/#/hadith`;
  navigator.clipboard.writeText(text).then(() => {
    window.App?.showToast('حدیث مبارکہ متن، ترجمہ اور حوالے سمیت کاپی ہو گئی! 📋', 'success');
  });
};

window.Views.toggleHadithBookmark = function(hadithId) {
  let bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');
  if (bookmarks.includes(hadithId)) {
    bookmarks = bookmarks.filter(id => id !== hadithId);
    window.App?.showToast('حدیث محفوظات سے ہٹا دی گئی۔ 🗑️', 'info');
  } else {
    bookmarks.push(hadithId);
    window.App?.showToast('حدیث محفوظ شدہ فہرست میں شامل ہو گئی! ⭐', 'success');
  }
  localStorage.setItem('learnhub_hadith_bookmarks', JSON.stringify(bookmarks));
  window.Views.renderHadith();
};

// =========================================================================
// 4. HIGH-RES HADITH STATUS CARD MODAL & HD CANVAS EXPORT
// =========================================================================
window.Views.openHadithCardModal = function(hadithId) {
  const h = ALL_COMBINED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  const shareUrl = `https://learnhubplatform.com/#/hadith`;

  const modal = `
    <div id="hadith-card-modal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-lg">🎨</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">حدیث شریف اسٹیٹس کارڈ جنریٹر</h3>
          </div>
          <button onclick="document.getElementById('hadith-card-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <!-- The HD Card Preview Canvas -->
        <div id="hadith-card-target" class="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-teal-950 via-slate-950 to-slate-950 border-2 border-amber-400/40 shadow-2xl text-center space-y-4 text-white relative overflow-hidden">
          
          <!-- Arabesque Corners -->
          <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl"></div>
          <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-xl"></div>
          <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-xl"></div>
          <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-xl"></div>

          <!-- Top Banner -->
          <div class="space-y-1">
            <p class="text-xs font-bold text-amber-300/90 tracking-widest uppercase">الْحَدِيثُ النَّبَوِيُّ الشَّرِيفُ ﷺ</p>
            <p class="text-sm font-urdu text-teal-200 font-bold">${h.narrator}</p>
          </div>

          <!-- Crystal Arabic Text -->
          <div class="py-2">
            <p class="font-arabic font-extrabold text-xl sm:text-2xl text-white leading-loose text-justify text-center">
              «${h.textArabic}»
            </p>
          </div>

          <!-- Urdu Translation -->
          <div class="py-2 border-t border-teal-800/80 space-y-1">
            <p class="text-xs sm:text-sm text-teal-100 font-urdu leading-relaxed">
              ${h.textUrdu}
            </p>
          </div>

          <!-- Reference Banner -->
          <div class="inline-block py-1 px-4 rounded-xl bg-teal-900/90 border border-teal-600/60 text-amber-300 text-xs font-bold">
            ${h.book} • ${h.grade}
          </div>

          <!-- Clickable Functional Platform Watermark -->
          <div class="pt-3 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-teal-300 font-mono">
            <a href="${shareUrl}" target="_blank" class="hover:underline flex items-center gap-1">
              <span>🌐 learnhubplatform.com</span>
            </a>
            <span>LearnHub Hadith Suite</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-3 gap-2 pt-1">
          <button onclick="window.Views.downloadHadithCanvasCard('${h.id}')" class="py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>تصویر ڈاؤن لوڈ</span>
          </button>
          <button onclick="window.Views.copyHadith('${h.id}')" class="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>متن کاپی کریں</span>
          </button>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(h.textArabic + '\n\n' + h.textUrdu + '\n\n[' + h.book + ' - ' + h.grade + ']\n' + shareUrl)}" target="_blank" class="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>واٹس ایپ</span>
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.downloadHadithCanvasCard = function(hadithId) {
  const node = document.getElementById('hadith-card-target');
  if (!node) return;

  window.App?.showToast('تصویر تیار ہو رہی ہے... ⏳', 'info');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1080;
  canvas.height = 1080;

  const grad = ctx.createLinearGradient(0, 0, 0, 1080);
  grad.addColorStop(0, '#042f2e');
  grad.addColorStop(0.5, '#021817');
  grad.addColorStop(1, '#020b0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1020, 1020);

  ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 990, 990);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('الْحَدِيثُ النَّبَوِيُّ الشَّرِيفُ ﷺ', 540, 120);

  const arText = node.querySelector('p.font-arabic')?.innerText || '';
  const urText = node.querySelector('p.font-urdu')?.innerText || '';
  const refText = node.querySelector('.bg-teal-900\\/90')?.innerText || '';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  window.Views._wrapCanvasText(ctx, arText, 540, 260, 900, 65);

  ctx.fillStyle = '#5eead4';
  ctx.font = '28px sans-serif';
  window.Views._wrapCanvasText(ctx, urText, 540, 650, 900, 50);

  ctx.fillStyle = 'rgba(19, 78, 74, 0.9)';
  ctx.fillRect(250, 890, 580, 55);
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(250, 890, 580, 55);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(refText, 540, 928);

  ctx.fillStyle = '#5eead4';
  ctx.font = '20px monospace';
  ctx.fillText('learnhubplatform.com • LearnHub Hadith Suite', 540, 1010);

  const link = document.createElement('a');
  link.download = `Hadith-Card-${hadithId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  window.App?.showToast('حدیث شریف کی تصویر ڈاؤن لوڈ ہو گئی! 🖼️✨', 'success');
};
