"use client";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import {
  Work as WorkIcon,
  Email as EmailIcon,
  Translate as TranslateIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Speed as SpeedIcon,
  CompareArrows as CompareArrowsIcon,
  RestartAlt as RestartAltIcon,
  ClearAll as ClearAllIcon,
} from "@mui/icons-material";
import { useState, useEffect, ReactElement } from "react";

// Reusable component for sidebar action buttons
interface SidebarActionButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  completed?: boolean;
}

const SidebarActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  completed = false
}: SidebarActionButtonProps) => {
  return (
    <Tooltip title={label} placement="left" arrow>
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            position: 'relative',
            backgroundColor: disabled
              ? 'rgba(0, 0, 0, 0.04)'
              : completed
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(25, 118, 210, 0.12)',
            color: disabled
              ? 'text.disabled'
              : completed
              ? '#10b981'
              : 'primary.main',
            border: '2px solid',
            borderColor: disabled
              ? 'rgba(0, 0, 0, 0.12)'
              : completed
              ? '#10b981'
              : 'primary.main',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: disabled
                ? 'rgba(0, 0, 0, 0.04)'
                : completed
                ? 'rgba(16, 185, 129, 0.25)'
                : 'primary.main',
              color: disabled
                ? 'text.disabled'
                : completed
                ? '#10b981'
                : 'primary.contrastText',
              transform: disabled ? 'none' : 'scale(1.05)',
            },
            '&:active': {
              transform: disabled ? 'none' : 'scale(0.95)',
            },
          }}
        >
          {icon}
          {completed && (
            <CheckCircleIcon
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                color: '#10b981',
                backgroundColor: 'background.paper',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'background.paper',
              }}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface CvSidebarProps {
  onAdjustForPosition: () => void;
  onManualAdjustments: () => void;
  onManualAdjustmentsQuick: () => void;
  onViewMotivationalLetter: () => void;
  onViewPositionAnalysis: () => void;
  onTranslate: () => void;
  hasMotivationalLetter: boolean;
  hasPositionAnalysis: boolean;
  hasAdjustedCv: boolean;
  hasManualRefinements: boolean;
  editable: boolean;
  showDiff: boolean;
  onToggleDiff: () => void;
  hasOriginalCv: boolean;
  hasChanges: boolean;
  onResetToOriginal?: () => void;
  onClearCache?: () => void;
  lastCacheStatus?: boolean | null;
}

const CvSidebar = ({
  onAdjustForPosition,
  onManualAdjustments,
  onManualAdjustmentsQuick,
  onViewMotivationalLetter,
  onViewPositionAnalysis,
  onTranslate,
  hasMotivationalLetter,
  hasPositionAnalysis,
  hasAdjustedCv,
  hasManualRefinements,
  editable,
  showDiff,
  onToggleDiff,
  hasOriginalCv,
  hasChanges,
  onResetToOriginal,
  onClearCache,
  lastCacheStatus
}: CvSidebarProps) => {
  const sidebarButtons = [
    {
      id: 'adjust-position',
      label: `Adjust for Position${lastCacheStatus !== null ? (lastCacheStatus ? ' ⚡' : ' 🤖') : ''}`,
      icon: <WorkIcon />,
      onClick: onAdjustForPosition,
      disabled: false,
      visible: true,
      completed: hasAdjustedCv,
    },
    {
      id: 'manual-adjustments',
      label: 'Manual Adjustment',
      icon: <TuneIcon />,
      onClick: onManualAdjustments,
      disabled: false,
      visible: true, // Always visible for general CV improvements
      completed: hasManualRefinements,
    },
    {
      id: 'motivational-letter',
      label: 'Motivational Letter',
      icon: <EmailIcon />,
      onClick: onViewMotivationalLetter,
      disabled: false,
      visible: true, // Always visible - can generate or view existing
      completed: hasMotivationalLetter,
    },
    {
      id: 'position-analysis',
      label: 'Position Analysis',
      icon: <AnalyticsIcon />,
      onClick: onViewPositionAnalysis,
      disabled: false,
      visible: true, // Always visible - can analyze position or prompt for input
      completed: hasPositionAnalysis,
    },
    {
      id: 'translate',
      label: 'Translate',
      icon: <TranslateIcon />,
      onClick: onTranslate,
      disabled: false,
      visible: true,
      completed: false,
    },
    {
      id: 'show-changes',
      label: showDiff ? 'Hide Changes' : 'Show Changes',
      icon: <CompareArrowsIcon />,
      onClick: onToggleDiff,
      disabled: !hasOriginalCv || !hasChanges,
      visible: hasChanges && hasOriginalCv,
      completed: showDiff,
    },
    {
      id: 'reset-to-original',
      label: 'Reset to Original',
      icon: <RestartAltIcon />,
      onClick: onResetToOriginal || (() => {}),
      disabled: !hasChanges || !onResetToOriginal,
      visible: hasChanges && !!onResetToOriginal,
      completed: false,
    },
    {
      id: 'clear-cache',
      label: 'Clear AI Cache',
      icon: <ClearAllIcon />,
      onClick: onClearCache || (() => {}),
      disabled: !onClearCache,
      visible: !!onClearCache,
      completed: false,
    },
  ];

  const visibleButtons = sidebarButtons.filter(button => button.visible);

  // State for collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('cvSidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cvSidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  // Only show sidebar in development/editable mode
  if (!editable) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: isCollapsed ? 64 : 64,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Collapse/Expand Toggle Button */}
      <Tooltip title={isCollapsed ? "CV Actions" : "Collapse Actions"} placement="left" arrow>
        <IconButton
          onClick={handleToggleCollapse}
          sx={{
            width: 48,
            height: 48,
            alignSelf: 'center',
            mb: isCollapsed ? 0 : 2,
            backgroundColor: isCollapsed ? 'primary.main' : 'rgba(25, 118, 210, 0.12)',
            color: isCollapsed ? 'primary.contrastText' : 'primary.main',
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: isCollapsed ? 'primary.dark' : 'rgba(25, 118, 210, 0.2)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isCollapsed ? <EditIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Tooltip>

      {!isCollapsed && (
        // Show full buttons when expanded
        <>
          {visibleButtons.map((button) => {
            // Special handling for Manual Adjustments button with Quick Adjustment in tooltip
            if (button.id === 'manual-adjustments') {
              return (
                <Tooltip
                  key={button.id}
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>{button.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => {
                            onManualAdjustmentsQuick();
                          }}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                            color: 'primary.main',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                              transform: 'scale(1.05)',
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                          }}
                        >
                          <SpeedIcon />
                        </IconButton>
                        <Typography variant="caption" sx={{ color: 'inherit' }}>Quick Adjustment</Typography>
                      </Box>
                    </Box>
                  }
                  placement="left"
                  arrow
                  disableHoverListener={false}
                  enterDelay={200}
                  leaveDelay={300}
                >
                  <span>
                    <IconButton
                      onClick={button.onClick}
                      disabled={button.disabled}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        position: 'relative',
                        backgroundColor: button.disabled
                          ? 'rgba(0, 0, 0, 0.04)'
                          : button.completed
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(25, 118, 210, 0.12)',
                        color: button.disabled
                          ? 'text.disabled'
                          : button.completed
                          ? '#10b981'
                          : 'primary.main',
                        border: '2px solid',
                        borderColor: button.disabled
                          ? 'rgba(0, 0, 0, 0.12)'
                          : button.completed
                          ? '#10b981'
                          : 'primary.main',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: button.disabled
                            ? 'rgba(0, 0, 0, 0.04)'
                            : button.completed
                            ? 'rgba(16, 185, 129, 0.25)'
                            : 'primary.main',
                          color: button.disabled
                            ? 'text.disabled'
                            : button.completed
                            ? '#10b981'
                            : 'primary.contrastText',
                          transform: button.disabled ? 'none' : 'scale(1.05)',
                        },
                        '&:active': {
                          transform: button.disabled ? 'none' : 'scale(0.95)',
                        },
                      }}
                    >
                      {button.icon}
                      {button.completed && (
                        <CheckCircleIcon
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 16,
                            height: 16,
                            color: '#10b981',
                            backgroundColor: 'background.paper',
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'background.paper',
                          }}
                        />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              );
            }

            // Regular buttons use the SidebarActionButton component
            return (
              <SidebarActionButton
                key={button.id}
                icon={button.icon}
                label={button.label}
                onClick={button.onClick}
                disabled={button.disabled}
                completed={button.completed}
              />
            );
          })}
        </>
      )}

    </Box>
  );
};

export default CvSidebar;