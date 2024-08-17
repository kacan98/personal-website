import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import ChatBotUI from "@/components/pages/chatbot/chatBotUI";

export function ChatbotPage() {
  return (
    <PageWrapper
      title={"Chatbot"}
      description='Chat to "me" (buit on Chat gpt-4o-mini)'
    >
      <ChatBotUI />
    </PageWrapper>
  );
}

export default ChatbotPage;
