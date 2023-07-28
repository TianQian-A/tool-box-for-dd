import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreBase = defineStore(
  'base',
  () => {
    const settingStore = useStoreSettings()
    const suffixList = ref(['seq'])
    const openedRootPaths = ref<string[]>([])

    const addOpenedRootPath = (_path: string) => {
      const sameIdx = openedRootPaths.value.findIndex((item) => item === _path)
      if (sameIdx !== -1) {
        const temp = openedRootPaths.value[sameIdx]
        openedRootPaths.value.splice(sameIdx, 1)
        openedRootPaths.value.unshift(temp)
      } else {
        openedRootPaths.value.unshift(_path)
        openedRootPaths.value.splice(settingStore.maxOpenedRootPaths - 1)
      }
    }

    return {
      suffixList,
      openedRootPaths,
      addOpenedRootPath
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
