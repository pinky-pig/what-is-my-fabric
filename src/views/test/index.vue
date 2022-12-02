<script lang="ts" setup>
/**
 * 1. getScreenCTM
 */
const c1 = ref({
  x: 123,
  y: 186,
})
const c2 = ref({
  x: 469.6,
  y: 386.6,
})
onMounted(() => {
  const root = document.getElementsByTagName('svg')[0]
  const ls = document.getElementsByTagName('line')
  const cs = document.getElementsByTagName('circle')
  document.addEventListener('click', showCs, false)
  function showCs(e) {
    const t = e.target
    if (t.tagName !== 'line')
      return
    const ctm = t.getScreenCTM()
    const rootCTM = root.getScreenCTM()
    showCircle(c1, t.x1.baseVal.value, t.y1.baseVal.value, ctm, rootCTM)
    showCircle(c2, t.x2.baseVal.value, t.y2.baseVal.value, ctm, rootCTM)
  }

  function showCircle(c, x, y, ctm, rootCTM) {
    const pt1 = root.createSVGPoint()
    pt1.x = x
    pt1.y = y
    const pt2 = pt1.matrixTransform(rootCTM.inverse().multiply(ctm))
    c.value.x = pt2.x
    c.value.y = pt2.y
  }
})
</script>

<template>
  <svg width="100%" height="100%" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="100">点击线条</text>

    <line id="l1" x1="200" y1="100" x2="600" y2="100" stroke="red" stroke-width="8" />
    <line id="l2" x1="200" y1="100" x2="600" y2="100" stroke="orange" stroke-width="8" transform="rotate(30)" />
    <line id="l3" x1="200" y1="100" x2="600" y2="100" stroke="yellow" stroke-width="8" transform="rotate(60)" />
    <line id="l4" x1="200" y1="100" x2="600" y2="100" stroke="green" stroke-width="8" transform="rotate(90)" />
    <line id="l5" x1="200" y1="100" x2="600" y2="100" stroke="blue" stroke-width="8" transform="rotate(120)" />
    <line id="l6" x1="200" y1="100" x2="600" y2="100" stroke="purple" stroke-width="8" transform="rotate(150)" />

    <g transform="translate(100,100)">
      <line id="l7" x1="200" y1="100" x2="600" y2="100" stroke="purple" stroke-width="20" transform="rotate(30)" />
    </g>

    <circle id="c1" :cx="c1.x" :cy="c1.y" r="28" stroke="green" stroke-width="10" fill="none" />
    <circle id="c2" :cx="c2.x" :cy="c2.y" r="28" stroke="green" stroke-width="10" fill="none" />

    <path d="M 0 0 L 20 20 " stroke="gray" stroke-width="8" />
  </svg>
</template>

<style lang="less" scoped>

</style>
