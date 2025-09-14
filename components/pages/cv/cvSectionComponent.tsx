import { EditableText, EditableTextProps } from "@/components/editableText";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initCv, updateCv } from "@/redux/slices/cv";
import { CvSection } from "@/types";
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
import { CvSubSectionComponent } from "./cvSubSectionComponent";

export function CvSectionComponent({
  sectionIndex,
  sectionId,
  editable,
  sideOrMain,
  section,
  isPrintVersion = false,
  positionDetails,
  adjustSection,
  sectionKey,
  isRemoved = false,
  isModified = false,
  isNew = false,
  onSectionAdjusted,
  onRemoveSection,
  onRestoreSection,
  onRemoveSubSection,
  onRestoreSubSection,
  onSubSectionAdjusted,
  removedSubSections,
  modifiedSubSections,
  originalSection,
  showDiff = false,
}: {
  editable?: boolean;
  sectionIndex: number;
  sectionId?: string;
  sideOrMain: "mainColumn" | "sideColumn";
  section: CvSection;
  isPrintVersion: boolean;
  positionDetails?: string | null;
  adjustSection?: (section: CvSection, positionDescription: string) => Promise<CvSection | null>;
  sectionKey?: string;
  isRemoved?: boolean;
  isModified?: boolean;
  isNew?: boolean;
  onSectionAdjusted?: (sectionKey: string) => void;
  onRemoveSection?: (sectionKey: string) => void;
  onRestoreSection?: (sectionKey: string) => void;
  onRemoveSubSection?: (subSectionKey: string) => void;
  onRestoreSubSection?: (subSectionKey: string) => void;
  onSubSectionAdjusted?: (subSectionKey: string) => void;
  removedSubSections?: Set<string>;
  modifiedSubSections?: Set<string>;
  originalSection?: CvSection;
  showDiff?: boolean;
}) {
  const { title, subtitles, paragraphs, bulletPoints, subSections } = section;
  const [isHovered, setIsHovered] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);
  const dispatch = useAppDispatch();
  const reduxCv = useAppSelector((state) => state.cv);


  const SuperEditableText = useCallback(({ query, originalText, ...props }: EditableTextProps & { originalText?: string }) => {
    return <EditableText
      {...props}
      query={[sideOrMain, sectionIndex, ...query]}
      editable={editable}
      onEditStart={() => setIsAnyTextBeingEdited(true)}
      onEditEnd={() => setIsAnyTextBeingEdited(false)}
      originalText={originalText}
      showDiff={showDiff && !isPrintVersion}
    />;
  }, [sideOrMain, sectionIndex, editable, setIsAnyTextBeingEdited, showDiff, isPrintVersion]);

  const handleAdjustSection = async () => {
    if (!adjustSection || !positionDetails || !sectionKey) return;

    setIsAdjusting(true);
    try {
      const adjustedSection = await adjustSection(section, positionDetails);
      if (adjustedSection) {
        // Preserve the original ID to maintain diff tracking
        adjustedSection.id = section.id;

        // Also preserve IDs for subsections if they exist
        if (adjustedSection.subSections && section.subSections) {
          adjustedSection.subSections.forEach((subSection, index) => {
            if (section.subSections?.[index]) {
              subSection.id = section.subSections[index]?.id;
            }
          });
        }

        // Preserve bullet point IDs if they exist
        if (adjustedSection.bulletPoints && section.bulletPoints) {
          adjustedSection.bulletPoints.forEach((bullet, index) => {
            if (section.bulletPoints?.[index]) {
              bullet.id = section.bulletPoints[index]?.id;
            }
          });
        }

        // Update the section in Redux
        const newCv = { ...reduxCv };

        if (sideOrMain === 'mainColumn' && newCv.mainColumn) {
          newCv.mainColumn[sectionIndex] = adjustedSection;
        } else if (sideOrMain === 'sideColumn' && newCv.sideColumn) {
          newCv.sideColumn[sectionIndex] = adjustedSection;
        }

        dispatch(initCv(newCv));

        if (onSectionAdjusted) {
          onSectionAdjusted(sectionKey);
        }
      }
    } catch (error) {
      console.error('Error adjusting section:', error);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleRemove = () => {
    if (onRemoveSection && sectionKey) {
      onRemoveSection(sectionKey);
    }
  };
  const handleRestore = () => {
    if (onRestoreSection && sectionKey) {
      onRestoreSection(sectionKey);
    }
  };

  // Determine when to show hover actions
  const canShowHoverActions = editable && !isPrintVersion && (positionDetails || isRemoved);
  const shouldShowHoverEffect = isHovered && canShowHoverActions && !isAnyTextBeingEdited;
  const showActions = shouldShowHoverEffect && !isAdjusting;

  return (
    <Box
      textAlign={"left"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      sx={{
        position: 'relative',
        backgroundColor: isRemoved
          ? alpha('#ff0000', 0.1)
          : isNew && showDiff
            ? alpha('#4caf50', 0.1) // Light green for new sections
            : (shouldShowHoverEffect ? alpha('#1976d2', 0.05) : 'transparent'),
        border: isNew && showDiff ? `1px solid ${alpha('#4caf50', 0.3)}` : 'none',
        borderRadius: isNew && showDiff ? 1 : 0,
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
          <Tooltip title="Adjust section for this position">
            <IconButton
              size="small"
              onClick={handleAdjustSection}
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
            <Tooltip title="Hide this section">
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
            <Tooltip title="Restore this section">
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
      {(isRemoved || isModified || isNew) && (
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
              sx={{ mr: 1 }}
            />
          )}
          {isNew && showDiff && (
            <Chip
              label="New Section"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Content */}
      {title && (
        <SuperEditableText query={["title"]} variant="h4" mb={1} text={title} originalText={originalSection?.title} />
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={0}>
          <SuperEditableText query={['subtitles', 'left']} variant="subtitle1" text={subtitles.left} originalText={originalSection?.subtitles?.left} />
          <SuperEditableText query={["subtitles", "right"]} variant="subtitle1" text={subtitles.right} originalText={originalSection?.subtitles?.right} />
        </Box>
      )}
      {paragraphs &&
        paragraphs.filter(paragraph => paragraph && paragraph.trim() !== "").map((paragraph, idx) => {
          // Note: idx here is for the filtered array, need to find original index
          const originalIdx = paragraphs.indexOf(paragraph);
          const originalText = originalSection?.paragraphs?.[originalIdx];
          // A paragraph is completely new if there was no original text at this position
          // OR if the original section had fewer paragraphs than current position
          const isCompletelyNew = !originalText || originalIdx >= (originalSection?.paragraphs?.length || 0);

          // Debug logging for profile section
          if (title === "Profile") {
            console.log(`Profile paragraph ${originalIdx}:`, {
              paragraph: paragraph.substring(0, 50) + "...",
              originalText: originalText ? originalText.substring(0, 50) + "..." : "undefined",
              isCompletelyNew,
              showDiff,
              originalIdx,
              originalSectionParagraphsLength: originalSection?.paragraphs?.length || 0,
              actualOriginalTextToPass: isCompletelyNew && showDiff ? "" : originalText
            });
          }

          return (
            <SuperEditableText
              query={['paragraphs', originalIdx]}
              key={`paragraph-${originalIdx}-${paragraph.substring(0, 20)}`}
              variant="body1"
              gutterBottom
              text={paragraph}
              // For completely new paragraphs, pass empty string as original to trigger full green highlighting
              originalText={isCompletelyNew && showDiff ? "" : originalText}
              onDelete={editable ? () => {
                // Delete paragraph by setting it to empty string, which will effectively remove it
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', originalIdx], newValue: "" }));
              } : undefined}
            />
          );
        })}
      {bulletPoints &&
        bulletPoints.filter(point => point.text && point.text.trim() !== "").map((point, idx) => {
          // Find original index for proper query construction
          const originalIdx = bulletPoints.indexOf(point);

          // Find original bullet point by ID only - no index fallback
          const originalBulletPoint = point.id ? originalSection?.bulletPoints?.find(b => b.id === point.id) : undefined;
          // Check if this is a completely new bullet point
          const isCompletelyNew = !originalBulletPoint && showDiff;

          return (
            <CvBulletPoint
              bulletPoint={point}
              key={point.id || `bullet-${originalIdx}`}
              editable={editable}
              baseQuery={[sideOrMain, sectionIndex, 'bulletPoints', originalIdx]}
              isPrintVersion={isPrintVersion}
              // For completely new bullets, pass an empty bullet as original to trigger full green highlighting
              originalBulletPoint={isCompletelyNew ? { iconName: point.iconName, text: "" } : originalBulletPoint}
              showDiff={showDiff}
              onDelete={editable ? () => {
                // Delete bullet point by setting its text to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', originalIdx, 'text'], newValue: "" }));
              } : undefined}
            />
          );
        }
        )}      {subSections && (subSections.map((subSection, index) => {
          const subSectionId = subSection.id || `${sectionKey}-sub-${index}`;
          const isSubRemoved = onRemoveSubSection && removedSubSections?.has(subSectionId);
          const isSubModified = onSubSectionAdjusted && modifiedSubSections?.has(subSectionId);

          // Skip removed subsections in print version
          if (isPrintVersion && isSubRemoved) {
            return null;
          }

          // Find original subsection by ID only - no index fallback
          const originalSubSection = subSection.id ? originalSection?.subSections?.find(s => s.id === subSection.id) : undefined;
          // Check if this is a completely new subsection
          const isNewSubSection = !originalSubSection && showDiff;

          return (
            <CvSubSectionComponent
              key={subSection.id || index}
              subSection={subSection}
              subSectionIndex={index}
              sectionIndex={sectionIndex}
              sideOrMain={sideOrMain}
              editable={editable}
              isPrintVersion={isPrintVersion}
              positionDetails={positionDetails}
              adjustSection={adjustSection}
              subSectionKey={subSectionId}
              isRemoved={isSubRemoved || false}
              isModified={isSubModified || false}
              isNew={isNewSubSection}
              onRemoveSubSection={onRemoveSubSection}
              onRestoreSubSection={onRestoreSubSection}
              onSubSectionAdjusted={onSubSectionAdjusted}
              originalSubSection={originalSubSection}
              showDiff={showDiff}
            />
          );
        }))}
    </Box>
  );
}

