import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['chrome-extension/webpack/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'react/no-unknown-property': ['error', { ignore: ['intensity', 'position', 'color', 'geometry', 'material', 'args'] }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'coverage/**',
  ]),
]);
