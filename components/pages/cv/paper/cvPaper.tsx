import { EditableText } from "@/components/editableText";
import { usePicture } from "@/hooks/usePicture";
import { useAppSelector } from "@/redux/hooks";
import { getCVPicture } from "@/sanity/sanity-utils";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import { Avatar, Box, Paper } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { CvSectionComponent } from "../cvSectionComponent";


type CvPaperProps = {
  editable?: boolean;
  isPrintVersion?: boolean;
  positionDetails?: string;
  adjustSection?: (section: CvSection, positionDescription: string, sectionType?: 'experience' | 'education' | 'skills' | 'other') => Promise<CvSection | null>;
  removedSections?: Set<string>;
  modifiedSections?: Set<string>;
  onRemoveSection?: (sectionKey: string) => void;
  onRestoreSection?: (sectionKey: string) => void;
  onSectionAdjusted?: (sectionKey: string) => void;
  removedSubSections?: Set<string>;
  modifiedSubSections?: Set<string>;
  onRemoveSubSection?: (subSectionKey: string) => void;
  onRestoreSubSection?: (subSectionKey: string) => void;
  onSubSectionAdjusted?: (subSectionKey: string) => void;
};

export function CvPaper({
  editable,
  isPrintVersion = false,
  positionDetails,
  adjustSection,
  removedSections = new Set(),
  modifiedSections = new Set(),
  onRemoveSection,
  onRestoreSection,
  onSectionAdjusted,
  onRemoveSubSection,
  onRestoreSubSection,
  onSubSectionAdjusted
}: CvPaperProps) {
  const reduxCv = useAppSelector((state) => state.cv);
  const { imageUrl } = usePicture(getCVPicture);

  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number) => {
    return `${columnType}-${index}`;
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} sm={4}>
        <Box display="flex" flexDirection="column" alignItems="left">
          <Grid2
            container
            alignItems="left"
            direction="column"
            textAlign="left"
          >
            {imageUrl && <Avatar
              src={imageUrl}
              sx={{ width: 100, height: 100, marginBottom: "15px" }}
            />}
            <EditableText query={["name"]} editable={editable} variant="h4" component="div" text={reduxCv.name} />
            <EditableText query={["subtitle"]} editable={editable} variant="body1" pb={2} text={reduxCv.subtitle} />
          </Grid2>
          {reduxCv.sideColumn?.map((section, index) => {
            const sectionKey = getSectionKey('sideColumn', index);
            const isRemoved = removedSections.has(sectionKey);
            const isModified = modifiedSections.has(sectionKey);

            return (
              <Box key={index} mb={2}>
                <CvSectionComponent
                  sideOrMain="sideColumn"
                  sectionIndex={index}
                  section={section}
                  editable={editable}
                  isPrintVersion={isPrintVersion}
                  positionDetails={positionDetails}
                  adjustSection={adjustSection}
                  isRemoved={isRemoved}
                  isModified={isModified}
                  onRemoveSection={onRemoveSection}
                  onRestoreSection={onRestoreSection}
                  onSectionAdjusted={onSectionAdjusted}
                  sectionKey={sectionKey}
                  onRemoveSubSection={onRemoveSubSection}
                  onRestoreSubSection={onRestoreSubSection}
                  onSubSectionAdjusted={onSubSectionAdjusted}
                />
              </Box>
            );
          })}
        </Box>
      </Grid2>
      <Grid2 xs={12} md={8} textAlign="left">
        {reduxCv.mainColumn?.map((section, index) => {
          const sectionKey = getSectionKey('mainColumn', index);
          const isRemoved = removedSections.has(sectionKey);
          const isModified = modifiedSections.has(sectionKey);

          return (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>              <CvSectionComponent
              sideOrMain="mainColumn"
              sectionIndex={index}
              section={section}
              editable={editable}
              isPrintVersion={isPrintVersion}
              positionDetails={positionDetails}
              adjustSection={adjustSection}
              isRemoved={isRemoved}
              isModified={isModified}
              onRemoveSection={onRemoveSection}
              onRestoreSection={onRestoreSection}
              onSectionAdjusted={onSectionAdjusted}
              sectionKey={sectionKey}
              onRemoveSubSection={onRemoveSubSection}
              onRestoreSubSection={onRestoreSubSection}
              onSubSectionAdjusted={onSubSectionAdjusted}
            />
            </Paper>
          );
        })}
      </Grid2>
    </Grid2>

  );
}

export default CvPaper;
