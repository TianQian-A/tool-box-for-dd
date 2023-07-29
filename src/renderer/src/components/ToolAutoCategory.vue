<script setup lang="ts">
import { useStoreAutoCategory } from '@renderer/pinia/toolAutoCategory'
import { FormInst, FormRules, NButtonGroup, NDynamicInput, NEmpty } from 'naive-ui'

const explorerStore = useStoreExplorer()
const { matchRules, saveRuleId, saveRules, saveManualPath, ignoreCase, matchDepth } = storeToRefs(
  useStoreAutoCategory()
)
const formRef = ref<FormInst>()
const isLocking = ref(true)

const onCreate = function (): ToolAutoCategoryMatchItem {
  return {
    rule: '',
    folderName: ''
  }
}

const rules: FormRules = {
  save: {
    validator() {
      if (saveRuleId.value === 3 && !saveManualPath.value) return new Error('填写文件存放位置~')
      return true
    }
  },
  matchRule: {
    validator() {
      return false
    }
  },
  folderPath: {
    validator() {
      if (!explorerStore.checkedPaths.length) return new Error('选择工作的目录~')
      return true
    }
  }
}
/**
 * 点击已选择的工作目录
 * @param path 目录地址
 */
const handleClickPath = (path: string) => {
  window.api['folder:open'](path)
}
/**
 * 删除已选择的目录地址
 * @param path 目录地址
 */
const handleDelPath = (path: string) => {
  explorerStore.checkedPaths = explorerStore.checkedPaths.filter((item) => item !== path)
}
/**
 * 调用系统资源管理器选择保存文件的目录
 */
const chooseSavePath = () => {
  window.api['folder:openDialog']().then((res) => {
    saveManualPath.value = res.rootPath
  })
}
/**
 * 执行自动分类
 */
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
      <div class="px-1 pr-4">
        <NElement tag="div" class="sticky z-10 pb-2 top-0 bg-[var(--body-color)]">
          <div class="flex items-center font-semibold text-lg text-[var(--info-color)] space-x-2">
            <NIcon class="mb-0.5">
              <IUilIcons></IUilIcons>
            </NIcon>
            <span class="!ml-1 mr-2">快速分类</span>
            <NButton circle type="primary" size="small" tertiary @click="handleExec">
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
        <NForm ref="formRef" :disabled="isLocking" :rules="rules" class="mt-4">
          <NFormItem label="当前工作的目录" path="folderPath">
            <template v-if="explorerStore.checkedPaths.length">
              <div class="flex flex-col space-y-1 max-w-full">
                <div
                  v-for="item in explorerStore.checkedPaths"
                  :key="item"
                  class="flex items-center"
                >
                  <NButton
                    type="error"
                    circle
                    size="tiny"
                    :disabled="isLocking"
                    @click="handleDelPath(item)"
                  >
                    <NIcon size="20">
                      <IUilTrash></IUilTrash>
                    </NIcon>
                  </NButton>
                  <div
                    class="hover:bg-red-100 px-1 cursor-pointer flex items-center ml-1"
                    @click="handleClickPath(item)"
                  >
                    <NGradientText type="error">
                      <NEllipsis>{{ item }}</NEllipsis>
                    </NGradientText>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <NEmpty size="small" :show-icon="false" description="未选择目录"></NEmpty>
            </template>
          </NFormItem>
          <NFormItem label="文件存放位置" path="save">
            <div class="flex flex-col w-full">
              <NSelect v-model:value="saveRuleId" :options="saveRules"></NSelect>
              <NInputGroup v-if="saveRuleId === 3" class="mt-2">
                <NInput v-model:value="saveManualPath" placeholder="文件存放位置"></NInput>
                <NButton type="primary" @click="chooseSavePath"> 选择 </NButton>
              </NInputGroup>
            </div>
          </NFormItem>
          <NFormItem label="递归深度">
            <NInputNumber
              v-model:value="matchDepth"
              :precision="0"
              :min="1"
              :max="10"
            ></NInputNumber>
          </NFormItem>
          <NFormItem label="忽略大小写">
            <NRadioGroup v-model:value="ignoreCase">
              <NRadioButton :value="true">是</NRadioButton>
              <NRadioButton :value="false">否</NRadioButton>
            </NRadioGroup>
          </NFormItem>
          <NDynamicInput v-model:value="matchRules" :on-create="onCreate" :disabled="isLocking">
            <template #default="{ value, index }">
              <NFormItem
                :label="`规则${index + 1}`"
                :path="`matchRules[${index}]}`"
                :rule="{
                  message: '规则不能为空',
                  validator() {
                    return Boolean(value.folderName && value.rule)
                  }
                }"
              >
                <NInput
                  v-model:value="value.folderName"
                  placeholder="文件夹"
                  round
                  class="!w-32 mr-2"
                >
                </NInput>
                <NInput
                  v-model:value="value.rule"
                  placeholder="正则匹配规则"
                  round
                  class="!w-32 mr-2"
                >
                </NInput>
              </NFormItem>
            </template>
            <template #action="{ index, create, remove }">
              <NFormItem>
                <NButtonGroup>
                  <NButton circle :disabled="isLocking" @click="() => remove(index)">
                    <IUilMinus></IUilMinus>
                  </NButton>
                  <NButton circle :disabled="isLocking" @click="() => create(index)">
                    <IUilPlus></IUilPlus>
                  </NButton>
                </NButtonGroup>
              </NFormItem>
            </template>
          </NDynamicInput>
        </NForm>
      </div>
    </NScrollbar>
  </NConfigProvider>
</template>
<style scoped lang="scss"></style>
