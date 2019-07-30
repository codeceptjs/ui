exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      waitForTimeout: 5000,
      waitForNavigation: 'networkidle0',
      waitForAction: 0,
      show: true,
    },

    REST: {}
  },
  include: {},
  mocha: {},
  name: 'codepress demo tests'
}