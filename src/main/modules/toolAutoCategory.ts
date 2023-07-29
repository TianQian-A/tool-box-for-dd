import { BrowserWindow, ipcMain } from 'electron'
import { APINameEnum } from '../../types/globalEnums'
const addExecAutoCategory = (win: BrowserWindow) => {
  const execIns = new ExecAutoCategory(win)
  ipcMain.on(`${APINameEnum.AUTO_CATEGORY_EXEC}`, (e, _path: string) => {
    execIns.exec()
  })
  ipcMain.on(`${APINameEnum.AUTO_CATEGORY_CANCEL}:cancel`, (e) => {
    execIns.cancelFlag = true
  })
}
class ExecAutoCategory {
  cancelFlag: boolean
  win: BrowserWindow
  constructor(win: BrowserWindow) {
    console.log('init')
    this.win = win
    this.cancelFlag = false
  }
  private checkCancel() {
    console.log('check cancel', this.cancelFlag)
  }
  public async exec(params?: { path: string }) {
    const sleep = () => {
      const time = Date.now()
      while (Date.now() - time < 2000) {
        console.log()
      }
    }
    setTimeout(() => {
      console.log('执行')
      this.checkCancel()
      sleep()
      this.exec()
    }, 0)
  }
}

export const initToolAutoCategory = (win: BrowserWindow) => {
  addExecAutoCategory(win)
}
