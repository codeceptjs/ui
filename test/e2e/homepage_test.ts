const { I } = inject();

Feature('homepage');


Scenario('Home page is loaded',  () => {
  I.amOnPage('');
  I.waitForText('Write a Test');
  I.waitForElement('.Scenario-detailLink');
});

