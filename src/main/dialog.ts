import { BrowserWindow, ipcMain, dialog } from 'electron'
import { Dirent } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'

const addOpenFolder = (win: BrowserWindow) => {
  ipcMain.handle('dialog:openFolder', async function (e, _path?: string): ReturnType<
    Api['dialog:openFolder']
  > {
    const res = dialog.showOpenDialogSync(win, {
      properties: ['openDirectory']
    })
    if (!res) throw Error('cancel')
    const dirArr = await readDir(res[0])
    return {
      dirArr,
      rootPath: res[0]
    }
  })
}

const readDir = async (_path: string) => {
  const res: DirItem[] = []
  const direntArr = await readdir(_path, {
    withFileTypes: true
  })
  for (const dirent of direntArr) {
    const formattedItem = formatDirent(_path, dirent)
    if (dirent.isDirectory()) {
      const children = await readDir(path.join(_path, dirent.name))
      formattedItem.children = children
    }
    res.push(formattedItem)
  }
  return res
}

const formatDirent = (_path: string, dirent: Dirent) => {
  return {
    name: dirent.name,
    children: [] as DirItem[],
    path: path.join(_path, dirent.name),
    ext: path.extname(dirent.name),
    isDir: dirent.isDirectory()
  }
}

export const initDialog = (win: BrowserWindow) => {
  addOpenFolder(win)
}
