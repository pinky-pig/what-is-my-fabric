<script setup lang="ts">
const middle = ref(null)
const end = ref(null)
const pointStart = ref([50, 200])
const pointEnd = ref([800, 200])
const pointMiddle = ref([600, 100])
const p = computed(() => {
  return `
    M ${pointStart.value[0]} ${pointStart.value[1]}
    C ${pointStart.value[0]} ${pointStart.value[1]} ${pointMiddle.value[0] - 100} ${pointMiddle.value[1]} ${pointMiddle.value[0]} ${pointMiddle.value[1]}
    S ${pointEnd.value[0]} ${pointEnd.value[1]} ${pointEnd.value[0]} ${pointEnd.value[1]}
  `
})

// 计算箭头两翼的
const calArrowHeadCoords = (point: number[], h = 50) => {
  // 设置角度为30度
  const x = h * Math.sqrt(3)
  return [
    [point[0] + x, point[1] + h],
    [point[0] + x, point[1] - h],
  ]
}

// 计算S控制点与终点的角度
const calAngleControlAndEnd = (start: any, end: any) => {
  const distanceX = end[0] - start[0]
  const distanceY = end[1] - start[1]
  const baseAngle = Math.atan2(distanceY, distanceX)
  return baseAngle
}

const arrowHeadPath = ref()
watch(() => pointMiddle.value, () => {
  const angle = calAngleControlAndEnd([pointEnd.value[0], pointEnd.value[1]], [pointMiddle.value[0] + 100, pointMiddle.value[1]])
  const coords = calArrowHeadCoords(pointEnd.value)
  const c = coords.map((item) => {
    return calculateCoords(pointEnd.value, item, angle)
  })
  arrowHeadPath.value = `
    M ${pointEnd.value[0]} ${pointEnd.value[1]}
    L ${c[0][0]} ${c[0][1]}
    M ${pointEnd.value[0]} ${pointEnd.value[1]}
    L ${c[1][0]} ${c[1][1]}
  `
}, {
  immediate: true,
})

function calculateCoords(start: number[], end: number[], angle) {
  const x = start[0]
  const y = start[1]
  const x1 = end[0]
  const y1 = end[1]

  const sin = Math.sin(angle)
  const cos = Math.cos(angle)

  const x2 = x + (x1 - x) * cos - (y1 - y) * sin
  const y2 = y + (y1 - y) * cos + (x1 - x) * sin
  return [x2, y2]
}

const defaultArrowHeadPath = computed(() => {
  const coords = calArrowHeadCoords(pointEnd.value)

  return `
  M ${pointEnd.value[0]} ${pointEnd.value[1]}
  L ${coords[0][0]} ${coords[0][1]}
  M ${pointEnd.value[0]} ${pointEnd.value[1]}
  L ${coords[1][0]} ${coords[1][1]}
  `
})

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
    <path :d="p" fill="transparent" stroke="purple" />
    <path :d="arrowHeadPath" fill="transparent" stroke="purple" />
    <path :d="defaultArrowHeadPath" fill="transparent" stroke="black" />

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
