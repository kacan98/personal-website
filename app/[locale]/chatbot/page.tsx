import ChatbotPage from "@/components/pages/chatbot/chatbotPage";
import { getSettings } from "@/data-utils";
import { notFound } from "next/navigation";

export default async function ChatbotRoute() {
  const settings = await getSettings();
  const { chatbot } = settings?.specialPages || {};
  
  if (!chatbot) {
    notFound();
  }
  
  return <ChatbotPage />;
}