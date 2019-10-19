Feature: Create Todos with BDD

Scenario: Create a single todo item @bdd
  Given I have an empty todo list
  When I create a todo 1
  Then I see the new todo on my list

Scenario: Create multiple todos @bdd
  Given I have these todos on my list
    | name         |
    | Milk         |
    | Butter       |
    | Bread        |
  When I add 2 more todos
  Then  I see 4 todos on my list