import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        browser: true,
        es2024: true,
        console: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {},
  },
];
