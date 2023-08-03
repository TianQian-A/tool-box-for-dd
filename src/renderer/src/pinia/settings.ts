export const useStoreSettings = defineStore(
  'settings',
  () => {
    const closeCommand = ref<'close' | 'ask' | 'hide'>('ask')
    const maxOpenedRootPaths = ref(10)
    return {
      closeCommand,
      maxOpenedRootPaths
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
