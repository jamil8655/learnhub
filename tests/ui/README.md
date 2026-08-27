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
