<script setup lang="ts">
const emits = defineEmits<{
  openDialog: []
  refreshFolder: []
}>()
</script>
<template>
  <div class="flex items-center space-x-2">
    <slot></slot>
    <NDivider vertical></NDivider>
    <NTooltip trigger="hover" :show-arrow="false">
      <template #trigger>
        <NButton circle tertiary type="warning" @click="emits('openDialog')">
          <template #icon>
            <IUilBringBottom></IUilBringBottom>
          </template>
        </NButton>
      </template>
      重新选择目录
    </NTooltip>
    <NTooltip trigger="hover" :show-arrow="false">
      <template #trigger>
        <NButton circle tertiary type="primary" @click="emits('refreshFolder')">
          <template #icon>
            <IUilRefresh></IUilRefresh>
          </template>
        </NButton>
      </template>
      刷新目录
    </NTooltip>
  </div>
</template>
<style scoped lang="scss"></style>
