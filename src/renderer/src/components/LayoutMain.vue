<script setup lang="ts"></script>
<template>
  <NLayout class="w-screen h-screen">
    <LayoutHeader></LayoutHeader>
    <NLayoutContent content-style="padding: 3rem 0.75rem 1rem" style="height: calc(100% - 3rem)">
      <RouterView></RouterView>
    </NLayoutContent>
  </NLayout>
</template>
<style scoped lang="scss"></style>
