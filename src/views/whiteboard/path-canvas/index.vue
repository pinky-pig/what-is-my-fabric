<script setup lang="ts">
import type { MaybeElement, MaybeElementRef } from '@vueuse/core'
import type { StrokeOptions } from 'perfect-freehand'
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '../../utils/index'
const options: StrokeOptions = {
  size: 10,
  thinning: 0.618,
  smoothing: 0.5,
  streamline: 0.5,
}
const points = ref<(number[] | {
  x: number
  y: number
  pressure?: number
})[]>([])
const pathData = ref('')
watch(() => points.value, () => {
  const stroke = getStroke(points.value, options)
  pathData.value = getSvgPathFromStroke(stroke)
})

const { Ctrl } = useMagicKeys()
const isPressedCtrl = ref(false)
watch(Ctrl, (v) => {
  isPressedCtrl.value = v
})
const svgWrapperRef = ref<HTMLElement>()
const cfg = ref({
  viewPortX: 0,
  viewPortY: 0,
  viewPortWidth: 0,
  viewPortHeight: 0,
})
const viewPortZoom = ref(1)
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
  points.value = [[pt.x, pt.y, e.pressure]]
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
    points.value = [...points.value, [pt.x, pt.y, e.pressure]]
  }
}
function handlePointerUp(e) {
  draggedEvt = null
}

function handleWheel(e) {
  e.preventDefault()
  const scale = 1.005 ** e.deltaY
  const pt = eventToLocation(e)
  zoomViewPort(scale, pt)
}
function zoomViewPort(scale: number, pt?: { x: number; y: number }) {
  if (!pt)
    pt = { x: cfg.value.viewPortX + 0.5 * cfg.value.viewPortWidth, y: cfg.value.viewPortY + 0.5 * cfg.value.viewPortHeight }
  const x = cfg.value.viewPortX + ((pt.x - cfg.value.viewPortX) - scale * (pt.x - cfg.value.viewPortX))
  const y = cfg.value.viewPortY + ((pt.y - cfg.value.viewPortY) - scale * (pt.y - cfg.value.viewPortY))
  const w = scale * cfg.value.viewPortWidth
  const h = scale * cfg.value.viewPortHeight
  updateViewPort(x, y, w, h)
}
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
      @wheel="handleWheel"
    >
      <path :d="pathData" />
    </svg>
  </div>
</template>

<style lang="less" scoped>

</style>
