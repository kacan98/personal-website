import { useState, useCallback } from 'react';

export interface SessionEvent {
  timestamp: Date;
  action: string;
  details?: Record<string, any>;
  severity: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Tracks all actions performed during the current session
 * Resets on page refresh
 */
export function useSessionLog() {
  const [events, setEvents] = useState<SessionEvent[]>([]);

  const logEvent = useCallback((
    action: string,
    details?: Record<string, any>,
    severity: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const event: SessionEvent = {
      timestamp: new Date(),
      action,
      details,
      severity,
    };
    console.log(`[SessionLog] ${action}`, details);
    setEvents(prev => [...prev, event]);
  }, []);

  const clearLog = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    logEvent,
    clearLog,
  };
}
