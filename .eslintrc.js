module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "object-curly-spacing": ["error", "always"],
    "no-trailing-spaces": "error",
    eqeqeq: "error",
    "no-console": 0,
  },
};
