/**
 * ESLint flat config (ESLint 9+).
 *
 * Minimal setup focused on catching real bugs, not styling. We deliberately
 * turn off prop-types (we don't use them) and rules that would create noise
 * for this codebase's conventions (e.g. inline styles on JSX).
 *
 * Run with:  npm run lint
 */
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', 'scripts'] },

  // Base JS rules
  js.configs.recommended,

  // App source files
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: '18.3' },
    },
    rules: {
      // React recommended + JSX runtime (no React import needed)
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Turn off: we don't use PropTypes (JSDoc is the plan when we want types)
      'react/prop-types': 'off',

      // Turn off: too noisy for real product copy (apostrophes, quotes)
      'react/no-unescaped-entities': 'off',

      // We use target.value — React handles it
      'react/no-unknown-property': ['error', { ignore: ['data-screen-label'] }],

      // Allow unused vars only when prefixed with _
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],

      // Catch typos early
      'no-undef': 'error',
      'no-console': 'off',
    },
  },

  // Config files run in Node
  {
    files: ['*.config.js', 'vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
