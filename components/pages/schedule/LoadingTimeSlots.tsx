'use client';

import { Skeleton, Grid } from '@mui/material';

export default function LoadingTimeSlots() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 12 }).map((_, index) => (
        <Grid size={{ xs: 6 }} key={index}>
          <Skeleton
            variant="rectangular"
            height={42}
            sx={{
              borderRadius: 1,
              animation: 'wave',
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
