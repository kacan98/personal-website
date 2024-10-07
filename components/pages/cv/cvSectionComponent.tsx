import { ConditionalWrapper } from "@/components/conditionalWrapper";
import { EditableText, EditableTextProps } from "@/components/editableText";
import { SUPPORTED_ICONS } from "@/components/icon";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

export function CvSectionComponent({
  sectionIndex,
  editable,
  sideOrMain,
  section
}: { editable?: boolean; sectionIndex: number; sideOrMain: "mainColumn" | "sideColumn"; section: CvSection }) {
  const { title, subtitles, paragraphs, bulletPoints, subSections } = section;
  const SuperEditableText = ({ query, ...props }: EditableTextProps) => {
    return <EditableText {...props} query={[sideOrMain, sectionIndex, ...query]} editable={editable} />;
  }

  return (
    <Box textAlign={"left"}>
      {title && (
        <SuperEditableText query={["title"]} variant="h4" mb={1} text={title} />
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <SuperEditableText query={['subtitles', 'left']} variant="subtitle1" text={subtitles.left} />
          <SuperEditableText query={["subtitles", "right"]} variant="subtitle1" text={subtitles.right} />
        </Box>
      )}
      {paragraphs &&
        paragraphs.map((paragraph, idx) => (
          <SuperEditableText query={['paragraphs', idx]} key={idx} variant="body1" gutterBottom text={paragraph} />
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

                <ListItemText><SuperEditableText query={['bulletpoints', idx, 'text']} text={point.text} /></ListItemText>
              </Grid2>
            </ConditionalWrapper>
          </ListItem>
        ))}
      {subSections && (subSections.map((section, index) => (
        //TODO: Move this to cvSubSection.tsx
        <div key={index}>
          <SuperEditableText query={['subSections', index, 'title']} editable={editable} variant="h5" gutterBottom text={section.title} />
          {section.subtitles && (
            <Box display="flex" justifyContent="space-between" mb={2}>
              <SuperEditableText query={['subSections', index, 'subtitles', 'left']} editable={editable} variant="subtitle1" text={section.subtitles.left} />
              <SuperEditableText query={['subSections', index, 'subtitles', 'right']} editable={editable} variant="subtitle1" text={section.subtitles.right} />
            </Box>
          )}
          {section.paragraphs &&
            section.paragraphs.map((paragraph, idx) => (
              <SuperEditableText query={['subSections', index, 'paragraphs', idx]} key={idx} editable={editable} variant="body1" gutterBottom text={paragraph} />
            ))}
        </div>
      ))
      )}
    </Box>
  );
}

