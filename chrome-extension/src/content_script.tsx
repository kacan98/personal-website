import { logger } from "./logger";

// Check if already injected to prevent multiple injections in same context
if ((window as any).__cvTailorInjected) {
  // Don't log here as it would be spammy
} else {
  (window as any).__cvTailorInjected = true;
  const scriptId = Math.random().toString(36).substring(7);
  const frameUrl = window.location.href;

  // Initialize logger and check debug setting
  chrome.storage.sync.get({ debugLogging: false }, (result) => {
    logger.setDebugMode(result.debugLogging);
    logger.log(`Content script loaded [${scriptId}] in frame: ${frameUrl}`);
  });

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "GET_PAGE_TEXT") {
      // Only respond if we're in the main frame (not an iframe)
      if (window !== window.top) {
        logger.log(`[${scriptId}] Ignoring request - not in main frame (${frameUrl})`);
        return false;
      }

      const selection = window.getSelection();
      const selectedText = selection?.toString() || "";

      // Don't send empty selections
      if (!selectedText || selectedText.length === 0) {
        logger.log(`[${scriptId}] No text selected, not sending response`);
        return false;
      }

      logger.log(`[${scriptId}] Frame URL:`, frameUrl);
      logger.log(`[${scriptId}] Selection object:`, selection);
      logger.log(`[${scriptId}] Selection rangeCount:`, selection?.rangeCount);
      logger.log(`[${scriptId}] Selection type:`, selection?.type);
      logger.log(`[${scriptId}] Found selected text length:`, selectedText.length);
      logger.log(`[${scriptId}] First 100 chars:`, selectedText ? selectedText.substring(0, 100) + "..." : "none");

      const response = { selectedText, scriptId, frameUrl };
      logger.log(`[${scriptId}] Sending response with text length:`, selectedText.length);
      sendResponse(response);
      return true; // Important: indicates we will send a response
    }
  });

  window.addEventListener("message", (event) => {
    // Only accept messages from the same origin
    if (event.source !== window || !event.data || !event.data.action) return;

    logger.log("Received message:", event.data);

    if (event.data.action === "GET_SAVED_TEXT" && event.data.jobId) {
      logger.log("Getting saved text for job ID:", event.data.jobId);
      chrome.storage.local.get([event.data.jobId], (res) => {
        logger.log("Retrieved from storage:", res);
        // Send the response back to the webpage
        window.postMessage({ action: "RECEIVED_SAVED_TEXT", text: res[event.data.jobId] }, "*");
      });
    }
  });
}