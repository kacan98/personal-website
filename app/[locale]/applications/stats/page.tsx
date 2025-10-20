'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { STATUS_CONFIG, ApplicationStatus } from '@/app/db/schema';

interface DayStats {
  date: string;
  status: ApplicationStatus;
  count: number;
}

interface Application {
  id: number;
  jobUrl: string;
  positionTitle: string;
  appliedAt: string;
  status: ApplicationStatus;
}

interface StatsData {
  success: boolean;
  stats: DayStats[];
  applications: Application[];
  totalCount: number;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

// Helper function to get Monday of a given week (start of week)
const getMonday = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days; otherwise go to Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
};

// Helper function to get Sunday of a given week (end of week)
const getSunday = (date: Date): Date => {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // Monday + 6 days = Sunday
  return sunday;
};

/**
 * Public statistics page - No authentication required
 * Displays job application statistics for portfolio/transparency purposes
 */
export default function ApplicationStatsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Date range state (default to current week: Monday to Sunday)
  const [startDate, setStartDate] = useState<string>(() => {
    return getMonday(new Date()).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return getSunday(new Date()).toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const goToPreviousWeek = () => {
    const currentStart = new Date(startDate);
    currentStart.setDate(currentStart.getDate() - 7);
    const newMonday = getMonday(currentStart);
    const newSunday = getSunday(currentStart);
    setStartDate(newMonday.toISOString().split('T')[0]);
    setEndDate(newSunday.toISOString().split('T')[0]);
  };

  const goToNextWeek = () => {
    const currentStart = new Date(startDate);
    currentStart.setDate(currentStart.getDate() + 7);
    const newMonday = getMonday(currentStart);
    const newSunday = getSunday(currentStart);
    setStartDate(newMonday.toISOString().split('T')[0]);
    setEndDate(newSunday.toISOString().split('T')[0]);
  };

  const goToCurrentWeek = () => {
    setStartDate(getMonday(new Date()).toISOString().split('T')[0]);
    setEndDate(getSunday(new Date()).toISOString().split('T')[0]);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/applications/stats?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();

      if (data.success) {
        setStatsData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !statsData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        Job Application Statistics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && statsData && (
        <>
          {/* Chart - FIRST */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Applications Over Time
            </Typography>
            <Box sx={{ width: '100%', height: 350, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      // Create array of all days in the date range with status breakdown
                      const allDays = [];
                      const current = new Date(startDate);
                      const end = new Date(endDate);

                      while (current <= end) {
                        const dateStr = current.toISOString().split('T')[0];
                        const dayStats = statsData.stats.filter(s => s.date === dateStr);

                        // Get day of week name
                        const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });

                        // Create object with counts for each status
                        interface ChartDayData {
                          date: string;
                          dateStr: string;
                          [key: string]: string | number; // Dynamic keys for each status
                        }

                        const dayData: ChartDayData = {
                          date: `${dayName}\n${current.toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit'
                          })}`,
                          dateStr,
                        };

                        // Initialize all statuses to 0
                        Object.keys(STATUS_CONFIG).forEach(status => {
                          dayData[status] = 0;
                        });

                        // Fill in actual counts
                        dayStats.forEach(stat => {
                          dayData[stat.status] = stat.count;
                        });

                        allDays.push(dayData);
                        current.setDate(current.getDate() + 1);
                      }

                      return allDays;
                    })()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    onClick={(data: any) => {
                      if (data && data.activePayload && data.activePayload[0]) {
                        const clickedDate = data.activePayload[0].payload.dateStr;
                        setSelectedDate(selectedDate === clickedDate ? null : clickedDate);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(25, 118, 210, 0.1)' }} />
                    <Legend />
                    {/* Stacked bars for each status */}
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId="a"
                        fill={config.bg}
                        name={config.label}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Summary Card - SECOND */}
          <Card sx={{ mb: 3, backgroundColor: '#000000', border: '1px solid #ffffff' }}>
            <CardContent>
              <Typography variant="h4" align="center" sx={{ color: '#ffffff' }}>
                {statsData.totalCount}
              </Typography>
              <Typography variant="body1" align="center" sx={{ color: '#ffffff' }}>
                Total Applications
              </Typography>
            </CardContent>
          </Card>
        </>
      )}

      {/* Date Range Controls - LAST */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            Date Range
          </Typography>
          <IconButton
            onClick={fetchStats}
            disabled={loading}
            title="Refresh data"
            size="small"
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Custom Date Range Picker */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={goToCurrentWeek}
            >
              Current Week
            </Button>
          </Grid>
        </Grid>

        {/* Week Navigation */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Button
              variant="outlined"
              onClick={goToPreviousWeek}
            >
              ← Previous Week
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Button
              variant="outlined"
              onClick={goToNextWeek}
            >
              Next Week →
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: "grow" }}>
            <Typography variant="body2" color="text.secondary" align="right">
              {new Date(startDate).toLocaleDateString('de-DE')} - {new Date(endDate).toLocaleDateString('de-DE')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Applications list */}
      {!loading && statsData && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {selectedDate
                  ? `Applications on ${new Date(selectedDate).toLocaleDateString('de-DE')}`
                  : 'All Applications'}
              </Typography>
              {selectedDate && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedDate(null)}
                >
                  Show All
                </Button>
              )}
            </Box>
            {(() => {
              const filteredApps = selectedDate
                ? statsData.applications.filter(app => {
                    const appDate = new Date(app.appliedAt).toISOString().split('T')[0];
                    return appDate === selectedDate;
                  })
                : statsData.applications;

              return filteredApps.length === 0 ? (
                <Typography color="text.secondary">
                  {selectedDate
                    ? 'No applications found for this date.'
                    : 'No applications found in this date range.'}
                </Typography>
              ) : (
                <List>
                  {filteredApps.map((app) => {
                    const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;

                    return (
                      <ListItem
                        key={app.id}
                        divider
                        sx={{
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography component="span" fontWeight="bold">
                                {app.positionTitle}
                              </Typography>
                              <Chip
                                label={statusConfig.label}
                                size="small"
                                sx={{
                                  backgroundColor: statusConfig.bg,
                                  color: statusConfig.text,
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              Applied: {new Date(app.appliedAt).toLocaleDateString('de-DE')}
                              {' • '}
                              <Typography
                                variant="body2"
                                color="primary"
                                component="a"
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textDecoration: 'none' }}
                              >
                                View Job
                              </Typography>
                            </>
                          }
                          secondaryTypographyProps={{
                            component: 'div'
                          }}
                        />
                      </ListItem>
                    );
                  })}
              </List>
              );
            })()}
          </Paper>
      )}
    </Container>
  );
}
