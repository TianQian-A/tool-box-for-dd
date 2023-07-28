export const useStoreSettings = defineStore(
  'settings',
  () => {
    const closeCommand = ref<'close' | 'ask' | 'hide'>('ask')
    const maxOpenedRootPaths = ref(3)
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
