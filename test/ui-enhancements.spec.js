const test = require('ava');
const fs = require('fs');
const path = require('path');

test('Enhanced UI components exist and have proper structure', (t) => {
  const enhancedLoadingPath = path.join(__dirname, '..', 'src', 'components', 'EnhancedLoading.vue');
  const toastNotificationPath = path.join(__dirname, '..', 'src', 'components', 'ToastNotification.vue');
  
  // Check that enhanced loading component exists
  t.true(fs.existsSync(enhancedLoadingPath), 'EnhancedLoading component should exist');
  
  // Check that toast notification component exists
  t.true(fs.existsSync(toastNotificationPath), 'ToastNotification component should exist');
  
  const loadingContent = fs.readFileSync(enhancedLoadingPath, 'utf8');
  const toastContent = fs.readFileSync(toastNotificationPath, 'utf8');
  
  // Check enhanced loading features
  t.true(loadingContent.includes('progress-indicator'), 'Loading should support progress indication');
  t.true(loadingContent.includes('cancellable'), 'Loading should support cancellation');
  t.true(loadingContent.includes('backdrop-filter'), 'Loading should have modern backdrop blur');
  
  // Check toast notification features
  t.true(toastContent.includes('toast-success'), 'Toast should support success type');
  t.true(toastContent.includes('toast-error'), 'Toast should support error type');
  t.true(toastContent.includes('dismissible'), 'Toast should be dismissible');
  t.true(toastContent.includes('transition-group'), 'Toast should have smooth animations');
});

test('TestStatistics component has enhanced visual feedback', (t) => {
  const testStatsPath = path.join(__dirname, '..', 'src', 'components', 'TestStatistics.vue');
  const content = fs.readFileSync(testStatsPath, 'utf8');
  
  // Check for progress bars
  t.true(content.includes('progress-bar'), 'Should have progress bars for test results');
  t.true(content.includes('successPercentage'), 'Should calculate success percentage');
  t.true(content.includes('failedPercentage'), 'Should calculate failed percentage');
  
  // Check for badge styling
  t.true(content.includes('success-badge'), 'Should have styled success badges');
  t.true(content.includes('error-badge'), 'Should have styled error badges');
  t.true(content.includes('total-badge'), 'Should have styled total count badge');
  
  // Check for enhanced running state
  t.true(content.includes('running-indicator'), 'Should have running indicator');
  t.true(content.includes('pulse-button'), 'Should have pulsing pause button');
});

test('Step component has enhanced visual indicators', (t) => {
  const stepPath = path.join(__dirname, '..', 'src', 'components', 'Step.vue');
  const content = fs.readFileSync(stepPath, 'utf8');
  
  // Check for status icons
  t.true(content.includes('stepStatusIcon'), 'Should have step status icons');
  t.true(content.includes('step-passed'), 'Should have passed step styling');
  t.true(content.includes('step-failed'), 'Should have failed step styling');
  
  // Check for duration badges
  t.true(content.includes('duration-badge'), 'Should have duration badges');
  t.true(content.includes('duration-fast'), 'Should classify fast steps');
  t.true(content.includes('duration-slow'), 'Should classify slow steps');
  
  // Check for console badges
  t.true(content.includes('console-badge'), 'Should have console log badges');
});

test('IDE-like split view is implemented in ScenariosPage', (t) => {
  const scenariosPagePath = path.join(__dirname, '..', 'src', 'components', 'pages', 'ScenariosPage.vue');
  const content = fs.readFileSync(scenariosPagePath, 'utf8');
  
  // Check for IDE layout structure
  t.true(content.includes('ide-layout'), 'Should have IDE layout container');
  t.true(content.includes('test-list-panel'), 'Should have test list panel');
  t.true(content.includes('test-preview-panel'), 'Should have test preview panel');
  
  // Check for responsive behavior
  t.true(content.includes('with-preview'), 'Should have conditional preview state');
  t.true(content.includes('window.innerWidth >= 1024'), 'Should be responsive to screen size');
  
  // Check for code display
  t.true(content.includes('test-code'), 'Should display test code');
  t.true(content.includes('loadTestCode'), 'Should load test code dynamically');
});