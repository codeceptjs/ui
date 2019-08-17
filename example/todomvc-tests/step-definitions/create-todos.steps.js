const { I, TodosPage } = inject();

Given('I have an empty todo list', () => {
  TodosPage.goto()
})

When(/I create a todo (\d+)/, (todo) => {
  TodosPage.enterTodo(todo)
})

Then('I see the new todo on my list', (todo) => {
  I.see(todo)
})