import OpenAI from "openai";
import { getAllProjects } from "./projects";

export interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  archived?: boolean;
  metrics?: {
    impact?: string | { en: string; da?: string; sv?: string };
    timeframe?: string;
    usersAffected?: string;
  };
  embedding?: number[];
  relevance?: number;
}

export async function getAllStories(): Promise<Story[]> {
  return getAllProjects("en")
    .filter((project) => project.content && project.content.trim().length > 0)
    .map((project) => ({
      id: project.slug,
      title: project.title,
      content: project.content,
      tags: project.tags || [],
      category: project.category || "uncategorized",
      archived: project.archived || false,
      metrics: project.metrics,
      embedding: undefined,
    }));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function createEmbedding(text: string): Promise<number[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
  return response.data[0].embedding;
}

export async function findRelevantStories(jobDescription: string, maxStories: number = 5): Promise<Story[]> {
  const stories = await getAllStories();
  const storiesWithEmbeddings = stories.filter((story) => story.embedding && story.embedding.length > 0);

  if (storiesWithEmbeddings.length === 0) {
    return stories.slice(0, maxStories);
  }

  try {
    const jobEmbedding = await createEmbedding(jobDescription);
    return storiesWithEmbeddings
      .map((story) => ({ ...story, relevance: cosineSimilarity(jobEmbedding, story.embedding!) }))
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, maxStories);
  } catch (error) {
    console.error("Error generating job embedding:", error);
    return storiesWithEmbeddings.slice(0, maxStories);
  }
}
