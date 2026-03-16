'use client';

import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';

interface Props {
  token: string;
}

export default function CancelBookingPage({ token }: Props) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/schedule/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancellationToken: token,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" gutterBottom color="success.main">
              Booking Cancelled
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Your meeting has been successfully cancelled. A confirmation email has been sent.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cancel Booking
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Are you sure you want to cancel this meeting?
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for cancellation (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Cancel Booking'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
