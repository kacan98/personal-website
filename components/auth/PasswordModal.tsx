'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PasswordModal({ open, onClose }: PasswordModalProps): JSX.Element {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | undefined>();

  const { login, checkAuthStatus } = useAuth();

  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      await checkAuthStatus();
    } catch (error) {
      console.error('Manual auth refresh failed:', error);
      setError('Failed to check authentication status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const password = passwordRef.current?.value || '';
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(password);

      if (result.success) {
        // Success - close modal and reset state
        if (passwordRef.current) {
          passwordRef.current.value = '';
        }
        setError('');
        setRemainingAttempts(undefined);
        onClose();
      } else {
        // Failed - show error
        setError(result.message);
        setRemainingAttempts(result.remainingAttempts);
        // Clear password on failure
        if (passwordRef.current) {
          passwordRef.current.value = '';
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (passwordRef.current) {
      passwordRef.current.value = '';
    }
    setError('');
    setRemainingAttempts(undefined);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Admin Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter the admin password to access CV editing features
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 2 }}>
          {error && (
            <Alert
              severity={remainingAttempts !== undefined && remainingAttempts > 0 ? 'warning' : 'error'}
              sx={{ mb: 2 }}
            >
              {error}
              {remainingAttempts !== undefined && remainingAttempts > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                </Typography>
              )}
            </Alert>
          )}

          <TextField
            fullWidth
            type="password"
            label="Admin Password"
            inputRef={passwordRef}
            disabled={isLoading}
            placeholder="Enter admin password"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            This password grants access to CV modification features in production.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<RefreshIcon />}
            size="small"
          >
            Refresh Auth
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}