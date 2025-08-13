import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{
          opacity: 0.7,
        }}
      >
        © Karel Čančara {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}