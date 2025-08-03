"use client";
import { Box, Button, List, TextField, IconButton, Tooltip } from "@mui/material";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import {
  ChatCompletionMessageParam,
  ChatPOSTBody,
} from "@/app/api/chat/chatAPI.model";
import Message from "@/components/pages/chatbot/message";
import { useAppDispatch } from "@/store";
import { clearChat } from "@/store/slices/chatbotSlice";

const ChatBotUI = () => {
  const dispatch = useAppDispatch();
  
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [messageBeingReceived, setMessageBeingReceived] = useState<
    string | null
  >(null);
  const [triedLocalStorage, setTriedLocalStorage] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading) return

    // useEffect is triggered when messages change
    // we don't want to send a request after receiving a message from the assistant
    // but we do want to send a request on the first render
    if (messages[messages.length - 1]?.role === "assistant") {
      return;
    }

    const chatPOSTBody: ChatPOSTBody = {
      chatHistory: messages,
    };

    fetch("/api/chat", {
      body: JSON.stringify(chatPOSTBody),
      method: "POST",
    })
      .then((res) => {
        const runner = ChatCompletionStream.fromReadableStream(res.body!);

        runner.on("content", (delta, snapshot) => {
          setMessageBeingReceived(snapshot);
          scrollToBottom();
        });

        runner.on("finalChatCompletion", async (completion) => {
          setMessages((prev) => {
            const newMessages: ChatCompletionMessageParam[] = [
              ...prev,
              {
                content: completion.choices[0].message.content,
                role: "assistant",
              },
            ];
            setMessageBeingReceived(null);
            setLoading(false);
            localStorage.setItem("chatMessages", JSON.stringify(newMessages));
            return newMessages;
          });
        });
      })
      .catch((err) => console.error(err)); //TODO: handle error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  if (messages.length === 0 && !triedLocalStorage) {
    const messagesFromLocalStorage = localStorage.getItem("chatMessages");
    if (messagesFromLocalStorage) {
      setMessages(JSON.parse(messagesFromLocalStorage))
      setLoading(false);
    }
    setTriedLocalStorage(true);
    return null;
  }

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { content: input, role: "user" }]);
    localStorage.setItem(
      "chatMessages",
      JSON.stringify([...messages, { content: input, role: "user" }])
    );
    setInput("");
    setLoading(true);
    scrollToBottom();
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartOver = () => {
    // Clear Redux state
    dispatch(clearChat());
    // Clear local state
    setMessages([]);
    setInput("");
    setLoading(true);
    setMessageBeingReceived(null);
    // Clear localStorage
    localStorage.removeItem("chatMessages");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        border: "1px solid gray",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header with start over button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid gray",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <Box sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
          Chat with Karel AI
        </Box>
        <Tooltip title="Start Over" placement="left">
          <IconButton
            onClick={handleStartOver}
            disabled={loading && messages.length === 0}
            size="small"
            sx={{
              color: 'rgba(245, 158, 11, 0.8)',
              '&:hover': {
                color: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            chatRole={message.role as "assistant" | "user"}
            text={message.content as string}
          />
        ))}
        {loading && (
          <Message chatRole="assistant" text={messageBeingReceived} />
        )}
        <div ref={messagesEndRef} />
      </List>
      <Box
        sx={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid gray",
          gap: 1,
        }}
      >
        <TextField
          disabled={loading}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Ask me anything about Karel..."
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
              '&:hover fieldset': {
                borderColor: 'rgba(245, 158, 11, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#f59e0b',
              },
            },
          }}
        />
        <Button
          disabled={loading || input.trim() === ""}
          variant="contained"
          onClick={handleSend}
          sx={{
            minWidth: '80px',
            backgroundColor: '#f59e0b',
            '&:hover': {
              backgroundColor: '#d97706',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          {loading ? "..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBotUI