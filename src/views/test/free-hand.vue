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
  const stroke = getStroke(points.value, options)
  pathData.value = getSvgPathFromStroke(stroke)
})

function handlePointerDown(e) {
  e.target.setPointerCapture(e.pointerId)
  points.value = [[e.pageX, e.pageY, e.pressure]]
}

function handlePointerMove(e) {
  if (e.buttons !== 1)
    return

  points.value = [...points.value, [e.pageX, e.pageY, e.pressure]]
}
</script>

<template>
  <svg @pointerdown="handlePointerDown" @pointermove="handlePointerMove">
    <path :d="pathData" />
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
</style>
