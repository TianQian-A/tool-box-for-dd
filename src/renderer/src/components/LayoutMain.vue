<script setup lang="ts"></script>
<template>
  <NLayout class="w-screen h-screen">
    <LayoutHeader></LayoutHeader>
    <NLayoutContent
      content-style="padding: 0 0.75rem 0.75rem; height: calc(100vh - 3rem); margin-top: 3rem; overflow-y: hidden;"
    >
      <RouterView></RouterView>
    </NLayoutContent>
  </NLayout>
</template>
<style scoped lang="scss"></style>
