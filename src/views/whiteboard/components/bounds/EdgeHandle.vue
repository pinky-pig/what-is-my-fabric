<script setup lang="ts">
import { ControlCursor } from '~/store/modules/svg'
const { elementBound, size, edge } = defineProps({
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
  isHidden: { default: false },
  edge: { default: 'top_edge' },
})

const { x, y, height, width } = elementBound.bounds
const coords = ref({
  top_edge: [x + (width - size) / 2, y - (size / 2)],
  bottom_edge: [x + (width - size) / 2, y + height - (size / 2)],
  left_edge: [x - (size / 2), y + (height - size) / 2],
  right_edge: [x + width - size / 2, y + (height - size) / 2],
})
const cursorRef = ref(ControlCursor[edge])
</script>

<template>
  <rect
    :id="`edge-handle-${elementBound.elementId}`"
    :class="`edge-handle-${edge} edge-handle`"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="coords[edge][0]"
    :y="coords[edge][1]"
    :width="size"
    :height="size"
    fill="white"
    stroke="black"
    stroke-width="1px"
  />
</template>

<style lang="less" scoped>
.edge-handle{
  cursor: v-bind(cursorRef);
}
</style>
