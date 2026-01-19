# Bookmark Tooltips (Chrome)

This Chrome extension shows a tooltip with the bookmark's title when you hover over a link that is bookmarked.

Overview
The Chrome variant mirrors the Firefox approach but uses Chrome's MV3 model. It injects a content script on all pages to detect when you hover over a link and requests the background script to resolve the bookmark title if the URL is bookmarked.

What you get
- Tooltip with the bookmark title on bookmarked links
- Efficient lookup via a cached, normalized bookmark set
- Works across all pages with minimal impact on page performance

How it works
- chrome/tooltip.js (content script):
  - Creates and styles the tooltip element
  - Tracks mouse movement to position the tooltip
  - On mouseover of a link, asks the background script to check whether the URL is a bookmark
  - When a match is found, shows the tooltip with the bookmark title
- chrome/background.js:
  - On startup, caches bookmarks and exposes a checkBookmark message to resolve the title
  - Keeps the cache updated on bookmark changes
- chrome/manifest.json:
  - MV3 manifest declaring permissions (bookmarks, activeTab), host permissions, content_scripts, and background service_worker setup

Usage
- Open Chrome, go to chrome://extensions
- Enable Developer mode
- Click "Load unpacked" and select this chrome directory
- Navigate to any web page and hover over a bookmarked link to see the bookmark's title

Files
- chrome/tooltip.js
- chrome/background.js
- chrome/manifest.json

Notes
- The Chrome code assumes a MV3 environment; the background uses a service worker and may rely on the browser's chrome.bookmarks API.
