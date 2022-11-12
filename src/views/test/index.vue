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
