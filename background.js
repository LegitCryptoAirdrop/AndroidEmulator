// List of headers to be removed (lowercase for comparison)
const headersToRemove = ["strict-transport-security", "content-security-policy", "x-frame-options", "strict-origin-when-cross-origin"];

// Listener function to modify response headers
function removeHeaders(details) {
    console.log("Request details:", details); // Log the request details for debugging
    details.responseHeaders = details.responseHeaders.filter(header => {
        const shouldRemove = headersToRemove.includes(header.name.toLowerCase());
        if (shouldRemove) {
            console.log("Removing header:", header.name); // Log which headers are being removed
        }
        return !shouldRemove;
    });
    return { responseHeaders: details.responseHeaders };
}

// Registering the listener to modify response headers
chrome.webRequest.onHeadersReceived.addListener(
    removeHeaders,
    { urls: ["<all_urls>"] },
    ["blocking", "responseHeaders"]
);
