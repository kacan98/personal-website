"use client";
import { Box, Button, List, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream";
import {
  ChatCompletionMessageParam,
  ChatPOSTBody,
} from "@/app/api/chat/chatAPI.model";
import Message from "@/components/pages/chatbot/message";

const ChatBotUI = () => {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [messageBeingReceived, setMessageBeingReceived] = useState<
  string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //useEffect is triggered when messages change
    //This is here because we only want to send user messages
    if (!loading || messages[messages.length - 1]?.role === "assistant") {
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

  if (messages.length === 0) {
    const messagesFromLocalStorage = localStorage.getItem("chatMessages");
    if (messagesFromLocalStorage) {
      setMessages(JSON.parse(messagesFromLocalStorage));
    }
    setLoading(false);
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
        }}
      >
        <TextField
          disabled={loading}
          variant="outlined"
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          disabled={loading || input === ""}
          variant="contained"
          onClick={handleSend}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBotUI