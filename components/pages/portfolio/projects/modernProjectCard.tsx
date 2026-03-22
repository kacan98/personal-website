import { Box, Typography, IconButton, Chip, Button } from "@mui/material";
import { Project } from "@/types";
import { SUPPORTED_ICONS } from "@/components/icon";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const ModernProjectCard = ({ title, description, image, links, tags, projectHref }: Project & { projectHref?: string }) => {
  const t = useTranslations("projects");
  const imageSrc = image?.trim();
  const mediaSx = {
    width: { xs: "100%", md: "45%" },
    height: { xs: "240px", md: "320px" },
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: imageSrc
      ? "transparent"
      : "linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(17, 24, 39, 0.95) 100%)",
    textDecoration: "none",
    cursor: projectHref ? "pointer" : "default",
    flexShrink: 0,
  } as const;

  const mediaContent = imageSrc ? (
    <>
      <Image
        src={imageSrc}
        alt={`${title} project`}
        fill
        style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.3s ease" }}
        sizes="(max-width: 768px) 100vw, 45vw"
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          ".modern-project-card:hover &": { opacity: 1 },
        }}
      />
    </>
  ) : (
    <Typography variant="h6" sx={{ px: 3, textAlign: "center", color: "rgba(255,255,255,0.92)", fontWeight: 700, letterSpacing: "0.04em" }}>
      {title}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "background.paper",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(168, 85, 247, 0.15)",
          borderColor: "rgba(168, 85, 247, 0.3)",
        },
      }}
    >
      {projectHref ? (
        <Box sx={{ width: { xs: "100%", md: "45%" }, flexShrink: 0 }}>
          <Link href={projectHref} style={{ display: "block", width: "100%", textDecoration: "none" }}>
            <Box sx={mediaSx}>{mediaContent}</Box>
          </Link>
        </Box>
      ) : (
        <Box sx={mediaSx}>{mediaContent}</Box>
      )}

      <Box sx={{ width: { xs: "100%", md: "55%" }, p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          {tags && tags.length > 0 && (
            <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
              {tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    color: "primary.main",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    "&:hover": { backgroundColor: "rgba(168, 85, 247, 0.2)" },
                  }}
                />
              ))}
              {tags.length > 3 && (
                <Chip label={`+${tags.length - 3}`} size="small" sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: "text.secondary", fontSize: "0.75rem" }} />
              )}
            </Box>
          )}

          {projectHref ? (
            <Link href={projectHref} style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  lineHeight: 1.2,
                  textAlign: { xs: "center", md: "left" },
                  transition: "color 0.2s ease",
                  "&:hover": { color: "secondary.main" },
                }}
              >
                {title}
              </Typography>
            </Link>
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "text.primary",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                lineHeight: 1.2,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {title}
            </Typography>
          )}

          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 3, fontSize: "0.95rem", textAlign: { xs: "center", md: "left" } }}>
            {description}
          </Typography>
        </Box>

        {(projectHref || (links && links.length > 0)) && (
          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap", pt: 2, borderTop: "1px solid", borderColor: "rgba(255, 255, 255, 0.1)" }}>
              {projectHref && (
                <Button
                  component={Link}
                  href={projectHref}
                  variant="contained"
                  sx={{
                    minWidth: 0,
                    px: 2.25,
                    py: 1,
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "0 10px 22px rgba(168, 85, 247, 0.28)",
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 1) 0%, rgba(217, 70, 239, 0.95) 100%)",
                    "&:hover": {
                      boxShadow: "0 14px 28px rgba(168, 85, 247, 0.35)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("viewProject")}
                </Button>
              )}

              {links?.map(({ url, iconName }, index) => {
                const isExternal = url.startsWith("http");
                return (
                  <IconButton
                    key={`${url}-${index}`}
                    href={url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    sx={{
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      color: "primary.main",
                      width: 44,
                      height: 44,
                      border: "1px solid rgba(168, 85, 247, 0.2)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 16px rgba(168, 85, 247, 0.3)",
                      },
                    }}
                  >
                    {SUPPORTED_ICONS[iconName]?.component()}
                  </IconButton>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
