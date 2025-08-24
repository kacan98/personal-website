import { EditableText } from "@/components/editableText";
import { usePicture } from "@/hooks/usePicture";
import { useAppSelector } from "@/redux/hooks";
import { getCVPicture } from "@/data-utils";
import { CvSection } from "@/types";
import { Avatar, Box, Grid, Paper, useMediaQuery } from "@mui/material";
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
  // Custom breakpoint at 800px - we'll call it "resume breakpoint"
  // For print version, always use desktop layout regardless of media query
  const mediaQueryResult = useMediaQuery('(min-width:700px)');
  const isResumeDesktop = isPrintVersion ? true : mediaQueryResult;

  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number) => {
    return `${columnType}-${index}`;
  };


  return (
    <Grid container spacing={0}>
      <Grid size={isResumeDesktop ? 4 : 12}>
        <Box display="flex" flexDirection="column" alignItems="left" sx={{ p: 2, pr: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={3}
            sx={{
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {imageUrl && <Avatar
              src={imageUrl}
              sx={{ 
                width: 70, 
                height: 70,
                flexShrink: 0
              }}
            />}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <EditableText 
                query={["name"]} 
                editable={editable} 
                variant="h4" 
                component="div" 
                text={reduxCv.name}
                sx={{ wordWrap: 'break-word' }}
              />
              <EditableText 
                query={["subtitle"]} 
                editable={editable} 
                variant="body1" 
                text={reduxCv.subtitle}
                sx={{ wordWrap: 'break-word' }}
              />
            </Box>
          </Box>
          {reduxCv.sideColumn?.map((section, index) => {
            const sectionKey = getSectionKey('sideColumn', index);
            const isRemoved = removedSections.has(sectionKey);
            const isModified = modifiedSections.has(sectionKey);

            // Skip removed sections in print version
            if (isPrintVersion && isRemoved) {
              return null;
            }

            return (
              <Box key={index} mb={2.5}>
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
      <Grid size={isResumeDesktop ? 8 : 12} sx={{ textAlign: "left" }}>
        {reduxCv.mainColumn?.map((section, index) => {
          const sectionKey = getSectionKey('mainColumn', index);
          const isRemoved = removedSections.has(sectionKey);
          const isModified = modifiedSections.has(sectionKey);

          // Skip removed sections in print version
          if (isPrintVersion && isRemoved) {
            return null;
          }

          return (
            <Paper key={index} sx={{ p: 2, mb: 3 }}>
              <CvSectionComponent
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
