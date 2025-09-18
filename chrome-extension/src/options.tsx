import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    color: "#ffffff",
    fontFamily: "'Open Sans', system-ui, sans-serif",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  },
  header: {
    background: "linear-gradient(90deg, #333 0%, #444 100%)",
    padding: "30px",
    textAlign: "center" as const,
    borderBottom: "1px solid #444"
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
    padding: "20px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "8px",
    border: "1px solid #333"
  },
  label: {
    display: "block",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#e0e0e0"
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "#2a2a2a",
    color: "#ffffff",
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
    accentColor: "#4CAF50"
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#e0e0e0",
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
    background: "linear-gradient(45deg, #4CAF50 0%, #45a049 100%)",
    color: "#ffffff",
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
    background: "rgba(76, 175, 80, 0.1)",
    border: "1px solid rgba(76, 175, 80, 0.3)",
    borderRadius: "6px",
    color: "#81C784",
    fontSize: "14px",
    textAlign: "center" as const
  }
};

const Options = () => {
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Preset URLs for quick selection
  const presetUrls = [
    { label: "Local Development", value: "http://localhost:3000" },
    { label: "Production", value: "https://your-domain.com" }, // Will be replaced in production build
  ];

  useEffect(() => {
    // Restore saved URL from storage
    chrome.storage.sync.get(
      {
        targetUrl: "http://localhost:3000",
      },
      (items) => {
        setTargetUrl(items.targetUrl);
      }
    );
  }, []);

  const saveOptions = () => {
    // Validate URL
    try {
      new URL(targetUrl);
    } catch (e) {
      setStatus("❌ Please enter a valid URL");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    // Save to chrome storage
    chrome.storage.sync.set(
      {
        targetUrl: targetUrl,
      },
      () => {
        setStatus("✅ Settings saved successfully!");
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
      setStatus("✅ Connection successful!");
    } catch (e) {
      setStatus("⚠️ Could not connect - make sure the server is running");
    }
    setIsTesting(false);
    setTimeout(() => setStatus(""), 3000);
  };

  return (<div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>CV Tailor</h1>
      <p style={styles.subtitle}>Extension Options & Preferences</p>
    </div>

    <div style={styles.content}>
      <div style={styles.section}>
        <label style={styles.label} htmlFor="target-url">
          🌐 Target Website URL
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
          placeholder="https://your-website.com"
        />

        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
          {presetUrls.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setTargetUrl(preset.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #444",
                borderRadius: "4px",
                background: targetUrl === preset.value ? "#4CAF50" : "#2a2a2a",
                color: "#ffffff",
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
        <button
          onClick={testConnection}
          disabled={isTesting}
          style={{
            ...styles.button,
            background: "linear-gradient(45deg, #2196F3 0%, #1976D2 100%)",
            marginTop: "0",
            opacity: isTesting ? 0.7 : 1,
            cursor: isTesting ? "not-allowed" : "pointer"
          }}
        >
          {isTesting ? "🔄 Testing..." : "🧪 Test Connection"}
        </button>
      </div>

      <button
        onClick={saveOptions}
        style={{
          ...styles.button,
          ...(isHovered ? styles.buttonHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        💾 Save Settings
      </button>

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
