<script setup lang="ts">
import { NScrollbar } from 'naive-ui'

const scrollbarRef = ref<InstanceType<typeof NScrollbar>>()
const show = defineModel('show', { default: false })
const { matchDepth, matchRules, saveManualPath, saveRuleId, saveRules, ignoreCase } = storeToRefs(
  useStoreAutoCategory()
)
const explorerStory = useStoreExplorer()
const isInExecution = ref(false)
const messageList = ref<AutoCategoryMessage[]>([
  { type: 'info', message: '等待执行', tag: '[WAIT]' }
])

window.api['autoCategory:message']((e, m) => {
  messageList.value.push(m)
  scrollbarRef.value?.scrollTo(0, 1000)
})

const clickStart = async () => {
  if (isInExecution.value) {
    window.api['autoCategory:cancel']()
    return false
  }
  messageList.value = []
  isInExecution.value = true
  await window.api['autoCategory:exec']({
    matchDepth: matchDepth.value,
    matchRules: toRaw(matchRules.value),
    ignoreCase: ignoreCase.value,
    saveRuleId: saveRuleId.value,
    saveManualPath: saveManualPath.value,
    rootPaths: toRaw(explorerStory.checkedPaths)
  })
  isInExecution.value = false
  return false
}
</script>
<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :show-icon="false"
    title="自动分类执行"
    :positive-text="isInExecution ? '中止' : '开始执行'"
    negative-text="关闭"
    :positive-button-props="{ type: isInExecution ? 'error' : 'primary' }"
    :negative-button-props="{ disabled: isInExecution }"
    :closable="false"
    :close-on-esc="false"
    :mask-closable="false"
    content-style="width: 80vw"
    class="w-[50vw]"
    @positive-click="clickStart"
  >
    <NElement
      tag="div"
      class="w-full h-[60vh] bg-[var(--body-color)] border border-[--primary-color] rounded-lg"
    >
      <NScrollbar ref="scrollbarRef" trigger="none" style="max-height: 60vh">
        <div v-for="(item, index) in messageList" :key="index" class="mx-2 my-2">
          <NTag :type="item.type" :bordered="false" size="small">{{ item.tag }}</NTag>
          {{ item.message }}
        </div>
      </NScrollbar>
    </NElement>
  </NModal>
</template>
<style scoped lang="scss"></style>
