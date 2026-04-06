'use client';

import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, parseISO } from 'date-fns';
import LoadingTimeSlots from './LoadingTimeSlots';

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

interface TimeSlotStepProps {
  selectedMeetingType: MeetingType;
  selectedDate: Date | null;
  availableSlots: TimeSlot[];
  loading: boolean;
  onDateSelect: (date: Date | null) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  onBack: () => void;
}

export default function TimeSlotStep({
  selectedMeetingType,
  selectedDate,
  availableSlots,
  loading,
  onDateSelect,
  onSlotSelect,
  onBack,
}: TimeSlotStepProps) {
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Selected: {selectedMeetingType.duration} minutes
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom>
              Select a Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={onDateSelect}
                minDate={new Date()}
                maxDate={addDays(new Date(), 60)}
                shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                sx={{
                  '& .MuiPickersDay-root.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.26)',
                    textDecoration: 'line-through',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom>
              Available Time Slots
            </Typography>

            {!selectedDate && (
              <Typography color="text.secondary">
                Please select a date to see available times
              </Typography>
            )}

            {selectedDate && loading && <LoadingTimeSlots />}

            {selectedDate && !loading && availableSlots.length === 0 && (
              <Typography color="text.secondary">
                No available slots for this date
              </Typography>
            )}

            {selectedDate && !loading && availableSlots.length > 0 && (
              <Grid container spacing={2}>
                {availableSlots.map((slot, index) => (
                  <Grid size={{ xs: 6 }} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => onSlotSelect(slot)}
                    >
                      {formatTime(slot.start)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        <Button onClick={onBack}>Back</Button>
      </CardContent>
    </Card>
  );
}
