<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { fabric } from 'fabric'
import rough from 'roughjs'
import { RoughCircle } from '../modules/rough-circle'
import { RoughPath } from '../modules/rough-path'

onMounted(() => {
  window.canvas = new fabric.Canvas('c')

  // 生成 rough-circle
  const roughCircle = new RoughCircle({
    top: 100,
    left: 100,
    radius: 100,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'red',
    fillWeight: 1,
    fillStyle: 'cross-hatch',
    hachureGap: 5,
    objectCaching: false,
    rough: true,
  }, null)

  const path = new RoughPath('M 100, 100 m -75, 0 a75,75 0 1,0 150,0 a75,75 0 1,0 -150,0', {
    stroke: 'black',
    strokeWidth: 2,
    fill: 'red',
    fillWeight: 1,
    left: 150,
    top: 150,
  }, null)
  canvas.add(roughCircle, path).renderAll()

  // 导出图片
  const btn = document.getElementById('btn')
  btn.onclick = function () {
    const dataURL = canvas.toDataURL({
      width: 500,
      height: 500,
      left: 0,
      top: 0,
      format: 'png',
    })
    const w = window.open('about:blank', 'image from canvas')
    w.document.write(`<img src='${dataURL}' alt='from canvas'/>`)
  }
})
</script>

<template>
  <canvas id="c" width="600" height="600" />

  <button id="btn">
    export
  </button>
</template>

<style scoped>
canvas {
    border: 1px solid lightgray;
}
</style>
