import { ConditionalWrapper } from "@/components/conditionalWrapper";
import { EditableText, EditableTextExtraProps } from "@/components/editableText";
import { SUPPORTED_ICONS } from "@/components/icon";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv } from "@/redux/slices/cv";
import { BulletPoint } from "@/types";
import { Grid, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import React from "react";
import { IconPicker } from "./IconPicker";
import { BRAND_COLORS } from "@/app/colors";

export const CvBulletPoint = React.memo(function CvBulletPoint({
    bulletPoint,
    editable,
    baseQuery,
    isPrintVersion,
    originalBulletPoint,
    showDiff,
    onDelete,
    onRestore,
    autoEdit,
    onAutoDelete
}: {
    bulletPoint: BulletPoint;
    baseQuery: EditableTextExtraProps["query"];
    editable?: boolean;
    isPrintVersion: boolean;
    originalBulletPoint?: BulletPoint;
    showDiff?: boolean;
    onDelete?: () => void;
    onRestore?: () => void;
    autoEdit?: boolean;
    onAutoDelete?: () => void;
}) {
    const dispatch = useAppDispatch();

    const handleIconChange = (newIconName: string) => {
        dispatch(updateCv({
            query: [...baseQuery, 'iconName'],
            newValue: newIconName
        }));
    };
    return (
        <>
            <ListItem sx={{ pt: 0, pb: 1, px: 0, display: 'block' }}>
                <Grid container spacing={2} alignItems="flex-start" wrap={"nowrap"}>
                    <ListItemIcon sx={{
                        minWidth: 'auto',
                        mr: 1,
                        mt: 0.5,
                        // Apply accent color to icon when there's a URL
                        ...(!!bulletPoint.url && (isPrintVersion || !editable) && {
                            color: 'secondary.main',
                            '& svg': {
                                color: 'secondary.main',
                            }
                        })
                    }}>
                        {editable && !isPrintVersion ? (
                            <IconPicker
                                currentIconName={bulletPoint.iconName}
                                onIconSelect={handleIconChange}
                                originalIconName={originalBulletPoint?.iconName}
                                showDiff={showDiff}
                            />
                        ) : (
                            SUPPORTED_ICONS[bulletPoint.iconName]?.component()
                        )}
                    </ListItemIcon>

                    <Box sx={{ flex: 1 }}>
                        <ListItemText
                            sx={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto',
                                m: 0,
                                // Modern link styling - only for text, not icon
                                ...(!!bulletPoint.url && (isPrintVersion || !editable) && {
                                    '& a': {
                                        color: 'secondary.main', // MUI theme accent color
                                        textDecoration: 'none',
                                        borderBottom: `1.5px solid rgba(${BRAND_COLORS.accentRgb}, 0.5)`,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            color: `rgba(${BRAND_COLORS.accentRgb}, 1)`,
                                            filter: 'brightness(1.2)',
                                            borderBottomColor: 'secondary.main',
                                            backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.12)`,
                                        },
                                    }
                                }),
                                // Print-specific styling - ensure visibility in print
                                '@media print': {
                                    ...(!!bulletPoint.url && isPrintVersion && {
                                        '& a': {
                                            color: `${BRAND_COLORS.accent} !important`,
                                            textDecoration: 'underline !important',
                                            textDecorationColor: `${BRAND_COLORS.accent} !important`,
                                            textDecorationThickness: '1.5px !important',
                                        }
                                    })
                                }
                            }}
                        >
                            <ConditionalWrapper
                                condition={!!bulletPoint.url && (isPrintVersion || !editable)}
                                wrapper={(c) =>
                                    bulletPoint.url!.startsWith("mailto:") ? (
                                        <a href={bulletPoint.url!}>{c}</a>
                                    ) : (
                                        <a href={bulletPoint.url!} target="_blank" rel="noreferrer">
                                            {c}
                                        </a>
                                    )
                                }
                            >
                                <EditableText
                                    query={[...baseQuery ,'text']}
                                    text={bulletPoint.text}
                                    editable={editable}
                                    originalText={originalBulletPoint?.text}
                                    showDiff={showDiff && !isPrintVersion}
                                    autoEdit={autoEdit}
                                    onAutoDelete={onAutoDelete}
                                    onDelete={onDelete}
                                    onRestore={onRestore}
                                />
                            </ConditionalWrapper>
                        </ListItemText>

                        {/* URL field in edit mode */}
                        {editable && !isPrintVersion && (
                            <Box sx={{ mt: 0.5 }}>
                                <EditableText
                                    query={[...baseQuery, 'url']}
                                    text={bulletPoint.url || ''}
                                    editable={editable}
                                    originalText={originalBulletPoint?.url}
                                    showDiff={showDiff}
                                    placeholder="Add URL (optional)"
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontStyle: 'italic',
                                        fontSize: '0.75rem',
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Grid>
            </ListItem>
        </>
    )
});