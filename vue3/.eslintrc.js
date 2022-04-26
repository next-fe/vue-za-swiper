export default {
  root: true,
  extends: ['airbnb-base'],
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser',
  rules: {
    'no-underscore-dangle': 'off',
    'max-len': ['error', { code: 130 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    semi: ['error', 'never'],
  },
}
