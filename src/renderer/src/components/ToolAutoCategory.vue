<script setup lang="ts">
import { useStoreAutoCategory } from '@renderer/pinia/toolAutoCategory'
import { FormInst, FormRules, NDynamicInput } from 'naive-ui'

const { matchRules, saveRuleId, saveRules, saveManualPath } = storeToRefs(useStoreAutoCategory())
const formRef = ref<FormInst>()
const isLocking = ref(false)

const onCreate = () => {
  return {
    ext: '',
    suffix: '',
    folderName: ''
  }
}

const rules: FormRules = {
  save: {
    validator(...args) {
      if (saveRuleId.value === 3 && !args[1]) return new Error('填写文件存放位置~')
      return true
    }
  }
}
const chooseSavePath = () => {
  window.api['folder:openDialog']().then((res) => {
    saveManualPath.value = res.rootPath
  })
}
const handleExec = () => {
  formRef.value?.validate().then(() => {})
}
</script>
<template>
  <NConfigProvider
    :theme-overrides="{
      Form: {
        labelFontWeight: 'bold'
      }
    }"
  >
    <NScrollbar class="max-h-[var(--content-height)]">
      <NElement tag="div" class="sticky pb-6 top-0 bg-[var(--body-color)]">
        <div class="flex items-center font-semibold text-lg text-[var(--info-color)] space-x-2">
          <NIcon class="mb-0.5">
            <IUilIcons></IUilIcons>
          </NIcon>
          <span class="!ml-1 mr-2">快速分类</span>
          <NButton circle type="primary" size="small" @click="handleExec">
            <template #icon>
              <NIcon size="20">
                <IUilNavigator></IUilNavigator>
              </NIcon>
            </template>
          </NButton>
          <NButton
            circle
            type="error"
            size="small"
            :tertiary="!isLocking"
            @click="isLocking = !isLocking"
          >
            <template #icon>
              <NIcon size="20">
                <IUilPadlock></IUilPadlock>
              </NIcon>
            </template>
          </NButton>
        </div>
      </NElement>
      <NForm ref="formRef" :disabled="isLocking" :rules="rules">
        <NFormItem label="文件存放位置" path="save">
          <div class="flex flex-col w-full">
            <NSelect v-model:value="saveRuleId" :options="saveRules"></NSelect>
            <NInputGroup v-if="saveRuleId === 3" class="mt-2">
              <NInput v-model:value="saveManualPath" placeholder="文件存放位置"></NInput>
              <NButton type="primary" @click="chooseSavePath"> 选择 </NButton>
            </NInputGroup>
          </div>
        </NFormItem>
        <NFormItem label="匹配规则">
          <NDynamicInput v-model:value="matchRules" :on-create="onCreate" :disabled="isLocking">
            <template #default="{ value }">
              <NInput
                v-model:value="value.folderName"
                placeholder="文件名"
                round
                class="!w-32 mr-2"
              >
              </NInput>
              <NInputGroup>
                <NInput v-model:value="value.suffix" placeholder="后缀字符" round> </NInput>
                <NInputGroupLabel>.</NInputGroupLabel>
                <NInput v-model:value="value.ext" placeholder="扩展名" round> </NInput>
              </NInputGroup>
            </template>
          </NDynamicInput>
        </NFormItem>
      </NForm>
    </NScrollbar>
  </NConfigProvider>
</template>
<style scoped lang="scss"></style>
