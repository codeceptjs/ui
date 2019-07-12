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

## In Progress

- Codepress should serve vuejs app from codepress dir
- codepress should list tests
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

- "fuzzy full text search" for elements (on class names) would be nice
- click: Take before AND after screenshot
- Make a special refreshPage step
- Make a special grab... step
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
