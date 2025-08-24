"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Select, MenuItem, FormControl, Box } from '@mui/material';
import { useTransition } from 'react';
import { US } from 'country-flag-icons/react/3x2';
import { DK } from 'country-flag-icons/react/3x2';
import { SE } from 'country-flag-icons/react/3x2';

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
      if (segments[1] === 'en' || segments[1] === 'da' || segments[1] === 'sv') {
        segments[1] = newLocale;
      } else {
        segments.unshift('', newLocale);
      }
      
      router.push(segments.join('/'));
    });
  };
  
  const getFlagComponent = (locale: string) => {
    const flagProps = { width: 20, height: 15, style: { marginRight: 8 } };
    switch (locale) {
      case 'en': return <US {...flagProps} />;
      case 'da': return <DK {...flagProps} />;
      case 'sv': return <SE {...flagProps} />;
      default: return <US {...flagProps} />;
    }
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
        renderValue={(value) => (
          <Box display="flex" alignItems="center">
            {getFlagComponent(value as string)}
            {value === 'en' ? t('english') : value === 'da' ? t('danish') : t('swedish')}
          </Box>
        )}
      >
        <MenuItem value="en">
          <Box display="flex" alignItems="center">
            {getFlagComponent('en')}
            {t('english')}
          </Box>
        </MenuItem>
        <MenuItem value="da">
          <Box display="flex" alignItems="center">
            {getFlagComponent('da')}
            {t('danish')}
          </Box>
        </MenuItem>
        <MenuItem value="sv">
          <Box display="flex" alignItems="center">
            {getFlagComponent('sv')}
            {t('swedish')}
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}