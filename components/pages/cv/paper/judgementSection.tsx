import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/route";
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

interface JudgementSectionProps {
    judgement: JobCvIntersectionResponse
    checked: string[];
    handleChecked: (missing: string) => () => void
}

const JudgementSection = ({ judgement, checked, handleChecked }: JudgementSectionProps) => (
    <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h6">Judgement : {`${judgement.rating}/10`}</Typography>
        <Typography variant="body1" mb={2}>{judgement.opinion}</Typography>
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
                <ListItemButton key={idx} onClick={handleChecked(missing)}>
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
);

JudgementSection.displayName = 'JudgementSection';
export default memo(JudgementSection);