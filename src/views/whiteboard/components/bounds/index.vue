<script setup lang="ts">
// 这里只是确定框选的位置
// 实际的操控元素放大缩小或者平移还是依靠的是isSelected属性
import CenterHandle from './CenterHandle.vue'
import EdgeHandle from './EdgeHandle.vue'
import CornerHandle from './CornerHandle.vue'

const { bounds } = defineProps({
  bounds: {
    default: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
})
</script>

<template>
  <g id="SVGBounds" class="tl-centered-g">
    <CenterHandle :bounds="bounds" />
    <!-- <EdgeHandle :bounds="bounds" edge="top_edge" />
    <EdgeHandle :bounds="bounds" edge="bottom_edge" />
    <EdgeHandle :bounds="bounds" edge="left_edge" />
    <EdgeHandle :bounds="bounds" edge="right_edge" />
    <CornerHandle :bounds="bounds" corner="top_left_corner" />
    <CornerHandle :bounds="bounds" corner="top_right_corner" />
    <CornerHandle :bounds="bounds" corner="bottom_right_corner" />
    <CornerHandle :bounds="bounds" corner="bottom_left_corner" /> -->
  </g>
</template>

<style lang="less" scoped>

</style>
