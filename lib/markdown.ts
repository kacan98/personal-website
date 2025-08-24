// Simple markdown parser - use only in server components
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export function readMarkdownFiles<T>(directory: string): (T & { content: string })[] {
  const dir = join(process.cwd(), directory);
  const files = readdirSync(dir).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const fileContent = readFileSync(join(dir, file), 'utf-8');
    const { data, content } = matter(fileContent);
    return { ...data, content } as T & { content: string };
  });
}