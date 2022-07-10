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
    // 'plugin:nuxt/recommended'
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
    'require-await': 'warn',
    'dot-notation': 'warn',
    'object-curly-spacing': 'warn',
    'comma-spacing': 'warn',
    'comma-dangle': 'warn',
    'no-multiple-empty-lines': 'warn',
    'eqeqeq': 'warn',
    'arrow-parens': 'warn',
    'curly': 'warn',
    'import/first': 'warn',
    'semi': 'warn',
    'quotes': 'warn',
    'vue/max-attributes-per-line': 'warn',
    'quote-props': 'warn',
    'space-in-parens': 'warn',
    'no-tabs': 'warn',
    'no-mixed-spaces-and-tabs': 'warn'
  }
}
