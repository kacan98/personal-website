"use client";
import {
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { StoryCard } from "../components/StoryCard";

interface RankedStory {
  id: string;
  title: string;
  category: string;
  relevance: number;
  tags: string[];
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  url: string;
  fullUrl: string;
  content: string;
}

interface PreferredProjectsResponse {
  selectedStories: RankedStory[];
  selectionReasoning: string;
  useStories: boolean;
  totalAvailable: number;
}

interface PreferredProjectsModalProps {
  open: boolean;
  onClose: () => void;
  positionDetails: string;
  onUpdateCVProjects?: (stories: RankedStory[]) => void;
  existingRankedStories?: RankedStory[] | null;
}

const PreferredProjectsModal = ({
  open,
  onClose,
  positionDetails,
  onUpdateCVProjects,
  existingRankedStories,
}: PreferredProjectsModalProps) => {
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [preferredProjects, setPreferredProjects] = useState<PreferredProjectsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load preferred projects when modal opens and position details exist
  useEffect(() => {
    if (open && positionDetails && positionDetails.trim().length > 10) {
      // If we have existing ranked stories, use them instead of fetching again
      if (existingRankedStories) {
        setPreferredProjects({
          selectedStories: existingRankedStories,
          selectionReasoning: (existingRankedStories[0] as any)?.reasoning || '',
          useStories: true,
          totalAvailable: existingRankedStories.length
        });
        setIsLoading(false);
      } else {
        loadPreferredProjects();
      }
    }
  }, [open, positionDetails, existingRankedStories]);

  const loadPreferredProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stories/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: positionDetails,
          maxStories: 6 // Get more for display
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load preferred projects');
      }

      const result: PreferredProjectsResponse = await response.json();
      setPreferredProjects(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCVProjects = () => {
    if (preferredProjects?.selectedStories && onUpdateCVProjects) {
      // Take top 4 for CV
      onUpdateCVProjects(preferredProjects.selectedStories.slice(0, 4));
      onClose();
    }
  };

  const renderProjects = () => {
    if (!preferredProjects || !preferredProjects.selectedStories.length) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No specific project stories were identified as particularly relevant for this position.
          The AI will focus on general experience and skills instead.
        </Alert>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {preferredProjects.selectedStories?.map((story, index) => (
          <StoryCard
            key={story.id}
            story={{
              id: parseInt(story.id),
              title: story.title,
              url: story.url,
              category: story.category,
              relevance: story.relevance,
              metrics: story.metrics,
              tags: story.tags,
              reasoning: (story as any).reasoning
            }}
            index={index}
            isHighlighted={index < 4}
            showViewButton={true}
            showMatchPercentage={true}
            showTags={true}
            maxTags={8}
          />
        ))}
      </Box>
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Preferred Projects for This Position"
      subtitle="AI-ranked project stories based on job requirements"
      maxWidth="md"
    >
      <Box sx={{ minHeight: 200 }}>
        {!positionDetails || positionDetails.trim().length < 10 ? (
          <Alert severity="warning">
            Please provide position details first to see preferred projects.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Analyzing position requirements...</Typography>
            <Typography variant="body2" color="text.secondary">
              Ranking project stories by relevance
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error loading preferred projects: {error}
          </Alert>
        ) : (
          <>
            {preferredProjects?.selectionReasoning && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  AI Analysis:
                </Typography>
                <Typography variant="body2">
                  {preferredProjects.selectionReasoning}
                </Typography>
              </Alert>
            )}

            {preferredProjects && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Found {preferredProjects.selectedStories?.length || 0} relevant projects out of {preferredProjects.totalAvailable} available.
                  Top 4 will be highlighted in your CV.
                </Typography>
              </Box>
            )}

            {renderProjects()}

            {(preferredProjects?.selectedStories?.length || 0) > 0 && onUpdateCVProjects && (
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  variant="primary"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleUpdateCVProjects}
                  fullWidth
                >
                  Update CV with Top 4 Projects
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </BaseModal>
  );
};

export default PreferredProjectsModal;