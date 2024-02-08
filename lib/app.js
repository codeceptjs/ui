'use strict';

const path = require('path');
const { BrowserWindow, app, shell } = require('electron');
const { getPort } = require('./config/env');

const NAME = 'CodeceptUI';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
// protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

app.name = NAME;
app.setName(NAME);

function createWindow() {
  const { screen } = require('electron');
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().size;

  const width = Math.floor(screenWidth / 3.5) || 500;
  const x = screenWidth - Math.max(width, 500);
  // Create the browser window.
  win = new BrowserWindow({
    width: screenWidth / 1.2,
    height: screenHeight,
    minWidth: 500,
    x,
    y: 0,
    title: NAME,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '/build/icons/64x64.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  win.loadURL(`http://localhost:${getPort('application')}`);

  // eslint-disable-next-line no-console
  console.log('Application window opened, switch to it to run tests...');

  win.on('closed', () => {
    win = null;
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    // open url in a browser and prevent default
    shell.openExternal(url);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});
