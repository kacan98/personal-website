import { Box, Typography, Link } from "@mui/material";
import { BACKGROUND_COLORS } from "@/app/colors";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: BACKGROUND_COLORS.surface + 'cc',
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
        © <Link 
            href="https://www.linkedin.com/in/kcancara" 
            target="_blank" 
            rel="noopener noreferrer"
            color="inherit"
            underline="hover"
            sx={{ opacity: 0.9 }}
          >
            Karel Čančara
          </Link> {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}