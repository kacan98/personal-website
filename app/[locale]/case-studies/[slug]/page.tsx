import { Container, Typography, Box, Chip, Breadcrumbs } from '@mui/material';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getContainerSx } from '@/app/spacing';
import { redirect } from 'next/navigation';
import { CASE_STUDIES_PATH } from '@/lib/routes';

interface BlogPostProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'blog', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    return {
      title: frontmatter.title || 'Untitled',
      tags: frontmatter.tags || [],
      category: frontmatter.category || 'uncategorized',
      metrics: frontmatter.metrics,
      content: content
    };
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'blog');

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  return files.map(file => ({
    slug: file.replace('.md', '')
  }));
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    // Redirect to case studies list instead of 404
    redirect(`/${locale}${CASE_STUDIES_PATH}`);
  }

  // Simple markdown to HTML conversion (basic)
  const htmlContent = post.content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h([1-6])>/g, '<h$1>')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>');

  return (
    <Container sx={{ ...getContainerSx(), py: 4 }}>
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link href={`/${locale}`}>Home</Link>
        <Link href={`/${locale}${CASE_STUDIES_PATH}`}>Project Stories</Link>
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Chip
          label={post.category}
          sx={{ mb: 2 }}
          color={
            post.category === 'performance' ? 'success' :
            post.category === 'automation' ? 'primary' :
            post.category === 'business' ? 'warning' :
            post.category === 'fullstack' ? 'secondary' :
            'default'
          }
        />

        <Typography variant="h3" sx={{ mb: 2 }}>
          {post.title}
        </Typography>

        {post.metrics?.impact && (
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            Impact: {post.metrics.impact}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {post.tags.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          '& h2': { mt: 4, mb: 2, fontSize: '1.5rem', fontWeight: 'bold' },
          '& h3': { mt: 3, mb: 1.5, fontSize: '1.25rem', fontWeight: 'bold' },
          '& p': { mb: 2, lineHeight: 1.7 },
          '& strong': { fontWeight: 'bold' },
          '& em': { fontStyle: 'italic' },
          '& a': { color: 'primary.main', textDecoration: 'underline' },
          '& code': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Container>
  );
}