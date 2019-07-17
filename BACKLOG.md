## Done

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

## In Progress

- Steps: Make a special grab... step
- Steps: dontSee step
- Steps: Make a special executeScript step
- Fix: pressKey Step
- Fix: Check see step, does not look right

## V 0.1

- click: Take before AND after screenshot
- BUG: Scroll to bottom does not work for multiple tests
- Make sidebar broader
- Refactor test model (persist and show last test result, support multiple tests)
- Improve scenario parsing
- BUG: Should switch back to html snapshot if there is no screenshot (but screenshot previously selected)
- Support multiple tests in test run view
- Show Metasteps in test run protocol
- Testrun Page: Show last result of testrun
- Steps: Open source location per click
- Selector Finder: would be nice to specify attributes which should be preferred to use for selector building (like data-test)
- Show overall duration of a single test
- Html Snapshot: Rewrite image urls
- Show snapshot when hovering over step
- BUG: HTML Snapshot: Does not scroll anymore (because of mouse interceptor)
- BUG Html Snapshot: Element highlighting does not work reliably
- HTML Snapshot: Preserve input values
- HTML Snapshot: Store scroll position, window size, cursor position

## V 0.2

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