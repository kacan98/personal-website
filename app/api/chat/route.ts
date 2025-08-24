import { ChatPOSTBody } from "@/app/api/chat/chatAPI.model";
import { getCvSettings } from "@/data-utils";
import projectsSimple from "@/data/projects-simple.json";
import OpenAI from "openai";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { chatHistory } = body as ChatPOSTBody;

    const cvSettings = await getCvSettings();

    // Build input string for Responses API
    let input = `You are Karel Čančara. Here is your CV/experience: ${JSON.stringify(cvSettings)}. 

Here are your portfolio projects: ${JSON.stringify(projectsSimple)}. 

You are talking to potential employers or clients on your portfolio website. Be friendly, professional, and highlight your best qualities. You can discuss both your CV experience and specific projects you've worked on.

IMPORTANT: Keep ALL responses very short (1-2 sentences max). Be concise and to the point. Only answer questions related to your professional background, skills, and projects.\n\n`;

    // Add chat history if it exists and has content
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        if (msg.content && typeof msg.content === 'string' && msg.content.trim() && (msg.role === 'user' || msg.role === 'assistant')) {
          const role = msg.role === 'user' ? 'User' : 'Assistant';
          input += `${role}: ${msg.content.trim()}\n`;
        }
      }
    }

    // If there's no chat history, provide a welcoming introduction
    if (!chatHistory || chatHistory.length === 0) {
      input += "Please introduce yourself as Karel AI and provide a brief, friendly welcome message that explains you can help with questions about Karel's professional background, experience, and skills. Keep it concise and welcoming.\nAssistant:";
    }

    const completion = await openai.responses.create({
      model: 'gpt-5-nano',
      input: input,
      reasoning: {
        effort: "minimal" // For fastest response
      },
      text: {
        verbosity: "low"
      },
      stream: true,
    });

    // Create a readable stream for Responses API
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of completion) {
            // For Responses API, handle different chunk formats
            let content = '';
            const chunkData = chunk as any; // Type assertion for flexibility with different API response formats
            
            if (chunkData.delta?.content) {
              content = String(chunkData.delta.content);
            } else if (chunkData.content) {
              content = String(chunkData.content);
            } else if (chunkData.text) {
              content = String(chunkData.text);
            }
            
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}