import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const styles = {
  container: {
    width: "420px",
    minHeight: "500px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    color: "#ffffff",
    fontFamily: "'Open Sans', system-ui, sans-serif",
    borderRadius: "0px",
    overflow: "hidden"
  },
  header: {
    background: "linear-gradient(90deg, #333 0%, #444 100%)",
    padding: "20px",
    textAlign: "center" as const,
    borderBottom: "1px solid #444"
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
    border: "1px solid #444",
    borderRadius: "8px",
    background: "#2a2a2a",
    color: "#ffffff",
    fontSize: "13px",
    fontFamily: "'Open Sans', system-ui, sans-serif",
    lineHeight: "1.5",
    resize: "vertical" as const,
    outline: "none",
    transition: "border-color 0.2s ease"
  },
  textareaFocus: {
    borderColor: "#666"
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
    background: "linear-gradient(45deg, #4CAF50 0%, #45a049 100%)",
    color: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
  },
  primaryButtonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  placeholder: {
    color: "#888",
    fontStyle: "italic"
  }
};

const Popup = () => {
  const [pageText, setPageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const jobIdRef = useRef(`job-${Date.now()}`);

  const openCVTool = (textToStore?: string) => {
    const jobDescription = textToStore || pageText;
    // Store the current job description content right before opening the CV tool
    chrome.storage.local.set({ [jobIdRef.current]: jobDescription }, () => {
      // Only open the CV tool after the storage operation completes
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTabUrl = tabs[0]?.url;
        if (currentTabUrl) {
          const newWindowDetails = await chrome.windows.create({
            url: currentTabUrl,
            type: "normal",
          });

          const newWindowId = newWindowDetails.id;
          // Open localhost as a new tab in the new window
          await chrome.tabs.create({
            url: `http://localhost:3000/cv/${jobIdRef.current}`,
            windowId: newWindowId,
          });
        }
      });
    });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PAGE_TEXT" }, (response) => {
          // Handle the case where response might be undefined
          if (chrome.runtime.lastError) {
            setIsLoading(false);
            return;
          }

          const { selectedText } = response || {};

          if (selectedText) {
            setPageText(selectedText);
          }

          setIsLoading(false);

          // Auto-open if there's selected text 
          if (selectedText) {
            // Use the text directly since state hasn't updated yet
            openCVTool(selectedText);
          }
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return (<div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>CV Tailor</h1>
      <p style={styles.subtitle}>Automatically customize your CV for specific job postings using AI</p>
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
          📝 Tailor CV {pageText.length < 10 && '(min 10 chars)'}
        </button>
      </div>
    </div>
  </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
