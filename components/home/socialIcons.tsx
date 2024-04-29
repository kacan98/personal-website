import { Box, Grid, IconButton } from "@mui/material";
import { Email, GitHub, LinkedIn } from "@mui/icons-material";

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
        { href: "https://github.com/kacan98", Icon: GitHub },
        { href: "https://www.linkedin.com/in/kcancara", Icon: LinkedIn },
        { href: "karel.cancara@gmail.com", Icon: Email },
      ].map(({ href, Icon }) => (
        <Grid item key={href}>
          <IconButton href={href} target="_blank">
            <Icon />
          </IconButton>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default SocialIcons;
