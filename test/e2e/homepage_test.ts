const { I } = inject();

Feature('homepage');


Scenario('Home page is loaded',  async () => {
  I.amOnPage('');
  I.waitForElement('body', 30);
  
  // Wait for JavaScript to execute - the noscript message should disappear
  I.waitForInvisible('noscript', 30);
  
  // Now wait for Vue.js to render the app
  I.waitForElement('#app', 30);
  
  // Debug: Check what's actually rendered in the app
  const appContent = await I.grabTextFrom('#app');
  console.log('App content:', appContent);
  
  // Wait for the navbar to appear - try different selectors
  try {
    I.waitForElement('.navbar', 10);
  } catch(e) {
    console.log('navbar not found, trying b-navbar');
    try {
      I.waitForElement('[class*="navbar"]', 10);
    } catch(e2) {
      console.log('No navbar found, checking for any visible content');
      I.waitForElement('*:visible', 10);
    }
  }
  
  // Finally wait for our target text
  I.waitForText('Write a Test', 30);
});

