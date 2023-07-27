export const useStoreSettings = defineStore(
  'settings',
  () => {
    const closeCommand = ref<'close' | 'ask' | 'hide'>('ask')
    return {
      closeCommand
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
