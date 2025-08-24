import OpenAI from "openai";

/**
 * {
 * content: string
 * role: string
 * name?: string
 * }
 * */
export type ChatCompletionMessageParam =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;

export type ChatPOSTBody = {
  chatHistory: ChatCompletionMessageParam[];
  language?: string;
};
