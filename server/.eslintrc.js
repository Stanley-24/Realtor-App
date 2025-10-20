export const parser = '@typescript-eslint/parser';
export const exTends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier', // Ensures Prettier takes precedence over linting formatting rules
];
export const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
};
export const env = {
  node: true,
  es2020: true,
};
export const rules = {
  // Add specific rules here if needed
  '@typescript-eslint/explicit-module-boundary-types': 'off',
};
