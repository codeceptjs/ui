Feature('Super cool Feature')

Scenario('Goto CHECK24 home', (I) => {
  I.amOnPage('http://www.check24.de')
  I.see('Die meistgenutzten')
  I.saveScreenshot('final.png')
})

Scenario('When I search for react jobs I should get matching job offers @search @jobs',
async (I) => {
  I.say('I goto the CHECK24 job portal')
  I.amOnPage('https://jobs.check24.de/')

  I.say('I search for react jobs')
  I.fillField('body #search', 'react docker')
  I.click('.btn.btn-m.primary.block') // Depending on the screen size there may be two such elements

  I.say('I see 4 vacancies')
  I.waitInUrl('/search')
  I.seeElementInDOM('.filter--section')
  I.seeNumberOfVisibleElements('.vacancy--boxitem', 4)
})

Scenario('When I search for .NET jobs I should get matching job offers @search @jobs',
async (I) => {
  I.say('I goto the CHECK24 job portal')
  I.amOnPage('https://jobs.check24.de/')

  I.say('I search for C# jobs')
  I.fillField('body #search', 'c#')
  I.click('.btn.btn-m.primary.block')

  I.say('I see 6 vacancies')
  I.waitInUrl('/search')
  I.seeElementInDOM('.filter--section')
  I.seeNumberOfVisibleElements('.vacancy--boxitem', 4)
})
