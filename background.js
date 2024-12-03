let cachedBookmarks = [];

// Function to normalize URLs
const normalizeUrl = (url) => {
	try {
		const urlObj = new URL(url);
		urlObj.hash = ""; // Remove fragments
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
const cacheBookmarks = async () => {
	try {
		const allBookmarks = await browser.bookmarks.getTree();
		cachedBookmarks = flattenBookmarks(allBookmarks).map((bookmark) => ({
			title: bookmark.title,
			url: normalizeUrl(bookmark.url), // Normalize URLs during caching
		}));
		console.log("Cached bookmarks (normalized):", cachedBookmarks);
	} catch (error) {
		console.error("Error caching bookmarks:", error);
	}
};

// Update cache when bookmarks change
browser.bookmarks.onCreated.addListener(cacheBookmarks);
browser.bookmarks.onRemoved.addListener(cacheBookmarks);
browser.bookmarks.onChanged.addListener(cacheBookmarks);
browser.bookmarks.onMoved.addListener(cacheBookmarks);

// Initialize cache
cacheBookmarks();

// Handle bookmark search requests
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "checkBookmark") {
		const normalizedUrl = normalizeUrl(message.url);
		console.log("Normalized URL for search:", normalizedUrl);

		// Debugging: Log cached bookmarks and compare URLs
		console.log("Cached bookmarks for comparison:", cachedBookmarks);
		const match = cachedBookmarks.find((bookmark) => {
			console.log(
				`Comparing bookmark URL: ${bookmark.url} with normalized URL: ${normalizedUrl}`
			);
			return bookmark.url === normalizedUrl;
		});

		const title = match ? match.title : null;
		console.log("Resolved bookmark title:", title);
		sendResponse({ success: true, title });
		return true; // Required for asynchronous sendResponse
	}
});
