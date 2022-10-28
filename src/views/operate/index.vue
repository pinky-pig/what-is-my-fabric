<script setup lang="ts">
import { exportImage, previewImage } from '../control/useOperate'

const operateList = ref([
  {
    key: 'import',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M28 19H14.83l2.58-2.59L16 15l-5 5l5 5l1.41-1.41L14.83 21H28v-2z"/><path fill="currentColor" d="M24 14v-4a1 1 0 0 0-.29-.71l-7-7A1 1 0 0 0 16 2H6a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2h-2v2H6V4h8v6a2 2 0 0 0 2 2h6v2Zm-8-4V4.41L21.59 10Z"/></svg>',
  },
  {
    key: 'export',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M13 21h13.17l-2.58 2.59L25 25l5-5l-5-5l-1.41 1.41L26.17 19H13v2z"/><path fill="currentColor" d="M22 14v-4a1 1 0 0 0-.29-.71l-7-7A1 1 0 0 0 14 2H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2h-2v2H4V4h8v6a2 2 0 0 0 2 2h6v2Zm-8-4V4.41L19.59 10Z"/></svg>',
  },
  {
    key: 'preview',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z"/><path fill="currentColor" d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"/></svg>',
  },
])

const handleClick = (key: string) => {
  switch (key) {
    case 'import':
      alert('import')
      break
    case 'export':
      exportImage()
      break
    case 'preview':
      previewImage()
      break

    default:
      break
  }
}
</script>

<template>
  <div class=" flex flex-col gap-3 h-4/5 justify-start">
    <div
      v-for="(item, index) in operateList"
      :key="index"
      class="w-10 h-10 flex justify-center items-center cursor-pointer outline-none select-none rounded-lg border-3 border-solid border-black focus:ring-2 focus:ring-offset-2 focus:ring-black hover:bg-gray-50"
      @click="handleClick(item.key)"
    >
      <div class="w-24px h-24px" v-html="item.icon" />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
