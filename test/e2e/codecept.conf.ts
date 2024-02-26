export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:8080',
      show: false
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'e2e'
}
