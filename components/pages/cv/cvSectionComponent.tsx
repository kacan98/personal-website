import { EditableText, EditableTextProps } from "@/components/editableText";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import { CvSection } from "@/types";
import {
  Box,
  alpha,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
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

  // Function to revert entire section to original
  const revertSectionToOriginal = useCallback(() => {
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
  const hasChanges = originalSection && (
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
      {(title || editable) && (
        <SuperEditableText
          query={["title"]}
          variant="h4"
          mb={1}
          text={title || ""}
          originalText={isNew && showDiff ? "" : originalSection?.title}
          autoEdit={(!title || title.trim() === "")}
          onAutoDelete={() => {
            // Delete the entire section when title is empty
            // We need to implement section deletion logic here
          }}
          onDelete={editable ? () => {
            dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'title'], newValue: "" }));
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
              isNewItem: currentParagraph && !originalParagraph
            });
          }
        }

        return mergedParagraphs.map(({ index, current, original, isDeleted, isNewItem }) => {

          return (
            <SuperEditableText
              query={['paragraphs', index]}
              key={`paragraph-${index}-${(current || original || "").substring(0, 20)}`}
              variant="body1"
              gutterBottom
              text={isDeleted ? "" : current}  // For deleted items, show empty current text
              originalText={showDiff ? (isDeleted ? original : ((isNewItem || isNew) ? "" : original)) : undefined}  // Empty string for new items or items in new sections
              autoEdit={(!current || current.trim() === "")}
              onAutoDelete={() => {
                // Remove paragraph from array
                dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'paragraphs', index] }));
              }}
              onDelete={editable && !isDeleted ? () => {
                // Delete paragraph by setting it to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', index], newValue: "" }));
              } : undefined}
              onRestore={editable && original && (isDeleted || current !== original) ? () => {
                // Restore individual paragraph by setting its text back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'paragraphs', index], newValue: original }));
              } : undefined}
            />
          );
        });
      })()}

      {/* Add new paragraph button */}
      {editable && paragraphs && (
        // Show button if there are no paragraphs OR if all existing paragraphs have content
        paragraphs.length === 0 ||
        !paragraphs.some(p => !p || p.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add paragraph">
            <IconButton
              onClick={() => {
                const newIndex = paragraphs?.length || 0;
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'paragraphs', newIndex],
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
              isNewItem: currentPoint && !originalPoint
            });
          }
        }

        return mergedBulletPoints.map(({ index, current, original, isDeleted, isNewItem }) => {
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
              originalBulletPoint={showDiff ? ((isNewItem || isNew) ? { iconName: "", text: "" } : original) : undefined}  // Empty for new items or items in new sections
              showDiff={showDiff}
              autoEdit={(!current?.text || current.text.trim() === "")}
              onAutoDelete={() => {
                // Remove bullet point from array
                dispatch(removeArrayItem({ query: [sideOrMain, sectionIndex, 'bulletPoints', index] }));
              }}
              onDelete={editable && !isDeleted ? () => {
                // Delete bullet point by setting its text to empty string
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', index, 'text'], newValue: "" }));
              } : undefined}
              onRestore={editable && original && (isDeleted || current?.text !== original?.text) ? () => {
                // Restore individual bullet point by setting its text back to the original
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', index, 'text'], newValue: original.text || "" }));
                dispatch(updateCv({ query: [sideOrMain, sectionIndex, 'bulletPoints', index, 'iconName'], newValue: original.iconName || "" }));
              } : undefined}
            />
          );
        });
      })()}
      {/* Add new bullet point button */}
      {editable && bulletPoints && bulletPoints.length > 0 && (
        // Show button only if all existing bullet points have content
        !bulletPoints.some(bp => !bp.text || bp.text.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add bullet point">
            <IconButton
              onClick={() => {
                const newIndex = bulletPoints?.length || 0;
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'bulletPoints', newIndex, 'text'],
                  newValue: ""
                }));
                dispatch(updateCv({
                  query: [sideOrMain, sectionIndex, 'bulletPoints', newIndex, 'iconName'],
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
      {subSections && (subSections.map((subSection, index) => {
          const subSectionId = subSection.id || `${sectionKey}-sub-${index}`;
          const isSubRemoved = onRemoveSubSection && removedSubSections?.has(subSectionId);
          const isSubModified = onSubSectionAdjusted && modifiedSubSections?.has(subSectionId);

          // Skip removed subsections in print version
          if (isPrintVersion && isSubRemoved) {
            return null;
          }

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

