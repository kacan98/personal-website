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
  const editable = titleClickedTimes >= 5 || DEV
  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [shouldAdjustCv, setShouldAdjustCv] = useState(false);
  const [positionIntersection, setPositionIntersection] = useState<JobCvIntersectionResponse | null>(null)
  const [checked, setChecked] = useState<string[]>([])
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [motivationalLetter, setMotivationalLetter] = useState<string | null>(null)
  const { getMotivationalLetter,
    updatePositionIntersection,
    getSummary,
    adjustCvBasedOnPosition, translateCv } = useCvTools({
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
    })
  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''
  const [fontSize, setFontSize] = useState(12);

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
    <PageWrapper title={"CV"} onTitleClicked={onTitleClicked}>
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
        {DEV && editable && (
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
      {DEV && <Slider
        min={9}
        max={20}
        value={fontSize}
        onChange={(e, newValue) => setFontSize(newValue as number)}
        valueLabelDisplay="auto"
        aria-label="font size"
        defaultValue={12}
        sx={{ mb: 2 }} />
      }

      <Print fontSize={fontSize} fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}>
        <CvPaper editable={editable} />
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

      {DEV && positionDetails && (
        <>
          <Button
            type="button"
            onClick={() => getMotivationalLetter(positionDetails, checked, selectedLanguage)}
            sx={{ mt: 2, mb: 2, width: "100%" }}
            variant="outlined" >
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
