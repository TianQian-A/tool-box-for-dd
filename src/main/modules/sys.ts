import { App, BrowserWindow, ipcMain } from 'electron'

const addSysEvent = (win: BrowserWindow) => {
  ipcMain.on('sys:close', (e) => {
    e.preventDefault()
    win.close()
  })
  ipcMain.on('sys:hide', (e) => {
    e.preventDefault()
    win.hide()
  })
  ipcMain.on('sys:minimize', (e) => {
    e.preventDefault()
    win.minimize()
  })
  ipcMain.on('sys:maximize', (e) => {
    e.preventDefault()
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
}
export const initSys = addSysEvent
