import { app, BrowserWindow, ipcMain, protocol } from 'electron'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Helper to find assets with logging
const getAssetPath = (subPath: string) => {
    const exePath = process.execPath
    const exeDir = resolve(dirname(exePath))
    const resourcesPath = resolve(process.resourcesPath)
    const appPath = resolve(app.getAppPath())

    const pathsToCheck = [
        join(exeDir, subPath),
        join(exeDir, 'resources', subPath),
        join(resourcesPath, subPath),
        join(appPath, subPath),
        join(process.cwd(), 'public', subPath),
        join(process.cwd(), subPath)
    ]

    console.log(`[Asset Check] Searching for: ${subPath}`)
    for (const p of pathsToCheck) {
        try {
            if (fs.existsSync(p)) {
                console.log(`[Asset Found] -> ${p}`)
                return p
            }
        } catch (e) { }
    }
    console.error(`[Asset NOT Found] -> ${subPath}`)
    return null
}

process.env.DIST = join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(__dirname, '../public')

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        width: 1100,
        height: 800,
        icon: getAssetPath('icon.png') || join(process.env.PUBLIC || '', 'icon.png'),
        webPreferences: {
            // Fix: preload.js instead of preload.mjs
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true, // Keep devTools for debugging "loading" issues
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(join(process.env.DIST || '', 'index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    // Register protocol to load local files
    protocol.registerFileProtocol('local', (request, callback) => {
        const url = request.url.replace(/^local:\/\//, '')
        const decodedUrl = decodeURIComponent(url)
        const fullPath = getAssetPath(decodedUrl)
        if (fullPath) {
            callback({ path: fullPath })
        } else {
            callback({ error: -6 }) // net::ERR_FILE_NOT_FOUND
        }
    })

    createWindow()
})

// IPC Handlers
ipcMain.handle('get-config', async () => {
    const p = getAssetPath('config.txt')
    if (p) {
        return fs.readFileSync(p, 'utf8')
    }
    return null
})

ipcMain.handle('read-file', async (_, filePath: string) => {
    const p = getAssetPath(filePath)
    if (p) return fs.readFileSync(p, 'utf8')
    return null
})
