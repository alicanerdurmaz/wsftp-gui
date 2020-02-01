const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('path');

const isDev = require('electron-is-dev');

const childProc = require('child_process');
const commanderPath = path.join(__dirname, '/commander');
const { getObject } = require('../src/backend/api/dbFunctions');

const gotTheLock = app.requestSingleInstanceLock();

// Create MainWindow and set settings

const settingsRaw = getObject('settings.json', path.join(app.getPath('userData'), path.sep, 'custom-db'));
let settingsJson = {};
try {
	settingsJson = JSON.parse(settingsRaw);
} catch (error) {}

let mainWindow;
function createWindow() {
	startCommander();
	mainWindow = new BrowserWindow({
		width: settingsJson.windowSize ? settingsJson.windowSize.width : 840,
		height: settingsJson.windowSize ? settingsJson.windowSize.height : 650,
		minWidth: 840,
		minHeight: 400,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.on('close', e => {
		if (mainWindow) {
			e.preventDefault();
			let options = {
				buttons: ['No', 'Yes'],
				message: `Are you sure want to close ?`
			};
			let response = dialog.showMessageBoxSync(mainWindow, options);
			if (response) {
				mainWindow.webContents.send('app-close');
			}
		}
	});
	mainWindow.on('closed', () => {
		killCommander();
		mainWindow = null;
		app.quit();
	});
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	BrowserWindow.addDevToolsExtension(
		'/home/alican/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0/'
	);
	mainWindow.webContents.openDevTools();
}

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});
	app.on('ready', createWindow);
}

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

ipcMain.on('save-completed', () => {
	commanderExe.kill();
	mainWindow = null;
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

let commanderExe;
function startCommander() {
	commanderExe = childProc.execFile(commanderPath);

	commanderExe.stdout.on('data', function(data) {
		console.log('child:', data);
	});
	commanderExe.stderr.on('data', data => {
		console.log('error:', data);
	});
}

function killCommander() {
	commanderExe.kill();
}
