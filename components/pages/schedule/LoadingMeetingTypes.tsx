'use client';

import { Box, Skeleton } from '@mui/material';

export default function LoadingMeetingTypes() {
  return (
    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={200}
          height={160}
          sx={{
            borderRadius: 2,
            animation: 'wave',
          }}
        />
      ))}
    </Box>
  );
}
