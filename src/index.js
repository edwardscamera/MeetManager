const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow = null;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'laptop_icon.png'),
        title: 'Meet Manager',
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    Menu.setApplicationMenu(null);
};

ipcMain.on('load-url', (event, arg) => {
    mainWindow.loadURL(arg[0]).then(() => mainWindow.setTitle(`Meet Manager | ${arg[1]}`));
    Menu.setApplicationMenu(Menu.buildFromTemplate(
        [
            {
                label: 'Back to Meet Manager',
                click: () => {
                    mainWindow.loadFile(path.join(__dirname, 'index.html'));
                    mainWindow.setTitle('Meet Manager');
                    Menu.setApplicationMenu(null);
                },
            }
        ]
    ));
});
ipcMain.on('load-index', (event, arg) => mainWindow.loadFile(path.join(__dirname, 'index.html')))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    globalShortcut.register('CommandOrControl+Shift+I', () => mainWindow.webContents.openDevTools());
    globalShortcut.register('F12', () => mainWindow.webContents.openDevTools());
    globalShortcut.register('CommandOrControl+R', () => mainWindow.webContents.reload());
    globalShortcut.register('F5', () => mainWindow.webContents.reload());
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});