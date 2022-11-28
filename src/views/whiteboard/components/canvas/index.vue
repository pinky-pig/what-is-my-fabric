<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useKeyEvents } from '../../hooks/useKeyEvents'
import { useZoomEvents } from '../../hooks/useZoomEvents'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { useCanvasEvents } from '../../hooks/useCanvasEvents'
import { usePreviewContainerBox } from '../../hooks/usePreviewContainerBox'
import type { ElementBound } from '../../hooks/useBounds'
import { useBoundsBox } from '../../hooks/useBounds'
import Bounds from '../bounds/index.vue'
import type { CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'
// 全局状态 pinia
const store = useSvgStore()
// 设置画布的Dom
const { svgWrapperRef, svgCanvasRef } = storeToRefs(store)
// 设置画布的尺寸，缩放比例，自由绘制的点的集合（当前正在绘制的要素），所有的已添加的要素
const { cfg, viewPortZoom, elements } = storeToRefs(store)
// 监听键盘按键
useKeyEvents()

// 监听画布缩放
useZoomEvents(cfg, svgWrapperRef, viewPortZoom)
// 监听窗口尺寸改变
useResizeObserver(cfg, svgWrapperRef, viewPortZoom)
// 监听画布触发事件（包括拖拽画布）
const currentDrawingElement = ref<CurrentElementType>()
useCanvasEvents(currentDrawingElement)
// 框选的预选框
const previewContainerBoxElement = ref<CurrentElementType>()
usePreviewContainerBox(previewContainerBoxElement)
// 实际的选框
const selectedBounds = ref<ElementBound[]>([])
onMounted(() => {
  useBoundsBox(selectedBounds)
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
      <!-- 当前绘制的要素 -->
      <g v-if="currentDrawingElement" :id="currentDrawingElement?.id">
        <path
          :d="currentDrawingElement?.path"
          :stroke="currentDrawingElement?.style.stroke"
          :fill="currentDrawingElement?.style.fill"
          :strokeWidth="currentDrawingElement?.style.strokeWidth"
        />
      </g>
      <!-- 已经绘制的要素 -->
      <g v-for="element in elements" :id="element?.id" :key="element.id">
        <path
          :d="element.path"
          :stroke="element?.style.stroke"
          :fill="element?.style.fill"
          :strokeWidth="element?.style.strokeWidth"
        />
      </g>
      <!-- 当前的文字要素 -->
      <foreignObject x="10" y="100" overflow="visible" width="100" height="100">
        <p
          contentEditable="true"
          style="
            display:table-cell;
            padding:10px;
            border:1px solid red;
            background-color:white;
            opacity:0.5;
            font-family:Verdana;
            font-size:20px;
            white-space: pre;
            word-wrap: normal;
            overflow: visible;
            overflow-y: visible;
            overflow-x:visible;"
        >
          Write here some text.
        </p>
      </foreignObject>
      <!-- 框选预选框 -->
      <g v-if="previewContainerBoxElement" :id="previewContainerBoxElement?.id">
        <path
          :d="previewContainerBoxElement?.path"
          :stroke="previewContainerBoxElement?.style.stroke"
          :fill="previewContainerBoxElement?.style.fill"
          :strokeWidth="previewContainerBoxElement?.style.strokeWidth"
        />
      </g>
      <!-- 实际选择框 -->
      <Bounds v-for="item in selectedBounds" :key="item.id" :element-bound="item" />
    </svg>
  </div>
</template>

<style lang="less" scoped>

</style>
