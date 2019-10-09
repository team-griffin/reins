module.exports = {
  'env': {
    'browser': false,
    'es6': true,
    'node': true,
  },
  'parser': 'typescript-eslint-parser',
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
    },
    'sourceType': 'module',
  },
  'plugins': [
    'typescript',
  ],
  'extends': [
    '@team-griffin/eslint-config/frontend-config/core',
  ],
  'settings': {
    'import/ignore': [
      'svg\'$',
    ],
  },
  'rules': {
    'no-unused-vars': 'off',
    'typescript/no-unused-vars': 'error',
  },
};
