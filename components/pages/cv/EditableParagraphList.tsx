import { EditableText } from "@/components/editableText";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useCallback } from "react";
import { Paragraph } from "@/types";

interface EditableParagraphListProps {
  paragraphs?: Paragraph[];
  originalParagraphs?: Paragraph[];
  baseQuery: (string | number)[];
  editable?: boolean;
  showDiff?: boolean;
  isPrintVersion?: boolean;
  isRemoved?: boolean;
  isNew?: boolean;
}

export function EditableParagraphList({
  paragraphs,
  originalParagraphs,
  baseQuery,
  editable,
  showDiff,
  isPrintVersion,
  isRemoved,
  isNew
}: EditableParagraphListProps) {
  const dispatch = useAppDispatch();

  // Create merged list using ID-based matching (same pattern as BulletPointList)
  const mergedParagraphs: Array<{
    index: number;
    current: string;
    original?: string;
    isEmpty: boolean;
    isDeleted: boolean;
    isNewItem: boolean;
    id?: string;
  }> = [];

  // Create a map of original paragraphs by ID
  const originalById = new Map<string, { paragraph: Paragraph; index: number }>();
  originalParagraphs?.forEach((para, index) => {
    if (para.id) {
      originalById.set(para.id, { paragraph: para, index });
    }
  });

  // Track which original IDs we've seen
  const seenOriginalIds = new Set<string>();

  // Process current paragraphs
  paragraphs?.forEach((currentPara, currentIndex) => {
    const isEmpty = !currentPara?.text || currentPara.text.trim() === "";
    let originalPara: Paragraph | undefined;
    let isNewItem = false;
    let isDeleted = false;

    if (currentPara.id && originalById.has(currentPara.id)) {
      // Found matching original by ID
      originalPara = originalById.get(currentPara.id)!.paragraph;
      seenOriginalIds.add(currentPara.id);
    } else {
      // No matching ID - this is a new item
      isNewItem = true;
    }

    isDeleted = isEmpty && !!originalPara?.text;

    // In print version, skip deleted items
    if (isPrintVersion && isDeleted) {
      return;
    }

    mergedParagraphs.push({
      index: currentIndex,
      current: currentPara.text,
      original: originalPara?.text,
      isEmpty,
      isDeleted,
      isNewItem,
      id: currentPara.id
    });
  });

  // Add any original paragraphs that were removed (not in current list)
  if (showDiff && originalParagraphs) {
    originalParagraphs.forEach((originalPara) => {
      if (originalPara.id && !seenOriginalIds.has(originalPara.id)) {
        // This original item was removed
        if (!isPrintVersion) {
          mergedParagraphs.push({
            index: paragraphs?.length || 0,
            current: "",
            original: originalPara.text,
            isEmpty: true,
            isDeleted: true,
            isNewItem: false,
            id: originalPara.id
          });
        }
      }
    });
  }

  const SuperEditableText = useCallback(({ query, originalText, ...props }: any) => {
    return <EditableText
      {...props}
      query={[...baseQuery, ...query]}
      editable={editable}
      originalText={originalText}
      showDiff={showDiff && !isPrintVersion}
    />;
  }, [baseQuery, editable, showDiff, isPrintVersion]);

  return (
    <>
      {mergedParagraphs.map(({ index, current, original, isDeleted, isNewItem, id }) => {
        // Create unique key using baseQuery path and paragraph ID
        const uniqueKey = id
          ? `${baseQuery.join('-')}-paragraph-${id}`
          : `${baseQuery.join('-')}-paragraph-${index}`;

        return (
          <SuperEditableText
            query={[index, 'text']}
            key={uniqueKey}
            variant="body1"
            gutterBottom
            text={isDeleted ? "" : current}
            originalText={showDiff ? (isDeleted ? original : ((isNewItem || isNew) ? "" : original)) : undefined}
            autoEdit={(!current || current.trim() === "") && !(showDiff && isDeleted) && !isRemoved}
            onAutoDelete={
              showDiff && original ? undefined : () => {
                dispatch(removeArrayItem({ query: [...baseQuery, index] }));
              }
            }
            onDelete={editable && !isDeleted ? () => {
              dispatch(updateCv({ query: [...baseQuery, index, 'text'], newValue: "" }));
            } : undefined}
            onRestore={editable && original && (isDeleted || current !== original) ? () => {
              dispatch(updateCv({ query: [...baseQuery, index, 'text'], newValue: original }));
            } : undefined}
          />
        );
      })}

      {/* Add new paragraph button */}
      {editable && paragraphs && (
        paragraphs.length === 0 || !paragraphs.some(p => !p.text || p.text.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add paragraph">
            <IconButton
              onClick={() => {
                const newIndex = paragraphs?.length || 0;
                dispatch(updateCv({
                  query: [...baseQuery, newIndex, 'text'],
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
    </>
  );
}
