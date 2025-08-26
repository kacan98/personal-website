"use client";
import { ChatCompletionMessageParam } from "@/app/api/chat/chatAPI.model";
import Message from "@/components/pages/chatbot/message";
import { useAppDispatch } from "@/redux/hooks";
import { clearChat } from "@/redux/slices/chatbotSlice";
import { DeleteSweep as DeleteSweepIcon } from "@mui/icons-material";
import { Box, Button, IconButton, List, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BRAND_COLORS, BACKGROUND_COLORS } from "@/app/colors";
import { useTranslations, useLocale } from 'next-intl';

const ChatBotUI = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('chatbot');
  const locale = useLocale();
  
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [previousLocale, setPreviousLocale] = useState<string>(locale);

  // Send message to API
  const sendMessage = async (messageHistory: ChatCompletionMessageParam[]) => {
    setError(null);
    setLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: messageHistory, language: locale }),
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

  // Handle locale changes - clear messages and get new introduction
  useEffect(() => {
    if (!mounted) return; // Don't run on initial mount
    
    if (locale !== previousLocale) {
      // Clear current messages
      setMessages([]);
      setInput("");
      setStreamingMessage("");
      setError(null);
      localStorage.removeItem("chatMessages");
      
      // Get introduction in new language (with small delay to ensure state is updated)
      setTimeout(() => {
        sendMessage([]);
      }, 100);
      
      // Update previous locale
      setPreviousLocale(locale);
    }
  }, [locale, mounted, previousLocale]);

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
        height: "70vh",
        maxWidth: "800px",
        mx: "auto",
        border: `1px solid ${BRAND_COLORS.secondary}`,
        borderRadius: 3,
        backgroundColor: BACKGROUND_COLORS.surface,
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
          {t('initializing')}
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
        border: `1px solid ${BRAND_COLORS.accent}80`,
        borderRadius: 3,
        backgroundColor: `${BRAND_COLORS.accent}0D`,
        maxWidth: "800px",
        mx: "auto",
        p: 4,
        textAlign: "center",
      }}>
        <Typography variant="h6" sx={{ color: BRAND_COLORS.accent, mb: 2 }}>
          ⚠️ {t('chatError')}
        </Typography>
        <Typography sx={{ color: `${BRAND_COLORS.primary}CC`, mb: 4 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleClear}
          startIcon={<DeleteSweepIcon />}
          sx={{
            backgroundColor: BRAND_COLORS.accent,
            "&:hover": { backgroundColor: `${BRAND_COLORS.accent}CC` },
          }}
        >
          {t('startNewChat')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "70vh",
      maxWidth: "800px",
      mx: "auto",
      border: `1px solid ${BRAND_COLORS.secondary}`,
      borderRadius: 3,
      backgroundColor: BACKGROUND_COLORS.surface,
      overflow: "hidden",
      boxShadow: `0 4px 24px rgba(0, 0, 0, 0.1)`,
    }}>
      {/* Header */}
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        p: 1.5,
        borderBottom: `1px solid ${BRAND_COLORS.secondary}`,
        backgroundColor: `${BACKGROUND_COLORS.primary}40`,
      }}>
        <Tooltip title={t('clearTooltip')} placement="left">
          <IconButton
            onClick={handleClear}
            disabled={loading && messages.length === 0}
            size="small"
            sx={{
              color: BRAND_COLORS.secondary,
              opacity: 0.8,
              '&:hover': {
                color: BRAND_COLORS.secondary,
                opacity: 1,
                backgroundColor: `${BRAND_COLORS.secondary}1A`,
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
        borderTop: `1px solid ${BRAND_COLORS.secondary}`,
        gap: 1,
      }}>
        <TextField
          disabled={loading}
          variant="outlined"
          size="small"
          fullWidth
          placeholder={t('placeholder')}
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
              backgroundColor: `${BACKGROUND_COLORS.primary}40`,
              '& fieldset': { borderColor: BRAND_COLORS.secondary },
              '&:hover fieldset': { borderColor: BRAND_COLORS.secondary },
              '&.Mui-focused fieldset': { borderColor: BRAND_COLORS.secondary },
            },
          }}
        />
        <Button
          disabled={loading || !input.trim()}
          variant="contained"
          onClick={handleSend}
          sx={{
            minWidth: '80px',
            backgroundColor: BRAND_COLORS.accent,
            '&:hover': { backgroundColor: `${BRAND_COLORS.accent}CC` },
            '&:disabled': { backgroundColor: `${BRAND_COLORS.primary}20` },
          }}
        >
          {loading ? t('sending') : t('sendButton')}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBotUI;