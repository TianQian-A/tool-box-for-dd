<script setup lang="ts">
const rootPath = ref('')
const fileArr = ref<DirItem[]>([])
const openFolderDialog = () => {
  window.api['folder:openDialog']().then((res) => {
    rootPath.value = res.rootPath
    fileArr.value = res.dirArr
  })
}
</script>
<template>
  <div class="w-full h-full flex-center flex-col">
    <NButton v-if="!rootPath" type="primary" @click="openFolderDialog">选择工作目录</NButton>
    <div v-for="item in fileArr" :key="item.name">{{ item.name }}</div>
  </div>
</template>
<style scoped lang="scss"></style>
