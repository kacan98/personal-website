import { CvProps } from "@/components/pages/cv/cvPage";
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import { OpenAI } from "openai";

export type CvTranslateParams = {
  cvBody: CVSettings;
  targetLanguage: string;
  extraGptInput?: string;
};

export async function POST(req: Request): Promise<Response> {
  const body: CvTranslateParams = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const translationStream = openai.beta.chat.completions.stream({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
          Translate the following json to ${body.targetLanguage} where there is text. 
          Keep links and so as they are. 
          Keep the tone and context.
          You are translating my CV.
          If there are technical terms, prefer to keep them in English.
          Example: 
            BAD: "Implemented features and fixed bugs" => "Implementoval jsem funkce a opravoval chyby" 
            GOOD: "Implementoval features and opravoval bugy".

            Bad: "unit tests" => "jednotkové testy"
            BAD: "unit tests" => "enhetstestning"
            GOOD: "unit tests" => "unit tester/unit testy"
          Return back a json object with the translated text.

          also... ${body.extraGptInput}
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

  return (
    new Response(translationStream.toReadableStream(), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  )
}
