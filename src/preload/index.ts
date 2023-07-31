import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { APINameEnum } from '../types/globalEnums'

// Custom APIs for renderer
const api: Api = {
  'folder:openDialog': () => electronAPI.ipcRenderer.invoke(APINameEnum.FOLDER_OPEN_DIALOG),
  'folder:readDir': (_path) => electronAPI.ipcRenderer.invoke(APINameEnum.FOLDER_READDIR, _path),
  'folder:open': (_path) => electronAPI.ipcRenderer.send(APINameEnum.FOLDER_OPEN, _path),
  'sys:close': () => electronAPI.ipcRenderer.send(APINameEnum.SYS_CLOSE),
  'sys:hide': () => electronAPI.ipcRenderer.send(APINameEnum.SYS_HIDE),
  'sys:minimize': () => electronAPI.ipcRenderer.send(APINameEnum.SYS_MINIMIZE),
  'sys:maximize': () => electronAPI.ipcRenderer.send(APINameEnum.SYS_MAXIMIZE),
  'autoCategory:cancel': () => electronAPI.ipcRenderer.send(APINameEnum.AUTO_CATEGORY_CANCEL),
  'autoCategory:exec': (params) =>
    electronAPI.ipcRenderer.invoke(APINameEnum.AUTO_CATEGORY_EXEC, params),
  'autoCategory:message': (cb) => ipcRenderer.on(APINameEnum.AUTO_CATEGORY_MESSAGE, cb)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
