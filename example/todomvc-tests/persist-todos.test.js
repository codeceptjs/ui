Feature('Persist Todos')

Before(async (I, TodosPage) => {
    TodosPage.goto()
  
    TodosPage.enterTodos([
        {title: 'foo', completed: false},
        {title: 'bar', completed: false},
        {title: 'baz', completed: false},
        {title: 'boom', completed: true},
    ])
  })

Scenario('Todos survive a page refresh @step-06', async (I, TodosPage) => {
  I.say('Given I have some todos')

  I.say('When I reload the page')
  TodosPage.refresh()

  I.say('Then I still see the same todos')
  TodosPage.seeNumberOfTodos(4)

  I.saveScreenshot('todos-survive-page-refresh.png')
})
