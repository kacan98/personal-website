"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Alert, Button, Snackbar } from "@mui/material";
import React, { useState } from "react";

interface CopyButtonProps {
  jsonData: string;
}

export default function CopyButton({ jsonData }: CopyButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Copy JSON to clipboard
    navigator.clipboard
      .writeText(jsonData)
      .then(() => {
        setCopied(true);
        setOpen(true);
        // Reset icon after 3 seconds
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
        onClick={handleCopy}
        sx={{
          mt: 3,
          mb: 3,
          fontWeight: "bold",
          boxShadow: 3,
          padding: "10px 24px",
          borderRadius: "28px",
          textTransform: "none",
          fontSize: "1rem",
          bgcolor: copied ? "success.main" : "primary.main",
          "&:hover": {
            bgcolor: copied ? "success.dark" : "primary.dark",
          },
        }}
      >
        {copied ? "Copied!" : "Copy CV Json"}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          CV JSON copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
