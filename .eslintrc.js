module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  globals: {
    NS: true
  },
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    'semi': 0,
    'keyword-spacing': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
