const path = require('path')
const url = require('url')
const { app, BrowserWindow, protocol } = require('electron')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'file',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

function reloadOnChange(win) {
  if (!isDevelopment) return { close: () => {} }

  const watcher = require('chokidar').watch(path.join(__dirname, '../public/**'), { ignoreInitial: true })

  watcher.on('change', () => {
    win.reload()
  })

  return watcher
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    minWidth: 920,
    minHeight: 540,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../public/index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  const watcher = reloadOnChange(win)

  win.on('closed', () => {
    win = null
    watcher.close()
  })

  if (isDevelopment) win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow )

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
