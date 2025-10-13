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
const PROJECT_STORIES_DIR = path.join(process.cwd(), 'project-stories');

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function generateEmbeddingsForDirectory(directory, directoryName) {
  console.log(`🚀 Generating embeddings for ${directoryName}...`);

  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.log(`⚠️  ${directoryName} directory not found, skipping...`);
    return;
  }

  // Get all markdown files in directory
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.md'));

  if (files.length === 0) {
    console.log(`ℹ️  No markdown files found in ${directoryName}`);
    return;
  }

  for (const file of files) {
    const filePath = path.join(directory, file);
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

  console.log(`🎉 ${directoryName} embedding generation complete!`);
}

async function generateEmbeddingsForAllPosts() {
  await generateEmbeddingsForDirectory(BLOG_DIR, 'blog posts');
  await generateEmbeddingsForDirectory(PROJECT_STORIES_DIR, 'project stories');
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  await generateEmbeddingsForAllPosts();
}

main().catch(console.error);