import { EditableText } from "@/components/editableText";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import { Box } from "@mui/material";

export const CvSubSection = ({
    section,
    editable,
    baseQuery,
}: {
    baseQuery: string;
    editable?: boolean;
    section: CvSection
}) => {
    return (
        <>
            <EditableText query={[...baseQuery, 'title']} editable={editable} variant="h5" gutterBottom text={section.title} />
            {section.subtitles && (
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <EditableText query={[...baseQuery, 'subtitle', 'left']} editable={editable} variant="subtitle1" text={section.subtitles.left} />
                    <EditableText query={[...baseQuery, 'subtitle', 'right']} editable={editable} variant="subtitle1" text={section.subtitles.right} />
                </Box>
            )}
            {section.paragraphs &&
                section.paragraphs.map((paragraph, idx) => (
                    <EditableText query={[...baseQuery, 'paragraphs', idx]} editable={editable} key={idx} variant="body1" gutterBottom text={paragraph} />
                ))}
        </>
    )
}