<script setup lang="tsx">
import WindowExplorer from './WindowExplorer.vue'

const autoCategoryEnable = ref(false)
const toolEnable = computed(() => autoCategoryEnable.value)
const explorer = ref<InstanceType<typeof WindowExplorer>>()
</script>
<template>
  <div class="w-full h-full flex-col flex">
    <div class="w-full h-full grid gap-6" :class="{ 'grid-cols-5': toolEnable }">
      <WindowExplorer ref="explorer" class="col-span-3">
        <template #action>
          <NTooltip trigger="hover" :show-arrow="false">
            <template #trigger>
              <NButton
                circle
                :tertiary="!autoCategoryEnable"
                type="info"
                @click="autoCategoryEnable = !autoCategoryEnable"
              >
                <template #icon>
                  <IUilIcons></IUilIcons>
                </template>
              </NButton>
            </template>
            快速分类
          </NTooltip>
        </template>
      </WindowExplorer>
      <div v-show="toolEnable" class="flex col-span-2">
        <ToolAutoCategory></ToolAutoCategory>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
