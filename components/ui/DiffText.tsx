'use client';
import { TypographyProps } from '@mui/material';
import { diffWords } from 'diff';
import React, { CSSProperties } from 'react';

interface DiffTextProps extends Omit<TypographyProps, 'children'> {
  original?: string;
  current?: string;
}

export function DiffText({ original = '', current = '', ...typographyProps }: DiffTextProps) {
  // If original is null/undefined or texts are the same, just show current
  if (original == null || original === current) {
    return <span>{current}</span>;
  }

  // Compute the diff
  const diff = diffWords(original, current);

  // Convert sx prop to CSS properties safely
  const sxStyles: CSSProperties = typographyProps.sx
    ? (typeof typographyProps.sx === 'function'
        ? {} // Skip function-based sx for now
        : typographyProps.sx as CSSProperties)
    : {};

  return (
    <span style={{
      fontSize: typeof typographyProps.fontSize === 'string' || typeof typographyProps.fontSize === 'number' ? typographyProps.fontSize : undefined,
      fontFamily: typeof typographyProps.fontFamily === 'string' ? typographyProps.fontFamily : undefined,
      fontWeight: typeof typographyProps.fontWeight === 'string' || typeof typographyProps.fontWeight === 'number' ? typographyProps.fontWeight : undefined,
      color: typeof typographyProps.color === 'string' ? typographyProps.color : undefined,
      ...sxStyles
    }}>
      {diff.map((part, index) => {
        if (part.removed) {
          // Removed text - red background with strikethrough
          return (
            <span
              key={index}
              style={{
                backgroundColor: '#ffecec',
                textDecoration: 'line-through',
                color: '#b91c1c',
                padding: '0 2px',
                borderRadius: '2px',
              }}
            >
              {part.value}
            </span>
          );
        } else if (part.added) {
          // Added text - green background
          return (
            <span
              key={index}
              style={{
                backgroundColor: '#eaffea',
                color: '#14532d',
                padding: '0 2px',
                borderRadius: '2px',
              }}
            >
              {part.value}
            </span>
          );
        } else {
          // Unchanged text
          return <span key={index}>{part.value}</span>;
        }
      })}
    </span>
  );
}