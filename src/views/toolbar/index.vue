<script setup lang="ts">
const toolbarList = ref([
  {
    key: 'pen',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M27.307 6.107L30 3.414L28.586 2l-2.693 2.693L24.8 3.6a1.933 1.933 0 0 0-2.8 0l-18 18V28h6.4l18-18a1.933 1.933 0 0 0 0-2.8ZM9.6 26H6v-3.6L23.4 5L27 8.6ZM9 11.586L16.586 4L18 5.414L10.414 13z"/></svg>',
  },
  {
    key: 'eraser',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path d="M29.414 24L15.999 10.566a2.047 2.047 0 0 0-2.828 0l-2.586 2.586a2.002 2.002 0 0 0 0 2.829l13.414 13.434a2.002 2.002 0 0 0 2.828 0l2.587-2.587a2 2 0 0 0 0-2.828zm-17.415-9.434l2.586-2.585l3.5 3.5l-2.587 2.587l-3.5-3.5zM25.413 28l-8.5-8.519l2.586-2.587L28 25.414z" fill="currentColor"/><path d="M7 20l2-2l2 2l-2 2z" fill="currentColor"/><path d="M18 9l2-2l2 2l-2 2z" fill="currentColor"/><path d="M7 9l2-2l2 2l-2 2z" fill="currentColor"/><path d="M11 2H2v9h2V4h7V2z" fill="currentColor"/></svg>',
  },
  {
    key: 'rect',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M29.391 14.527L17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473zM16 28.036L3.965 16L16 3.964L28.036 16L16 28.036z"/></svg>',
  },
  {
    key: 'ellipse',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/></svg>',
  },
  {
    key: 'arrow',
    icon: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M23 6v10h5a1 1 0 0 1 .707 1.707l-12 12a1 1 0 0 1-1.414 0l-12-12A1 1 0 0 1 4 16h5V6a2.002 2.002 0 0 1 2-2h10a2.003 2.003 0 0 1 2 2Zm-7 21.586L25.586 18H21V6H11v12H6.414Z"/></svg>',
  },
])
</script>

<template>
  <div class=" flex flex-col gap-3 h-4/5 justify-center">
    <div
      v-for="(item, index) in toolbarList"
      :key="index"
      class="w-10 h-10 flex justify-center items-center cursor-pointer outline-none select-none rounded-lg border-3 border-solid border-black focus:ring-2 focus:ring-offset-2 focus:ring-black hover:bg-gray-50"
    >
      <div class="w-24px h-24px" v-html="item.icon" />
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
