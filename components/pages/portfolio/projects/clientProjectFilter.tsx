"use client";
import { Project } from "@/types";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCallback } from 'react';
import { Box, Chip } from "@mui/material";
import { BRAND_COLORS } from "@/app/colors";

type ClientProjectFilterProps = {
  allProjects: Project[];
  uniqueTags: string[];
  initialSelectedTags?: string[];
};

const ClientProjectFilter = ({
  uniqueTags,
  initialSelectedTags = []
}: ClientProjectFilterProps) => {
  const t = useTranslations('projects');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const labels = {
    en: { tag: 'tag', tags: 'tags', selected: 'selected' },
    da: { tag: 'tag', tags: 'tags', selected: 'valgt' },
    sv: { tag: 'tagg', tags: 'taggar', selected: 'valda' },
  }[locale as 'en' | 'da' | 'sv'] || { tag: 'tag', tags: 'tags', selected: 'selected' };

  // Get selected tags from URL or use initial
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || initialSelectedTags;

  const handleTagToggle = useCallback((tag: string) => {
    console.log('ClientProjectFilter - handleTagToggle called with tag:', tag);
    console.log('ClientProjectFilter - current selectedTags:', selectedTags);

    const params = new URLSearchParams(searchParams);

    let newTags: string[];
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      newTags = selectedTags.filter(t => t !== tag);
      console.log('ClientProjectFilter - removing tag, newTags:', newTags);
    } else {
      // Add tag if not selected
      newTags = [...selectedTags, tag];
      console.log('ClientProjectFilter - adding tag, newTags:', newTags);
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    console.log('ClientProjectFilter - navigating to URL:', newUrl);
    router.push(newUrl);
  }, [router, pathname, searchParams, selectedTags]);

  const handleClearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <Box sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      px: 2,
      mb: 2
    }}>
      {/* Tag chips */}
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 1,
        maxWidth: "800px",
        width: "100%"
      }}>
        {/* All Projects chip */}
        <Chip
          label={t('allProjects')}
          onClick={handleClearAll}
          sx={{
            backgroundColor: selectedTags.length === 0 ? BRAND_COLORS.accent : 'transparent',
            color: selectedTags.length === 0 ? '#ffffff' : BRAND_COLORS.secondary,
            border: `1px solid ${selectedTags.length === 0 ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.primaryRgb}, 0.3)`}`,
            fontWeight: 500,
            fontSize: '0.875rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: selectedTags.length === 0 ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
              borderColor: BRAND_COLORS.accent,
              transform: 'translateY(-2px)',
            }
          }}
        />

        {/* Individual tag chips */}
        {uniqueTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => handleTagToggle(tag)}
            sx={{
              backgroundColor: selectedTags.includes(tag) ? BRAND_COLORS.accent : 'transparent',
              color: selectedTags.includes(tag) ? '#ffffff' : BRAND_COLORS.secondary,
              border: `1px solid ${selectedTags.includes(tag) ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.primaryRgb}, 0.3)`}`,
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: selectedTags.includes(tag) ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
                borderColor: BRAND_COLORS.accent,
                transform: 'translateY(-2px)',
              }
            }}
          />
        ))}
      </Box>

      {/* Selected count indicator */}
      {selectedTags.length > 0 && (
        <Box sx={{
          fontSize: '0.875rem',
          color: BRAND_COLORS.secondary,
        }}>
          {selectedTags.length} {selectedTags.length === 1 ? labels.tag : labels.tags} {labels.selected}
        </Box>
      )}
    </Box>
  );
};

export default ClientProjectFilter;
