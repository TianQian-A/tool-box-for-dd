import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreBase = defineStore(
  'base',
  () => {
    const suffixList = ref(['seq'])
    return {
      suffixList
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
