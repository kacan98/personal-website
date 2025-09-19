import { EditableText, EditableTextProps } from "@/components/editableText";
import { CvSection, CvSubSection } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import {
  Box,
  alpha,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState, useCallback } from "react";
import { CvBulletPoint } from "./bulletPoint";

export function CvSubSectionComponent({
  subSection,
  subSectionIndex,
  sectionIndex,
  sideOrMain,
  editable,
  isPrintVersion = false,
  isRemoved = false,
  originalSubSection,
  showDiff = false,
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
  isNew?: boolean;
  onRemoveSubSection?: (subSectionKey: string) => void;
  onRestoreSubSection?: (subSectionKey: string) => void;
  onSubSectionAdjusted?: (subSectionKey: string) => void;
  originalSubSection?: CvSubSection;
  showDiff?: boolean;
}) {
  const [_isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);
  const dispatch = useAppDispatch();

  // Function to revert entire subsection to original
  const _revertSubSectionToOriginal = useCallback(() => {
    if (originalSubSection) {
      // Update title
      if (originalSubSection.title) {
        dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'title'], newValue: originalSubSection.title }));
      }
      // Update subtitles
      if (originalSubSection.subtitles) {
        if (originalSubSection.subtitles.left) {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'left'], newValue: originalSubSection.subtitles.left }));
        }
        if (originalSubSection.subtitles.right) {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'right'], newValue: originalSubSection.subtitles.right }));
        }
      }
      // Update paragraphs
      if (originalSubSection.paragraphs) {
        originalSubSection.paragraphs.forEach((para, idx) => {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs', idx], newValue: para }));
        });
      }
      // Update bullet points
      if (originalSubSection.bulletPoints) {
        originalSubSection.bulletPoints.forEach((point, idx) => {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', idx, 'text'], newValue: point.text || "" }));
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', idx, 'iconName'], newValue: point.iconName || "" }));
        });
      }
    }
  }, [dispatch, originalSubSection, sideOrMain, sectionIndex, subSectionIndex]);

  // Check if subsection has any changes
  const _hasChanges = originalSubSection && (
    subSection.title !== originalSubSection.title ||
    JSON.stringify(subSection.paragraphs) !== JSON.stringify(originalSubSection.paragraphs) ||
    JSON.stringify(subSection.bulletPoints) !== JSON.stringify(originalSubSection.bulletPoints) ||
    JSON.stringify(subSection.subtitles) !== JSON.stringify(originalSubSection.subtitles)
  );

  const SuperEditableText = useCallback(({ query, originalText, ...props }: EditableTextProps & { originalText?: string }) => {
    return <EditableText
      {...props}
      query={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, ...query]}
      editable={editable}
      onEditStart={() => setIsAnyTextBeingEdited(true)}
      onEditEnd={() => setIsAnyTextBeingEdited(false)}
      originalText={originalText}
      showDiff={showDiff && !isPrintVersion}
    />;
  }, [sideOrMain, sectionIndex, subSectionIndex, editable, setIsAnyTextBeingEdited, showDiff, isPrintVersion]);



  return (
    <Box
      key={subSectionIndex}
      mb={2}
      sx={{
        position: 'relative',
        backgroundColor: isRemoved ? alpha('#ff0000', 0.1) : 'transparent',
        transition: 'all 0.2s ease-in-out',
        '@media print': {
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }
      }}
    >

      {/* Removed confusing labels and always-visible revert button - moved to context menu */}

      {/* Content */}
      <SuperEditableText
        query={['title']}
        variant="h5"
        text={subSection.title || ""}
        originalText={originalSubSection?.title}
        autoEdit={(!subSection.title || subSection.title.trim() === "")}
        onAutoDelete={() => {
          // Delete the entire subsection when title is empty
          // We need to implement subsection deletion logic here
        }}
        onDelete={editable ? () => {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'title'], newValue: "" }));
        } : undefined}
        onRestore={editable && originalSubSection?.title && subSection.title !== originalSubSection.title ? () => {
          // Restore just the subsection title
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'title'], newValue: originalSubSection.title! }));
        } : undefined}
      />
      {subSection.subtitles && (
        <Box display="flex" justifyContent="space-between" pb={1}>
          <SuperEditableText
            query={['subtitles', 'left']}
            variant="subtitle1"
            text={subSection.subtitles.left}
            originalText={originalSubSection?.subtitles?.left}
            onDelete={editable ? () => {
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'left'], newValue: "" }));
            } : undefined}
            onRestore={editable && originalSubSection?.subtitles?.left && subSection.subtitles.left !== originalSubSection.subtitles.left ? () => {
              // Restore just the left subtitle
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'left'], newValue: originalSubSection.subtitles!.left! }));
            } : undefined}
          />
          <SuperEditableText
            query={['subtitles', 'right']}
            variant="subtitle1"
            text={subSection.subtitles.right}
            originalText={originalSubSection?.subtitles?.right}
            onDelete={editable ? () => {
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'right'], newValue: "" }));
            } : undefined}
            onRestore={editable && originalSubSection?.subtitles?.right && subSection.subtitles.right !== originalSubSection.subtitles.right ? () => {
              // Restore just the right subtitle
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'subtitles', 'right'], newValue: originalSubSection.subtitles!.right! }));
            } : undefined}
          />
        </Box>
      )}
      {subSection.paragraphs &&
        subSection.paragraphs.map((paragraph, idx) => {
          const originalText = originalSubSection?.paragraphs?.[idx];
          const isCompletelyNew = !originalText && idx >= (originalSubSection?.paragraphs?.length || 0);

          return (
            <SuperEditableText
              query={['paragraphs', idx]}
              key={idx}
              variant="body1"
              gutterBottom
              text={paragraph}
              // For completely new paragraphs, pass empty string as original to trigger full green highlighting
              originalText={isCompletelyNew && showDiff ? "" : originalText}
              autoEdit={(!paragraph || paragraph.trim() === "")}
              onAutoDelete={() => {
                // Remove paragraph from array
                dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs', idx] }));
              }}
              onDelete={editable ? () => {
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs', idx], newValue: "" }));
              } : undefined}
              onRestore={editable && originalText && paragraph !== originalText ? () => {
                // Restore just this paragraph
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs', idx], newValue: originalText }));
              } : undefined}
            />
          );
        })}

      {/* Add new paragraph button */}
      {editable && subSection.paragraphs && (
        // Show button if there are no paragraphs OR if all existing paragraphs have content
        subSection.paragraphs.length === 0 ||
        !subSection.paragraphs.some(p => !p || p.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add paragraph">
            <IconButton
              onClick={() => {
                const newIndex = subSection.paragraphs?.length || 0;
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs', newIndex],
                  newValue: ""
                }));
              }}
              size="small"
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                backgroundColor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderStyle: 'solid',
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {(() => {
        // Create a merged list of bullet points showing both current and deleted items
        const maxLength = Math.max(
          subSection.bulletPoints?.length || 0,
          originalSubSection?.bulletPoints?.length || 0
        );

        const mergedBulletPoints = [];
        for (let i = 0; i < maxLength; i++) {
          const currentPoint = subSection.bulletPoints?.[i];
          const originalPoint = originalSubSection?.bulletPoints?.[i];

          // Show item if it exists in current OR if it existed in original (to show deletions)
          if (currentPoint || originalPoint) {
            const isEmpty = !currentPoint?.text || currentPoint.text.trim() === "";
            const isDeleted = isEmpty && originalPoint?.text;

            // In print version, skip deleted items
            if (isPrintVersion && isDeleted) {
              continue;
            }

            mergedBulletPoints.push({
              index: i,
              current: currentPoint,
              original: originalPoint,
              isEmpty,
              isDeleted,
              isNew: currentPoint && !originalPoint
            });
          }
        }

        return mergedBulletPoints.map(({ index, current, original, isDeleted, isNew }) => {
          // For deleted items, show empty current text so DiffText can handle the strikethrough properly
          const displayPoint = isDeleted
            ? { ...(original || { iconName: "default", text: "", id: `temp-${index}` }), text: "" }  // Empty text for deleted
            : current || { iconName: "default", text: "", id: `temp-${index}` };

          return (
            <CvBulletPoint
              key={`subsection-bullet-${index}`}
              bulletPoint={displayPoint}
              editable={editable && !isDeleted}
              baseQuery={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index]}
              isPrintVersion={isPrintVersion}
              originalBulletPoint={showDiff ? (isNew ? { iconName: "", text: "" } : original) : undefined}  // Empty iconName and text for new items to trigger green highlighting
              showDiff={showDiff}
              autoEdit={(!current?.text || current.text.trim() === "")}
              onAutoDelete={() => {
                // Remove bullet point from array
                dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index] }));
              }}
              onDelete={editable && !isDeleted ? () => {
                // Delete bullet point by clearing both text and icon
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'text'], newValue: "" }));
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'iconName'], newValue: "" }));
              } : undefined}
              onRestore={editable && isDeleted && original ? () => {
                // Restore deleted bullet point by setting both text and icon back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'text'], newValue: original.text || "" }));
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'iconName'], newValue: original.iconName || "" }));
              } : undefined}
            />
          );
        });
      })()}
      {/* Add new bullet point button */}
      {editable && subSection.bulletPoints && subSection.bulletPoints.length > 0 && (
        // Show button only if all existing bullet points have content
        !subSection.bulletPoints.some(bp => !bp.text || bp.text.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add bullet point">
            <IconButton
              onClick={() => {
                const newIndex = subSection.bulletPoints?.length || 0;
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', newIndex, 'text'],
                  newValue: ""
                }));
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', newIndex, 'iconName'],
                  newValue: "default"
                }));
              }}
              size="small"
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                backgroundColor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderStyle: 'solid',
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
