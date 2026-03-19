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

      // Fall back to the configured production URL when available, otherwise local dev.
      if (!(await chrome.storage.sync.get('targetUrl')).targetUrl) {
        const fallbackUrl =
          process.env.NEXT_PUBLIC_SITE_URL
          || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
          || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
          || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
          || 'http://localhost:3000';
        await chrome.storage.sync.set({ targetUrl: fallbackUrl });
      }
    }
  }
});

export {};
