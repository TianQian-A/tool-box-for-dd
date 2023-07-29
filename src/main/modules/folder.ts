import { BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { Dirent } from 'fs'
import { access, readdir, stat } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { exec } from 'child_process'

const addFolderDialog = (win: BrowserWindow) => {
  ipcMain.handle('folder:openDialog', async function (e): ReturnType<Api['folder:openDialog']> {
    const res = dialog.showOpenDialogSync(win, {
      properties: ['openDirectory']
    })
    if (!res) throw 'cancel'
    const dirArr = await readDir(res[0])
    return {
      dirArr,
      rootPath: res[0]
    }
  })
}

const addRedFolder = (win: BrowserWindow) => {
  ipcMain.handle('folder:readDir', async function (e, _path: string): ReturnType<
    Api['folder:readDir']
  > {
    const dirArr = await readDir(_path)
    return {
      dirArr,
      rootPath: _path
    }
  })
}

const addOpenFolder = (win: BrowserWindow) => {
  ipcMain.on('folder:open', (e, _path: string) => {
    shell.openPath(_path)
  })
}

const readDir = async (_path: string) => {
  const res: DirItem[] = []
  const direntArr = await readdir(_path, {
    withFileTypes: true
  })
  for (const dirent of direntArr) {
    try {
      await access(path.join(_path, dirent.name))
      if (dirent.name === 'desktop.ini') continue
      const formattedItem = await formatDirent(_path, dirent)
      res.push(formattedItem)
    } catch (err) {
      console.error(err)
    }
  }
  return res
}

const formatDirent = async (_path: string, dirent: Dirent) => {
  const _stat = await stat(path.join(_path, dirent.name))
  return {
    id: crypto.randomUUID(),
    name: dirent.name,
    children: [] as DirItem[],
    path: path.join(_path, dirent.name),
    ext: path.extname(dirent.name),
    isDir: dirent.isDirectory(),
    stat: _stat
  }
}

export const initFolderDialog = (win: BrowserWindow) => {
  addFolderDialog(win)
  addRedFolder(win)
  addOpenFolder(win)
}
