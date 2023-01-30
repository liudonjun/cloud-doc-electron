const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const urlLocation = isDev ? "http://localhost:7001" : "dumyurl";
  mainWindow.loadURL(urlLocation);
});
