import React from "react";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ConditionalWrapper } from "@/components/conditionalWrapper";
import Link from "next/link";

type BulletPoint = {
  icon: React.ElementType;
  text: string;
  url?: string;
};

export type SectionProps = {
  title?: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  contents?: string[];
  subSections?: SubSection[];
  bulletPoints?: BulletPoint[];
};

export type SubSection = {
  title: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  contents: string[];
};

function CvSection({
  title,
  contents,
  subSections,
  bulletPoints,
  subtitles,
}: SectionProps) {
  return (
    <Box textAlign={"left"}>
      {title && (
        <Typography variant="h4" component="div" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">{subtitles.left}</Typography>
          <Typography variant="subtitle1">{subtitles.right}</Typography>
        </Box>
      )}
      {contents &&
        contents.map((content, idx) => (
          <Typography key={idx} variant="body1" gutterBottom>
            {content}
          </Typography>
        ))}
      {bulletPoints &&
        bulletPoints.map((point, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <point.icon />
            </ListItemIcon>
            <ConditionalWrapper
              condition={!!point.url}
              wrapper={(c) => (
                <Link href={point.url!} target={"_blank"}>
                  {c}
                </Link>
              )}
            >
              <ListItemText primary={point.text} />
            </ConditionalWrapper>
          </ListItem>
        ))}
      {subSections && (
        <>
          {subSections.map((section, index) => (
            <div key={index}>
              <Typography variant="h5" component="div" gutterBottom>
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
              {section.contents.map((content, idx) => (
                <Typography key={idx} variant="body1" gutterBottom>
                  {content}
                </Typography>
              ))}
            </div>
          ))}
        </>
      )}
    </Box>
  );
}

export default CvSection;
