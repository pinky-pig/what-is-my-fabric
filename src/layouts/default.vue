<template>
  <!-- <div class="screen-full-point-bg" /> -->

  <RouterView />
  <NaiveProvider />
</template>

<style lang="less" scoped>
.screen-full-point-bg{
  @apply w-screen h-screen fixed top-0 left-0 -z-1;
  background-image: var(--bg-point);
  background-repeat: repeat;
}
</style>
