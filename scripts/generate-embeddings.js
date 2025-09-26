/**
 * Script to generate embeddings for blog posts
 * Run with: node scripts/generate-embeddings.js
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOG_DIR = path.join(process.cwd(), 'blog');

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function generateEmbeddingsForAllPosts() {
  console.log('🚀 Generating embeddings for blog posts...');

  // Get all markdown files in blog directory
  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Skip if embedding already exists
    if (frontmatter.embedding && frontmatter.embedding !== null) {
      console.log(`✅ ${file} - embedding already exists`);
      continue;
    }

    console.log(`📝 Processing ${file}...`);

    try {
      // Create embedding from full content (excluding frontmatter)
      const embedding = await createEmbedding(content);

      // Update frontmatter with embedding
      const updatedFrontmatter = {
        ...frontmatter,
        embedding: embedding
      };

      // Reconstruct file with updated frontmatter
      const updatedContent = matter.stringify(content, updatedFrontmatter);

      // Write back to file
      fs.writeFileSync(filePath, updatedContent);

      console.log(`✅ ${file} - embedding generated and saved`);

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log('🎉 Embedding generation complete!');
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  await generateEmbeddingsForAllPosts();
}

main().catch(console.error);