# bookmark_tips — agent instructions

A browser extension (MV3) that shows a bookmark's title as a tooltip when
hovering over a bookmarked link. Firefox version at the repo root
(`manifest.json`, `background.js` bookmark cache, `tooltip.js` content
script); a Chrome-oriented copy lives in `chrome/`.

Conventions: plain JavaScript, no package manager, no build step, no test
suite — load via `about:debugging` (Firefox) to test manually.

Standard docs: `README.md` (what/install/run), `docs/TODO.md` (task list),
`docs/journal.md` (session journal).
