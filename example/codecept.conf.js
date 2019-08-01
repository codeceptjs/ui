exports.config = {
  tests: './todomvc-tests/**/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      waitForTimeout: 5000,
      waitForNavigation: 'networkidle0',
      waitForAction: 0,
      show: false,
    },

    REST: {},

    CustomHelper: {
      require: './todomvc-tests/helpers/custom.helper.js'
    }
  },
  include: {
    TodosPage: './todomvc-tests/pages/todos.page.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'codepress demo tests'
}