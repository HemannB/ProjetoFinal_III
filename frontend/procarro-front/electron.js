const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadURL('http://localhost:3000')
  win.webContents.openDevTools() 
})

app.on('window-all-closed', () => app.quit())