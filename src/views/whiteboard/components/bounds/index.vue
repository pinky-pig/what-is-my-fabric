<script setup lang="ts">
// 这里只是确定框选的位置
// 实际的操控元素放大缩小或者平移还是依靠的是isSelected属性
import RotateHandle from './RotateHandle.vue'
import EdgeHandle from './EdgeHandle.vue'
import CornerHandle from './CornerHandle.vue'
import { ControlConf } from '~/store/modules/svg'

const { elementBound, gap } = defineProps({
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
      groupMatrix: '' as string | undefined,
    },
  },
  gap: { default: 10 },
})
</script>

<template>
  <g :id="`transfrom_selection_box-${elementBound.elementId}`" :transform="elementBound?.groupMatrix" class="transfrom_selection_box">
    <rect
      :id="`edge-handle-${elementBound.elementId}`"
      :x="elementBound.bounds.x - gap"
      :y="elementBound.bounds.y - gap"
      :width="elementBound.bounds.width + gap * 2"
      :height="elementBound.bounds.height + gap * 2"
      fill="transparent"
      :stroke="ControlConf.strokeColor"
      stroke-width="1px"
    />
    <RotateHandle :element-bound="elementBound" center="top_center_rotate" :gap="gap" />
    <EdgeHandle :element-bound="elementBound" edge="top_edge" :gap="gap" />
    <EdgeHandle :element-bound="elementBound" edge="bottom_edge" :gap="gap" />
    <EdgeHandle :element-bound="elementBound" edge="left_edge" :gap="gap" />
    <EdgeHandle :element-bound="elementBound" edge="right_edge" :gap="gap" />
    <CornerHandle :element-bound="elementBound" corner="top_left_corner" :gap="gap" />
    <CornerHandle :element-bound="elementBound" corner="top_right_corner" :gap="gap" />
    <CornerHandle :element-bound="elementBound" corner="bottom_right_corner" :gap="gap" />
    <CornerHandle :element-bound="elementBound" corner="bottom_left_corner" :gap="gap" />
  </g>
</template>

<style lang="less" scoped>

</style>
