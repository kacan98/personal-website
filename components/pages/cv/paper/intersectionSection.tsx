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

// Helper function to render markdown-like text with proper formatting
const renderFormattedText = (text: string) => {
    if (!text) return null;

    // First, split by paragraphs (double newlines)
    const paragraphs = text.split(/\n\s*\n/);

    return paragraphs.map((paragraph, paragraphIndex) => {
        if (!paragraph.trim()) return null;

        // Check if this paragraph is a numbered list
        const isNumberedList = /^\d+\./.test(paragraph.trim());

        if (isNumberedList) {
            // Handle numbered lists
            const listItems = paragraph.split(/(?=\d+\.)/);
            return (
                <Box key={paragraphIndex} sx={{ my: 1 }}>
                    {listItems.map((item, itemIndex) => {
                        if (!item.trim()) return null;

                        // Process markdown formatting within the list item
                        const formattedContent = formatInlineMarkdown(item.trim());

                        return (
                            <Typography
                                key={itemIndex}
                                variant="body2"
                                sx={{ ml: 2, my: 0.5, display: 'block' }}
                                component="div"
                            >
                                {formattedContent}
                            </Typography>
                        );
                    }).filter(Boolean)}
                </Box>
            );
        }

        // Handle bullet points with dashes
        if (paragraph.includes('\n- ')) {
            const lines = paragraph.split('\n');
            return (
                <Box key={paragraphIndex} sx={{ my: 1 }}>
                    {lines.map((line, lineIndex) => {
                        if (!line.trim()) return null;

                        if (line.trim().startsWith('- ')) {
                            const bulletContent = formatInlineMarkdown(line.trim().substring(2));
                            return (
                                <Typography
                                    key={lineIndex}
                                    variant="body2"
                                    sx={{ ml: 3, my: 0.5, display: 'block' }}
                                    component="div"
                                >
                                    • {bulletContent}
                                </Typography>
                            );
                        } else {
                            const formattedContent = formatInlineMarkdown(line.trim());
                            return (
                                <Typography
                                    key={lineIndex}
                                    variant="body2"
                                    sx={{ my: 0.5, display: 'block' }}
                                    component="div"
                                >
                                    {formattedContent}
                                </Typography>
                            );
                        }
                    }).filter(Boolean)}
                </Box>
            );
        }

        // Handle regular paragraphs
        const formattedContent = formatInlineMarkdown(paragraph);
        return (
            <Typography
                key={paragraphIndex}
                variant="body2"
                sx={{ my: 1, display: 'block' }}
                component="div"
            >
                {formattedContent}
            </Typography>
        );
    }).filter(Boolean);
};

// Helper function to format inline markdown (bold, italic, etc.)
const formatInlineMarkdown = (text: string) => {
    if (!text) return '';

    // Split by bold markers (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove asterisks and make bold
            const boldText = part.slice(2, -2);
            return <strong key={index} style={{ fontWeight: 'bold' }}>{boldText}</strong>;
        }

        // Handle italic (*text*)
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            const italicText = part.slice(1, -1);
            return <em key={index} style={{ fontStyle: 'italic' }}>{italicText}</em>;
        }

        // Handle inline code (`code`)
        if (part.startsWith('`') && part.endsWith('`')) {
            const codeText = part.slice(1, -1);
            return (
                <Box
                    key={index}
                    component="span"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em'
                    }}
                >
                    {codeText}
                </Box>
            );
        }

        return part;
    });
};

const IntersectionSection = ({ positionIntersection, checked, handleChecked }: IntersectionSectionProps) => (
    <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Job Match Analysis: {`${positionIntersection.rating}/10`}
        </Typography>

        <Box sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(248, 250, 252, 0.03)',
            borderRadius: 2,
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary', opacity: 0.8 }}>
                Assessment Summary
            </Typography>
            <Box sx={{
                '& > *': {
                    color: 'text.primary',
                    lineHeight: 1.6
                }
            }}>
                {renderFormattedText(positionIntersection.opinion)}
            </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: '#10b981', fontSize: '18px' }}>✓</Box>
            Strengths identified
        </Typography>
        <Box sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
            <List sx={{ py: 0 }}>
                {positionIntersection.whatIsGood.map((good, idx) => (
                    <ListItem key={idx} sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{ color: '#10b981', mt: 0.5, fontSize: '12px' }}>●</Box>
                                    <Typography variant="body2" sx={{
                                        color: 'text.primary',
                                        lineHeight: 1.5,
                                        fontWeight: 400
                                    }}>
                                        {good}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: '#6b7280', fontSize: '18px' }}>◯</Box>
            Potential improvements
        </Typography>
        <Typography variant="body2" mb={2} sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            Select items that apply to you but are missing from your CV. These will be used to enhance your profile.
        </Typography>
        <Box sx={{
            p: 0,
            backgroundColor: 'transparent',
            borderRadius: 2,
        }}>
            <List sx={{ py: 0 }}>
                {positionIntersection.whatIsMissing.map((missing, idx) => (
                    <ListItemButton
                        key={idx}
                        onClick={handleChecked(missing.description)}
                        sx={{
                            borderRadius: 2,
                            mb: 2,
                            p: 3,
                            backgroundColor: checked.includes(missing.description)
                                ? 'rgba(59, 130, 246, 0.08)'
                                : 'rgba(107, 114, 128, 0.05)',
                            border: '1px solid',
                            borderColor: checked.includes(missing.description)
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(107, 114, 128, 0.15)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: checked.includes(missing.description)
                                    ? 'rgba(59, 130, 246, 0.12)'
                                    : 'rgba(107, 114, 128, 0.08)',
                                borderColor: checked.includes(missing.description)
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'rgba(107, 114, 128, 0.25)',
                            }
                        }}
                    >
                        <ListItem sx={{ p: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox
                                    edge="start"
                                    checked={checked.includes(missing.description)}
                                    tabIndex={-1}
                                    disableRipple
                                    sx={{
                                        color: 'rgba(107, 114, 128, 0.6)',
                                        '&.Mui-checked': {
                                            color: '#3b82f6'
                                        },
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 20
                                        }
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" sx={{
                                        color: 'text.primary',
                                        fontWeight: checked.includes(missing.description) ? 500 : 400,
                                        lineHeight: 1.5,
                                        mb: 1
                                    }}>
                                        {missing.description}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.4,
                                        fontStyle: 'normal'
                                    }}>
                                        {missing.whatWouldImproveTheCv}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    </Box>
);

IntersectionSection.displayName = 'IntersectionSection';
export default memo(IntersectionSection);