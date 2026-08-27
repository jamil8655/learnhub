/**
 * LearnHub Complete 99 Asma-ul-Husna (Names of Allah) Suite (v87.0.0)
 * All 99 Divine Names of Allah with authentic vocalization, Urdu translations,
 * transliterations, spiritual meanings, search filters, and audio pronunciation.
 */

window.Views = window.Views || {};

const ASMA_UL_HUSNA_DATA = [
  { id: 1, arabic: 'الرَّحْمَٰنُ', urdu: 'نہایت مہربان', trans: 'Ar-Rahman', meaning: 'وہ ذات جس کی رحمت تمام کائنات اور تمام مخلوقات کو بلا تفریق گھیرے ہوئے ہے۔' },
  { id: 2, arabic: 'الرَّحِيمُ', urdu: 'بہت رحم فرمانے والا', trans: 'Ar-Raheem', meaning: 'مومنوں اور متقیوں پر خصوصی فضل، رحمت اور انعام فرمانے والا۔' },
  { id: 3, arabic: 'الْمَلِكُ', urdu: 'حقیقی بادشاہ', trans: 'Al-Malik', meaning: 'تمام کائنات اور مخلوقات کا خود مختار، بے نیاز اور حقیقی مالک و حاکم۔' },
  { id: 4, arabic: 'الْقُدُّوسُ', urdu: 'نہایت پاکیزہ و بے عیب', trans: 'Al-Quddus', meaning: 'ہر قسم کے عیب، نقص، کمزوری اور مخلوق کی صفات سے یکسر پاک ذات۔' },
  { id: 5, arabic: 'السَّلَامُ', urdu: 'سلامتی بخشنے والا', trans: 'As-Salam', meaning: 'جس کی ذات سراپا سلامتی، امن و عافیت ہے اور جو تمام آفتوں سے سلامتی دیتا ہے۔' },
  { id: 6, arabic: 'الْمُؤْمِنُ', urdu: 'امن و امان دینے والا', trans: "Al-Mu'min", meaning: 'اپنے بندوں کو خوف اور عذاب سے امان اور دلوں کو ایمان و اطمینان بخشنے والا۔' },
  { id: 7, arabic: 'الْمُهَيْمِنُ', urdu: 'نگہبان و نگرانِ کل', trans: 'Al-Muhaymin', meaning: 'ہر چیز پر پورا قابو رکھنے والا، مخلوق کے اعمال و احوال کی کامل نگرانی کرنے والا۔' },
  { id: 8, arabic: 'الْعَزِيزُ', urdu: 'سب پر غالب و زبردست', trans: 'Al-Aziz', meaning: 'ایسا زبردست اور غالب جس کے سامنے تمام طاقتیں بے بس ہیں اور جس پر کوئی غالب نہیں آ سکتا۔' },
  { id: 9, arabic: 'الْجَبَّارُ', urdu: 'زبردست و اصلاح فرمانے والا', trans: 'Al-Jabbar', meaning: 'جس کا حکم کائنات پر نافذ ہے اور جو ٹوٹے ہوئے دلوں کو جوڑنے اور درست فرمانے والا ہے۔' },
  { id: 10, arabic: 'الْمُتَكَبِّرُ', urdu: 'بزرگی اور عظمت والا', trans: 'Al-Mutakabbir', meaning: 'حقیقی کبریائی اور عظمت صرف اسی کے شایانِ شان ہے، جو ہر برائی اور نقص سے بالاتر ہے۔' },
  { id: 11, arabic: 'الْخَالِقُ', urdu: 'پیدا فرمانے والا', trans: 'Al-Khaliq', meaning: 'عدم سے وجود میں لانے والا اور ہر چیز کا اندازہ و خاکہ بنانے والا۔' },
  { id: 12, arabic: 'الْبَارِئُ', urdu: 'جان ڈالنے و مادہ بنانے والا', trans: 'Al-Bari', meaning: 'مخلوق کو عدم سے نکال کر ٹھیک ٹھیک تناسب کے ساتھ وجود عطا کرنے والا۔' },
  { id: 13, arabic: 'الْمُصَوِّرُ', urdu: 'صورت گری فرمانے والا', trans: 'Al-Musawwir', meaning: 'ہر مخلوق کو اس کی مناسبت کے مطابق خوبصورت اور جداگانہ شکل و صورت بخشنے والا۔' },
  { id: 14, arabic: 'الْغَفَّارُ', urdu: 'بہت بخشنے والا', trans: 'Al-Ghaffar', meaning: 'بندوں کے گناہوں پر پردہ ڈالنے والا اور بار بار معاف فرمانے والا۔' },
  { id: 15, arabic: 'الْقَهَّارُ', urdu: 'سب پر پورا قابو رکھنے والا', trans: 'Al-Qahhar', meaning: 'تمام سرکشوں اور متکبرین کو مغلوب فرمانے والا، جس کے آگے ہر چیز بے بس ہے۔' },
  { id: 16, arabic: 'الْوَهَّابُ', urdu: 'بے غرض و کثرت سے عطا فرمانے والا', trans: 'Al-Wahhab', meaning: 'بغیر کسی معاوضے اور طلب کے اپنے خزانوں سے بے شمار نعمتیں عطا کرنے والا۔' },
  { id: 17, arabic: 'الرَّزَّاقُ', urdu: 'سب کو روزی دینے والا', trans: 'Ar-Razzaq', meaning: 'کائنات کے تمام جانداروں کو جسمانی اور روحانی روزی اور رزق فراہم کرنے والا۔' },
  { id: 18, arabic: 'الْفَتَّاحُ', urdu: 'مشکل کشا و راستے کھولنے والا', trans: 'Al-Fattah', meaning: 'بند راستے کھولنے والا، حق و باطل کا فیصلہ فرمانے والا اور رحمت کے دروازے کھولنے والا۔' },
  { id: 19, arabic: 'الْعَلِيمُ', urdu: 'سب کچھ جاننے والا', trans: 'Al-Aleem', meaning: 'جس کا علم ہر ظاہر، پوشیدہ، ماضی، حال اور مستقبل کا کامل احاطہ کیے ہوئے ہے۔' },
  { id: 20, arabic: 'الْقَابِضُ', urdu: 'روزی و جان کو روکنے والا', trans: 'Al-Qabid', meaning: 'اپنی حکمت کے مطابق جس کے لیے چاہے رزق تنگ کر دے اور روحوں کو قبض فرمائے۔' },
  { id: 21, arabic: 'الْبَاسِطُ', urdu: 'فراخی و کشادگی بخشنے والا', trans: 'Al-Basit', meaning: 'رزق، دلوں اور رحمت کو اپنے فضل سے کشادہ اور وسیع فرمانے والا۔' },
  { id: 22, arabic: 'الْخَافِضُ', urdu: 'پست کرنے والا', trans: 'Al-Khafid', meaning: 'نافرمانوں، کافروں اور سرکشوں کو ذلیل اور پست کرنے والا۔' },
  { id: 23, arabic: 'الرَّافِعُ', urdu: 'بلند فرمانے والا', trans: 'Ar-Rafi', meaning: 'اپنے مخلص بندوں اور متقیوں کے درجات کو دنیا و آخرت میں بلند کرنے والا۔' },
  { id: 24, arabic: 'الْمُعِزُّ', urdu: 'عزت بخشنے والا', trans: "Al-Mu'izz", meaning: 'جسے چاہے اپنی اطاعت اور توفیق کے ذریعے عزت و شرف عطا فرمائے۔' },
  { id: 25, arabic: 'الْمُذِلُّ', urdu: 'رسوا و ذلیل کرنے والا', trans: 'Al-Mudhill', meaning: 'نافرمانوں اور حق کے منکرین کو ذلت و رسوائی میں ڈالنے والا۔' },
  { id: 26, arabic: 'السَّمِيعُ', urdu: 'سب کچھ سننے والا', trans: 'As-Samee', meaning: 'ہر پکار، سرگوشی اور دل کی دعا کو بغیر کسی رکاوٹ کے سننے والا۔' },
  { id: 27, arabic: 'الْبَصِيرُ', urdu: 'سب کچھ دیکھنے والا', trans: 'Al-Baseer', meaning: 'ہر چھوٹی سے چھوٹی چیز، تاریک رات میں سیاہ چیونٹی کی حرکت کو بھی دیکھنے والا۔' },
  { id: 28, arabic: 'الْحَكَمُ', urdu: 'حقیقی منصف و حاکم', trans: 'Al-Hakam', meaning: 'کامل عدل کے ساتھ فیصلہ فرمانے والا، جس کے فیصلے کو کوئی رد نہیں کر سکتا۔' },
  { id: 29, arabic: 'الْعَدْلُ', urdu: 'سراپا عدل و انصاف', trans: 'Al-Adl', meaning: 'جس کے تمام افعال اور احکام انصاف پر مبنی ہیں اور جس میں ظلم کا شائبہ نہیں۔' },
  { id: 30, arabic: 'اللَّطِيفُ', urdu: 'نہایت باریک بین و مہربان', trans: 'Al-Lateef', meaning: 'باریکیوں کا علم رکھنے والا اور بندوں پر ایسے طریقوں سے احسان کرنے والا جن کا گمان نہ ہو۔' },
  { id: 31, arabic: 'الْخَبِيرُ', urdu: 'ہر بات سے باخبر', trans: 'Al-Khabeer', meaning: 'ہر معاملے اور راز کی تہہ اور حقیقت سے کامل طور پر باخبر۔' },
  { id: 32, arabic: 'الْحَلِيمُ', urdu: 'نہایت بردبار و تحمل والا', trans: 'Al-Haleem', meaning: 'گناہوں اور نافرمانیوں کے باوجود فوراً عذاب نہ دینے والا اور مہلت عطا فرمانے والا۔' },
  { id: 33, arabic: 'الْعَظِيمُ', urdu: 'نہایت عظمت و بزرگی والا', trans: 'Al-Azeem', meaning: 'جس کی عظمت، شان اور جلال کی کوئی انتہا اور حد نہیں۔' },
  { id: 34, arabic: 'الْغَفُورُ', urdu: 'بے حد معاف فرمانے والا', trans: 'Al-Ghafoor', meaning: 'کثرت سے گناہ معاف کرنے والا اور توبہ کرنے والوں پر رحم فرمانے والا۔' },
  { id: 35, arabic: 'الشَّكُورُ', urdu: 'قدردانی فرمانے والا', trans: 'Ash-Shakoor', meaning: 'تھوڑے سے نیک عمل پر بے شمار اجر و ثواب اور بلند درجات عطا فرمانے والا۔' },
  { id: 36, arabic: 'الْعَلِيُّ', urdu: 'سب سے بلند و بالا', trans: 'Al-Aliyy', meaning: 'ذات، صفات، قدرت اور اقتدار میں ہر چیز سے اعلیٰ و ارفع۔' },
  { id: 37, arabic: 'الْكَبِيرُ', urdu: 'سب سے بڑا و بزرگ', trans: 'Al-Kabeer', meaning: 'جس کی کبریائی اور جلال کے سامنے ساری کائنات ہیچ ہے۔' },
  { id: 38, arabic: 'الْحَفِيظُ', urdu: 'سب کی حفاظت فرمانے والا', trans: 'Al-Hafeez', meaning: 'زمین و آسمان کے نظام اور مخلوقات کی ہر آفت سے کامل حفاظت کرنے والا۔' },
  { id: 39, arabic: 'الْمُقِيتُ', urdu: 'سب کو طاقت و غذا دینے والا', trans: 'Al-Muqeet', meaning: 'جسموں اور روحوں کی ضروریات اور روزی کا پورا بندوبست فرمانے والا۔' },
  { id: 40, arabic: 'الْحَسِيبُ', urdu: 'کفایت کرنے والا و حساب لینے والا', trans: 'Al-Haseeb', meaning: 'اپنے بندوں کے تمام معاملات میں کافی اور قیامت کے دن حساب لینے والا۔' },
  { id: 41, arabic: 'الْجَلِيلُ', urdu: 'صاحبِ جلال و بزرگی', trans: 'Al-Jaleel', meaning: 'بڑی شان، عظمت، جلالت اور شکوہ والا۔' },
  { id: 42, arabic: 'الْكَرِيمُ', urdu: 'بے حد کرم فرمانے والا', trans: 'Al-Kareem', meaning: 'بے غرض عطا فرمانے والا، درگزر کرنے والا اور کثرت سے احسان کرنے والا۔' },
  { id: 43, arabic: 'الرَّقِيبُ', urdu: 'ہر وقت کا نگراں', trans: 'Ar-Raqeeb', meaning: 'ہر لمحہ تمام حرکات، سکنات اور نیتوں پر نظر رکھنے والا۔' },
  { id: 44, arabic: 'الْمُجِيبُ', urdu: 'دعائیں قبول فرمانے والا', trans: 'Al-Mujeeb', meaning: 'پکارنے والے کی پکار کا جواب دینے والا اور دعاؤں کو شرفِ قبولیت بخشنے والا۔' },
  { id: 45, arabic: 'الْوَاسِعُ', urdu: 'بے حد وسعت والا', trans: 'Al-Wasi', meaning: 'جس کی رحمت، علم، رزق اور مغفرت تمام کائنات پر وسیع ہے۔' },
  { id: 46, arabic: 'الْحَكِيمُ', urdu: 'بڑی حکمت والا', trans: 'Al-Hakeem', meaning: 'جس کا ہر کام، ہر حکم اور ہر تقدیر حکمت اور دانائی پر مبنی ہے۔' },
  { id: 47, arabic: 'الْوَدُودُ', urdu: 'بے پناہ محبت فرمانے والا', trans: 'Al-Wadood', meaning: 'اپنے مومن بندوں سے خالص محبت کرنے والا اور ان کے دلوں میں اپنی محبت ڈالنے والا۔' },
  { id: 48, arabic: 'الْمَجِيدُ', urdu: 'بڑی شان و فضیلت والا', trans: 'Al-Majeed', meaning: 'شرف، بزرگی، کرم اور احسان میں بے مثال ذات۔' },
  { id: 49, arabic: 'الْبَاعِثُ', urdu: 'مردوں کو زندہ فرمانے والا', trans: "Al-Ba'ith", meaning: 'قیامت کے دن انسانوں کو دوبارہ زندہ کر کے حساب کے لیے اٹھانے والا۔' },
  { id: 50, arabic: 'الشَّهِيدُ', urdu: 'ہر جگہ حاضر و ناظر', trans: 'Ash-Shaheed', meaning: 'جس سے کوئی بھی چیز چھپی ہوئی نہیں اور جو ہر عمل کا گواہ ہے۔' },
  { id: 51, arabic: 'الْحَقُّ', urdu: 'بالکل سچ اور برحق', trans: 'Al-Haqq', meaning: 'جس کا وجود سچ، وعدہ سچ اور کلام بالکل حق اور سچ ہے۔' },
  { id: 52, arabic: 'الْوَكِيلُ', urdu: 'بہترین کارساز و نگہبان', trans: 'Al-Wakeel', meaning: 'جس پر بھروسہ کیا جائے اور جو تمام بگڑے کام سنوارنے والا ہو۔' },
  { id: 53, arabic: 'الْقَوِيُّ', urdu: 'بڑی قوت و طاقت والا', trans: 'Al-Qawiyy', meaning: 'جس کی قدرت کامل ہے اور جسے کوئی طاقت عاجز نہیں کر سکتی۔' },
  { id: 54, arabic: 'الْمَتِينُ', urdu: 'نہایت مضبوط و پختہ', trans: 'Al-Mateen', meaning: 'جس کی قوت میں کبھی کمزوری اور انحطاط نہیں آتا۔' },
  { id: 55, arabic: 'الْوَلِيُّ', urdu: 'حقیقی دوست و مددگار', trans: 'Al-Waliyy', meaning: 'مومنوں کا مربی، مددگار اور خیرخواہ سرپرست۔' },
  { id: 56, arabic: 'الْحَمِيدُ', urdu: 'ہر تعریف کا سزاوار', trans: 'Al-Hameed', meaning: 'جس کی ہر حال میں اور ہر نعمت پر حمد و ثناء واجب ہے۔' },
  { id: 57, arabic: 'الْمُحْصِي', urdu: 'ہر چیز کا احاطہ و شمار کرنے والا', trans: 'Al-Muhsee', meaning: 'کائنات کے ہر ذرے اور بندوں کے تمام اعمال کا مکمل حساب رکھنے والا۔' },
  { id: 58, arabic: 'الْمُبْدِئُ', urdu: 'پہلی بار عدم سے پیدا فرمانے والا', trans: 'Al-Mubdi', meaning: 'بغیر کسی سابقہ نمونے کے کائنات کو عدم سے وجود بخشنے والا۔' },
  { id: 59, arabic: 'الْمُعِيدُ', urdu: 'دوبارہ لوٹانے اور زندہ فرمانے والا', trans: "Al-Mu'eed", meaning: 'فنا ہو جانے کے بعد مخلوق کو دوبارہ اصلی حالت میں لوٹانے والا۔' },
  { id: 60, arabic: 'الْمُحْيِي', urdu: 'زندگی بخشنے والا', trans: 'Al-Muhyee', meaning: 'بے جان مادے میں روح اور زندگی کی روح پھونکنے والا۔' },
  { id: 61, arabic: 'الْمُمِيتُ', urdu: 'موت دینے والا', trans: 'Al-Mumeet', meaning: 'زندہ اجسام سے روح قبض کر کے موت طاری کرنے والا۔' },
  { id: 62, arabic: 'الْحَيُّ', urdu: 'ہمیشہ زندہ رہنے والا', trans: 'Al-Hayy', meaning: 'جس کے لیے کبھی موت، نیند یا زوال نہیں ہے، ازل سے ابد تک قائم۔' },
  { id: 63, arabic: 'الْقَيُّومُ', urdu: 'کائنات کو قائم رکھنے والا', trans: 'Al-Qayyoom', meaning: 'جو خود قائم ہے اور جس کے سہارے تمام زمین و آسمان قائم ہیں۔' },
  { id: 64, arabic: 'الْوَاجِدُ', urdu: 'سب کچھ پانے والا', trans: 'Al-Wajid', meaning: 'جس کے پاس ہر چیز موجود ہے اور جو کسی چیز کا محتاج نہیں۔' },
  { id: 65, arabic: 'الْمَاجِدُ', urdu: 'بزرگی اور عزت والا', trans: 'Al-Majid', meaning: 'شرف، بلندی اور بے پایاں جود و کرم والی ذات۔' },
  { id: 66, arabic: 'الْوَاحِدُ', urdu: 'ایک اور یکتا', trans: 'Al-Wahid', meaning: 'جو اپنی ذات، صفات اور افعال میں اکیلا اور بے مثل ہے۔' },
  { id: 67, arabic: 'الْأَحَدُ', urdu: 'یگانہ و لاثانی', trans: 'Al-Ahad', meaning: 'جس کا کوئی ثانی، شریک یا حصہ دار نہیں ہے۔' },
  { id: 68, arabic: 'الصَّمَدُ', urdu: 'بے نیاز و سب کا سہارا', trans: 'As-Samad', meaning: 'وہ ذات جو کسی کی محتاج نہیں جبکہ ساری کائنات اس کی محتاج ہے۔' },
  { id: 69, arabic: 'الْقَادِرُ', urdu: 'کامل قدرت والا', trans: 'Al-Qadir', meaning: 'جو جو چاہے کر گزرنے پر مکمل قدرت اور اختیار رکھتا ہے۔' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', urdu: 'زبردست اقتدار و قدرت والا', trans: 'Al-Muqtadir', meaning: 'جس کی قدرت مطلقہ کے سامنے کوئی چیز رکاوٹ نہیں بن سکتی۔' },
  { id: 71, arabic: 'الْمُقَدِّمُ', urdu: 'آگے بڑھانے اور قرب بخشنے والا', trans: 'Al-Muqaddim', meaning: 'جسے چاہے اپنے فضل سے آگے بڑھائے اور درجات میں بلندی عطا کرے۔' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', urdu: 'پیچھے ہٹانے والا', trans: "Al-Mu'akhkhir", meaning: 'اپنی حکمت کے مطابق جس کو چاہے پیچھے ہٹا دے۔' },
  { id: 73, arabic: 'الْأَوَّلُ', urdu: 'سب سے پہلا', trans: 'Al-Awwal', meaning: 'جس سے پہلے کوئی چیز نہ تھی اور جو ہمیشہ سے ہے۔' },
  { id: 74, arabic: 'الْآخِرُ', urdu: 'سب کے بعد باقی رہنے والا', trans: 'Al-Akhir', meaning: 'جب سب کچھ فنا ہو جائے گا تب بھی وہی ہمیشہ باقی رہے گا۔' },
  { id: 75, arabic: 'الظَّاهِرُ', urdu: 'نشانیوں سے بالکل ظاہر', trans: 'Az-Zahir', meaning: 'جس کا وجود اور قدرت کائنات کی ہر نشانی سے عیاں اور ظاہر ہے۔' },
  { id: 76, arabic: 'الْبَاطِنُ', urdu: 'نگاہوں سے پوشیدہ و مخفی', trans: 'Al-Batin', meaning: 'جو دنیا میں انسانی آنکھوں سے مخفی ہے مگر ہر مخفی بات کو جانتا ہے۔' },
  { id: 77, arabic: 'الْوَالِي', urdu: 'تمام کائنات کا کارساز و والی', trans: 'Al-Waali', meaning: 'جو کائنات کے تمام امور کا نگران اور تنہا حاکم ہے۔' },
  { id: 78, arabic: 'الْمُتَعَالِي', urdu: 'سب سے بلند و برتر', trans: "Al-Muta'ali", meaning: 'ہر نقص، عیب اور مخلوق کی صفات سے بے حد بلند و بالا۔' },
  { id: 79, arabic: 'الْبَرُّ', urdu: 'بڑا احسان و نیکی فرمانے والا', trans: 'Al-Barr', meaning: 'اپنے بندوں پر کثرت سے نیکی، بھلائی اور احسان کرنے والا۔' },
  { id: 80, arabic: 'التَّوَّابُ', urdu: 'توبہ قبول فرمانے والا', trans: 'At-Tawwab', meaning: 'بار بار رجوع کرنے والوں کی توبہ قبول فرمانے والا۔' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', urdu: 'ظالموں سے بدلہ لینے والا', trans: 'Al-Muntaqim', meaning: 'سرکشوں، ظالموں اور نافرمانوں کو عبرتناک سزا دینے والا۔' },
  { id: 82, arabic: 'الْعَفُوُّ', urdu: 'گناہوں کو مٹا دینے والا', trans: 'Al-Afuww', meaning: 'گناہوں کو اس طرح معاف کرنے والا کہ ان کا نام و نشان تک نہ رہے۔' },
  { id: 83, arabic: 'الرَّءُوفُ', urdu: 'نہایت مشفق و مہربان', trans: "Ar-Ra'oof", meaning: 'انتہائی شفقت، نرمی اور رحمت فرمانے والی ذات۔' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', urdu: 'حقیقی بادشاہی کا تنہا مالک', trans: 'Malik-ul-Mulk', meaning: 'ساری کائنات، حکومتوں اور اختیارات کا واحد اور خود مختار مالک۔' },
  { id: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', urdu: 'عظمت، جلال اور انعام والا', trans: 'Dhul-Jalali wal-Ikram', meaning: 'بزرگی، شکوہ، ہیبت اور بندوں پر لطف و کرم فرمانے والا۔' },
  { id: 86, arabic: 'الْمُقْسِطُ', urdu: 'عدل و انصاف قائم فرمانے والا', trans: 'Al-Muqsit', meaning: 'مظلوم کو ظالم سے حق دلانے اور عدل قائم کرنے والا۔' },
  { id: 87, arabic: 'الْجَامِعُ', urdu: 'قیامت کے دن سب کو جمع کرنے والا', trans: 'Al-Jami', meaning: 'تمام اولین و آخرین کو حشر کے میدان میں حساب کے لیے جمع کرنے والا۔' },
  { id: 88, arabic: 'الْغَنِيُّ', urdu: 'بے نیاز اور غنی', trans: 'Al-Ghaniyy', meaning: 'جو کسی بھی مخلوق کا محتاج نہیں اور جس کے خزانے لامحدود ہیں۔' },
  { id: 89, arabic: 'الْمُغْنِي', urdu: 'غنی و بے نیاز کرنے والا', trans: 'Al-Mughni', meaning: 'جسے چاہے اپنے فضل اور خزانوں سے غنی اور دولت مند بنا دے۔' },
  { id: 90, arabic: 'الْمَانِعُ', urdu: 'روکنے اور حفاظت فرمانے والا', trans: 'Al-Mani', meaning: 'جس چیز کو چاہے اپنی حکمت سے روک دے اور مصیبتوں سے بچائے۔' },
  { id: 91, arabic: 'الضَّارُّ', urdu: 'نقصان پہنچانے پر قادر', trans: 'Ad-Darr', meaning: 'اپنی حکمت کے مطابق نافرمانوں کو آزمائش اور نقصان میں ڈالنے والا۔' },
  { id: 92, arabic: 'النَّافِعُ', urdu: 'نفع اور بھلائی بخشنے والا', trans: 'An-Nafi', meaning: 'ہر قسم کا نفع، بھلائی اور خیر عطا فرمانے والا۔' },
  { id: 93, arabic: 'النُّورُ', urdu: 'آسمانوں اور زمین کا نور', trans: 'An-Noor', meaning: 'جس کے نور سے تمام کائنات روشن اور دل منور ہوتے ہیں۔' },
  { id: 94, arabic: 'الْهَادِي', urdu: 'سیدھی راہ دکھانے والا ہدایت کار', trans: 'Al-Hadi', meaning: 'اپنے بندوں کو صراطِ مستقیم اور حق کی رہنمائی فرمانے والا۔' },
  { id: 95, arabic: 'الْبَدِيعُ', urdu: 'بے مثال کائنات تخلیق فرمانے والا', trans: 'Al-Badi', meaning: 'بغیر کسی سابقہ نقشے اور نمونے کے حیرت انگیز کائنات بنانے والا۔' },
  { id: 96, arabic: 'الْبَاقِي', urdu: 'ہمیشہ باقی رہنے والا', trans: 'Al-Baqi', meaning: 'جس کے لیے کبھی فنا اور موت نہیں، جو ابد الآباد تک رہے گا۔' },
  { id: 97, arabic: 'الْوَارِثُ', urdu: 'سب کے فنا کے بعد اصل وارث', trans: 'Al-Warith', meaning: 'ساری کائنات کے فنا ہونے کے بعد تمام ملکیت کا حقیقی وارث۔' },
  { id: 98, arabic: 'الرَّشِيدُ', urdu: 'درست تدبیر و رہنمائی فرمانے والا', trans: 'Ar-Rasheed', meaning: 'جس کا ہر کام راستی، درستگی اور حکمت پر مبنی ہے۔' },
  { id: 99, arabic: 'الصَّبُورُ', urdu: 'بے حد صبر و حلم والا', trans: 'As-Saboor', meaning: 'گناہ گاروں کو سزا دینے میں جلدی نہ کرنے والا اور بے پایاں تحمل والا۔' }
];

window.Views.renderAsmaulHusna = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Asmaul Husna Hero Banner -->
      <div class="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-400/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
          <span>✨ وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">99 اسمائے حسنیٰ مع صوتی قراءت و فضائل</h1>
        <p class="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
          رسول اللہ ﷺ نے فرمایا: "اللہ تعالیٰ کے 99 نام ہیں، جو شخص ان کو یاد رکھے گا وہ جنت میں داخل ہو گا۔" (صحیح بخاری: 2736، صحیح مسلم: 2677)۔
        </p>
      </div>

      <!-- Search & Quick Navigation Stats -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <input 
            type="text" 
            id="asma-search-input"
            placeholder="اللہ کا نام، انگریزی تلفظ یا اردو معنی تلاش کریں..." 
            oninput="window.Views.filterAsmaNames(this.value)"
            class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm text-right"
          />
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
        </div>

        <div class="flex items-center gap-3">
          <span class="badge bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/30 text-xs font-bold font-mono">
            کل ${ASMA_UL_HUSNA_DATA.length} مبارک اسماء دستیاب ہیں
          </span>
        </div>
      </div>

      <!-- Names Grid -->
      <div id="asma-names-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        ${window.Views.renderAsmaCardsHtml(ASMA_UL_HUSNA_DATA)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderAsmaCardsHtml = function(names) {
  return names.map(n => `
    <button 
      onclick="window.Views.openAsmaDetailModal(${n.id})"
      class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-lg text-center space-y-2.5 group"
    >
      <span class="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-mono font-bold mx-auto border border-amber-300/40">
        ${n.id}
      </span>
      <h3 class="text-2xl sm:text-3xl font-arabic font-extrabold text-emerald-800 dark:text-emerald-400 group-hover:text-amber-500 transition leading-tight">
        ${n.arabic}
      </h3>
      <p class="text-xs font-sans text-slate-400 font-bold" dir="ltr">${n.trans}</p>
      <p class="text-xs sm:text-sm font-urdu font-black text-slate-800 dark:text-slate-200">${n.urdu}</p>
      <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
        <span>سنیں و فضائل</span>
      </div>
    </button>
  `).join('');
};

window.Views.filterAsmaNames = function(query) {
  const grid = document.getElementById('asma-names-grid');
  if (!grid) return;
  if (!query || query.trim() === '') {
    grid.innerHTML = window.Views.renderAsmaCardsHtml(ASMA_UL_HUSNA_DATA);
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  const q = query.trim().toLowerCase();
  const filtered = ASMA_UL_HUSNA_DATA.filter(n => 
    n.arabic.includes(q) || 
    n.urdu.includes(q) || 
    n.trans.toLowerCase().includes(q) ||
    n.meaning.includes(q) ||
    n.id.toString() === q
  );
  grid.innerHTML = filtered.length > 0 
    ? window.Views.renderAsmaCardsHtml(filtered)
    : `<div class="col-span-full py-12 text-center text-slate-400 font-urdu text-sm">کوئی مبارک نام نہیں ملا۔</div>`;
  if (window.lucide) window.lucide.createIcons();
};

window.Views.openAsmaDetailModal = function(nameId) {
  const item = ASMA_UL_HUSNA_DATA.find(n => n.id === nameId);
  if (!item) return;

  // Speak Arabic
  window.Views.speakAsmaName(item.arabic);

  const modal = `
    <div id="asma-detail-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 shadow-2xl space-y-5 text-center relative overflow-hidden">
        
        <button onclick="document.getElementById('asma-detail-modal').remove()" class="absolute top-4 left-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <span class="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold border border-amber-400/30">
          اسم نمبر ${item.id} از 99
        </span>

        <h2 class="text-4xl sm:text-5xl font-arabic font-extrabold text-emerald-800 dark:text-emerald-400 py-1">
          ${item.arabic}
        </h2>
        
        <div class="space-y-1">
          <p class="text-sm font-sans font-bold text-slate-400" dir="ltr">${item.trans}</p>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">${item.urdu}</h3>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-right">
          <span class="font-bold text-amber-700 dark:text-amber-400 block mb-1">📖 ایمانی مفہوم و تشریح:</span>
          ${item.meaning}
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="window.Views.speakAsmaName('${item.arabic}')" class="btn-primary py-2.5 px-6 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 flex items-center gap-1.5 shadow-lg active:scale-95 transition">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
            <span>تلفظ سنیں</span>
          </button>
          <button onclick="document.getElementById('asma-detail-modal').remove()" class="py-2.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            بند کریں
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('asma-detail-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.speakAsmaName = function(arabicText) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(arabicText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
};
