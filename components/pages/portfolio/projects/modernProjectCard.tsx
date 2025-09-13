import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Project } from "@/types";
import { SUPPORTED_ICONS } from "@/components/icon";
import Image from "next/image";

export const ModernProjectCard = ({ title, description, image, links, tags }: Project) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: 'background.paper',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.3)',
        }
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '45%' },
          height: { xs: '240px', md: '320px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={image}
          alt={`${title} project`}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.3s ease'
          }}
          sizes="(max-width: 768px) 100vw, 45vw"
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.modern-project-card:hover &': {
              opacity: 1,
            }
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '55%' },
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <Box sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              {tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    }
                  }}
                />
              ))}
              {tags.length > 3 && (
                <Chip
                  label={`+${tags.length - 3}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              lineHeight: 1.2,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 3,
              fontSize: '0.95rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Actions */}
        {links && links.length > 0 && (
          <Box sx={{ mt: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {links.map(({ url, iconName }, index) => (
                <IconButton
                  key={`${url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    color: 'primary.main',
                    width: 44,
                    height: 44,
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(168, 85, 247, 0.3)',
                    }
                  }}
                >
                  {SUPPORTED_ICONS[iconName]?.component()}
                </IconButton>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};