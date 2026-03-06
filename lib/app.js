import path from 'path';
import { BrowserWindow, app, shell, screen } from 'electron';
import { getPort } from './config/env.js';

const NAME = 'CodeceptUI';
let win;

app.name = NAME;
app.setName(NAME);

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().size;

  const width = Math.floor(screenWidth / 3.5) || 500;
  const x = screenWidth - Math.max(width, 500);
  win = new BrowserWindow({
    width: screenWidth / 1.2,
    height: screenHeight,
    minWidth: 500,
    x,
    y: 0,
    title: NAME,
    autoHideMenuBar: true,
    icon: path.join(import.meta.dirname, '/build/icons/64x64.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  win.loadURL(`http://localhost:${getPort('application')}`);

  console.log('Application window opened, switch to it to run tests...');

  win.on('closed', () => {
    win = null;
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', () => {
  createWindow();
});
