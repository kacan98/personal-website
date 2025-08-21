import { EditableText } from "@/components/editableText";
import { usePicture } from "@/hooks/usePicture";
import { useAppSelector } from "@/redux/hooks";
import { getCVPicture } from "@/sanity/sanity-utils";
import { CvSection } from "@/sanity/schemaTypes/singletons/cvSettings";
import { Avatar, Box, Grid, Paper } from "@mui/material";
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
  removedSubSections = new Set(),
  modifiedSubSections = new Set(),
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
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          sm: 4
        }}>
        <Box display="flex" flexDirection="column" alignItems="left">
          <Grid
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
          </Grid>
          {reduxCv.sideColumn?.map((section, index) => {
            const sectionKey = getSectionKey('sideColumn', index);
            const isRemoved = removedSections.has(sectionKey);
            const isModified = modifiedSections.has(sectionKey);

            // Skip removed sections in print version
            if (isPrintVersion && isRemoved) {
              return null;
            }

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
                  removedSubSections={removedSubSections}
                  modifiedSubSections={modifiedSubSections}
                />
              </Box>
            );
          })}
        </Box>
      </Grid>
      <Grid
        textAlign="left"
        size={{
          xs: 12,
          md: 8
        }}>
        {reduxCv.mainColumn?.map((section, index) => {
          const sectionKey = getSectionKey('mainColumn', index);
          const isRemoved = removedSections.has(sectionKey);
          const isModified = modifiedSections.has(sectionKey);

          // Skip removed sections in print version
          if (isPrintVersion && isRemoved) {
            return null;
          }

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
              removedSubSections={removedSubSections}
              modifiedSubSections={modifiedSubSections}
            />
            </Paper>
          );
        })}
      </Grid>
    </Grid>
  );
}

export default CvPaper;
