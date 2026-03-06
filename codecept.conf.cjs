module.exports = {
  tests: './test/e2e/tests/*.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:3000',
      browser: 'chromium',
      show: false,
    }
  },
  include: {},
  bootstrap: null,
  mocha: {},
  name: 'ui-test'
};