<script setup lang="ts"></script>
<template>
  <NLayout class="w-screen h-screen">
    <LayoutHeader></LayoutHeader>
    <NLayoutContent content-style="padding: 3rem 0.75rem 1rem" class="h-screen">
      <RouterView></RouterView>
    </NLayoutContent>
  </NLayout>
</template>
<style scoped lang="scss"></style>
