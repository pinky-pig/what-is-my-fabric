<script setup lang="ts">
import { ControlCursor } from '~/store/modules/svg'

const { elementBound, size, corner } = defineProps({
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
  corner: { default: 'top_left_corner' },
})
const { x, y, height, width } = elementBound.bounds

const coords = {
  top_left_corner: [x - (size / 2), y - (size / 2)],
  top_right_corner: [x + width - (size / 2), y - (size / 2)],
  bottom_right_corner: [x - (size / 2), y + height - (size / 2)],
  bottom_left_corner: [x + width - (size / 2), y + height - (size / 2)],
}
const cursorRef = ref(ControlCursor[corner])
</script>

<template>
  <rect
    :id="`corner-handle-${elementBound.elementId}`"
    :class="`corner-handle-${corner} corner-handle`"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="coords[corner][0]"
    :y="coords[corner][1]"
    :width="size"
    :height="size"
    fill="white"
    stroke="black"
    stroke-width="1px"
  />
</template>

<style lang="less" scoped>
.corner-handle{
  cursor: v-bind(cursorRef);
}
</style>
