<script setup lang="ts">
import Toolbar from './toolbar/index.vue'
import Operate from './operate/index.vue'
import Canvas from './canvas/index.vue'
</script>

<template>
  <!-- 全屏 -->
  <div class="bg-[#FFFEFC] w-screen h-screen overflow-hidden flex justify-center items-center gap-3">
    <!-- tools 工具条 -->
    <Toolbar />
    <!-- canvas 画布 -->
    <Canvas />
    <!-- 主要操作 -->
    <!-- <Operate /> -->
  </div>
</template>

<style lang="less" scoped>

</style>
