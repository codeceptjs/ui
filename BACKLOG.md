## v0.1.5

- Use Buefiy
- Fix error message
- Make steps selectable
- Make screenshot only on certain steps
- Store test execution data in vuex
- Store tests and executed steps
- Run everything in one command
- Use font awesome
- distinguish html xml
- Parse xml
- Show html snapshot in iframe
- Persist vuex state
- Make absolute link href="node_modules/..."
- Steps: Format assertion steps ala cypress
- Steps: Format presskey steps using key icon
- Proxy http calls from dev server to api backend
- Implement API route which returns html snapshot
- Highlight element in html snapshot using selector from step
- Highlight elements in iframe when hovering
- Highlight: Show css sel for highlighted element
- Selectors: Use value property of object literals
- codepress command should copy support files to current test project (helpers etc.)
- Implement pause() with websockets
- Codepress should serve vuejs app from codepress dir
- Bug: Error step not shown
- codepress should list tests
- Select a scenario and run it
- Add realtime report helper on the fly
- Add a button to run a test again
- make http method  equal width
- Make icons equal width
- "Back to Scenarios" button
- Fix error screenshot/snapshot
- Show loading spinner when test runs
- Send highlighted element to cli / "clipboard"
- Should throttle mousemove over iframe (high cpu usage with all that selector stuff)
- BUG finder sometimes does not generate selectors
- Highlight elements in screenshot
- Fix console error message
- waitForVisible: format locator builders correctly
- click with 2 parameters: format selector correctly
- Show final passed label with duration
- Html Snapshot: Improve using code from heimdal
- HtmlSnapshot: Remove all script tags to prevent interference with codepress
- Steps: Special xxxCookie step
- Steps: Make a special refreshPage step
- Steps: Make a special executeScript step
- Make sidebar broader
- Improve scenario parsing
- Show overall duration of a single test
- dontSee show assert label
- Steps: Make a special grab... step
- Steps: dontSee step
- REST step: Add duration
- Fix failed step not shown
- Simple response view for get responses
- Selector Finder: Restrict attribute names
- click/amOnPage should have top margin
- Shorten amOnPageUrl to pathname
- Fix: TODO Mvc Snapshots no CSS
- Fix: pressKey Step
- Fix: Check see step, does not look right
- Disable, dont hide screenshot button
- Fix no screenshot in failed assertion
- executeScript: script missing
- TestRun Empty State: Show sleected test name always
- click: Take before AND after screenshot, but use the afterscreenshot for the next step (if its a no snapshot step)

## Done V 0.1.6

- Use nice monospace font
- Nice favicon
- Testrun View: Show duration also for failed tests
- Open step location in VS Code
- Fix html snapshot
- Show Metasteps in test run protocol
- Configuration: Editor file/line open command
- StepDetails: Show duration of step
- Html Snapshots: Improve link rewriting
- Disable retries when running in web ui
- Create switchTo step and scrollstep
- Store page width in snapshot
- Remove Context: from Context:Before
- Metasteps: Indent ordinary steps
- Indent all lowlevel steps
- REST: Put a link on all get requests
- Make "I see" and "I dont" tags equal width
- Main: Provide relative path to test
- Indent all lowlevel steps
- Steps: Improve hover and selected state
- Link the Stacktrace instead of showing the "Show" button
- Scenario: Store search query in url
- List Scenarios: Refactor using repository
- Get Scenario: Implement
- List Scenarios: Add scenario directory to scenario
- BUG: Testrun View: Separate feature and scenario title
- Reload suites
- Find out if test is skipped
- Implement step.comment
- ScenariosPage: Fix tags
- Scenario Autorefresh: Ignore node_modules folder
- Remove duration from REST steps
- store testrun
- Store snapshots with testrun
- Helper: Add test stackframe always
- Display date/time when scenario was last run
- List Scenarios: Group by directory

## In Progress

- Fix: node12 issue? Can not find test stackframe anymore
- Catch errors in mocha.loadFiles() and show in frontend
- Sort capabilities alphabetically
- Sort features within capability alphabetically
- Snapshot: Should replace/delete iframes in html snapshot to not accidentally include codepress in iframe
- Group data driven tests into one scenario

## V 0.1.6

- Scenario Page: Search for multiple search terms (using logical or)
- Scenario Page: Search: Also take filenames into consideration
- HTML Snapshot: Add input field values
- ??? Use scenario.id to run a scenario (not title)
- BUG Code changes in page objects not picked up (assume page objects not reloaded)
- step.passed: map return values (e. g. axios response)
- HTML Snapshot: Last pressKey should trigger snapshot
- Scenario Autorefresh: I have the feeling that changes to files are not always picked up
- Scenario Autorefresh: Created/Deleted files are not picked up
- Dont put selected steps on history stack
- Search field: Select all when clicking into it
- Search field: Add reset button
- Refactor: Move cli code to store
- Treat waitForText as assertion (and also make snapshot)
- BUG: See element does not (always) show aliased locator name
- screenshot step: Show image as default
. Step: fillField: Use columns to lay out field name and value
- Test Stack: Remember the most recent test stackframe and use it in step if no test stackframe available
- SnapshotView: Fix element position for highlighting and click when page is scrolled
- SnapshotView: Fix scroll position and scroll only in y direction
- Scenario View: Group data driven scenarios
- Scenario View: Group scenarios in same directory
- Scenario View: Separate test file name and use as subtitle of feature headline
- Fix: click step has no duration
- Testrun View: Quick way to open the test in editor
- Testrun View: (?) Just show "toplevel" metasteps (i. e. metasteps which are called directly in test) in bold
- Metasteps: Indent ordinary steps
- Always fire step.before to show currently executing step

## V 0.2

- File Open: Implement for other editors than VS Code
- Remember last stackFrame in test
- Show NODE_ENV value
- BUG Still duplicate / in html snapshot urls https://www.check24-test.de//einsurance/pkw/vnt2/pkwResult.form;jsessionid=248F8BA8D04A23D1E2385053A7FC0873.ajp13-i01/
- BUG: Skipped scenarios not shown in scenario list
- Configuration: Jira/Issuetracking regex for tags
- Scenario View: Sort Features/Scenarios alphabetically
- Scenario View: Use relative path
- Scenario View: Run all scenarios in a feature
- Scenario View: Show latest test run resultss
- 'Run all': Scenarios in a feature
- Testrun View: Collapse scenarios
- Testrun View: Stop button to terminate execution
- Enhance README
    * Known limitations
    * Features
    * Roadmap
- PRB No snapshot shown when last step is a REST step
- BUG iframe event throttling does not work
- BUG fix scrolling to last step
- Testrun View: Extract tags and test data
- Debugging: Automatically enter CLI on failing test
- Debugging: Allow to set "breakpoints"
- BUG last step in passed tests seems to be duplicated
- Support data-driven tests properly (keep snapshots for all test runs)
- BUG: Scroll to bottom does not work for multiple tests
- Refactor test model (persist and show last test result, support multiple tests)
- BUG: Should switch back to html snapshot if there is no screenshot (but screenshot previously selected)
- Support multiple tests in test run view
- Testrun Page: Show last result of testrun
- Steps: Open source code location per click
- Selector Finder: would be nice to specify attributes which should be preferred to use for selector building (like data-test)
- Html Snapshot: Rewrite image urls
- Show snapshot when hovering over step
- BUG: HTML Snapshot: Does not scroll anymore (because of mouse interceptor)
- BUG Html Snapshot: Element highlighting does not work reliably
- HTML Snapshot: Preserve input values
- HTML Snapshot: Store scroll position, window size, cursor position
- Also detect skipped scenarios
- BUG: Still duplicate last step when error occurs (guess it depends on the type of error that occurs in the test. assertions are fine, but js errors (smth not defined) are not)
- Show error when codecept command fails to start

## V 0.3

- Selector Playground: Show options when clicking on select field
- REST Steps: Show request and response
- Remote CLI: Would be nice to have a full snapshot when the console opens
- Remote CLI: Refresh button to take a full snapshot anytime I want
- Implement web console
    * x Close shell (and continue test)
    * x Step-by-step execution
    * x Show error message
    * Format console ctrl chars
    * Pick element
    * Record cli commands (and copy to clipboard)
    * Show screenshot when hovering over step


## Backlog

- REST: Export/Import rest calls to postman
- Error Handling: Show error when undeclared page objects in tests
- Measure step duration
- Show duration of REST requests
- Strange snapshot route calls http://localhost:3001/api/snapshots/html/node_modules/angular/angular.js
- assert should be read when step failed
- BUG: Can not extract scenario title in backticks
- "Linting": e.g detect missing waits, unncessary fixed waits etc.
- Testrun Actions: Stop on error button
- Testrun Actions: Run with making screenshots
- SnapshotSource: Must update selector highlighting even if snapshot did not change (waitForVisible)
- Collapse subsequent REST requests into a collapsible step
- "fuzzy full text search" for elements (on class names) would be nice
- Support showing multiple tests not just one
- Open file (test/page object) from step
- determine original and current image size
- Show run status
- Center screenshot
- Implement element highlighting for appium
- Persist test run data in local storage
- Make environment variables configurable (or more generally: Make run configuations configurable)