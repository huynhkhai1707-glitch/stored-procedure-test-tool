const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  appName: "Stored Procedure Test Tool",
});