import { EditableText, EditableTextProps } from "@/components/editableText";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initCv } from "@/redux/slices/cv";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
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
import { useState } from "react";
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
  onSectionAdjusted,
  onRemoveSection,
  onRestoreSection,
  onRemoveSubSection,
  onRestoreSubSection,
  onSubSectionAdjusted,
}: {
  editable?: boolean;
  sectionIndex: number;
  sideOrMain: "mainColumn" | "sideColumn";
  section: CvSection;
  isPrintVersion: boolean;
  positionDetails?: string | null;
  adjustSection?: (section: CvSection, positionDescription: string) => Promise<CvSection | null>;
  sectionKey?: string;
  isRemoved?: boolean;
  isModified?: boolean;
  onSectionAdjusted?: (sectionKey: string) => void;
  onRemoveSection?: (sectionKey: string) => void;
  onRestoreSection?: (sectionKey: string) => void;
  onRemoveSubSection?: (subSectionKey: string) => void;
  onRestoreSubSection?: (subSectionKey: string) => void;
  onSubSectionAdjusted?: (subSectionKey: string) => void;
}) {
  const { title, subtitles, paragraphs, bulletPoints, subSections } = section;
  const [isHovered, setIsHovered] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const dispatch = useAppDispatch();
  const reduxCv = useAppSelector((state) => state.cv);

  const SuperEditableText = ({ query, ...props }: EditableTextProps) => {
    return <EditableText {...props} query={[sideOrMain, sectionIndex, ...query]} editable={editable} />;
  };

  const handleAdjustSection = async () => {
    if (!adjustSection || !positionDetails || !sectionKey) return;

    setIsAdjusting(true);
    try {
      const adjustedSection = await adjustSection(section, positionDetails);
      if (adjustedSection) {
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
  const shouldShowHoverEffect = isHovered && canShowHoverActions;
  const showActions = shouldShowHoverEffect && !isAdjusting;

  return (
    <Box
      textAlign={"left"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e: React.MouseEvent) => {
        // Don't hide hover state if user is interacting with an input
        const target = e.relatedTarget as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
          target.closest('.MuiTextField-root') || target.closest('input') || target.closest('textarea'))) {
          return;
        }
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
      {title && (
        <SuperEditableText query={["title"]} variant="h4" mb={1} text={title} />
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={0}>
          <SuperEditableText query={['subtitles', 'left']} variant="subtitle1" text={subtitles.left} />
          <SuperEditableText query={["subtitles", "right"]} variant="subtitle1" text={subtitles.right} />
        </Box>
      )}
      {paragraphs &&
        paragraphs.map((paragraph, idx) => (
          <SuperEditableText query={['paragraphs', idx]} key={idx} variant="body1" gutterBottom text={paragraph} />
        ))}
      {bulletPoints &&
        bulletPoints.map((point, idx) => {
          if (!point.text) return <></>
          return (<CvBulletPoint bulletPoint={point} key={idx} editable={editable} baseQuery={[sideOrMain, sectionIndex, 'bulletPoints', idx]} isPrintVersion={isPrintVersion} />)
        }
        )}      {subSections && (subSections.map((subSection, index) => (
          <CvSubSectionComponent
            key={index}
            subSection={subSection}
            subSectionIndex={index}
            sectionIndex={sectionIndex}
            sideOrMain={sideOrMain}
            editable={editable}
            isPrintVersion={isPrintVersion}
            positionDetails={positionDetails}
            adjustSection={adjustSection}
            subSectionKey={`${sectionKey}-sub-${index}`}
            isRemoved={false}
            isModified={false}
            onRemoveSubSection={onRemoveSubSection}
            onRestoreSubSection={onRestoreSubSection}
            onSubSectionAdjusted={onSubSectionAdjusted}
          />
        )))}
    </Box>
  );
}

