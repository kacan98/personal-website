'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';

interface MeetingType {
  id: number;
  name: string;
  duration: number;
  description: string;
  color: string;
}

interface MeetingTypeStepProps {
  meetingTypes: MeetingType[];
  onSelect: (type: MeetingType) => void;
}

export default function MeetingTypeStep({ meetingTypes, onSelect }: MeetingTypeStepProps) {
  return (
    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
      {meetingTypes.map((type) => (
        <Card
          key={type.id}
          onClick={() => onSelect(type)}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: 200,
            textAlign: 'center',
            border: '2px solid transparent',
            '&:hover': {
              transform: 'translateY(-4px)',
              border: `2px solid ${type.color}`,
              boxShadow: `0 8px 24px ${type.color}40`,
            },
          }}
        >
          <CardContent sx={{ py: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: type.color,
                mb: 1,
              }}
            >
              {type.duration}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              minutes
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
