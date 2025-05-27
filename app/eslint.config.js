import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json']
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      }
    },
    plugins: {
      react: eslintPluginReact,
      '@typescript-eslint': eslintPluginTs,
      prettier: eslintPluginPrettier
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prettier/prettier': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
