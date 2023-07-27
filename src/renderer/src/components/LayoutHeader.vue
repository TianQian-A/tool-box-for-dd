<script setup lang="tsx">
import { NRadio } from 'naive-ui'

const dialog = useDialog()
const { closeCommand } = storeToRefs(useStoreSettings())

const clickBtn = (type: 'minimize' | 'maximize' | 'close') => {
  let remember = false
  if (type !== 'close') {
    window.api[`sys:${type}`]()
    return
  }
  if (closeCommand.value === 'ask') {
    dialog.warning({
      title: '确定要关闭吗？',
      showIcon: false,
      content: () => {
        return (
          <NRadio value={remember} onUpdate:checked={(checked) => (remember = checked)}>
            记住我的选择
          </NRadio>
        )
      },
      negativeText: '最小化到托盘',
      positiveText: '直接关闭',
      negativeButtonProps: {
        type: 'warning',
        secondary: true,
        ghost: false
      },
      positiveButtonProps: {
        type: 'error'
      },
      onNegativeClick() {
        if (remember) closeCommand.value = 'hide'
        window.api['sys:hide']()
      },
      onPositiveClick() {
        if (remember) closeCommand.value = 'close'
        window.api['sys:close']()
      }
    })
  } else {
    window.api[`sys:${closeCommand.value}`]()
  }
}
</script>
<template>
  <NElement tag="div" class="custom-title-bar">
    <div class="flex items-center">
      <span class="text-xs mr-2">工具箱</span>
      <IconTheme></IconTheme>
    </div>

    <div class="flex">
      <button class="custom-btn base" @click="clickBtn('minimize')">
        <NIcon size="20">
          <IUilMinus></IUilMinus>
        </NIcon>
      </button>
      <button class="custom-btn base" @click="clickBtn('maximize')">
        <NIcon size="16">
          <IUilSquareShape></IUilSquareShape>
        </NIcon>
      </button>
      <button class="custom-btn hover:bg-red-500 hover:text-white" @click="clickBtn('close')">
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
