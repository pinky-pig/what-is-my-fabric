<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getStroke } from 'perfect-freehand'
import useCanvas, { toggleSelection } from '../control/useCanvas'

import { setBackground } from '../control/useOperate'
import useKeyStoke from '../events/useKeyStoke'
import { addFabricCanvasEvent } from '../events'
import { RoughPath } from '../modules/rough-path'
import { getSvgPathFromStroke } from '../utils'
import { useFabricStore } from '~/store/modules/fabric'
const store = useFabricStore()
const [,initCanvas] = useCanvas()
const { wrapperRef, canvasRef } = storeToRefs(store)

// 第一步：初始化画布。 在 nextTick 函数里初始化canvas，不然 fabric 无法找到 canvas
onMounted(() => {
  initCanvas()

  const [,,useWatchKeyboard] = useKeyStoke()
  // setBackground()
  addFabricCanvasEvent()
  useKeyStoke()
  useWatchKeyboard()
})
</script>

<template>
  <div id="wrapperRef" ref="wrapperRef" class=" w-full h-full rounded-md overflow-hidden">
    <canvas id="canvas" ref="canvasRef" />
  </div>
</template>

<style lang="less" scoped>

</style>
