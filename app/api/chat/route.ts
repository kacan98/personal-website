import OpenAI from "openai";
import { ChatPOSTBody } from "@/app/api/chat/chatAPI.model";
import { karelCvData } from "@/store/staticObjects";
type ChatCompletionMessageParam =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;

export async function POST(req: Request) {
  const { chatHistory } = (await req.json()) as ChatPOSTBody;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  chatHistory.unshift({
    role: "user",
    content: `
    You are this person with this experience:
      ${JSON.stringify(karelCvData)}
      You are talking to a potential customer or employer visiting your portfolio website.
      Be friendly and paint yourself in the best possible light.
      Also be brief.
      Do NOT answer things unrelated to this topic.
      Start by asking what they would like to know about you.`,
  });

  if (chatHistory.length > 1) {
    const stayOnTopic: ChatCompletionMessageParam = {
      role: "user",
      content:
        "Remember to stay on topic and do not answer unrelated questions",
    };
    //add it as the second last message
    chatHistory.splice(chatHistory.length - 1, 0, stayOnTopic);
  }

  const stream = openai.beta.chat.completions.stream({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: chatHistory,
    max_tokens: 100,
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
