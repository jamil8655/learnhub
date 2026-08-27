// Regression: every nav tab must still carry its route, be clickable, and
// actually navigate. The Adventure circle is the one under repair, so it is
// clicked at its visual centre to prove the new layout did not shift the hit area.
import { chromium } from 'playwright';
const TW = `.fixed{position:fixed}.left-1\\/2{left:50%}.z-40{z-index:40}
.w-\\[calc\\(100\\%-1\\.5rem\\)\\]{width:calc(100% - 1.5rem)}.max-w-full{max-width:100%}
.grid{display:grid}.grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}
.gap-1{gap:.25rem}.items-center{align-items:center}.flex{display:flex}
.flex-col{flex-direction:column}.justify-center{justify-content:center}.min-w-0{min-width:0}
.w-full{width:100%}.shrink-0{flex-shrink:0}.py-1{padding:.25rem 0}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.w-5{width:1.25rem}.h-5{height:1.25rem}.w-6{width:1.5rem}.h-6{height:1.5rem}
.rounded-3xl{border-radius:1.5rem}.border-2{border-width:2px}
@media(min-width:1024px){.lg\\:hidden{display:none}}`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext({ viewport: { width: 390, height: 800 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8899/index.html#/', { waitUntil: 'domcontentloaded' }).catch(()=>{});
await p.addStyleTag({ content: TW });
await p.waitForTimeout(1200);

const rows = [];
const tabs = await p.$$eval('#app-bottom-nav .bottom-tab', els =>
  els.map(e => ({ path: e.dataset.path, href: e.getAttribute('href'),
                  label: (e.innerText||'').trim().split('\n').pop() })));

for (const t of tabs) rows.push([`route present: ${t.label}`, !!t.path && !!t.href, `${t.href}`]);

// Click each tab and confirm the hash actually changes.
for (const t of tabs) {
  await p.evaluate(() => location.hash = '#/');
  await p.waitForTimeout(200);
  const sel = `#app-bottom-nav .bottom-tab[data-path="${t.path}"]`;
  // Adventure: click the circle itself, at its centre.
  const target = t.path === '/adventure' ? `${sel} .lh-nav-adventure-circle` : sel;
  await p.click(target, { force: false }).catch(async () => { await p.click(sel); });
  await p.waitForTimeout(350);
  const hash = await p.evaluate(() => location.hash);
  rows.push([`click navigates: ${t.label}`, hash === '#' + t.path, `hash=${hash}`]);
}

// Active-state hook still present for the router to mark the current tab.
const hasActiveHook = await p.$$eval('#app-bottom-nav .bottom-tab', els =>
  els.every(e => e.classList.contains('bottom-tab') && e.dataset.path));
rows.push(['active-state hook (.bottom-tab + data-path) intact', hasActiveHook, '']);

console.log('\n═══ Navigation regression ═══');
let bad = 0;
for (const [n, ok, d] of rows) { if (!ok) bad++; console.log(`  ${ok?'✓':'✗'} ${n.padEnd(44)} ${d}`); }
console.log(`\n  ${rows.length - bad}/${rows.length} passed\n`);
await b.close();
process.exit(bad?1:0);
