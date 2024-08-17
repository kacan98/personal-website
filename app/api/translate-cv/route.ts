import { CvProps } from "@/components/pages/cv/cvPage";
import { OpenAI } from "openai";

export type CvTranslateParams = {
  cvBody: CvProps;
  targetLanguage: string;
};

export async function POST(req: Request) {
  const body: CvTranslateParams = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const translation = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
          Translate the following json to ${body.targetLanguage} where there is text. 
          Keep links and so as they are. 
          Keep the tone and context.
          You are translating my CV.
          Return back a json object with the translated text.
          `,
      },
      {
        role: "user",
        content: JSON.stringify(body.cvBody),
      },
    ],
    max_tokens: 2500,
    response_format: {
      type: "json_object",
    },
  });

  return new Response(JSON.stringify(translation.choices[0].message.content), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
