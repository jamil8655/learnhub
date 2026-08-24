
// Patch getLibraryBooks and saveEditBook bugs
const fs = require('fs');

// ── Fix 1: libraryData.js ──────────────────────────────────────────────────
const libPath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/data/libraryData.js';
let libContent = fs.readFileSync(libPath, 'utf8');

const oldGetLib = `window.getLibraryBooks = function() {
  const defaultBooks = window.ISLAMIC_LIBRARY_BOOKS || [];
  try {
    const dbBooks = window.DB ? window.DB.get('libraryBooks') : null;
    if (dbBooks && Array.isArray(dbBooks) && dbBooks.length >= 50) {
      return dbBooks;
    }
    
    // Extract any user custom created books if they exist in older small arrays
    const customBooks = Array.isArray(dbBooks) 
      ? dbBooks.filter(b => b && typeof b.id === 'string' && b.id.startsWith('bk-user-'))
      : [];

    const merged = [...customBooks, ...defaultBooks];
    if (window.DB) {
      window.DB.set('libraryBooks', merged);
      window.DB.save();
    }
    return merged;
  } catch (e) {
    console.warn('[Library] DB error, using default catalog:', e);
    return defaultBooks;
  }
};`;

const newGetLib = `window.getLibraryBooks = function() {
  const defaultBooks = window.ISLAMIC_LIBRARY_BOOKS || [];
  try {
    const dbBooks = window.DB ? window.DB.get('libraryBooks') : null;

    // If DB has a valid saved array (any length), use it — it may contain edited versions
    if (dbBooks && Array.isArray(dbBooks) && dbBooks.length > 0) {
      return dbBooks;
    }

    // First run: merge user custom books with default catalog and save
    const merged = [...defaultBooks];
    if (window.DB) {
      window.DB.set('libraryBooks', merged);
      window.DB.save();
    }
    return merged;
  } catch (e) {
    console.warn('[Library] DB error, using default catalog:', e);
    return defaultBooks;
  }
};`;

if (libContent.includes(oldGetLib)) {
  libContent = libContent.replace(oldGetLib, newGetLib);
  fs.writeFileSync(libPath, libContent, 'utf8');
  console.log('✅ libraryData.js: getLibraryBooks fixed!');
} else {
  // Try a looser replacement using start marker
  const markerStart = 'window.getLibraryBooks = function() {';
  const startIdx = libContent.indexOf(markerStart);
  if (startIdx === -1) { console.error('getLibraryBooks not found!'); process.exit(1); }
  // Find end by brace counting
  let depth = 0;
  let endIdx = startIdx;
  let started = false;
  for (let i = startIdx; i < libContent.length; i++) {
    if (libContent[i] === '{') { depth++; started = true; }
    if (libContent[i] === '}') depth--;
    if (started && depth === 0) { endIdx = i + 1; break; }
  }
  if (libContent[endIdx] === ';') endIdx++;
  libContent = libContent.slice(0, startIdx) + newGetLib + libContent.slice(endIdx);
  fs.writeFileSync(libPath, libContent, 'utf8');
  console.log('✅ libraryData.js: getLibraryBooks replaced via brace counting!');
}

// ── Fix 2: islamicFeatures.js — saveEditBook ──────────────────────────────
const featPath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let featContent = fs.readFileSync(featPath, 'utf8');

// The bug: saveEditBook mutates the book object from getLibraryBooks() array
// but then calls DB.set('libraryBooks', books) — this is correct ONLY if
// getLibraryBooks() returned the actual DB array. Now that we fixed getLibraryBooks
// to always return DB array when non-empty, saveEditBook will work correctly.
// But we also need to ensure the book found is actually updated in the books array
// before saving, not just mutated in-place (in case getLibraryBooks returns a copy).

const oldSaveEdit = `window.Views.saveEditBook = function(e, bookId) {
  e.preventDefault();
  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  var book = books.find(function(b) { return b.id === bookId; });
  if (!book) return;

  book.title = document.getElementById('edit-book-title').value.trim();`;

const newSaveEdit = `window.Views.saveEditBook = function(e, bookId) {
  e.preventDefault();
  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];
  var bookIdx = books.findIndex(function(b) { return b.id === bookId; });
  if (bookIdx === -1) { if (window.App) window.App.showToast('کتاب نہیں ملی!', 'error'); return; }
  var book = Object.assign({}, books[bookIdx]); // clone to avoid mutating read-only static objects

  book.title = document.getElementById('edit-book-title').value.trim();`;

if (featContent.includes(oldSaveEdit)) {
  // Also patch the save line: replace books[bookIdx] with updated book before DB.set
  featContent = featContent.replace(oldSaveEdit, newSaveEdit);

  // Now patch the DB.set line to put the updated book back into the array
  const oldDbSet = `  if (window.DB) { window.DB.set('libraryBooks', books); window.DB.save(); }
  document.getElementById('edit-book-modal').remove();`;
  const newDbSet = `  books[bookIdx] = book; // put updated clone back into array
  if (window.DB) { window.DB.set('libraryBooks', books); window.DB.save(); }
  document.getElementById('edit-book-modal').remove();`;

  if (featContent.includes(oldDbSet)) {
    featContent = featContent.replace(oldDbSet, newDbSet);
    console.log('✅ islamicFeatures.js: saveEditBook DB.set patched!');
  } else {
    console.log('⚠️ DB.set line not found for patch — may already be correct');
  }

  fs.writeFileSync(featPath, featContent, 'utf8');
  console.log('✅ islamicFeatures.js: saveEditBook findIndex + clone applied!');
} else {
  console.log('⚠️ saveEditBook old pattern not found — checking current state...');
  const idx2 = featContent.indexOf('window.Views.saveEditBook = function(e, bookId)');
  console.log('saveEditBook function at char:', idx2);
  console.log(featContent.substring(idx2, idx2 + 300));
}
