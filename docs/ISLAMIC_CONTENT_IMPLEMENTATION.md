# LearnHub Islamic Content Production Implementation

This document defines the production implementation contract for the Islamic content module.

## Core modules

1. Quran document management
   - One complete PDF covering all 114 surahs.
   - Firebase Storage object path: `quran/full-quran/{documentId}/quran.pdf`.
   - Firestore stores metadata only: title, Arabic title, filename, storage path/reference, download URL when appropriate, size, MIME type, page count, status, uploader, timestamps, version and active/published state.
   - Resumable upload with progress, speed, pause/resume/cancel, retry, duplicate protection and clear errors.

2. Tafsir management
   - Generic Tafsir entity rather than a single hard-coded source.
   - Admin create/upload/edit/replace/unpublish/delete/preview.
   - User reader with Surah/Ayah selection, previous/next navigation, search, RTL layout, font controls, reading position and PDF fallback.

3. Shahi Islamic Status Card Generator
   - Single Ayah, multiple Ayahs, selected range and complete Surah modes.
   - Complete Surah automatically paginates into multiple cards based on measured content height.
   - Never split or reorder an Ayah.
   - Arabic-only, Arabic + Urdu and Arabic + English modes.
   - Square, social post, story/status and custom dimensions.
   - PNG, JPG, PDF and ZIP for multi-card Surah exports.

4. Security
   - Firebase Authentication plus role/custom-claim authorization.
   - Admin-only Quran/Tafsir writes.
   - User-owned generated-card storage.
   - No broad authenticated-user Storage fallback.
   - Validate file type and size in Storage Rules as well as in the UI.
   - App Check should be enabled/enforced for the production Firebase services supported by the project.

## Additional production features to implement where compatible with the existing app

- Quran search by Surah, Ayah and Arabic/Urdu/English text.
- Bookmarks and favorites per Ayah.
- Personal notes on Ayahs.
- Continue-reading position.
- Audio recitation with play/pause, next/previous, repeat Ayah/range and auto-scroll.
- Multiple reciters through a provider abstraction.
- Translation selector.
- Tafsir selector with source/author/language metadata.
- Offline cache for recently read Quran/Tafsir content where licensing and app architecture permit.
- Share Ayah as text/image/card.
- Copy Ayah with Surah/Ayah citation.
- Tajweed display only when a verified Tajweed source is used.
- Reading progress for each Surah/Juz.
- Juz/Para and page navigation.
- Hizb/Rub and Manzil navigation.
- Last-read history.
- Daily Ayah / reminder content only when the user explicitly enables it.
- Admin content versioning and rollback.
- Upload integrity checks and duplicate detection using hash/metadata.
- Centralized error handling, logging and retry UI.
- Loading, empty, success and error states for every asynchronous content operation.
- Mobile-first RTL reader and desktop responsive layouts.
- Accessibility: keyboard navigation, semantic controls, contrast, scalable text and screen-reader labels.
- Performance: lazy loading, pagination/virtualization for long Tafsir, cached metadata and no large Base64 blobs in Firestore.

## Non-negotiable content integrity

- Quran Arabic text must never be generated, paraphrased or silently modified by AI.
- Ayah order and numbering must remain authoritative from the stored/verified Quran dataset.
- Complete-Surah card pagination must operate on Ayah boundaries.
- Decorative templates must never reduce Quran readability.
- Tafsir must retain its source/author metadata and must not be presented as Quran text.
