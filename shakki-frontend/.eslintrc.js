module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "cypress/globals": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:cypress/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "cypress"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "react/prop-types": 0
  }
}