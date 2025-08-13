"use client";
import { ChatCompletionMessageParam } from "@/app/api/chat/chatAPI.model";
import Message from "@/components/pages/chatbot/message";
import { useAppDispatch } from "@/store";
import { clearChat } from "@/store/slices/chatbotSlice";
import { DeleteSweep as DeleteSweepIcon } from "@mui/icons-material";
import { Box, Button, IconButton, List, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const ChatBotUI = () => {
  const dispatch = useAppDispatch();
  
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Send message to API
  const sendMessage = async (messageHistory: ChatCompletionMessageParam[]) => {
    setError(null);
    setLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: messageHistory }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              const newMessages = [...messageHistory, { content: fullContent, role: "assistant" as const }];
              setMessages(newMessages);
              localStorage.setItem("chatMessages", JSON.stringify(newMessages));
              setStreamingMessage("");
              setLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingMessage(fullContent);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setLoading(false);
      setStreamingMessage("");
    }
  };

  // Handle client-side mounting and localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // If no stored messages, get introduction from API
      sendMessage([]);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!mounted) return;
    const messageElements = document.querySelectorAll('[data-message-index]');
    const lastMessage = messageElements[messageElements.length - 1];
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, streamingMessage, mounted]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { content: input.trim(), role: "user" as const };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));
    setInput("");
    
    sendMessage(newMessages);
  };

  const handleClear = () => {
    dispatch(clearChat());
    setMessages([]);
    setInput("");
    setStreamingMessage("");
    setError(null);
    localStorage.removeItem("chatMessages");
    // Get a fresh introduction from the API
    sendMessage([]);
  };

  // Loading state for initial mount
  if (!mounted) {
    return (
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        height: "60vh",
        border: "1px solid rgba(120, 120, 120, 0.3)",
        borderRadius: "10px",
        backgroundColor: "rgba(32, 32, 32, 0.95)",
        backdropFilter: "blur(10px)",
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}>
          {/* Loading dots animation */}
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "secondary.main",
                animation: `pulse 1.5s infinite ${index * 0.2}s`,
                "@keyframes pulse": {
                  "0%, 80%, 100%": {
                    opacity: 0.3,
                    transform: "scale(0.8)",
                  },
                  "40%": {
                    opacity: 1,
                    transform: "scale(1.2)",
                  },
                },
              }}
            />
          ))}
        </Box>
        <Typography sx={{ 
          color: "text.secondary",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "0.9rem",
        }}>
          Initializing Karel AI...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        border: "1px solid rgba(244, 67, 54, 0.5)",
        borderRadius: "10px",
        backgroundColor: "rgba(244, 67, 54, 0.05)",
        p: 4,
        textAlign: "center",
      }}>
        <Typography variant="h6" sx={{ color: "#ff6b6b", mb: 2 }}>
          ⚠️ Chat Error
        </Typography>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleClear}
          startIcon={<DeleteSweepIcon />}
          sx={{
            backgroundColor: "#ff6b6b",
            "&:hover": { backgroundColor: "#e55353" },
          }}
        >
          Start New Chat
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "60vh",
      border: "1px solid rgba(120, 120, 120, 0.3)",
      borderRadius: "10px",
      backgroundColor: "rgba(32, 32, 32, 0.95)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid rgba(120, 120, 120, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
          Chat with Karel AI
        </Typography>
        <Tooltip title="Clear Chat & Start New Conversation" placement="left">
          <IconButton
            onClick={handleClear}
            disabled={loading && messages.length === 0}
            size="small"
            sx={{
              color: 'secondary.main',
              opacity: 0.8,
              '&:hover': {
                color: 'secondary.main',
                opacity: 1,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            <DeleteSweepIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages */}
      <List sx={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "10px",
      }}>

        {messages.map((message, index) => (
          <div key={index} data-message-index={index}>
            <Message
              chatRole={message.role as "assistant" | "user"}
              text={message.content as string}
            />
          </div>
        ))}
        
        {loading && streamingMessage && (
          <div data-message-index={`streaming-${messages.length}`}>
            <Message chatRole="assistant" text={streamingMessage} />
          </div>
        )}

        {loading && !streamingMessage && (
          <div data-message-index={`loading-${messages.length}`}>
            <Message chatRole="assistant" text={null} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </List>

      {/* Input */}
      <Box sx={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid rgba(120, 120, 120, 0.3)",
        gap: 1,
      }}>
        <TextField
          disabled={loading}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Ask about my experience and skills..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: 'secondary.main' },
              '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
            },
          }}
        />
        <Button
          disabled={loading || !input.trim()}
          variant="contained"
          onClick={handleSend}
          sx={{
            minWidth: '80px',
            backgroundColor: 'secondary.main',
            '&:hover': { backgroundColor: 'secondary.dark' },
            '&:disabled': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
          }}
        >
          {loading ? "..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBotUI;