const { app, BrowserWindow, Tray, Menu } = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');

let mainWindow;

app.on('ready', () => {
  // 建立托盘
  const tray = new Tray('./assets/icon.ico');
  tray.setToolTip('七牛云文档');
  // set the menu
  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const urlLocation = isDev ? 'http://localhost:7001' : 'dumyurl';
  mainWindow.loadURL(urlLocation);
});
