import { EditableText, EditableTextProps } from "@/components/editableText";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv } from "@/redux/slices/cv";
import { CvSection } from "@/types";
import {
  Box,
  Chip,
  alpha
} from "@mui/material";
import { useState, useCallback } from "react";
import { CvBulletPoint } from "./bulletPoint";
import { CvSubSectionComponent } from "./cvSubSectionComponent";

export function CvSectionComponent({
  sectionIndex,
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
  const [isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);
  const dispatch = useAppDispatch();


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



  return (
    <Box
      textAlign={"left"}
      sx={{
        position: 'relative',
        backgroundColor: isRemoved
          ? alpha('#ff0000', 0.1)
          : isNew && showDiff
            ? alpha('#4caf50', 0.1) // Light green for new sections
            : 'transparent',
        border: isNew && showDiff ? `1px solid ${alpha('#4caf50', 0.3)}` : 'none',
        borderRadius: isNew && showDiff ? 1 : 0,
        transition: 'all 0.2s ease-in-out',
      }}
    >

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
      {(() => {
        // Create a merged list of paragraphs showing both current and deleted items
        const maxLength = Math.max(
          paragraphs?.length || 0,
          originalSection?.paragraphs?.length || 0
        );

        const mergedParagraphs = [];
        for (let i = 0; i < maxLength; i++) {
          const currentParagraph = paragraphs?.[i];
          const originalParagraph = originalSection?.paragraphs?.[i];

          // Show item if it exists in current OR if it existed in original (to show deletions)
          if (currentParagraph || originalParagraph) {
            const isEmpty = !currentParagraph || currentParagraph.trim() === "";
            const isDeleted = isEmpty && originalParagraph;

            // In print version, skip deleted items
            if (isPrintVersion && isDeleted) {
              continue;
            }

            mergedParagraphs.push({
              index: i,
              current: currentParagraph || "",
              original: originalParagraph,
              isEmpty,
              isDeleted,
              isNew: currentParagraph && !originalParagraph
            });
          }
        }

        return mergedParagraphs.map(({ index, current, original, isDeleted, isNew }) => {

          return (
            <SuperEditableText
              query={['paragraphs', index]}
              key={`paragraph-${index}-${(current || original || "").substring(0, 20)}`}
              variant="body1"
              gutterBottom
              text={isDeleted ? "" : current}  // For deleted items, show empty current text
              originalText={showDiff ? (isNew ? "" : original) : undefined}  // Empty string for new items to trigger green highlighting
              onDelete={editable && !isDeleted ? () => {
                // Delete paragraph by setting it to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', index], newValue: "" }));
              } : undefined}
              onRestore={editable && isDeleted && original ? () => {
                // Restore deleted paragraph by setting its text back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', index], newValue: original }));
              } : undefined}
            />
          );
        });
      })()}
      {(() => {
        // Create a merged list of bullet points showing both current and deleted items
        const maxLength = Math.max(
          bulletPoints?.length || 0,
          originalSection?.bulletPoints?.length || 0
        );

        const mergedBulletPoints = [];
        for (let i = 0; i < maxLength; i++) {
          const currentPoint = bulletPoints?.[i];
          const originalPoint = originalSection?.bulletPoints?.[i];

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
              key={`bullet-${index}`}
              bulletPoint={displayPoint}
              editable={editable && !isDeleted}
              baseQuery={[sideOrMain, sectionIndex, 'bulletPoints', index]}
              isPrintVersion={isPrintVersion}
              originalBulletPoint={showDiff ? (isNew ? { iconName: "", text: "" } : original) : undefined}  // Empty iconName and text for new items to trigger green highlighting
              showDiff={showDiff}
              onDelete={editable && !isDeleted ? () => {
                // Delete bullet point by setting its text to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', index, 'text'], newValue: "" }));
              } : undefined}
              onRestore={editable && isDeleted && original ? () => {
                // Restore deleted bullet point by setting its text back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', index, 'text'], newValue: original.text || "" }));
              } : undefined}
            />
          );
        });
      })()}      {subSections && (subSections.map((subSection, index) => {
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

