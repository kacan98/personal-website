import { ChatPOSTBody } from "@/app/api/chat/chatAPI.model";
import { getCvSettings } from "@/data";
import projectsSimple from "@/data/projects-simple.json";
import { getOpenAIClient, extractContentFromChunk } from "@/lib/openai-service";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();

    const body = await req.json();
    const { chatHistory, language } = body as ChatPOSTBody;

    const cvSettings = getCvSettings(language || 'en');

    // Determine language instruction
    const languageInstruction = language === 'da' 
      ? 'Respond ONLY in Danish language. Use Danish for all your responses.'
      : 'Respond ONLY in English language. Use English for all your responses.';
    
    // Build input string for Responses API
    let input = `You are Karel Čančara. Here is your CV/experience: ${JSON.stringify(cvSettings)}. 

Here are your portfolio projects: ${JSON.stringify(projectsSimple)}. 

You are talking to potential employers or clients on your portfolio website. Be friendly, professional, and highlight your best qualities. You can discuss both your CV experience and specific projects you've worked on.

${languageInstruction}

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
      const introInstruction = language === 'da' 
        ? "Please introduce yourself as Karel AI in Danish and provide a brief, friendly welcome message in Danish that explains you can help with questions about Karel's professional background, experience, and skills. Keep it concise and welcoming. Use Danish language only.\nAssistant:"
        : "Please introduce yourself as Karel AI and provide a brief, friendly welcome message that explains you can help with questions about Karel's professional background, experience, and skills. Keep it concise and welcoming.\nAssistant:";
      input += introInstruction;
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
            const content = extractContentFromChunk(chunk);

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