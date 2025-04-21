import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import {
    Box,
    Checkbox, List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import { memo } from "react";

interface IntersectionSectionProps {
    positionIntersection: JobCvIntersectionResponse
    checked: string[];
    handleChecked: (missing: string) => () => void
}

const IntersectionSection = ({ positionIntersection, checked, handleChecked }: IntersectionSectionProps) => (
    <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h6">Intersection : {`${positionIntersection.rating}/10`}</Typography>
        <Typography variant="body1" mb={2}>{positionIntersection.opinion}</Typography>
        <Typography variant="h6">What AI liked?</Typography>
        <List>
            {positionIntersection.whatIsGood.map((good, idx) => (
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
            {positionIntersection.whatIsMissing.map((missing, idx) => (
                <ListItemButton key={idx} onClick={handleChecked(missing.description)}>
                    <ListItem>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.includes(missing.description)}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText primary={missing.description} secondary={`Improvement suggestion: ${missing.whatWouldImproveTheCv}`} />
                    </ListItem>
                </ListItemButton>
            ))}
        </List>
    </Box>
);

IntersectionSection.displayName = 'IntersectionSection';
export default memo(IntersectionSection);