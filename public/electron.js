const electron = require('electron');
const { app, BrowserWindow } = require('electron');

const path = require('path');
const os = require('os');
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

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => {
    killCommander();
    mainWindow = null;
    app.quit();
  });
  mainWindow.webContents.openDevTools();
  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0')
  );
}
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
// Main Window Created

let commanderExe;
function startCommander() {
  commanderExe = childProc.execFile(commanderPath);
  console.log('commander Exe started');
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
