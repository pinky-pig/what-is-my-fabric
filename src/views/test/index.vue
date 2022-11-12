<script setup lang="ts">
const middle = ref(null)
const end = ref(null)
const pointStart = ref([0, 100])
const pointEnd = ref([800, 100])
const pointMiddle = ref([600, 0])
const p = computed(() => {
  return `
    M ${pointStart.value[0]} ${pointStart.value[1]}
    C ${pointStart.value[0]} ${pointStart.value[1]} ${pointMiddle.value[0] - 100} ${pointMiddle.value[1]} ${pointMiddle.value[0]} ${pointMiddle.value[1]}
    S ${pointEnd.value[0]} ${pointEnd.value[1]} ${pointEnd.value[0]} ${pointEnd.value[1]}
  `
})

const calArrowHeadCoords = (point: number[], h = 10) => {
  // 设置角度为30度
  const x = h * Math.sqrt(3)
  return [
    [x, point[1] + h],
    [x, point[1] - h],
  ]
}

const arrowHeadPath = computed(() => {
  const coords = calArrowHeadCoords(pointEnd.value)

  return `
  M ${pointEnd.value[0]} ${pointEnd.value[1]}
  L ${coords[0][0]} ${coords[0][1]}
  M ${pointEnd.value[0]} ${pointEnd.value[1]}
  L ${coords[1][0]} ${coords[1][1]}
  `
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
// const calArrowHeadOrientation = (pointControl: [number, number], point: [number, number]) => {
//   const angle = calculateAngle(pointControl, point)
//   const coords = calArrowHeadCoords(pointEnd.value)
//   coords = coords.map((item: number[]) => {
//     return calculateCoords(item, angle)
//   })
// }
// function calculateAngle(start: [number, number], end: [number, number]) {
//   const distanceX = end[0] - start[0]
//   const distanceY = end[1] - start[1]
//   const baseAngle = Math.atan2(distanceY, distanceX)
//   return baseAngle
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////

let isDragging = false
const handleMove = (e) => {
  if (isDragging)
    pointMiddle.value = [e.pageX, e.pageY]
}
const handleDown = () => {
  isDragging = true
}
const handleUp = () => {
  isDragging = false
}
</script>

<template>
  <svg @mousemove="handleMove" @mouseup="handleUp">
    <path :d="p" fill="transparent" stroke="black" />
    <path :d="arrowHeadPath" fill="transparent" stroke="black" />
    <circle ref="start" :cx="pointStart[0]" :cy="pointStart[1]" r="10" stroke-width="0.2" fill="red" />
    <circle ref="end" :cx="pointEnd[0]" :cy="pointEnd[1]" r="10" stroke-width="0.2" fill="red" />
    <circle ref="control1" :cx="pointMiddle[0] - 100" :cy="pointMiddle[1] " r="10" stroke-width="0.2" fill="green" />
    <circle ref="control1" :cx="pointMiddle[0] + 100" :cy="pointMiddle[1] " r="10" stroke-width="0.2" fill="blue" />
    <circle ref="middle" :cx="pointMiddle[0]" :cy="pointMiddle[1]" r="20" stroke-width="0.2" fill="red" @mousedown="handleDown" />
  </svg>
</template>

<style scoped>
body {
  background: #ddd;
  display: flex;
  justify-content: center;
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
