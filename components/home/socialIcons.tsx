'use client';

import { Box, Grid, IconButton, Tooltip, Zoom } from "@mui/material";
import { SUPPORTED_ICONS } from "@/components/icon";
import { Link } from "@/types";

type SocialProps = {
  direction?: "row" | "column";
  socials: Link[];
};

const SocialIcons = ({ direction, socials }: SocialProps) => {
  return (    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000, // Below navbar but above page content
        p: 2,
      }}
    >
      <Grid container spacing={2} direction={direction}>
        {socials &&
          socials.map(({ url, iconName, title }: Link) => (
            <Tooltip
              TransitionComponent={Zoom}
              placement="left"
              key={url}
              title={title}
              arrow
            >
              <Grid>
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
