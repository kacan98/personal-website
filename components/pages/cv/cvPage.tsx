"use client";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector } from "@/redux/hooks";
import CreateIcon from '@mui/icons-material/Create';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Slider,
  Snackbar,
  SnackbarCloseReason,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiForm } from "./aiForm";
import { useCvTools } from "./hooks/useCvTools";
import CvLanguageSelectionComponent from "./languageSelect";
import CvPaper from "./paper/cvPaper";

const DEV = process.env.NODE_ENV === "development";

export type CvProps = {
  jobDescription?: string
};

function CvPage({ jobDescription }: CvProps) {
  const reduxCvProps = useAppSelector((state) => state.cv);
  const [selectedLanguage, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const editable = titleClickedTimes >= 5 || DEV;
  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [shouldAdjustCv, setShouldAdjustCv] = useState(false);
  const [positionIntersection, setPositionIntersection] = useState<JobCvIntersectionResponse | null>(null)
  const [checked, setChecked] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [motivationalLetter, setMotivationalLetter] = useState<string | null>(null);
  const [removedSections, setRemovedSections] = useState<Set<string>>(new Set());
  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());
  const [removedSubSections, setRemovedSubSections] = useState<Set<string>>(new Set());
  const [modifiedSubSections, setModifiedSubSections] = useState<Set<string>>(new Set());
  const [cvAdjusted, setCvAdjusted] = useState(false);
  const { getMotivationalLetter,
    updatePositionIntersection,
    getSummary,
    adjustCvBasedOnPosition,
    translateCv,
    adjustSection } = useCvTools({
      reduxCvProps,
      positionDetails,
      positionSummary,
      positionIntersection,
      setLoading,
      setsnackbarMessage,
      setMotivationalLetter,
      setPositionIntersection,
      setPositionSummary,
      setCompanyName,
      setLanguage
    })
  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''
  const [fontSize, setFontSize] = useState(12);

  // Callback functions for tracking section changes
  const handleSectionAdjusted = (sectionKey: string) => {
    setModifiedSections(prev => new Set([...prev, sectionKey]));
  };

  const handleRemoveSection = (sectionKey: string) => {
    setRemovedSections(prev => new Set([...prev, sectionKey]));
  };

  const handleRestoreSection = (sectionKey: string) => {
    setRemovedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionKey);
      return newSet;
    });
  };

  const handleRemoveSubSection = (subSectionKey: string) => {
    setRemovedSubSections(prev => new Set([...prev, subSectionKey]));
  };

  const handleRestoreSubSection = (subSectionKey: string) => {
    setRemovedSubSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(subSectionKey);
      return newSet;
    });
  };

  const handleSubSectionAdjusted = (subSectionKey: string) => {
    setModifiedSubSections(prev => new Set([...prev, subSectionKey]));
  };

  useEffect(() => {
    if (jobDescription && jobDescription.trim().length > 0) {
      setPositionDetails(jobDescription);
      setShouldAdjustCv(true);
    }
  }, [jobDescription]);

  useEffect(() => {
    if (shouldAdjustCv && positionDetails && positionDetails.trim().length > 0) {
      adjustCvBasedOnPosition();
      setShouldAdjustCv(false);
    }
  }, [positionDetails, shouldAdjustCv, adjustCvBasedOnPosition]);

  useEffect(() => {
    if (snackbarMessage === 'CV transformed') {
      setCvAdjusted(true);
    }
  }, [snackbarMessage]);

  const handleLanguageChange = async (l: any) => {
    setLanguage(l.target.value);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setsnackbarMessage(null);
  };

  const onTitleClicked = () => {
    setTitleClickedTimes(prev => prev + 1);
  }

  const handleChecked = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

  return (
    <PageWrapper title={"Resume"} onTitleClicked={onTitleClicked}>
      {editable && (
        <>
          <Typography variant="h2" mb={2}>
            Now you can edit. <CreateIcon />
          </Typography>
          <Typography variant="body1">
            But be careful. This is possible just to tweak something (or transform with AI) locally on your machine before sending it to potential employers.
            The changes won&apos;t be saved in any way.
          </Typography>
        </>
      )}

      <Box sx={{ mb: 5, mt: 2 }}>
        {/* AI did not work in the past in production because of limitations in Vercel :((( */}
        {/* but let's try */}
        {DEV && (
          <>
            {
              <AiForm
                positionIntersection={positionIntersection}
                checked={checked}
                positionSummary={positionSummary}
                positionDetails={positionDetails}

                setLoading={setLoading}
                setsnackbarMessage={setsnackbarMessage}
                setCompanyName={setCompanyName}
                setPositionSummary={setPositionSummary}
                setPositionDetails={setPositionDetails}
                handleChecked={handleChecked}

                getSummary={getSummary}
                updatePositionIntersection={updatePositionIntersection}
                adjustCvBasedOnPosition={adjustCvBasedOnPosition}
              />
            }
          </>
        )}
      </Box>

      {/* show a slider for font size */}
      {editable && <Slider
        min={9}
        max={20}
        value={fontSize}
        onChange={(_: any, newValue: number) => setFontSize(newValue)}
        valueLabelDisplay="auto"
        aria-label="font size"
        defaultValue={12}
        sx={{ mb: 2 }} />
      }

      {/* Fixed bottom-left job description indicator - only show after CV is adjusted */}
      {jobDescription && cvAdjusted && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            maxWidth: '200px'
          }}
        >
          <Box sx={{ color: '#3b82f6', fontSize: '18px' }}>✔️</Box>
          <Typography variant="body2" sx={{ fontWeight: 500, margin: 0, color: 'text.primary' }}>
            CV tailored for this position
          </Typography>
        </Box>
      )}

      {/* Fixed top-right CV adjustments indicator */}
      {(modifiedSections.size > 0 || modifiedSubSections.size > 0 || removedSections.size > 0 || removedSubSections.size > 0) && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 999,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            maxWidth: '200px'
          }}
        >
          <Box sx={{ color: '#10b981', fontSize: '18px' }}>✓</Box>
          <Typography variant="body2" sx={{ fontWeight: 500, margin: 0, color: 'text.primary' }}>
            CV Successfully Adjusted
          </Typography>
          <Typography variant="caption" sx={{ margin: 0, color: 'text.secondary', fontSize: '11px' }}>
            {modifiedSections.size + modifiedSubSections.size > 0 &&
              `${modifiedSections.size + modifiedSubSections.size} section${modifiedSections.size + modifiedSubSections.size !== 1 ? 's' : ''} modified`
            }
            {(modifiedSections.size + modifiedSubSections.size > 0) && (removedSections.size + removedSubSections.size > 0) && ', '}
            {removedSections.size + removedSubSections.size > 0 &&
              `${removedSections.size + removedSubSections.size} removed`
            }
          </Typography>
        </Box>
      )}

      <Print printComponent={<CvPaper isPrintVersion />} fontSize={fontSize} fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}>
        <CvPaper
          editable={editable}
          positionDetails={positionDetails}
          adjustSection={adjustSection}
          removedSections={removedSections}
          modifiedSections={modifiedSections}
          onRemoveSection={handleRemoveSection}
          onRestoreSection={handleRestoreSection}
          onSectionAdjusted={handleSectionAdjusted}
          removedSubSections={removedSubSections}
          modifiedSubSections={modifiedSubSections}
          onRemoveSubSection={handleRemoveSubSection}
          onRestoreSubSection={handleRestoreSubSection}
          onSubSectionAdjusted={handleSubSectionAdjusted}
        />
      </Print>

      {DEV && (
        <>
          <Box mb={2}>
            <CvLanguageSelectionComponent
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
          </Box>
          <Button
            type="button"
            onClick={() => translateCv({
              cvProps: reduxCvProps,
              selectedLanguage
            })} sx={{ mt: 2, width: "100%" }} variant="outlined" >
            Translate
          </Button>
        </>
      )}

      {DEV && (
        <>
          <Button
            type="button"
            onClick={() => getMotivationalLetter(positionDetails, checked, selectedLanguage)}
            sx={{ mt: 2, mb: 2, width: "100%" }}
            variant="outlined"
            disabled={!positionDetails || positionDetails.trim().length === 0}
          >
            Get Motivational Letter
          </Button>
          {motivationalLetter && (
            <Box sx={{ mt: 5, textAlign: 'left' }}>
              <Typography variant="h4" mb={2}>
                Motivational Letter
              </Typography>
              {motivationalLetter.split('\\n').map((line, i) => (
                <Typography key={i} variant="body1">
                  {line}
                </Typography>
              ))}
            </Box>
          )}
        </>
      )}

      <Backdrop
        sx={{
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Discussing with Chat GPT...
        </Typography>
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        color="error"
      />
    </PageWrapper >
  );
}

export default CvPage;
