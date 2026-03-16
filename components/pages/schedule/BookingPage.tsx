'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { format, startOfDay, endOfDay, parseISO } from 'date-fns';
import MeetingTypeStep from './MeetingTypeStep';
import TimeSlotStep from './TimeSlotStep';
import BookingFormStep from './BookingFormStep';
import LoadingMeetingTypes from './LoadingMeetingTypes';

interface MeetingType {
  id: number;
  name: string;
  duration: number;
  description: string;
  color: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

const steps = ['Select Meeting Type', 'Choose Time', 'Your Information', 'Confirmation'];

export default function BookingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const slotsRequestSeq = useRef(0);
  const slotsAbortController = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    topic: '',
  });

  const [timezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    fetchMeetingTypes();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedMeetingType) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedMeetingType]);

  useEffect(() => {
    return () => {
      slotsAbortController.current?.abort();
    };
  }, []);

  const fetchMeetingTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/schedule/meeting-types');
      const data = await response.json();

      // Check if data is an array (success) or error object
      if (Array.isArray(data)) {
        setMeetingTypes(data);
      } else {
        setError(data.error || 'Failed to load meeting types');
        setMeetingTypes([]);
      }
    } catch (err) {
      setError('Failed to load meeting types');
      setMeetingTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedMeetingType) return;

    slotsRequestSeq.current += 1;
    const currentRequestSeq = slotsRequestSeq.current;

    slotsAbortController.current?.abort();
    slotsAbortController.current = new AbortController();

    setSlotsLoading(true);
    setError(null);

    try {
      const startDate = startOfDay(selectedDate);
      const endDate = endOfDay(selectedDate);

      const response = await fetch(
        `/api/schedule/available-slots?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&meetingTypeId=${selectedMeetingType.id}`,
        { signal: slotsAbortController.current.signal }
      );

      if (!response.ok) throw new Error('Failed to fetch slots');

      const data = await response.json();

      // Guard against out-of-order responses if user changes date quickly
      if (currentRequestSeq === slotsRequestSeq.current) {
        setAvailableSlots(data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('Failed to load available time slots');
    } finally {
      if (currentRequestSeq === slotsRequestSeq.current) {
        setSlotsLoading(false);
      }
    }
  };

  const handleMeetingTypeSelect = (type: MeetingType) => {
    slotsAbortController.current?.abort();
    setSlotsLoading(false);
    setSelectedMeetingType(type);
    setSelectedDate(null); // Reset date when changing meeting type
    setSelectedSlot(null); // Reset slot when changing meeting type
    setAvailableSlots([]); // Clear available slots
    setActiveStep(1);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setActiveStep(2);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!selectedMeetingType || !selectedSlot || !formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/schedule/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTypeId: selectedMeetingType.id,
          attendeeName: formData.name,
          attendeeEmail: formData.email,
          attendeePhone: formData.phone,
          attendeeCompany: formData.company,
          meetingTopic: formData.topic,
          scheduledAt: selectedSlot.start,
          timezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      setMeetLink(data.meetLink);
      setBookingConfirmed(true);
      setActiveStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  if (bookingConfirmed) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" gutterBottom color="success.main">
              Booking Confirmed! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
              Your meeting has been scheduled. A confirmation email has been sent to{' '}
              <strong>{formData.email}</strong>
            </Typography>

            <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Meeting Details
              </Typography>
              <Typography>
                <strong>Type:</strong> {selectedMeetingType?.name}
              </Typography>
              <Typography>
                <strong>Date:</strong> {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedSlot && formatTime(selectedSlot.start)} -{' '}
                {selectedSlot && formatTime(selectedSlot.end)}
              </Typography>
              <Typography>
                <strong>Timezone:</strong> {timezone}
              </Typography>
            </Box>

            {meetLink && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Google Meet Link:</strong>{' '}
                <a href={meetLink} target="_blank" rel="noopener noreferrer">
                  {meetLink}
                </a>
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary">
              The meeting invite has been added to your calendar.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Schedule a Meeting
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Choose a time that works for you
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                // Clear error when navigating
                setError(null);
                // Allow going back, but not skipping forward
                if (index < activeStep) {
                  setActiveStep(index);
                } else if (index === 1 && selectedMeetingType) {
                  setActiveStep(1);
                } else if (index === 2 && selectedSlot) {
                  setActiveStep(2);
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        loading ? (
          <LoadingMeetingTypes />
        ) : (
          <MeetingTypeStep
            meetingTypes={meetingTypes}
            onSelect={handleMeetingTypeSelect}
          />
        )
      )}

      {activeStep === 1 && selectedMeetingType && (
        <TimeSlotStep
          selectedMeetingType={selectedMeetingType}
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          loading={slotsLoading}
          onDateSelect={handleDateSelect}
          onSlotSelect={handleSlotSelect}
          onBack={() => setActiveStep(0)}
        />
      )}

      {activeStep === 2 && selectedMeetingType && selectedDate && selectedSlot && (
        <BookingFormStep
          selectedMeetingType={selectedMeetingType}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          formData={formData}
          loading={loading}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onBack={() => setActiveStep(1)}
        />
      )}
    </Container>
  );
}
