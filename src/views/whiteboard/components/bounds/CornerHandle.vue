<script setup lang="ts">
const { size, isHidden, bounds, corner } = defineProps({
  bounds: {
    default: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
  size: { default: 10 },
  corner: { default: 'top_left_corner' },
  isLocked: { default: false },
  isHidden: { default: false },
})
const { x, y, height, width } = bounds

const coords = {
  top_left_corner: [x - (size / 2), y - (size / 2)],
  top_right_corner: [x + width - (size / 2), y - (size / 2)],
  bottom_right_corner: [x - (size / 2), y + height - (size / 2)],
  bottom_left_corner: [x + width - (size / 2), y + height - (size / 2)],
}
</script>

<template>
  <rect
    class="corner-handle"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="coords[corner][0]"
    :y="coords[corner][1]"
    :width="size"
    :height="size"
  />
</template>

<style lang="less" scoped>
.corner-handle{
  fill: none;
  stroke: black;
  stroke-width: 1px;
}
</style>
