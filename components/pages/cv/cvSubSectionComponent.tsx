import { EditableText, EditableTextProps } from "@/components/editableText";
import { CvSection, CvSubSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  alpha
} from "@mui/material";
import { useState, useCallback } from "react";
import { CvBulletPoint } from "./bulletPoint";

export function CvSubSectionComponent({
  subSection,
  subSectionIndex,
  sectionIndex,
  sideOrMain,
  editable,
  isPrintVersion = false,
  positionDetails,
  adjustSection,
  subSectionKey,
  isRemoved = false,
  isModified = false,
  onRemoveSubSection,
  onRestoreSubSection,
  onSubSectionAdjusted,
}: {
  subSection: CvSubSection;
  subSectionIndex: number;
  sectionIndex: number;
  sideOrMain: "mainColumn" | "sideColumn";
  editable?: boolean;
  isPrintVersion?: boolean;
  positionDetails?: string | null;
  adjustSection?: (section: CvSection, positionDescription: string) => Promise<CvSection | null>;
  subSectionKey?: string;
  isRemoved?: boolean;
  isModified?: boolean;
  onRemoveSubSection?: (subSectionKey: string) => void;
  onRestoreSubSection?: (subSectionKey: string) => void;
  onSubSectionAdjusted?: (subSectionKey: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);

  const SuperEditableText = useCallback(({ query, ...props }: EditableTextProps) => {
    return <EditableText 
      {...props} 
      query={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, ...query]} 
      editable={editable}
      onEditStart={() => setIsAnyTextBeingEdited(true)}
      onEditEnd={() => setIsAnyTextBeingEdited(false)}
    />;
  }, [sideOrMain, sectionIndex, subSectionIndex, editable, setIsAnyTextBeingEdited]);

  const handleAdjustSubSection = async () => {
    if (!adjustSection || !positionDetails || !subSectionKey) return;
    
    setIsAdjusting(true);
    try {
      // Convert subsection to a full section format for the API
      const sectionFormat: CvSection = {
        title: subSection.title,
        subtitles: subSection.subtitles,
        paragraphs: subSection.paragraphs,
        bulletPoints: subSection.bulletPoints,
      };
      
      const adjustedSection = await adjustSection(sectionFormat, positionDetails);
      if (adjustedSection && onSubSectionAdjusted) {
        onSubSectionAdjusted(subSectionKey);
      }
    } catch (error) {
      console.error('Error adjusting subsection:', error);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleRemove = () => {
    if (onRemoveSubSection && subSectionKey) {
      onRemoveSubSection(subSectionKey);
    }
  };

  const handleRestore = () => {
    if (onRestoreSubSection && subSectionKey) {
      onRestoreSubSection(subSectionKey);
    }
  };

  // Determine when to show hover actions
  const canShowHoverActions = editable && !isPrintVersion && (positionDetails || isRemoved);
  const shouldShowHoverEffect = isHovered && canShowHoverActions && !isAnyTextBeingEdited;
  const showActions = shouldShowHoverEffect && !isAdjusting;

  return (
    <Box 
      key={subSectionIndex} 
      mb={2}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      sx={{
        position: 'relative',
        backgroundColor: isRemoved ? alpha('#ff0000', 0.1) : (shouldShowHoverEffect ? alpha('#1976d2', 0.05) : 'transparent'),
        transition: 'all 0.2s ease-in-out',
        '&:hover': canShowHoverActions ? {
          boxShadow: 1,
        } : {}
      }}
    >
      {/* Action buttons */}
      {showActions && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            display: 'flex',
            gap: 0.5,
            zIndex: 10
          }}
        >
          <Tooltip title="Adjust subsection for this position">
            <IconButton
              size="small"
              onClick={handleAdjustSubSection}
              disabled={isAdjusting}
              sx={{
                backgroundColor: 'secondary.main',
                color: 'white',
                boxShadow: 2,
                '&:hover': { 
                  backgroundColor: 'secondary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.400',
                }
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {!isRemoved && (
            <Tooltip title="Hide this subsection">
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{
                  backgroundColor: 'error.main',
                  color: 'white',
                  boxShadow: 2,
                  '&:hover': { 
                    backgroundColor: 'error.dark',
                  }
                }}
              >
                <VisibilityOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {isRemoved && (
            <Tooltip title="Restore this subsection">
              <IconButton
                size="small"
                onClick={handleRestore}
                sx={{
                  backgroundColor: 'success.main',
                  color: 'white',
                  boxShadow: 2,
                  '&:hover': { 
                    backgroundColor: 'success.dark',
                  }
                }}
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Status indicators */}
      {(isRemoved || isModified) && (
        <Box sx={{ mb: 1 }}>
          {isRemoved && (
            <Chip 
              label="Hidden" 
              size="small" 
              color="error" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
          )}
          {isModified && (
            <Chip 
              label="AI Modified" 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Content */}
      <SuperEditableText query={['title']} editable={editable} variant="h5" text={subSection.title} />
      {subSection.subtitles && (
        <Box display="flex" justifyContent="space-between" pb={1}>
          <SuperEditableText query={['subtitles', 'left']} editable={editable} variant="subtitle1" text={subSection.subtitles.left} />
          <SuperEditableText query={['subtitles', 'right']} editable={editable} variant="subtitle1" text={subSection.subtitles.right} />
        </Box>
      )}
      {subSection.paragraphs &&
        subSection.paragraphs.map((paragraph, idx) => (
          <SuperEditableText query={['paragraphs', idx]} key={idx} editable={editable} variant="body1" gutterBottom text={paragraph} />
        ))}
      {subSection.bulletPoints && subSection.bulletPoints.map((point, idx) => {
        if (!point.text) return <></>
        return (<CvBulletPoint bulletPoint={point} key={idx} editable={editable} baseQuery={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', idx]} isPrintVersion={isPrintVersion} />)
      })}
    </Box>
  );
}
