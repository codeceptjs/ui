# CodeceptUI

An interactive, graphical test runner for [CodeceptJS](https://codecept.io). 

![codeceptui](codecept-ui2.gif)

![Main Interface](codecept-ui-main-interface.png)
*Enhanced main interface with real-time file watching, runtime mode indicator, and comprehensive test management*

## New Features & Enhancements ✨

### 🔄 Real-time File Watching & Auto-refresh
- **Automatic reload** when test scenarios, configuration, or any watched files change
- **Visual indicators** showing file watching status and changes
- **Smart notifications** for file modifications, additions, and deletions
- **Comprehensive monitoring** of test files, config files, and page objects

![File Watching](codecept-ui-main-interface.png)

### 🎛️ Dynamic Runtime Mode Switching
- **On-the-fly switching** between headless and windowed browser modes
- **Visual mode indicators** in the main toolbar showing current execution mode
- **Persistent settings** that remember your preferences across sessions
- **Easy toggle controls** in the settings menu

![Headless Mode](codecept-ui-headless-mode.png)
*Headless mode indicator and settings*

![Window Mode](codecept-ui-window-mode.png) 
*Window mode indicator and settings*

### ⚡ Performance Optimizations
- **Debounced search** with real-time filtering for better responsiveness
- **Smart rendering** that only displays matching test scenarios
- **Optimized WebSocket communication** for faster status updates
- **Efficient caching** to reduce unnecessary API calls

### 🧪 Interactive Test Writing
- **Monaco code editor** with syntax highlighting and IntelliSense
- **Live test execution** with interactive pause capabilities
- **Real-time browser control** for test development

![Test Editor](codecept-ui-test-editor.png)
*Interactive test writing with Monaco editor*

### 📄 Page Objects Management
- **Visual page object browser** for exploring your test architecture
- **Source code viewer** with syntax highlighting
- **Easy navigation** between different page objects

![Page Objects](codecept-ui-page-objects.png)
*Page objects browser and source viewer*

## Core Features

* Runs as Electron app or as a web server
* Headless & window mode supported
* Test write mode
* Interactive pause built-in
* Snapshots & Time travel
* Runs tests in CodeceptJS supported engines:
  * Playwright
  * Puppeteer
  * webdriverio
  * TestCafe

## Quickstart

**Requires [CodeceptJS 3](https://codecept.io) to be installed**

Install CodeceptUI in a project where CodeceptJS is already used

```
npm i @codeceptjs/ui --save
```

### Application Mode

Run CodeceptUI in application mode (recommended for development, local debug):

```
npx codecept-ui --app
```

Uses `codecept.conf.js` config from the current directory. 

If needed, provide a path to config file with `--config` option:

```
npx codecept run --config tests/codecept.conf.js
```

### WebServer Mode

![webserver mode](codeceptui.gif)

Run CodeceptUI as a web server (recommended for headless mode, remote debug):

```
npx codecept-ui
```

Open `http://localhost:3333` to see all tests and run them.


Uses `codecept.conf.js` config from the current directory. 

If needed, provide a path to config file with `--config` option:

```
npx codecept run --config tests/codecept.conf.js
```

#### Ports

CodeceptUI requires two ports HTTP and WebSocket. 

* HTTP Port = 3333
* WebSocket Port = 2999

Default HTTP port is 3333. You can change the port by specifying it to **--port** option:

```
npx codecept-ui --app --port=3000
```


Default WebSocket port is 2999. You can change the port by specifying it to **--wsPort** option:
```
npx codecept-ui --app --wsPort=4444
```


## Development

See [CONTRIBUTING.md](.github/CONTRIBUTING.md)


## Start CodeceptUI with debug output

CodeceptUI uses the [debug](https://github.com/debug-js/debug) package to output debug information. This is useful to troubleshoot problems or just to see what CodeceptUI is doing. To turn on debug information do

```
  # verbose: get all debug information
  DEBUG=codeceptjs:* npx codecept-ui 

  # just get debug output of one module
  DEBUG=codeceptjs:codeceptjs-factory npx codecept-ui
```

# Credits

- Originally created by Stefan Huber @hubidu27
- Maintained my @davertmik
- Icons/Logos <a href="https://iconscout.com/icon/code-280" target="_blank">Code Icon</a> by <a href="https://iconscout.com/contributors/elegant-themes">Elegant Themes</a> on <a href="https://iconscout.com">Iconscout</a>

# Contributors

Thanks all for the contributions!

[//]: contributor-faces

<a href="https://github.com/hubidu"><img src="https://avatars2.githubusercontent.com/u/13134082?v=4" title="hubidu" width="80" height="80"></a>
<a href="https://github.com/DavertMik"><img src="https://avatars0.githubusercontent.com/u/220264?v=4" title="DavertMik" width="80" height="80"></a>
<a href="https://github.com/Arhell"><img src="https://avatars.githubusercontent.com/u/26163841?v=4" title="Arhell" width="80" height="80"></a>
<a href="https://github.com/PeterNgTr"><img src="https://avatars0.githubusercontent.com/u/7845001?v=4" title="PeterNgTr" width="80" height="80"></a>
<a href="https://github.com/avinash360"><img src="https://avatars2.githubusercontent.com/u/11994986?v=4" title="avinash360" width="80" height="80"></a>
<a href="https://github.com/kaflan"><img src="https://avatars3.githubusercontent.com/u/3959504?v=4" title="kaflan" width="80" height="80"></a>
<a href="https://github.com/lukasf98"><img src="https://avatars2.githubusercontent.com/u/22434650?v=4" title="lukasf98" width="80" height="80"></a>
<a href="https://github.com/geilix10"><img src="https://avatars3.githubusercontent.com/u/16301998?v=4" title="geilix10" width="80" height="80"></a>
<a href="https://github.com/Teomik129"><img src="https://avatars3.githubusercontent.com/u/23395221?v=4" title="Teomik129" width="80" height="80"></a>

[//]: contributor-faces
