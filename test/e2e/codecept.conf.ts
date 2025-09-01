export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:3333',
      show: false,
      timeout: 60000,
      waitForNavigation: 'load',
      waitForTimeout: 60000,
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
          '--no-default-browser-check',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--force-color-profile=srgb',
          '--memory-pressure-off',
          '--max_old_space_size=4096'
        ]
      }
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'e2e'
}
