// Loads the real stylesheets in Chromium and measures the shipped rules,
// rather than trusting that the CSS says what it looks like it says.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const base = process.argv[2] || new URL('../../css/', import.meta.url).pathname;
const css = readFileSync(base + 'styles.css', 'utf8') + '\n' +
            readFileSync(base + 'v2/design-system.css', 'utf8');

const page_html = `
<style>${css}</style>
<body>
  <button class="btn-primary" id="b1">اندراج کریں</button>
  <button class="btn-secondary" id="b2">منسوخ</button>
  <button class="btn-primary" id="b3" disabled>غیر فعال</button>
  <button class="btn-primary" id="b4" aria-busy="true">لوڈ</button>
  <div class="lh-card" id="c1">card</div>
  <div class="lh-skeleton lh-skeleton-title" id="s1"></div>
  <p id="txt">قابلِ انتخاب متن</p>
</body>`;

const results = [];
const t = (name, ok, detail = '') => results.push([name, ok, detail]);

async function run(reducedMotion, viewport, label) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ reducedMotion, viewport });
  const page = await ctx.newPage();
  await page.setContent(page_html);

  const m = await page.evaluate(() => {
    const g = (id) => {
      const el = document.getElementById(id);
      const cs = getComputedStyle(el);
      return {
        h: el.getBoundingClientRect().height,
        opacity: cs.opacity,
        cursor: cs.cursor,
        pointer: cs.pointerEvents,
        anim: cs.animationName,
        animDur: cs.animationDuration,
        transDur: cs.transitionDuration,
        userSelect: cs.userSelect
      };
    };
    return { b1: g('b1'), b2: g('b2'), b3: g('b3'), b4: g('b4'), s1: g('s1'), txt: g('txt') };
  });

  await browser.close();
  return { label, m };
}

// --- Desktop, motion allowed ---
const desktop = await run('no-preference', { width: 1280, height: 800 }, 'desktop');
t('btn-primary meets the 44px touch target', desktop.m.b1.h >= 44, `${desktop.m.b1.h}px`);
t('btn-secondary meets the 44px touch target', desktop.m.b2.h >= 44, `${desktop.m.b2.h}px`);
t('disabled button is visibly dimmed', parseFloat(desktop.m.b3.opacity) <= 0.6, `opacity ${desktop.m.b3.opacity}`);
t('disabled button rejects pointer events', desktop.m.b3.pointer === 'none', desktop.m.b3.pointer);
t('skeleton animates while loading', desktop.m.s1.anim === 'shimmer', desktop.m.s1.anim);

// --- Mobile: text must be selectable, controls must not be ---
const mobile = await run('no-preference', { width: 390, height: 844 }, 'mobile');
t('body text is selectable on mobile', mobile.m.txt.userSelect === 'text', mobile.m.txt.userSelect);
t('button labels stay unselectable on mobile', mobile.m.b1.userSelect === 'none', mobile.m.b1.userSelect);

// --- Reduced motion ---
const reduced = await run('reduce', { width: 1280, height: 800 }, 'reduced-motion');
const skelStopped = reduced.m.s1.anim === 'none' || parseFloat(reduced.m.s1.animDur) <= 0.001;
t('skeleton stops animating under reduced motion', skelStopped, `${reduced.m.s1.anim} / ${reduced.m.s1.animDur}`);
const transStopped = parseFloat(reduced.m.b1.transDur) <= 0.001;
t('button transitions stop under reduced motion', transStopped, reduced.m.b1.transDur);
t('touch target still correct under reduced motion', reduced.m.b1.h >= 44, `${reduced.m.b1.h}px`);

console.log('\n═══ Design system — measured in Chromium ═══');
let bad = 0;
for (const [name, ok, detail] of results) {
  if (!ok) bad++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
}
console.log(`  ${results.length - bad}/${results.length} behaved as expected\n`);
process.exit(bad ? 1 : 0);
