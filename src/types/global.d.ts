import { BrowserWindow } from 'electron'

declare global {
  interface DirItem {
    name: string
    children: DirItem[]
    path: string
    ext: string
    isDir: boolean
  }
  interface Api {
    'dialog:openFolder': (path?: string) => Promise<{ dirArr: DirItem[]; rootPath: string }>
  }
}
export {}
