<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { fabric } from 'fabric'
import rough from 'roughjs'
import { RoughCircle } from '../modules/rough-circle'
import { RoughPath } from '../modules/rough-path'
import { testSvg2path } from '../modules/svg2path'

onMounted(() => {
  window.canvas = new fabric.Canvas('c')

  canvas.backgroundColor = '#f5f5f5'

  // 简单path 更改 路径
  const path = new RoughPath('M 50 100 L 10 46 Z', {
    left: 100,
    top: 100,
    stroke: 'black',
    fill: '',
  })

  canvas.add(path)
  canvas.renderAll()
  setTimeout(() => {
    const updatedPath = new RoughPath('M 0 200 L 200 0 Z', {
      left: 100,
      top: 100,
      stroke: 'black',
      fill: '',
    }, {
      strokeWidth: 0.1,
    })
    path.set(updatedPath)

    canvas.renderAll()
  }, 3000)

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

onMounted(() => {
  testSvg2path()
})
</script>

<template>
  <canvas id="c" width="600" height="600" />

  <svg width="100" height="100">
    <circle cx="50" cy="50" r="40" />
  </svg>

  <button id="btn">
    export
  </button>
</template>

<style scoped>
canvas {
    border: 1px solid lightgray;
}
</style>
