<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Canvas from './canvas.vue'
import { useSvgStore } from '~/store/modules/svg'
import { browserComputePathBoundingBox } from '~/utils/svg/path-box'

const store = useSvgStore()
const { svgWrapperRef, svgCanvasRef } = storeToRefs(store)

onMounted(() => {
  zoomAuto()
})

function zoomAuto() {
  const bbox = browserComputePathBoundingBox(store.rawPath)
  const k = store.getHeight() / store.getWidth()
  let w = bbox.width + 2
  let h = bbox.height + 2
  if (k < h / w)
    w = h / k
  else
    h = k * w
  // -1 是为了让原点靠近左上角 1 格。后面的 减是为了让原点靠近中间
  updateViewPort(
    bbox.x - 1,
    bbox.y - 1,
    w,
    h,
  )
}

function updateViewPort(x: number, y: number, w: number | null, h: number | null, force = false) {
  if (w === null && h !== null)
    w = store.getWidth() * h / store.getHeight()

  if (h === null && w !== null)
    h = store.getHeight() * w / store.getWidth()

  if (!w || !h)
    return

  store.cfg.viewPortX = parseFloat((1 * x).toPrecision(6))
  store.cfg.viewPortY = parseFloat((1 * y).toPrecision(6))
  store.cfg.viewPortWidth = parseFloat((1 * w).toPrecision(4))
  store.cfg.viewPortHeight = parseFloat((1 * h).toPrecision(4))
  store.strokeWidth = store.cfg.viewPortWidth / store.getWidth()
}
</script>

<template>
  <div id="svgWrapperRef" ref="svgWrapperRef" class=" w-screen h-screen rounded-md overflow-hidden">
    <Canvas
      ref="svgCanvasRef"
      :view-port-width="store.cfg.viewPortWidth"
      :view-port-height="store.cfg.viewPortHeight"
      :view-port-x="store.cfg.viewPortX"
      :view-port-y="store.cfg.viewPortY"
      :canvas-width="store.getWidth()"
      :canvas-height="store.getHeight()"
      :stroke-width="store.strokeWidth"
    />
  </div>
</template>

<style lang="less" scoped>

</style>
