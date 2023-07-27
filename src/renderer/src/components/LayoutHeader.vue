<script setup lang="ts"></script>
<template>
  <NElement tag="div" class="custom-title-bar">
    <div class="flex items-center">
      <span class="text-xs mr-2">工具箱</span>
      <IconTheme></IconTheme>
    </div>

    <div class="flex">
      <button class="custom-btn base">
        <NIcon size="20">
          <IUilMinus></IUilMinus>
        </NIcon>
      </button>
      <button class="custom-btn base">
        <NIcon size="16">
          <IUilSquareShape></IUilSquareShape>
        </NIcon>
      </button>
      <button class="custom-btn hover:bg-red-500 hover:text-white">
        <NIcon size="20">
          <IUilTimes></IUilTimes>
        </NIcon>
      </button>
    </div>
  </NElement>
</template>
<style scoped lang="less">
.custom-title-bar {
  -webkit-app-region: drag;
  @apply fixed left-0 top-0 z-10;
  @apply w-full h-9 pl-3;
  @apply select-none flex justify-between items-center;
  & * {
    -webkit-app-region: no-drag;
  }
}
.custom-btn {
  @apply w-12 h-9 flex-center transition;
  &.base {
    @apply hover:dark:bg-gray-600 hover:bg-gray-200;
  }
}
</style>
