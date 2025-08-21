import { ConditionalWrapper } from "@/components/conditionalWrapper";
import { EditableText, EditableTextExtraProps } from "@/components/editableText";
import { SUPPORTED_ICONS } from "@/components/icon";
import { BulletPoint } from "@/sanity/schemaTypes/singletons/cvSettings";
import { Grid, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export const CvBulletPoint = ({
    bulletPoint,
    editable,
    baseQuery,
    isPrintVersion
}: {
    bulletPoint: BulletPoint;
    baseQuery: EditableTextExtraProps["query"];
    editable?: boolean;
    isPrintVersion: boolean;
}) => {
    return (
        <>
            <ListItem sx={{ py: 0, px: 0 }}>
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
                        <ListItemIcon>
                            {SUPPORTED_ICONS[bulletPoint.iconName]?.component()}
                        </ListItemIcon>

                        <ListItemText><EditableText query={[...baseQuery ,'text']} text={bulletPoint.text} editable={editable} /></ListItemText>
                    </Grid>
                </ConditionalWrapper>
            </ListItem>
        </>
    )
}