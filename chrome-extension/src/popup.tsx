import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_TARGET_URL, PRESET_URLS, DEFAULT_AUTO_OPEN } from "./constants";
import { BRAND_COLORS, BACKGROUND_COLORS } from "./colors";

console.log("Popup script starting...");

const styles = {
  container: {
    width: "420px",
    minHeight: "500px",
    background: `linear-gradient(135deg, ${BACKGROUND_COLORS.primary} 0%, ${BACKGROUND_COLORS.surface} 100%)`,
    color: BRAND_COLORS.primary,
    fontFamily: "'Open Sans', 'Urbanist', 'Cormorant Garamond', 'Yeseva One', system-ui, sans-serif",
    borderRadius: "0px",
    overflow: "hidden"
  },
  header: {
    background: `linear-gradient(90deg, ${BACKGROUND_COLORS.secondary} 0%, ${BACKGROUND_COLORS.overlay} 100%)`,
    padding: "20px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${BACKGROUND_COLORS.overlay}`
  }, title: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Urbanist', sans-serif",
    background: "linear-gradient(45deg, #ffffff 0%, #e0e0e0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    margin: "5px 0 0 0",
    fontSize: "12px",
    color: "#aaaaaa",
    fontWeight: "400"
  },
  content: {
    padding: "20px"
  },
  textarea: {
    width: "100%",
    height: "280px",
    padding: "16px",
    border: `1px solid ${BACKGROUND_COLORS.overlay}`,
    borderRadius: "8px",
    background: BACKGROUND_COLORS.surface,
    color: BRAND_COLORS.primary,
    fontSize: "13px",
    fontFamily: "'Open Sans', system-ui, sans-serif",
    lineHeight: "1.5",
    resize: "vertical" as const,
    outline: "none",
    transition: "border-color 0.2s ease"
  },
  textareaFocus: {
    borderColor: BRAND_COLORS.accent
  },
  buttonContainer: {
    marginTop: "16px",
    display: "flex",
    gap: "12px"
  },
  button: {
    flex: "1",
    padding: "12px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Open Sans', sans-serif"
  },
  primaryButton: {
    background: `linear-gradient(45deg, ${BRAND_COLORS.accent} 0%, rgba(${BRAND_COLORS.accentRgb}, 0.8) 100%)`,
    color: BRAND_COLORS.primary,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
  },
  primaryButtonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  placeholder: {
    color: BRAND_COLORS.secondary,
    fontStyle: "italic"
  },
  urlContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px"
  },
  urlText: {
    fontSize: "10px",
    opacity: 0.7,
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    userSelect: "none" as const,
    flex: 1
  },
  urlTextHover: {
    opacity: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  },
  urlInput: {
    flex: 1,
    padding: "4px 8px",
    fontSize: "10px",
    background: BACKGROUND_COLORS.surface,
    border: `1px solid ${BRAND_COLORS.accent}`,
    borderRadius: "4px",
    color: BRAND_COLORS.primary,
    outline: "none",
    fontFamily: "'Courier New', monospace"
  },
  urlButton: {
    padding: "3px 8px",
    fontSize: "9px",
    fontWeight: "600",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Open Sans', sans-serif"
  },
  saveButton: {
    background: BRAND_COLORS.accent,
    color: BRAND_COLORS.primary
  },
  cancelButton: {
    background: BACKGROUND_COLORS.overlay,
    color: BRAND_COLORS.secondary
  },
  presetContainer: {
    display: "flex",
    gap: "6px",
    marginTop: "8px"
  },
  presetButton: {
    flex: "1",
    padding: "6px 8px",
    fontSize: "10px",
    fontWeight: "600",
    border: `1px solid ${BACKGROUND_COLORS.overlay}`,
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Open Sans', sans-serif"
  },
  presetButtonActive: {
    background: BRAND_COLORS.accent,
    color: BRAND_COLORS.primary,
    borderColor: BRAND_COLORS.accent
  },
  presetButtonInactive: {
    background: BACKGROUND_COLORS.surface,
    color: BRAND_COLORS.secondary,
    borderColor: BACKGROUND_COLORS.overlay
  }
};

const Popup = () => {
  console.log("Popup component rendering...");
  const [pageText, setPageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState(DEFAULT_TARGET_URL);
  const [autoOpen, setAutoOpen] = useState(DEFAULT_AUTO_OPEN);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editingUrl, setEditingUrl] = useState("");
  const jobIdRef = useRef(`job-${Date.now()}`);

  const openCVTool = (textToStore?: string) => {
    const jobDescription = textToStore || pageText;
    // Get current tab URL and store both description and URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTabUrl = tabs[0]?.url || '';

      // Store job description and URL as an object
      chrome.storage.local.set({
        [jobIdRef.current]: {
          description: jobDescription,
          url: currentTabUrl
        }
      }, async () => {
        // Only open the CV tool after the storage operation completes
        if (currentTabUrl) {
          const newWindowDetails = await chrome.windows.create({
            url: currentTabUrl,
            type: "normal",
          });

          const newWindowId = newWindowDetails.id;
          // Open CV tool using the configured URL
          await chrome.tabs.create({
            url: `${targetUrl}/cv/${jobIdRef.current}`,
            windowId: newWindowId,
          });
        }
      });
    });
  };

  const startEditingUrl = () => {
    setEditingUrl(targetUrl);
    setIsEditingUrl(true);
  };

  const saveUrl = () => {
    try {
      new URL(editingUrl); // Validate URL
      chrome.storage.sync.set({ targetUrl: editingUrl }, () => {
        setTargetUrl(editingUrl);
        setIsEditingUrl(false);
      });
    } catch (e) {
      // Invalid URL - show some feedback or just cancel
      cancelEditingUrl();
    }
  };

  const cancelEditingUrl = () => {
    setEditingUrl("");
    setIsEditingUrl(false);
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveUrl();
    } else if (e.key === 'Escape') {
      cancelEditingUrl();
    }
  };

  const selectPresetUrl = (presetValue: string) => {
    chrome.storage.sync.set({ targetUrl: presetValue }, () => {
      setTargetUrl(presetValue);
    });
  };

  const toggleAutoOpen = () => {
    const newAutoOpen = !autoOpen;
    setAutoOpen(newAutoOpen);
    chrome.storage.sync.set({ autoOpen: newAutoOpen });
  };

  useEffect(() => {
    // Load settings from storage first
    chrome.storage.sync.get(
      {
        targetUrl: DEFAULT_TARGET_URL,
        autoOpen: DEFAULT_AUTO_OPEN
      },
      (items) => {
        setTargetUrl(items.targetUrl);
        setAutoOpen(items.autoOpen);

        // Only after URL is loaded, check for page text and auto-navigate
        const checkForText = (retryCount = 0) => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PAGE_TEXT" }, (response) => {
                console.log("Popup: Raw response from content script:", response);

                // Handle the case where response might be undefined or content script not ready
                if (chrome.runtime.lastError) {
                  console.log("Popup: Runtime error:", chrome.runtime.lastError.message);
                  // If content script isn't ready and we haven't retried too many times, try again
                  if (retryCount < 3) {
                    console.log(`Popup: Retrying (${retryCount + 1}/3)...`);
                    setTimeout(() => checkForText(retryCount + 1), 500);
                    return;
                  }
                  setIsLoading(false);
                  return;
                }

                if (!response) {
                  console.log("Popup: Response is null/undefined!");
                  setIsLoading(false);
                  return;
                }

                const { selectedText } = response;
                console.log("Popup: Extracted selectedText:", selectedText ? `${selectedText.length} characters` : "none");
                console.log("Popup: First 100 chars:", selectedText ? selectedText.substring(0, 100) : "N/A");

                if (selectedText && selectedText.length > 0) {
                  console.log("Popup: Setting page text with", selectedText.length, "characters");
                  setPageText(selectedText);
                  console.log("Popup: State should be updated now");

                  // Only auto-open if the setting is enabled
                  if (items.autoOpen) {
                    console.log("Popup: Auto-open is enabled, opening CV tool");
                    // Store job description and URL
                    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                      const currentTabUrl = tabs[0]?.url || '';

                      chrome.storage.local.set({
                        [jobIdRef.current]: {
                          description: selectedText,
                          url: currentTabUrl
                        }
                      }, async () => {
                        // Only open the CV tool after the storage operation completes
                        if (currentTabUrl) {
                          const newWindowDetails = await chrome.windows.create({
                            url: currentTabUrl,
                            type: "normal",
                          });

                          const newWindowId = newWindowDetails.id;
                          // Open CV tool using the configured URL from settings
                          await chrome.tabs.create({
                            url: `${items.targetUrl}/cv/${jobIdRef.current}`,
                            windowId: newWindowId,
                          });
                        }
                      });
                    });
                  } else {
                    console.log("Popup: Auto-open is disabled, user must click button manually");
                  }
                }

                setIsLoading(false);
              });
            } else {
              setIsLoading(false);
            }
          });
        };

        // Start checking for text with a small delay to ensure content script is ready
        setTimeout(() => checkForText(), 100);
      }
    );
  }, []);

  return (<div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>CV Tailor</h1>
      <p style={styles.subtitle}>Automatically customize your CV for specific job postings using AI</p>
      <div style={styles.urlContainer}>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>Target:</span>
        {isEditingUrl ? (
          <>
            <input
              type="text"
              value={editingUrl}
              onChange={(e) => setEditingUrl(e.target.value)}
              onKeyDown={handleUrlKeyDown}
              style={styles.urlInput}
              placeholder="https://your-website.com"
            />
            <button
              onClick={saveUrl}
              style={{ ...styles.urlButton, ...styles.saveButton }}
            >
              ✓
            </button>
            <button
              onClick={cancelEditingUrl}
              style={{ ...styles.urlButton, ...styles.cancelButton }}
            >
              ✕
            </button>
          </>
        ) : (
          <span
            onClick={startEditingUrl}
            onKeyDown={(e) => e.key === 'Enter' && startEditingUrl()}
            role="button"
            tabIndex={0}
            style={{
              ...styles.urlText,
              ...(focusedButton === 'url' ? styles.urlTextHover : {})
            }}
            onMouseEnter={() => setFocusedButton('url')}
            onMouseLeave={() => setFocusedButton(null)}
            title="Click to edit URL"
          >
            {targetUrl}
          </span>
        )}
      </div>
      <div style={styles.presetContainer}>
        {PRESET_URLS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => selectPresetUrl(preset.value)}
            style={{
              ...styles.presetButton,
              ...(targetUrl === preset.value ? styles.presetButtonActive : styles.presetButtonInactive)
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
    <div style={styles.content}>
      <textarea
        style={{
          ...styles.textarea,
          ...(pageText === "" ? styles.placeholder : {})
        }}
        value={pageText}
        onChange={(e) => setPageText(e.target.value)}
        placeholder={isLoading ? "Loading page content..." : "Paste or edit job description here..."}
        disabled={isLoading} />
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={toggleAutoOpen}
          style={{
            padding: "6px 10px",
            fontSize: "11px",
            fontWeight: "600",
            border: `1px solid ${BACKGROUND_COLORS.overlay}`,
            borderRadius: "4px",
            background: autoOpen ? BRAND_COLORS.accent : BACKGROUND_COLORS.surface,
            color: autoOpen ? BRAND_COLORS.primary : BRAND_COLORS.secondary,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "'Open Sans', sans-serif"
          }}
          title={autoOpen ? "Auto-open is ON - CV tool will open automatically" : "Auto-open is OFF - manual button click required"}
        >
          Auto-open: {autoOpen ? "ON" : "OFF"}
        </button>
        <span style={{ fontSize: "11px", color: BRAND_COLORS.secondary, opacity: 0.7 }}>
          {autoOpen ? "CV tool opens automatically" : "Manual button click required"}
        </span>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => openCVTool()}
          disabled={pageText.length < 10}
          style={{
            ...styles.button,
            ...styles.primaryButton,
            ...(focusedButton === 'tailor' ? styles.primaryButtonHover : {}),
            width: "100%",
            opacity: pageText.length < 10 ? 0.5 : 1,
            cursor: pageText.length < 10 ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={() => setFocusedButton('tailor')}
          onMouseLeave={() => setFocusedButton(null)}
        >
          Tailor CV {pageText.length < 10 && '(min 10 chars)'}
        </button>
      </div>
    </div>
  </div>
  );
};

console.log("Looking for root element...");
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  console.log("Rendering Popup component...");
  root.render(<Popup />);
  console.log("Render called");
} else {
  console.error("Root element not found!");
}
