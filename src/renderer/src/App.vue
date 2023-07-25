<script setup lang="ts">
const handleClick = () => {
  // window.electron.ipcRenderer.send()
  window.api['dialog:openFolder']().then((res) => {
    console.log('！！！', res)
  })
}
</script>
<template>
  <div>
    <button class="btn btn-primary" @click="handleClick">选择目录</button>
  </div>
</template>
<style scoped lang="scss"></style>
