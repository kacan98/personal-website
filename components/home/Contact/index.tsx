"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { BRAND_COLORS, BRAND_RGBA } from "@/app/colors";
import Grid from "@mui/material/Grid";
import { Email, LinkedIn, GitHub, Language } from "@mui/icons-material";
import { motion } from "motion/react";
import { useTranslations } from 'next-intl';

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  description?: string;
}

interface ContactProps {
  title?: string;
  subtitle?: string;
  contactItems?: ContactItem[];
}

export default function Contact({ 
  title,
  subtitle,
  contactItems
}: ContactProps) {
  const t = useTranslations('contact');
  
  const defaultContactItems = [
    {
      icon: <Email />,
      label: t('email.label'),
      value: "karel.cancara@gmail.com", 
      href: "mailto:karel.cancara@gmail.com",
      description: t('email.description')
    },
    {
      icon: <LinkedIn />,
      label: t('linkedin.label'),
      value: "linkedin.com/in/kcancara",
      href: "https://www.linkedin.com/in/kcancara",
      description: t('linkedin.description')
    },
    {
      icon: <GitHub />,
      label: t('github.label'),
      value: "github.com/kacan98",
      href: "https://github.com/kacan98",
      description: t('github.description')
    },
    {
      icon: <Language />,
      label: t('portfolio.label'),
      value: "kcancara.vercel.app",
      href: "https://kcancara.vercel.app/",
      description: t('portfolio.description')
    }
  ];
  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      marginLeft: 'calc(50% - 50vw)',
      marginRight: 'calc(50% - 50vw)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at center, rgba(${BRAND_COLORS.accentRgb}, 0.05) 0%, transparent 70%)`,
        zIndex: 0,
      }
    }}>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, md: 4 }
      }}>
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SectionHeader
            title={title || t('title')}
            description={subtitle || t('subtitle')}
          />
        </motion.div>

        {/* Contact Cards */}
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {(contactItems || defaultContactItems).map((item, index) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                style={{ height: '100%' }}
              >
                <Card 
                  component="a"
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.4s ease',
                    textDecoration: 'none',
                    display: 'block',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                      background: `linear-gradient(135deg, rgba(${BRAND_COLORS.accentRgb}, 0.2) 0%, rgba(${BRAND_COLORS.accentRgb}, 0.1) 100%)`,
                      borderColor: BRAND_RGBA.accentBorder,
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ 
                      mb: 2,
                      color: 'secondary.main',
                      '& svg': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {item.icon}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      {item.label}
                    </Typography>
                    
                    {item.description && (
                      <Typography 
                        variant="body2" 
                        component="div"
                        sx={{ 
                          mb: 2,
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                    
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ 
                        color: 'secondary.light',
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
            <Button
              component="a"
              href="mailto:karel.cancara@gmail.com"
              variant="primary"
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              {t('sendEmail')}
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}