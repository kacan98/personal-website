import { Box, Grid, IconButton, Tooltip, Zoom } from "@mui/material";
import { getSocials } from "@/sanity/sanity-utils";
import { SUPPORTED_ICONS } from "@/components/icon";

type SocialProps = {
  direction?: "row" | "column";
};

const SocialIcons = async ({ direction }: SocialProps) => {
  const socials = await getSocials();
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        p: 2,
      }}
    >
      <Grid container spacing={2} direction={direction}>
        {socials.map(({ url, iconName, title }) => (
          <Tooltip
            TransitionComponent={Zoom}
            placement="left"
            key={url}
            title={title}
            arrow
          >
            <Grid item>
              <IconButton href={url} target="_blank">
                {SUPPORTED_ICONS[iconName]?.component()}
              </IconButton>
            </Grid>
          </Tooltip>
        ))}
      </Grid>
    </Box>
  );
};

export default SocialIcons;
