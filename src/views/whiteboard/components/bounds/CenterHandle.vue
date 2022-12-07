<script setup lang="ts">
const { bounds, isLocked, isHidden } = defineProps({
  bounds: {
    default: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
  isLocked: { default: false },
  isHidden: { default: false },
})
</script>

<template>
  <rect
    :class="isLocked ? 'center-handle' : 'center-handle-dash'"
    :x="bounds.x"
    :y="bounds.y"
    :width="bounds.width"
    :height="bounds.height"
    :style="{ opacity: isHidden ? 0 : 1 }"
    pointer-events="none"
    fill="none"
    aria-label="center handle"
  />
</template>

<style lang="less" scoped>
.rect{
  stroke: black;
  stroke-width: 1px;
}
.center-handle{
  .rect;
}
.center-handle-dash{
  .rect;
  stroke-dasharray: 5;
}
</style>
