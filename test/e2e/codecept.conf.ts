export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:3333',
      show: false,
      timeout: 30000,
      waitForNavigation: 'load',
      waitForTimeout: 30000,
      chromium: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ]
      }
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'e2e'
}
