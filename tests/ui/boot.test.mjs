/**
 * Boot resilience.
 *
 * The blank screen this guards against: App.init used to call its phases in
 * an unguarded chain ending in Router.init(), so a throw in any earlier step
 * meant the router never ran and #main-content stayed empty. There is no
 * full-page loader in this app, so "stuck loading" is simply nothing having
 * been rendered.
 *
 * Run:  node boot.test.mjs [baseUrl]
 * Serve the site first, e.g.  python3 -m http.server 8899
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({ executablePath: EXE });
const rows = [];
const add = (label, ok, detail) => rows.push([label, ok, detail]);

async function load(route = '#/', { sabotage, viewport = { width: 1280, height: 800 } } = {}) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  if (sabotage) await page.addInitScript(sabotage);
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 40000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const m = document.getElementById('main-content');
    const txt = m ? (m.innerText || '').trim() : '';
    return {
      len: txt.length,
      state: window.__LH_BOOT_STATE || '(none)',
      degraded: (window.__LH_BOOT_FAILURES || []).map(f => f.phase).join(','),
      isError: txt.includes('لوڈ نہیں ہو سکی')
    };
  });
  return { page, ctx, r };
}

async function renders(label, route, opts) {
  const { ctx, r } = await load(route, opts);
  // 60 chars clears the 404 page, which is legitimately terse.
  add(label, r.len > 60 && !r.isError,
      `text=${r.len} state=${r.state}${r.degraded ? ' degraded=' + r.degraded : ''}`);
  await ctx.close();
}

// --- Routes: refresh and direct navigation must never be blank ---
await renders('opens at /', '#/');
await renders('deep link #/courses', '#/courses');
await renders('deep link #/quizzes', '#/quizzes');
await renders('deep link #/profile', '#/profile');
await renders('deep link #/dashboard', '#/dashboard');
await renders('unknown route renders 404', '#/no-such-route');
await renders('mobile viewport', '#/', { viewport: { width: 390, height: 844 } });

// --- A failing optional service must degrade, not blank the app ---
await renders('theme service throws', '#/', {
  sabotage: () => Object.defineProperty(window, 'UI_CONFIG', {
    get: () => ({ getTheme() { throw new Error('sabotage: theme'); }, setTheme() {} })
  })
});
await renders('corrupted localStorage', '#/', {
  sabotage: () => { try { localStorage.setItem('learnhub_db_v1', '{{{ not json'); } catch (e) { /* storage disabled */ } }
});
await renders('auth session load throws', '#/', {
  sabotage: () => window.addEventListener('DOMContentLoaded', () => {
    if (window.Auth) window.Auth.loadSession = () => { throw new Error('sabotage: session'); };
  }, { once: true })
});
await renders('global event wiring throws', '#/', {
  sabotage: () => {
    const orig = window.addEventListener.bind(window);
    let first = true;
    window.addEventListener = function (type, ...rest) {
      if (type === 'learnhub:auth_changed' && first) { first = false; throw new Error('sabotage: listener'); }
      return orig(type, ...rest);
    };
  }
});

// --- The recovery screen itself ---
// Driven directly rather than by sabotaging init: the app finishes booting
// before an injected script can replace init, so patching it proves nothing.
{
  const { ctx, page } = await load('#/');
  const rec = await page.evaluate(() => {
    document.getElementById('main-content').innerHTML = '';
    window.__LH_BOOT_STATE = 'initializing';
    window.dispatchEvent(new ErrorEvent('error', { error: new Error('probe'), message: 'probe' }));
    const t = document.getElementById('main-content').innerText.trim();
    return {
      state: window.__LH_BOOT_STATE,
      isError: t.includes('لوڈ نہیں ہو سکی'),
      hasRetry: /دوبارہ کوشش/.test(t),
      retryFn: typeof window.LearnHubRetryBoot === 'function'
    };
  });
  add('pre-render error shows the recovery screen',
      rec.isError && rec.hasRetry && rec.retryFn && rec.state === 'error',
      `state=${rec.state} retry=${rec.hasRetry}`);
  await ctx.close();
}

// A late error must not replace a page that already rendered.
{
  const { ctx, page } = await load('#/');
  const after = await page.evaluate(() => {
    window.dispatchEvent(new ErrorEvent('error', { error: new Error('late'), message: 'late' }));
    const t = document.getElementById('main-content').innerText.trim();
    return { len: t.length, isError: t.includes('لوڈ نہیں ہو سکی') };
  });
  add('late error leaves a working page alone', !after.isError && after.len > 60, `text=${after.len}`);
  await ctx.close();
}

console.log('\n═══ Boot resilience ═══');
let bad = 0;
for (const [label, ok, detail] of rows) {
  if (!ok) bad++;
  console.log(`  ${ok ? '✓' : '✗'} ${label.padEnd(44)} ${detail}`);
}
console.log(`  ${rows.length - bad}/${rows.length} behaved as expected\n`);
await browser.close();
process.exit(bad ? 1 : 0);
