'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '@/contexts/AuthContext';
import { APPLICATION_STATUSES, STATUS_CONFIG, ApplicationStatus } from '@/app/db/schema';
import { CVSettings } from '@/types';

interface JobApplication {
  id: number;
  jobUrl: string;
  positionTitle: string;
  companyName: string | null;
  positionDetails: string | null;
  positionSummary: string | null;
  cvData: CVSettings | null;
  motivationalLetter: string | null;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [recentApps, setRecentApps] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recentAppsOpen, setRecentAppsOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    jobUrl: '',
    positionTitle: '',
    companyName: '',
    positionDetails: '',
    positionSummary: '',
    motivationalLetter: '',
    appliedAt: '',
    status: APPLICATION_STATUSES.DRAFT,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/cv');
      return;
    }

    if (!authLoading && isAuthenticated) {
      // Check for pending application data from CV page
      const pendingData = localStorage.getItem('pendingApplication');
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);

          // Get current local time in datetime-local format
          const now = new Date();
          const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);

          setFormData({
            jobUrl: data.jobUrl || '',
            positionTitle: data.positionTitle || '',
            companyName: data.companyName || '',
            positionDetails: data.positionDetails || '',
            positionSummary: data.positionSummary || '',
            motivationalLetter: typeof data.motivationalLetter === 'string'
              ? data.motivationalLetter
              : '',
            appliedAt: localDateTime,
            status: APPLICATION_STATUSES.DRAFT,
          });
          setSelectedApp({
            cvData: data.cvData,
            id: undefined as any,
            jobUrl: '',
            positionTitle: '',
            companyName: null,
            positionDetails: null,
            positionSummary: null,
            motivationalLetter: null,
            appliedAt: '',
            createdAt: '',
            updatedAt: '',
            status: APPLICATION_STATUSES.DRAFT,
          } as Partial<JobApplication> as JobApplication);
          localStorage.removeItem('pendingApplication');
        } catch (err) {
          console.error('Failed to load pending application:', err);
        }
      }
    }

    if (!authLoading && isAuthenticated) {
      fetchRecentApplications();
    }
  }, [authLoading, isAuthenticated]);

  const fetchRecentApplications = async () => {
    try {
      const response = await fetch('/api/applications/recent');
      if (!response.ok) return;

      const data = await response.json();
      if (data.success) {
        setRecentApps(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch recent applications:', err);
    }
  };

  const loadApplication = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/applications/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }

      const data = await response.json();
      if (data.success && data.application) {
        setSelectedApp(data.application);
        setFormData({
          jobUrl: data.application.jobUrl || '',
          positionTitle: data.application.positionTitle || '',
          companyName: data.application.companyName || '',
          positionDetails: data.application.positionDetails || '',
          positionSummary: data.application.positionSummary || '',
          motivationalLetter: data.application.motivationalLetter || '',
          appliedAt: data.application.appliedAt
            ? new Date(data.application.appliedAt).toISOString().slice(0, 16)
            : '',
          status: data.application.status || APPLICATION_STATUSES.DRAFT,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNew = () => {
    setSelectedApp(null);
    setFormData({
      jobUrl: '',
      positionTitle: '',
      companyName: '',
      positionDetails: '',
      positionSummary: '',
      motivationalLetter: '',
      appliedAt: '',
      status: APPLICATION_STATUSES.DRAFT,
    });
    setSuccessMessage(null);
    setError(null);
  };

  const handleDelete = async () => {
    if (!selectedApp?.id) return;

    if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete application (${response.status})`);
      }

      setSuccessMessage('Application deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset to create mode
      handleCreateNew();

      // Refresh the list
      fetchRecentApplications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete application';
      setError(errorMessage);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (statusOverride?: string) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const saveData = {
        ...formData,
        status: statusOverride || formData.status,
      };

      if (selectedApp?.id) {
        // Update existing
        const response = await fetch(`/api/applications/${selectedApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...saveData,
            cvData: selectedApp.cvData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to update application (${response.status})`);
        }

        const data = await response.json();
        if (data.success) {
          setSuccessMessage('Application updated successfully!');
          setSelectedApp(data.application);
          fetchRecentApplications();

          // Auto-dismiss success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } else {
        // Create new
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...saveData,
            jobUrl: saveData.jobUrl || 'https://placeholder.com',
            positionTitle: saveData.positionTitle || 'Untitled',
            cvData: selectedApp?.cvData || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to create application (${response.status})`);
        }

        const data = await response.json();
        if (data.success) {
          setSuccessMessage('Application created successfully!');
          setSelectedApp(data.application);
          fetchRecentApplications();

          // Auto-dismiss success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save application';
      setError(errorMessage);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isEditMode = selectedApp?.id !== undefined;

  return (
    <>
      {/* Fixed Error/Success Messages */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: 400,
            maxWidth: 600,
            boxShadow: 3
          }}
        >
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: 400,
            maxWidth: 600,
            boxShadow: 3
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Box sx={{ minHeight: '100vh' }}>
        {/* Top Navigation Bar */}
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            boxShadow: 1,
          }}
        >
          <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant={recentAppsOpen ? "contained" : "outlined"}
                  onClick={() => setRecentAppsOpen(!recentAppsOpen)}
                  size="medium"
                >
                  Applications
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BarChartIcon />}
                  onClick={() => window.open('/applications/stats', '_blank')}
                  size="medium"
                >
                  Stats
                </Button>
                {isEditMode && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                    size="medium"
                  >
                    New
                  </Button>
                )}
              </Box>
            </Box>

            <Collapse in={recentAppsOpen}>
              <Box sx={{ py: 2 }}>
                {recentApps.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No applications yet
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: 1,
                    }}
                  >
                    {recentApps.map((app) => {
                      const appliedDate = app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                        : 'No date';

                      return (
                        <Paper
                          key={app.id}
                          elevation={selectedApp?.id === app.id ? 3 : 1}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: selectedApp?.id === app.id ? 'action.selected' : 'background.paper',
                            '&:hover': {
                              elevation: 3,
                              backgroundColor: 'action.hover',
                            },
                          }}
                          onClick={() => loadApplication(app.id)}
                        >
                          <Typography variant="subtitle2" fontWeight="bold" noWrap>
                            {app.positionTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                            {app.companyName || 'No company'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                            {appliedDate}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Collapse>
          </Container>
        </Box>

      {/* Main Content - Centered Form */}
      <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          {isEditMode ? `Edit: ${selectedApp.positionTitle}` : 'New Job Application'}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Info */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Position Title"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                />
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Acme Corp"
                />
                <TextField
                  fullWidth
                  label="Job URL"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
                <TextField
                  fullWidth
                  label="Date Applied"
                  name="appliedAt"
                  type="datetime-local"
                  value={formData.appliedAt}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                  >
                    {Object.values(APPLICATION_STATUSES).map((value) => (
                      <MenuItem key={value} value={value}>
                        {STATUS_CONFIG[value as ApplicationStatus].label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* Summary */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Position Summary
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                name="positionSummary"
                value={formData.positionSummary}
                onChange={handleInputChange}
                placeholder="Quick summary of the role..."
                sx={{ mt: 2 }}
              />
            </Paper>

            {/* Job Description */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Full Job Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                name="positionDetails"
                value={formData.positionDetails}
                onChange={handleInputChange}
                placeholder="Paste the full job description here..."
                sx={{ mt: 2 }}
              />
            </Paper>

            {/* Motivational Letter */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Motivational Letter
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                name="motivationalLetter"
                value={formData.motivationalLetter}
                onChange={handleInputChange}
                placeholder="Your motivational letter..."
                sx={{ mt: 2 }}
              />
            </Paper>

            {/* CV Data */}
            {selectedApp?.cvData && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  CV Snapshot (Read-only)
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    maxHeight: 400,
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e',
                    mt: 2,
                  }}
                >
                  <pre style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#d4d4d4',
                    fontFamily: 'Consolas, Monaco, monospace'
                  }}>
                    {JSON.stringify(selectedApp.cvData, null, 2)}
                  </pre>
                </Paper>
              </Paper>
            )}

          </Box>
        )}
      </Container>

      {/* Sticky Action Buttons at Bottom */}
      {!loading && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {isEditMode && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={loading || saving}
              size="large"
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave()}
            disabled={saving}
            size="large"
            sx={{ minWidth: 120 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
    </Box>
    </>
  );
}
