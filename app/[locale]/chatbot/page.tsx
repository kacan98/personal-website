import ChatbotPage from "@/components/pages/chatbot/chatbotPage";
import { getSettings } from "@/data";
import { notFound } from "next/navigation";

export default function ChatbotRoute() {
  const settings = getSettings();
  const { chatbot } = settings?.specialPages || {};
  
  if (!chatbot) {
    notFound();
  }
  
  return <ChatbotPage />;
}