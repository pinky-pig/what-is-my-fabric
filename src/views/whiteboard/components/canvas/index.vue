<script setup lang="ts">
import type { StrokeOptions } from 'perfect-freehand'
import { getStroke } from 'perfect-freehand'
import { storeToRefs } from 'pinia'
import { getSvgPathFromStroke } from '../../../utils/index'
import { isPressedCtrl, useKeyEvents } from '../../hooks/useKeyEvents'
import { useZoomEvents } from '../../hooks/useZoomEvents'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { useSvgStore } from '~/store/modules/svg'

// free-hand的配置
const options: StrokeOptions = {
  size: 10,
  thinning: 0.618,
  smoothing: 0.5,
  streamline: 0.5,
}

// 全局状态 pinia
const store = useSvgStore()
// 设置画布的Dom
const { svgWrapperRef, svgCanvasRef } = storeToRefs(store)
// 设置画布的尺寸，缩放比例，自由绘制的点的集合
const { cfg, viewPortZoom, freeDrawPoints } = storeToRefs(store)
// 监听键盘按键
useKeyEvents()

const pathData = ref('')
watch(() => freeDrawPoints.value, () => {
  const stroke = getStroke(freeDrawPoints.value, options)
  pathData.value = getSvgPathFromStroke(stroke)
})

const setViewPort = () => {
  if (!svgWrapperRef.value)
    return
  cfg.value.viewPortWidth = svgWrapperRef.value.offsetWidth
  cfg.value.viewPortHeight = svgWrapperRef.value.offsetHeight
}
onMounted(() => {
  setViewPort()
})

let draggedEvt: any = null // 每次的拖拽事件
const drag = (event: MouseEvent | TouchEvent) => {
  const pt = eventToLocation(event)
  if (draggedEvt) {
    const oriPt = eventToLocation(draggedEvt)
    const x = cfg.value.viewPortX + (oriPt.x - pt.x)
    const y = cfg.value.viewPortY + (oriPt.y - pt.y)
    const w = cfg.value.viewPortWidth
    const h = cfg.value.viewPortHeight

    updateViewPort(x, y, w, h)
  }
  draggedEvt = event
}

function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
  const { top, left } = useElementBounding(svgWrapperRef)
  const touch = event instanceof MouseEvent ? event : event.touches[idx]
  const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
  const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
  return { x, y }
}

function updateViewPort(x: number, y: number, w: number | null, h: number | null, force = false) {
  if (!svgWrapperRef.value)
    return

  // 这里的w,h比例应该跟画布的比例相同。虽然在调用这个方法之前计算的w、h也是根据比例计算的。
  // 这里经过下面的计算不出意外得出的值应该跟其之前相同
  if (w === null && h !== null)
    w = svgWrapperRef.value.offsetWidth * h / svgWrapperRef.value.offsetHeight

  if (h === null && w !== null)
    h = svgWrapperRef.value.offsetHeight * w / svgWrapperRef.value.offsetWidth

  if (!w || !h)
    return
  cfg.value.viewPortX = parseFloat((1 * x).toPrecision(6))
  cfg.value.viewPortY = parseFloat((1 * y).toPrecision(6))
  cfg.value.viewPortWidth = parseFloat((1 * w).toPrecision(4))
  cfg.value.viewPortHeight = parseFloat((1 * h).toPrecision(4))
  viewPortZoom.value = cfg.value.viewPortWidth / svgWrapperRef.value.offsetWidth
}

function handlePointerDown(e) {
  e.target.setPointerCapture(e.pointerId)
  const pt = eventToLocation(e)
  freeDrawPoints.value = [[pt.x, pt.y, e.pressure]]
}
function handlePointerMove(e) {
  if (isPressedCtrl.value) {
    // 移动画布
    drag(e)
  }
  else {
    if (e.buttons !== 1)
      return

    const pt = eventToLocation(e)
    freeDrawPoints.value = [...freeDrawPoints.value, [pt.x, pt.y, e.pressure]]
  }
}
function handlePointerUp(e) {
  draggedEvt = null
}

// 监听画布缩放
useZoomEvents(cfg, svgWrapperRef, viewPortZoom)
// 监听窗口尺寸改变
useResizeObserver(cfg, svgWrapperRef, viewPortZoom)
</script>

<template>
  <div id="svgWrapperRef" ref="svgWrapperRef" class=" w-screen h-screen rounded-md overflow-hidden">
    <svg
      id="svgCanvasRef"
      ref="svgCanvasRef"
      :viewBox="`${cfg.viewPortX} ${cfg.viewPortY} ${cfg.viewPortWidth} ${cfg.viewPortHeight}`"
      class="w-full h-full"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <path :d="pathData" />
    </svg>
  </div>
</template>

<style lang="less" scoped>

</style>
