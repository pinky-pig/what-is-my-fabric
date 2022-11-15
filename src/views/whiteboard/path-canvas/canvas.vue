<script setup lang="ts">
const props = defineProps({
  viewPortX: {
    type: Number,
    default: 0,
  },
  viewPortY: {
    type: Number,
    default: 0,
  },
  viewPortWidth: {
    type: Number,
    default: 0,
  },
  viewPortHeight: {
    type: Number,
    default: 0,
  },
  strokeWidth: {
    type: Number,
    default: 1,
  },
  canvasWidth: {
    type: Number,
    default: 100,
  },
  canvasHeight: {
    type: Number,
    default: 100,
  },
})
const xGrid = ref()
const yGrid = ref()
watch(props, () => {
  if (5 * props.viewPortWidth <= props.canvasWidth) {
    xGrid.value = Array(Math.ceil(props.viewPortWidth) + 1).fill(null).map((_, i) => Math.floor(props.viewPortX) + i)
    yGrid.value = Array(Math.ceil(props.viewPortHeight) + 1).fill(null).map((_, i) => Math.floor(props.viewPortY) + i)
  }
  else {
    xGrid.value = []
    yGrid.value = []
  }
}, { immediate: true })

const symbolFn = key => Symbol(key)
</script>

<template>
  <svg
    id="svgCanvasRef"
    ref="svgCanvasRef"
    class="bg-transparent"
    width="100%"
    height="100%"
    :viewBox="`${viewPortX} ${viewPortY} ${viewPortWidth} ${viewPortHeight}`"
  >
    <line
      :x1="props.viewPortX"
      y1="0"
      :x2="props.viewPortX + props.viewPortWidth"
      y2="0"
      stroke="#99999990"
      fill="transparent"
      :stroke-width="strokeWidth * 4"
    />
    <line
      :x1="0"
      :y1="props.viewPortY"
      :x2="0"
      :y2="props.viewPortY + props.viewPortHeight"
      stroke="#99999990"
      fill="transparent"
      :stroke-width="strokeWidth * 4"
    />
    <line
      v-for="item in xGrid"
      :key="symbolFn(item)"
      :x1="item"
      :y1="props.viewPortY"
      :x2="item"
      :y2="props.viewPortY + props.viewPortHeight"
      stroke="#99999990"
      fill="transparent"
      :stroke-width="strokeWidth"
    />
    <line
      v-for="item in yGrid"
      :key="symbolFn(item)"
      :x1="props.viewPortX"
      :y1="item"
      :x2="props.viewPortX + props.viewPortWidth"
      :y2="item"
      stroke="#99999990"
      fill="transparent"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<style lang="less" scoped>

</style>
