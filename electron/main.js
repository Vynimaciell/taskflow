const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "TaskFlow — Kanban Task Manager",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    backgroundColor: "#07070d",
  });

  // In production, load the built files
  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  // Remove default menu
  Menu.setApplicationMenu(null);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
