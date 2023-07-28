import { SaveRuleEnum } from '@globalType/globalEnums'

export const useStoreAutoCategory = defineStore(
  'auto-category',
  () => {
    const matchRules = ref([
      { ext: 'seq', suffix: '-K', folderName: 'k' },
      { ext: 'seq', suffix: '-H', folderName: 'h' },
      { ext: 'seq', suffix: '_K', folderName: 'k' },
      { ext: 'seq', suffix: '_H', folderName: 'h' }
    ])
    const saveRules = ref([
      {
        value: SaveRuleEnum.ROOT,
        label: '存放在所执行的文件夹下'
      },
      {
        value: SaveRuleEnum.PARENT,
        label: '存放在文件所在的文件夹的位置'
      },
      {
        value: SaveRuleEnum.MANUAL,
        label: '手动指定文件夹'
      }
    ])
    const saveRuleId = ref(SaveRuleEnum.ROOT)
    const saveManualPath = ref('')
    return {
      matchRules,
      saveRules,
      saveRuleId,
      saveManualPath
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
