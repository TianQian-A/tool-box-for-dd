<script setup lang="ts">
const isDark = useDark()
</script>
<template>
  <NSwitch v-model:value="isDark" size="small">
    <template #checked-icon>
      <NIcon>
        <IUilMoon></IUilMoon>
      </NIcon>
    </template>
    <template #unchecked-icon>
      <NIcon>
        <IUilSun></IUilSun>
      </NIcon>
    </template>
  </NSwitch>
</template>
<style scoped lang="less"></style>
