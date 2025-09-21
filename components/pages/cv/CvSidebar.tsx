"use client";
import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { BRAND_COLORS } from "@/app/colors";
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

// Compact version with smaller buttons and tighter spacing
interface SidebarActionButtonProps {
  icon: ReactElement;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  completed?: boolean;
}

const CompactSidebarActionButton = ({
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
            width: 36, // Reduced from 48
            height: 36, // Reduced from 48
            borderRadius: 1.5, // Reduced border radius
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
            border: '1px solid', // Reduced border thickness
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
                top: -3,
                right: -3,
                width: 12, // Reduced from 16
                height: 12, // Reduced from 16
                color: '#10b981',
                backgroundColor: 'background.paper',
                borderRadius: '50%',
                border: '1px solid', // Reduced border
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
  _onManualAdjustmentsQuick: () => void;
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
  _onManualAdjustmentsQuick,
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
      visible: true,
      completed: hasManualRefinements,
    },
    {
      id: 'motivational-letter',
      label: 'Motivational Letter',
      icon: <EmailIcon />,
      onClick: onViewMotivationalLetter,
      disabled: false,
      visible: hasMotivationalLetter,
      completed: hasMotivationalLetter,
    },
    {
      id: 'position-analysis',
      label: 'Position Analysis',
      icon: <AnalyticsIcon />,
      onClick: onViewPositionAnalysis,
      disabled: false,
      visible: hasAdjustedCv,
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
        gap: 1, // Reduced from 2
        p: 1.5, // Reduced from 2
        borderRadius: 2, // Reduced from 3
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', // Lighter shadow
        border: '1px solid',
        borderColor: 'divider',
        minWidth: isCollapsed ? 52 : 52, // Reduced from 64
        transition: 'all 0.3s ease',
      }}
    >
      {/* Compact Collapse/Expand Toggle Button */}
      <Tooltip title={isCollapsed ? "CV Actions" : "Collapse Actions"} placement="left" arrow>
        <IconButton
          onClick={handleToggleCollapse}
          sx={{
            width: 36, // Reduced from 48
            height: 36, // Reduced from 48
            alignSelf: 'center',
            mb: isCollapsed ? 0 : 1, // Reduced margin
            backgroundColor: isCollapsed ? 'primary.main' : 'rgba(25, 118, 210, 0.12)',
            color: isCollapsed ? 'primary.contrastText' : 'primary.main',
            border: '1px solid', // Reduced border
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: isCollapsed ? 'primary.dark' : 'rgba(25, 118, 210, 0.2)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {React.cloneElement(isCollapsed ? <EditIcon /> : <ExpandLessIcon />, { fontSize: 'small' })}
        </IconButton>
      </Tooltip>

      {!isCollapsed && (
        // Show compact buttons when expanded
        <>
          {visibleButtons.map((button) => {
            // Special handling for Manual Adjustments button
            if (button.id === 'manual-adjustments' && button.icon && button.onClick) {
              return (
                <CompactSidebarActionButton
                  key={button.id}
                  icon={button.icon}
                  label="CV Adjustments"
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
                        width: 36, // Reduced size
                        height: 36, // Reduced size
                        borderRadius: 1.5,
                        position: 'relative',
                        backgroundColor: lastCacheStatus === true
                          ? 'rgba(255, 152, 0, 0.15)'
                          : lastCacheStatus === false
                          ? `rgba(${BRAND_COLORS.accentRgb}, 0.15)`
                          : `rgba(${BRAND_COLORS.accentRgb}, 0.15)`,
                        color: lastCacheStatus === true
                          ? '#ff9800'
                          : lastCacheStatus === false
                          ? BRAND_COLORS.accent
                          : BRAND_COLORS.accent,
                        border: '1px solid',
                        borderColor: lastCacheStatus === true
                          ? '#ff9800'
                          : lastCacheStatus === false
                          ? BRAND_COLORS.accent
                          : BRAND_COLORS.accent,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: lastCacheStatus === true
                            ? 'rgba(255, 152, 0, 0.25)'
                            : lastCacheStatus === false
                            ? `rgba(${BRAND_COLORS.accentRgb}, 0.25)`
                            : `rgba(${BRAND_COLORS.accentRgb}, 0.25)`,
                          transform: 'scale(1.05)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <StorageIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              );
            }

            // Regular compact buttons
            if (button.icon && button.label && button.onClick) {
              return (
                <CompactSidebarActionButton
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