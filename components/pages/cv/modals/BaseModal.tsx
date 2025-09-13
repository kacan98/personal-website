"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, Minimize as MinimizeIcon, Maximize as MaximizeIcon } from "@mui/icons-material";
import { ReactNode } from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  disableBackdropClick?: boolean;
  minimizable?: boolean;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const BaseModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'md',
  fullScreen,
  disableBackdropClick = false,
  minimizable = false,
  isMinimized = false,
  onToggleMinimize,
}: BaseModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldBeFullScreen = fullScreen || isMobile;

  return (
    <Dialog
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      maxWidth={isMinimized ? 'sm' : maxWidth}
      fullWidth={!isMinimized}
      fullScreen={isMinimized ? false : shouldBeFullScreen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: shouldBeFullScreen && !isMinimized ? 0 : 3,
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
          boxShadow: shouldBeFullScreen && !isMinimized
            ? 'none'
            : '0 20px 60px rgba(0, 0, 0, 0.12)',
          ...(isMinimized && {
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: '320px',
            height: 'auto',
            maxHeight: '80px',
            margin: 0,
            transform: 'none',
          }),
        },
        '& .MuiBackdrop-root': {
          backgroundColor: isMinimized ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: isMinimized ? 'none' : 'blur(4px)',
          cursor: disableBackdropClick ? 'default' : 'pointer !important',
          pointerEvents: isMinimized ? 'none' : 'auto',
          '&:hover': {
            cursor: disableBackdropClick ? 'default' : 'pointer',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pb: subtitle ? 1 : 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && !isMinimized && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {minimizable && onToggleMinimize && (
            <IconButton
              onClick={onToggleMinimize}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
            </IconButton>
          )}
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {!isMinimized && (
        <>
          <DialogContent
            sx={{
              p: 3,
              '&:first-of-type': {
                pt: 3,
              },
            }}
          >
            {children}
          </DialogContent>

          {actions && (
            <DialogActions
              sx={{
                px: 3,
                pb: 3,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                gap: 2,
              }}
            >
              {actions}
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default BaseModal;