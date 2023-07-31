import { Menu, Tray, nativeImage } from 'electron'
import icon from '/resources/64.png?asset'
import { BrowserWindow } from 'electron'

const createTray = (win: BrowserWindow) => {
  const tray = new Tray(nativeImage.createFromPath(icon))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        win.close()
      }
    }
  ])
  tray.setToolTip('Tool Box')
  tray.setContextMenu(contextMenu)
  handleEvent(tray, win)
  return tray
}

const handleEvent = (tray: Tray, win: BrowserWindow) => {
  tray.on('click', () => {
    win.show()
  })
}
export const initTray = createTray
