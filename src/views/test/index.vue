<script setup lang="ts">
import rough from 'roughjs'

let roughCanvas: any = null
let context: any = null

const seed = rough.newSeed()

const mouseFrom = ref({ x: 0, y: 0 })
const mouseTo = ref({ x: 0, y: 0 })
const previous = ref()
onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  context = canvas.getContext('2d') as CanvasRenderingContext2D
  roughCanvas = rough.canvas(canvas, { options: { fill: 'blue', roughness: 1.5 } })

  const generator = roughCanvas.generator
  const rect2 = generator.rectangle(10, 120, 100, 100, { fill: 'red', seed })
  roughCanvas.draw(rect2)

  const step = (count) => {
    context.clearRect(200, 120, 100, 100)
    const rect1 = generator.rectangle(200, 120, 100, 100, { fill: 'red', seed })

    roughCanvas.draw(rect1)
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

const drawRect = () => {
  let path = `M ${mouseFrom.value.x} ${mouseFrom.value.y}`
  path += ` L ${mouseTo.value.x} ${mouseFrom.value.y}`
  path += ` L ${mouseTo.value.x} ${mouseTo.value.y}`
  path += ` L ${mouseFrom.value.x} ${mouseTo.value.y}`
  path += ` L ${mouseFrom.value.x} ${mouseFrom.value.y} z`

  if (previous.value)
    context.clearRect(0, 0, 800, 800)

  const p = roughCanvas.path(path, { fill: 'green' })
  roughCanvas.draw(p)

  previous.value = p
}

const handleDown = (e: MouseEvent) => {
  mouseFrom.value.x = e.offsetX
  mouseFrom.value.y = e.offsetY
}
const handleMove = (e: MouseEvent) => {
  mouseTo.value.x = e.offsetX
  mouseTo.value.y = e.offsetY

  drawRect()
}
</script>

<template>
  <canvas id="canvas" width="800" height="800" class="border border-black" @mousedown="handleDown" @mousemove="handleMove" />
</template>

<style lang="less" scoped>

</style>
