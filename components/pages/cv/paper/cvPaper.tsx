import { EditableText } from "@/components/editableText";
import { usePicture } from "@/hooks/usePicture";
import { useAppSelector } from "@/redux/hooks";
import { getCVPicture } from "@/data";
import { CvSection, CVSettings } from "@/types";
import { Avatar, Box, Grid, useMediaQuery } from "@mui/material";
import { CvSectionComponent } from "../cvSectionComponent";
import { useLocale } from 'next-intl';


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
  originalCv?: CVSettings | null;
  showDiff?: boolean;
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
  onSubSectionAdjusted,
  originalCv,
  showDiff = false
}: CvPaperProps) {
  const locale = useLocale();
  const reduxCv = useAppSelector((state) => state.cv);
  const { imageUrl } = usePicture(() => getCVPicture(locale));
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
                originalText={originalCv?.name}
                showDiff={showDiff && !isPrintVersion}
                sx={{ wordWrap: 'break-word' }}
              />
              <EditableText
                query={["subtitle"]}
                editable={editable}
                variant="body1"
                text={reduxCv.subtitle}
                originalText={originalCv?.subtitle}
                showDiff={showDiff && !isPrintVersion}
                sx={{ wordWrap: 'break-word' }}
              />
            </Box>
          </Box>
          {reduxCv.sideColumn?.map((section, index) => {
            const sectionId = section.id || getSectionKey('sideColumn', index);
            const isRemoved = removedSections.has(sectionId);
            const isModified = modifiedSections.has(sectionId);

            // Skip removed sections in print version
            if (isPrintVersion && isRemoved) {
              return null;
            }

            // Find original section by ID only - no index fallback to avoid misalignment
            const originalSection = section.id ? originalCv?.sideColumn?.find(s => s.id === section.id) : undefined;

            // Check if this is a completely new section (has ID but no match in original)
            const isNewSection = !!(section.id && !originalCv?.sideColumn?.find(s => s.id === section.id));

            return (
              <Box key={section.id || index} mb={2.5}>
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
                  isNew={isNewSection}
                  onRemoveSection={onRemoveSection}
                  onRestoreSection={onRestoreSection}
                  onSectionAdjusted={onSectionAdjusted}
                  sectionKey={sectionId}
                  onRemoveSubSection={onRemoveSubSection}
                  onRestoreSubSection={onRestoreSubSection}
                  onSubSectionAdjusted={onSubSectionAdjusted}
                  removedSubSections={removedSubSections}
                  modifiedSubSections={modifiedSubSections}
                  originalSection={originalSection}
                  showDiff={showDiff && !isPrintVersion}
                />
              </Box>
            );
          })}
        </Box>
      </Grid>
      <Grid size={isResumeDesktop ? 8 : 12} sx={{ textAlign: "left" }}>
        <Box sx={{ p: 2 }}>
          {reduxCv.mainColumn?.map((section, index) => {
            const sectionId = section.id || getSectionKey('mainColumn', index);
            const isRemoved = removedSections.has(sectionId);
            const isModified = modifiedSections.has(sectionId);

            // Skip removed sections in print version
            if (isPrintVersion && isRemoved) {
              return null;
            }

            // Find original section by ID only - no index fallback to avoid misalignment
            const originalSection = section.id ? originalCv?.mainColumn?.find(s => s.id === section.id) : undefined;

            // Check if this is a completely new section (has ID but no match in original)
            const isNewSection = !!(section.id && !originalCv?.mainColumn?.find(s => s.id === section.id));

            return (
              <Box key={section.id || index} sx={{ mt: index === 1 ? 4 : 0 }}>
                <CvSectionComponent
                  sideOrMain="mainColumn"
                  sectionIndex={index}
                  sectionId={sectionId}
                  section={section}
                  editable={editable}
                  isPrintVersion={isPrintVersion}
                  positionDetails={positionDetails}
                  adjustSection={adjustSection}
                  isRemoved={isRemoved}
                  isModified={isModified}
                  isNew={isNewSection}
                  onRemoveSection={onRemoveSection}
                  onRestoreSection={onRestoreSection}
                  onSectionAdjusted={onSectionAdjusted}
                  sectionKey={sectionId}
                  onRemoveSubSection={onRemoveSubSection}
                  onRestoreSubSection={onRestoreSubSection}
                  onSubSectionAdjusted={onSubSectionAdjusted}
                  removedSubSections={removedSubSections}
                  modifiedSubSections={modifiedSubSections}
                  originalSection={originalSection}
                  showDiff={showDiff && !isPrintVersion}
                />
              </Box>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
}

export default CvPaper;
