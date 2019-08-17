Feature('hello')

Scenario('test', (I) => {
  I.amOnPage('http://www.check24.de')
  I.see('Die meistgenutzten')
  // I.click({ css: '[title="Versicherungen"] > *'})
  I.scrollTo(locate('.c24-scrolling-title').withText('Shopping Bestseller').as('Shopping Bestseller'))
  
  I.clickLink(locate('.c24-nav-ele > [title="Fl\\FCge"] > *').as('Flüge'))
  I.fillField('#dptVisible', 'München')
  I.fillField('#dstVisible', 'Marokko')
  I.clickLink('#search-flights-submit')

  I.waitForInvisible('#wait-page')
  I.waitForVisible('#fastest-offer #featured-best-sort')
  I.click('#fastest-offer #featured-best-sort')
  I.waitForInvisible('.is-loading-big')
  I.waitForInvisible('#wait-page')

  I.saveScreenshot('final.png')
})