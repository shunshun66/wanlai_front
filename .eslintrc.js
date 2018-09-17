module.exports = {
  root: true,
  // https://github.com/vuejs/eslint-config-vue
  extends: 'vue',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    "no-sequences": [0],
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
    "key-spacing": "off",
    "indent": ["off", 4, {"SwitchCase": 1}],
    "semi": "off",
    "camelcase": ["error", {properties: "never"}]
  },
  globals: {
    "it": true,
    "describe": true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false
  }
}
