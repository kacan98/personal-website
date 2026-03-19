import { Box, Typography, Link } from "@mui/material";
import { BACKGROUND_COLORS } from "@/app/colors";
import { settings } from "@/data/settings";

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
            href={settings.linkedinUrl || undefined}
            target={settings.linkedinUrl ? "_blank" : undefined}
            rel={settings.linkedinUrl ? "noopener noreferrer" : undefined}
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