// Background service worker for Chrome Extension

// On installation, try to detect the domain from where the extension was likely downloaded
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Check if we already have a configured URL
    const { targetUrl } = await chrome.storage.sync.get('targetUrl');

    if (!targetUrl) {
      // Try to detect the domain from active tab (user likely just downloaded from there)
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (activeTab && activeTab.url) {
          const url = new URL(activeTab.url);
          // Check if it looks like a CV page or personal website
          if (url.pathname.includes('/cv') || url.hostname.includes('localhost')) {
            const detectedUrl = `${url.protocol}//${url.host}`;

            // Save the detected URL
            await chrome.storage.sync.set({ targetUrl: detectedUrl });

            console.log(`Auto-configured extension for: ${detectedUrl}`);
          }
        }
      } catch (error) {
        console.error('Error auto-detecting domain:', error);
      }

      // Fallback to localhost if detection fails
      if (!(await chrome.storage.sync.get('targetUrl')).targetUrl) {
        await chrome.storage.sync.set({ targetUrl: 'http://localhost:3000' });
      }
    }
  }
});

export {};
