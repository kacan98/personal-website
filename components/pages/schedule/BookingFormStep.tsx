'use client';

import { Box, Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface TimeSlot {
  start: string;
  end: string;
}

interface MeetingType {
  id: number;
  name: string;
  duration: number;
  description: string;
  color: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
}

interface BookingFormStepProps {
  selectedMeetingType: MeetingType;
  selectedDate: Date;
  selectedSlot: TimeSlot;
  formData: FormData;
  loading: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function BookingFormStep({
  selectedMeetingType,
  selectedDate,
  selectedSlot,
  formData,
  loading,
  onFormChange,
  onSubmit,
  onBack,
}: BookingFormStepProps) {
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Duration:</strong> {selectedMeetingType.duration} minutes
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {formatTime(selectedSlot.start)}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Your Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Full Name"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                error={formData.email !== '' && !formData.email.includes('@')}
                helperText={formData.email !== '' && !formData.email.includes('@') ? 'Please enter a valid email address' : ''}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                type="tel"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company/Organization"
                value={formData.company}
                onChange={(e) => onFormChange('company', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={12}
                label="What would you like to discuss?"
                value={formData.topic}
                onChange={(e) => onFormChange('topic', e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onBack}>Back</Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading || !formData.name || !formData.email || !formData.email.includes('@')}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
