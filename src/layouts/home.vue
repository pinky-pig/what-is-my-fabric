<script setup lang="ts">
</script>

<template>
  <div class="screen-full-point-bg" />

  <Header />
  <main class="layout">
    <Side class="side" />
    <RouterView class="content" />
  </main>
</template>

<style lang="less" scoped>
.layout{
  @apply text-gray-700 dark:text-gray-200 flex justify-center ;
  display: flex;
  flex-direction: row;
  max-width: 1080px;
  gap: 0px 15px;
  padding: 20px 20px;
  margin: 140px auto 0px;
  overflow: hidden;
}
.side{
  width: 250px !important;
  display: none;
  flex-shrink: 0;
  flex-grow: 0;
  height: 60vh;
}
.content{
  max-width: 750px;
  flex-shrink: 0;
  flex-grow: 0;
}
@media (min-width: 1024px) {
  .side{
    display: block;
  }
  .layout{
    margin-top: 80px;
  }
}
.screen-full-point-bg{
  @apply w-screen h-screen fixed top-0 left-0 -z-1;
  background-image: var(--bg-point);
  background-repeat: repeat;
}
</style>
