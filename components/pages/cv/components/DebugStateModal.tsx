import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { CVSettings } from '@/types';

interface SessionEvent {
  timestamp: Date;
  action: string;
  details?: Record<string, any>;
  severity: 'info' | 'success' | 'warning' | 'error';
}

interface DebugStateModalProps {
  open: boolean;
  onClose: () => void;
  currentCv: CVSettings | null;
  originalCv: CVSettings | null;
  hasChanges: boolean;
  pageState?: Record<string, any>;
  sessionEvents?: SessionEvent[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function DebugStateModal({
  open,
  onClose,
  currentCv,
  originalCv,
  hasChanges,
  pageState = {},
  sessionEvents = [],
}: DebugStateModalProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isDeepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return obj1 === obj2;
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const findChangedFields = (original: any, current: any, path = ''): string[] => {
    const changes: string[] = [];
    if (!original || !current) return changes;

    const allKeys = new Set([
      ...Object.keys(original || {}),
      ...Object.keys(current || {}),
    ]);

    for (const key of allKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      const origVal = original?.[key];
      const currVal = current?.[key];

      if (!isDeepEqual(origVal, currVal)) {
        if (typeof origVal === 'object' && typeof currVal === 'object') {
          changes.push(...findChangedFields(origVal, currVal, fullPath));
        } else {
          changes.push(fullPath);
        }
      }
    }

    return changes;
  };

  const changedFields = originalCv && currentCv ? findChangedFields(originalCv, currentCv) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>Debug State Inspector</Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={hasChanges ? '✓ Has Changes' : 'No Changes'}
            color={hasChanges ? 'success' : 'default'}
            size="small"
          />
          {originalCv && currentCv && changedFields.length > 0 && (
            <Chip
              label={`${changedFields.length} fields changed`}
              color="warning"
              size="small"
            />
          )}
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Current CV" />
          <Tab label="Original CV" />
          <Tab label="Data Changes" />
          <Tab label="State Variables" />
          <Tab label="Session Log" />
        </Tabs>

        {/* Current State Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Current Redux CV State
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                color: '#000',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {currentCv ? JSON.stringify(currentCv, null, 2) : 'No current CV'}
            </Paper>
          </Box>
        </TabPanel>

        {/* Original State Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Original CV State
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                color: '#000',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {originalCv ? JSON.stringify(originalCv, null, 2) : 'No original CV'}
            </Paper>
          </Box>
        </TabPanel>

        {/* Changes Summary Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Changed Fields
            </Typography>
            {changedFields.length === 0 ? (
              <Typography color="textSecondary">No differences detected</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {changedFields.map((field) => (
                  <Paper key={field} sx={{ p: 1.5, backgroundColor: '#fff3cd' }}>
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {field}
                      </Typography>
                      <Box sx={{ mt: 0.5, fontSize: '0.85rem', color: 'text.secondary' }}>
                        <div>Original: {JSON.stringify(originalCv ? getNestedValue(originalCv, field) : null)}</div>
                        <div>Current: {JSON.stringify(currentCv ? getNestedValue(currentCv, field) : null)}</div>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Page Variables Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Page State Variables
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                color: '#000',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {Object.keys(pageState).length === 0 ? (
                'No page state provided'
              ) : (
                JSON.stringify(pageState, null, 2)
              )}
            </Paper>
          </Box>
        </TabPanel>

        {/* Session Log Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Session Activity Log (This Session Only)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sessionEvents.length === 0 ? (
                <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  No events yet. Actions performed on this page will appear here.
                </Typography>
              ) : (
                sessionEvents.map((event, idx) => {
                  const severityColor = {
                    success: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
                    info: { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
                    warning: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
                    error: { bg: '#ffebee', border: '#f44336', text: '#c62828' },
                  };
                  const colors = severityColor[event.severity];
                  const icon = {
                    success: '✓',
                    info: 'ℹ',
                    warning: '⚠',
                    error: '✕',
                  }[event.severity];

                  return (
                    <Paper
                      key={idx}
                      sx={{
                        p: 1.5,
                        backgroundColor: colors.bg,
                        borderLeft: `4px solid ${colors.border}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                            {icon} {event.action}
                          </Typography>
                          {event.details && (
                            <Typography variant="caption" sx={{ color: colors.text, display: 'block', mt: 0.5 }}>
                              {Object.entries(event.details)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(' • ')}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, whiteSpace: 'nowrap' }}>
                          {event.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
        <Button
          onClick={() => {
            const data = {
              currentCv,
              originalCv,
              hasChanges,
              changedFields,
              pageState,
              timestamp: new Date().toISOString(),
            };
            // Copy to clipboard
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert('State copied to clipboard!');
          }}
          variant="outlined"
        >
          Copy to Clipboard
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
