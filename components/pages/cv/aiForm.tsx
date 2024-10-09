import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/route";
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import {
    Box, Button,
    Checkbox, List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, TextField,
    Typography
} from "@mui/material";
import { adjustCvBasedOnPosition } from "./hooks/adjustCvBasedOnPosition";

export interface AiFormProps {
    positionDetails: string;
    positionSummary: string;
    judgement: JobCvIntersectionResponse | null;
    checked: string[];
    reduxCvProps: CVSettings;

    setPositionDetails: (value: string) => void;
    setPositionSummary: (value: string) => void;
    setLanguage: (value: string) => void;
    setLoading: (value: boolean) => void;
    setsnackbarMessage: (value: string | null) => void;
    updateCvInRedux: (value: CVSettings) => void;
    setCompanyName: (value: string) => void;
    getSummary: () => void;
    getJudgement: () => void;
    handleChecked: (missing: string) => () => void;
}

export const AiForm = ({
    positionDetails,
    positionSummary,
    judgement,
    checked,
    reduxCvProps,
    setPositionDetails,
    setPositionSummary,
    setLanguage,
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
    setCompanyName,
    getSummary,
    getJudgement,
    handleChecked
}: AiFormProps) => {
    return (
        <Box>
            <TextField
                multiline
                maxRows={15}
                label="Enter a job description here"
                variant="outlined"
                value={positionDetails}
                onChange={(e) => setPositionDetails(e.target.value)}
                fullWidth>
            </TextField>
            {
                positionDetails && (positionDetails.length > 10) && (
                    <>
                        <Button
                            type="button"
                            onClick={() => getSummary()}
                            sx={{ mt: 2, width: "100%" }}
                            variant="contained"
                            color="secondary">
                            Summarize the position
                        </Button>
                        {positionSummary && (
                            <TextField
                                sx={{
                                    mt: 2
                                }}
                                multiline
                                fullWidth
                                label="Position Summary"
                                variant="outlined"
                                value={positionSummary}
                                onChange={(e) => setPositionSummary(e.target.value)}
                            >
                                {positionSummary}
                            </TextField>
                        )}
                        <Button
                            type="button"
                            onClick={() => getJudgement()}
                            sx={{ mt: 2, width: "100%" }}
                            variant="contained"
                            color="secondary">
                            Match CV with the position
                        </Button>
                        {judgement && (
                            <Box sx={{
                                textAlign: 'left',
                            }}>
                                <Typography variant="h6">Judgement : {`${judgement.rating}/10`}</Typography>
                                <Typography variant="body1" mb={2}>
                                    {/* split this into paragraphs */}
                                    {judgement.opinion}
                                </Typography>
                                <Typography variant="h6">What AI liked?</Typography>
                                <List>
                                    {judgement.whatIsGood.map((good, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemText primary={good} />
                                        </ListItem>
                                    ))}
                                </List>

                                <Typography variant="h6">What was missing?</Typography>
                                <Typography variant="body1" mb={2}>
                                    (Make sure to tick those that actually apply and are missing in your CV!!)
                                </Typography>
                                <List>
                                    {judgement.whatIsMissing.map((missing, idx) => (
                                        <ListItemButton key={idx} onClick={handleChecked(missing)} >
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.includes(missing)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={missing} />
                                            </ListItem>
                                        </ListItemButton>
                                    ))}
                                </List>

                            </Box>
                        )}
                        <Button
                            type="button"
                            onClick={() => adjustCvBasedOnPosition({
                                cvProps: reduxCvProps,
                                setLanguage,
                                setLoading,
                                setsnackbarMessage,
                                updateCvInRedux,
                                positionSummary,
                                positionDetails,
                                setPositionSummary,
                                setCompanyName
                            })} sx={{ mt: 2, width: "100%" }} variant="contained" color="primary">
                            Improve CV (based on the position)
                        </Button>
                    </>
                )
            }
        </Box>
    )
}