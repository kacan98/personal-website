"use client";
import { JobCvIntersectionParams, JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/route";
import { PositionSummarizeParams, PositionSummarizeResponse } from "@/app/api/position-summary/route";
import { CvTranslateParams } from "@/app/api/translate/route";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector } from "@/redux/hooks";
import { initCv } from "@/redux/slices/cv";
import { CvSection as CvSectionSanitySchemaType, CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import CreateIcon from '@mui/icons-material/Create';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AiForm } from "./aiForm";
import CvPaper from "./cvPaper";
import CvLanguageSelectionComponent from "./languageSelect";
import { MotivationalLetterParams } from "@/app/api/motivational-letter/motivational-letter.model";

const DEV = process.env.NODE_ENV === "development";

export type CvProps = {
  name: string;
  intro: string;
  // picture: string;
  mainSections: CvSectionSanitySchemaType[];
  sideSections: CvSectionSanitySchemaType[];
};

function CvPage() {
  const reduxCvProps = useAppSelector((state) => state.cv);
  const [selectedLanguage, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const editable = titleClickedTimes >= 5 || DEV
  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [judgement, setJudgement] = useState<JobCvIntersectionResponse | null>(null)
  const [checked, setChecked] = useState<string[]>([])
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [motivationalLetter, setMotivationalLetter] = useState<string | null>(null)
  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''

  const dispatch = useDispatch();
  const updateCvInRedux = (cv: CVSettings) => {
    dispatch(initCv(cv));
  }

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

  const getSummary = async () => {
    if (!positionDetails) return setsnackbarMessage('Please provide position details')

    setLoading(true)

    const positionSummaryParams: PositionSummarizeParams = {
      description: positionDetails
    }

    try {
      const res: PositionSummarizeResponse = await fetch('/api/position-summary', {
        method: 'POST',
        body: JSON.stringify(positionSummaryParams),
      }).then(res => res.json())
      setPositionSummary(res.summary)
      if (res.companyName) setCompanyName(res.companyName)
    } catch (err) {
      setsnackbarMessage('Error summarizing position')
    }
    setLoading(false)
  }

  const getJudgement = async () => {
    if (!positionDetails) return setsnackbarMessage('Please provide position details')
    setLoading(true)
    try {
      const getJudgementParams: JobCvIntersectionParams = {
        candidate: reduxCvProps,
        jobDescription: positionDetails
      }

      const res = await fetch('/api/job-cv-intersection', {
        method: 'POST',
        body: JSON.stringify(getJudgementParams),
      })
      const body: JobCvIntersectionResponse = await res.json()
      setJudgement(body)
    } catch (err) {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
  }

  const translateCv = async ({ cvProps, selectedLanguage }: { cvProps: CVSettings; selectedLanguage: string; }) => {
    if (selectedLanguage === 'English') return setsnackbarMessage('Please select a language to translate to')

    setLoading(true)
    try {
      const cvTranslateParams: CvTranslateParams = {
        targetLanguage: selectedLanguage,
        cv: cvProps
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify(cvTranslateParams),
      })
      const result = await res.json()
      const parsed: CVSettings = JSON.parse(result)
      updateCvInRedux(parsed)
    } catch (err) {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
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

  const getMotivationalLetter = async () => {
    if (!positionDetails) return setsnackbarMessage('Please provide position details')

    setLoading(true)
    try {
      const motivationalLetterParams: MotivationalLetterParams = {
        candidate: reduxCvProps,
        jobDescription: positionDetails,
        strongPoints: checked
      }
      const res = await fetch('/api/motivational-letter', {
        method: 'POST',
        body: JSON.stringify(motivationalLetterParams),
      })
      const body = await res.text()
      // MotivationalLetterParams.parse(body)
      setMotivationalLetter(body)
    } catch (err) {
      setsnackbarMessage('Error getting a motivational letter')
    }
    setLoading(false)
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
            The changes currently won&apos;t be saved in any way. I might add saving in the future.
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
                positionDetails={positionDetails}
                positionSummary={positionSummary}
                judgement={judgement}
                checked={checked}
                reduxCvProps={reduxCvProps}
                setPositionDetails={setPositionDetails}
                setPositionSummary={setPositionSummary}
                setLanguage={setLanguage}
                setLoading={setLoading}
                setsnackbarMessage={setsnackbarMessage}
                setCompanyName={setCompanyName}

                updateCvInRedux={updateCvInRedux}
                getSummary={getSummary}
                getJudgement={getJudgement}
                handleChecked={handleChecked}
              />
            }
          </>
        )}
      </Box>

      <Print fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}>
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
            onClick={() => getMotivationalLetter()}
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
