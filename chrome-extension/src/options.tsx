import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_TARGET_URL, PRESET_URLS, DEFAULT_DEBUG_LOGGING, DEFAULT_AUTO_OPEN } from "./constants";
import { BRAND_COLORS, BACKGROUND_COLORS } from "./colors";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    background: `linear-gradient(135deg, ${BACKGROUND_COLORS.primary} 0%, ${BACKGROUND_COLORS.surface} 100%)`,
    color: BRAND_COLORS.primary,
    fontFamily: "'Open Sans', 'Urbanist', 'Cormorant Garamond', 'Yeseva One', system-ui, sans-serif",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  },
  header: {
    background: `linear-gradient(90deg, ${BACKGROUND_COLORS.secondary} 0%, ${BACKGROUND_COLORS.overlay} 100%)`,
    padding: "30px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${BACKGROUND_COLORS.overlay}`
  }, title: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "'Urbanist', sans-serif",
    background: "linear-gradient(45deg, #ffffff 0%, #e0e0e0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    margin: "0",
    fontSize: "14px",
    color: "#aaaaaa",
    fontWeight: "400"
  },
  content: {
    padding: "30px"
  },
  section: {
    marginBottom: "24px",
    padding: "20px 0",
  },
  label: {
    display: "block",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: BRAND_COLORS.primary
  },
  select: {
    width: "100%",
    padding: "12px",
    border: `1px solid ${BACKGROUND_COLORS.overlay}`,
    borderRadius: "6px",
    background: BACKGROUND_COLORS.surface,
    color: BRAND_COLORS.primary,
    fontSize: "14px",
    fontFamily: "'Open Sans', system-ui, sans-serif",
    outline: "none",
    cursor: "pointer"
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "16px"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: BRAND_COLORS.accent
  },
  checkboxLabel: {
    fontSize: "14px",
    color: BRAND_COLORS.primary,
    cursor: "pointer",
    userSelect: "none" as const
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Open Sans', sans-serif",
    background: `linear-gradient(45deg, ${BRAND_COLORS.accent} 0%, rgba(${BRAND_COLORS.accentRgb}, 0.8) 100%)`,
    color: BRAND_COLORS.primary,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    marginTop: "20px"
  },
  buttonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  status: {
    marginTop: "16px",
    padding: "12px",
    background: `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
    border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.3)`,
    borderRadius: "6px",
    color: BRAND_COLORS.accent,
    fontSize: "14px",
    textAlign: "center" as const
  }
};

const Options = () => {
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [debugLogging, setDebugLogging] = useState<boolean>(DEFAULT_DEBUG_LOGGING);
  const [autoOpen, setAutoOpen] = useState<boolean>(DEFAULT_AUTO_OPEN);
  const [status, setStatus] = useState<string>("");
  const [_isHovered, _setIsHovered] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Preset URLs for quick selection
  const presetUrls = PRESET_URLS;

  useEffect(() => {
    // Restore saved settings from storage
    chrome.storage.sync.get(
      {
        targetUrl: DEFAULT_TARGET_URL,
        debugLogging: DEFAULT_DEBUG_LOGGING,
        autoOpen: DEFAULT_AUTO_OPEN,
      },
      (items) => {
        setTargetUrl(items.targetUrl);
        setDebugLogging(items.debugLogging);
        setAutoOpen(items.autoOpen);
      }
    );
  }, []);

  const saveOptions = () => {
    // Validate URL
    try {
      new URL(targetUrl);
    } catch (e) {
      setStatus("Please enter a valid URL");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    // Save to chrome storage
    chrome.storage.sync.set(
      {
        targetUrl: targetUrl,
        debugLogging: debugLogging,
        autoOpen: autoOpen,
      },
      () => {
        setStatus("Settings saved successfully!");
        setTimeout(() => setStatus(""), 3000);
      }
    );
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const _response = await fetch(`${targetUrl}/api/health`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setStatus("Connection successful!");
    } catch (e) {
      setStatus("Could not connect - make sure the server is running");
    }
    setIsTesting(false);
    setTimeout(() => setStatus(""), 3000);
  };

  return (<div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>Settings</h1>
    </div>

    <div style={styles.content}>
      <div style={styles.section}>
        <label style={styles.label} htmlFor="target-url">
          Target Website URL
        </label>
        <input
          id="target-url"
          type="text"
          style={{
            ...styles.select,
            fontFamily: "'Courier New', monospace",
          }}
          value={targetUrl}
          onChange={(event) => setTargetUrl(event.target.value)}
          onBlur={saveOptions}
          placeholder="https://your-website.com"
        />

        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
          {presetUrls.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setTargetUrl(preset.value);
                // Auto-save after a short delay to let state update
                setTimeout(() => {
                  chrome.storage.sync.set({ targetUrl: preset.value }, () => {
                    setStatus("Settings saved successfully!");
                    setTimeout(() => setStatus(""), 3000);
                  });
                }, 50);
              }}
              style={{
                padding: "6px 12px",
                border: `1px solid ${BACKGROUND_COLORS.overlay}`,
                borderRadius: "4px",
                background: targetUrl === preset.value ? BRAND_COLORS.accent : BACKGROUND_COLORS.surface,
                color: BRAND_COLORS.primary,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label} htmlFor="debug-logging">
          Debug Logging
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "14px",
            color: BRAND_COLORS.secondary
          }}>
            <input
              id="debug-logging"
              type="checkbox"
              checked={debugLogging}
              onChange={(e) => setDebugLogging(e.target.checked)}
              onBlur={saveOptions}
              style={{
                marginRight: "8px",
                width: "16px",
                height: "16px",
                accentColor: BRAND_COLORS.accent
              }}
            />
            Enable debug console logging
          </label>
        </div>
        <div style={{
          fontSize: "12px",
          color: BRAND_COLORS.secondary,
          marginTop: "4px",
          opacity: 0.8
        }}>
          When enabled, CV Tailor will log detailed information to the browser console for debugging purposes
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label} htmlFor="auto-open">
          Auto-Open CV Tool
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "14px",
            color: BRAND_COLORS.secondary
          }}>
            <input
              id="auto-open"
              type="checkbox"
              checked={autoOpen}
              onChange={(e) => setAutoOpen(e.target.checked)}
              onBlur={saveOptions}
              style={{
                marginRight: "8px",
                width: "16px",
                height: "16px",
                accentColor: BRAND_COLORS.accent
              }}
            />
            Automatically open CV tool when text is selected
          </label>
        </div>
        <div style={{
          fontSize: "12px",
          color: BRAND_COLORS.secondary,
          marginTop: "4px",
          opacity: 0.8
        }}>
          When enabled, the CV tool will open automatically when you select text and click the extension. When disabled, you&apos;ll need to manually click the &quot;Tailor CV&quot; button.
        </div>
      </div>

      <div style={styles.section}>
        <button
          onClick={testConnection}
          disabled={isTesting}
          style={{
            ...styles.button,
            background: `linear-gradient(45deg, ${BRAND_COLORS.secondary} 0%, rgba(${BRAND_COLORS.secondaryRgb}, 0.8) 100%)`,
            marginTop: "0",
            opacity: isTesting ? 0.7 : 1,
            cursor: isTesting ? "not-allowed" : "pointer"
          }}
        >
          {isTesting ? "Testing..." : "Test Connection"}
        </button>
      </div>


      {status && (
        <div style={styles.status}>
          {status}
        </div>
      )}
    </div>
  </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
