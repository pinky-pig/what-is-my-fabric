<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { fabric } from 'fabric'
const canvas = ref(null)
onMounted(() => {
  nextTick(() => {
    const canvas = new fabric.Canvas(document.getElementById('c'), { selection: false })
    // 创建一个矩形对象
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 200,
      height: 200,
    })

    // 添加矩形到画布上
    canvas.add(rect)

    canvas.renderAll()
  })
})
</script>

<template>
  <canvas id="c" width="400" height="300" style="border:1px solid #ccc" />
</template>
