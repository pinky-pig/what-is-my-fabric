<script setup lang="ts">
// 这里只是确定框选的位置
// 实际的操控元素放大缩小或者平移还是依靠的是isSelected属性
import CenterHandle from './CenterHandle.vue'
import EdgeHandle from './EdgeHandle.vue'
import CornerHandle from './CornerHandle.vue'

const { elementBound } = defineProps({
  elementBound: {
    default: {
      id: '',
      elementId: '',
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },
})
</script>

<template>
  <g :id="`SVGBound${elementBound.elementId}`" class="tl-centered-g">
    <CenterHandle :bounds="elementBound.bounds" />
    <EdgeHandle :bounds="elementBound.bounds" edge="top_edge" />
    <EdgeHandle :bounds="elementBound.bounds" edge="bottom_edge" />
    <EdgeHandle :bounds="elementBound.bounds" edge="left_edge" />
    <EdgeHandle :bounds="elementBound.bounds" edge="right_edge" />
    <CornerHandle :bounds="elementBound.bounds" corner="top_left_corner" />
    <CornerHandle :bounds="elementBound.bounds" corner="top_right_corner" />
    <CornerHandle :bounds="elementBound.bounds" corner="bottom_right_corner" />
    <CornerHandle :bounds="elementBound.bounds" corner="bottom_left_corner" />
  </g>
</template>

<style lang="less" scoped>

</style>
