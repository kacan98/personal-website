"use client";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector } from "@/redux/hooks";
import { CvSection as CvSectionSanitySchemaType } from "@/sanity/schemaTypes/cv/cvSection";
import CreateIcon from '@mui/icons-material/Create';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import CvPaper from "./cvPaper";
import CvLanguageSelectionComponent from "./languageSelect";
import { translateCv as transformCv } from "./translateCv";
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import { initCv } from "@/redux/slices/cv";
import React from "react";

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
  const [extraGptInput, setExtraGptInput] = useState("");
  const editable = titleClickedTimes >= 5;
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

  return (
    <PageWrapper title={"CV"} onTitleClicked={onTitleClicked}>
      {editable && (
        <>
          <Typography variant="h2" mb={2}>
            Now you can edit. <CreateIcon />
          </Typography>
          <Typography variant="body1">
            But be careful. This is possible just to tweak something (or translate) before sending it to potential employers.
            The changes currently won't be saved in any way. I might add saving in the future.
          </Typography>
        </>
      )}

      <Box sx={{ mb: 5 }}>
        {/* AI does not work in production because of limitations in Vercel :((( */}
        {DEV && editable && (
          <>
            <CvLanguageSelectionComponent
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
            {
              <Box sx={{ mt: 2 }}>
                <TextField
                  multiline
                  disabled={loading}
                  label="Anything else AI should change?"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={extraGptInput}
                  onChange={(e) => setExtraGptInput(e.target.value)}
                />
              </Box>}
            <Button
              type="button"
              onClick={() => transformCv({
                cvProps: reduxCvProps,
                selectedLanguage,
                extraGptInput,
                setLanguage,
                setLoading,
                setsnackbarMessage,
                updateCvInRedux
              })} sx={{ mt: 2, width: "100%" }} variant="contained" color="primary">
              Transform by AI
            </Button>
          </>
        )}
      </Box>

      <Print fileName={`${reduxCvProps.name}_CV`}>
        <CvPaper editable={editable} />
      </Print>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Honestly I'm not sure if this works but I don't want to remove it either. :D */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        color="error"
      />
    </PageWrapper>
  );
}

export default CvPage;
