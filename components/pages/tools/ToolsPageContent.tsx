"use client";

import { Box, Card, CardActionArea, CardContent, Typography, Container } from "@mui/material";
import { Brush, Email } from "@mui/icons-material";
import PageWrapper from "../pageWrapper";
import { BRAND_COLORS } from "@/app/colors";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ToolsPageContentProps = {
  title: string;
  locale: string;
};

const tools = [
  {
    id: "email-signature",
    icon: Email,
    titleKey: "emailSignature",
    descriptionKey: "emailSignatureDesc",
    path: "/signature-generator",
  },
  {
    id: "background-removal",
    icon: Brush,
    titleKey: "backgroundRemoval",
    descriptionKey: "backgroundRemovalDesc",
    path: "/background-removal",
  },
];

export default function ToolsPageContent({ title, locale }: ToolsPageContentProps) {
  const router = useRouter();
  const t = useTranslations('tools');

  return (
    <PageWrapper title={title}>
      <Container maxWidth="md">
        <Typography
          variant="body1"
          sx={{
            color: BRAND_COLORS.primary,
            mb: 4,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          {t('description')}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                sx={{
                  backgroundColor: BRAND_COLORS.dark,
                  border: `1px solid ${BRAND_COLORS.secondary}40`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: BRAND_COLORS.accent,
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${BRAND_COLORS.accent}40`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => router.push(`/${locale}${tool.path}`)}
                  sx={{ p: 3, height: "100%" }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          backgroundColor: `${BRAND_COLORS.accent}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: BRAND_COLORS.accent }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: BRAND_COLORS.primary,
                          fontWeight: 600,
                        }}
                      >
                        {t(tool.titleKey)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: BRAND_COLORS.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {t(tool.descriptionKey)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Container>
    </PageWrapper>
  );
}
