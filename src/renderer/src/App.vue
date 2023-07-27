<script setup lang="ts">
import { NDialogProvider, darkTheme } from 'naive-ui'
const isDark = useDark()
const theme = computed(() => (isDark.value ? darkTheme : null))
</script>
<template>
  <NConfigProvider :theme="theme">
    <NMessageProvider>
      <NDialogProvider>
        <RouterView></RouterView>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
<style scoped lang="less"></style>
