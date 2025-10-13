import { EditableText, EditableTextProps } from "@/components/editableText";
import { CvSection, CvSubSection } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import { Box, alpha } from "@mui/material";
import { useState, useCallback } from "react";
import { EditableParagraphList } from "./EditableParagraphList";
import { EditableBulletPointList } from "./EditableBulletPointList";

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
        autoEdit={(!subSection.title || subSection.title.trim() === "") && !isRemoved}
        onAutoDelete={() => {
          // Delete the entire subsection when title is empty
          dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex] }));
        }}
        onDelete={editable ? () => {
          // Delete the entire subsection, not just the title
          dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'subSections', subSectionIndex] }));
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
      <EditableParagraphList
        paragraphs={subSection.paragraphs}
        originalParagraphs={originalSubSection?.paragraphs}
        baseQuery={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'paragraphs']}
        editable={editable}
        showDiff={showDiff}
        isPrintVersion={isPrintVersion}
        isRemoved={isRemoved}
      />

      <EditableBulletPointList
        bulletPoints={subSection.bulletPoints}
        originalBulletPoints={originalSubSection?.bulletPoints}
        baseQuery={[sideOrMain, sectionIndex, 'subSections', subSectionIndex, 'bulletPoints']}
        editable={editable}
        showDiff={showDiff}
        isPrintVersion={isPrintVersion}
        isRemoved={isRemoved}
      />
    </Box>
  );
}
