/** @type {CodeceptJS.MainConfig} */
export const config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost',
      show: false,
    },
  },
  include: {},
  name: 'e2e-esm-tests',
};
