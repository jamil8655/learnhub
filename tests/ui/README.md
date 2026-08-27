# Design-system tests

Loads `css/styles.css` and `css/v2/design-system.css` into Chromium and
measures the computed result, so a regression in touch-target size, disabled
state, mobile text selection or reduced-motion handling fails here rather than
being noticed by a user.

```bash
npm install playwright
node design-system.test.mjs
```

Set `executablePath` in the file if your Chromium lives elsewhere.

## boot.test.mjs

Guards the blank-screen failure: `App.init` ran its phases in an unguarded
chain ending in `Router.init()`, so a throw in any earlier phase meant the
router never ran and `#main-content` stayed empty.

```bash
python3 -m http.server 8899        # from the repo root, terminal 1
node boot.test.mjs                 # terminal 2
```

Each page load waits on third-party CDNs, so the full run takes several
minutes; on a network where those hosts are blocked it is slower still and is
best run in batches.
