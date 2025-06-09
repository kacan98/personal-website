import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import ChatBotUI from "@/components/pages/chatbot/chatBotUI";

export function ChatbotPage() {
  return (
    <PageWrapper
      title={"Chatbot"}
      description='Chat to "me" (AI that knows everything about Karel).'
    >
      <ChatBotUI />
    </PageWrapper>
  );
}

export default ChatbotPage;
