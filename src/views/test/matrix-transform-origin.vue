<script setup lang="ts">
function calculate(
  bound: { x: number; y: number; width: number; height: number },
  scale: { sx: number; sy: number },
) {
  const { x, y, width, height } = bound
  const { sx, sy } = scale
  return `matrix(${sx}, 0, 0, ${sy}, ${x - sx * x}, ${y - sy * y})`
}

const bound = ref({ x: 10, y: 10, width: 300, height: 100 })
const scale = ref({ sx: 1.2, sy: 1.2 })
const matrix = ref()

watchEffect(() => {
  matrix.value = calculate(bound.value, scale.value)
})
</script>

<template>
  <div class=" flex flex-row">
    <form>
      <fieldset>
        <legend>设置矩形的默认大小及位置</legend>
        <label for="boundX"> 矩形的X </label>
        <input id="boundX" v-model="bound.x" type="number" checked>
        <label for="boundY"> 矩形的Y </label>
        <input id="boundY" v-model="bound.y" type="number" checked>
        <br>
        <label for="boundWidth"> 矩形的width</label>
        <input id="boundWidth" v-model="bound.width" type="number" checked>
        <label for="boundHeight"> 矩形的height</label>
        <input id="boundHeight" v-model="bound.height" type="number" checked>
      </fieldset>
    </form>
    <form>
      <fieldset>
        <legend>设置矩形的缩放比例</legend>
        <label for="scaleX"> 缩放的X </label>
        <input id="scaleX" v-model="scale.sx" type="number" checked>
        <br>
        <label for="scaleY"> 缩放的Y </label>
        <input id="scaleY" v-model="scale.sy" type="number" checked>
        <br>
      </fieldset>
    </form>
  </div>

  <svg width="1000" height="1000">
    <rect :x="bound.x" :y="bound.y" vector-effect="non-scaling-stroke" :width="bound.width" :height="bound.height" :transform="matrix" />
  </svg>
</template>

<style lang="less" scoped>
rect {
  fill: rgb(0, 0, 255);
  stroke-width: 1;
  stroke: rgb(0, 0, 0);
}
legend {
  background-color: #000;
  color: #fff;
  padding: 3px 6px;
}
</style>
