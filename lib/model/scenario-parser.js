const SimpleScenario = `
Feature('Hello World')

Scenario('Goto CHECK24', (I) => {
    I.amOnPage('http://www.check24.de')
    I.see('Die meistgenutzten Vergleiche')

    I.click('.c24-customer-hover')
    I.clickLink('Anmelden')
   
    brk()
})
`

const MultipleScenario = `
Data(examples).Scenario(\`Todos containing weird characters\`, async (I, current, TodosPage) => {
  I.say('When I enter {Todo Text}')
  TodosPage.enterTodo(current['Todo Text'])

  I.say('Then I see {Result}')
  if (current['Result'] === 'is in list') {
    TodosPage.seeNthTodoEquals(1, current['Todo Text'])
  }
})

Scenario('Text input field should be "cleared" after each item', async (I, TodosPage) => {
  I.say('Given I have an empty todo list')
  I.say('When I enter a new todo')
  TodosPage.enterTodo('foo')

  I.say('Then I see that the input field has been cleared')
  TodosPage.seeEmptyTodoInput()
})

Scenario("Text input should be trimmed", async (I, TodosPage) => {
  I.say('Given I have an empty todo list')
  I.say('When I enter a todo with whitespace around the text')
  TodosPage.enterTodo('       Todo with lots of whitespace around       ')

  I.say('Then I see the trimmed text of the todo in the list')
  await TodosPage.seeNthTodoEquals(1, 'Todo with lots of whitespace around')
})
`

const removeTags = (str, tags) => tags ? tags.reduce((agg, tag) => agg.replace(tag, ''), str) : str
const onlyUnique = (value, index, self) => self.indexOf(value) === index
const extractTags = (str) => {
  // First throw away any data in the suite title
  const parts = str.split('|')
  const title = parts[0]
  const data = parts[1]

  // Extract tags from the rest
  const m = title.match(/(@[^\s]+)/g)

  let titleWithoutTags = removeTags(title, m).trim()
  if (data) titleWithoutTags += ' | ' + data

  return {
      tags: m ? m.filter(onlyUnique) : [],
      title: titleWithoutTags,
      orgTitle: str
  }
}

const getFeatureAndScenarios = (sourceCode) => {
  const reScenario = /\s*Scenario\s*\((?:'|"|`)(.*)(?:'|"|`)/g;
  let feature, scenarios = [];

  let m = sourceCode.match(/\s*Feature\s*\((?:'|"|`)(.*)(?:'|"|`)/);
  if (m) {
    feature = m[1];
  }

  do {
    m = reScenario.exec(sourceCode);
    if (m) {
      scenarios.push(m[1]);
    }
  } while (m);

  const featureWithTags = extractTags(feature);
  const scenariosWithTags = scenarios.map(extractTags);

  return {
    feature: featureWithTags,
    scenarios: scenariosWithTags    
  }
}

// let res;
// res = getFeatureAndScenarios(SimpleScenario);
// console.log(res);

// res = getFeatureAndScenarios(MultipleScenario);
// console.log(res);


module.exports = {
  getFeatureAndScenarios,
}