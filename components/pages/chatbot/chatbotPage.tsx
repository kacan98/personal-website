import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import ChatBotUI from "@/components/pages/chatbot/chatBotUI";

export function ChatbotPage() {
  return (
    <PageWrapper
      title={"Chatbot"}
      description="Interactive AI assistant with comprehensive knowledge about my professional background and expertise."
    >
      <ChatBotUI />
    </PageWrapper>
  );
}

export default ChatbotPage;
