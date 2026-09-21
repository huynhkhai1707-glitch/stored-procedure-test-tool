const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    title: "Stored Procedure Test Tool",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function setupAutoUpdater() {
  // Không tự động tải: luôn hỏi người dùng trước.
  autoUpdater.autoDownload = false;

  autoUpdater.on("update-available", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      title: "Có phiên bản mới",
      message: "Đã có phiên bản mới của Stored Procedure Test Tool.",
      detail: "Bạn có muốn tải và cập nhật ngay bây giờ không?",
      buttons: ["Tải bản cập nhật", "Để sau"],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on("update-downloaded", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      title: "Đã tải xong bản cập nhật",
      message: "Bản cập nhật đã sẵn sàng.",
      detail: "Bạn có muốn cài đặt và khởi động lại ứng dụng không?",
      buttons: ["Cập nhật và khởi động lại", "Để sau"],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on("error", (error) => {
    console.error("Lỗi kiểm tra cập nhật:", error);
  });

  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow();

  // Chỉ kiểm tra cập nhật trong bản .exe đã cài đặt.
  if (!isDev) {
    setupAutoUpdater();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});