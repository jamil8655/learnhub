// Measures the REAL bottom nav in the real page across every required width.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const widths = [320, 360, 375, 390, 414, 768, 1024, 1280, 1920];
const rows = [];

// Tailwind is served from a CDN this sandbox blocks, so the utility classes on
// the nav would not apply and every measurement would be of a collapsed inline
// layout. This shim supplies exactly the utilities the bottom nav uses, with
// Tailwind's real values, so the geometry measured here matches production.
const TW_SHIM = `
.fixed{position:fixed}.relative{position:relative}
.left-1\\/2{left:50%}.z-40{z-index:40}
.w-\\[calc\\(100\\%-1\\.5rem\\)\\]{width:calc(100% - 1.5rem)}
.max-w-full{max-width:100%}
.grid{display:grid}.grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}
.gap-1{gap:0.25rem}.items-center{align-items:center}.text-center{text-align:center}
.flex{display:flex}.flex-col{flex-direction:column}.justify-center{justify-content:center}
.min-w-0{min-width:0}.w-full{width:100%}.shrink-0{flex-shrink:0}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.text-\\[10px\\]{font-size:10px}.font-bold{font-weight:700}.font-black{font-weight:900}
.py-1{padding-top:0.25rem;padding-bottom:0.25rem}
.mb-0\\.5{margin-bottom:0.125rem}
.w-5{width:1.25rem}.h-5{height:1.25rem}.w-6{width:1.5rem}.h-6{height:1.5rem}
.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}
.border{border-width:1px}.border-2{border-width:2px}
@media(min-width:640px){.sm\\:w-\\[440px\\]{width:440px}}
@media(min-width:1024px){.lg\\:hidden{display:none}}
`;


for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 780 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '#/', { waitUntil: 'domcontentloaded', timeout: 40000 }).catch(() => {});
  await p.addStyleTag({ content: TW_SHIM });
  await p.waitForTimeout(1200);

  const m = await p.evaluate(() => {
    const nav = document.getElementById('app-bottom-nav');
    if (!nav) return { missing: true };
    const cs = getComputedStyle(nav);
    // lg:hidden means the bar is display:none on desktop — report that honestly.
    if (cs.display === 'none') return { hidden: true };

    const navR = nav.getBoundingClientRect();
    const circle = nav.querySelector('.lh-nav-adventure-circle');
    const advTab = nav.querySelector('.lh-nav-adventure');
    const tabs = [...nav.querySelectorAll('.bottom-tab')];
    const cR = circle.getBoundingClientRect();

    // Does the circle overlap any neighbouring tab's box?
    const others = tabs.filter(t => t !== advTab).map(t => t.getBoundingClientRect());
    const overlaps = others.some(o =>
      cR.left < o.right - 0.5 && cR.right > o.left + 0.5 &&
      cR.top < o.bottom - 0.5 && cR.bottom > o.top + 0.5);

    return {
      escapeAbove: +(navR.top - cR.top).toFixed(1),
      escapeBelow: +(cR.bottom - navR.bottom).toFixed(1),
      circleW: Math.round(cR.width),
      radius: getComputedStyle(circle).borderRadius,
      centered: Math.abs((cR.left + cR.width / 2) - (navR.left + navR.width / 2)) < 1.5,
      minTouch: Math.min(...tabs.map(t => Math.round(t.getBoundingClientRect().height))),
      overlaps,
      navInViewport: navR.left >= -0.5 && navR.right <= document.documentElement.clientWidth + 0.5,
      hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  rows.push([w, m]);
  await ctx.close();
}
await browser.close();

console.log('\n═══ Real bottom nav — measured in Chromium ═══');
console.log('  width  contained          circle  radius   centred  touch  overlap  hScroll');
let bad = 0;
for (const [w, m] of rows) {
  if (m.missing) { console.log(`  ${w}: nav element not found`); bad++; continue; }
  if (m.hidden)  { console.log(`  ${String(w).padEnd(6)} (bar hidden at this width — lg:hidden, desktop uses the top nav)`); continue; }
  const contained = m.escapeAbove <= 0 && m.escapeBelow <= 0;
  const ok = contained && m.centered && !m.overlaps && !m.hScroll && m.minTouch >= 44 && m.navInViewport;
  if (!ok) bad++;
  const desc = contained ? `inside ✓` : `${m.escapeAbove>0?m.escapeAbove+'px above':''}${m.escapeBelow>0?m.escapeBelow+'px below':''} ✗`;
  console.log(`  ${String(w).padEnd(6)} ${desc.padEnd(18)} ${String(m.circleW).padEnd(7)} ${String(m.radius).padEnd(8)} ${m.centered?'✓':'✗'}        ${String(m.minTouch).padEnd(6)} ${m.overlaps?'✗ YES':'✓ no '}   ${m.hScroll?'✗ YES':'✓ no'}`);
}
console.log(`\n  ${bad === 0 ? 'all measured widths pass' : bad + ' width(s) failed'}\n`);
