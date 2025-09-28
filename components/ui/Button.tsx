"use client";
import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BRAND_COLORS } from '@/app/colors';

// Define our custom variants
type CustomButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'nav';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: CustomButtonVariant;
  isActive?: boolean;
  target?: string;
  rel?: string;
  loading?: boolean;
}

const StyledButton = styled(MuiButton)<{
  customvariant: CustomButtonVariant;
  isactive?: boolean;
  isloading?: boolean;
}>(({ customvariant, isactive, isloading }) => {
  const baseStyles = {
    borderRadius: '12px',
    fontWeight: 500,
    textTransform: 'none' as const,
    fontSize: '0.95rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    cursor: isloading ? 'default' : 'pointer',
    '&:focus-visible': {
      outline: `2px solid ${BRAND_COLORS.accent}`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      backgroundColor: isloading ? undefined : 'rgba(0, 0, 0, 0.12)',
      color: isloading ? undefined : undefined,
    },
  };

  switch (customvariant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: BRAND_COLORS.accent,
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'rgba(168, 85, 247, 0.9)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      };
    
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: BRAND_COLORS.primary,
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          transform: 'translateY(-1px)',
        },
      };
    
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: BRAND_COLORS.primary,
        border: `1px solid rgba(255, 255, 255, 0.3)`,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
      };
    
    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: BRAND_COLORS.primary,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      };
    
    case 'nav':
      const isActiveState = isactive;
      return {
        ...baseStyles,
        borderRadius: '20px',
        px: 3,
        py: 1,
        minHeight: 40,
        color: isActiveState ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
        backgroundColor: isActiveState ? BRAND_COLORS.accent : 'transparent',
        border: isActiveState ? `1px solid rgba(168, 85, 247, 0.3)` : '1px solid transparent',
        position: 'relative',
        overflow: 'hidden',
        '&::before': isActiveState ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
          borderRadius: '20px',
        } : {},
        '&:hover': {
          backgroundColor: isActiveState ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255, 255, 255, 0.08)',
          color: '#ffffff',
          transform: 'translateY(-1px)',
        },
      };
    
    default:
      return baseStyles;
  }
});

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isActive = false,
  loading = false,
  target,
  rel,
  children,
  ...props
}) => {
  return (
    <StyledButton
      customvariant={variant}
      isactive={isActive}
      isloading={loading}
      disabled={loading || props.disabled}
      href={target}
      rel={rel}
      {...props}
    >
      <span style={{ opacity: loading ? 0.3 : 1 }}>
        {children}
      </span>
      {loading && (
        <CircularProgress
          size={16}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: variant === 'primary' ? '#ffffff' : BRAND_COLORS.accent,
          }}
        />
      )}
    </StyledButton>
  );
};

export default Button;