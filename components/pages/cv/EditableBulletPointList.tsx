import { useAppDispatch } from "@/redux/hooks";
import { updateCv, removeArrayItem } from "@/redux/slices/cv";
import { BulletPoint } from "@/types";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { CvBulletPoint } from "./bulletPoint";

interface EditableBulletPointListProps {
  bulletPoints?: BulletPoint[];
  originalBulletPoints?: BulletPoint[];
  baseQuery: (string | number)[];
  editable?: boolean;
  showDiff?: boolean;
  isPrintVersion?: boolean;
  isRemoved?: boolean;
  isNew?: boolean;
}

export function EditableBulletPointList({
  bulletPoints,
  originalBulletPoints,
  baseQuery,
  editable,
  showDiff,
  isPrintVersion,
  isRemoved,
  isNew
}: EditableBulletPointListProps) {
  const dispatch = useAppDispatch();

  // Create merged list of bullet points showing both current and deleted items
  // Use ID-based matching instead of index-based
  const mergedBulletPoints: Array<{
    index: number;
    current?: BulletPoint;
    original?: BulletPoint;
    isEmpty: boolean;
    isDeleted: boolean;
    isNewItem: boolean;
  }> = [];

  // Create a map of original bullet points by ID
  const originalById = new Map<string, { point: BulletPoint; index: number }>();
  originalBulletPoints?.forEach((point, index) => {
    if (point.id) {
      originalById.set(point.id, { point, index });
    }
  });

  // Track which original IDs we've seen
  const seenOriginalIds = new Set<string>();

  // Process current bullet points
  bulletPoints?.forEach((currentPoint, currentIndex) => {
    const isEmpty = !currentPoint?.text || currentPoint.text.trim() === "";
    let originalPoint: BulletPoint | undefined;
    let isNewItem = false;
    let isDeleted = false;

    if (currentPoint.id && originalById.has(currentPoint.id)) {
      // Found matching original by ID
      originalPoint = originalById.get(currentPoint.id)!.point;
      seenOriginalIds.add(currentPoint.id);
    } else {
      // No matching ID - this is a new item
      isNewItem = true;
    }

    isDeleted = isEmpty && !!originalPoint?.text;

    // In print version, skip deleted items
    if (isPrintVersion && isDeleted) {
      return;
    }

    mergedBulletPoints.push({
      index: currentIndex,
      current: currentPoint,
      original: originalPoint,
      isEmpty,
      isDeleted,
      isNewItem
    });
  });

  // Add any original bullet points that were removed (not in current list)
  if (showDiff && originalBulletPoints) {
    originalBulletPoints.forEach((originalPoint, originalIndex) => {
      if (originalPoint.id && !seenOriginalIds.has(originalPoint.id)) {
        // This original item was removed
        if (!isPrintVersion) {
          // Find where to insert it in the merged list (after the last seen item from before it)
          mergedBulletPoints.push({
            index: bulletPoints?.length || 0, // Use next available index
            current: undefined,
            original: originalPoint,
            isEmpty: true,
            isDeleted: true,
            isNewItem: false
          });
        }
      }
    });
  }

  return (
    <>
      {mergedBulletPoints.map(({ index, current, original, isDeleted, isNewItem }) => {
        const displayPoint = isDeleted
          ? { ...(original || { iconName: "default", text: "", id: `temp-${index}` }), text: "" }
          : current || { iconName: "default", text: "", id: `temp-${index}` };

        // Create unique key using baseQuery path and bullet point ID
        const uniqueKey = displayPoint.id
          ? `${baseQuery.join('-')}-bullet-${displayPoint.id}`
          : `${baseQuery.join('-')}-bullet-${index}`;

        return (
          <CvBulletPoint
            key={uniqueKey}
            bulletPoint={displayPoint}
            editable={!!(editable && !isDeleted)}
            baseQuery={[...baseQuery, index]}
            isPrintVersion={!!isPrintVersion}
            originalBulletPoint={showDiff ? ((isNewItem || isNew) ? { iconName: "", text: "" } : original) : undefined}
            showDiff={showDiff}
            autoEdit={(!current?.text || current.text.trim() === "") && !(showDiff && isDeleted) && !isRemoved}
            onAutoDelete={
              showDiff && original ? undefined : () => {
                dispatch(removeArrayItem({ query: [...baseQuery, index] }));
              }
            }
            onDelete={editable && !isDeleted ? () => {
              dispatch(updateCv({ query: [...baseQuery, index, 'text'], newValue: "" }));
            } : undefined}
            onRestore={editable && original && (isDeleted || current?.text !== original?.text) ? () => {
              dispatch(updateCv({ query: [...baseQuery, index, 'text'], newValue: original.text || "" }));
              dispatch(updateCv({ query: [...baseQuery, index, 'iconName'], newValue: original.iconName || "" }));
            } : undefined}
          />
        );
      })}

      {/* Add new bullet point button */}
      {editable && bulletPoints && bulletPoints.length > 0 && (
        !bulletPoints.some(bp => !bp.text || bp.text.trim() === "")
      ) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2, opacity: 0.3, transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
          <Tooltip title="Add bullet point">
            <IconButton
              onClick={() => {
                const newIndex = bulletPoints?.length || 0;
                dispatch(updateCv({
                  query: [...baseQuery, newIndex, 'text'],
                  newValue: ""
                }));
                dispatch(updateCv({
                  query: [...baseQuery, newIndex, 'iconName'],
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
    </>
  );
}
