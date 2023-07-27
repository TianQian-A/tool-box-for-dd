import { BrowserWindow } from 'electron'
import { Stats } from 'fs'

declare global {
  interface DirItem {
    id: string
    name: string
    children: DirItem[]
    path: string
    ext: string
    isDir: boolean
    stat: Stats
  }
  interface Api {
    'folder:openDialog': () => Promise<{ dirArr: DirItem[]; rootPath: string }>
    'folder:readDir': (path: string) => Promise<{ dirArr: DirItem[]; rootPath: string }>
    'sys:close': () => void
    'sys:hide': () => void
    'sys:minimize': () => void
    'sys:maximize': () => void
  }
}
export {}
