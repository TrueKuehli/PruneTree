import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'eslint/config';
import {FlatCompat} from '@eslint/eslintrc';
import eslint from '@eslint/js';

import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsdoc from 'eslint-plugin-jsdoc';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all
});

export default defineConfig([
  {
    files: ['src/**/*.{js,ts}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ].concat(compat.extends(
      "google",
      "plugin:react/recommended",
      "plugin:jsdoc/recommended",
    )),

    plugins: {
      react,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "19.1.0",
      },
      jsdoc: {
        mode: "typescript",
      },
    },

    rules: {
      "linebreak-style": ["error", "unix"],
      "semi": ["error", "always"],

      "max-len": ["error", {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
      }],

      "indent": 0,
      "no-unused-vars": 0,
      "brace-style": 0,

      "react/no-unescaped-entities": 0,

      "jsdoc/require-param-type": 0,  // Types are handled by TypeScript
      "jsdoc/require-returns-type": 0,  // Types are handled by TypeScript
    },
  },
  {
    files: ['test/**/*.{js,ts}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ].concat(compat.extends(
      "google",
      "plugin:react/recommended",
      "plugin:jsdoc/recommended",
    )),

    plugins: {
      react,
    },

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
        ...globals.node,
        ...globals.commonjs,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: '19.1.0',
      },
      jsdoc: {
        mode: "typescript",
      },
    },

    rules: {
      "linebreak-style": ["error", "unix"],
      "semi": ["error", "always"],

      "max-len": ["error", {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
      }],

      "indent": 0,
      "no-unused-vars": 0,
      "brace-style": 0,

      "react/no-unescaped-entities": 0,

      "jsdoc/require-param-type": 0,  // Types are handled by TypeScript
      "jsdoc/require-returns-type": 0,  // Types are handled by TypeScript
    },
  },
]);