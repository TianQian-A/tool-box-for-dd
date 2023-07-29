import { BrowserWindow, ipcMain } from 'electron'
import { APINameEnum } from '../../types/globalEnums'

const addSysEvent = (win: BrowserWindow) => {
  ipcMain.on(APINameEnum.SYS_CLOSE, (e) => {
    e.preventDefault()
    win.close()
  })
  ipcMain.on(APINameEnum.SYS_HIDE, (e) => {
    e.preventDefault()
    win.hide()
  })
  ipcMain.on(APINameEnum.SYS_MINIMIZE, (e) => {
    e.preventDefault()
    win.minimize()
  })
  ipcMain.on(APINameEnum.SYS_MAXIMIZE, (e) => {
    e.preventDefault()
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
}
export const initSys = addSysEvent
