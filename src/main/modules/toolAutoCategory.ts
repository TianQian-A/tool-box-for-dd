import { BrowserWindow, dialog, ipcMain } from 'electron'
import { APINameEnum, SaveRuleEnum } from '../../types/globalEnums'
import { access, copyFile, mkdir } from 'fs/promises'
import path from 'path'
import { readDir } from './folder'
const addExecAutoCategory = (win: BrowserWindow) => {
  const execIns = new ExecAutoCategory(win)
  ipcMain.handle(
    `${APINameEnum.AUTO_CATEGORY_EXEC}`,
    async (e, params: ToolAutoCategoryExecParams) => {
      await execIns.exec(params)
    }
  )
  ipcMain.on(`${APINameEnum.AUTO_CATEGORY_CANCEL}:cancel`, (e) => {
    execIns.cancel()
  })
}
class ExecAutoCategory {
  private cancelFlag = false
  private exitFileAction: null | 'skip' | 'override' = null
  private rootPath = ''
  private matchDepth = 1
  private matchRuleFormatted: (ToolAutoCategoryMatchItem & { reg: RegExp })[] = []
  private saveRuleId = SaveRuleEnum.ROOT
  private saveManualPath = ''
  win: BrowserWindow
  constructor(win: BrowserWindow) {
    this.win = win
  }
  private sendMessage(
    tag: string,
    msg: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info'
  ) {
    this.win.webContents.send(APINameEnum.AUTO_CATEGORY_MESSAGE, {
      type,
      tag: `[${tag}]`,
      message: msg
    })
    let _type = String(type)
    if (_type === 'success') _type = 'info'
    else if (_type === 'warning') _type = 'warn'
    console[_type](`[${tag}] ${msg}`)
  }
  /**
   * 重置
   */
  private reset() {
    this.cancelFlag = false
    this.exitFileAction = null
  }
  private checkCancel() {
    if (this.cancelFlag) {
      this.cancelFlag = false
      this.sendMessage('CANCEL', '手动取消', 'error')
      throw new Error('cancel')
    }
  }
  /**
   * 获取保存的目标路径
   * @param _path 文件路径
   * @param saveFolderName 保存的文件夹名
   */
  private getDestPath(_path: string, saveFolderName: string) {
    const parsePath = path.parse(_path)
    let destPath = this.rootPath
    if (this.saveRuleId === SaveRuleEnum.MANUAL) destPath = this.saveManualPath
    else if (this.saveRuleId === SaveRuleEnum.PARENT) destPath = parsePath.dir
    return path.join(destPath, saveFolderName)
  }
  /**
   * 移动文件
   * @param filePath 文件路径
   */
  private async moveFile(filePath: string, saveFolderName: string) {
    this.checkCancel()
    const parsePath = path.parse(filePath)
    const destPath = this.getDestPath(filePath, saveFolderName)
    this.sendMessage(
      'MOVE:START',
      `开始移动文件，文件名：${parsePath.base}，目标路径：${destPath}`,
      'warning'
    )
    // 检查目标目录是否存在
    try {
      await access(destPath)
    } catch {
      await mkdir(destPath)
      this.sendMessage('MOVE:CHECK_PATH', '目标目录不存在，创建目录', 'warning')
    }
    let cpDest: string | null = path.join(destPath, parsePath.base)
    // 检查复制的文件名在目标目录中是否存在
    try {
      await access(cpDest)
      this.sendMessage('MOVE:EXIT', `${cpDest} 已存在`, 'warning')
      if (!this.exitFileAction) {
        await dialog
          .showMessageBox(this.win, {
            message: `${cpDest} 已存在`,
            buttons: ['跳过', '覆盖'],
            checkboxLabel: '记住本次选择'
          })
          .then((val) => {
            if (val.checkboxChecked) this.exitFileAction = val.response === 0 ? 'skip' : 'override'
            if (val.response === 0) cpDest = null
          })
      } else if (this.exitFileAction === 'skip') cpDest = null
    } catch {
      this.sendMessage('MOVE:CHECK_CP_DEST', '文件不冲突', 'warning')
    }

    if (cpDest === null) {
      this.sendMessage('MOVE:EXIT', `跳过移动文件，文件名： ${parsePath.base}`, 'warning')
      return
    }
    try {
      await copyFile(filePath, cpDest)
      console.log(`移动文件 ${parsePath.base} 成功`)
      this.sendMessage('MOVE:SUCCESS', `移动文件 ${parsePath.base} 成功`, 'warning')
    } catch (err) {
      this.sendMessage('MOVE:ERROR', `移动文件 ${parsePath.base} 失败。${err}`, 'error')
    }
  }
  /**
   * 执行读取和移动的递归函数
   * @param _path 执行的目录
   * @param depth 执行时的深度
   */
  private async execReadAndMove(_path: string, depth = 1) {
    this.checkCancel()
    this.sendMessage('READ', `开始读取文件夹，深度：${depth}，路径： ${_path}`)
    const direntArr = await readDir(_path)
    for (const dirent of direntArr) {
      if (!dirent.isDir) {
        for (const singleRule of this.matchRuleFormatted) {
          if (singleRule.reg.test(dirent.name)) {
            this.sendMessage('MATCH', `匹配到文件 ${dirent.name}`)
            await this.moveFile(dirent.path, singleRule.folderName)
          }
        }
      }
      if (dirent.isDir && depth < this.matchDepth) {
        const isDestDir = this.matchRuleFormatted.some(
          (item) => dirent.path === this.getDestPath(dirent.path, item.folderName)
        )
        if (!isDestDir) {
          this.sendMessage('NEXT', `开始子文件夹 ${dirent.path}`)
          await this.execReadAndMove(dirent.path, depth + 1)
        }
      }
    }
  }
  /**
   * 执行入口函数
   */
  public async exec({
    rootPaths,
    saveRuleId,
    matchDepth,
    saveManualPath,
    matchRules,
    ignoreCase
  }: ToolAutoCategoryExecParams) {
    this.reset()
    this.saveRuleId = saveRuleId
    this.saveManualPath = saveManualPath
    this.matchDepth = matchDepth
    try {
      this.matchRuleFormatted = matchRules.map((item) => ({
        ...item,
        reg: RegExp(`^.*${item.rule}$`, ignoreCase ? 'i' : '')
      }))
    } catch (err) {
      this.sendMessage('END', '匹配规则错误', 'error')
      return
    }

    try {
      for (const _path of rootPaths) {
        this.sendMessage('START', `开始执行文件夹 ${_path}`, 'success')
        this.rootPath = _path
        await this.execReadAndMove(_path, 1)
        this.sendMessage('END', `文件夹 ${_path} 执行成功`, 'success')
        this.sendMessage('DIVIDE', '-----------------------', 'success')
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'cancel') {
        this.sendMessage('ERROR', err.message, 'error')
      }
    }
    this.reset()
  }
  public cancel() {
    this.cancelFlag = true
  }
}

export const initToolAutoCategory = (win: BrowserWindow) => {
  addExecAutoCategory(win)
}
