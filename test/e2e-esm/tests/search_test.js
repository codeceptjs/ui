Feature('Search Feature @regression');

Scenario('search for products', ({ I }) => {
  I.amOnPage('/');
  I.fillField('search', 'laptop');
  I.click('Search');
  I.see('Results');
});

Scenario('search with empty query @edge-case', ({ I }) => {
  I.amOnPage('/');
  I.click('Search');
  I.see('Please enter a search term');
});
