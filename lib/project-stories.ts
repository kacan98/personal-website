import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';

export interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  embedding?: number[];
  relevance?: number;
}

export async function getAllStories(): Promise<Story[]> {
  const projectStoriesDir = path.join(process.cwd(), 'case-studies');

  if (!fs.existsSync(projectStoriesDir)) {
    return [];
  }

  const files = fs.readdirSync(projectStoriesDir).filter(file => file.endsWith('.md'));

  const stories: Story[] = files.map(file => {
    const filePath = path.join(projectStoriesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    return {
      id: file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      content: content,
      tags: frontmatter.tags || [],
      category: frontmatter.category || 'uncategorized',
      metrics: frontmatter.metrics,
      embedding: frontmatter.embedding || null
    };
  });

  return stories;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

async function createEmbedding(text: string): Promise<number[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export async function findRelevantStories(
  jobDescription: string,
  maxStories: number = 5
): Promise<Story[]> {
  const stories = await getAllStories();

  // Filter out stories without embeddings
  const storiesWithEmbeddings = stories.filter(story => story.embedding && story.embedding.length > 0);

  if (storiesWithEmbeddings.length === 0) {
    // Fallback: return all stories if no embeddings
    return stories.slice(0, maxStories);
  }

  try {
    // Create embedding for job description
    const jobEmbedding = await createEmbedding(jobDescription);

    // Calculate similarity for each story and rank them
    const rankedStories = storiesWithEmbeddings.map(story => ({
      ...story,
      relevance: cosineSimilarity(jobEmbedding, story.embedding!)
    })).sort((a, b) => b.relevance - a.relevance);

    return rankedStories.slice(0, maxStories);
  } catch (error) {
    console.error('Error generating job embedding:', error);
    // Fallback: return stories without ranking
    return storiesWithEmbeddings.slice(0, maxStories);
  }
}