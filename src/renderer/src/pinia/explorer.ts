export const useStoreExplorer = defineStore('explorer', () => {
  const checkedPaths = ref<string[]>([])
  return {
    checkedPaths
  }
})
