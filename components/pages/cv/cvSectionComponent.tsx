import { EditableText, EditableTextProps } from "@/components/editableText";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import { CvSection } from "@/types";
import { Box, alpha } from "@mui/material";
import { useState, useCallback } from "react";
import { CvSubSectionComponent } from "./cvSubSectionComponent";
import { EditableParagraphList } from "./EditableParagraphList";
import { EditableBulletPointList } from "./EditableBulletPointList";

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
  isNew = false,
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
  const [_isAnyTextBeingEdited, setIsAnyTextBeingEdited] = useState(false);
  const dispatch = useAppDispatch();

  // Function to revert entire section to original
  const _revertSectionToOriginal = useCallback(() => {
    if (originalSection) {
      // Update title
      if (originalSection.title) {
        dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'title'], newValue: originalSection.title }));
      }
      // Update paragraphs
      if (originalSection.paragraphs) {
        originalSection.paragraphs.forEach((para, idx) => {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', idx], newValue: para }));
        });
      }
      // Update bullet points
      if (originalSection.bulletPoints) {
        originalSection.bulletPoints.forEach((point, idx) => {
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', idx, 'text'], newValue: point.text || "" }));
          dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', idx, 'iconName'], newValue: point.iconName || "" }));
        });
      }
      // Update subsections
      if (originalSection.subSections) {
        originalSection.subSections.forEach((subSection, subIdx) => {
          // Revert subsection title
          if (subSection.title) {
            dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subIdx, 'title'], newValue: subSection.title }));
          }
          // Revert subsection paragraphs
          if (subSection.paragraphs) {
            subSection.paragraphs.forEach((para, idx) => {
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subSections', subIdx, 'paragraphs', idx], newValue: para }));
            });
          }
        });
      }
    }
  }, [dispatch, originalSection, sideOrMain, sectionIndex]);

  // Check if section has any changes
  const _hasChanges = originalSection && (
    title !== originalSection.title ||
    JSON.stringify(paragraphs) !== JSON.stringify(originalSection.paragraphs) ||
    JSON.stringify(bulletPoints) !== JSON.stringify(originalSection.bulletPoints) ||
    JSON.stringify(subSections) !== JSON.stringify(originalSection.subSections)
  );


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

      {/* Status indicators removed - revert moved to context menu */}

      {/* Content */}
      {title && (
        <SuperEditableText
          query={["title"]}
          variant="h4"
          mb={1}
          sx={{
            fontWeight: 'bold',
            '@media print': {
              pageBreakAfter: 'avoid',
              breakAfter: 'avoid'
            }
          }}
          text={title || ""}
          originalText={isNew && showDiff ? "" : originalSection?.title}
          autoEdit={false}
          onAutoDelete={() => {
            // Delete the entire section when title is empty
            dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex] }));
          }}
          onDelete={editable ? () => {
            // Delete the entire section, not just the title
            dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex] }));
          } : undefined}
          onRestore={editable && originalSection?.title && title !== originalSection.title ? () => {
            // Restore just the title
            dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'title'], newValue: originalSection.title! }));
          } : undefined}
        />
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={0}>
          <SuperEditableText
            query={['subtitles', 'left']}
            variant="subtitle1"
            text={subtitles.left}
            originalText={originalSection?.subtitles?.left}
            onDelete={editable ? () => {
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subtitles', 'left'], newValue: "" }));
            } : undefined}
            onRestore={editable && originalSection?.subtitles?.left && subtitles.left !== originalSection.subtitles.left ? () => {
              // Restore just the left subtitle
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subtitles', 'left'], newValue: originalSection.subtitles!.left! }));
            } : undefined}
          />
          <SuperEditableText
            query={["subtitles", "right"]}
            variant="subtitle1"
            text={subtitles.right}
            originalText={originalSection?.subtitles?.right}
            onDelete={editable ? () => {
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subtitles', 'right'], newValue: "" }));
            } : undefined}
            onRestore={editable && originalSection?.subtitles?.right && subtitles.right !== originalSection.subtitles.right ? () => {
              // Restore just the right subtitle
              dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'subtitles', 'right'], newValue: originalSection.subtitles!.right! }));
            } : undefined}
          />
        </Box>
      )}
      <EditableParagraphList
        paragraphs={paragraphs}
        originalParagraphs={originalSection?.paragraphs}
        baseQuery={[sideOrMain, sectionIndex, 'paragraphs']}
        editable={editable}
        showDiff={showDiff}
        isPrintVersion={isPrintVersion}
        isRemoved={isRemoved}
        isNew={isNew}
      />

      <EditableBulletPointList
        bulletPoints={bulletPoints}
        originalBulletPoints={originalSection?.bulletPoints}
        baseQuery={[sideOrMain, sectionIndex, 'bulletPoints']}
        editable={editable}
        showDiff={showDiff}
        isPrintVersion={isPrintVersion}
        isRemoved={isRemoved}
        isNew={isNew}
      />
      {subSections && (subSections.map((subSection, index) => {
          const subSectionId = subSection.id || `${sectionKey}-sub-${index}`;
          const isSubRemoved = onRemoveSubSection && removedSubSections?.has(subSectionId);
          const isSubModified = onSubSectionAdjusted && modifiedSubSections?.has(subSectionId);

          // Don't skip removed subsections - show them with red background in diff mode
          // if (isSubRemoved) {
          //   return null;
          // }

          // Simple index-based matching for subsections
          const originalSubSection = originalSection?.subSections?.[index];
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

