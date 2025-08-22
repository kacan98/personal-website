'use client'

import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { BRAND_COLORS } from './colors'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
        Something went wrong!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600 }}>
        We&apos;re sorry, but something unexpected happened. Please try refreshing the page or contact us if the problem persists.
      </Typography>
      <Button
        onClick={reset}
        variant="contained"
        sx={{
          backgroundColor: BRAND_COLORS.accent,
          '&:hover': {
            backgroundColor: 'rgba(168, 85, 247, 0.9)',
          },
        }}
      >
        Try again
      </Button>
    </Box>
  )
}