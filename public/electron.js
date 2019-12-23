const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');

const isDev = require('electron-is-dev');

const childProc = require('child_process');
const commanderPath = path.join(__dirname, '/commander');

// Create MainWindow and set settings
let mainWindow;

function createWindow() {
  startCommander();
  mainWindow = new BrowserWindow({
    width: 975,
    height: 650,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.on('close', e => {
    if (mainWindow) {
      e.preventDefault();
      mainWindow.webContents.send('app-close');
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.webContents.openDevTools();
}

ipcMain.on('save-completed', () => {
  commanderExe.kill();
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

let commanderExe;
function startCommander() {
  commanderExe = childProc.execFile(commanderPath);

  commanderExe.stdout.on('data', function(data) {
    console.log('child:' + data);
  });
  commanderExe.stderr.on('data', data => {
    console.error('child:' + data);
  });
}

function killCommander() {
  commanderExe.kill();
}
