module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module',
      'ecmaFeatures': {
      'experimentalObjectRestSpread': true
    }
  },
  'rules': {
    'no-console': 'off',
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  'globals': {
    '$': true,
    '__dirname': true,
    'process': true,
    'phantom': true
  }
};
