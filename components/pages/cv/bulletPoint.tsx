import { ConditionalWrapper } from "@/components/conditionalWrapper";
import { EditableText, EditableTextExtraProps } from "@/components/editableText";
import { SUPPORTED_ICONS } from "@/components/icon";
import { useAppDispatch } from "@/redux/hooks";
import { updateCv } from "@/redux/slices/cv";
import { BulletPoint } from "@/types";
import { Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { IconPicker } from "./IconPicker";

export const CvBulletPoint = React.memo(function CvBulletPoint({
    bulletPoint,
    editable,
    baseQuery,
    isPrintVersion,
    originalBulletPoint,
    showDiff,
    onDelete,
    onRestore
}: {
    bulletPoint: BulletPoint;
    baseQuery: EditableTextExtraProps["query"];
    editable?: boolean;
    isPrintVersion: boolean;
    originalBulletPoint?: BulletPoint;
    showDiff?: boolean;
    onDelete?: () => void;
    onRestore?: () => void;
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
            <ListItem sx={{ pt: 0, pb: 1, px: 0 }}>
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
                    <Grid container spacing={2} alignItems="center" wrap={"nowrap"}>
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
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

                        <ListItemText
                            sx={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto',
                                m: 0
                            }}
                        >
                            <EditableText
                                query={[...baseQuery ,'text']}
                                text={bulletPoint.text}
                                editable={editable}
                                originalText={originalBulletPoint?.text}
                                showDiff={showDiff && !isPrintVersion}
                                onDelete={onDelete}
                                onRestore={onRestore}
                            />
                        </ListItemText>
                    </Grid>
                </ConditionalWrapper>
            </ListItem>
        </>
    )
});