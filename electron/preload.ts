import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
    onMainMessage: (callback: (message: string) => void) =>
        ipcRenderer.on('main-process-message', (_, message) => callback(message)),
})
