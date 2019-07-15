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

## In Progress

- Show loading spinner when test runs
- Support multiple tests in test run view
- Fix console error message
- Send highlighted element to cli / "clipboard"
- Implement web console
    * x Close shell (and continue test)
    * x Step-by-step execution
    * x Show error message
    * Format console ctrl chars
    * Pick element
    * Record cli commands (and copy to clipboard)
    * Show screenshot when hovering over step

## Backlog

- assert should be read when step failed
- Should throttle mousemove over iframe (high cpu usage with all that selector stuff)
- BUG: Can not extract scenario title in backticks
- "Linting": e.g detect missing waits, unncessary fixed waits etc.
- Testrun Actions: Stop on error button
- Testrun Actions: Run with making screenshots
- SnapshotSource: Must update selector highlighting even if snapshot did not change (waitForVisible)
- Html Snapshot: Rewrite image urls
- Collapse subsequent REST requests into a collapsible step
- Steps: Special xxxCookie step
- BUG finder sometimes does not generate selectors
- "fuzzy full text search" for elements (on class names) would be nice
- click: Take before AND after screenshot
- Steps: Make a special executeScript step
- Steps: Make a special refreshPage step
- Steps: Make a special grab... step
- Support showing multiple tests not just one
- Show snapshot when hovering over step
- HTML Snapshot: Does not scroll anymore (probably because of mouse click overlay)
- HTML Snapshot: Preserve input values
- HTML Snapshot: Store scroll position, window size, cursor position
- Highlight elements in screenshot
- Open file (test/page object) from step
- determine original and current image size
- Show run status
- Center screenshot
- Implement element highlighting for appium
- Persist test run data in local storage
