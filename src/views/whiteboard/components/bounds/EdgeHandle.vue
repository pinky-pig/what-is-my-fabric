<script setup lang="ts">
const { size, isHidden, bounds, edge } = defineProps({
  bounds: {
    default: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
  size: { default: 10 },
  edge: { default: 'top_edge' },
  isLocked: { default: false },
  isHidden: { default: false },
})
const { x, y, height, width } = bounds
const coords = ref({
  top_edge: [x + (width - size) / 2, y - (size / 2)],
  bottom_edge: [x + (width - size) / 2, y + height - (size / 2)],
  left_edge: [x - (size / 2), y + (height - size) / 2],
  right_edge: [x + width - size / 2, y + (height - size) / 2],
})
</script>

<template>
  <rect
    class="edge-handle"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="coords[edge][0]"
    :y="coords[edge][1]"
    :width="size"
    :height="size"
  />
</template>

<style lang="less" scoped>
.edge-handle{
  fill: none;
  stroke: black;
  stroke-width: 1px;
}
</style>
