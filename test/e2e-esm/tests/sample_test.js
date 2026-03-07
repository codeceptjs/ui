Feature('Sample Feature');

Scenario('sample test', ({ I }) => {
  I.amOnPage('/');
});

Scenario('another test', ({ I }) => {
  I.amOnPage('/');
  I.see('Welcome');
});
