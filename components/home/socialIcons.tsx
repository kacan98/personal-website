import { Box, Grid, IconButton, Tooltip, Zoom } from "@mui/material";
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
        {
          href: "https://github.com/kacan98",
          Icon: GitHub,
          text: "See my projects",
        },
        {
          href: "https://www.linkedin.com/in/kcancara",
          Icon: LinkedIn,
          text: "Let's connect",
        },
        {
          href: "mailto:karel.cancara@gmail.com",
          Icon: Email,
          text: "Send me an email!",
        },
      ].map(({ href, Icon, text }) => (
        <Tooltip
          TransitionComponent={Zoom}
          placement="left"
          key={href}
          title={text}
          arrow
        >
          <Grid item>
            <IconButton href={href} target="_blank">
              <Icon />
            </IconButton>
          </Grid>
        </Tooltip>
      ))}
    </Grid>
  </Box>
);

export default SocialIcons;
