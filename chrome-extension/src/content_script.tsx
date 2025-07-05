chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "GET_PAGE_TEXT") {
    const selectedText = window.getSelection()?.toString() || "";
    const response = { selectedText };
    sendResponse(response);
  }
});

window.addEventListener("message", (event) => {
  // Only accept messages from the same origin
  if (event.source !== window || !event.data || !event.data.action) return;

  if (event.data.action === "GET_SAVED_TEXT" && event.data.jobId) {
    chrome.storage.local.get([event.data.jobId], (res) => {
      // Send the response back to the webpage
      window.postMessage({ action: "RECEIVED_SAVED_TEXT", text: res[event.data.jobId] }, "*");
    });
  }
});