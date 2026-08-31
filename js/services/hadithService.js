/**
 * LearnHub Dedicated Hadith Science Service (v173.0.0)
 * Authentic Kutub al-Sittah collection search, reference lookup, and bookmarks.
 */

class HadithService {
  constructor() {
    this.collections = [
      { id: 'bukhari', title: 'صحیح بخاری', author: 'امام محمد بن اسماعیل بخاریؒ', totalHadiths: 7563 },
      { id: 'muslim', title: 'صحیح مسلم', author: 'امام مسلم بن الحجاجؒ', totalHadiths: 7500 },
      { id: 'tirmidhi', title: 'جامع ترمذی', author: 'امام ابو عیسیٰ محمد ترمذیؒ', totalHadiths: 3956 },
      { id: 'abudawud', title: 'سنن ابو داؤد', author: 'امام ابو داؤد سجستانیؒ', totalHadiths: 5274 },
      { id: 'nasai', title: 'سنن نسائی', author: 'امام احمد بن شعیب نسائیؒ', totalHadiths: 5758 },
      { id: 'ibnmajah', title: 'سنن ابن ماجہ', author: 'امام ابن ماجہ قزوینیؒ', totalHadiths: 4341 }
    ];
  }

  getCollections() {
    return this.collections;
  }

  async searchHadith(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return [];
    const all = (window.DB && window.DB.get('hadiths')) || [];
    return all.filter(h => 
      (h.textUrdu && h.textUrdu.includes(q)) || 
      (h.textArabic && h.textArabic.includes(q)) ||
      (h.reference && h.reference.toLowerCase().includes(q))
    );
  }
}

window.HadithService = new HadithService();
