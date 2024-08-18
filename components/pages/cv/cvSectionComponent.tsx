import { ConditionalWrapper } from "@/components/conditionalWrapper";
import { SUPPORTED_ICONS } from "@/components/icon";
import { CvSection } from "@/sanity/schemaTypes/cv/cvSection";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

function CvSectionComponent({
  title,
  paragraphs,
  subSections,
  bulletPoints,
  subtitles,
}: CvSection) {
  return (
    <Box textAlign={"left"}>
      {title && (
        <Typography variant="h4" mb={1}>
          {title}
        </Typography>
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">{subtitles.left}</Typography>
          <Typography variant="subtitle1">{subtitles.right}</Typography>
        </Box>
      )}
      {paragraphs &&
        paragraphs.map((paragraph, idx) => (
          <Typography key={idx} variant="body1" gutterBottom>
            {paragraph}
          </Typography>
        ))}
      {bulletPoints &&
        bulletPoints.map((point, idx) => (
          <ListItem key={idx}>
            <ConditionalWrapper
              condition={!!point.url}
              wrapper={(c) =>
                point.url!.startsWith("mailto:") ? (
                  <a href={point.url!}>{c}</a>
                ) : (
                  <a href={point.url!} target="_blank" rel="noreferrer">
                    {c}
                  </a>
                )
              }
            >
              <Grid2 container spacing={2} alignItems="center" wrap={"nowrap"}>
                <ListItemIcon>
                  {SUPPORTED_ICONS[point.iconName]?.component()}
                </ListItemIcon>

                <ListItemText primary={point.text} />
              </Grid2>
            </ConditionalWrapper>
          </ListItem>
        ))}
      {subSections && (
        <>
          {subSections.map((section, index) => (
            <div key={index}>
              <Typography variant="h5" gutterBottom>
                {section.title}
              </Typography>
              {section.subtitles && (
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1">
                    {section.subtitles.left}
                  </Typography>
                  <Typography variant="subtitle1">
                    {section.subtitles.right}
                  </Typography>
                </Box>
              )}
              {section.paragraphs &&
                section.paragraphs.map((paragraph, idx) => (
                  <Typography key={idx} variant="body1" gutterBottom>
                    {paragraph}
                  </Typography>
                ))}
            </div>
          ))}
        </>
      )}
    </Box>
  );
}

export default CvSectionComponent;
