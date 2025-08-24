"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Select, MenuItem, FormControl } from '@mui/material';
import { useTransition } from 'react';

export default function LanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Remove the current locale from the pathname and add the new one
      const segments = pathname.split('/');
      if (segments[1] === 'en' || segments[1] === 'da') {
        segments[1] = newLocale;
      } else {
        segments.unshift('', newLocale);
      }
      
      router.push(segments.join('/'));
    });
  };

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 100,
        '& .MuiSelect-select': {
          color: 'inherit',
          fontSize: '0.9rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.3)'
        },
        '& .MuiSelect-icon': {
          color: 'inherit'
        }
      }}
    >
      <Select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isPending}
        variant="outlined"
      >
        <MenuItem value="en">{t('english')}</MenuItem>
        <MenuItem value="da">{t('danish')}</MenuItem>
      </Select>
    </FormControl>
  );
}