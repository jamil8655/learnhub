/**
 * LearnHub Home View & Hero Multi-Lingual Architecture
 * 100% Trilingual localization for English (en - LTR), Urdu (ur - RTL), and Arabic (ar - RTL)
 * Seamlessly integrates with window.I18N.getCurrentLanguage() and window.I18N.t(...)
 */

window.Views = window.Views || {};
window.Views.components = window.Views.components || {};

// 31 Authentic Trilingual Daily Inspirations (1 for each day of the month)
const DAILY_INSPIRATIONS_LIST = [
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: {
      en: 'Indeed, with hardship comes ease.',
      ur: 'بے شک ہر تنگی کے ساتھ آسانی ہے۔',
      ar: 'إن مع العسر والشدة يسراً وفرجاً قريباً من الله تعالى.'
    },
    ref: { en: 'Surah Ash-Sharh: 6', ur: 'سورۃ الشرح: 6', ar: 'سورة الشرح: 6' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: {
      en: 'The best among you are those who learn the Quran and teach it.',
      ur: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
      ar: 'خير الناس وأفضلهم من أقبل على تعلم كتاب الله وتلاوته وتعليمه للناس.'
    },
    ref: { en: 'Sahih al-Bukhari: 5027', ur: 'صحیح بخاری: 5027', ar: 'صحيح البخاري: 5027' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: {
      en: 'And say: My Lord, increase me in knowledge.',
      ur: 'اور دعا کیجیے کہ اے میرے رب! میرے علم میں اضافہ فرما۔',
      ar: 'وقل داعياً ربك ومبتهلاً: يا رب زدني علماً نافعاً وفقهاً في الدين.'
    },
    ref: { en: 'Surah Ta-Ha: 114', ur: 'سورۃ طہٰ: 114', ar: 'سورة طه: 114' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: {
      en: 'Actions are judged solely by intentions.',
      ur: 'اعمال کا دارومدار نیتوں پر ہے۔',
      ar: 'إنما صحة الأعمال وقبولها وكمال أجرها بحسب النية الصالحة لله وحده.'
    },
    ref: { en: 'Sahih al-Bukhari: 1', ur: 'صحیح بخاری: 1', ar: 'صحيح البخاري: 1' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي',
    translation: {
      en: 'So remember Me; I will remember you. And be grateful to Me.',
      ur: 'پس تم مجھے یاد رکھو، میں تمہیں یاد رکھوں گا، اور میرا شکر ادا کرو۔',
      ar: 'فاذكروني بطاعتي وشكري أذكركم برحمتي ومغفرتي وتوفيقي.'
    },
    ref: { en: 'Surah Al-Baqarah: 152', ur: 'سورۃ البقرہ: 152', ar: 'سورة البقرة: 152' },
    link: '#/duas'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: {
      en: 'Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.',
      ur: 'جو شخص علم کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
      ar: 'من سلك سبيلاً يطلب فيه العلم الشرعي يسر الله له طريقاً ممهداً إلى جنات النعيم.'
    },
    ref: { en: 'Sahih Muslim: 2699', ur: 'صحیح مسلم: 2699', ar: 'صحيح مسلم: 2699' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ',
    translation: {
      en: 'And put your trust in the All-Mighty, the Most Merciful.',
      ur: 'اور اس زبردست اور نہایت رحم فرمانے والے پر بھروسہ رکھیں۔',
      ar: 'وفوّض جميع أمورك إلى الله العزيز الذي لا يُغلب، الرحيم بعباده المؤمنين.'
    },
    ref: { en: 'Surah Ash-Shu\'ara: 217', ur: 'سورۃ الشعراء: 217', ar: 'سورة الشعراء: 217' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: {
      en: 'A true Muslim is the one from whose tongue and hands other Muslims are safe.',
      ur: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔',
      ar: 'المسلم الكامل هو من كف أذاه عن الناس فلم يؤذهم بلسانه ولا بيده.'
    },
    ref: { en: 'Sahih al-Bukhari: 10', ur: 'صحیح بخاری: 10', ar: 'صحيح البخاري: 10' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: {
      en: 'Unquestionably, by the remembrance of Allah hearts find ultimate rest.',
      ur: 'سن لو! اللہ کے ذکر ہی سے دلوں کو حقیقی سکون ملتا ہے۔',
      ar: 'ألا بذكر الله وطاعته تسكن النفوس وتطمئن القلوب وتزول الهموم.'
    },
    ref: { en: 'Surah Ar-Ra\'d: 28', ur: 'سورۃ الرعد: 28', ar: 'سورة الرعد: 28' },
    link: '#/duas'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    translation: {
      en: 'Purity and cleanliness are half of faith.',
      ur: 'پاکیزگی اور صفائی نصف ایمان ہے۔',
      ar: 'الطهور والنظافة الحسية والمعنوية نصف الإيمان وشطر أجره العظيم.'
    },
    ref: { en: 'Sahih Muslim: 223', ur: 'صحیح مسلم: 223', ar: 'صحيح مسلم: 223' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    translation: {
      en: 'Indeed, Allah is ever with those who are patient.',
      ur: 'بے شک اللہ تعالیٰ صبر کرنے والوں کے ساتھ ہے۔',
      ar: 'إن الله تعالى مع الصابرين بعونه وتوفيقه ونصره وجزيل ثوابه.'
    },
    ref: { en: 'Surah Al-Baqarah: 153', ur: 'سورۃ البقرہ: 153', ar: 'سورة البقرة: 153' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: {
      en: 'None of you truly believes until he loves for his brother what he loves for himself.',
      ur: 'تم میں سے کوئی مومن نہیں ہو سکتا جب تک کہ وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔',
      ar: 'لا يكتمل إيمان العبد حتى يحب لإخوانه المسلمين من الخير ما يحبه لنفسه.'
    },
    ref: { en: 'Sahih al-Bukhari: 13', ur: 'صحیح بخاری: 13', ar: 'صحيح البخاري: 13' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    translation: {
      en: 'And My mercy encompasses all things in creation.',
      ur: 'اور میری رحمت ہر چیز پر حاوی ہے۔',
      ar: 'ورحمة الله تعالى الواسعة غلبت كل شيء وشملت جميع خلقه في الدنيا والآخرة.'
    },
    ref: { en: 'Surah Al-A\'raf: 156', ur: 'سورۃ الاعراف: 156', ar: 'سورة الأعراف: 156' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ',
    translation: {
      en: 'Fear Allah and remain mindful of Him wherever you may be.',
      ur: 'تم جہاں کہیں بھی رہو، اللہ کا تقویٰ اور ڈر اختیار کرو۔',
      ar: 'راقب الله تعالى واخشَه في السر والعلن وفي كل زمان ومكان.'
    },
    ref: { en: 'Jami` at-Tirmidhi: 1987', ur: 'جامع ترمذی: 1987', ar: 'جامع الترمذي: 1987' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    translation: {
      en: 'And when My servants ask you concerning Me, indeed I am near.',
      ur: 'اور جب میرے بندے آپ سے میرے متعلق پوچھیں تو یقیناً میں بالکل قریب ہوں۔',
      ar: 'وإذا سألك عبادي عني فإني قريب منهم مجيب لدعائهم إذا دعوني بإخلاص.'
    },
    ref: { en: 'Surah Al-Baqarah: 186', ur: 'سورۃ البقرہ: 186', ar: 'سورة البقرة: 186' },
    link: '#/duas'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation: {
      en: 'Smiling in the face of your brother is a charitable deed.',
      ur: 'اپنے بھائی کے سامنے تمہارا مسکرانا بھی صدقہ ہے۔',
      ar: 'إظهار البشاشة والتبسم في وجوه المؤمنين طاعة وأجر صدقة عند الله.'
    },
    ref: { en: 'Jami` at-Tirmidhi: 1956', ur: 'جامع ترمذی: 1956', ar: 'جامع الترمذي: 1956' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ',
    translation: {
      en: 'Is the reward for good anything but good?',
      ur: 'کیا نیکی کا بدلہ نیکی کے سوا کچھ اور ہو سکتا ہے؟',
      ar: 'هل جزاء من أحسن العمل في الدنيا إلا الإحسان بالجنة والرضوان في الآخرة؟'
    },
    ref: { en: 'Surah Ar-Rahman: 60', ur: 'سورۃ الرحمن: 60', ar: 'سورة الرحمن: 60' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: {
      en: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
      ur: 'جو اللہ اور قیامت پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔',
      ar: 'من كان يؤمن بالله واليوم الآخر حق الإيمان فليتكلم بالخير والذكر أو فليمسك عن الشر.'
    },
    ref: { en: 'Sahih al-Bukhari: 6018', ur: 'صحیح بخاری: 6018', ar: 'صحيح البخاري: 6018' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: {
      en: 'Allah does not burden a soul beyond that it can bear.',
      ur: 'اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔',
      ar: 'لا يُحمّل الله تعالى نفساً من التكاليف والأوامر إلا ما تطيقه وتقدر عليه تيسيراً ورحمة.'
    },
    ref: { en: 'Surah Al-Baqarah: 286', ur: 'سورۃ البقرہ: 286', ar: 'سورة البقرة: 286' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'احْفَظِ اللَّهَ يَحْفَظْكَ',
    translation: {
      en: 'Be mindful of Allah and His commandments, and He will protect you.',
      ur: 'تم اللہ کے احکام کی حفاظت کرو، اللہ تمہاری حفاظت فرمائے گا۔',
      ar: 'احفظ حدود الله وأوامره ونواهيه في سائر أحوالك، يحفظك في دينك ودنياك وأهلك.'
    },
    ref: { en: 'Jami` at-Tirmidhi: 2516', ur: 'جامع ترمذی: 2516', ar: 'جامع الترمذي: 2516' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
    translation: {
      en: 'And seek steadfast help through patience and prayer.',
      ur: 'اور صبر اور نماز کے ذریعے اللہ سے مدد طلب کرو۔',
      ar: 'استعينوا على نوائب الدنيا ومشاقها بالصبر الجميل وإقامة الصلاة الخاشعة.'
    },
    ref: { en: 'Surah Al-Baqarah: 45', ur: 'سورۃ البقرہ: 45', ar: 'سورة البقرة: 45' },
    link: '#/prayer-times'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ',
    translation: {
      en: 'The merciful will be shown mercy by the Most Merciful. Show mercy to those on earth.',
      ur: 'رحم کرنے والوں پر رحمان رحم فرماتا ہے، زمین والوں پر رحم کرو آسمان والا تم پر رحم کرے گا۔',
      ar: 'الراحمون يرحمهم الرحمن برحمته الواسعة، فارحموا أهل الأرض جميعاً يرحمكم رب السماء.'
    },
    ref: { en: 'Sunan Abi Dawud: 4941', ur: 'سنن ابی داؤد: 4941', ar: 'سنن أبي داود: 4941' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',
    translation: {
      en: 'Indeed, Allah loves those who do good and act with excellence.',
      ur: 'بے شک اللہ تعالیٰ احسان و نیکی کرنے والوں سے محبت فرماتا ہے۔',
      ar: 'إن الله تعالى يحب عباده الذين يحسنون في عبادتهم لله ومعاملتهم لخلقه.'
    },
    ref: { en: 'Surah Al-Baqarah: 195', ur: 'سورۃ البقرہ: 195', ar: 'سورة البقرة: 195' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    translation: {
      en: 'The most beloved deeds to Allah are those that are consistent, even if small.',
      ur: 'اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو ہمیشہ کیا جائے، اگرچہ تھوڑا ہی ہو۔',
      ar: 'أحب الأعمال الصالحة إلى الله ما داوم عليه صاحبه بثبات واستمرار وإن كان قليلاً.'
    },
    ref: { en: 'Sahih al-Bukhari: 6464', ur: 'صحیح بخاری: 6464', ar: 'صحيح البخاري: 6464' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    translation: {
      en: 'Supplication is the true essence of worship.',
      ur: 'دعا ہی اصل عبادت ہے۔',
      ar: 'الدعاء والتضرع إلى الله هو لب العبادة ومظهر الخضوع التام للخالق جل وعلا.'
    },
    ref: { en: 'Jami` at-Tirmidhi: 3247', ur: 'جامع ترمذی: 3247', ar: 'جامع الترمذي: 3247' },
    link: '#/duas'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: {
      en: 'And whoever fears Allah - He will make for him a way out of every difficulty.',
      ur: 'اور جو اللہ سے ڈرے گا، اللہ اس کے لیے راستے پیدا فرما دے گا۔',
      ar: 'ومن يتق الله بفعل أوامره واجتناب نواهيه يجعل له فرجاً ومخرجاً من كل كرب وضيق.'
    },
    ref: { en: 'Surah At-Talaq: 2', ur: 'سورۃ الطلاق: 2', ar: 'سورة الطلاق: 2' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    translation: {
      en: 'A good and kind word is a charity.',
      ur: 'پاکیزہ اور اچھی بات کہنا بھی صدقہ ہے۔',
      ar: 'الكلام الطيب مع الناس والأمر بالمعروف صدقة عظيمة يثاب عليها المسلم.'
    },
    ref: { en: 'Sahih Muslim: 1009', ur: 'صحیح مسلم: 1009', ar: 'صحیح مسلم: 1009' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    translation: {
      en: 'Our Lord, give us in this world good and in the Hereafter good, and protect us from the Fire.',
      ur: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما۔',
      ar: 'ربنا هب لنا في الحياة الدنيا خيراً وبركة وتوفيقاً، وفي الآخرة الجنة والنجاة من النار.'
    },
    ref: { en: 'Surah Al-Baqarah: 201', ur: 'سورۃ البقرہ: 201', ar: 'سورة البقرة: 201' },
    link: '#/duas'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    translation: {
      en: 'Whoever guides someone to goodness will have a reward similar to the one who performs it.',
      ur: 'جس نے کسی نیکی کی رہنمائی کی، اس کو نیکی کرنے والے جیسا اجر ملے گا۔',
      ar: 'من أرشد غيره إلى عمل صالح أو علم نافع كان له مثل أجر العاملين به دون نقصان.'
    },
    ref: { en: 'Sahih Muslim: 1893', ur: 'صحیح مسلم: 1893', ar: 'صحيح مسلم: 1893' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ',
    translation: {
      en: 'And hasten towards forgiveness from your Lord and a Paradise as wide as the heavens and earth.',
      ur: 'اور اپنے رب کی بخشش اور اس جنت کی طرف تیزی سے دوڑو جس کی وسعت آسمانوں اور زمین جیسی ہے۔',
      ar: 'تسابقوا وسارعوا بالأعمال الصالحة إلى نيل مغفرة الله وجنات عرضها السماوات والأرض.'
    },
    ref: { en: 'Surah Ali \'Imran: 133', ur: 'سورۃ آل عمران: 133', ar: 'سورة آل عمران: 133' },
    link: '#/quran'
  },
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ',
    translation: {
      en: 'Indeed, Allah is gentle and loves gentleness in all matters.',
      ur: 'بے شک اللہ تعالیٰ نرمی فرمانے والا ہے اور تمام معاملات میں نرمی کو پسند فرماتا ہے۔',
      ar: 'إن الله تعالى رفيق بعباده يحب الرفق واللين والحكمة في كل شأن من شؤون الحياة.'
    },
    ref: { en: 'Sahih al-Bukhari: 6927', ur: 'صحیح بخاری: 6927', ar: 'صحيح البخاري: 6927' },
    link: '#/hadith'
  }
];

// Helper to determine the current language accurately
function getHomeCurrentLanguage() {
  if (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') {
    return window.I18N.getCurrentLanguage();
  }
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  const saved = localStorage.getItem('learnhub_language_v1');
  return (saved && ['en', 'ur', 'ar'].includes(saved)) ? saved : 'en';
}

// Active state for Category & Library filters on Home
window.Views._activeHomeCategory = window.Views._activeHomeCategory || 'all';
window.Views._activeHomeBookCategory = window.Views._activeHomeBookCategory || 'all';

// Main Home Render Function
window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = getHomeCurrentLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const arrowForward = isRtl ? '&larr;' : '&rarr;';
  const iconArrow = isRtl ? 'arrow-left' : 'arrow-right';

  // Calculate Today's Automatic Inspiration (Rotating 1-31)
  const now = new Date();
  const dayOfMonth = now.getDate();
  const rawInspiration = DAILY_INSPIRATIONS_LIST[(dayOfMonth - 1) % DAILY_INSPIRATIONS_LIST.length];
  const todayInspiration = {
    icon: rawInspiration.icon,
    arabic: rawInspiration.arabic,
    type: rawInspiration.type[currentLang] || rawInspiration.type.en,
    translation: rawInspiration.translation[currentLang] || rawInspiration.translation.en,
    ref: rawInspiration.ref[currentLang] || rawInspiration.ref.en,
    link: rawInspiration.link
  };

  // Fetch Database resources
  const allCourses = window.DB ? (window.DB.get('courses') || []) : [];
  const courses = allCourses.length > 0 ? allCourses : (await window.API.getCourses({ sort: 'popular' }));
  const instructors = window.DB ? (window.DB.get('instructors') || []).slice(0, 4) : [];
  const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;

  // Retrieve user enrollments if logged in
  let userEnrolledCourses = [];
  if (currentUser && window.DB && typeof window.DB.get === 'function') {
    const enrollments = window.DB.get('enrollments') || [];
    const userEnrollmentCourseIds = enrollments
      .filter(e => e.userId === currentUser.id)
      .map(e => e.courseId);
    userEnrolledCourses = courses.filter(c => userEnrollmentCourseIds.includes(c.id));
  }

  // Retrieve 300+ Classical Books (sample slice for spotlight)
  const allBooks = (window.ISLAMIC_LIBRARY_BOOKS && window.ISLAMIC_LIBRARY_BOOKS.length > 0)
    ? window.ISLAMIC_LIBRARY_BOOKS
    : [
        {
          id: 'bk-taf-01',
          title: 'تفسیر ابن کثیر (جامع تفاسیر القرآن)',
          titleEn: 'Tafseer Ibn Kathir (Comprehensive Quran Commentary)',
          titleArabic: 'تفسير القرآن العظيم لابن كثير',
          author: 'حافظ عماد الدین ابن کثیر رحمہ اللہ',
          authorEn: 'Imam Ibn Kathir (Rahimahullah)',
          category: 'tafseer',
          categoryName: { en: 'Tafseer & Quran Sciences', ur: 'تفاسیر و علوم القرآن', ar: 'التفسير وعلوم القرآن' },
          pages: 3840,
          rating: 5.0,
          readTime: '30h',
          cover: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'bk-had-01',
          title: 'صحیح البخاری (الجامع المسند الصحیح)',
          titleEn: 'Sahih al-Bukhari (The Authentic Collection)',
          titleArabic: 'صحيح البخاري - الجامع المسند الصحيح',
          author: 'امام ابو عبد اللہ محمد بن اسماعیل البخاریؒ',
          authorEn: 'Imam Muhammad al-Bukhari (Rahimahullah)',
          category: 'hadith',
          categoryName: { en: 'Hadith Sciences', ur: 'ذخیرۂ احادیث', ar: 'الحديث وشروحه' },
          pages: 4120,
          rating: 5.0,
          readTime: '40h',
          cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'bk-see-01',
          title: 'الرحیق المختوم (سیرت النبی ﷺ)',
          titleEn: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
          titleArabic: 'الرحيق المختوم في سيرة النبي المأثور',
          author: 'مولانا صفی الرحمن مبارکپوری رحمہ اللہ',
          authorEn: 'Shaykh Safiur Rahman Mubarakpuri',
          category: 'seerah',
          categoryName: { en: 'Prophetic Seerah', ur: 'سیرت النبی ﷺ', ar: 'السيرة والتاريخ' },
          pages: 820,
          rating: 4.9,
          readTime: '12h',
          cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'bk-fiq-01',
          title: 'بلوغ المرام من أدلة الأحکام',
          titleEn: 'Bulugh al-Maram (Evidence of Shariah Rulings)',
          titleArabic: 'بلوغ المرام من أدلة الأحكام لابن حجر',
          author: 'حافظ ابن حجر عسقلانی رحمہ اللہ',
          authorEn: 'Al-Hafidh Ibn Hajar al-Asqalani',
          category: 'fiqh',
          categoryName: { en: 'Fiqh & Rulings', ur: 'فقہ و احکام', ar: 'الفقه وأصوله' },
          pages: 940,
          rating: 4.9,
          readTime: '14h',
          cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=400&q=80'
        }
      ];

  // Retrieve current Salawat count from storage
  const currentSalawatCount = parseInt(localStorage.getItem('learnhub_salawat_count') || '1420', 10);

  // Localized texts object
  const i18n = {
    dailyInspiration: {
      fullStudy: currentLang === 'en' ? 'Full Study' : (currentLang === 'ar' ? 'دراسة كاملة' : 'مکمل مطالعہ کریں'),
      dailyDuas: currentLang === 'en' ? 'Daily Duas' : (currentLang === 'ar' ? 'الأدعية المأثورة' : 'مسنون دعائیں')
    },
    quickRibbon: [
      {
        title: currentLang === 'en' ? 'Tajweed Quran' : (currentLang === 'ar' ? 'تجويد القرآن' : 'تجوید القرآن'),
        subtitle: currentLang === 'en' ? 'All 114 Surahs' : (currentLang === 'ar' ? 'جميع 114 سورة' : 'تمام 114 سورتیں'),
        icon: 'book-open',
        bg: 'bg-emerald-600',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'hover:border-emerald-500',
        link: '#/quran'
      },
      {
        title: currentLang === 'en' ? 'Hadith Library' : (currentLang === 'ar' ? 'المكتبة الحديثية' : 'ذخیرۂ احادیث'),
        subtitle: currentLang === 'en' ? '40 Hadith & Bukhari' : (currentLang === 'ar' ? 'الأربعون والصحيحان' : 'چالیس احادیث و روایات'),
        icon: 'scroll',
        bg: 'bg-amber-500 text-slate-950',
        textColor: 'text-amber-600 dark:text-amber-400',
        borderColor: 'hover:border-amber-500',
        link: '#/hadith'
      },
      {
        title: currentLang === 'en' ? 'Islamic Adventure' : (currentLang === 'ar' ? 'المغامرة الإسلامية' : 'اسلامی ایڈونچر'),
        subtitle: currentLang === 'en' ? '9 Realms & Puzzles' : (currentLang === 'ar' ? '9 عوالم وألغاز ذكية' : '9 جہان و پزلز'),
        icon: 'gamepad-2',
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950',
        textColor: 'text-amber-500 dark:text-amber-300',
        borderColor: 'border-amber-500/40 hover:border-amber-400',
        link: '#/adventure'
      },
      {
        title: currentLang === 'en' ? 'Digital Library' : (currentLang === 'ar' ? 'المكتبة الرقمية' : 'اسلامی کتب خانہ'),
        subtitle: currentLang === 'en' ? '300+ Classical Books' : (currentLang === 'ar' ? '300+ كتاب ومخطوط' : '300+ نایاب اسلامی کتب'),
        icon: 'book',
        bg: 'bg-slate-800 dark:bg-slate-700 text-amber-400',
        textColor: 'text-slate-600 dark:text-slate-300',
        borderColor: 'hover:border-indigo-500',
        link: '#/library'
      }
    ],
    hero: {
      badge: currentLang === 'en'
        ? '✨ Premium Islamic EdTech & Academic Platform'
        : (currentLang === 'ar' ? '✨ المنصة الرائدة للعلوم الشرعية والمعاصرة' : '✨ مستند آن لائن اسلامک لرننگ و اکیڈمک پلیٹ فارم'),
      title: currentLang === 'en'
        ? 'Learn. Grow. <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">Live the Knowledge.</span>'
        : (currentLang === 'ar'
          ? 'تعلّم، وانمُ، <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">وعِش بالعلم النافع.</span>'
          : 'علم حاصل کریں، ترقی پائیں، <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">اور باعمل بنیں۔</span>'),
      subtitle: currentLang === 'en'
        ? 'Structured authentic Islamic education, Holy Quran recitation, Hadith collections, 300+ classical books, interactive sagas, and verifiable digital certificates.'
        : (currentLang === 'ar'
          ? 'تعليم شرعي متكامل، تلاوة وتجويد القرآن الكريم، دواوين الحديث الشريف، أكثر من 300 كتاب تراثي، وشهادات موثقة.'
          : 'مستند اسلامی علوم، تجوید القرآن، ذخیرۂ احادیث، 300+ نایاب کتب، اور کیو آر کوڈ تصدیق شدہ شاہی اسناد حاصل کریں۔'),
      btnDashboard: currentLang === 'en' ? '🎓 My Learning Dashboard' : (currentLang === 'ar' ? '🎓 لوحة التعلم الخاصة بي' : '🎓 میرا لرننگ ڈیش بورڈ'),
      btnAdmin: currentLang === 'en' ? '🛡️ Admin Central Console' : (currentLang === 'ar' ? '🛡️ لوحة الإدارة المركزية' : '🛡️ ایڈمن سنٹرل کنسول'),
      btnSignIn: currentLang === 'en' ? '🔑 Sign In (Student Portal)' : (currentLang === 'ar' ? '🔑 تسجيل الدخول' : '🔑 لاگ اِن پینل'),
      btnRegister: currentLang === 'en' ? '✨ Start Learning' : (currentLang === 'ar' ? '✨ ابدأ التعلم' : '✨ تعلیم شروع کریں (Start Learning)'),
      btnCourses: currentLang === 'en' ? 'Explore Courses' : (currentLang === 'ar' ? 'استكشف الدورات' : 'کورسز دیکھیں (Explore Courses)'),
      btnLibrary: currentLang === 'en' ? 'Explore 300+ Books' : (currentLang === 'ar' ? 'تصفح 300+ كتاب' : '300+ کتب کا مطالعہ کریں'),
      btnAdventure: currentLang === 'en' ? 'Play Adventure Game' : (currentLang === 'ar' ? 'العب المغامرة الإسلامية' : 'ایڈونچر گیم کھیلیں'),
      searchPlaceholder: currentLang === 'en'
        ? 'Search courses, surahs, hadiths, books, or quizzes...'
        : (currentLang === 'ar' ? 'ابحث في الدورات، السور، الأحاديث، الكتب، أو الاختبارات...' : 'کورس، سورت، حدیث یا کوئز تلاش کریں...'),
      searchBtn: currentLang === 'en' ? 'Search' : (currentLang === 'ar' ? 'بحث' : 'تلاش کریں'),
      statSurahs: currentLang === 'en' ? 'Surahs of Quran' : (currentLang === 'ar' ? 'سور القرآن الكريم' : 'مکمل سورتیں'),
      statBooks: currentLang === 'en' ? 'Classical Islamic Books' : (currentLang === 'ar' ? 'الكتب والمراجع المعتمدة' : 'مستند اسلامی کتب'),
      statCourses: currentLang === 'en' ? 'Active Masterclasses' : (currentLang === 'ar' ? 'الدورات الشرعية' : 'جامع کورسز')
    },
    continueSection: {
      title: currentLang === 'en' ? '📖 Continue Your Islamic Journey' : (currentLang === 'ar' ? '📖 تابع مسيرتك التعليمية المباركة' : '📖 اپنی علمی و دینی پیش رفت جاری رکھیں'),
      subtitle: currentLang === 'en' ? 'Resume your enrolled masterclasses and pick up right where you left off.' : (currentLang === 'ar' ? 'استأنف دوراتك المسجل بها وواصل التعلم من حيث توقفت.' : 'اپنے داخلہ شدہ کورسز کا مطالعہ جاری رکھیں جہاں سے آپ نے چھوڑا تھا۔'),
      continueBtn: currentLang === 'en' ? 'Continue Lesson' : (currentLang === 'ar' ? 'متابعة الدرس' : 'سبق پڑھیں'),
      completed: currentLang === 'en' ? 'Completed' : (currentLang === 'ar' ? 'نسبة الإنجاز' : 'مکمل ہوا'),
      noCourses: currentLang === 'en' ? "You haven't enrolled in any courses yet. Start your journey with our free masterclasses!" : (currentLang === 'ar' ? 'لم تسجل في أي دورة بعد. ابدأ رحلتك التعليمية مع دوراتنا المجانية!' : 'آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔ ہمارے مفت کورسز کے ساتھ تعلیم کا آغاز کریں!')
    },
    categories: {
      badge: currentLang === 'en' ? '🌟 Academic Disciplines' : (currentLang === 'ar' ? '🌟 الأقسام العلمية' : '🌟 شعبہ جات و علوم'),
      title: currentLang === 'en' ? 'Key Islamic & Modern Academic Fields' : (currentLang === 'ar' ? 'أقسام العلوم الشرعية والمعاصرة' : 'اسلامی و عصری علوم کے اہم شعبے'),
      viewAll: currentLang === 'en' ? 'Explore All Categories' : (currentLang === 'ar' ? 'عرض جميع الأقسام' : 'تمام شعبے دیکھیں'),
      tabs: [
        { id: 'all', name: currentLang === 'en' ? 'All Courses' : (currentLang === 'ar' ? 'جميع الدورات' : 'تمام کورسز') },
        { id: 'tajweed', name: currentLang === 'en' ? 'Tajweed & Quran' : (currentLang === 'ar' ? 'التجويد والقرآن' : 'تجوید و قرآن') },
        { id: 'hadith', name: currentLang === 'en' ? 'Hadith Sciences' : (currentLang === 'ar' ? 'علوم الحديث' : 'علوم الحدیث') },
        { id: 'fiqh', name: currentLang === 'en' ? 'Fiqh & Shariah' : (currentLang === 'ar' ? 'الفقه والشريعة' : 'فقہ و شریعت') },
        { id: 'seerah', name: currentLang === 'en' ? 'Seerah & History' : (currentLang === 'ar' ? 'السيرة والتاريخ' : 'سیرت و تاریخ') },
        { id: 'arabic', name: currentLang === 'en' ? 'Arabic Language' : (currentLang === 'ar' ? 'اللغة العربية' : 'عربی زبان') }
      ]
    },
    coursesSection: {
      badge: currentLang === 'en' ? '🌟 Featured Masterclasses' : (currentLang === 'ar' ? '🌟 الدورات المميزة' : '🌟 نمایاں کورسز'),
      title: currentLang === 'en' ? 'Comprehensive Online Masterclasses' : (currentLang === 'ar' ? 'دورات شرعية وعلمية متكاملة' : 'جامع آن لائن ماسٹر کلاسز'),
      subtitle: currentLang === 'en'
        ? 'Expert-led curricula under the supervision of authentic scholars with interactive examinations and royal certificates.'
        : (currentLang === 'ar'
          ? 'مناهج دراسية متكاملة بإشراف نخبة من العلماء مع اختبارات وشهادات معتمدة.'
          : 'مستند شیوخ و اساتذہ کے زیرِ نگرانی تیار کردہ مکمل اسباق اور مشقیں۔'),
      viewAll: currentLang === 'en' ? 'View All Courses' : (currentLang === 'ar' ? 'عرض جميع الدورات' : 'تمام کورسز دیکھیں')
    },
    librarySection: {
      badge: currentLang === 'en' ? '📚 Classical Islamic Library' : (currentLang === 'ar' ? '📚 المكتبة التراثية المعتمدة' : '📚 اسلامی کتب خانہ'),
      title: currentLang === 'en' ? '300+ Classical Islamic & Salafi Library Spotlight' : (currentLang === 'ar' ? 'مكتبة التراث الإسلامي الأصيل (300+ كتاب)' : '300+ نایاب اسلامی کتب خانہ و ذخیرۂ سلف'),
      subtitle: currentLang === 'en'
        ? 'Curated tafseers, authentic hadith collections, fiqh, and seerah manuscripts available for online reading & PDF download.'
        : (currentLang === 'ar'
          ? 'موسوعات التفسير، دواوين الحديث، الفقه، السيرة النبوية والعقيدة للقراءة المباشرة والتحميل.'
          : 'تفاسیر، کتبِ حدیث، فقہ، سیرت اور عقیدہ کی مستند کتب آن لائن مطالعہ اور پی ڈی ایف ڈاؤنلوڈ کے لیے دستیاب۔'),
      readOnline: currentLang === 'en' ? 'Read Online' : (currentLang === 'ar' ? 'قراءة أونلاين' : 'آن لائن پڑھیں'),
      downloadPdf: currentLang === 'en' ? 'Download PDF' : (currentLang === 'ar' ? 'تحميل PDF' : 'پی ڈی ایف حاصل کریں'),
      exploreFull: currentLang === 'en' ? 'Explore Full 300+ Books Catalog' : (currentLang === 'ar' ? 'تصفح المكتبة الكاملة (300+ كتاب)' : 'مکمل کتب خانہ دیکھیں (300+ کتب)'),
      pills: [
        { id: 'all', name: currentLang === 'en' ? 'All (300+)' : (currentLang === 'ar' ? 'الكل (300+)' : 'تمام (300+)') },
        { id: 'tafseer', name: currentLang === 'en' ? 'Tafseer' : (currentLang === 'ar' ? 'التفسير' : 'تفاسیر') },
        { id: 'hadith', name: currentLang === 'en' ? 'Hadith' : (currentLang === 'ar' ? 'الحديث' : 'احادیث') },
        { id: 'fiqh', name: currentLang === 'en' ? 'Fiqh' : (currentLang === 'ar' ? 'الفقه' : 'فقہ') },
        { id: 'seerah', name: currentLang === 'en' ? 'Seerah' : (currentLang === 'ar' ? 'السيرة' : 'سیرت') }
      ]
    },
    liveStreams: {
      badge: currentLang === 'en' ? '🕋 24/7 Live Broadcast' : (currentLang === 'ar' ? '🕋 بث حي مباشر 24/7' : '🕋 24/7 لائیو نشریات'),
      title: currentLang === 'en' ? 'Makkah & Madinah Haramain Live Streams' : (currentLang === 'ar' ? 'البث المباشر للحرمين الشريفين' : 'مکہ مکرمہ و مدینہ منورہ لائیو نشریات'),
      subtitle: currentLang === 'en'
        ? '24/7 HD live feeds directly from Masjid al-Haram (Holy Kaaba) and Masjid an-Nabawi (Prophet\'s Mosque).'
        : (currentLang === 'ar'
          ? 'بث مباشر عالي الدقة على مدار الساعة من المسجد الحرام والمسجد النبوي الشريف.'
          : 'مسجد الحرام (کعبہ شریف) اور مسجد نبوی شریف سے براہ راست 24 گھنٹے ایچ ڈی نشریات۔'),
      makkahTitle: currentLang === 'en' ? 'Masjid al-Haram (Makkah Live)' : (currentLang === 'ar' ? 'المسجد الحرام (مكة المكرمة مباشر)' : 'مسجد الحرام (مکہ مکرمہ لائیو)'),
      makkahSub: currentLang === 'en' ? 'Holy Kaaba • Official Saudi Quran TV' : (currentLang === 'ar' ? 'الكعبة المشرفة • قناة القرآن الكريم' : 'کعبہ شریف • لائیو قرآن ٹی وی'),
      madinahTitle: currentLang === 'en' ? 'Masjid an-Nabawi (Madinah Live)' : (currentLang === 'ar' ? 'المسجد النبوي (المدينة المنورة مباشر)' : 'مسجد نبوی (مدینہ منورہ لائیو)'),
      madinahSub: currentLang === 'en' ? 'Prophet\'s Mosque • Saudi Sunnah TV' : (currentLang === 'ar' ? 'الروضة الشريفة • قناة السنة النبوية' : 'روضۂ رسول ﷺ • لائیو سنہ ٹی وی'),
      watchLive: currentLang === 'en' ? 'Watch Full HD Stream' : (currentLang === 'ar' ? 'مشاهدة البث الكامل' : 'مکمل لائیو نشریات دیکھیں'),
      salawatBadge: currentLang === 'en' ? '📿 Interactive Salawat Counter' : (currentLang === 'ar' ? '📿 عداد الصلاة على النبي ﷺ' : '📿 درود شریف کاؤنٹر'),
      salawatTitle: currentLang === 'en' ? 'Send Blessings Upon the Prophet Muhammad ﷺ' : (currentLang === 'ar' ? 'أكثروا من الصلاة على النبي محمد ﷺ' : 'حضور اکرم ﷺ کی بارگاہ میں درود شریف کا ہدیہ پیش کریں'),
      salawatHadith: currentLang === 'en'
        ? '«Whoever sends blessings upon me once, Allah will send blessings upon him tenfold.» (Sahih Muslim)'
        : (currentLang === 'ar'
          ? '«مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللهُ عَلَيْهِ بِهَا عَشْرًا» (صحيح مسلم)'
          : 'رسول اللہ ﷺ نے فرمایا: «جس نے مجھ پر ایک بار درود بھیجا، اللہ تعالیٰ اس پر دس رحمتیں نازل فرمائے گا۔» (صحیح مسلم)'),
      btnSalawat: currentLang === 'en' ? 'Send Salawat +1' : (currentLang === 'ar' ? 'صليت على النبي +1' : 'درود شریف پڑھا +1'),
      salawatCountLabel: currentLang === 'en' ? 'Salawat Sent Globally' : (currentLang === 'ar' ? 'إجمالي الصلوات المسجلة' : 'مجموعی پڑھے گئے درود')
    },
    adventure: {
      badge: currentLang === 'en' ? '🎮 LearnHub Islamic Adventure Saga' : (currentLang === 'ar' ? '🎮 مغامرة ليرن هب الإسلامية' : '🎮 لرن ہب اسلامی ایڈونچر گیم'),
      title: currentLang === 'en' ? 'Where Authentic Knowledge Meets Adventure — Class 1 to Class 10' : (currentLang === 'ar' ? 'ملحمة المغامرة الإسلامية التعليمية — من الصف 1 إلى 10' : 'علم و کھیل کا خوبصورت سنگم — کلاس 1 تا کلاس 10'),
      subtitle: currentLang === 'en'
        ? 'Progressive level maps, interactive puzzles, memory cards, 1v1 arenas, coins, and verifiable royal certificates for grades 1 through 10.'
        : (currentLang === 'ar'
          ? 'منهج متدرج من الصف الأول حتى العاشر، مراحل تفاعلية، بطاقات الذاكرة، منافسات 1v1 وشهادات معتمدة.'
          : 'بچوں کی عمر اور جماعت کے مطابق کلاس 1 سے کلاس 10 تک کے مرحلہ وار لیولز، پزلز، میموری کارڈز، طلائی سکے (Coins) اور انعامات۔'),
      btnPlay: currentLang === 'en' ? '🎮 Play Adventure Saga Now' : (currentLang === 'ar' ? '🎮 العب المغامرة الإسلامية الآن' : '🎮 ایڈونچر میپ کھولیں (Play Game)'),
      card1Title: currentLang === 'en' ? 'Class 1 to 10 Progressive Syllabus' : (currentLang === 'ar' ? 'منهج متدرج من الصف الأول إلى العاشر' : 'کلاس 1 تا کلاس 10 جماعت وار نصاب'),
      card1Desc: currentLang === 'en'
        ? 'Grade-specific stages covering prayer steps, tajweed rules, Seerah stories, and essential daily duas.'
        : (currentLang === 'ar'
          ? 'مراحل مخصصة لكل صف تشمل أركان الصلاة، التجويد، قصص الأنبياء والأدعية اليومية.'
          : 'پہلی تا دسویں کلاس کے بچوں کے لیے مخصوص پزلز، نماز کے ارکان، تجوید، سیرت اور دعاؤں کے مراحل۔'),
      card1Badge: currentLang === 'en' ? 'Classes 1 to 10 • 50+ Levels' : (currentLang === 'ar' ? 'الصفوف 1-10 • أكثر من 50 مرحلة' : 'کلاس 1 تا 10 • 50+ مراحل'),
      card2Title: currentLang === 'en' ? '7 Interactive Mini-Game Modes' : (currentLang === 'ar' ? '7 أنماط لعب وألغاز ذكية' : '7 انٹرایکٹو گیم پلے موڈز'),
      card2Desc: currentLang === 'en'
        ? 'Action-sequence puzzles, memory card matches, word linking, rapid-fire challenges, and rewarding audio effects.'
        : (currentLang === 'ar'
          ? 'ألغاز ترتيب الخطوات، مطابقة بطاقات الذاكرة، ربط الكلمات وتحديات السرعة مع مؤثرات صوتية تفاعلية.'
          : 'ترتیبِ عمل پزل، میموری کارڈ میچ، کلمات کا ربط، تیز رفتار فیصلے اور حقیقی صوتی اثرات۔'),
      card2Badge: currentLang === 'en' ? 'Puzzles • Memory • Sounds' : (currentLang === 'ar' ? 'ألغاز • ذاكرة • أصوات تفاعلية' : 'پزلز • میموری کارڈز • صوتی انعامات'),
      card3Title: currentLang === 'en' ? '1-v-1 Arena Battles & Royal Rewards' : (currentLang === 'ar' ? 'منافسات 1-v-1 ونقاط وشهادات' : 'دوست سے مقابلہ، سکے و اسناد'),
      card3Desc: currentLang === 'en'
        ? 'Challenge friends via room codes, earn gold coins, unlock scholar hints, and receive QR-verifiable certificates.'
        : (currentLang === 'ar'
          ? 'تحدَّ أصدقاءك برمز الغرفة، واجمع النقود الذهبية، وافتح إشارات العلماء واحصل على شهادات موثقة.'
          : 'روم کوڈ کے ذریعے دوستوں کو چیلنج کریں، طلائی سکے (Coins) کمائیں، پاور اپس خریدیں اور شاہی اسناد حاصل کریں۔'),
      card3Badge: currentLang === 'en' ? '1-v-1 Arena • Verifiable Certificates' : (currentLang === 'ar' ? 'ميدان 1-v-1 • شهادات رقمية موثقة' : '1-v-1 میدان • شاہی اسناد')
    },
    faq: {
      badge: currentLang === 'en' ? '❓ Knowledge Base & Support' : (currentLang === 'ar' ? '❓ الأسئلة الشائعة والدعم' : '❓ اکثر پوچھے گئے سوالات'),
      title: currentLang === 'en' ? 'Frequently Asked Questions & Direct Support Desk' : (currentLang === 'ar' ? 'الأسئلة الشائعة ومكتب الدعم المباشر' : 'اکثر پوچھے جانے والے سوالات و براہِ راست رہنمائی'),
      subtitle: currentLang === 'en'
        ? 'Find instant answers to common questions regarding our courses, digital certificates, and platform.'
        : (currentLang === 'ar'
          ? 'إجابات وافية على كافة الاستفسارات المتعلقة بالدورات والشهادات والمنصة.'
          : 'کورسز، اسناد اور تعلیمی نظام سے متعلق اپنے سوالات کے جوابات حاصل کریں۔'),
      items: [
        {
          id: 'faq-1',
          category: 'courses',
          icon: 'book-open',
          q: currentLang === 'en' ? 'Are all Islamic courses and books completely free on LearnHub?' : (currentLang === 'ar' ? 'هل جميع الدورات والكتب الإسلامية مجانية على ليرن هب؟' : 'کیا لرن ہب پر تمام اسلامی کورسز اور کتب بالکل مفت ہیں؟'),
          a: currentLang === 'en'
            ? 'Yes, all foundational Islamic courses, Quran recitation modules, Hadith collections, and 300+ classical library books are 100% free (Fi Sabilillah). Premium specialization tracks may offer optional certificates and advanced instructor mentorship.'
            : (currentLang === 'ar'
              ? 'نعم، جميع الدورات التأسيسية، تعليم التجويد، الأحاديث النبوية، ومكتبة الـ 300+ كتاب متاحة مجاناً 100% لوجه الله تعالى.'
              : 'جی ہاں! تمام بنیادی اسلامی کورسز، تجوید القرآن، ذخیرۂ احادیث، اور 300+ نایاب کتب کا مطالعہ 100% مفت فی سبیل اللہ ہے۔')
        },
        {
          id: 'faq-2',
          category: 'certificates',
          icon: 'award',
          q: currentLang === 'en' ? 'How can I verify my earned digital certificates?' : (currentLang === 'ar' ? 'كيف يمكنني التحقق من صحة الشهادات الصادرة؟' : 'حاصل کردہ شاہی سند کی تصدیق کیسے کی جاتی ہے؟'),
          a: currentLang === 'en'
            ? 'Every certificate issued contains a unique cryptographic serial number and a live QR code. You or any institution can verify authenticity instantly on our public Verification Portal without needing to log in.'
            : (currentLang === 'ar'
              ? 'تحتوي كل شهادة على رقم تسلسلي فريد ورمز QR ذكي يمكن لأي جهة التحقق من صحتها فوراً عبر بوابة التحقق الرسمية.'
              : 'ہر سند کے اوپر ایک منفرد سیریل کوڈ اور کیو آر کوڈ موجود ہوتا ہے جس کی مدد سے ہمارے پبلک پورٹل پر فوری تصدیق کی جا سکتی ہے۔')
        },
        {
          id: 'faq-3',
          category: 'app',
          icon: 'smartphone',
          q: currentLang === 'en' ? 'Can I use LearnHub on mobile phones and offline?' : (currentLang === 'ar' ? 'هل يمكن استخدام ليرن هب عبر الهاتف وبدون إنترنت؟' : 'کیا لرن ہب کو موبائل اور آف لائن استعمال کیا جا سکتا ہے؟'),
          a: currentLang === 'en'
            ? 'Absolutely. LearnHub is built as an ultra-fast Progressive Web App (PWA) and Android APK. You can install it on your Android or iOS device, and downloaded books/notes remain accessible even when offline.'
            : (currentLang === 'ar'
              ? 'بالتأكيد، المنصة مصممة كتطبيق ويب متقدم (PWA) وتطبيق أندرويد يعمل بكفاءة عالية على الهواتف مع دعم التصفح دون إنترنت للمحتوى المحفوظ.'
              : 'بالکل! لرن ہب ایک جدید ترین پروگریسو ویب ایپ (PWA) اور اینڈرائیڈ ایپ ہے جس سے کتب و نوٹس آف لائن بھی پڑھے جا سکتے ہیں۔')
        },
        {
          id: 'faq-4',
          category: 'scholars',
          icon: 'user-check',
          q: currentLang === 'en' ? 'Who are the scholars and instructors behind the courses?' : (currentLang === 'ar' ? 'من هم العلماء والمشايخ المشرفون على المناهج؟' : 'کورسز اور نصاب کن شیوخ و اساتذہ کی زیرِ نگرانی ہیں؟'),
          a: currentLang === 'en'
            ? 'All courses are designed and reviewed by certified scholars and graduates from renowned institutions including Al-Azhar University, Islamic University of Madinah, and leading Islamic seminaries adhering to authentic Quran and Sunnah.'
            : (currentLang === 'ar'
              ? 'المناهج والدورات معدة ومراجعة بدقة من قِبل نخبة من خريجي الجامعات الإسلامية الكبرى كالأزهر الشريف والجامعة الإسلامية بالمدينة المنورة.'
              : 'تمام کورسز اور نصاب جامعہ الازہر، مدینہ یونیورسٹی اور دیگر مستند دینی جامعات کے فارغ التحصیل اور مستند علمائے کرام کے زیرِ نگرانی تیار کیے گئے ہیں۔')
        },
        {
          id: 'faq-5',
          category: 'courses',
          icon: 'gamepad-2',
          q: currentLang === 'en' ? 'How does the Islamic Adventure Saga help children learn?' : (currentLang === 'ar' ? 'كيف تساعد المغامرة الإسلامية الأطفال على التعلم؟' : 'اسلامی ایڈونچر گیم بچوں کو سیکھنے میں کیسے مدد دیتی ہے؟'),
          a: currentLang === 'en'
            ? 'The Adventure Saga transforms Islamic education into an engaging journey with Class 1-10 progression, memory puzzles, action sequencing for prayer steps, sound effects, and rewarding gold coins that motivate daily practice.'
            : (currentLang === 'ar'
              ? 'تحول اللعبة التعلم إلى رحلة مشوقة تناسب الصفوف من 1 إلى 10 عبر ألعاب الذاكرة، ترتيب خطوات الصلاة، والمكافآت التفاعلية التي تحفز الأطفال يومياً.'
              : 'ایڈونچر گیم بچوں کے لیے کلاس 1 تا 10 تک کے تدریجی اسباق، نماز کی ترتیب کے پزلز، میموری گیمز اور طلائی سکوں کے ساتھ سیکھنے کو پرکشش بناتی ہے۔')
        },
        {
          id: 'faq-6',
          category: 'courses',
          icon: 'mic',
          q: currentLang === 'en' ? 'Can I practice Tajweed recitation with audio reciters?' : (currentLang === 'ar' ? 'هل يمكن التدرب على تلاوة القرآن صوتياً؟' : 'کیا تجوید اور قراءت کی آڈیو کے ساتھ مشق کی جا سکتی ہے؟'),
          a: currentLang === 'en'
            ? 'Yes! LearnHub includes multi-Qari audio playback, word-by-word pronunciation highlights, and microphone speech recording tools for tajweed practice.'
            : (currentLang === 'ar'
              ? 'نعم! يتضمن استوديو التجويد تلاوات بأصوات كبار القراء، مع إبراز الكلمات كلمة بكلمة وميزة التسجيل الصوتي للتدريب.'
              : 'جی ہاں! لرن ہب میں مصر و حرمین شریفین کے ممتاز قراء کی آڈیو تلاوت، لفظ بہ لفظ تجوید، اور تلفظ کی مشق کے لیے مائیکروفون کی سہولت شامل ہے۔')
        },
        {
          id: 'faq-7',
          category: 'app',
          icon: 'shield-check',
          q: currentLang === 'en' ? 'Is my learning progress automatically saved on the cloud?' : (currentLang === 'ar' ? 'هل يُحفظ تقدمي الدراسي تلقائياً على السحابة؟' : 'کیا میری تعلیمی پیشرفت خودکار طور پر کلاؤڈ پر محفوظ رہتی ہے؟'),
          a: currentLang === 'en'
            ? 'Yes, when logged in with Google or email, your course progress, quiz stars, certificates, and bookmarks sync in real-time securely.'
            : (currentLang === 'ar'
              ? 'نعم، يتم مزامنة جميع الدروس والنتائج والشهادات تلقائياً في حسابك المشفر في السحابة.'
              : 'جی ہاں! گوگل یا ای میل لاگ اِن کی صورت میں آپ کے تمام کورسز، کوئز کے ستارے، اور اسناد فائر بیس کلاؤڈ پر فوری محفوظ ہو جاتے ہیں۔')
        }
      ]
    },
    contact: {
      badge: currentLang === 'en' ? '📬 24/7 Direct Scholar & Academic Support' : (currentLang === 'ar' ? '📬 تواصل مباشر ودعم أكاديمي 24/7' : '📬 براہِ راست رابطہ و رہنمائی (24/7)'),
      title: currentLang === 'en' ? 'Get in Touch with Our Academic Support Team' : (currentLang === 'ar' ? 'تواصل معنا مباشرة للحصول على الاستشارات الشرعية' : 'ہم سے براہِ راست رابطہ کریں اور فوری رہنمائی حاصل کریں'),
      subtitle: currentLang === 'en'
        ? 'Have questions about admissions, authentic rulings, curriculum, or technical support? Send your message directly to our desk, email, and WhatsApp.'
        : (currentLang === 'ar'
          ? 'لأي استفسار بخصوص التسجيل أو المناهج أو الدعم الفني، أرسل رسالتك لتصل فوراً إلى بريدنا والواتساب.'
          : 'داخلہ رہنمائی، دینی مسائل، تجاویز یا کسی بھی سوال کے لیے اپنا پیغام درج کریں۔ آپ کا پیغام براہِ راست ہمارے ای میل اور واٹس ایپ پر موصول ہوگا۔'),
      nameLabel: currentLang === 'en' ? 'Your Full Name' : (currentLang === 'ar' ? 'الاسم الكريم' : 'آپ کا مبارک نام'),
      namePlaceholder: currentLang === 'en' ? 'e.g. John Doe / Muhammad' : (currentLang === 'ar' ? 'مثال: عبد الله بن محمد' : 'مثلاً: محمد عبد اللہ'),
      contactLabel: currentLang === 'en' ? 'Email Address or WhatsApp Number' : (currentLang === 'ar' ? 'البريد الإلكتروني أو رقم الواتساب' : 'آپ کا ای میل ایڈریس یا فون نمبر'),
      contactPlaceholder: currentLang === 'en' ? 'e.g. student@learnhub.com or +91...' : (currentLang === 'ar' ? 'البريد أو رقم الهاتف...' : 'ای میل یا واٹس ایپ نمبر...'),
      messageLabel: currentLang === 'en' ? 'Your Message or Question' : (currentLang === 'ar' ? 'رسالتك أو استفسارك' : 'آپ کا پیغام یا سوال'),
      messagePlaceholder: currentLang === 'en' ? 'Write your message or inquiry in detail...' : (currentLang === 'ar' ? 'اكتب استفسارك بالتفصيل...' : 'اپنا سوال یا پیغام تفصیل سے لکھیں...'),
      btnEmail: currentLang === 'en' ? 'Send via Email' : (currentLang === 'ar' ? 'إرسال عبر البريد' : 'ای میل کے ذریعے بھیجیں'),
      btnWhatsApp: currentLang === 'en' ? '1-Click WhatsApp Support' : (currentLang === 'ar' ? 'مراسلة عبر الواتساب بنقرة واحدة' : 'واٹس ایپ پر 1-کلک پیغام'),
      supportBanner: currentLang === 'en' ? 'Online Support Desk: 24/7 Available' : (currentLang === 'ar' ? 'مكتب الدعم: متاح 24/7' : 'آن لائن سپورٹ ڈیسک: 24/7 دستیاب')
    }
  };

  container.innerHTML = `
    <div class="${fontClass} ${textAlign} w-full transition-all duration-300 bg-slate-50/50 dark:bg-[#080d1a]" dir="${dir}">
      
      <!-- 1. Quick Access Ribbon & Daily Inspiration (Unified Luxury Header Area) -->
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full space-y-3 sm:space-y-4">
        
        <!-- Daily Inspiration Capsule Card -->
        <div class="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-4 sm:p-5 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="flex flex-wrap sm:flex-nowrap items-center justify-center md:justify-start gap-3 text-center sm:${textAlign} relative z-10">
            <span class="badge bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black shadow-md shrink-0 px-3 py-1 rounded-xl">
              ${todayInspiration.icon} ${todayInspiration.type}
            </span>
            <span class="text-emerald-100 text-xs sm:text-sm leading-relaxed font-semibold">
              <span class="font-arabic font-bold text-amber-300 text-sm">«${todayInspiration.arabic}»</span> — <span>${todayInspiration.translation}</span> <strong class="text-amber-400">(${todayInspiration.ref})</strong>
            </span>
          </div>
          <div class="flex items-center gap-2 shrink-0 relative z-10">
            <a href="${todayInspiration.link}" class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl text-xs font-extrabold text-white transition flex items-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-95">
              <i data-lucide="sparkles" class="w-4 h-4 text-yellow-300"></i> <span>${i18n.dailyInspiration.fullStudy}</span>
            </a>
            <a href="#/duas" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95">
              <i data-lucide="bookmark" class="w-4 h-4"></i> <span>${i18n.dailyInspiration.dailyDuas}</span>
            </a>
          </div>
        </div>

        <!-- 4 Unified Luxury Quick Access Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          ${i18n.quickRibbon.map(item => `
            <a href="${item.link}" class="p-3.5 sm:p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 ${item.borderColor} flex items-center gap-3.5 transition-all duration-300 group active:scale-95 shadow-sm hover:shadow-xl hover:-translate-y-0.5">
              <div class="w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition duration-300">
                <i data-lucide="${item.icon}" class="w-5 h-5"></i>
              </div>
              <div class="min-w-0">
                <div class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition">${item.title}</div>
                <div class="text-[10px] sm:text-[11px] ${item.textColor} font-bold truncate mt-0.5">${item.subtitle}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- 3. Hero Section -->
      <section class="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 md:py-28 w-full">
        <!-- Ambient Glowing Background Spheres -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-cyan-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            <!-- Hero Left/Right Content -->
            <div class="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:${textAlign}">
              
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-black shadow-sm">
                <i data-lucide="crown" class="w-4 h-4 text-amber-500 shrink-0"></i>
                <span class="truncate">${i18n.hero.badge}</span>
              </div>

              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.35] break-words">
                ${i18n.hero.title}
              </h1>

              <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                ${i18n.hero.subtitle}
              </p>

              <!-- Action CTAs -->
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                ${(currentUser) ? `
                  <a href="#/dashboard" class="btn-primary w-full sm:w-auto py-3.5 px-7 text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                    <span>${i18n.hero.btnDashboard}</span>
                  </a>
                  ${window.Auth && window.Auth.isAdmin() ? `
                    <a href="#/admin" class="btn-gold w-full sm:w-auto py-3.5 px-6 text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                      <i data-lucide="shield" class="w-4 h-4"></i>
                      <span>${i18n.hero.btnAdmin}</span>
                    </a>
                  ` : ''}
                ` : `
                  <a href="#/login" class="btn-primary w-full sm:w-auto py-3.5 px-7 text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="log-in" class="w-4 h-4"></i>
                    <span>${i18n.hero.btnSignIn}</span>
                  </a>
                  <a href="#/register" class="py-3.5 px-6 text-xs sm:text-sm font-black rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 shadow-lg active:scale-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="user-plus" class="w-4 h-4"></i>
                    <span>${i18n.hero.btnRegister}</span>
                  </a>
                `}
                <a href="#/courses" class="py-3.5 px-6 text-xs sm:text-sm font-extrabold rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition flex items-center justify-center gap-2">
                  <i data-lucide="book-open" class="w-4 h-4 text-emerald-500"></i>
                  <span>${i18n.hero.btnCourses}</span>
                </a>
                <a href="#/library" class="py-3.5 px-6 text-xs sm:text-sm font-extrabold rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition flex items-center justify-center gap-2">
                  <i data-lucide="book" class="w-4 h-4 text-amber-500"></i>
                  <span>${i18n.hero.btnLibrary}</span>
                </a>
              </div>

              <!-- Universal Multi-Domain Smart Search & Assistant Bar -->
              <div class="max-w-xl w-full mx-auto lg:mx-0 relative mt-4 space-y-2.5">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-emerald-500/40 p-2 gap-2 sm:gap-0 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30 transition-all w-full relative">
                  <div class="flex items-center flex-1 min-w-0">
                    <div class="w-8 h-8 rounded-full overflow-hidden border border-amber-400/80 mx-2 shrink-0 bg-slate-900 shadow">
                      <img src="images/learnhub-logo.png" alt="LearnHub" class="w-full h-full object-cover" />
                    </div>
                    <input 
                      type="text" 
                      id="hero-search-input" 
                      placeholder="سورتیں، احادیث، کورسز، کتب، فقہ، سیرت یا سوال لکھیں..." 
                      class="w-full bg-transparent border-none px-2 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs sm:text-sm ${textAlign} font-urdu"
                      onkeydown="if(event.key==='Enter') { const q = this.value.trim(); if(q) { if (window.Views && window.Views.openFloatingAiChat) { window.Views.openFloatingAiChat(q); } else { window.Router.navigate('/ai-scholar?q=' + encodeURIComponent(q)); } } }"
                    />
                  </div>
                  <button 
                    onclick="const q = document.getElementById('hero-search-input').value.trim(); if(q) { if (window.Views && window.Views.openFloatingAiChat) { window.Views.openFloatingAiChat(q); } else { window.Router.navigate('/ai-scholar?q=' + encodeURIComponent(q)); } } else { if (window.Views && window.Views.openFloatingAiChat) { window.Views.openFloatingAiChat(); } else { window.Router.navigate('/ai-scholar'); } }"
                    class="py-3 px-6 text-xs sm:text-sm rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white whitespace-nowrap w-full sm:w-auto font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition">
                    <i data-lucide="sparkles" class="w-4 h-4 text-amber-300"></i>
                    <span>تلاش و سوال</span>
                  </button>
                </div>

                <!-- Quick Knowledge Domain Pills -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-urdu">
                  <span class="text-[10px] text-slate-400 shrink-0 font-bold">فوری تلاش:</span>
                  <a href="#/quran" class="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold whitespace-nowrap hover:border-emerald-500 transition flex items-center gap-1">
                    <span>📖 سورتیں</span>
                  </a>
                  <a href="#/hadith" class="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold whitespace-nowrap hover:border-amber-500 transition flex items-center gap-1">
                    <span>📜 احادیث</span>
                  </a>
                  <a href="#/courses" class="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-bold whitespace-nowrap hover:border-indigo-500 transition flex items-center gap-1">
                    <span>🎓 کورسز</span>
                  </a>
                  <a href="#/library" class="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-bold whitespace-nowrap hover:border-teal-500 transition flex items-center gap-1">
                    <span>📚 کتب خانہ</span>
                  </a>
                  <a href="#/mirath" class="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-bold whitespace-nowrap hover:border-purple-500 transition flex items-center gap-1">
                    <span>⚖️ فقہ و میراث</span>
                  </a>
                  <a href="#/quizzes" class="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold whitespace-nowrap hover:border-rose-500 transition flex items-center gap-1">
                    <span>🏆 کوئزز</span>
                  </a>
                </div>
              </div>

              <!-- Stats Bar -->
              <div class="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg w-full mx-auto lg:mx-0 text-center">
                <div class="p-3 sm:p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 shadow-sm hover-lift">
                  <div class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono" data-count-to="114" data-count-duration="1200">114</div>
                  <div class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5">${i18n.hero.statSurahs}</div>
                </div>
                <div class="p-3 sm:p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20 shadow-sm hover-lift">
                  <div class="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono" data-count-to="300" data-count-suffix="+" data-count-duration="1400">300+</div>
                  <div class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5">${i18n.hero.statBooks}</div>
                </div>
                <div class="p-3 sm:p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 shadow-sm hover-lift">
                  <div class="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono" data-count-to="${courses.length || 50}" data-count-suffix="+" data-count-duration="1000">${courses.length}+</div>
                  <div class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5">${i18n.hero.statCourses}</div>
                </div>
              </div>
            </div>

            <!-- Hero Mockup Visuals -->
            <div class="lg:col-span-5 relative w-full">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 rounded-3xl blur-2xl opacity-25 animate-pulse-slow"></div>

                <div class="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
                  <!-- Live Track Snippet -->
                  <div class="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
                      <i data-lucide="book-open" class="w-6 h-6"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        ${currentLang === 'en' ? 'Current Track' : (currentLang === 'ar' ? 'المسار الحالي' : 'جاری کورس')}
                      </div>
                      <div class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                        ${currentLang === 'en' ? 'Tajweed & Quranic Recitation' : (currentLang === 'ar' ? 'تجويد القرآن الكريم والقراءات' : 'قرآنی تجوید و قراءت ماسٹر کلاس')}
                      </div>
                      <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style="width: 100%;"></div>
                      </div>
                    </div>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono shrink-0">100%</span>
                  </div>

                  <!-- Adventure Game Feature Card -->
                  <div class="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/40">
                    <div class="flex items-center justify-between mb-3">
                      <span class="badge bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg">
                        <i data-lucide="gamepad-2" class="w-3.5 h-3.5"></i> ${i18n.adventure.badge}
                      </span>
                      <span class="flex items-center gap-1 text-xs text-amber-300 font-black font-sans">
                        🪙 250 Coins • Lvl 1
                      </span>
                    </div>
                    <h4 class="font-black text-sm sm:text-base mb-1.5 text-white">${i18n.adventure.card1Title}</h4>
                    <p class="text-xs text-slate-300 mb-3.5 leading-relaxed">${i18n.adventure.card2Desc}</p>
                    <a href="#/adventure" class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-2xl text-xs transition shadow-lg shadow-amber-500/30 active:scale-95">
                      <span>${i18n.adventure.btnPlay}</span>
                      <i data-lucide="${iconArrow}" class="w-4 h-4"></i>
                    </a>
                  </div>

                  <!-- Verified Certificate Quick Portal Snippet -->
                  <div class="flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <i data-lucide="award" class="w-5 h-5"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-black text-slate-900 dark:text-white truncate">
                          ${currentLang === 'en' ? 'Royal Verifiable Certificate Portal' : (currentLang === 'ar' ? 'بوابة الشهادات المعتمدة' : 'شاہی تصدیق شدہ اسناد پورٹل')}
                        </div>
                        <div class="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-bold truncate mt-0.5">
                          ${currentLang === 'en' ? 'QR Cryptographic Verification' : (currentLang === 'ar' ? 'التحقق المشفر برمز QR' : 'محفوظ آن لائن کوڈ ویریفکیشن')}
                        </div>
                      </div>
                    </div>
                    <a href="#/certificates" class="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline shrink-0">
                      ${currentLang === 'en' ? 'Verify' : (currentLang === 'ar' ? 'تحقق' : 'تصدیق')} ${arrowForward}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      <!-- 4. Categories Filter & Featured Masterclasses -->
      <section class="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 w-full">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span class="badge badge-primary mb-1 sm:mb-2">${i18n.coursesSection.badge}</span>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${i18n.coursesSection.title}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">${i18n.coursesSection.subtitle}</p>
            </div>
            <a href="#/courses" class="btn-secondary text-xs sm:text-sm shrink-0">
              <span>${i18n.coursesSection.viewAll}</span> ${arrowForward}
            </a>
          </div>

          <!-- Category Filter Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            ${i18n.categories.tabs.map(tab => {
              const isActive = (window.Views._activeHomeCategory || 'all') === tab.id;
              return `
                <button 
                  onclick="window.Views.filterHomeCourses('${tab.id}')"
                  class="py-2 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${isActive ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
                >
                  ${tab.name}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Masterclasses Grid -->
          <div id="home-courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            ${courses.slice(0, 6).map(course => window.Views.components.renderCourseCard(course, currentLang)).join('')}
          </div>

        </div>
      </section>

      <!-- 6. 300+ Classical Islamic Library Spotlight -->
      <section class="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 w-full">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span class="badge bg-amber-400 text-slate-950 font-extrabold text-xs mb-1.5">${i18n.librarySection.badge}</span>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${i18n.librarySection.title}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">${i18n.librarySection.subtitle}</p>
            </div>
            <a href="#/library" class="btn-primary py-2.5 px-5 text-xs sm:text-sm font-bold rounded-xl shadow-md shrink-0">
              <span>${i18n.librarySection.exploreFull}</span>
            </a>
          </div>

          <!-- Category Pills for Library -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            ${i18n.librarySection.pills.map(pill => {
              const isActive = (window.Views._activeHomeBookCategory || 'all') === pill.id;
              return `
                <button 
                  onclick="window.Views.filterHomeBooks('${pill.id}')"
                  class="py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition ${isActive ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'}"
                >
                  ${pill.name}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Book Cards Spotlight Grid -->
          <div id="home-books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            ${allBooks.slice(0, 4).map(book => {
              const title = (currentLang === 'en' && book.titleEn) ? book.titleEn : ((currentLang === 'ar' && book.titleArabic) ? book.titleArabic : book.title);
              const author = (currentLang === 'en' && book.authorEn) ? book.authorEn : book.author;
              const catName = typeof book.categoryName === 'object' ? (book.categoryName[currentLang] || book.categoryName.en) : (book.categoryName || 'Islamic Science');
              return `
                <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
                  <div class="space-y-3">
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative shadow-md">
                      <img src="${book.cover || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80'}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span class="absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                        ${catName}
                      </span>
                    </div>
                    <div>
                      <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition leading-snug">${title}</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">${author}</p>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>📖 ${book.pages || 400} ${currentLang === 'en' ? 'pages' : (currentLang === 'ar' ? 'صفحة' : 'صفحات')}</span>
                      <span class="text-amber-500 font-bold">★ ${book.rating || 5.0}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <a href="#/library" class="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-center text-[11px] font-bold transition">
                        ${i18n.librarySection.readOnline}
                      </a>
                      <a href="#/library" class="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-[11px] font-bold shadow-sm transition">
                        ${i18n.librarySection.downloadPdf}
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      </section>



      <!-- 8. Islamic Adventure Game Spotlight -->
      <section class="py-12 sm:py-20 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white relative overflow-hidden border-b-2 border-emerald-200 dark:border-slate-800 w-full select-none">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md mb-3">
                <i data-lucide="gamepad-2" class="w-4 h-4"></i> ${i18n.adventure.badge}
              </div>
              <h3 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                ${i18n.adventure.title}
              </h3>
              <p class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed font-semibold">
                ${i18n.adventure.subtitle}
              </p>
            </div>
            <a href="#/adventure" class="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm shrink-0 shadow-xl shadow-amber-500/30 active:scale-95 transition flex items-center gap-2">
              <span>${i18n.adventure.btnPlay}</span>
              <i data-lucide="${iconArrow}" class="w-4 h-4"></i>
            </a>
          </div>

          <!-- 3 Bright Feature Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Card 1 -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30">
                🎒
              </div>
              <h4 class="text-lg font-black text-slate-900 dark:text-white">${i18n.adventure.card1Title}</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.adventure.card1Desc}</p>
              <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                <span>${i18n.adventure.card1Badge}</span>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 text-2xl shadow-lg shadow-amber-400/30">
                🧩
              </div>
              <h4 class="text-lg font-black text-slate-900 dark:text-white">${i18n.adventure.card2Title}</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.adventure.card2Desc}</p>
              <div class="text-xs font-bold text-amber-600 dark:text-amber-400 font-sans">
                <span>${i18n.adventure.card2Badge}</span>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 shadow-xl space-y-3 hover:scale-[1.02] transition">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30">
                ⚔️
              </div>
              <h4 class="text-lg font-black text-slate-900 dark:text-white">${i18n.adventure.card3Title}</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.adventure.card3Desc}</p>
              <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                <span>${i18n.adventure.card3Badge}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 9. Dedicated Scholar Desk & Help Portal CTA Banner (Clean & High-End) -->
      <section class="py-12 sm:py-16 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800 text-white w-full relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-3xl bg-emerald-950/40 border border-emerald-500/30 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden hover-lift">
            <div class="space-y-2 text-center md:${textAlign}">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
                <i data-lucide="help-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>${currentLang === 'en' ? '24/7 Scholar Concierge & FAQs' : (currentLang === 'ar' ? 'مركز المساعدة والأسئلة الشائعة' : '24/7 رہنمائی و سوالات پورٹل')}</span>
              </div>
              <h3 class="text-xl sm:text-3xl font-black text-white">
                ${currentLang === 'en' ? 'Need Help or Have Questions?' : (currentLang === 'ar' ? 'هل لديك أي استفسار أو تحتاج مساعدة؟' : 'کوئی سوال ہے یا رہنمائی درکار ہے؟')}
              </h3>
              <p class="text-xs sm:text-sm text-slate-400 max-w-xl">
                ${currentLang === 'en' ? 'Visit our dedicated Help & FAQ Center or connect directly with our academic team.' : (currentLang === 'ar' ? 'تفضل بزيارة مركز المساعدة والأسئلة الشائعة أو تواصل مباشرة مع فريق الإشراف العلمي.' : 'ہمارے خصوصی سوالات و جوابات پورٹل پر جائیں یا براہِ راست اسکالر سپورٹ سے رابطہ کریں۔')}
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a href="#/faq" class="btn-primary py-3 px-6 text-xs sm:text-sm rounded-2xl font-black shadow-lg hover-lift active-press flex items-center gap-2">
                <i data-lucide="help-circle" class="w-4 h-4"></i>
                <span>${currentLang === 'en' ? 'Explore FAQs & Support' : (currentLang === 'ar' ? 'الأسئلة الشائعة والدعم' : 'سوالات و رہنمائی پورٹل')}</span>
              </a>
              <button onclick="window.Views.sendWhatsAppDirect()" class="btn-secondary py-3 px-5 text-xs sm:text-sm rounded-2xl font-bold border-emerald-500/30 text-emerald-400 hover-lift active-press flex items-center gap-2">
                <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Filter Courses on Home
window.Views.filterHomeCourses = function(categoryKey) {
  window.Views._activeHomeCategory = categoryKey;
  const currentLang = getHomeCurrentLanguage();
  const allCourses = window.DB ? (window.DB.get('courses') || []) : [];
  
  let filtered = allCourses;
  if (categoryKey && categoryKey !== 'all') {
    filtered = allCourses.filter(c => {
      const catId = c.categoryId || (c.category && c.category.id) || '';
      return catId.toLowerCase().includes(categoryKey.toLowerCase()) || (c.category && c.category.name && c.category.name.toLowerCase().includes(categoryKey.toLowerCase()));
    });
    if (filtered.length === 0) filtered = allCourses.slice(0, 6);
  }

  const grid = document.getElementById('home-courses-grid');
  if (grid) {
    grid.innerHTML = filtered.slice(0, 6).map(course => window.Views.components.renderCourseCard(course, currentLang)).join('');
    if (window.lucide) window.lucide.createIcons();
  }
};

// Filter Books on Home Spotlight
window.Views.filterHomeBooks = function(categoryKey) {
  window.Views._activeHomeBookCategory = categoryKey;
  const currentLang = getHomeCurrentLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const allBooks = window.ISLAMIC_LIBRARY_BOOKS || [];
  
  let filtered = allBooks;
  if (categoryKey && categoryKey !== 'all') {
    filtered = allBooks.filter(b => b.category === categoryKey);
    if (filtered.length === 0) filtered = allBooks.slice(0, 4);
  }

  const grid = document.getElementById('home-books-grid');
  if (grid) {
    grid.innerHTML = filtered.slice(0, 4).map(book => {
      const title = (currentLang === 'en' && book.titleEn) ? book.titleEn : ((currentLang === 'ar' && book.titleArabic) ? book.titleArabic : book.title);
      const author = (currentLang === 'en' && book.authorEn) ? book.authorEn : book.author;
      const catName = typeof book.categoryName === 'object' ? (book.categoryName[currentLang] || book.categoryName.en) : (book.categoryName || 'Islamic Science');
      const readLabel = currentLang === 'en' ? 'Read Online' : (currentLang === 'ar' ? 'قراءة أونلاين' : 'آن لائن پڑھیں');
      const dlLabel = currentLang === 'en' ? 'Download PDF' : (currentLang === 'ar' ? 'تحميل PDF' : 'پی ڈی ایف حاصل کریں');
      return `
        <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group">
          <div class="space-y-3">
            <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative shadow-md">
              <img src="${book.cover || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80'}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                ${catName}
              </span>
            </div>
            <div>
              <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition leading-snug">${title}</h4>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">${author}</p>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>📖 ${book.pages || 400} ${currentLang === 'en' ? 'pages' : (currentLang === 'ar' ? 'صفحة' : 'صفحات')}</span>
              <span class="text-amber-500 font-bold">★ ${book.rating || 5.0}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a href="#/library" class="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-center text-[11px] font-bold transition">
                ${readLabel}
              </a>
              <a href="#/library" class="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-[11px] font-bold shadow-sm transition">
                ${dlLabel}
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }
};

// Interactive Salawat Counter Increment
window.Views.incrementHomeSalawat = function() {
  const currentLang = getHomeCurrentLanguage();
  let count = parseInt(localStorage.getItem('learnhub_salawat_count') || '1420', 10);
  count += 1;
  localStorage.setItem('learnhub_salawat_count', count.toString());
  
  const display = document.getElementById('home-salawat-display');
  if (display) {
    display.textContent = count.toLocaleString();
    display.classList.add('scale-125', 'text-emerald-400');
    setTimeout(() => {
      display.classList.remove('scale-125', 'text-emerald-400');
    }, 250);
  }

  const toastMsg = currentLang === 'en'
    ? '✨ Salawat recorded! May Allah send ten blessings upon you.'
    : (currentLang === 'ar'
      ? '✨ صليت على النبي ﷺ! صَلَّى اللهُ عَلَيْكَ بِهَا عَشْرًا.'
      : '✨ درود شریف درج ہو گیا! اللہ تعالیٰ آپ پر دس رحمتیں نازل فرمائے۔');

  if (window.App && typeof window.App.showToast === 'function') {
    window.App.showToast(toastMsg, 'success');
  }
};

// Render Dynamic Directional FAQ List
window.Views.renderFaqList = function(items) {
  const container = document.getElementById('faq-accordion-container');
  if (!container) return;

  const currentLang = getHomeCurrentLanguage();
  const textAlign = (currentLang === 'ur' || currentLang === 'ar') ? 'text-right' : 'text-left';

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3 animate-scale-in">
        <div class="text-4xl">🔍</div>
        <h4 class="text-sm font-bold text-white">${currentLang === 'en' ? 'No matching questions found.' : (currentLang === 'ar' ? 'لم يتم العثور على نتائج.' : 'کوئی سوال دستیاب نہیں ملا۔')}</h4>
        <p class="text-xs text-slate-400">${currentLang === 'en' ? 'Try searching for other keywords or select All Questions.' : (currentLang === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر جميع الأسئلة.' : 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا تمام سوالات منتخب کریں۔')}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    // Alternate directional entrance animations for delightful visual rhythm
    let animClass = 'animate-fade-in-up';
    if (idx % 4 === 0) animClass = 'animate-fade-in-down';
    else if (idx % 4 === 1) animClass = 'animate-fade-in-right';
    else if (idx % 4 === 2) animClass = 'animate-fade-in-left';
    else if (idx % 4 === 3) animClass = 'animate-fade-in-up';

    const numStr = (idx + 1).toString().padStart(2, '0');

    return `
      <div id="faq-card-${item.id}" class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 overflow-hidden transition-all duration-300 shadow-xl ${animClass} hover-lift group" style="animation-delay: ${idx * 50}ms;">
        <button 
          type="button" 
          onclick="window.Views.toggleFaq('${item.id}')"
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition ${textAlign}"
        >
          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <span class="w-8 h-8 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-black shrink-0">
              ${numStr}
            </span>
            <span class="leading-snug truncate sm:whitespace-normal">${item.q}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-amber-400/20 transition">
            <i id="icon-${item.id}" data-lucide="chevron-down" class="w-4 h-4 text-emerald-400 group-hover:text-amber-400 transition-transform duration-300"></i>
          </div>
        </button>
        <div id="body-${item.id}" class="hidden px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 bg-slate-950/40">
          ${item.a}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
};

// Pulse Central FAQ Sphere
window.Views.pulseFaqSphere = function() {
  const sphere = document.getElementById('faq-core-sphere');
  const orbit = document.getElementById('faq-orbit-ring');
  if (sphere) {
    sphere.classList.add('scale-110', 'ring-4', 'ring-amber-400');
    setTimeout(() => {
      sphere.classList.remove('scale-110', 'ring-4', 'ring-amber-400');
    }, 400);
  }
  if (orbit) {
    orbit.classList.add('scale-125', 'border-amber-300');
    setTimeout(() => {
      orbit.classList.remove('scale-125', 'border-amber-300');
    }, 500);
  }

  // Refresh all questions with a smooth cascade
  if (window.Views._faqItems) {
    window.Views.renderFaqList(window.Views._faqItems);
  }

  if (window.SoundEngine && typeof window.SoundEngine.playBeep === 'function') {
    window.SoundEngine.playBeep(587.33, 'sine', 0.1);
  }
};

// Filter FAQ by Category
window.Views.filterFaqCategory = function(cat, btn) {
  document.querySelectorAll('.faq-cat-btn').forEach(b => {
    b.classList.remove('active', 'bg-emerald-600', 'text-white', 'border-emerald-400/40');
    b.classList.add('bg-slate-900/90', 'text-slate-300');
  });

  if (btn) {
    btn.classList.add('active', 'bg-emerald-600', 'text-white', 'border-emerald-400/40');
    btn.classList.remove('bg-slate-900/90', 'text-slate-300');
  }

  const allItems = window.Views._faqItems || [];
  if (cat === 'all') {
    window.Views.renderFaqList(allItems);
  } else {
    const filtered = allItems.filter(item => item.category === cat);
    window.Views.renderFaqList(filtered.length ? filtered : allItems);
  }
};

// Live Search Inside FAQ
window.Views.searchFaq = function(query) {
  query = (query || '').toLowerCase().trim();
  const allItems = window.Views._faqItems || [];
  if (!query) {
    window.Views.renderFaqList(allItems);
    return;
  }
  const filtered = allItems.filter(item => {
    return (item.q && item.q.toLowerCase().includes(query)) || (item.a && item.a.toLowerCase().includes(query));
  });
  window.Views.renderFaqList(filtered);
};

// Toggle FAQ Accordions
window.Views.toggleFaq = function(faqId) {
  const card = document.getElementById(`faq-card-${faqId}`);
  const body = document.getElementById(`body-${faqId}`);
  const icon = document.getElementById(`icon-${faqId}`);
  if (!body) return;

  const isHidden = body.classList.contains('hidden');
  if (isHidden) {
    body.classList.remove('hidden');
    if (icon) icon.classList.add('rotate-180');
    if (card) card.classList.add('border-amber-400/80', 'shadow-amber-500/10');
  } else {
    body.classList.add('hidden');
    if (icon) icon.classList.remove('rotate-180');
    if (card) card.classList.remove('border-amber-400/80', 'shadow-amber-500/10');
  }
};

// Open Ultra-Luxurious Royal Support Modal
window.Views.openSupportModal = function() {
  const currentLang = getHomeCurrentLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const textAlign = isRtl ? 'text-right' : 'text-left';

  const existing = document.getElementById('support-modal-royal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'support-modal-royal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl font-urdu select-none';
  modal.innerHTML = `
    <div class="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-amber-400 shadow-2xl text-white animate-scale-in space-y-6">
      
      <!-- Close Button -->
      <button 
        onclick="document.getElementById('support-modal-royal').remove()" 
        class="absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition active-press"
      >
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Modal Header -->
      <div class="text-center space-y-2 pt-2">
        <div class="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl shadow-lg animate-float">
          📬
        </div>
        <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-black">
          ${currentLang === 'en' ? 'Direct Scholar Desk' : (currentLang === 'ar' ? 'مكتب الإرشاد والتوجيه' : 'براہِ راست اسکالر و اکیڈمک ہیلپ ڈیسک')}
        </span>
        <h3 class="text-xl sm:text-2xl font-black text-amber-300">
          ${currentLang === 'en' ? 'Send Your Inquiry or Question' : (currentLang === 'ar' ? 'أرسل استفسارك الشرعي أو الفني' : 'اپنا استفسار یا سوال ارسال فرمائیں')}
        </h3>
        <p class="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
          ${currentLang === 'en' ? 'Fill out the form below to create an instant tracked support ticket.' : (currentLang === 'ar' ? 'املأ النموذج لإنشاء تذكرة دعم مباشرة ومتابعتها فوراً.' : 'اپنا پیغام درج کریں، سسٹم خودکار طریقے سے آن لائن ٹکٹ بنا کر آپ کی رہنمائی کرے گا۔')}
        </p>
      </div>

      <!-- Support Form -->
      <form onsubmit="window.Views.sendContactInquiry(event)" class="space-y-4">
        <div>
          <label class="text-xs font-bold text-emerald-200 block mb-1.5">${currentLang === 'en' ? 'Your Name' : (currentLang === 'ar' ? 'الاسم الكريم' : 'آپ کا مبارک نام')}</label>
          <input type="text" id="cnt-name" required placeholder="${currentLang === 'en' ? 'e.g. Abdullah' : (currentLang === 'ar' ? 'مثال: عبد الله' : 'مثلاً: محمد عبد اللہ')}" class="w-full bg-slate-800/90 text-white placeholder-slate-500 border border-slate-700 text-xs sm:text-sm rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition ${textAlign}">
        </div>

        <div>
          <label class="text-xs font-bold text-emerald-200 block mb-1.5">${currentLang === 'en' ? 'Email or WhatsApp' : (currentLang === 'ar' ? 'البريد أو الواتساب' : 'ای میل ایڈریس یا واٹس ایپ نمبر')}</label>
          <input type="text" id="cnt-contact" required placeholder="${currentLang === 'en' ? 'email@domain.com or +91...' : (currentLang === 'ar' ? 'البريد أو الهاتف...' : 'ای میل یا واٹس ایپ فون نمبر...')}" class="w-full bg-slate-800/90 text-white placeholder-slate-500 border border-slate-700 text-xs sm:text-sm rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition ${textAlign}">
        </div>

        <div>
          <label class="text-xs font-bold text-emerald-200 block mb-1.5">${currentLang === 'en' ? 'Your Message / Inquiry' : (currentLang === 'ar' ? 'نص الاستفسار' : 'آپ کا پیغام یا تفصیلی سوال')}</label>
          <textarea id="cnt-message" rows="3" required placeholder="${currentLang === 'en' ? 'Write your message...' : (currentLang === 'ar' ? 'اكتب رسالتك بالتفصيل...' : 'اپنا سوال یا مسئلہ تفصیل سے لکھیں...')}" class="w-full bg-slate-800/90 text-white placeholder-slate-500 border border-slate-700 text-xs sm:text-sm rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none leading-relaxed transition ${textAlign}"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button type="submit" class="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl active:scale-95 transition flex items-center justify-center gap-2">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>${currentLang === 'en' ? 'Submit Ticket' : (currentLang === 'ar' ? 'إرسال التذكرة' : 'ٹکٹ درج کریں')}</span>
          </button>

          <button type="button" onclick="window.Views.sendWhatsAppDirect()" class="w-full py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-extrabold rounded-2xl text-xs sm:text-sm border border-emerald-500/30 active:scale-95 transition flex items-center justify-center gap-2">
            <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
            <span>${currentLang === 'en' ? 'WhatsApp Direct' : (currentLang === 'ar' ? 'واتساب مباشر' : 'واٹس ایپ رابطہ')}</span>
          </button>
        </div>
      </form>

    </div>
  `;

  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();
};

// Direct Contact & Inquiry Form Submission
window.Views.sendContactInquiry = function(e) {
  e.preventDefault();
  const currentLang = getHomeCurrentLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const name = document.getElementById('cnt-name')?.value?.trim() || (currentLang === 'en' ? 'Student' : 'طالب علم');
  const contact = document.getElementById('cnt-contact')?.value?.trim() || 'student@learnhub.com';
  const message = document.getElementById('cnt-message')?.value?.trim() || '';

  const openSupportModalEl = document.getElementById('support-modal-royal');
  if (openSupportModalEl) openSupportModalEl.remove();

  if (!message) {
    const warnMsg = currentLang === 'en' ? 'Please enter your message.' : (currentLang === 'ar' ? 'يرجى كتابة رسالتك.' : 'براہِ کرم اپنا پیغام درج فرمائیں۔');
    window.App.showToast(warnMsg, 'warning');
    return;
  }

  const ticketNumber = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (window.DB && typeof window.DB.insert === 'function') {
    window.DB.insert('supportTickets', {
      id: `inq-${Date.now()}`,
      ticketNumber,
      userName: name,
      userEmail: contact,
      contactInfo: contact,
      category: 'General Academic Inquiry',
      priority: 'medium',
      subject: `Inquiry from ${name}`,
      message: message,
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: []
    });
    if (typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(name, 'INQUIRY_SUBMITTED', `${ticketNumber} from ${contact}`);
    }
  }

  const waText = encodeURIComponent(`Assalamu Alaikum LearnHub Team,\nName: ${name}\nContact: ${contact}\nTicket: ${ticketNumber}\nMessage: ${message}\n(Via LearnHub: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${waText}`;
  const mailtoUrl = `mailto:support@learnhub.com?subject=${encodeURIComponent(`[${ticketNumber}] LearnHub Inquiry: ${name}`)}&body=${encodeURIComponent(message)}`;

  const modalTitle = currentLang === 'en' ? 'Inquiry Recorded Successfully! ✅' : (currentLang === 'ar' ? 'تم تسجيل استفسارك بنجاح! ✅' : 'پیغام ایڈمن پینل میں محفوظ ہو گیا! ✅');
  const modalDesc = currentLang === 'en'
    ? 'Your inquiry has been securely stored in our administrative database. You can also chat directly with our team on WhatsApp.'
    : (currentLang === 'ar'
      ? 'تم حفظ استفسارك في قاعدة البيانات بنجاح، كما يمكنك التحدث مباشرة مع فريق الدعم عبر الواتساب.'
      : 'آپ کا استفسار ایڈمن پورٹل میں محفوظ ہو چکا ہے۔ آپ نیچے دیے گئے بٹن پر کلک کر کے واٹس ایپ پر بھی رابطہ کر سکتے ہیں۔');

  const btnWaText = currentLang === 'en' ? 'Chat on WhatsApp (+91 7521019766)' : (currentLang === 'ar' ? 'مراسلة عبر الواتساب (+91 7521019766)' : 'واٹس ایپ پر میسج بھیجیں (+91 7521019766)');
  const btnEmailText = currentLang === 'en' ? 'Open Email Client' : (currentLang === 'ar' ? 'فتح تطبيق البريد' : 'ای میل کلائنٹ کھولیں');
  const btnCloseText = currentLang === 'en' ? 'Close' : (currentLang === 'ar' ? 'إغلاق' : 'ٹھیک ہے');

  if (window.App && typeof window.App.showModal === 'function') {
    window.App.showModal(modalTitle, `
      <div class="space-y-4 ${isRtl ? 'font-urdu text-right' : 'font-sans text-left'}" dir="${isRtl ? 'rtl' : 'ltr'}">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">${ticketNumber}</span>
            <span class="badge bg-emerald-500 text-slate-950 text-[10px] font-bold">SAVED ✓</span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 dark:text-white">${name} (${contact})</h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${message}</p>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${modalDesc}</p>

        <div class="space-y-2 pt-2">
          <a href="${whatsappUrl}" target="_blank" class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>${btnWaText}</span>
          </a>
          <a href="${mailtoUrl}" class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition">
            <i data-lucide="mail" class="w-4 h-4"></i>
            <span>${btnEmailText}</span>
          </a>
        </div>

        <div class="pt-2 text-center">
          <button onclick="window.App.closeModal();" class="btn-secondary py-2 px-6 text-xs rounded-xl">
            ${btnCloseText}
          </button>
        </div>
      </div>
    `);
  }

  const successToast = currentLang === 'en' ? 'Inquiry logged successfully!' : (currentLang === 'ar' ? 'تم تسجيل الاستفسار بنجاح!' : 'پیغام کامیابی سے لاگ ہو گیا!');
  if (window.App && typeof window.App.showToast === 'function') {
    window.App.showToast(successToast, 'success');
  }
  if (window.lucide) window.lucide.createIcons();
};

// 1-Click WhatsApp Direct Launcher
window.Views.sendWhatsAppDirect = function() {
  const currentLang = getHomeCurrentLanguage();
  const name = document.getElementById('cnt-name')?.value?.trim() || (currentLang === 'en' ? 'Learner' : 'طالب علم');
  const contact = document.getElementById('cnt-contact')?.value?.trim() || '';
  const message = document.getElementById('cnt-message')?.value?.trim() || 'Assalamu Alaikum LearnHub Team, I would like to inquire about authentic courses.';

  const ticketNumber = `WA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (window.DB && typeof window.DB.insert === 'function') {
    window.DB.insert('supportTickets', {
      id: `inq-wa-${Date.now()}`,
      ticketNumber,
      userName: name,
      userEmail: contact || 'WhatsApp',
      contactInfo: contact || '+91 7521019766',
      category: 'WhatsApp Inquiry',
      priority: 'medium',
      subject: `WhatsApp Inquiry: ${name}`,
      message: message,
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: []
    });
  }

  const text = encodeURIComponent(`Assalamu Alaikum LearnHub Team,\nName: ${name}\n${contact ? 'Contact: ' + contact + '\n' : ''}Message: ${message}\n(Via LearnHub: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${text}`;
  window.open(whatsappUrl, '_blank');

  const toastText = currentLang === 'en' ? 'Opening WhatsApp Support...' : (currentLang === 'ar' ? 'جاري فتح الواتساب...' : 'آن لائن واٹس ایپ سپورٹ کھل رہی ہے...');
  if (window.App && typeof window.App.showToast === 'function') {
    window.App.showToast(toastText, 'success');
  }
};

// Multilingual Course Card Component
window.Views.components.renderCourseCard = function(course, lang = getHomeCurrentLanguage()) {
  const isRtl = lang === 'ur' || lang === 'ar';
  const category = course.category || (window.DB && typeof window.DB.findById === 'function' ? window.DB.findById('categories', course.categoryId) : null) || { name: (lang === 'en' ? 'Islamic Sciences' : (lang === 'ar' ? 'العلوم الشرعية' : 'علومِ اسلامیہ')) };
  const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
  const isEnrolled = currentUser && window.DB && typeof window.DB.get === 'function'
    ? window.DB.get('enrollments').some(e => e.userId === currentUser.id && e.courseId === course.id)
    : false;

  const lblHours = lang === 'en' ? 'Hours' : (lang === 'ar' ? 'ساعات' : 'گھنٹے');
  const lblEnrolled = lang === 'en' ? '✓ Enrolled' : (lang === 'ar' ? '✓ مسجل بالفعل' : '✓ داخلہ فعال');
  const lblReviews = lang === 'en' ? 'reviews' : (lang === 'ar' ? 'تقييم' : 'آراء');
  const lblStudents = lang === 'en' ? 'students' : (lang === 'ar' ? 'طالب' : 'طلباء');
  const lblFree = lang === 'en' ? 'FREE' : (lang === 'ar' ? 'مجاناً (FREE)' : 'مفت (فی سبیل اللہ)');
  const lblCert = lang === 'en' ? 'Royal Certificate Included' : (lang === 'ar' ? 'شهادة معتمدة مشمولة' : 'شاہی سند شامل ہے');
  const lblViewDetails = lang === 'en' ? 'View Details' : (lang === 'ar' ? 'عرض التفاصيل' : 'تفصیلات دیکھیں');
  const lblContinue = lang === 'en' ? 'Continue Lesson' : (lang === 'ar' ? 'متابعة الدرس' : 'سبق پڑھیں');
  const lblEnroll = lang === 'en' ? 'Enroll Free' : (lang === 'ar' ? 'تسجيل مجاني' : 'مفت داخلہ لیں');
  const iconArrow = isRtl ? 'arrow-left' : 'arrow-right';

  return `
    <div class="lh-card overflow-hidden flex flex-col justify-between group border-2 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/80 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white dark:bg-slate-900 relative" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Thumbnail & Badges -->
      <div class="relative aspect-video overflow-hidden rounded-t-3xl">
        <img 
          src="${course.thumbnail || 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=600'}" 
          alt="${course.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
        
        <div class="absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex items-center gap-1.5 flex-wrap">
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-extrabold rounded-full shadow-md border border-emerald-400/30">
            <i data-lucide="tag" class="w-3 h-3"></i>
            <span>${category.name}</span>
          </span>
        </div>

        <div class="absolute top-3 ${isRtl ? 'left-3' : 'right-3'}">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-full shadow-md border border-amber-400/30">
            ${course.level || (lang === 'en' ? 'All Levels' : (lang === 'ar' ? 'جميع المستويات' : 'تمام درجات'))}
          </span>
        </div>

        <div class="absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md border border-emerald-500/20 font-mono">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>${course.durationHours || 12} ${lblHours}</span>
        </div>

        ${isEnrolled ? `
          <div class="absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
            <span>${lblEnrolled}</span>
          </div>
        ` : ''}
      </div>

      <!-- Card Body -->
      <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 text-${isRtl ? 'right' : 'left'}">
        
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 font-extrabold text-amber-500 font-mono">
              <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
              <span>${course.rating || 5.0}</span>
              <span class="text-slate-400 font-normal">(${course.ratingCount || 120} ${lblReviews})</span>
            </div>
            
            <div class="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-semibold">
              <i data-lucide="users" class="w-3.5 h-3.5 text-indigo-500"></i>
              <span>${course.enrolledCount ? course.enrolledCount.toLocaleString() : '1,500'}+ ${lblStudents}</span>
            </div>
          </div>

          <h4 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
            <a href="#/courses/${course.id}">${course.title}</a>
          </h4>

          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-semibold">
            ${course.shortDescription || course.subtitle || (lang === 'en' ? 'Comprehensive Islamic curriculum and tajweed mastery.' : (lang === 'ar' ? 'منهج إسلامي متكامل وتجويد القرآن الكريم.' : 'مستند اسلامی نصاب اور تجوید و قراءت کی شاہی کلاسز۔'))}
          </p>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
              ${course.isFree ? lblFree : `$${course.price}`}
            </span>
            <div class="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <i data-lucide="award" class="w-3.5 h-3.5"></i>
              <span>${lblCert}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <a href="#/courses/${course.id}" class="py-2.5 px-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition active:scale-95">
              ${lblViewDetails}
            </a>

            ${isEnrolled ? `
              <a href="#/learn/${course.id}" class="py-2.5 px-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1">
                <span>${lblContinue}</span>
                <i data-lucide="${iconArrow}" class="w-3.5 h-3.5"></i>
              </a>
            ` : `
              <button onclick="window.Views.enrollFreeCourse('${course.id}')" class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1">
                <span>${lblEnroll}</span>
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              </button>
            `}
          </div>
        </div>

      </div>

    </div>
  `;
};
