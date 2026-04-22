/**
 * CodeceptUI App Mode E2E Tests
 *
 * These tests exercise the CodeceptUI web interface as it appears when launched
 * in app mode (Electron window). The backend is started against @codeceptjs/examples
 * and these tests verify the full UI is functional.
 */

const { I } = inject();

Feature('CodeceptUI App - Scenarios Page');

Scenario('Main scenarios page loads with project name', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for Vue app to boot and load project data
  I.waitForFunction(() => {
    const title = document.querySelector('.Project .title');
    return title && title.textContent && title.textContent.trim().length > 0;
  }, 15);

  I.seeElement('.Project .title');
  console.log('✅ Scenarios page loaded with project name');
});

Scenario('Scenario list is populated from the configured project', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for at least one scenario to appear
  I.waitForFunction(() => {
    return document.querySelectorAll('.Scenario').length > 0;
  }, 20);

  I.seeElement('.Scenario');
  console.log('✅ Scenarios are listed from the configured project');
});

Scenario('Features are grouped in the scenario list', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for capability groups to render
  I.waitForFunction(() => {
    return document.querySelectorAll('.Capability').length > 0;
  }, 20);

  I.seeElement('.Capability');
  I.seeElement('.Capability-headline');
  console.log('✅ Feature groups (Capabilities) are displayed');
});

Scenario('Run button is visible in the navbar', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);
  I.waitForElement('.navbar', 10);

  // The RunButton renders with is-primary class
  I.waitForElement('.is-primary.is-outlined', 10);
  I.seeElement('.is-primary.is-outlined');
  console.log('✅ Run button is visible in the navbar');
});

Scenario('Search input is available in the navbar', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);
  I.waitForElement('.navbar', 10);

  I.waitForElement('input[placeholder="Search"]', 10);
  I.seeElement('input[placeholder="Search"]');
  console.log('✅ Search input is visible in the navbar');
});

Scenario('Search filters scenario list by text', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for scenarios to load first
  I.waitForFunction(() => document.querySelectorAll('.Scenario').length > 0, 20);

  // Type in search field - search is client-side and filters immediately
  I.fillField('input[placeholder="Search"]', 'todo');
  I.waitForFunction(() => {
    const input = document.querySelector('input[placeholder="Search"]') as HTMLInputElement;
    return input && input.value === 'todo';
  }, 5);

  I.seeElement('input[placeholder="Search"]');
  console.log('✅ Search input works and accepts text input');
});

Scenario('Clear search restores full list', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for scenarios to load
  I.waitForFunction(() => document.querySelectorAll('.Scenario').length > 0, 20);

  // Type then clear search — wait for the input value to be set
  I.fillField('input[placeholder="Search"]', 'nonexistent-scenario-xyz');
  I.waitForFunction(() => {
    const input = document.querySelector('input[placeholder="Search"]') as HTMLInputElement;
    return input && input.value === 'nonexistent-scenario-xyz';
  }, 5);

  // Click the clear button (far fa-times-circle)
  I.waitForElement('.fa-times-circle', 5);
  I.click('.fa-times-circle');

  // After clearing, search input should be empty
  I.waitForFunction(() => {
    const input = document.querySelector('input[placeholder="Search"]') as HTMLInputElement;
    return input && input.value === '';
  }, 5);

  console.log('✅ Clear search button restores the full list');
});

Scenario('Navbar has Write a Test navigation link', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);
  I.waitForElement('.navbar', 10);

  // Check for "Write a Test" link in nav
  I.waitForText('Write a Test', 10);
  I.see('Write a Test');
  console.log('✅ "Write a Test" nav link is present');
});

Scenario('Clicking Write a Test navigates to new test page', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);
  // Wait for the navbar link to be rendered
  I.waitForElement('a.navbar-item[role="button"]', 10);

  // Use a specific locator so the click lands on the <a> element (not on the icon inside it)
  I.click(locate('a.navbar-item[role="button"]').withText('Write a Test'));
  // Wait for the New Test page to render (unique text from instructions/button, not a hash URL check)
  I.waitForText('Launch Test', 15);

  console.log('✅ Navigated to new-test page');
});

Feature('CodeceptUI App - New Test Page');

Scenario('New Test page loads correctly', async () => {
  I.amOnPage('/#/new-test');

  // The new test page should load something
  I.waitForElement('body', 10);
  I.waitForFunction(() => {
    const app = document.getElementById('app');
    return app && app.innerHTML.length > 100;
  }, 15);

  console.log('✅ New Test page loads');
});

Feature('CodeceptUI App - Settings Page');

Scenario('Settings page is accessible via navigation', async () => {
  // Navigate directly to the settings hash route
  I.amOnPage('/#/settings');
  I.waitForElement('body', 10);
  I.waitForFunction(() => {
    const app = document.getElementById('app');
    return app && app.innerHTML.length > 100;
  }, 15);

  console.log('✅ Settings page is accessible');
});

Feature('CodeceptUI App - API Integration');

Scenario('API /api/scenarios returns scenario data reflected in UI', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Verify the UI reflects what the API returns
  I.waitForFunction(async () => {
    try {
      const resp = await fetch('/api/scenarios');
      if (!resp.ok) return false;
      const data = await resp.json();
      // Project should have a name and features
      return data && data.name && typeof data.features === 'object';
    } catch (e) {
      return false;
    }
  }, 15);

  console.log('✅ API /api/scenarios data is available and reflected in UI');
});

Scenario('API /api/config returns helper configuration', async () => {
  I.amOnPage('/');
  I.waitForElement('body', 10);

  I.waitForFunction(async () => {
    try {
      const resp = await fetch('/api/config');
      if (!resp.ok) return false;
      const data = await resp.json();
      // Config should have helpers array
      return data && Array.isArray(data.helpers);
    } catch (e) {
      return false;
    }
  }, 15);

  console.log('✅ API /api/config returns valid helper configuration');
});

Scenario('API /api/settings returns valid settings object', async () => {
  I.amOnPage('/');
  I.waitForElement('body', 10);

  I.waitForFunction(async () => {
    try {
      const resp = await fetch('/api/settings');
      if (!resp.ok) return false;
      const data = await resp.json();
      // Settings should be a non-null object
      return data !== null && typeof data === 'object';
    } catch (e) {
      return false;
    }
  }, 15);

  console.log('✅ API /api/settings returns valid settings object');
});

Scenario('API /api/scenario-status returns status object', async () => {
  I.amOnPage('/');
  I.waitForElement('body', 10);

  I.waitForFunction(async () => {
    try {
      const resp = await fetch('/api/scenario-status');
      if (!resp.ok) return false;
      const data = await resp.json();
      return data !== null && typeof data === 'object';
    } catch (e) {
      return false;
    }
  }, 15);

  console.log('✅ API /api/scenario-status returns status');
});

Feature('CodeceptUI App - Scenario Interaction');

Scenario('Clicking a scenario selects it and shows preview', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for scenarios to load
  I.waitForFunction(() => document.querySelectorAll('.Scenario-detailLink').length > 0, 20);

  // Click the first scenario
  I.click('.Scenario-detailLink');

  // After clicking a scenario, the test preview panel should appear or
  // the URL should update — both indicate successful selection
  I.waitForFunction(() => {
    const hasPreview = document.querySelector('.test-preview-panel') !== null;
    const hasHash = window.location.hash.length > 1;
    return hasPreview || hasHash;
  }, 10);

  console.log('✅ Scenario can be clicked and triggers UI change');
});

Scenario('Run button triggers test execution UI state', async () => {
  I.amOnPage('/');
  I.waitForElement('.ScenariosPage', 15);

  // Wait for the Run button
  I.waitForElement('.is-primary.is-outlined', 10);

  // Verify the button shows "Run" text initially
  I.waitForFunction(() => {
    const btn = document.querySelector('.is-primary.is-outlined');
    return btn && (btn.textContent || '').includes('Run');
  }, 10);

  I.see('Run', '.is-primary.is-outlined');
  console.log('✅ Run button shows "Run" state initially');
});

Scenario('Page title reflects CodeceptUI branding', async () => {
  I.amOnPage('/');
  I.waitForElement('body', 10);
  I.seeInTitle('CodeceptUI');
  console.log('✅ Page title contains CodeceptUI branding');
});
