import { storeToRefs } from 'pinia'
// import { Rectangle } from '../components/element'
// import { generateUuid } from '../utils'
import type { Ref } from 'vue'
import { generateUuid } from '../utils'
import { distanceBetweenPointAndSegment } from '../utils/math'
import type { CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'

/**
 * 1. 绘制框选预选框
 * 2. 鼠标move的时候重绘预选框
 * 3. move的时候计算预选框的范围
 * 4. move的时候遍历每个element，计算坐标
 * 5. 如果在范围内，将其属性isSelect设置为true
 * 6. 当要素被选中的时候，给其增加选框
 * 7. 只选择一个的时候，可以放大缩小旋转等。
 * 8. 选中多个的时候，只能移动位置
 */
export interface ElementBound {
  id: string
  elementId: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}
export function useBoundsBox(selectedBounds: Ref<ElementBound[]>) {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, elements, viewPortZoom } = storeToRefs(store)

  watch(() => elements, () => {
    selectedBounds.value = []
    elements.value.forEach((element) => {
      if (element.isSelected) {
        selectedBounds.value?.push({
          id: generateUuid(),
          elementId: element.id,
          bounds: element.bound,
        })
      }
    })
  }, {
    deep: true,
  })

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)

    const ele = getElementAtPosition(pt.x, pt.y)

    if (ele) {
      elements.value.forEach((element) => {
        if (element.id === ele.id)
          element.isSelected = true
        else
          element.isSelected = false
      })
    }
  }
  function handlePointerMove() {
  }
  function handlePointerUp() {
  }

  // 监听鼠标滚轮事件
  watch(() => store.mode, (nVal) => {
    if (nVal === 'Hand') {
      if (svgWrapperRef.value) {
        svgWrapperRef.value.addEventListener('pointerdown', handlePointerDown, false)
        svgWrapperRef.value.addEventListener('pointermove', handlePointerMove, false)
        svgWrapperRef.value.addEventListener('pointerup', handlePointerUp, false)
      }
    }
    else {
      if (svgWrapperRef.value) {
        svgWrapperRef.value.removeEventListener('pointerdown', handlePointerDown)
        svgWrapperRef.value.removeEventListener('pointermove', handlePointerMove)
        svgWrapperRef.value.removeEventListener('pointerup', handlePointerUp)
      }
    }
  })

  function getElementAtPosition(x: number, y: number) {
    let hitElement: CurrentElementType | null = null
    // We need to to hit testing from front (end of the array) to back (beginning of the array)
    for (let i = elements.value.length - 1; i >= 0; --i) {
      if (hitTest(elements.value[i], x, y)) {
        hitElement = elements.value[i]
        break
      }
    }

    return hitElement
  }
  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
}

function hitTest(
  element: any,
  x: number,
  y: number,
) {
  // For shapes that are composed of lines, we only enable point-selection when the distance
  // of the click is less than x pixels of any of the lines that the shape is composed of
  const lineThreshold = 10

  if (element.type === 'Ellipse') {
    // https://stackoverflow.com/a/46007540/232122
    const px = Math.abs(x - element.x - element.width / 2)
    const py = Math.abs(y - element.y - element.height / 2)

    let tx = 0.707
    let ty = 0.707

    const a = element.width / 2
    const b = element.height / 2;

    [0, 1, 2, 3].forEach(() => {
      const xx = a * tx
      const yy = b * ty

      const ex = ((a * a - b * b) * tx ** 3) / a
      const ey = ((b * b - a * a) * ty ** 3) / b

      const rx = xx - ex
      const ry = yy - ey

      const qx = px - ex
      const qy = py - ey

      const r = Math.hypot(ry, rx)
      const q = Math.hypot(qy, qx)

      tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a))
      ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b))
      const t = Math.hypot(ty, tx)
      tx /= t
      ty /= t
    })

    return Math.hypot(a * tx - px, b * ty - py) < lineThreshold
  }
  else if (element.type === 'Rectangle') {
    const x1 = getElementAbsoluteX1(element.bound)
    const x2 = getElementAbsoluteX2(element.bound)
    const y1 = getElementAbsoluteY1(element.bound)
    const y2 = getElementAbsoluteY2(element.bound)
    // (x1, y1) --A-- (x2, y1)
    //    |D             |B
    // (x1, y2) --C-- (x2, y2)
    return (
      distanceBetweenPointAndSegment(x, y, x1, y1, x2, y1) < lineThreshold // A
      || distanceBetweenPointAndSegment(x, y, x2, y1, x2, y2) < lineThreshold // B
      || distanceBetweenPointAndSegment(x, y, x2, y2, x1, y2) < lineThreshold // C
      || distanceBetweenPointAndSegment(x, y, x1, y2, x1, y1) < lineThreshold // D
    )
  }
}

export function getElementAbsoluteX1(element: any) {
  return element.width >= 0 ? element.x : element.x + element.width
}
export function getElementAbsoluteX2(element: any) {
  return element.width >= 0 ? element.x + element.width : element.x
}
export function getElementAbsoluteY1(element: any) {
  return element.height >= 0 ? element.y : element.y + element.height
}
export function getElementAbsoluteY2(element: any) {
  return element.height >= 0 ? element.y + element.height : element.y
}

