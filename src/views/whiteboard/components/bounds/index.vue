<script setup lang="ts">
// 这里只是确定框选的位置
// 实际的操控元素放大缩小或者平移还是依靠的是isSelected属性
import RotateHandle from './RotateHandle.vue'
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
    <RotateHandle :element-bound="elementBound" center="top_center_rotate" />
    <EdgeHandle :element-bound="elementBound" edge="top_edge" />
    <EdgeHandle :element-bound="elementBound" edge="bottom_edge" />
    <EdgeHandle :element-bound="elementBound" edge="left_edge" />
    <EdgeHandle :element-bound="elementBound" edge="right_edge" />
    <CornerHandle :element-bound="elementBound" corner="top_left_corner" />
    <CornerHandle :element-bound="elementBound" corner="top_right_corner" />
    <CornerHandle :element-bound="elementBound" corner="bottom_right_corner" />
    <CornerHandle :element-bound="elementBound" corner="bottom_left_corner" />
  </g>
</template>

<style lang="less" scoped>

</style>
