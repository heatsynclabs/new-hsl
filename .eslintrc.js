module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  globals: {
    navigator: true,
    event: true,
    window: true,
    document: true,
    it: true,
    xit: true,
    xdescribe: true,
    describe: true,
    afterEach: true,
    expect: true,
    fetch: true,
    FormData: true,
    importScripts: true,
    workbox: true,
    Image: true,
    self: true,
    caches: true,
  },
  rules: {
    "no-console": "off",
    "consistent-return": [0, { treatUndefinedAsUnspecified: true }],
    "no-extraneous-dependencies": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "no-shadow": "off",
    camelcase: "off",
    "prefer-template": "off",
    "object-curly-newline": "off",
    "arrow-body-style": "off",
    "import/no-named-as-default": "off",
    "comma-dangle": 1,
    "max-len": "off",
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": "off",
    "react/jsx-boolean-value": 0,
    "jsx-a11y/href-no-hash": "off",
    "react/jsx-filename-extension": 0,
    "react/forbid-prop-types": 0,
    "react/prefer-stateless-function": "off",
    "no-restricted-globals": "off",
  },
};
