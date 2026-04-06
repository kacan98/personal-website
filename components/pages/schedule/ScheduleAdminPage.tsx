'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import PasswordModal from '@/components/auth/PasswordModal';

interface Booking {
  id: number;
  meetingTypeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  attendeeCompany: string | null;
  meetingTopic: string | null;
  scheduledAt: string;
  scheduledEndAt: string;
  status: string;
  googleMeetLink: string | null;
  cancellationToken: string;
  createdAt: string;
}

export default function ScheduleAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      checkCalendarConnection();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/schedule/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCalendarConnection = async () => {
    // Simple check - try to fetch status from an endpoint
    // For now, we'll just set it based on whether bookings have calendar IDs
    setCalendarConnected(false);
  };

  const connectGoogleCalendar = () => {
    window.location.href = '/api/calendar/oauth';
  };

  const getDurationLabel = (meetingTypeId: string) => {
    const match = meetingTypeId.match(/(\d+)min/);
    return match ? `${match[1]} min` : meetingTypeId;
  };

  const getCancellationLink = (token: string) => {
    return `${window.location.origin}/schedule/cancel/${token}`;
  };

  if (!isAuthenticated) {
    return <PasswordModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  const upcomingBookings = bookings
    .filter((b) => b.status === 'scheduled' && new Date(b.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastBookings = bookings
    .filter((b) => b.status === 'completed' || new Date(b.scheduledAt) <= new Date())
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Schedule Admin
      </Typography>

      {/* Google Calendar Connection */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Google Calendar
          </Typography>
          {!calendarConnected ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Connect your Google Calendar to automatically sync bookings and check availability.
              </Typography>
              <Button variant="contained" onClick={connectGoogleCalendar}>
                Connect Google Calendar
              </Button>
            </>
          ) : (
            <Alert severity="success">
              Google Calendar is connected. Your bookings sync automatically.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            To change meeting types or availability, edit:
            <br />
            <code style={{ backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
              app/lib/schedule-config.ts
            </code>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            After editing, restart your dev server to see changes.
          </Typography>
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upcoming Bookings ({upcomingBookings.length})
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : upcomingBookings.length === 0 ? (
            <Typography color="text.secondary">No upcoming bookings</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Meet Link</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {format(parseISO(booking.scheduledAt), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>{getDurationLabel(booking.meetingTypeId)}</TableCell>
                      <TableCell>{booking.attendeeName}</TableCell>
                      <TableCell>{booking.attendeeEmail}</TableCell>
                      <TableCell>{booking.attendeeCompany || '-'}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {booking.meetingTopic || '-'}
                      </TableCell>
                      <TableCell>
                        {booking.googleMeetLink ? (
                          <a href={booking.googleMeetLink} target="_blank" rel="noopener noreferrer">
                            Join
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={booking.status === 'scheduled' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Past Bookings ({pastBookings.length})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {format(parseISO(booking.scheduledAt), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>{getDurationLabel(booking.meetingTypeId)}</TableCell>
                      <TableCell>{booking.attendeeName}</TableCell>
                      <TableCell>{booking.attendeeEmail}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={booking.status === 'cancelled' ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
