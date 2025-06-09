"use client"
import { usePicture } from "@/hooks/usePicture";
import { getCVPicture } from "@/sanity/sanity-utils";
import { Avatar, Box, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import PageWrapper from "../pageWrapper";

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
    const { imageUrl } = usePicture(getCVPicture);
    const avatarRef = useRef<HTMLDivElement>(null); useEffect(() => {
        const avatarElement = avatarRef.current;
        if (!avatarElement || !imageUrl) return;

        const ctx = gsap.context(() => {
            // Initial entrance animation
            gsap.fromTo(
                avatarElement,
                {
                    opacity: 0,
                    scale: 1.4,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.3,
                    ease: "power3.inOut",
                }
            );

            // Mouse tracking animation (matching original Avatar component)
            const handleMouseMove = (e: MouseEvent) => {
                if (!avatarElement) return;

                const componentRect = avatarElement.getBoundingClientRect();
                const componentCenterX = componentRect.left + componentRect.width / 2;

                const componentPercent = {
                    x: (e.clientX - componentCenterX) / componentRect.width / 2,
                };

                const distFromCenterX = 1 - Math.abs(componentPercent.x);

                gsap
                    .timeline({
                        defaults: { duration: 0.5, overwrite: "auto", ease: "power3.out" },
                    })
                    .to(
                        avatarElement,
                        {
                            rotation: gsap.utils.clamp(-2, 2, 5 * componentPercent.x),
                            duration: 0.5,
                        },
                        0,
                    )
                    .to(
                        ".avatar-highlight",
                        {
                            opacity: distFromCenterX - 0.7,
                            x: -10 + 20 * componentPercent.x,
                            duration: 0.5,
                        },
                        0,
                    );
            };

            // Add mouse move listener to window
            window.addEventListener('mousemove', handleMouseMove);

            // Cleanup function
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }, avatarRef);

        return () => ctx.revert();
    }, [imageUrl]);

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
                <Grid2
                    container
                    spacing={{ xs: 3, md: 4 }}
                    sx={{
                        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }
                    }}
                >
                    <Grid2 xs={12} md={8}>
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
                                    variant="contained"
                                    size="large"
                                    href={buttonHref}
                                    onClick={onButtonClick}
                                    sx={{
                                        mt: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                        textTransform: "none",
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </Box>
                        )}
                    </Grid2>                    {imageUrl && (
                        <Grid2
                            xs={12}
                            md={4}
                            sx={{
                                display: "flex",
                                justifyContent: { xs: "center", md: "flex-start" },
                                alignItems: { xs: "center", md: "flex-start" },
                                order: { xs: -1, md: 0 },
                                perspective: "1000px"
                            }}
                        >                            <Box
                            ref={avatarRef}
                            sx={{
                                position: "relative",
                                display: "inline-block",
                                width: "100%",
                                height: "100%",
                                opacity: 0 // Will be animated in by GSAP
                            }}
                        >
                                <Box
                                    sx={{
                                        aspectRatio: "1",
                                        overflow: "hidden",
                                        borderRadius: 3,
                                        border: "2px solid",
                                        borderColor: "grey.700",
                                        perspective: "500px",
                                        perspectiveOrigin: "150% 150%"
                                    }}
                                >
                                    <Avatar
                                        src={imageUrl}
                                        alt="Karel profile picture"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            maxWidth: { md: 400 },
                                            borderRadius: 0, // Remove border radius since container handles it
                                            "& img": {
                                                objectFit: "cover"
                                            }
                                        }}
                                        variant="square"
                                    />
                                    <Box
                                        className="avatar-highlight"
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            transform: "scale(1.1)",
                                            background: "linear-gradient(to top right, transparent, rgba(255,255,255,0.3), transparent)",
                                            opacity: 0,
                                            display: { xs: "none", md: "block" }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid2>
                    )}
                </Grid2>
            </Box>
        </PageWrapper>
    );
};

export default About;
