import { Box } from "@mui/material";
import Button from "@/components/ui/Button";
import Grid from "@mui/material/Grid";
import { ReactNode } from "react";
import PageWrapper from "../pageWrapper";
import ProfileImage from "./ProfileImage";

export type AboutProps = {
    heading: string;
    bodyContent: ReactNode;
    buttonText?: string;
    buttonHref?: string;
    avatarSrc?: string;
    avatarAlt?: string;
    onButtonClick?: () => void;
};

export const About = ({
    bodyContent,
    buttonText,
    buttonHref,
    onButtonClick
}: AboutProps): JSX.Element => {
    return (
        <PageWrapper
            title={"About me"}
        >
            <Box
                sx={{
                    padding: { xs: 2, md: 4 },
                    maxWidth: "lg",
                    margin: "0 auto",
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 3, md: 4 }}
                    sx={{
                        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }
                    }}
                >
                    <Grid
                        size={{ xs: 12, md: 8 }}>
                        <Box
                            sx={{
                                color: "text.primary",
                                fontSize: { xs: "1.125rem", md: "1.25rem" },
                                lineHeight: 1.7,
                                textAlign: 'left',
                                mb: 3,
                                "& p": {
                                    mb: 2,
                                    textAlign: 'left',
                                    "&:last-child": {
                                        mb: 0
                                    }
                                },
                                "& h3": {
                                    fontSize: "1.5rem",
                                    fontWeight: 600,
                                    mt: 3,
                                    mb: 2,
                                    textAlign: 'left',
                                },
                                "& ul": {
                                    paddingLeft: 2,
                                    mb: 2,
                                },
                                "& li": {
                                    mb: 1,
                                    textAlign: 'left',
                                },
                                "& br": {
                                    display: "block",
                                    content: '""',
                                    marginTop: "1rem"
                                }
                            }}
                        >
                            {typeof bodyContent === 'string' ?
                                bodyContent.split('\n').map((paragraph, index) => {
                                    const trimmed = paragraph.trim();
                                    if (!trimmed) return null;
                                    return (
                                        <Box
                                            key={index}
                                            component="p"
                                            sx={{
                                                mb: 2,
                                                textAlign: 'left',
                                                "&:last-child": {
                                                    mb: 0
                                                }
                                            }}
                                        >
                                            {trimmed}
                                        </Box>
                                    );
                                }).filter(Boolean)
                                : bodyContent
                            }
                        </Box>
                        {buttonText && (
                            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Button
                                    variant="primary"
                                    href={buttonHref}
                                    onClick={onButtonClick}
                                    sx={{
                                        mt: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </Box>
                        )}
                    </Grid>
                    <Grid
                        size={{ xs: 12, md: 4 }}
                        sx={{
                            display: "flex",
                            justifyContent: { xs: "center", md: "flex-start" },
                            alignItems: { xs: "center", md: "flex-start" },
                            order: { xs: -1, md: 0 },
                            perspective: "1000px",
                            maxWidth: { xs: 300, md: 400 },
                            mx: { xs: "auto", md: 0 }
                        }}
                    >
                        <ProfileImage />
                    </Grid>
                </Grid>
            </Box>
        </PageWrapper>
    );
};

export default About;