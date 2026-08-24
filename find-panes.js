
const fs = require('fs');
const c = fs.readFileSync('C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js','utf8');

// Find the two occurrences of book-tab-pane-pdf
// First one = openAddBookModal PDF tab
// Second one = openEditBookModal PDF tab

const pdfOcc1 = 106961 - 10; // approx start of first occurrence
const segment1 = c.substring(pdfOcc1, pdfOcc1 + 5000);

// Find next pane after pdf pane in add-modal
let npIdx1 = segment1.indexOf('id="book-tab-pane-', 50);
console.log('Next pane after ADD pdf pane:', npIdx1);
console.log('Context:', c.substring(pdfOcc1 + npIdx1 - 30, pdfOcc1 + npIdx1 + 80));

// Second occurrence
const pdfOcc2 = 128606 - 10;
const segment2 = c.substring(pdfOcc2, pdfOcc2 + 5000);
let npIdx2 = segment2.indexOf('id="book-tab-pane-', 50);
console.log('\nNext pane after EDIT pdf pane:', npIdx2);
console.log('Context:', c.substring(pdfOcc2 + npIdx2 - 30, pdfOcc2 + npIdx2 + 80));
