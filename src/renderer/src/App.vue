<script setup lang="ts">
import { darkTheme } from 'naive-ui'
const isDark = useDark()
const theme = computed(() => (isDark.value ? darkTheme : null))
</script>
<template>
  <NConfigProvider :theme="theme">
    <NMessageProvider>
      <RouterView></RouterView>
    </NMessageProvider>
  </NConfigProvider>
</template>
<style scoped lang="less"></style>
