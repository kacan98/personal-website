/**
 * Script to generate embeddings for blog posts
 * Run with: node scripts/generate-embeddings.js
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOG_DIR = path.join(process.cwd(), "blog");
const PROJECT_STORIES_DIR = path.join(process.cwd(), "project-stories");

function extractMdxMetadataAndBody(fileContent) {
  const match = fileContent.match(/^export const metadata = (\{[\s\S]*?\});\n\n([\s\S]*)$/);

  if (!match) {
    throw new Error("missing metadata export");
  }

  return {
    metadata: JSON.parse(match[1]),
    body: match[2],
  };
}

function serializeMdx(metadata, body) {
  return `export const metadata = ${JSON.stringify(metadata, null, 2)};\n\n${body.trim()}\n`;
}

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function generateEmbeddingsForDirectory(directory, directoryName) {
  console.log(`Generating embeddings for ${directoryName}...`);

  if (!fs.existsSync(directory)) {
    console.log(`${directoryName} directory not found, skipping...`);
    return;
  }

  const extension = directoryName === "project stories" ? ".mdx" : ".md";
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(extension));

  if (files.length === 0) {
    console.log(`No content files found in ${directoryName}`);
    return;
  }

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = file.endsWith(".mdx")
      ? extractMdxMetadataAndBody(fileContent)
      : { metadata: {}, body: fileContent };
    const metadata = parsed.metadata;
    const content = parsed.body;

    if (metadata.embedding && metadata.embedding !== null) {
      console.log(`${file} - embedding already exists`);
      continue;
    }

    console.log(`Processing ${file}...`);

    try {
      const embedding = await createEmbedding(content);
      const updatedMetadata = {
        ...metadata,
        embedding,
      };
      const updatedContent = file.endsWith(".mdx")
        ? serializeMdx(updatedMetadata, content)
        : content;

      fs.writeFileSync(filePath, updatedContent);
      console.log(`${file} - embedding generated and saved`);

      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`${directoryName} embedding generation complete.`);
}

async function generateEmbeddingsForAllPosts() {
  await generateEmbeddingsForDirectory(BLOG_DIR, "blog posts");
  await generateEmbeddingsForDirectory(PROJECT_STORIES_DIR, "project stories");
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  await generateEmbeddingsForAllPosts();
}

main().catch(console.error);
