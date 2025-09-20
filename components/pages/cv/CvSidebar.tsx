"use client";
import { Box, Tooltip, IconButton } from "@mui/material";
import {
  Work as WorkIcon,
  Email as EmailIcon,
  Translate as TranslateIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  CompareArrows as CompareArrowsIcon,
  RestartAlt as RestartAltIcon,
  Extension as ExtensionIcon,
  Storage as StorageIcon,
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
  onOpenExtensionModal?: () => void;
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
  onOpenExtensionModal,
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
      label: 'Adjust for Position',
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
      visible: hasMotivationalLetter, // Only visible when letter has been generated
      completed: hasMotivationalLetter,
    },
    {
      id: 'position-analysis',
      label: 'Position Analysis',
      icon: <AnalyticsIcon />,
      onClick: onViewPositionAnalysis,
      disabled: false,
      visible: hasAdjustedCv, // Only visible after CV has been adjusted for position
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
      label: lastCacheStatus !== null
        ? `Clear AI Cache (${lastCacheStatus ? 'Recently used cache' : 'Fresh AI responses'})`
        : 'Clear AI Cache',
      icon: <StorageIcon />,
      onClick: onClearCache || (() => {}),
      disabled: !onClearCache,
      visible: !!onClearCache,
      completed: false,
    },
    {
      id: 'separator',
      isSeparator: true,
      visible: !!onOpenExtensionModal,
    },
    {
      id: 'chrome-extension',
      label: 'Get Chrome Extension',
      icon: <ExtensionIcon />,
      onClick: onOpenExtensionModal || (() => {}),
      disabled: false,
      visible: !!onOpenExtensionModal,
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

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: editable ? 'flex' : 'none',
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
            // Render separator
            if (button.isSeparator) {
              return (
                <Box
                  key={button.id}
                  sx={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'divider',
                    my: 1,
                  }}
                />
              );
            }

            // Special handling for Manual Adjustments button with simple tooltip
            if (button.id === 'manual-adjustments' && button.icon && button.onClick) {
              return (
                <SidebarActionButton
                  key={button.id}
                  icon={button.icon}
                  label="Quick CV Adjustments - Opens bottom panel for quick improvements"
                  onClick={button.onClick}
                  disabled={button.disabled}
                  completed={button.completed}
                />
              );
            }

            // Special handling for cache clear button with enhanced styling
            if (button.id === 'clear-cache') {
              return (
                <Tooltip
                  key={button.id}
                  title={button.label}
                  placement="left"
                  arrow
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
                        backgroundColor: lastCacheStatus === true
                          ? 'rgba(255, 152, 0, 0.15)' // Orange for cached responses
                          : lastCacheStatus === false
                          ? 'rgba(76, 175, 80, 0.15)' // Green for fresh responses
                          : 'rgba(156, 39, 176, 0.15)', // Purple for unknown state
                        color: lastCacheStatus === true
                          ? '#ff9800'
                          : lastCacheStatus === false
                          ? '#4caf50'
                          : '#9c27b0',
                        border: '2px solid',
                        borderColor: lastCacheStatus === true
                          ? '#ff9800'
                          : lastCacheStatus === false
                          ? '#4caf50'
                          : '#9c27b0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: lastCacheStatus === true
                            ? 'rgba(255, 152, 0, 0.25)'
                            : lastCacheStatus === false
                            ? 'rgba(76, 175, 80, 0.25)'
                            : 'rgba(156, 39, 176, 0.25)',
                          transform: 'scale(1.05)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <StorageIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              );
            }

            // Regular buttons use the SidebarActionButton component
            if (!button.isSeparator && button.icon && button.label && button.onClick) {
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
            }

            return null;
          })}
        </>
      )}

    </Box>
  );
};

export default CvSidebar;