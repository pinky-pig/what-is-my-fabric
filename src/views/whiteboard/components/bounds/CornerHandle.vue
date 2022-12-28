<script setup lang="ts">
import { ControlConf, ControlCursor } from '~/store/modules/svg'

const { elementBound, size, corner, gap } = defineProps({
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
  corner: { default: 'top_left_corner' },
})
const { x, y, height, width } = elementBound.bounds

const coords = {
  top_left_corner: [x - (size / 2) - gap, y - (size / 2) - gap],
  top_right_corner: [x + width - (size / 2) + gap, y - (size / 2) - gap],
  bottom_right_corner: [x + width - (size / 2) + gap, y + height - (size / 2) + gap],
  bottom_left_corner: [x - (size / 2) - gap, y + height - (size / 2) + gap],
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
    :rx="size / 5"
    :ry="size / 5"
    :width="size"
    :height="size"
    fill="white"
    :stroke="ControlConf.strokeColor"
    stroke-width="1px"
  />
</template>

<style lang="less" scoped>
.corner-handle{
  cursor: v-bind(cursorRef);
}
</style>
