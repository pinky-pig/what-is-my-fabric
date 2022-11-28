import { storeToRefs } from 'pinia'
// import { Rectangle } from '../components/element'
// import { generateUuid } from '../utils'
import type { Ref } from 'vue'

import { generateUuid } from '../../utils'
import { hitTest } from './hitTest'
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
    // 这里点击，只能选择一个
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
    // 这里框选，可以选择多个，，但是多个只是选择效果，其会生成一个更大的范围，用以操作
  }
  function handlePointerUp() {
  }

  // 监听鼠标事件
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
