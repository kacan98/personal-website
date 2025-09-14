import { EditableText, EditableTextProps } from "@/components/editableText";
import { CvSection, CvSubSection } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv } from "@/redux/slices/cv";
import {
  Box,
  Chip,
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
  isNew = false,
  onRemoveSubSection,
  onRestoreSubSection,
  onSubSectionAdjusted,
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
  const [isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);
  const dispatch = useAppDispatch();

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
        </Box>
      )}

      {/* Content */}
      <SuperEditableText query={['title']} variant="h5" text={subSection.title} originalText={originalSubSection?.title} />
      {subSection.subtitles && (
        <Box display="flex" justifyContent="space-between" pb={1}>
          <SuperEditableText query={['subtitles', 'left']} variant="subtitle1" text={subSection.subtitles.left} originalText={originalSubSection?.subtitles?.left} />
          <SuperEditableText query={['subtitles', 'right']} variant="subtitle1" text={subSection.subtitles.right} originalText={originalSubSection?.subtitles?.right} />
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
            />
          );
        })}
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
              onDelete={editable && !isDeleted ? () => {
                // Delete bullet point by setting its text to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'text'], newValue: "" }));
              } : undefined}
              onRestore={editable && isDeleted && original ? () => {
                // Restore deleted bullet point by setting its text back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints', index, 'text'], newValue: original.text || "" }));
              } : undefined}
            />
          );
        });
      })()}
    </Box>
  );
}
