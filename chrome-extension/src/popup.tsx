import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const [pageText, setPageText] = useState("");
  const jobIdRef = useRef(`job-${Date.now()}`);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PAGE_TEXT" }, ({text, isSelectedText}) => {
          if (text) {
            setPageText(text);
            chrome.storage.local.set({ [jobIdRef.current]: text })
          }

          if(isSelectedText){
            openCVTool();
          }
        });
      }
    });
  }, []);

  const saveContent = () => {
    chrome.storage.local.set({ [jobIdRef.current]: pageText });
  };

  const openCVTool = () => {
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
          url: `http://localhost:3000/create-cv/${jobIdRef.current}`,
          windowId: newWindowId,
        });
      }
    });
  };

  return (
    <div style={{ width: "500px" }}>
      <textarea
        style={{ width: "100%", height: "300px" }}
        value={pageText}
        onChange={(e) => setPageText(e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={saveContent} style={{ marginRight: "10px" }}>
          Save Content
        </button>
        <button onClick={openCVTool}>Open CV Tool</button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
