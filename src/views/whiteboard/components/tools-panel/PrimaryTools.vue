<script setup lang="ts">
import { useSvgStore } from '~/store/modules/svg'
const svgStore = useSvgStore()
const ToolsIcon = {
  Hand: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M8 26H4a2.002 2.002 0 0 1-2-2v-4h2v4h4zM2 12h2v4H2zm24-4h-2V4h-4V2h4a2.002 2.002 0 0 1 2 2zM12 2h4v2h-4zM4 8H2V4a2.002 2.002 0 0 1 2-2h4v2H4zm23 24a.997.997 0 0 1-.707-.293l-6.138-6.138l-3.323 4.986a1 1 0 0 1-1.79-.268l-6-20a1 1 0 0 1 1.245-1.245l20 6a1 1 0 0 1 .268 1.79l-4.986 3.323l6.138 6.138a1 1 0 0 1 0 1.414l-4 4A.997.997 0 0 1 27 32zm0-2.414L29.586 27l-7.155-7.155l5.246-3.498l-16.185-4.855l4.855 16.185l3.498-5.246z"/></svg>',
  Erase: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M7 27h23v2H7zm20.38-16.49l-7.93-7.92a2 2 0 0 0-2.83 0l-14 14a2 2 0 0 0 0 2.83L7.13 24h9.59l10.66-10.66a2 2 0 0 0 0-2.83zM15.89 22H8l-4-4l6.31-6.31l7.93 7.92zm3.76-3.76l-7.92-7.93L18 4l8 7.93z"/></svg>',
  FreeDraw: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M27.307 6.107L30 3.414L28.586 2l-2.693 2.693L24.8 3.6a1.933 1.933 0 0 0-2.8 0l-18 18V28h6.4l18-18a1.933 1.933 0 0 0 0-2.8ZM9.6 26H6v-3.6L23.4 5L27 8.6ZM9 11.586L16.586 4L18 5.414L10.414 13z"/></svg>',
  Line: '<svg width="24" height="24" viewBox="0 0 32 32"><defs/><path d="M15 5h2v4h-2z" fill="currentColor"/><path d="M15 11h2v4h-2z" fill="currentColor"/><path d="M15 17h2v4h-2z" fill="currentColor"/><path d="M15 23h2v4h-2z" fill="currentColor"/></svg>',
  Curve: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M12 29a1 1 0 0 1-.92-.62L6.33 17H2v-2h5a1 1 0 0 1 .92.62L12 25.28l8.06-21.63A1 1 0 0 1 21 3a1 1 0 0 1 .93.68L25.72 15H30v2h-5a1 1 0 0 1-.95-.68L21 7l-8.06 21.35A1 1 0 0 1 12 29Z"/></svg>',
  Rectangle: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M29.391 14.527L17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473zM16 28.036L3.965 16L16 3.964L28.036 16L16 28.036z"/></svg>',
  Ellipse: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/></svg>',
  Arrow: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16.34 16.34 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"/></svg>',
  Text: '<svg width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M25 12h-5v2h5a1 1 0 0 1 1 1v2h-4a3.003 3.003 0 0 0-3 3v1a3.003 3.003 0 0 0 3 3h6v-9a3.003 3.003 0 0 0-3-3zm-3 10a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h4v3zm-6 2h2L12 7h-2L4 24h2l1.694-5h6.613zm-7.629-7l2.497-7.371h.266L13.63 17z"/></svg>',
}
</script>

<template>
  <div class="tools-container">
    <div class="tools">
      <div
        v-for="(item, index) in svgStore.modeList"
        :key="index"
        :class="svgStore.mode === item ? 'activated' : ''"
        class="item"
        @click="svgStore.handleChangeMode(item)"
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
