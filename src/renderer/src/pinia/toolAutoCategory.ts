import { SaveRuleEnum } from '@globalType/globalEnums'

export const useStoreAutoCategory = defineStore(
  'auto-category',
  () => {
    /**
     * 遍历的深度
     */
    const matchDepth = ref(3)
    /**
     * 是否忽略大小写
     */
    const ignoreCase = ref(false)
    /**
     * 匹配的规则
     */
    const matchRules = ref<ToolAutoCategoryMatchItem[]>([
      { rule: '(-h|_h)\\.seq', folderName: 'k' },
      { rule: '(-k|_k)\\.seq', folderName: 'h' }
    ])
    /**
     * 保存的规则
     */
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
    /**
     * 当前所选择的保存的规则
     */
    const saveRuleId = ref(SaveRuleEnum.ROOT)
    /**
     * 自定义的保存路径
     */
    const saveManualPath = ref('')
    return {
      ignoreCase,
      matchDepth,
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
