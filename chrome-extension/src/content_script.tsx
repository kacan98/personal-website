// Add a console log to verify content script is injected
console.log("CV Tailor content script loaded");

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "GET_PAGE_TEXT") {
    const selectedText = window.getSelection()?.toString() || "";
    console.log("Content script: Found selected text:", selectedText);
    const response = { selectedText };
    sendResponse(response);
    return true; // Important: indicates we will send a response
  }
});

window.addEventListener("message", (event) => {
  // Only accept messages from the same origin
  if (event.source !== window || !event.data || !event.data.action) return;

  console.log("Content script: Received message:", event.data);

  if (event.data.action === "GET_SAVED_TEXT" && event.data.jobId) {
    console.log("Content script: Getting saved text for job ID:", event.data.jobId);
    chrome.storage.local.get([event.data.jobId], (res) => {
      console.log("Content script: Retrieved from storage:", res);
      // Send the response back to the webpage
      window.postMessage({ action: "RECEIVED_SAVED_TEXT", text: res[event.data.jobId] }, "*");
    });
  }
});