import { Container, Typography, Box, Chip, Breadcrumbs, Divider, Card, CardContent, CardActionArea, Button as MuiButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getContainerSx } from '@/app/spacing';
import { redirect } from 'next/navigation';
import { PROJECT_STORIES_PATH } from '@/lib/routes';
import { BRAND_COLORS } from '@/app/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import CodeIcon from '@mui/icons-material/Code';

interface BlogPostProps {
  params: Promise<{ slug: string; locale: string }>;
}

interface Post {
  slug: string;
  title: string;
  category: string;
  metrics?: {
    impact?: string;
  };
  date?: string;
}

async function getBlogPost(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'project-stories', `${slug}.md`);

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
      liveUrl: frontmatter.liveUrl,
      sourceUrl: frontmatter.sourceUrl,
      content: content
    };
  } catch (error) {
    return null;
  }
}

async function getOtherPosts(currentSlug: string): Promise<Post[]> {
  const projectStoriesDir = path.join(process.cwd(), 'project-stories');

  if (!fs.existsSync(projectStoriesDir)) {
    return [];
  }

  const files = fs.readdirSync(projectStoriesDir)
    .filter(file => file.endsWith('.md') && file.replace('.md', '') !== currentSlug);

  const posts = files.map(file => {
    const filePath = path.join(projectStoriesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContent);

    return {
      slug: file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      category: frontmatter.category || 'uncategorized',
      metrics: frontmatter.metrics,
      date: frontmatter.date,
    };
  });

  // Sort by date (newest first) and take 3 - same as homepage
  return posts
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);
}

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'project-stories');

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
    // Redirect to project stories list instead of 404
    redirect(`/${locale}${PROJECT_STORIES_PATH}`);
  }

  const otherPosts = await getOtherPosts(slug);

  // Improved markdown to HTML conversion with list support
  let htmlContent = post.content
    // First handle code blocks to preserve them
    .replace(/```(.+?)```/gs, '<code-block>$1</code-block>')
    // Handle headings
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Handle bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Handle links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Handle lists - convert markdown lists to HTML
  // Match consecutive lines starting with - or *
  htmlContent = htmlContent.replace(/(?:^[-*] .+$\n?)+/gm, (match) => {
    const items = match
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*] /, ''))
      .map(item => `<li>${item}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  });

  // Convert paragraphs (anything not already in a tag)
  htmlContent = htmlContent
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h([1-6])>/g, '<h$1>')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
    // Restore code blocks
    .replace(/<code-block>(.+?)<\/code-block>/gs, '<pre><code>$1</code></pre>');

  return (
    <Container sx={{ ...getContainerSx(), py: 4 }}>
      <Breadcrumbs sx={{ mb: 4, maxWidth: '70ch', mx: 'auto' }}>
        <Link href={`/${locale}`}>Home</Link>
        <Link href={`/${locale}${PROJECT_STORIES_PATH}`}>Project Stories</Link>
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4, maxWidth: '70ch', mx: 'auto' }}>
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {post.tags.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        {/* Project Links */}
        {(post.liveUrl || post.sourceUrl) && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {post.liveUrl && (
              <MuiButton
                variant="contained"
                href={post.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LaunchIcon />}
                sx={{
                  backgroundColor: BRAND_COLORS.accent,
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.9)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px rgba(${BRAND_COLORS.accentRgb}, 0.4)`,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                View Live Demo
              </MuiButton>
            )}
            {post.sourceUrl && (
              <MuiButton
                variant="outlined"
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<CodeIcon />}
                sx={{
                  borderColor: BRAND_COLORS.accent,
                  color: BRAND_COLORS.accent,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    borderColor: BRAND_COLORS.accent,
                    backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                View Source Code
              </MuiButton>
            )}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          // Optimal reading width - Medium-like constraint (700px max or 70ch)
          maxWidth: '70ch',
          mx: 'auto',
          '& h1': { mt: 4, mb: 3, fontSize: '1.75rem', fontWeight: 'bold' },
          '& h2': { mt: 4, mb: 2, fontSize: '1.5rem', fontWeight: 'bold' },
          '& h3': { mt: 3, mb: 1.5, fontSize: '1.25rem', fontWeight: 'bold' },
          '& p': { mb: 2, lineHeight: 1.7 },
          '& strong': { fontWeight: 'bold' },
          '& em': { fontStyle: 'italic' },
          // Modern link styling with accent color - more visible
          '& a': {
            color: 'secondary.main', // MUI theme accent color
            textDecoration: 'none',
            borderBottom: `1.5px solid rgba(${BRAND_COLORS.accentRgb}, 0.5)`, // Thicker, more visible border
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: `rgba(${BRAND_COLORS.accentRgb}, 1)`, // Full opacity on hover
              filter: 'brightness(1.2)', // Lighter shade on hover
              borderBottomColor: 'secondary.main',
              backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.12)`,
            },
          },
          '& code': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          },
          '& pre': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            mb: 2,
          },
          // Fix list spacing - compact lists
          '& ul': {
            mb: 2,
            pl: 3,
          },
          '& li': {
            mb: 0.5, // Reduced spacing between list items
            lineHeight: 1.6,
          },
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Other Projects Section */}
      {otherPosts.length > 0 && (
        <Box sx={{ maxWidth: '70ch', mx: 'auto', mt: 8 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h4" sx={{ mb: 3 }}>
            Other Projects
          </Typography>
          <Grid container spacing={2}>
            {otherPosts.map((otherPost) => (
              <Grid size={{ xs: 12 }} key={otherPost.slug}>
                <Card sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  transition: 'background-color 0.2s ease-in-out',
                }}>
                  <CardActionArea
                    component={Link}
                    href={`/${locale}${PROJECT_STORIES_PATH}/${otherPost.slug}`}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Chip
                          label={otherPost.category}
                          size="small"
                          color={
                            otherPost.category === 'performance' ? 'success' :
                            otherPost.category === 'automation' ? 'primary' :
                            otherPost.category === 'business' ? 'warning' :
                            otherPost.category === 'fullstack' ? 'secondary' :
                            'default'
                          }
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {otherPost.title}
                          </Typography>
                          {otherPost.metrics?.impact && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {otherPost.metrics.impact}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
