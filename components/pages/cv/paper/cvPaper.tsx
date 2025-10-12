import { EditableText } from "@/components/editableText";
import { usePicture } from "@/hooks/usePicture";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { getCVPicture } from "@/data/images";
import { CvSection, CVSettings } from "@/types";
import { Avatar, Box, Grid, useMediaQuery } from "@mui/material";
import { CvSectionComponent } from "../cvSectionComponent";
import { useLocale } from 'next-intl';
import { getMergedSectionsForRendering } from "../utils/cvDiffAnalyzer";


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
  const _dispatch = useAppDispatch();
  const { imageUrl } = usePicture(() => getCVPicture(locale));
  // Custom breakpoint at 800px - we'll call it "CV breakpoint"
  // For print version, always use desktop layout regardless of media query
  const mediaQueryResult = useMediaQuery('(min-width:700px)');
  const isCvDesktop = isPrintVersion ? true : mediaQueryResult;

  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number) => {
    return `${columnType}-${index}`;
  };



  return (
    <Grid container spacing={0} sx={{
      '@media print': {
        overflow: 'visible',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }
    }}>
      <Grid size={isCvDesktop ? 4 : 12}>
        <Box display="flex" flexDirection="column" alignItems="left" sx={{
          pr: 1,
          '@media print': { overflow: 'visible' }
        }}>
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
          {(() => {
            // Get merged sections including deleted ones for diff viewing
            const mergedSections = originalCv && showDiff
              ? getMergedSectionsForRendering(originalCv.sideColumn || [], reduxCv.sideColumn || [], 'sideColumn')
              : (reduxCv.sideColumn || []).map((section, index) => ({
                section,
                sectionId: section.id || getSectionKey('sideColumn', index),
                isDeleted: false,
                isFromOriginal: false
              }));

            return mergedSections.map(({ section, sectionId, isDeleted }, renderIndex) => {
              const isRemoved = isDeleted || removedSections.has(sectionId);
              const isModified = !isDeleted && modifiedSections.has(sectionId);

              // Skip removed sections in print version
              if (isPrintVersion && isRemoved) {
                return null;
              }

              // Find original section by index position for simpler matching
              const currentIndex = reduxCv.sideColumn?.findIndex(s => s === section) ?? -1;
              const originalSection = currentIndex >= 0 ? originalCv?.sideColumn?.[currentIndex] : undefined;

              // Check if this is a completely new section (doesn't exist at this index in original)
              const isNewSection = !isDeleted && currentIndex >= (originalCv?.sideColumn?.length ?? 0);

              return (
                <Box key={sectionId || renderIndex} mb={1}>
                  <CvSectionComponent
                    sideOrMain="sideColumn"
                    sectionIndex={renderIndex}
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
            });
          })()}

        </Box>
      </Grid>
      <Grid size={isCvDesktop ? 8 : 12} sx={{ textAlign: "left" }}>
        <Box sx={{
          pl: 1,
          '@media print': { overflow: 'visible' }
        }}>
          {(() => {
            // Get merged sections including deleted ones for diff viewing
            const mergedSections = originalCv && showDiff
              ? getMergedSectionsForRendering(originalCv.mainColumn || [], reduxCv.mainColumn || [], 'mainColumn')
              : (reduxCv.mainColumn || []).map((section, index) => ({
                section,
                sectionId: section.id || getSectionKey('mainColumn', index),
                isDeleted: false,
                isFromOriginal: false
              }));

            return mergedSections.map(({ section, sectionId, isDeleted }, renderIndex) => {
              const isRemoved = isDeleted || removedSections.has(sectionId);
              const isModified = !isDeleted && modifiedSections.has(sectionId);

              // Skip removed sections in print version
              if (isPrintVersion && isRemoved) {
                return null;
              }

              // Find original section by index position for simpler matching
              const currentIndex = reduxCv.mainColumn?.findIndex(s => s === section) ?? -1;
              const originalSection = currentIndex >= 0 ? originalCv?.mainColumn?.[currentIndex] : undefined;

              // Check if this is a completely new section (doesn't exist at this index in original)
              const isNewSection = !isDeleted && currentIndex >= (originalCv?.mainColumn?.length ?? 0);

              return (
                <Box key={sectionId || renderIndex} mb={1}>
                  <CvSectionComponent
                    sideOrMain="mainColumn"
                    sectionIndex={renderIndex}
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
            });
          })()}

        </Box>
      </Grid>
    </Grid>
  );
}

export default CvPaper;
