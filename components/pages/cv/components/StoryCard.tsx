import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export interface StoryCardProps {
  story: {
    id: number | string;
    title: string;
    url?: string;
    category: string;
    relevance: number;
    metrics?: {
      impact?: string;
    };
    tags: string[];
    reasoning?: string;
  };
  index?: number;
  isHighlighted?: boolean;
  showViewButton?: boolean;
  showMatchPercentage?: boolean;
  showTags?: boolean;
  maxTags?: number;
  variant?: 'default' | 'compact';
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  index = 0,
  isHighlighted = false,
  showViewButton = true,
  showMatchPercentage = true,
  showTags = true,
  maxTags = 8,
  variant = 'default'
}) => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';

  const handleViewStory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (story.url) {
      router.push(`/${locale}${story.url}`);
    }
  };

  const buttonStyles = {
    minWidth: '100px',
    height: '30px',
    fontSize: '0.8rem',
    px: 1.5
  };

  return (
    <Card variant="outlined" sx={{
      backgroundColor: isHighlighted ? 'rgba(25, 118, 210, 0.05)' : 'rgba(0,0,0,0.02)',
      border: isHighlighted ? '1px solid rgba(25, 118, 210, 0.2)' : undefined
    }}>
      <CardContent sx={{ p: variant === 'compact' ? 1.5 : 2 }}>
        {/* Header with title and actions */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 },
          mb: variant === 'compact' ? 1 : 1.5
        }}>
          {/* Title section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            flex: 1
          }}>
            {isHighlighted && <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {story.title}
            </Typography>
          </Box>

          {/* Action buttons */}
          {(showViewButton || showMatchPercentage) && (
            <Box sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              flexShrink: 0
            }}>
              {showViewButton && (
                <Button
                  variant="secondary"
                  size="small"
                  startIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                  onClick={handleViewStory}
                  sx={buttonStyles}
                >
                  View Story
                </Button>
              )}
              {showMatchPercentage && (
                <Button
                  variant="outline"
                  size="small"
                  disabled
                  sx={{
                    ...buttonStyles,
                    color: isHighlighted ? 'primary.main' : 'text.secondary',
                    borderColor: isHighlighted ? 'primary.main' : 'divider',
                    backgroundColor: 'transparent',
                    '&.Mui-disabled': {
                      color: isHighlighted ? 'primary.main' : 'text.secondary',
                      borderColor: isHighlighted ? 'primary.main' : 'divider',
                      opacity: 1
                    }
                  }}
                >
                  {Math.round(story.relevance * 100)}% Match
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Highlighted message */}
        {isHighlighted && (
          <Typography variant="caption" sx={{
            color: 'primary.main',
            fontWeight: 500,
            display: 'block',
            mb: 1
          }}>
            ✓ Will be included in CV projects section
          </Typography>
        )}

        {/* Category and metrics */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: variant === 'compact' ? 1 : 2 }}>
          <Chip label={story.category} size="small" color="secondary" />
          {story.metrics?.impact && (
            <Typography variant="caption" color="text.secondary">
              Impact: {story.metrics.impact}
            </Typography>
          )}
        </Box>

        {/* Reasoning if available */}
        {story.reasoning && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
            {story.reasoning}
          </Typography>
        )}

        {/* Tags */}
        {showTags && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {story.tags.slice(0, maxTags).map(tag => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {story.tags.length > maxTags && (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                +{story.tags.length - maxTags} more
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};