<script setup lang="ts">
import { ref } from 'vue'
const dirStruct = ref<DirItem[]>([])
const handleClick = () => {
  window.api['dialog:openFolder']('123').then((res) => {
    console.log(res)
    dirStruct.value = res.dirArr
  })
}
</script>
<template>
  <div>
    <button class="btn btn-primary btn-sm" @click="handleClick">选择目录</button>
    <div class=""></div>
    <div v-for="item in dirStruct" :key="item.path" class="">{{ item.name }}</div>
  </div>
</template>
<style scoped lang="scss"></style>
