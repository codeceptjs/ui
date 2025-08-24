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
        executablePath: '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--no-first-run',
          '--no-default-browser-check'
        ]
      }
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'e2e'
}
