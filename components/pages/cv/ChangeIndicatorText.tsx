import { Box, Chip, Tooltip } from "@mui/material";
import { ReactNode } from "react";
import { TextChange } from "./utils/cvDiffTracker";

interface ChangeIndicatorTextProps {
  children: ReactNode;
  change?: TextChange | null;
  showIndicators?: boolean;
}

export function ChangeIndicatorText({ 
  children, 
  change, 
  showIndicators = true 
}: ChangeIndicatorTextProps) {
  if (!showIndicators || !change) {
    return <>{children}</>;
  }

  const getChangeColor = (type: TextChange['type']) => {
    switch (type) {
      case 'added':
        return 'success';
      case 'modified':
        return 'secondary';
      case 'removed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getChangeLabel = (type: TextChange['type']) => {
    switch (type) {
      case 'added':
        return 'Added by AI';
      case 'modified':
        return 'Adjusted by AI';
      case 'removed':
        return 'Removed by AI';
      default:
        return 'Changed';
    }
  };

  const getTooltipContent = () => {
    switch (change.type) {
      case 'modified':
        return (
          <Box>
            <Box component="div" sx={{ fontWeight: 'bold', mb: 1 }}>Original:</Box>
            <Box component="div" sx={{ mb: 1, opacity: 0.8 }}>{change.originalText}</Box>
            <Box component="div" sx={{ fontWeight: 'bold', mb: 1 }}>Modified:</Box>
            <Box component="div">{change.newText}</Box>
          </Box>
        );
      case 'added':
        return `Added by AI: ${change.newText}`;
      case 'removed':
        return `Removed by AI: ${change.originalText}`;
      default:
        return 'Changed by AI';
    }
  };
  return (
    <Box 
      component="span" 
      sx={{ 
        position: 'relative',
        display: 'inline-block',
        backgroundColor: (theme: any) => {
          const color = getChangeColor(change.type);
          return theme.palette.mode === 'light' 
            ? theme.palette[color]?.light || `${color}.50`
            : theme.palette[color]?.dark || `${color}.900`;
        },
        padding: '2px 4px',
        borderRadius: '4px',
        opacity: change.type === 'removed' ? 0.6 : 1,
        textDecoration: change.type === 'removed' ? 'line-through' : 'none'
      }}
    >
      {children}
      <Tooltip 
        title={getTooltipContent()}
        placement="top"
        arrow
      >
        <Chip
          label={getChangeLabel(change.type)}
          size="small"
          color={getChangeColor(change.type) as any}
          variant="outlined"
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            fontSize: '0.6rem',
            height: '16px',
            '& .MuiChip-label': {
              padding: '0 4px',
            }
          }}
        />
      </Tooltip>
    </Box>
  );
}
