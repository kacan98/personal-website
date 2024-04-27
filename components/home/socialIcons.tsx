import { Box, Grid, IconButton } from "@mui/material";
import { Facebook, GitHub, Instagram, LinkedIn } from "@mui/icons-material";

type SocialProps = {
  direction?: "row" | "column";
};

const SocialIcons = ({ direction }: SocialProps) => (
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      right: 0,
      p: 2,
    }}
  >
    <Grid container spacing={2} direction={direction}>
      {[
        { href: "https://github.com/yourusername", Icon: GitHub },
        { href: "https://facebook.com/yourusername", Icon: Facebook },
        { href: "https://instagram.com/yourusername", Icon: Instagram },
        { href: "https://linkedin.com/in/yourusername", Icon: LinkedIn },
      ].map(({ href, Icon }) => (
        <Grid item key={href}>
          <IconButton color="inherit" href={href} target="_blank">
            <Icon />
          </IconButton>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default SocialIcons;
