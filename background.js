let bookmarkMap = {};

// Function to normalize URLs
const normalizeUrl = (url) => {
	try {
		const urlObj = new URL(url);
		urlObj.search = ""; // Remove parameters, keep anchors
		return urlObj.href.replace(/\/$/, ""); // Remove trailing slash
	} catch (error) {
		console.error("Invalid URL for normalization:", url, error);
		return url;
	}
};

// Function to flatten the bookmark tree
const flattenBookmarks = (nodes) => {
	let urls = [];
	for (let node of nodes) {
		if (node.url) {
			urls.push(node);
		}
		if (node.children) {
			urls = urls.concat(flattenBookmarks(node.children));
		}
	}
	return urls;
};

// Cache bookmarks on startup
const cacheBookmarks = () => {
  try {
    chrome.bookmarks.getTree((allBookmarks) => {
      const flat = flattenBookmarks(allBookmarks);
      const map = {};
      flat.forEach((bookmark) => {
        if (bookmark.url) {
          const url = normalizeUrl(bookmark.url);
          map[url] = bookmark.title;
        }
      });
      bookmarkMap = map;
      console.log("Cached bookmarks (normalized):", Object.keys(bookmarkMap).length);
    });
  } catch (error) {
    console.error("Error caching bookmarks:", error);
  }
};

// Update cache when bookmarks change
chrome.bookmarks.onCreated.addListener(cacheBookmarks);
chrome.bookmarks.onRemoved.addListener(cacheBookmarks);
chrome.bookmarks.onChanged.addListener(cacheBookmarks);
chrome.bookmarks.onMoved.addListener(cacheBookmarks);

// Initialize cache
cacheBookmarks();

// Handle bookmark search requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "checkBookmark") {
    const normalizedUrl = normalizeUrl(message.url);
    console.log("Normalized URL for search:", normalizedUrl);

    // Debugging: Log cached bookmarks and compare URLs
    console.log("Cached bookmarks for comparison:", bookmarkMap);
    const title = bookmarkMap[normalizedUrl] || null;
    console.log("Resolved bookmark title:", title);
    sendResponse({ success: true, title });
    return true;
  }
});
