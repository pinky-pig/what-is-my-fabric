<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useCanvas from '../control/useCanvas'
import { useMouseWheel } from '../events/useMouseWheel'
import { useMouseDown } from '../events/useMouseDown'
import { useMouseMove } from '../events/useMouseMove'
import { useMouseUp } from '../events/useMouseUp'
import { setBackground } from '../control/useOperate'
import useKeyStoke from '../events/useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'
const store = useFabricStore()
const [,initCanvas] = useCanvas()
const { wrapperRef, canvasRef } = storeToRefs(store)

// 第一步：初始化画布。 在 nextTick 函数里初始化canvas，不然 fabric 无法找到 canvas
onMounted(() => {
  initCanvas()

  const [,,useWatchKeyboard] = useKeyStoke()
  setBackground()
  useMouseWheel()
  useMouseDown()
  useMouseMove()
  useMouseUp()
  useKeyStoke()
  useWatchKeyboard()
})
</script>

<template>
  <div id="wrapperRef" ref="wrapperRef" class=" w-3/5 h-4/5 rounded-md border-3 border-solid border-black overflow-hidden">
    <canvas id="canvas" ref="canvasRef" />
  </div>
</template>

<style lang="less" scoped>

</style>
