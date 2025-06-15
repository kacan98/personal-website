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
  const [color, setColor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [like, setLike] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        favoriteColor: "red",
        likesColor: true,
      },
      (items) => {
        setColor(items.favoriteColor);
        setLike(items.likesColor);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        favoriteColor: color,
        likesColor: like,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("✅ Options saved successfully!");
        const id = setTimeout(() => {
          setStatus("");
        }, 3000);
        return () => clearTimeout(id);
      }
    );
  };

  return (<div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>CV Tailor</h1>
      <p style={styles.subtitle}>Extension Options & Preferences</p>
    </div>

    <div style={styles.content}>
      <div style={styles.section}>
        <label style={styles.label} htmlFor="color-select">
          🎨 Favorite Color Theme
        </label>
        <select
          id="color-select"
          style={styles.select}
          value={color}
          onChange={(event) => setColor(event.target.value)}
        >
          <option value="red">❤️ Red</option>
          <option value="green">💚 Green</option>
          <option value="blue">💙 Blue</option>
          <option value="yellow">💛 Yellow</option>
        </select>
      </div>

      <div style={styles.section}>
        <div style={styles.checkboxContainer}>
          <input
            id="like-colors"
            type="checkbox"
            style={styles.checkbox}
            checked={like}
            onChange={(event) => setLike(event.target.checked)}
          />
          <label htmlFor="like-colors" style={styles.checkboxLabel}>
            🌈 I enjoy working with colors in my CV designs
          </label>
        </div>
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
        💾 Save Preferences
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
