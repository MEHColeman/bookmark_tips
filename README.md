# Bookmark Tooltip for Firefox

This Firefox extension displays a tooltip showing the bookmark's title when you hover over a link that has been bookmarked.

Overview
The extension injects a content script that detects when you hover over links on any page. If the link's URL is found among the user's bookmarks (as cached by the background script), a tooltip is shown near the cursor containing the bookmark title. The background script maintains a normalized cache of bookmarks to enable fast lookup.

What you get
- Tooltip with the bookmark title on bookmarked links
- Efficient lookup via a cached, normalized bookmark set
- Works across all pages (MV3 extension) with minimal impact on page performance

How it works
- tooltip.js (content script):
  - Creates and styles the tooltip element
  - Tracks mouse movement to position the tooltip
  - On mouseover of a link, asks the background script to check whether the URL is a bookmark
  - When a match is found, shows the tooltip with the bookmark title
- background.js:
  - On startup, fetches the bookmarks tree and caches a list of bookmarked URLs with normalized forms
  - Listens for checkBookmark messages from the content script and returns the corresponding bookmark title if found
  - Keeps the cache updated on bookmark changes
- manifest.json:
  - MV3 manifest declaring permissions (bookmarks, activeTab), host permissions, content_scripts, and background service worker setup (or scripts)
  - Configures tooltip.js as a content script for all URLs
  - Configures background.js as the extension's background script

Usage
- Load the extension in Firefox via about:debugging and point it to this directory
- Navigate to any web page
- Hover over a bookmarked link to see the bookmark's title appear as a tooltip

File overview
- tooltip.js: Creates and manages the tooltip UI, normalizes URLs, and communicates with the background script
- background.js: Caches bookmarks, handles checkBookmark messages, and returns titles
- manifest.json: Extension manifest (MV3)
- README.md: This file

Development and testing
- Use about:debugging to load temporary add-ons and test the extension on pages you visit
- To reset bookmarks cache during testing, reload the extension or trigger a cache refresh if a test hook is provided

License
- MIT License (or your chosen license)

Changelog
- v1.0 - Initial release
# Bookmark Tooltip for Firefox

This Firefox extension displays a tooltip showing the bookmark's title when you hover over a link that has been bookmarked.

Overview
The extension injects a content script that detects when you hover over links on any page. If the link's URL is found among the user's bookmarks (as cached by the background script), a tooltip is shown near the cursor containing the bookmark title. The background script maintains a normalized cache of bookmarks to enable fast lookup.

What you get
- Tooltip with the bookmark title on bookmarked links
- Efficient lookup via a cached, normalized bookmark set
- Works across all pages (MV3 extension) with minimal impact on page performance

How it works
- tooltip.js (content script):
  - Creates and styles the tooltip element
  - Tracks mouse movement to position the tooltip
  - On mouseover of a link, asks the background script to check whether the URL is a bookmark
  - When a match is found, shows the tooltip with the bookmark title
- background.js:
  - On startup, fetches the bookmarks tree and caches a list of bookmarked URLs with normalized forms
  - Listens for checkBookmark messages from the content script and returns the corresponding bookmark title if found
  - Keeps the cache updated on bookmark changes
- manifest.json:
  - MV3 manifest declaring permissions (bookmarks, activeTab), host permissions, content_scripts, and background service worker setup (or scripts)
  - Configures tooltip.js as a content script for all URLs
  - Configures background.js as the extension's background script

Usage
- Load the extension in Firefox via about:debugging and point it to this directory
- Navigate to any web page
- Hover over a bookmarked link to see the bookmark's title appear as a tooltip

File overview
- tooltip.js: Creates and manages the tooltip UI, normalizes URLs, and communicates with the background script
- background.js: Caches bookmarks, handles checkBookmark messages, and returns titles
- manifest.json: Extension manifest (MV3)
- README.md: This file

Development and testing
- Use about:debugging to load temporary add-ons and test the extension on pages you visit
- To reset bookmarks cache during testing, reload the extension or trigger a cache refresh if a test hook is provided

License
- MIT License (or your chosen license)

Changelog
- v1.0 - Initial release
