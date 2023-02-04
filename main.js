const { app, Tray, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
const AppWindow = require('./src/AppWindow');
const path = require('path');

let mainWindow, settingWindow;

app.on('ready', () => {
  const mainWindowConfig = {
    width: 1600,
    height: 800,
  };
  const urlLocation = isDev ? 'http://localhost:7001' : 'dumyurl';
  mainWindow = new AppWindow(mainWindowConfig, urlLocation);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // hook up main events
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow,
    };
    const settingFileLocation = `file://${path.join(__dirname, './setting/setting.html')}`;
    settingWindow = new AppWindow(settingsWindowConfig, settingFileLocation);
    settingWindow.on('closed', () => {
      settingWindow = null;
    });
  });
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // 建立托盘
  const tray = new Tray('./assets/icon.ico');
  tray.setToolTip('七牛云文档');
});
