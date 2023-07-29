import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api: Api = {
  'folder:openDialog': () => electronAPI.ipcRenderer.invoke('folder:openDialog'),
  'folder:readDir': (_path) => electronAPI.ipcRenderer.invoke('folder:readDir', _path),
  'folder:open': (_path) => electronAPI.ipcRenderer.send('folder:open', _path),
  'sys:close': () => electronAPI.ipcRenderer.send('sys:close'),
  'sys:hide': () => electronAPI.ipcRenderer.send('sys:hide'),
  'sys:minimize': () => electronAPI.ipcRenderer.send('sys:minimize'),
  'sys:maximize': () => electronAPI.ipcRenderer.send('sys:maximize')
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
