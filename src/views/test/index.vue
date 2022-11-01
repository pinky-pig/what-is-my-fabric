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
  const path = new fabric.Path('M 0 20 L 20 0', {
    left: 100,
    top: 100,
    stroke: 'black',
    fill: '',
  })
  canvas.add(path)
  canvas.renderAll()
  setTimeout(() => {
    const updatedPath = new fabric.Path('M 50 100 L 10 46 Z')
    path.set({
      path: updatedPath.path,
      width: updatedPath.width,
      height: updatedPath.height,
      pathOffset: updatedPath.pathOffset,
    })
    canvas.renderAll()
  }, 3000)

  // 复杂一点的path更改
  // const roughPath = new RoughPath('M 100, 100 m -75, 0 a75,75 0 1,0 150,0 a75,75 0 1,0 -150,0', {
  //   stroke: 'black',
  //   strokeWidth: 2,
  //   fill: 'red',
  //   left: 150,
  //   top: 150,
  // }, null)
  // canvas.add(roughPath)
  // canvas.renderAll()

  // setTimeout(() => {
  //   const updatedPath = new fabric.Path('M 50 100 L 10 46 Z')
  //   roughPath.set({
  //     path: updatedPath.path,
  //     width: updatedPath.width,
  //     height: updatedPath.height,
  //     pathOffset: updatedPath.pathOffset,
  //   })
  //   canvas.renderAll()
  // }, 3000)

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
