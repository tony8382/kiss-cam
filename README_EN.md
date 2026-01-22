**English Version** | [中文說明](README.md)

# Kiss Cam Slot Machine (React + Electron)

A modern, customizable Kiss Cam slot machine application built with React, Tailwind CSS, and Electron.

🎉 **Try It**
👉 [Let's Go](https://tony8382.github.io/kiss-cam/)  
![APP screenshot](footage/app.png)

## Features
- 🎰 **Dynamic Slot Experience**: Smooth animations and random selection mechanics.
- 🎨 **Modern Interface**: Premium pink-themed UI crafted with Tailwind CSS.
- 🔊 **Audio Integration**: Built-in sound effects for clicks, spins, and wins.
- ⚙️ **Highly Customizable**: Easily modify titles and actions via `config.txt`.
- 💻 **Multi-platform Support**: Runs as a web app or a desktop Electron app (Windows .exe).

## Getting Started

### Installation
```bash
npm install
```

### Development
- **Web**: `npm run dev`
- **Electron**: `npm run dev:electron`

### Build & Package
- **Web**: `npm run build`
- **Electron (Package for Windows)**: `npm run build:electron`
  - The packaged app will be in `dist/electron/win-unpacked/Kiss Cam拉霸機.exe`

## Customization

### config.txt Format
Place `config.txt` in the root (dev) or beside the executable (packaged).
Example:
```text
title=🎰 Wedding Kiss Cam 💕
action1=Kiss 💋,kiss.jpg
action2=Hug 🤗,hug.jpg
action3=Dance 💃,dance.jpg
```

### Assets Directory
- **Images**: Place in `public/images/` (dev) or `dist/electron/win-unpacked/images/` (packaged).

## Credits
1. UI inspiration and design aided by Canva AI.
2. Built with Vite, React, and Tailwind CSS.
3. Desktop deployment powered by Electron and `electron-packager`.
