/**
 * LearnHub Hadith Sharif Module
 * Complete Arba'in an-Nawawiyyah (All 40 Hadiths of Imam an-Nawawi) + Sahih Bukhari & Muslim
 * with Arabic Uthmani text, complete Urdu translation, English translation,
 * bookmarks, instant search, book filters, and 1-click sharing.
 */

window.Views = window.Views || {};

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
    id: 'nawawi-11',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 11: شک والی چیزوں کو چھوڑ دینا',
    hadithNumber: '11',
    narrator: 'عَنْ أَبِي مُحَمَّدٍ الْحَسَنِ بْنِ عَلِيٍّ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ.',
    textUrdu: 'جو چیز تمہیں شک میں ڈالے اسے چھوڑ دو اور اس چیز کو اختیار کرو جو تمہیں شک میں نہ ڈالے۔',
    textEnglish: 'Leave that which makes you doubt for that which does not make you doubt.',
    grade: 'صحیح ترمذی (Sahih Tirmidhi)'
  },
  {
    id: 'nawawi-12',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 12: فضول باتوں کو ترک کرنا',
    hadithNumber: '12',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ.',
    textUrdu: 'انسان کے اسلام کی اچھائی اور حسن یہ ہے کہ وہ ان باتوں کو چھوڑ دے جو اس کے لیے بے فائدہ اور لا یعنی ہوں۔',
    textEnglish: 'Part of the perfection of a person Islam is his leaving that which is of no concern to him.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'nawawi-13',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 13: بھائی چارہ اور محبتِ ایمانی',
    hadithNumber: '13',
    narrator: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',
    textUrdu: 'تم میں سے کوئی شخص اس وقت تک کامل مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو وہ اپنی ذات کے لیے پسند کرتا ہے۔',
    textEnglish: 'None of you truly believes until he loves for his brother what he loves for himself.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-14',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 14: مسلمان کے خون کی حرمت',
    hadithNumber: '14',
    narrator: 'عَنِ ابْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'لاَ يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ إِلاَّ بِإِحْدَى ثَلاَثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ الْمُفَارِقُ لِلْجَمَاعَةِ.',
    textUrdu: 'کسی کلمہ گو مسلمان کا خون بہانا حلال نہیں سوائے تین صورتوں کے: شادی شدہ زناکار، جان کے بدلے جان (قصاص)، اور دین کو چھوڑ کر جماعت سے الگ ہو جانے والا۔',
    textEnglish: 'The blood of a Muslim is not lawful except in three cases: the married adulterer, a life for a life, and the one who abandons his religion and separates from the community.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-15',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 15: اچھی بات کہنا، پڑوسی اور مہمان کی عزت کرنا',
    hadithNumber: '15',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.',
    textUrdu: 'جو شخص اللہ اور یومِ آخرت پر ایمان رکھتا ہے وہ اچھی بات کہے ورنہ خاموش رہے، اور جو شخص اللہ اور آخرت پر ایمان رکھتا ہے وہ اپنے پڑوسی کی عزت کرے، اور جو شخص اللہ اور آخرت پر ایمان رکھتا ہے وہ اپنے مہمان کی تکریم کرے۔',
    textEnglish: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent; and whoever believes in Allah and the Last Day, let him honor his neighbor; and let him honor his guest.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-16',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 16: غصہ نہ کرنا (Do not become angry)',
    hadithNumber: '16',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: أَوْصِنِي. قَالَ: لاَ تَغْضَبْ. فَرَدَّدَ مِرَارًا، قَالَ: لاَ تَغْضَبْ.',
    textUrdu: 'ایک شخص نے نبی کریم ﷺ سے عرض کیا: مجھے کوئی جامع نصیحت فرمائیے۔ آپ ﷺ نے فرمایا: غصہ نہ کیا کرو۔ اس نے بار بار اپنی بات دہرائی، آپ ﷺ نے ہر بار یہی فرمایا: غصہ نہ کیا کرو۔',
    textEnglish: 'A man said to the Prophet: Advise me. He said: Do not become angry. He repeated it several times, and he said: Do not become angry.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  },
  {
    id: 'nawawi-17',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 17: ہر معاملے میں حسن و احسان کا حکم',
    hadithNumber: '17',
    narrator: 'عَنْ شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ.',
    textUrdu: 'اللہ تعالیٰ نے ہر چیز میں احسان اور بھلائی کا حکم لکھا ہے۔ پس جب تم قتل کرو تو اچھے طریقے سے قتل کرو، اور جب تم ذبح کرو تو اچھے طریقے سے ذبح کرو، اور تم میں سے ہر ایک کو چاہیے کہ وہ اپنی چھری کو تیز کر لے اور اپنے ذبیحہ کو آرام پہنچائے۔',
    textEnglish: 'Verily Allah has prescribed proficiency in all things. So if you kill, kill well; and if you slaughter, slaughter well. Let each one of you sharpen his blade and let him spare pain to the animal he slaughters.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-18',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 18: تقویٰ اور حسنِ اخلاق',
    hadithNumber: '18',
    narrator: 'عَنْ أَبِي ذَرٍّ وَمُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.',
    textUrdu: 'جہاں کہیں بھی تم ہو اللہ سے ڈرتے رہو، اور برائی کے بعد نیکی کرو تاکہ وہ برائی کو مٹا دے، اور لوگوں کے ساتھ اچھے اخلاق سے پیش آؤ۔',
    textEnglish: 'Fear Allah wherever you may be, and follow up an evil deed with a good deed which will wipe it out, and behave well towards the people.',
    grade: 'صحیح ترمذی (Sahih Tirmidhi)'
  },
  {
    id: 'nawawi-19',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 19: اللہ کی حفاظت، توکل اور مدد کی دعا',
    hadithNumber: '19',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'يَا غُلاَمُ، إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَإِنِ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتِ الأَقْلاَمُ وَجَفَّتِ الصُّحُفُ.',
    textUrdu: 'اے لڑکے! میں تمہیں چند اہم باتیں سکھاتا ہوں: تم اللہ کے احکام کی حفاظت کرو اللہ تمہاری حفاظت فرمائے گا، تم اللہ کے حقوق کا دھیان رکھو تم اسے اپنے سامنے پاؤ گے، جب مانگو تو صرف اللہ سے مانگو، اور جب مدد طلب کرو تو صرف اللہ سے مدد مانگو۔ اور خوب جان لو کہ اگر تمام لوگ مل کر تمہیں کوئی فائدہ پہنچانا چاہیں تو وہ تمہیں کوئی فائدہ نہیں پہنچا سکتے سوائے اس کے جو اللہ نے تمہارے مقدر میں لکھ دیا ہے، اور اگر وہ سب مل کر تمہیں کوئی نقصان پہنچانا چاہیں تو وہ تمہیں کوئی نقصان نہیں پہنچا سکتے سوائے اس کے جو اللہ نے تمہارے حق میں لکھ دیا ہے، قلم اٹھا لیے گئے اور صحیفے خشک ہو چکے ہیں۔',
    textEnglish: 'Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. If you ask, ask Allah; and if you seek help, seek help from Allah. Know that if the nation were to gather together to benefit you, they could not benefit you except with something Allah had already written for you.',
    grade: 'صحیح ترمذی (Sahih Tirmidhi)'
  },
  {
    id: 'nawawi-20',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 20: حیا اور شرم کی اہمیت (Modesty is part of Faith)',
    hadithNumber: '20',
    narrator: 'عَنْ أَبِي مَسْعُودٍ عُقْبَةَ بْنِ عَمْرٍو الأَنْصَارِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلاَمِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحْيِ فَاصْنَعْ مَا شِئْتَ.',
    textUrdu: 'پہلی نبوتوں کے کلام میں سے جو بات لوگوں تک پہنچی ہے وہ یہ ہے کہ: جب تم میں حیا ہی نہ رہے تو پھر جو چاہے کرو۔',
    textEnglish: 'Among the things that people have found from the words of the previous prophethood was: If you feel no shame, then do as you wish.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  },
  {
    id: 'nawawi-21',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 21: ایمان اور استقامت (Iman and Steadfastness)',
    hadithNumber: '21',
    narrator: 'عَنْ سُفْيَانَ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'قُلْتُ: يَا رَسُولَ اللَّهِ، قُلْ لِي فِي الإِسْلاَمِ قَوْلاً لاَ أَسْأَلُ عَنْهُ أَحَدًا غَيْرَكَ. قَالَ: قُلْ: آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ.',
    textUrdu: 'میں نے عرض کیا: یا رسول اللہ! مجھے اسلام کے بارے میں ایسی جامع بات بتا دیجیے کہ آپ کے بعد مجھے کسی اور سے پوچھنے کی ضرورت نہ رہے۔ آپ ﷺ نے فرمایا: کہو: میں اللہ پر ایمان لایا، پھر اس پر ثابت قدم رہو۔',
    textEnglish: 'I said: O Messenger of Allah, tell me something about Islam which I will not ask of anyone other than you. He said: Say: I believe in Allah, and then be steadfast.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-22',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 22: فرائض کی پابندی سے جنت کا داخلہ',
    hadithNumber: '22',
    narrator: 'عَنْ جَابِرِ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الْحَلاَلَ، وَحَرَّمْتُ الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ.',
    textUrdu: 'ایک شخص نے دریافت کیا: آپ بتائیے کہ اگر میں فرض نمازیں ادا کروں، رمضان کے روزے رکھوں، حلال کو حلال اور حرام کو حرام سمجھوں، اور اس پر کوئی اضافی چیز نہ بڑھاؤں، تو کیا میں جنت میں داخل ہو جاؤں گا؟ آپ ﷺ نے فرمایا: ہاں۔',
    textEnglish: 'A man asked: If I pray the obligatory prayers, fast Ramadan, treat what is lawful as lawful, and unlawful as unlawful, will I enter Paradise? He said: Yes.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-23',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 23: پاکیزگی، نیکی اور ذکر کے فضائل',
    hadithNumber: '23',
    narrator: 'عَنْ أَبِي مَالِكٍ الأَشْعَرِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلآنِ - أَوْ تَمْلأُ - مَا بَيْنَ السَّمَاوَاتِ وَالأَرْضِ، وَالصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ، كُلُّ النَّاسِ يَغْدُو فَبَائِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا.',
    textUrdu: 'پاکیزگی نصف ایمان ہے، "الحمد للہ" ترازو کو بھر دیتا ہے، اور "سبحان اللہ والحمد للہ" آسمانوں اور زمین کے درمیانی خلا کو بھر دیتے ہیں۔ نماز نور ہے، صدقہ دلیل ہے، صبر روشنی ہے، اور قرآن تمہارے حق میں یا تمہارے خلاف حجت ہے۔ ہر انسان صبح اٹھ کر اپنے آپ کو بیچتا ہے، پس یا تو وہ اپنے آپ کو آزاد کرا لیتا ہے یا ہلاک کر دیتا ہے۔',
    textEnglish: 'Purity is half of iman. Alhamdulillah fills the scales, and Subhanallah and Alhamdulillah fill that which is between heaven and earth. Prayer is light, charity is a proof, patience is illumination, and the Quran is an argument for or against you.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-24',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 24: حدیث قدسی - ظلم کی ممانعت اور اللہ کا فضل',
    hadithNumber: '24',
    narrator: 'عَنْ أَبِي ذَرٍّ الْغِفَارِيِّ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فِيمَا رَوَى عَنِ اللَّهِ تَبَارَكَ وَتَعَالَى',
    textArabic: 'يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلاَ تَظَالَمُوا، يَا عِبَادِي كُلُّكُمْ ضَالٌّ إِلاَّ مَنْ هَدَيْتُهُ فَاسْتَهْدُونِي أَهْدِكُمْ، يَا عِبَادِي كُلُّكُمْ جَائِعٌ إِلاَّ مَنْ أَطْعَمْتُهُ فَاسْتَطْعِمُونِي أُطْعِمْكُمْ.',
    textUrdu: 'اللہ تعالیٰ فرماتا ہے: اے میرے بندو! میں نے ظلم کو اپنے اوپر حرام کر رکھا ہے اور تمہارے درمیان بھی اسے حرام قرار دیا ہے، پس آپس میں ایک دوسرے پر ظلم نہ کرو۔ اے میرے بندو! تم سب گمراہ ہو سوائے اس کے جسے میں ہدایت دوں، پس مجھ سے ہدایت مانگو میں تمہیں ہدایت دوں گا۔ اے میرے بندو! تم سب بھوکے ہو سوائے اس کے جسے میں کھانا دوں، پس مجھ سے کھانا مانگو میں تمہیں کھلاؤں گا۔',
    textEnglish: 'O My servants, I have forbidden injustice for Myself and made it forbidden among you, so do not oppress one another. O My servants, all of you are astray except for those I have guided, so seek guidance of Me and I shall guide you.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-25',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 25: صدقہ اور نیک اعمال کے وسیع مفاہیم',
    hadithNumber: '25',
    narrator: 'عَنْ أَبِي ذَرٍّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ، وَفِي بُضْعِ أَحَدِكُمْ صَدَقَةٌ.',
    textUrdu: 'ہر تسبیح (سبحان اللہ کہنا) صدقہ ہے، ہر تکبیر (اللہ اکبر کہنا) صدقہ ہے، ہر تحمید (الحمد للہ کہنا) صدقہ ہے، ہر تہلیل (لا الہ الا اللہ کہنا) صدقہ ہے، نیکی کا حکم دینا صدقہ ہے، برائی سے روکنا صدقہ ہے، اور انسان کا اپنی بیوی سے ازدواجی تعلق قائم کرنا بھی صدقہ ہے۔',
    textEnglish: 'Every declaration of the glorification of Allah is a charity, every declaration of His Greatness is a charity, every praise of Him is a charity, enjoining good is a charity, and forbidding evil is a charity.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-26',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 26: انسان کے جوڑوں کا صدقہ اور صلح کروانا',
    hadithNumber: '26',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'كُلُّ سُلاَمَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ الاِثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَبِكُلِّ خُطْوَةٍ تَمْشِيهَا إِلَى الصَّلاَةِ صَدَقَةٌ، وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ.',
    textUrdu: 'انسان کے ہر جوڑ پر ہر اس دن کا صدقہ واجب ہے جس میں سورج نکلتا ہے: دو لوگوں کے درمیان انصاف کے ساتھ صلح کروانا صدقہ ہے، کسی شخص کو اس کی سواری پر سوار کروانا یا اس کا سامان اٹھا کر سواری پر رکھنا صدقہ ہے، اچھی بات کہنا صدقہ ہے، نماز کی طرف اٹھنے والا ہر قدم صدقہ ہے، اور راستے سے تکلیف دہ چیز کو ہٹانا بھی صدقہ ہے۔',
    textEnglish: 'Every joint of a person must perform a charity on each day that the sun rises: to judge justly between two people is a charity; to help a man with his mount is a charity; every good word is a charity; and removing a harmful object from the road is a charity.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-27',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 27: نیکی اور گناہ کی تعریف',
    hadithNumber: '27',
    narrator: 'عَنِ النَّوَّاسِ بْنِ سَمْعَانَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي نَفْسِكَ، وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ.',
    textUrdu: 'نیکی اچھے اخلاق کا نام ہے، اور گناہ وہ ہے جو تمہارے دل میں کھٹکے اور تم ناپسند کرو کہ لوگوں کو اس کی خبر ہو۔',
    textEnglish: 'Righteousness is good character, and sin is that which wavers in your heart and which you would dislike people to discover.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-28',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 28: سنت کی پیروی اور بدعات سے دوری',
    hadithNumber: '28',
    narrator: 'عَنْ أَبِي نَجِيحٍ الْعِرْبَاضِ بْنِ سَارِيَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ، عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ، وَإِيَّاكُمْ وَمُحْدَثَاتِ الأُمُورِ، فَإِنَّ كُلَّ مُحْدَثَةٍ بِدْعَةٌ، وَكُلَّ بِدْعَةٍ ضَلاَلَةٌ.',
    textUrdu: 'میری سنت اور ہدایت یافتہ خلفائے راشدین کی سنت کو مضبوطی سے تھامے رہو اور اسے دانتوں سے پکڑ لو۔ اور دین میں نئی نئی باتوں سے بچتے رہو، کیونکہ ہر نئی بات بدعت ہے اور ہر بدعت گمراہی ہے۔',
    textEnglish: 'Hold fast to my Sunnah and the Sunnah of the Rightly Guided Caliphs; cling to it with your teeth. Beware of newly invented matters, for every newly-invented matter is an innovation, and every innovation is misguidance.',
    grade: 'صحیح ابوداؤد و ترمذی (Sahih)'
  },
  {
    id: 'nawawi-29',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 29: جنت میں داخل کرنے والے اعمال اور زبان کی حفاظت',
    hadithNumber: '29',
    narrator: 'عَنْ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'أَلاَ أُخْبِرُكَ بِمَلاَكِ ذَلِكَ كُلِّهِ؟ قُلْتُ: بَلَى يَا نَبِيَّ اللَّهِ. فَأَخَذَ بِلِسَانِهِ وَقَالَ: كُفَّ عَلَيْكَ هَذَا. فَقُلْتُ: يَا نَبِيَّ اللَّهِ، وَإِنَّا لَمُؤَاخَذُونَ بِمَا نَتَكَلَّمُ بِهِ؟ فَقَالَ: ثَكِلَتْكَ أُمُّكَ يَا مُعَاذُ، وَهَلْ يَكُبُّ النَّاسَ فِي النَّارِ عَلَى وُجُوهِهِمْ إِلاَّ حَصَائِدُ أَلْسِنَتِهِمْ؟',
    textUrdu: 'آپ ﷺ نے فرمایا: کیا میں تمہیں ان تمام نیکیوں کی جڑ نہ بتا دوں؟ میں نے عرض کیا: کیوں نہیں یا نبی اللہ! آپ ﷺ نے اپنی زبان مبارک کو پکڑا اور فرمایا: اسے قابو میں رکھو۔ میں نے پوچھا: کیا ہم جو گفتگو کرتے ہیں اس پر بھی ہمارا مؤاخذہ ہوگا؟ آپ ﷺ نے فرمایا: معاذ! لوگوں کو جہنم میں اوندھے منہ گرانے والی ان کی زبانوں کی کاٹی ہوئی کھیتیاں (فضول و غلط باتیں) ہی تو ہیں۔',
    textEnglish: 'Shall I not tell you the foundation of all of that? I said: Yes, O Prophet of Allah. So he took hold of his tongue and said: Restrain this. Are we held accountable for what we speak with it? He said: Does anything topple people on their faces into Hellfire other than the harvests of their tongues?',
    grade: 'صحیح ترمذی (Sahih Tirmidhi)'
  },
  {
    id: 'nawawi-30',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 30: حدودِ الٰہی کی پاسداری',
    hadithNumber: '30',
    narrator: 'عَنْ أَبِي ثَعْلَبَةَ الْخُشَنِيِّ جُرْثُومِ بْنِ نَاشِرٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّ اللَّهَ تَعَالَى فَرَضَ فَرَائِضَ فَلاَ تُضَيِّعُوهَا، وَحَدَّ حُدُودًا فَلاَ تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلاَ تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلاَ تَبْحَثُوا عَنْهَا.',
    textUrdu: 'اللہ تعالیٰ نے کچھ فرائض مقرر کیے ہیں انہیں ضائع نہ کرو، کچھ حدیں باندھی ہیں ان سے آگے نہ بڑھو، کچھ چیزیں حرام کی ہیں ان کا ارتکاب نہ کرو، اور کچھ چیزوں سے بغیر بھولے تمہاری رحمت کے لیے خاموشی اختیار فرمائی ہے، پس ان کی بلاوجہ کھوج میں نہ پڑو۔',
    textEnglish: 'Allah has prescribed duties, so do not neglect them; He has set boundaries, so do not transgress them; He has forbidden things, so do not violate them; and He was silent about things out of mercy for you, not out of forgetfulness, so do not search after them.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'nawawi-31',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 31: زہد اور دنیا سے بے رغبتی',
    hadithNumber: '31',
    narrator: 'عَنْ أَبِي الْعَبَّاسِ سَهْلِ بْنِ سَعْدٍ السَّاعِدِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا فِي أَيْدِي النَّاسِ يُحِبَّكَ النَّاسُ.',
    textUrdu: 'دنیا سے بے رغبتی اختیار کرو اللہ تم سے محبت کرے گا، اور جو کچھ لوگوں کے پاس ہے اس سے بے نیازی برتو لوگ تم سے محبت کریں گے۔',
    textEnglish: 'Renounce the world and Allah will love you, and renounce what is in the hands of people and people will love you.',
    grade: 'صحیح ابن ماجہ (Sahih)'
  },
  {
    id: 'nawawi-32',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 32: نقصان نہ پہنچانا اور نہ بدلے میں نقصان دینا',
    hadithNumber: '32',
    narrator: 'عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'لاَ ضَرَرَ وَلاَ ضِرَارَ.',
    textUrdu: 'نہ کسی کو ابتداءً نقصان پہنچایا جائے اور نہ بدلے میں ناحق نقصان دیا جائے۔',
    textEnglish: 'There should be neither harming nor reciprocating harm.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'nawawi-33',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 33: دعویٰ اور گواہی کا بنیادی قانون',
    hadithNumber: '33',
    narrator: 'عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ لاَدَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ، لَكِنِ الْبَيِّنَةُ عَلَى الْمُدَّعِي، وَالْيَمِينُ عَلَى مَنْ أَنْكَرَ.',
    textUrdu: 'اگر لوگوں کو محض ان کے دعوے کی بنیاد پر سب کچھ دے دیا جائے تو لوگ دوسروں کے مال اور خون کے دعوے دار بن بیٹھیں گے، لیکن دلیل و گواہی دعویٰ کرنے والے کے ذمے ہے اور قسم انکار کرنے والے پر ہے۔',
    textEnglish: 'Were people to be given according to their claims, men would claim the wealth and lives of others. But the proof is on the claimant, and the oath is on the one who denies.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'nawawi-34',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 34: برائی کو ہاتھ، زبان یا دل سے روکنا',
    hadithNumber: '34',
    narrator: 'عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الإِيمَانِ.',
    textUrdu: 'تم میں سے جو شخص کوئی برائی دیکھے تو اسے اپنے ہاتھ کی طاقت سے بدل دے، اگر اس کی طاقت نہ ہو تو اپنی زبان سے روکے، اور اگر اس کی بھی طاقت نہ ہو تو اپنے دل میں برا سمجھے، اور یہ ایمان کا سب سے کمزور درجہ ہے۔',
    textEnglish: 'Whosoever of you sees an evil, let him change it with his hand; and if he is not able to do so, then with his tongue; and if he is not able to do so, then with his heart — and that is the weakest of faith.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-35',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 35: اسلامی بھائی چارہ، حسد اور بغض کی ممانعت',
    hadithNumber: '35',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'لاَ تَحَاسَدُوا، وَلاَ تَنَاجَشُوا، وَلاَ تَبَاغَضُوا، وَلاَ تَدَابَرُوا، وَلاَ يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا. الْمُسْلِمُ أَخُو الْمُسْلِمِ: لاَ يَظْلِمُهُ، وَلاَ يَخْذُلُهُ، وَلاَ يَحْقِرُهُ. التَّقْوَى هَاهُنَا - وَيُشِيرُ إِلَى صَدْرِهِ ثَلاَثَ مَرَّاتٍ.',
    textUrdu: 'آپس میں حسد نہ کرو، دھوکے بازی کی قیمتیں نہ بڑھاؤ، بغض نہ رکھو، ایک دوسرے سے منہ نہ پھیرو، اور کسی کے سودے پر سودا نہ کرو، اور اللہ کے بندے اور آپس میں بھائی بھائی بن جاؤ۔ مسلمان مسلمان کا بھائی ہے: نہ اس پر ظلم کرتا ہے، نہ اسے بے یار و مددگار چھوڑتا ہے، اور نہ اسے حقیر سمجھتا ہے۔ تقویٰ یہاں ہے — اور آپ ﷺ نے تین بار اپنے سینۂ مبارک کی طرف اشارہ فرمایا۔',
    textEnglish: 'Do not envy one another, do not inflate prices, do not hate one another, and do not turn your backs on one another. The Muslim is the brother of another Muslim: he does not oppress him, nor does he fail him, nor does he look down upon him. Taqwa is right here (pointing to his chest).',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-36',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 36: مسلمانوں کی پریشانی دور کرنا اور علم کی طلب',
    hadithNumber: '36',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللَّهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ، وَمَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ، وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ، وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.',
    textUrdu: 'جس نے کسی مومن کی دنیا کی پریشانیوں میں سے کوئی پریشانی دور کی، اللہ تعالیٰ قیامت کے دن اس کی پریشانیوں میں سے ایک پریشانی دور فرمائے گا۔ اور جس نے کسی تنگ دست کے لیے آسانی پیدا کی، اللہ تعالیٰ دنیا اور آخرت میں اس کے لیے آسانی پیدا فرمائے گا۔ اور جس نے کسی مسلمان کی پردہ پوشی کی، اللہ دنیا اور آخرت میں اس کی پردہ پوشی فرمائے گا۔ اور اللہ بندے کی مدد میں رہتا ہے جب تک بندہ اپنے بھائی کی مدد میں رہتا ہے۔ اور جو شخص علم کی تلاش میں کسی راستے پر چلے اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
    textEnglish: 'Whoever relieves a believer of a distress from the distresses of this world, Allah will relieve him of a distress from the distresses of the Day of Resurrection. Allah continues to assist a servant so long as the servant is assisting his brother.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'nawawi-37',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 37: نیکیوں اور برائیوں کا اجر و تحریر',
    hadithNumber: '37',
    narrator: 'عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فِيمَا يَرْوِي عَنْ رَبِّهِ تَبَارَكَ وَتَعَالَى',
    textArabic: 'إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ: فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ.',
    textUrdu: 'اللہ تعالیٰ نے نیکیاں اور برائیاں لکھیں، پھر ان کی وضاحت فرمائی: پس جس نے کسی نیکی کا ارادہ کیا لیکن وہ اس پر عمل نہ کر سکا، تو اللہ اپنے پاس اس کے لیے ایک مکمل نیکی لکھ دیتا ہے۔ اور اگر اس نے ارادہ کر کے اس پر عمل بھی کر لیا، تو اللہ اپنے پاس اس کے لیے دس نیکیوں سے لے کر سات سو گنا اور اس سے بھی کئی گنا زیادہ تک اجر لکھ دیتا ہے۔',
    textEnglish: 'Allah has written down the good deeds and the bad deeds. If someone intends a good deed and does not do it, Allah writes it down as a full good deed. And if he intends it and does it, Allah writes it down as ten good deeds up to seven hundred times or much more.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'nawawi-38',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 38: حدیث قدسی - اللہ کے ولی سے دشمنی اور فرائض و نوافل کا قرب',
    hadithNumber: '38',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ كُنْتُ سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَإِنْ سَأَلَنِي لأُعْطِيَنَّهُ، وَلَئِنِ اسْتَعَاذَنِي لأُعِيذَنَّهُ.',
    textUrdu: 'اللہ تعالیٰ فرماتا ہے: جس نے میرے کسی ولی سے دشمنی کی، میں اس کے خلاف اعلانِ جنگ کرتا ہوں۔ اور میرا بندہ کسی چیز کے ذریعے میرا اتنا پسندیدہ قرب حاصل نہیں کرتا جتنا ان فرائض کے ذریعے جو میں نے اس پر فرض کیے ہیں، اور میرا بندہ مسلسل نفل عبادتوں کے ذریعے میرا قرب حاصل کرتا رہتا ہے یہاں تک کہ میں اس سے محبت کرنے لگتا ہوں۔ پس جب میں اس سے محبت کرتا ہوں تو میں اس کا وہ کان بن جاتا ہوں جس سے وہ سنتا ہے، اس کی وہ آنکھ بن جاتا ہوں جس سے وہ دیکھتا ہے، اس کا وہ ہاتھ بن جاتا ہوں جس سے وہ پکڑتا ہے، اور اس کا وہ پاؤں بن جاتا ہوں جس سے وہ چلتا ہے۔ اگر وہ مجھ سے مانگے تو میں اسے ضرور دیتا ہوں، اور اگر وہ میری پناہ چاہے تو میں اسے ضرور پناہ دیتا ہوں۔',
    textEnglish: 'Whosoever shows enmity to someone devoted to Me, I shall be at war with him. My servant draws not near to Me with anything more loved by Me than the religious duties I have enjoined upon him, and My servant continues to draw near to Me with optional works until I love him.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  },
  {
    id: 'nawawi-39',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 39: بھول چوک اور مجبوری کی معافی',
    hadithNumber: '39',
    narrator: 'عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'إِنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي الْخَطَأَ، وَالنِّسْيَانَ، وَمَا اسْتُكْرِهُوا عَلَيْهِ.',
    textUrdu: 'اللہ تعالیٰ نے میری خاطر میری امت سے بھول چوک، غلطی، اور اس کام کا گناہ معاف فرما دیا ہے جس پر انہیں زبردستی مجبور کیا جائے۔',
    textEnglish: 'Allah has pardoned for my nation their mistakes, their forgetfulness, and what they have been forced to do under duress.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'nawawi-40',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حدیث 40: دنیا میں پردیسی یا مسافر کی طرح رہنا',
    hadithNumber: '40',
    narrator: 'عَنِ ابْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ. وَكَانَ ابْنُ عُمَرَ يَقُولُ: إِذَا أَمْسَيْتَ فَلاَ تَنْتَظِرِ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلاَ تَنْتَظِرِ الْمَسَاءَ، وَخُذْ مِنْ صِحَّتِكَ لِمَرَضِكَ، وَمِنْ حَيَاتِكَ لِمَوْتِكَ.',
    textUrdu: 'رسول اللہ ﷺ نے میرے کندھے کو پکڑ کر فرمایا: دنیا میں اس طرح رہو گویا تم کوئی پردیسی ہو یا راہ گزرتے ہوئے مسافر۔ اور حضرت ابن عمرؓ فرمایا کرتے تھے: جب شام ہو جائے تو صبح کا انتظار نہ کرو، اور جب صبح ہو جائے تو شام کا انتظار نہ کرو، اور اپنی تندرستی میں سے اپنی بیماری کے لیے کچھ وقت اور اپنی زندگی میں سے اپنی موت کے لیے کچھ حصہ تیار کر لو۔',
    textEnglish: 'Be in this world as though you were a stranger or a traveler along a path. Ibn Umar used to say: In the evening do not expect to see the morning, and in the morning do not expect to see the evening. Take from your health for your illness, and from your life for your death.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  }
];

const FAMOUS_AUTHENTIC_HADITHS = [
  {
    id: 'fam-1',
    bookId: 'famous',
    category: 'ilm',
    book: 'صحیح بخاری (Sahih Bukhari 5027)',
    chapter: 'فضیلتِ تعلیم و تلاوتِ قرآن',
    hadithNumber: 'مشہور حدیث 1',
    narrator: 'عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
    textUrdu: 'تم میں سے سب سے بہترین اور افضل شخص وہ ہے جس نے خود قرآن مجید سیکھا اور دوسروں کو اس کی تعلیم دی۔',
    textEnglish: 'The best among you are those who learn the Quran and teach it to others.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  },
  {
    id: 'fam-2',
    bookId: 'famous',
    category: 'ilm',
    book: 'صحیح مسلم (Sahih Muslim 2699)',
    chapter: 'طلبِ علم کی عظیم فضیلت اور جنت کی راہ',
    hadithNumber: 'مشہور حدیث 2',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.',
    textUrdu: 'جو شخص علمِ دین حاصل کرنے کی تلاش میں کسی راستے پر چلتا ہے، اللہ تعالیٰ اس کے بدلے اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
    textEnglish: 'Whoever treads a path seeking knowledge therein, Allah makes easy for him a path to Paradise.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'fam-3',
    bookId: 'famous',
    category: 'ilm',
    book: 'سنن ابن ماجہ (Sunan Ibn Majah 224)',
    chapter: 'فرضیتِ علمِ دین',
    hadithNumber: 'مشہور حدیث 3',
    narrator: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.',
    textUrdu: 'علمِ دین حاصل کرنا ہر مسلمان مرد اور عورت پر فرض ہے۔',
    textEnglish: 'Seeking knowledge is a mandatory obligation upon every single Muslim.',
    grade: 'حدیث صحیح (Sahih Hadith)'
  },
  {
    id: 'fam-4',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح بخاری (Sahih Bukhari 10)',
    chapter: 'حقیقی مسلمان اور مہاجر کی پہچان',
    hadithNumber: 'مشہور حدیث 4',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ.',
    textUrdu: 'کامل مسلمان وہ ہے جس کی زبان اور ہاتھ کی ایذا سے دوسرے مسلمان محفوظ رہیں، اور سچا مہاجر وہ ہے جو ان تمام برائیوں کو چھوڑ دے جن سے اللہ نے منع فرمایا ہے۔',
    textEnglish: 'The true Muslim is the one from whose tongue and hand other Muslims are safe, and the true emigrant is the one who abandons what Allah has forbidden.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'fam-5',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'جامع ترمذی (Jami at-Tirmidhi 1956)',
    chapter: 'مسکرانا اور حسنِ سلوک صدقہ ہے',
    hadithNumber: 'مشہور حدیث 5',
    narrator: 'عَنْ أَبِي ذَرٍّ الْغِفَارِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ، وَأَمْرُكَ بِالْمَعْرُوفِ وَنَهْيُكَ عَنِ الْمُنْكَرِ صَدَقَةٌ.',
    textUrdu: 'اپنے مسلمان بھائی کے سامنے تمہارا خندہ پیشانی سے مسکرانا بھی تمہارے لیے صدقہ ہے، اور نیکی کا حکم دینا اور برائی سے روکنا بھی صدقہ ہے۔',
    textEnglish: 'Your smiling in the face of your brother is an act of charity for you, and enjoining good and forbidding evil is charity.',
    grade: 'حدیث حسن (Hasan Sahih)'
  },
  {
    id: 'fam-6',
    bookId: 'famous',
    category: 'dua',
    book: 'صحیح بخاری (Sahih Bukhari 6682)',
    chapter: 'زبان پر ہلکے اور میزان میں بھاری کلمات',
    hadithNumber: 'مشہور حدیث 6',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.',
    textUrdu: 'دو کلمے ایسے ہیں جو زبان پر بولنے میں انتہائی ہلکے، نیکیوں کے ترازو (میزان) میں بہت بھاری اور رحمٰن کو بے حد پیارے ہیں: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ"۔',
    textEnglish: 'Two phrases are light on the tongue, extremely heavy on the scales of deeds, and beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil Azeem.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'fam-7',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'جامع ترمذی (Jami at-Tirmidhi 1924)',
    chapter: 'مخلوقِ خدا پر رحم و شفقت',
    hadithNumber: 'مشہور حدیث 7',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ.',
    textUrdu: 'رحم کرنے والوں پر رحمن رحم فرماتا ہے۔ تم زمین والوں پر رحم کرو، آسمان والا (اللہ تعالیٰ) تم پر رحم فرمائے گا۔',
    textEnglish: 'Those who show mercy will be shown mercy by the Most Merciful. Show mercy to those on earth, and the One in the heavens will show mercy to you.',
    grade: 'حدیث صحیح (Sahih Hadith)'
  },
  {
    id: 'fam-8',
    bookId: 'famous',
    category: 'dua',
    book: 'صحیح مسلم (Sahih Muslim 408)',
    chapter: 'نبی کریم ﷺ پر درود شریف بھیجنے کی فضیلت',
    hadithNumber: 'مشہور حدیث 8',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ صَلَّى عَلَيَّ صَلاَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا.',
    textUrdu: 'جس شخص نے مجھ پر ایک مرتبہ درود بھیجا، اللہ تعالیٰ اس کے بدلے اس پر دس رحمتیں نازل فرماتا ہے۔',
    textEnglish: 'Whoever sends blessings upon me once, Allah will send ten blessings upon him in return.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'fam-9',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'مؤطا امام مالک (Muwatta Malik 1614)',
    chapter: 'مکارمِ اخلاق کی تکمیل',
    hadithNumber: 'مشہور حدیث 9',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ.',
    textUrdu: 'بیشک مجھے اس لیے مبعوث فرمایا گیا ہے تاکہ میں اعلیٰ اور بہترین اخلاق کی تکمیل کروں۔',
    textEnglish: 'Indeed, I was sent only to perfect honorable moral character.',
    grade: 'حدیث صحیح (Sahih Hadith)'
  },
  {
    id: 'fam-10',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح بخاری (Sahih Bukhari 5997)',
    chapter: 'بے رحمی سے ممانعت',
    hadithNumber: 'مشہور حدیث 10',
    narrator: 'عَنْ جَرِيرِ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ.',
    textUrdu: 'جو شخص انسانوں پر رحم نہیں کرتا، اللہ تعالیٰ بھی اس پر رحم نہیں فرماتا۔',
    textEnglish: 'He who does not show mercy to people, Allah will not show mercy to him.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'fam-11',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح بخاری (Sahih Bukhari 5304)',
    chapter: 'یتیم کی کفالت اور جنت میں قربِ مصطفیٰ ﷺ',
    hadithNumber: 'مشہور حدیث 11',
    narrator: 'عَنْ سَهْلِ بْنِ سَعْدٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى، وَفَرَّجَ بَيْنَهُمَا شَيْئًا.',
    textUrdu: 'رسول اللہ ﷺ نے ارشاد فرمایا: میں اور یتیم کی پرورش و کفالت کرنے والا جنت میں اس طرح قریب ہوں گے، اور آپ ﷺ نے شہادت کی اور بیچ کی انگلی سے اشارہ فرما کر ان کے درمیان معمولی فاصلہ کیا۔',
    textEnglish: 'I and the caretaker of an orphan will be in Paradise like this, and he indicated with his index and middle fingers, parting them slightly.',
    grade: 'صحیح بخاری (Sahih Bukhari)'
  },
  {
    id: 'fam-12',
    bookId: 'famous',
    category: 'dua',
    book: 'جامع ترمذی (Jami at-Tirmidhi 3383)',
    chapter: 'افضل ترین ذکر اور بہترین دعا',
    hadithNumber: 'مشہور حدیث 12',
    narrator: 'عَنْ جَابِرِ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُمَا',
    textArabic: 'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ، وَأَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ.',
    textUrdu: 'سب سے افضل اور بلند ترین ذکر "لَا إِلٰهَ إِلَّا اللَّهُ" ہے، اور سب سے بہترین دعا "الْحَمْدُ لِلَّهِ" ہے۔',
    textEnglish: 'The best remembrance of Allah is La ilaha illallah, and the best supplication is Alhamdulillah.',
    grade: 'حدیث حسن (Hasan Hadith)'
  },
  {
    id: 'fam-13',
    bookId: 'famous',
    category: 'dua',
    book: 'جامع ترمذی (Jami at-Tirmidhi 2969)',
    chapter: 'دعا ہی اصل عبادت ہے',
    hadithNumber: 'مشہور حدیث 13',
    narrator: 'عَنِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ، ثُمَّ قَرَأَ: ﴿وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ﴾.',
    textUrdu: 'دعا ہی درحقیقت اصل عبادت کا مغز ہے۔ پھر آپ ﷺ نے یہ آیت تلاوت فرمائی: "اور تمہارے رب نے فرمایا: مجھ سے دعا مانگو، میں تمہاری دعا قبول کروں گا"۔',
    textEnglish: 'Supplication is the very essence of worship, then the Prophet recited: And your Lord says, Call upon Me; I will respond to you.',
    grade: 'حدیث صحیح (Sahih Hadith)'
  },
  {
    id: 'fam-14',
    bookId: 'famous',
    category: 'ilm',
    book: 'جامع ترمذی (Jami at-Tirmidhi 2910)',
    chapter: 'قرآن مجید کے ہر حرف پر دس نیکیوں کا اجر',
    hadithNumber: 'مشہور حدیث 14',
    narrator: 'عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا، لاَ أَقُولُ الم حَرْفٌ، وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيمٌ حَرْفٌ.',
    textUrdu: 'جس نے کتاب اللہ کا ایک حرف تلاوت کیا، اس کے لیے ایک نیکی ہے اور ہر نیکی کا بدلہ دس گنا ہے۔ میں یہ نہیں کہتا کہ "الم" ایک حرف ہے، بلکہ الف ایک حرف ہے، لام ایک حرف ہے اور میم ایک حرف ہے۔',
    textEnglish: 'Whoever recites a single letter from the Book of Allah will receive one reward, and each reward is multiplied by ten. I do not say that Alif-Lam-Meem is one letter, but Alif is a letter, Lam is a letter, and Meem is a letter.',
    grade: 'حدیث صحیح (Sahih Hadith)'
  },
  {
    id: 'fam-15',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح مسلم (Sahih Muslim 101)',
    chapter: 'دھوکہ دہی اور ملاوٹ کی ممانعت',
    hadithNumber: 'مشہور حدیث 15',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا.',
    textUrdu: 'جس نے ہمارے ساتھ دھوکہ دہی، فریب یا ملاوٹ کی، اس کا ہم سے کوئی تعلق نہیں ہے۔',
    textEnglish: 'Whoever cheats, deceives or defrauds us is not one of us.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'fam-16',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح مسلم (Sahih Muslim 2999)',
    chapter: 'مومن کا ہر معاملہ سراسر خیر اور صبر و شکر ہے',
    hadithNumber: 'مشہور حدیث 16',
    narrator: 'عَنْ صُهَيْبٍ الرُّومِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.',
    textUrdu: 'مومن کا معاملہ بھی کتنا عجیب و لائقِ رشک ہے! اس کا ہر حال سراسر خیر ہی خیر ہے۔ اگر اسے کوئی خوشی اور آسائش ملے تو وہ اللہ کا شکر ادا کرتا ہے تو یہ اس کے لیے خیر بن جاتا ہے، اور اگر اسے کوئی تکلیف یا دکھ پہنچے تو وہ صبر کرتا ہے تو یہ بھی اس کے لیے خیر اور اجر بن جاتا ہے۔',
    textEnglish: 'How wonderful is the affair of the believer, for all of it is good, and that applies to no one except the believer: If prosperity reaches him, he gives thanks and that is good for him; and if adversity strikes him, he endures patiently and that is good for him.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'fam-17',
    bookId: 'famous',
    category: 'ilm',
    book: 'صحیح مسلم (Sahih Muslim 1631)',
    chapter: 'انسان کے مرنے کے بعد باقی رہنے والے تین صدقات',
    hadithNumber: 'مشہور حدیث 17',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ.',
    textUrdu: 'جب انسان فوت ہو جاتا ہے تو اس کے اعمال کا سلسلہ منقطع ہو جاتا ہے سوائے تین چیزوں کے: صدقۂ جاریہ، وہ نفع بخش علم جس سے لوگ فائدہ اٹھاتے رہیں، اور نیک و صالح اولاد جو اس کے لیے مغفرت کی دعا کرے۔',
    textEnglish: 'When a human being dies, all their deeds cease except for three: Continuous charity (Sadaqah Jariyah), beneficial knowledge from which people benefit, or a righteous child who prays for them.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  },
  {
    id: 'fam-18',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح بخاری (Sahih Bukhari 6464)',
    chapter: 'اللہ کو محبوب ترین دائمی عمل',
    hadithNumber: 'مشہور حدیث 18',
    narrator: 'عَنْ أُمِّ الْمُؤْمِنِينَ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا',
    textArabic: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.',
    textUrdu: 'اللہ تعالیٰ کے نزدیک سب سے پسندیدہ عمل وہ ہے جس پر مداومت (ہمیشگی) کی جائے اگرچہ وہ مقدار میں تھوڑا ہی ہو۔',
    textEnglish: 'The most beloved deeds to Allah are those that are performed consistently, even if they are few.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'fam-19',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح بخاری (Sahih Bukhari 69)',
    chapter: 'آسانی پیدا کرنے کا حکم',
    hadithNumber: 'مشہور حدیث 19',
    narrator: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا.',
    textUrdu: 'لوگوں کے لیے آسانیاں پیدا کرو اور تنگی و سختی میں نہ ڈالو، خوشخبریاں سناؤ اور متنفر و بیزار نہ کرو۔',
    textEnglish: 'Make things easy and do not make them difficult, bring good tidings and do not push people away.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'fam-20',
    bookId: 'famous',
    category: 'akhlaq',
    book: 'صحیح مسلم (Sahih Muslim 1893)',
    chapter: 'نیکی کی رہنمائی کرنے والے کا ثواب',
    hadithNumber: 'مشہور حدیث 20',
    narrator: 'عَنْ أَبِي مَسْعُودٍ الأَنْصَارِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ.',
    textUrdu: 'جس شخص نے کسی نیکی اور بھلائی کی رہنمائی کی، اس کو اس نیکی کرنے والے کے برابر اجر و ثواب ملے گا۔',
    textEnglish: 'Whoever guides someone to a good deed will have a reward similar to the one who performs it.',
    grade: 'صحیح مسلم (Sahih Muslim)'
  }
];

const ALL_COMBINED_HADITHS = [...ALL_40_NAWAWI_HADITHS, ...FAMOUS_AUTHENTIC_HADITHS];
window.ALL_COMBINED_HADITHS = ALL_COMBINED_HADITHS;

window.Views.selectedHadithBook = 'all';

window.Views.renderHadith = async function() {
  const container = document.getElementById('main-content');
  const book = window.Views.selectedHadithBook;
  const bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');

  let filtered = ALL_COMBINED_HADITHS;
  if (book === 'nawawi') {
    filtered = ALL_40_NAWAWI_HADITHS;
  } else if (book === 'famous') {
    filtered = FAMOUS_AUTHENTIC_HADITHS;
  } else if (book === 'ilm') {
    filtered = ALL_COMBINED_HADITHS.filter(h => h.category === 'ilm' || h.chapter.includes('علم') || h.chapter.includes('قرآن'));
  } else if (book === 'akhlaq') {
    filtered = ALL_COMBINED_HADITHS.filter(h => h.category === 'akhlaq' || h.chapter.includes('اخلاق') || h.chapter.includes('رحم'));
  } else if (book === 'dua') {
    filtered = ALL_COMBINED_HADITHS.filter(h => h.category === 'dua' || h.chapter.includes('دعا') || h.chapter.includes('ذکر') || h.chapter.includes('درود'));
  } else if (book === 'bookmarks') {
    filtered = ALL_COMBINED_HADITHS.filter(h => bookmarks.includes(h.id));
  }

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 font-urdu w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Hadith Hero Banner -->
      <div class="bg-gradient-to-r from-amber-800 via-amber-950 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/40">
        <div class="relative z-10 space-y-3 text-right">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold font-urdu">
            <span>✨ صحیح بخاری، صحیح مسلم، سنن اربعہ و اربعین نووی</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold font-urdu">جامع ذخیرۂ احادیثِ نبویہ ﷺ</h1>
          <p class="text-xs sm:text-sm text-amber-100/90 max-w-3xl font-urdu leading-relaxed">
            اربعین نووی کی تمام 40 احادیثِ مبارکہ اور صحاحِ ستہ کی مشہور و متفق علیہ احادیث۔ مکمل اعراب، مستند اردو ترجمہ، انگلش مفہوم، 1-کلک کاپی اور بک مارکس کی سہولت کے ساتھ۔
          </p>

          <!-- Search Bar -->
          <div class="pt-2 max-w-lg w-full">
            <div class="relative">
              <input 
                type="text" 
                id="hadith-search-input" 
                oninput="window.Views.filterHadiths(this.value)" 
                placeholder="حدیث نمبر، راوی، متن یا اردو ترجمہ تلاش کریں..." 
                class="w-full bg-white/10 backdrop-blur border border-white/25 text-white placeholder-amber-200/70 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-4 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-urdu text-right"
              />
              <i data-lucide="search" class="w-4 h-4 text-amber-300 absolute right-3.5 top-3 sm:top-3.5"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Book Filter Tabs (Smooth Horizontal Touch Scrolling on Mobile/Tablet) -->
      <div class="flex items-center gap-2 overflow-x-auto flex-nowrap pb-2 border-b border-slate-200 dark:border-slate-800 font-urdu scrollbar-none w-full" style="-webkit-overflow-scrolling: touch;">
        <button onclick="window.Views.filterHadithBook('all')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'all' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>🌟 تمام احادیث (${ALL_COMBINED_HADITHS.length})</span>
        </button>
        <button onclick="window.Views.filterHadithBook('nawawi')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'nawawi' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>📖 اربعین نووی (40 احادیث)</span>
        </button>
        <button onclick="window.Views.filterHadithBook('famous')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'famous' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>✨ مشہور متفق علیہ احادیث</span>
        </button>
        <button onclick="window.Views.filterHadithBook('ilm')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'ilm' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>📚 فضائلِ علم و قرآن</span>
        </button>
        <button onclick="window.Views.filterHadithBook('akhlaq')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'akhlaq' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>💎 حسنِ اخلاق و معاملات</span>
        </button>
        <button onclick="window.Views.filterHadithBook('dua')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'dua' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <span>🤲 اذکار و دعائیں</span>
        </button>
        <button onclick="window.Views.filterHadithBook('bookmarks')" class="hadith-tab-btn whitespace-nowrap py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${book === 'bookmarks' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40' : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}">
          <i data-lucide="bookmark" class="w-3.5 h-3.5 ${bookmarks.length > 0 ? 'fill-amber-300' : ''}"></i>
          <span>محفوظ شدہ (${bookmarks.length})</span>
        </button>
      </div>

      <!-- Hadith Feed List -->
      <div id="hadith-feed-container" class="space-y-4 sm:space-y-6">
        ${filtered.length === 0 ? `
          <div class="lh-card p-8 sm:p-12 text-center text-slate-400 font-urdu text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            کوئی حدیث دستیاب نہیں ہے۔
          </div>
        ` : filtered.map(h => window.Views.renderHadithCardHtml(h, bookmarks)).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderHadithCardHtml = function(h, bookmarks = []) {
  const isBookmarked = bookmarks.includes(h.id);
  return `
    <div class="lh-card p-4 sm:p-7 space-y-4 sm:space-y-5 border-r-4 border-r-amber-500 hover:shadow-xl transition relative group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden" id="hadith-card-${h.id}">
      
      <!-- Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="badge bg-amber-500/15 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-400/30 shrink-0 font-mono">${h.hadithNumber}</span>
          <span class="text-slate-300 dark:text-slate-700 text-xs shrink-0">•</span>
          <span class="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate font-urdu">${h.chapter}</span>
        </div>
        
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0" dir="ltr">
          <span class="badge badge-success text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">${h.grade}</span>
          
          <!-- Status Card Generator Button -->
          <button onclick="window.Views.openHadithCardModal('${h.id}')" class="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 transition" title="خوبصورت واٹس ایپ اسٹیٹس کارڈ بنائیں ✨" aria-label="Generate Status Card">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </button>

          <!-- Audio Pronunciation / Recitation -->
          <button onclick="window.Views.playHadithAudio('${h.id}')" class="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition" title="عربی تلفظ سنیں" aria-label="Listen Arabic Audio">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>

          <!-- 1-Click Copy Button -->
          <button onclick="window.Views.copyHadith('${h.id}')" class="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition" title="کاپی کریں" aria-label="Copy Hadith">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>

          <!-- Bookmark Toggle Button -->
          <button onclick="window.Views.toggleHadithBookmark('${h.id}')" class="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 ${isBookmarked ? 'text-amber-500' : 'text-slate-400'}" title="${isBookmarked ? 'بک مارک ہٹائیں' : 'محفوظ کریں'}" aria-label="Toggle Bookmark">
            <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}"></i>
          </button>
        </div>
      </div>

      <!-- Narrator -->
      <div class="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400/90 text-right font-urdu border-b border-dashed border-slate-100 dark:border-slate-800/80 pb-2">
        ${h.narrator}
      </div>

      <!-- Arabic Hadith Text (Vocalized Uthmani / Amiri / Noto Sans Arabic) -->
      <p class="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 text-right leading-loose py-1 sm:py-2 tracking-wide font-arabic break-words" dir="rtl">
        «${h.textArabic}»
      </p>

      <!-- Urdu Translation -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right font-urdu space-y-1">
        <span class="text-xs uppercase font-extrabold text-amber-700 dark:text-amber-400 block mb-1">
          اردو ترجمہ و مفہوم:
        </span>
        <p class="text-xs sm:text-base text-slate-800 dark:text-slate-200 leading-loose font-urdu break-words">${h.textUrdu}</p>
      </div>

      <!-- Book Reference & English Translation -->
      <div class="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-100 dark:border-slate-800/70 font-urdu">
        <span class="text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1">
          <i data-lucide="scroll" class="w-3.5 h-3.5 text-amber-500"></i>
          مصدر: ${h.book}
        </span>
        <span class="text-slate-500 dark:text-slate-400 text-left font-sans text-[11px] sm:text-xs leading-relaxed" dir="ltr">${h.textEnglish}</span>
      </div>

    </div>
  `;
};

window.Views.filterHadithBook = function(bookId) {
  window.Views.selectedHadithBook = bookId;
  window.Views.renderHadith();
};

window.Views.filterHadiths = function(query) {
  const q = query.toLowerCase().trim();
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
    feed.innerHTML = `<div class="lh-card p-8 sm:p-12 text-center text-slate-400 font-urdu text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">تلاش کے مطابق کوئی حدیث نہیں ملی۔</div>`;
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
    window.App.showToast('براؤزر میں آڈیو اسپیچ کی سہولت موجود نہیں ہے۔', 'warning');
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
  window.App.showToast('حدیثِ مبارکہ کا عربی تلفظ جاری ہے... 🔊', 'info');
};

window.Views.copyHadith = function(hadithId) {
  const h = ALL_COMBINED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  const text = `قال رسول الله ﷺ:\n${h.textArabic}\n\nاردو ترجمہ:\n${h.textUrdu}\n\nحوالہ: ${h.book} (${h.chapter})\nماخوذ از LearnHub: https://jamil8655.github.io/learnhub/#/hadith`;
  navigator.clipboard.writeText(text).then(() => {
    window.App.showToast('حدیث مبارکہ متن، ترجمہ اور حوالے سمیت کاپی ہو گئی! 📋', 'success');
  }).catch(() => {
    window.App.showToast('کاپی نہیں ہو سکی', 'warning');
  });
};

window.Views.toggleHadithBookmark = function(hadithId) {
  let bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');
  if (bookmarks.includes(hadithId)) {
    bookmarks = bookmarks.filter(id => id !== hadithId);
    window.App.showToast('حدیث بک مارکس سے ہٹا دی گئی۔', 'info');
  } else {
    bookmarks.push(hadithId);
    window.App.showToast('حدیث محفوظ شدہ فہرست میں شامل ہو گئی! ⭐', 'success');
  }
  localStorage.setItem('learnhub_hadith_bookmarks', JSON.stringify(bookmarks));
  window.Views.renderHadith();
};

window.Views.openHadithCardModal = function(hadithId) {
  const h = ALL_COMBINED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  if (window.MediaEngine && typeof window.MediaEngine.openStatusCardGenerator === 'function') {
    window.MediaEngine.openStatusCardGenerator({
      arabic: h.textArabic,
      translation: h.textUrdu,
      reference: `${h.book} (${h.grade})`,
      title: 'حدیثِ نبوی ﷺ'
    });
  }
};


