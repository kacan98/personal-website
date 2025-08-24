import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import { BRAND_COLORS } from './colors'

export default function NotFound() {
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
      <Typography 
        variant="h1" 
        sx={{ 
          mb: 2, 
          fontSize: { xs: '4rem', md: '6rem' },
          fontWeight: 700,
          color: BRAND_COLORS.accent,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track.
      </Typography>
      <Link href="/en" passHref>
        <Button
          variant="contained"
          sx={{
            backgroundColor: BRAND_COLORS.accent,
            '&:hover': {
              backgroundColor: 'rgba(168, 85, 247, 0.9)',
            },
          }}
        >
          Back to Home
        </Button>
      </Link>
    </Box>
  )
}