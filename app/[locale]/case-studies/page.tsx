import { Container } from '@mui/material';
import { getContainerSx } from '@/app/spacing';
import SectionHeader from '@/components/ui/SectionHeader';
import { MetricsLayout } from '@/components/pages/case-studies/layouts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getTranslations } from 'next-intl/server';

interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  category: string;
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  excerpt: string;
}

async function getProjectStories(): Promise<BlogPost[]> {
  const projectStoriesDir = path.join(process.cwd(), 'case-studies');

  if (!fs.existsSync(projectStoriesDir)) {
    return [];
  }

  const files = fs.readdirSync(projectStoriesDir).filter(file => file.endsWith('.md'));

  return files.map(file => {
    const filePath = path.join(projectStoriesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    return {
      slug: file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      tags: frontmatter.tags || [],
      category: frontmatter.category || 'uncategorized',
      metrics: frontmatter.metrics,
      excerpt: content.substring(0, 200).replace(/\n/g, ' ').trim() + '...'
    };
  });
}

export default async function CaseStudiesPage() {
  const posts = await getProjectStories();
  const t = await getTranslations('projectStories');

  return (
    <Container sx={{ ...getContainerSx(), py: 6 }}>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        description={t('description')}
        size="large"
      />

      {/* Metrics Layout */}
      <MetricsLayout posts={posts} />
    </Container>
  );
}