<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useCanvas from '../control/useCanvas'

import { setBackground } from '../control/useOperate'
import useKeyStoke from '../events/useKeyStoke'
import { addFabricCanvasEvent } from '../events'
import { RoughPath } from '../modules/rough-path'
import { useFabricStore } from '~/store/modules/fabric'
const store = useFabricStore()
const [,initCanvas] = useCanvas()
const { wrapperRef, canvasRef } = storeToRefs(store)

// 第一步：初始化画布。 在 nextTick 函数里初始化canvas，不然 fabric 无法找到 canvas
onMounted(() => {
  initCanvas()

  const [,,useWatchKeyboard] = useKeyStoke()
  setBackground()
  addFabricCanvasEvent()
  useKeyStoke()
  useWatchKeyboard()

  // 测试 rough.js 的使用
  const path = new RoughPath('M 100, 100 m -75, 0 a75,75 0 1,0 150,0 a75,75 0 1,0 -150,0', {
    stroke: 'black',
    strokeWidth: 2,
    fill: 'red',
    left: 150,
    top: 150,
  }, undefined)
  const [canvas] = useCanvas()
  canvas.add(path).renderAll()
})
</script>

<template>
  <div id="wrapperRef" ref="wrapperRef" class=" w-3/5 h-4/5 rounded-md border-3 border-solid border-black overflow-hidden">
    <canvas id="canvas" ref="canvasRef" />
  </div>
</template>

<style lang="less" scoped>

</style>
