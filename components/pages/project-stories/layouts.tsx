import { Typography, Box, Chip, Card, CardContent, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { TrendingUp, Schedule, Group } from '@mui/icons-material';
import { BRAND_COLORS, BACKGROUND_COLORS, SHAPE_COLORS } from '@/app/colors';
import { PROJECT_STORIES_PATH } from '@/lib/routes';

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

interface LayoutProps {
  posts: BlogPost[];
}

// Helper function using app colors
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'performance': return {
      main: SHAPE_COLORS.teal,
      light: `rgba(${SHAPE_COLORS.tealRgb}, 0.1)`,
      border: `rgba(${SHAPE_COLORS.tealRgb}, 0.3)`
    };
    case 'automation': return {
      main: BRAND_COLORS.accent,
      light: `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
      border: `rgba(${BRAND_COLORS.accentRgb}, 0.3)`
    };
    case 'business': return {
      main: SHAPE_COLORS.gold,
      light: `rgba(${SHAPE_COLORS.goldRgb}, 0.1)`,
      border: `rgba(${SHAPE_COLORS.goldRgb}, 0.3)`
    };
    case 'fullstack': return {
      main: SHAPE_COLORS.lavender,
      light: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.1)`,
      border: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.3)`
    };
    default: return {
      main: BRAND_COLORS.secondary,
      light: `rgba(${BRAND_COLORS.secondaryRgb}, 0.1)`,
      border: `rgba(${BRAND_COLORS.secondaryRgb}, 0.3)`
    };
  }
};

// Metrics Focus Layout
export function MetricsLayout({ posts }: LayoutProps) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
      {posts.map((post) => {
        const categoryColors = getCategoryColor(post.category);

        return (
          <Grid size={{ xs: 12 }} key={post.slug}>
            <Link href={`${PROJECT_STORIES_PATH}/${post.slug}`} style={{ textDecoration: 'none' }}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: BACKGROUND_COLORS.surface,
                border: `1px solid ${categoryColors.border}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px rgba(${BRAND_COLORS.darkRgb}, 0.3), 0 0 0 1px ${categoryColors.main}`,
                  borderColor: categoryColors.main,
                  '& .metrics-container': {
                    background: `linear-gradient(135deg, ${categoryColors.light}, ${BACKGROUND_COLORS.surface})`
                  }
                }
              }}>
                {/* Header with category */}
                <Box sx={{
                  background: `linear-gradient(135deg, ${categoryColors.light}, transparent)`,
                  borderBottom: `1px solid ${categoryColors.border}`,
                  p: 3,
                  pb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      label={post.category}
                      sx={{
                        bgcolor: categoryColors.main,
                        color: BACKGROUND_COLORS.primary,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </Box>

                  <Typography variant="h5" sx={{
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: BRAND_COLORS.primary,
                    mb: 1
                  }}>
                    {post.title}
                  </Typography>
                </Box>

                <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Metrics Section */}
                  {post.metrics && (
                    <Box className="metrics-container" sx={{
                      mb: { xs: 2, sm: 3 },
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      background: categoryColors.light,
                      border: `1px solid ${categoryColors.border}`,
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography variant="caption" sx={{
                        color: categoryColors.main,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 1.5,
                        display: 'block'
                      }}>
                        Project Impact
                      </Typography>
                      <Stack spacing={{ xs: 0.75, sm: 1 }}>
                        {post.metrics.impact && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <TrendingUp sx={{ fontSize: 16, color: categoryColors.main }} />
                            <Typography variant="body2" sx={{
                              fontWeight: 500,
                              color: BRAND_COLORS.primary,
                              fontSize: '0.875rem'
                            }}>
                              {post.metrics.impact}
                            </Typography>
                          </Box>
                        )}
                        {post.metrics.timeframe && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Schedule sx={{ fontSize: 16, color: categoryColors.main }} />
                            <Typography variant="body2" sx={{
                              fontWeight: 500,
                              color: BRAND_COLORS.secondary,
                              fontSize: '0.875rem'
                            }}>
                              {post.metrics.timeframe}
                            </Typography>
                          </Box>
                        )}
                        {post.metrics.usersAffected && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Group sx={{ fontSize: 16, color: categoryColors.main }} />
                            <Typography variant="body2" sx={{
                              fontWeight: 500,
                              color: BRAND_COLORS.secondary,
                              fontSize: '0.875rem'
                            }}>
                              {post.metrics.usersAffected}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {/* Description */}
                  <Typography variant="body2" sx={{
                    color: BRAND_COLORS.secondary,
                    lineHeight: 1.6,
                    mb: 3,
                    fontSize: '0.875rem',
                    flexGrow: 1
                  }}>
                    {post.excerpt}
                  </Typography>

                  {/* Technologies */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" sx={{
                      color: BRAND_COLORS.secondary,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1,
                      display: 'block'
                    }}>
                      Tech Stack
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {post.tags.slice(0, 4).map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            borderColor: categoryColors.border,
                            color: BRAND_COLORS.secondary,
                            backgroundColor: 'transparent',
                            '&:hover': {
                              borderColor: categoryColors.main,
                              backgroundColor: categoryColors.light,
                              color: categoryColors.main
                            }
                          }}
                        />
                      ))}
                      {post.tags.length > 4 && (
                        <Typography variant="caption" sx={{
                          color: BRAND_COLORS.secondary,
                          alignSelf: 'center',
                          ml: 0.5,
                          fontSize: '0.7rem'
                        }}>
                          +{post.tags.length - 4}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}