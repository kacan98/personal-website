import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import {
    Box,
    TextField
} from "@mui/material";
import Button from "@/components/ui/Button";
import IntersectionSection from "./paper/intersectionSection";

export interface AiFormProps {
    positionIntersection: JobCvIntersectionResponse | null;
    checked: string[];
    positionSummary: string;
    positionDetails: string;

    setLoading: (value: boolean) => void;
    setsnackbarMessage: (value: string | null) => void;
    setCompanyName: (value: string) => void;
    handleChecked: (missing: string) => () => void;
    setPositionSummary: (value: string) => void;
    setPositionDetails: (value: string) => void;

    getSummary: () => void;
    updatePositionIntersection: () => void;
    adjustCvBasedOnPosition: () => void;
}

export const AiForm = ({
    positionIntersection,
    checked,
    positionSummary,
    positionDetails,
    handleChecked,
    setPositionSummary,
    setPositionDetails,
    getSummary,
    updatePositionIntersection,
    adjustCvBasedOnPosition
}: AiFormProps) => {
    return (
        <Box>
            <TextField
                id="job-description-input"
                multiline
                maxRows={15}
                label="Enter a job description here"
                variant="outlined"
                fullWidth
                value={positionDetails}
                onChange={(e) => setPositionDetails(e.target.value)}
            />
            {positionDetails && positionDetails.length > 10 && (
                <>
                    <Button
                        type="button"
                        onClick={getSummary}
                        sx={{ mt: 2, width: "100%" }}
                        variant="secondary"
                    >
                        Summarize the position
                    </Button>
                    {positionSummary && (
                        <TextField
                            id="position-summary-input"
                            sx={{ mt: 2 }}
                            multiline
                            fullWidth
                            label="Position Summary"
                            variant="outlined"
                            value={positionSummary}
                            onChange={(e) => setPositionSummary(e.target.value)}
                        />
                    )}
                    <Button
                        type="button"
                        onClick={updatePositionIntersection}
                        sx={{ mt: 2, width: "100%" }}
                        variant="secondary"
                    >
                        Match CV with the position
                    </Button>
                    {positionIntersection && (
                        <IntersectionSection
                            positionIntersection={positionIntersection}
                            checked={checked}
                            handleChecked={handleChecked} />
                    )}
                    <Button
                        type="button"
                        onClick={adjustCvBasedOnPosition}
                        sx={{ mt: 2, width: "100%" }}
                        variant="primary"
                    >
                        Improve CV (based on the position)
                    </Button>
                </>
            )}
        </Box>
    );
};