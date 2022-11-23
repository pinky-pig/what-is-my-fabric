import { storeToRefs } from 'pinia'
import { getClosestElementBounds } from '../utils/bounds'
import type { ElementStyle } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'

export function rotate(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  angle: number,
) {
  // 𝑎′𝑥=(𝑎𝑥−𝑐𝑥)cos𝜃−(𝑎𝑦−𝑐𝑦)sin𝜃+𝑐𝑥
  // 𝑎′𝑦=(𝑎𝑥−𝑐𝑥)sin𝜃+(𝑎𝑦−𝑐𝑦)cos𝜃+𝑐𝑦.
  // https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
  return [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ]
}

export function browserComputePathBoundingBox(path) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svgEl = document.createElementNS(svgNS, 'svg')
  svgEl.style.position = 'absolute'
  svgEl.style.width = '0px'
  svgEl.style.height = '0px'
  const pathEl = document.createElementNS(svgNS, 'path')
  pathEl.setAttributeNS(null, 'd', path)
  svgEl.appendChild(pathEl)
  document.body.appendChild(svgEl)
  const result = pathEl.getBBox()
  svgEl.remove()
  return result
}

// const test = (path: any) => {
//   const bbox = browserComputePathBoundingBox(path)
//   const w = bbox.width + 2
//   const h = bbox.height + 2
// }

// If the element is created from right to left, the width is going to be negative
// This set of functions retrieves the absolute position of the 4 points.
// We can't just always normalize it since we need to remember the fact that an arrow
// is pointing left or right.
// export function getElementAbsoluteX1(element: ElementStyle) {
//   return element.width >= 0 ? element.x : element.x + element.width
// }
// export function getElementAbsoluteX2(element: ElementStyle) {
//   return element.width >= 0 ? element.x + element.width : element.x
// }
// export function getElementAbsoluteY1(element: ElementStyle) {
//   return element.height >= 0 ? element.y : element.y + element.height
// }
// export function getElementAbsoluteY2(element: ElementStyle) {
//   return element.height >= 0 ? element.y + element.height : element.y
// }

export function getDiamondPoints(element: ElementStyle) {
  const topX = Math.floor(element.width / 2) + 1
  const topY = 0
  const rightX = element.width
  const rightY = Math.floor(element.height / 2) + 1
  const bottomX = topX
  const bottomY = element.height
  const leftX = topY
  const leftY = rightY

  return [topX, topY, rightX, rightY, bottomX, bottomY, leftX, leftY]
}

export function getArrowPoints(element: ElementStyle) {
  const x1 = 0
  const y1 = 0
  const x2 = element.width
  const y2 = element.height

  const size = 30 // pixels
  const distance = Math.hypot(x2 - x1, y2 - y1)
  // Scale down the arrow until we hit a certain size so that it doesn't look weird
  const minSize = Math.min(size, distance / 2)
  const xs = x2 - ((x2 - x1) / distance) * minSize
  const ys = y2 - ((y2 - y1) / distance) * minSize

  const angle = 20 // degrees
  const [x3, y3] = rotate(xs, ys, x2, y2, (-angle * Math.PI) / 180)
  const [x4, y4] = rotate(xs, ys, x2, y2, (angle * Math.PI) / 180)

  return [x1, y1, x2, y2, x3, y3, x4, y4]
}

/**
 * 1. 绘制框选预选框
 * 2. 鼠标move的时候重绘预选框
 * 3. move的时候计算预选框的范围
 * 4. move的时候遍历每个element，计算坐标
 * 5. 如果在范围内，将其属性isSelect设置为true
 * 6. 当要素被选中的时候，给其增加选框
 */
export function useBoundsBox() {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom, elements } = storeToRefs(store)

  function handlePointerDown(e) {
    if (store.mode === 'Hand' && e.buttons === 1) {
      const pt = eventToLocation(e)
      getClosestElementBounds(elements.value as any, pt)
    }
  }
  function handlePointerMove() {
  }
  function handlePointerUp() {
  }

  // 监听鼠标滚轮事件
  useEventListener(svgWrapperRef, 'pointerdown', handlePointerDown)
  useEventListener(svgWrapperRef, 'pointermove', handlePointerMove)
  useEventListener(svgWrapperRef, 'pointerup', handlePointerUp)

  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
}

