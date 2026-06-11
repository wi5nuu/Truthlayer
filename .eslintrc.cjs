const { resolve } = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true, webextensions: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['web/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
