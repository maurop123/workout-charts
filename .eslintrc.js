module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'indent': 'warn',
    'space-before-function-paren': 'warn',
    'eol-last': 'warn',
    'spaced-comment': 'warn',
    'padded-blocks': 'warn',
    'no-trailing-spaces': 'warn',
    'array-bracket-spacing': 'warn',
    'no-unused-vars': 'warn',
    'require-await': 'warn'
  }
}