import { Box } from "@mui/material";
import Button from "@/components/ui/Button";
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
                <Box
                    sx={{
                        display: { xs: 'flex', sm: 'block' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                >
                    {/* Image floated on the left on desktop, centered above text on mobile */}
                    <Box
                        sx={{
                            float: { xs: 'none', sm: 'left' },
                            mr: { xs: 0, sm: 3 },
                            mb: { xs: 3, sm: 2 },
                            display: "flex",
                            justifyContent: "center",
                            perspective: "1000px",
                            maxWidth: { xs: 250, sm: 300 },
                            width: { xs: '100%', sm: 300 }
                        }}
                    >
                        <ProfileImage />
                    </Box>

                    {/* Text content that flows around the image */}
                    <Box
                        sx={{
                            color: "text.primary",
                            fontSize: { xs: "1.125rem", md: "1.25rem" },
                            lineHeight: 1.7,
                            textAlign: 'left',
                            "& p": {
                                mb: 2,
                                textAlign: 'left',
                                "&:last-child": {
                                    mb: 3
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
                                                mb: 3
                                            }
                                        }}
                                    >
                                        {trimmed}
                                    </Box>
                                );
                            }).filter(Boolean)
                            : bodyContent
                        }

                        {buttonText && (
                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    justifyContent: "center",
                                    gap: 2,
                                    clear: { xs: 'none', sm: 'both' },
                                    pt: 2,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Button
                                    variant="primary"
                                    href={buttonHref}
                                    onClick={onButtonClick}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {buttonText}
                                </Button>
                                <Button
                                    variant="secondary"
                                    href="https://www.linkedin.com/in/kcancara"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    Add me on LinkedIn
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </PageWrapper>
    );
};

export default About;