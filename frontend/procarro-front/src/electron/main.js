const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL("http://localhost:3000"); // React App
});