<script setup lang="ts">
import type { StrokeOptions } from 'perfect-freehand'
import { getStroke } from 'perfect-freehand'
import { storeToRefs } from 'pinia'
import { getSvgPathFromStroke } from '../../../utils/index'
import { useKeyEvents } from '../../hooks/useKeyEvents'
import { useZoomEvents } from '../../hooks/useZoomEvents'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { useCanvasEvents } from '../../hooks/useCanvasEvents'
import { useSvgStore } from '~/store/modules/svg'

// 全局状态 pinia
const store = useSvgStore()
// 设置画布的Dom
const { svgWrapperRef, svgCanvasRef } = storeToRefs(store)
// 设置画布的尺寸，缩放比例，自由绘制的点的集合（当前正在绘制的要素），所有的已添加的要素
const { cfg, viewPortZoom, freeDrawPoints, elements } = storeToRefs(store)
// 监听键盘按键
useKeyEvents()

// 监听画布缩放
useZoomEvents(cfg, svgWrapperRef, viewPortZoom)
// 监听窗口尺寸改变
useResizeObserver(cfg, svgWrapperRef, viewPortZoom)
// 监听画布触发事件（包括拖拽画布）
useCanvasEvents(cfg, svgWrapperRef, viewPortZoom, freeDrawPoints, elements)

// free-hand的配置
const options: StrokeOptions = {
  size: 10,
  thinning: 0.618,
  smoothing: 0.5,
  streamline: 0.5,
}
// 自由绘制
const pathData = ref('')
watch(() => freeDrawPoints.value, () => {
  const stroke = getStroke(freeDrawPoints.value, options)
  pathData.value = getSvgPathFromStroke(stroke)
})
</script>

<template>
  <div id="svgWrapperRef" ref="svgWrapperRef" class=" w-screen h-screen rounded-md overflow-hidden">
    <svg
      id="svgCanvasRef"
      ref="svgCanvasRef"
      :viewBox="`${cfg.viewPortX} ${cfg.viewPortY} ${cfg.viewPortWidth} ${cfg.viewPortHeight}`"
      class="w-full h-full"
    >
      <g>
        <path :d="pathData" />
      </g>
      <g v-for="element in elements" :key="element.id">
        <path :d="element.path" />
      </g>
    </svg>
  </div>
</template>

<style lang="less" scoped>

</style>
