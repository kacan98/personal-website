import OpenAI from "openai";
import { OPENAI_API_KEY } from "./env";

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// Centralized model configuration
export const OPENAI_MODELS = {
  // Latest and most capable model
  LATEST: 'gpt-5',
  // Mini version of latest model
  LATEST_MINI: 'gpt-5-mini',
  // Previous generation mini model
  PREVIOUS_MINI: 'gpt-4o-mini'
} as const;

// Singleton OpenAI client
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Type for OpenAI chunk data - handles different response formats
export interface OpenAIChunk {
  delta?: { content?: string };
  content?: string;
  text?: string;
}

export function extractContentFromChunk(chunk: unknown): string {
  const chunkData = chunk as OpenAIChunk;

  if (chunkData.delta?.content) {
    return String(chunkData.delta.content);
  }
  if (chunkData.content) {
    return String(chunkData.content);
  }
  if (chunkData.text) {
    return String(chunkData.text);
  }

  return '';
}