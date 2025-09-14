'use client';
import { TypographyProps } from '@mui/material';
import { diffWords } from 'diff';
import React from 'react';

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

  return (
    <span style={{
      fontSize: typographyProps.fontSize,
      fontFamily: typographyProps.fontFamily,
      fontWeight: typographyProps.fontWeight,
      color: typographyProps.color as string,
      // Apply any other typography styles
      ...(typographyProps.sx as any || {})
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