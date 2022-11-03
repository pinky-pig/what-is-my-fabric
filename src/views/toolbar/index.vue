<script setup lang="ts">
import { ToolsIcon } from '../constant/index'
import { useFabricStore } from '~/store/modules/fabric'
const fabricStore = useFabricStore()
</script>

<template>
  <div class="tools-container">
    <div class="tools">
      <div
        v-for="(item, index) in fabricStore.modeList"
        :key="index"
        :class="fabricStore.mode === item ? 'activated' : ''"
        class="item"
        @click="fabricStore.handleChangeMode(item)"
      >
        <div class="w-24px h-24px" v-html="ToolsIcon[item]" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tools-container{
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  bottom: 4px;
  min-width: 0px;
  max-width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  overflow: hidden;
}
.tools{
  @apply flex flex-row gap-3 justify-start p-1 rounded-lg;
  box-shadow:0px 0px 16px -1px rgba(0, 0, 0, 0.05), 0px 0px 16px -8px rgba(0, 0, 0, 0.05), 0px 0px 16px -12px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);
}
.item{
  @apply w-8 h-8 flex justify-center items-center cursor-pointer outline-none select-none rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-black;
}
.activated{
  background: rgba(65, 132, 244, 1);
  color: white;
}
</style>
