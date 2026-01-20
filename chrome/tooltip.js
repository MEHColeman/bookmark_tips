/**
 * Chrome-specific tooltip content script that mirrors the Firefox behavior.
 * It queries the background script for a bookmark title and shows a tooltip
 * when hovering bookmarked links.
 */

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
let tooltip;
let isTooltipVisible = false; // Tracks if the tooltip is currently displayed
let bookmarkCheckTimer = null;
let lastHoveredUrl = "";

//document.addEventListener("mouseover", (event) => {
//	console.log("Mouse over detected on element:", event.target);
//});

// Create and style the tooltip
const createTooltip = () => {
	tooltip = document.createElement("div");
	tooltip.style.pointerEvents = "none"; // Prevent interaction issues
	tooltip.style.position = "absolute";
	tooltip.style.position = "fixed";
	tooltip.style.backgroundColor = "#333";
	tooltip.style.color = "#fff";
	tooltip.style.padding = "5px";
	tooltip.style.borderRadius = "4px";
	tooltip.style.fontSize = "12px";
	tooltip.style.display = "none"; // Initially hidden
	tooltip.style.zIndex = "1000"; // Ensure it appears on top of other elements
	document.body.appendChild(tooltip);
	console.log("Tooltip created and appended to the DOM.");
};

// Show tooltip with text
const showTooltip = (text) => {
	//console.log("Attempting to show tooltip:", text);
	tooltip.textContent = text;
	tooltip.style.display = "block";
};

// Hide tooltip
const hideTooltip = () => {
	tooltip.style.display = "none";
};

// Track mouse movement and update tooltip position
document.addEventListener("mousemove", (event) => {
	if (isTooltipVisible) {
		// console.log(`Mouse coordinates: X=${event.clientX}, Y=${event.clientY}`);
		const tooltipOffsetX = 15; // Horizontal offset from cursor
		const tooltipOffsetY = 15; // Vertical offset from cursor

		const maxWidth = window.innerWidth - tooltip.offsetWidth - 10; // Prevent overflow on the right
		const maxHeight = window.innerHeight - tooltip.offsetHeight - 10; // Prevent overflow at the bottom

		// Dynamically position the tooltip near the cursor
		const calculatedLeft = Math.min(event.clientX + tooltipOffsetX, maxWidth);
		const calculatedTop = Math.min(event.clientY + tooltipOffsetY, maxHeight);

		tooltip.style.left = `${calculatedLeft}px`;
		tooltip.style.top = `${calculatedTop}px`;
		// console.log(`Tooltip positioned at: left=${calculatedLeft}, top=${calculatedTop}`);
	}
});

// Event listener for mouseover to show the tooltip (debounced)
document.addEventListener("mouseover", (event) => {
  let link = event.target;

  // Traverse up the DOM tree to find the closest <a> tag
  while (link && link.tagName !== "A") {
    link = link.parentElement;
  }

  if (link) {
    lastHoveredUrl = link.href;
    if (bookmarkCheckTimer) clearTimeout(bookmarkCheckTimer);
    bookmarkCheckTimer = setTimeout(async () => {
      const bookmarkTitle = await checkBookmarks(lastHoveredUrl);
      if (bookmarkTitle) {
        //console.log("Bookmark title found:", bookmarkTitle);
        isTooltipVisible = true;
        showTooltip(bookmarkTitle);
      }
    }, 60);
  }
}, true);

// Event listener for mouseout to hide the tooltip
document.addEventListener("mouseout", (event) => {
  const relatedTarget = event.relatedTarget;

  // Ensure the tooltip is only hidden if the pointer leaves the link
  if (!relatedTarget || !event.target.closest("a")) {
    //console.log("Pointer left the link, hiding tooltip.");
    isTooltipVisible = false; // Stop tracking
    hideTooltip();
  }
  // Clear pending bookmark check on mouseout
  if (bookmarkCheckTimer) {
    clearTimeout(bookmarkCheckTimer);
    bookmarkCheckTimer = null;
  }
}, true);

// Initialize the tooltip
createTooltip();

// Function to check bookmarks
const checkBookmarks = async (url) => {
	const normalizedUrl = normalizeUrl(url);
	//console.log("Sending normalized URL to background script:", normalizedUrl);

	try {
		const response = await new Promise((resolve, reject) => {
			// Use Chrome's chrome.runtime API with a Promise wrapper
			if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
				chrome.runtime.sendMessage({ type: "checkBookmark", url: normalizedUrl }, (resp) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(resp);
					}
				});
			} else {
				// Fallback if the browser object is available
				resolve(null);
			}
		});

		// If we got a response, handle it
		if (response && response.success && response.title) {
			return response.title;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error communicating with background script:", error);
		return null;
	}
};
