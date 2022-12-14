<script setup lang="ts">
import type { StrokeOptions } from 'perfect-freehand'
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '../utils/index'

const options: StrokeOptions = {
  size: 32,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: t => t,
  start: {
    taper: 0,
    easing: t => t,
    cap: true,
  },
  end: {
    taper: 100,
    easing: t => t,
    cap: true,
  },
}
const points = ref<(number[] | {
  x: number
  y: number
  pressure?: number
})[]>([])
const pathData = ref('')
watch(() => points.value, () => {
  // const stroke = getStroke(points.value, options)
  const stroke = getStroke(points.value, { size: 18, start: { taper: true } })
  pathData.value = getSvgPathFromStroke(stroke)
}, {
  deep: true,
})

function handlePointerDown(e) {
  e.target.setPointerCapture(e.pointerId)
  points.value = [[e.pageX, e.pageY, e.pressure]]
  loop()
}

function handlePointerMove(e) {
  if (e.buttons !== 1)
    return

  points.value = [...points.value, [e.pageX, e.pageY, e.pressure]]
}

let timestamp = 0
let interval = 0
function handleUp(e) {
  cancelAnimationFrame(interval)
}
function loop() {
  const now = Date.now()
  const elapsed2 = now - timestamp
  if (elapsed2 > 32) {
    if (points.value.length > 1) {
      points.value.splice(0, Math.ceil(points.value.length * 0.1))
      timestamp = now
    }
  }
  interval = requestAnimationFrame(loop)
}
</script>

<template>
  <svg @pointerdown="handlePointerDown" @pointermove="handlePointerMove" @pointerup="handleUp">
    <path :d="pathData" stroke="gray" fill="gray" />
  </svg>
</template>

<style scoped>
html,
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  user-select: none;
}

svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  touch-action: none;
}
path{
  opacity: 0.5;
}
</style>
