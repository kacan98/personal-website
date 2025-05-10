import { EditableText, EditableTextProps } from "@/components/editableText";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import {
  Box
} from "@mui/material";
import { CvBulletPoint } from "./bulletPoint";

export function CvSectionComponent({
  sectionIndex,
  editable,
  sideOrMain,
  section,
  isPrintVersion = false
}: { editable?: boolean; sectionIndex: number; sideOrMain: "mainColumn" | "sideColumn"; section: CvSection; isPrintVersion: boolean}) {
  const { title, subtitles, paragraphs, bulletPoints, subSections} = section;
  const SuperEditableText = ({ query, ...props }: EditableTextProps) => {
    return <EditableText {...props} query={[sideOrMain, sectionIndex, ...query]} editable={editable} />;
  }

  return (
    <Box textAlign={"left"}>
      {title && (
        <SuperEditableText query={["title"]} variant="h4" mb={1} text={title} />
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={0}>
          <SuperEditableText query={['subtitles', 'left']} variant="subtitle1" text={subtitles.left} />
          <SuperEditableText query={["subtitles", "right"]} variant="subtitle1" text={subtitles.right} />
        </Box>
      )}
      {paragraphs &&
        paragraphs.map((paragraph, idx) => (
          <SuperEditableText query={['paragraphs', idx]} key={idx} variant="body1" gutterBottom text={paragraph} />
        ))}
      {bulletPoints &&
        bulletPoints.map((point, idx) => {
          if (!point.text) return <></>
          return (<CvBulletPoint bulletPoint={point} key={idx} editable={editable} baseQuery={[sideOrMain, sectionIndex, 'bulletPoints', idx]} isPrintVersion={isPrintVersion} />)
        }
        )}
      {subSections && (subSections.map((section, index) => (
        //TODO: Move this to cvSubSection.tsx
        <Box key={index} mb={2}>
          <SuperEditableText query={['subSections', index, 'title']} editable={editable} variant="h5" text={section.title} />
          {section.subtitles && (
            <Box display="flex" justifyContent="space-between" pb={1}>
              <SuperEditableText query={['subSections', index, 'subtitles', 'left']} editable={editable} variant="subtitle1" text={section.subtitles.left} />
              <SuperEditableText query={['subSections', index, 'subtitles', 'right']} editable={editable} variant="subtitle1" text={section.subtitles.right} />
            </Box>
          )}
          {section.paragraphs &&
            section.paragraphs.map((paragraph, idx) => (
              <SuperEditableText query={['subSections', index, 'paragraphs', idx]} key={idx} editable={editable} variant="body1" gutterBottom text={paragraph} />
            ))}
          {section.bulletPoints && section.bulletPoints.map((point, idx) => {
            if (!point.text) return <></>
            return (<CvBulletPoint bulletPoint={point} key={idx} editable={editable} baseQuery={[sideOrMain, sectionIndex, 'bulletPoints', idx]} isPrintVersion={isPrintVersion} />)
          })
          }
        </Box>
      ))
      )}
    </Box>
  );
}

