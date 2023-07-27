<script setup lang="ts"></script>
<template>
  <NLayout class="w-screen h-screen">
    <NLayoutHeader bordered class="h-12 flex items-center px-2">
      <IconTheme></IconTheme>
    </NLayoutHeader>
    <NLayoutContent content-style="padding: 12px;" style="height: calc(100% - 3rem)">
      <RouterView></RouterView>
    </NLayoutContent>
  </NLayout>
</template>
<style scoped lang="scss"></style>
