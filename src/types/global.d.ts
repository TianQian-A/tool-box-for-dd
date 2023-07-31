import { BrowserWindow, IpcRendererEvent } from 'electron'
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
  interface AutoCategoryMessage {
    type: 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
    tag: string
    message: string
  }
  interface Api {
    'folder:openDialog': () => Promise<{ dirArr: DirItem[]; rootPath: string }>
    'folder:readDir': (path: string) => Promise<{ dirArr: DirItem[]; rootPath: string }>
    'folder:open': (path: string) => void
    'sys:close': () => void
    'sys:hide': () => void
    'sys:minimize': () => void
    'sys:maximize': () => void
    'autoCategory:exec': (params: ToolAutoCategoryExecParams) => void
    'autoCategory:cancel': () => void
    'autoCategory:message': (
      cb: (event: IpcRendererEvent, params: AutoCategoryMessage) => void
    ) => void
  }
  interface ToolAutoCategoryMatchItem {
    rule: string
    folderName: string
  }
  interface ToolAutoCategoryExecParams {
    rootPaths: string[]
    matchDepth: number
    ignoreCase: boolean
    matchRules: ToolAutoCategoryMatchItem[]
    saveRuleId: number
    saveManualPath: string
  }
}
export {}
