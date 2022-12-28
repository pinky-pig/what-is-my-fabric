<script setup lang="ts">
import { ControlConf, ControlCursor } from '~/store/modules/svg'
const { elementBound, size, rotate, gap } = defineProps({
  elementBound: {
    default: {
      id: '0',
      elementId: '0',
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },
  size: { default: 10 },
  gap: { default: 10 },
  isHidden: { default: false },
  rotate: { default: 'top_center_rotate' },
})

const { x, y, height, width } = elementBound.bounds
const coords = ref({
  top_center_rotate: [x + (width - size) / 2, y - (size / 2) - (gap * 2 + 10)],
})
const cursorRef = ref(ControlCursor[rotate])
</script>

<template>
  <rect
    :id="`rotate-handle-${elementBound.elementId}`"
    :class="`rotate-handle-${rotate} rotate-handle`"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="coords[rotate][0]"
    :y="coords[rotate][1]"
    :rx="size"
    :ry="size"
    :width="size"
    :height="size"
    fill="white"
    :stroke="ControlConf.strokeColor"
    stroke-width="1px"
  />
</template>

<style lang="less" scoped>
.rotate-handle{
  cursor: v-bind(cursorRef);
}
</style>
