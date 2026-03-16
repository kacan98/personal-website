import { ChatPOSTBody } from "@/app/api/chat/chatAPI.model";
import { getSettings } from "@/data";
import projectsSimple from "@/data/projects-simple.json";
import { getOpenAIClient, extractContentFromChunk, hasOpenAIKey } from "@/lib/openai-service";

export const runtime = 'nodejs';

function createSseResponse(message: string) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: message })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function getFallbackMessage(language?: string, isIntroduction = false): string {
  if (language === 'da') {
    return isIntroduction
      ? "Hej, jeg er Karel AI. Chatten er midlertidigt i offline-tilstand, men du kan stadig gennemse Karels erfaring, projekter og CV her på siden."
      : "Chatbotten er midlertidigt i offline-tilstand, så jeg kan ikke svare live lige nu. Se gerne CVet og projekterne på siden for flere detaljer.";
  }

  return isIntroduction
    ? "Hi, I'm Karel AI. The chat is temporarily running in offline mode, but you can still browse Karel's experience, projects, and CV on this site."
    : "The chatbot is temporarily running in offline mode, so I can't answer live right now. Please check the CV and project sections on the site for more details.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatHistory, language } = body as ChatPOSTBody;

    if (!hasOpenAIKey()) {
      console.warn('Chat API fallback: OPENAI_API_KEY is not configured');
      return createSseResponse(getFallbackMessage(language, !chatHistory || chatHistory.length === 0));
    }

    const openai = getOpenAIClient();
    const cvSettings = getSettings();

    const languageInstruction = language === 'da'
      ? 'Respond ONLY in Danish language. Use Danish for all your responses.'
      : 'Respond ONLY in English language. Use English for all your responses.';

    let input = `You are Karel Čančara. Here is your CV/experience: ${JSON.stringify(cvSettings)}. 

Here are your portfolio projects: ${JSON.stringify(projectsSimple)}. 

You are talking to potential employers or clients on your portfolio website. Be friendly, professional, and highlight your best qualities. You can discuss both your CV experience and specific projects you've worked on.

${languageInstruction}

IMPORTANT: Keep ALL responses very short (1-2 sentences max). Be concise and to the point. Only answer questions related to your professional background, skills, and projects.\n\n`;

    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        if (msg.content && typeof msg.content === 'string' && msg.content.trim() && (msg.role === 'user' || msg.role === 'assistant')) {
          const role = msg.role === 'user' ? 'User' : 'Assistant';
          input += `${role}: ${msg.content.trim()}\n`;
        }
      }
    }

    if (!chatHistory || chatHistory.length === 0) {
      const introInstruction = language === 'da'
        ? "Please introduce yourself as Karel AI in Danish and provide a brief, friendly welcome message in Danish that explains you can help with questions about Karel's professional background, experience, and skills. Keep it concise and welcoming. Use Danish language only.\nAssistant:"
        : "Please introduce yourself as Karel AI and provide a brief, friendly welcome message that explains you can help with questions about Karel's professional background, experience, and skills. Keep it concise and welcoming.\nAssistant:";
      input += introInstruction;
    }

    const completion = await openai.responses.create({
      model: 'gpt-5-nano',
      input,
      reasoning: {
        effort: 'minimal',
      },
      text: {
        verbosity: 'low',
      },
      stream: true,
    });

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
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
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
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
