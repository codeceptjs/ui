const { I } = inject();

Feature('homepage');

Before(() => {
  I.amOnPage('');
})

Scenario('See write a test button',  () => {
  I.waitForText('Write a Test');
});

Scenario('See scenario detail link',  () => {
  I.waitForElement('.Scenario-detailLink');
});

