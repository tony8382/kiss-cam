const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kisscamAPI', {
  getConfigPath: async () => await ipcRenderer.invoke('get-config-path'),
  getImagesPath: async () => await ipcRenderer.invoke('get-images-path'),
  readFile: async (filePath) => {
    // 動態 require fs，避免 module not found 問題
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
});
