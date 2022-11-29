import { storeToRefs } from 'pinia'
// import { Rectangle } from '../components/element'
// import { generateUuid } from '../utils'
import type { Ref } from 'vue'

import { generateUuid } from '../../utils'
import { getShapeStyle } from '../../components/element/shared'
import { ColorStyle, DashStyle, SizeStyle } from '../../types'
import { browserComputePathBoundingBox } from '../../utils/bounds'
import { getElementAbsoluteX1, getElementAbsoluteX2, getElementAbsoluteY1, getElementAbsoluteY2, hitTest } from './hitTest'
import type { BoundType, CurrentElementType } from '~/store/modules/svg'
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
let previousEvent: null | PointerEvent = null

export function useBoundsBox(selectedBounds: Ref<ElementBound[]>, previewContainerBoxElement: Ref<CurrentElementType | undefined>) {
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
    // 1.如果有已经被选中的要素，设置鼠标为移动
    if (someElementIsSelected())
      return

    // 2.点击选中，只能选择一个
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
  function handlePointerMove(e: PointerEvent) {
    // 这里框选，可以选择多个，，但是多个只是选择效果，其会生成一个更大的范围，用以操作
    const pt = eventToLocation(e)
    /** 1. 如果已经有选中的，那么这个时候就是移动 | 变形 要素 */
    // 1.1 移动要素
    const selectedElements = elements.value.filter(el => el.isSelected)
    if (selectedElements.length > 0 && e.buttons === 1) {
      let previousPt: null | { x: number; y: number } = null
      if (previousEvent)
        previousPt = eventToLocation(previousEvent)

      if (selectedElements.length) {
        selectedElements.forEach((element) => {
          if (previousPt)
            // eslint-disable-next-line no-console
            console.log(element)
        })
        previousEvent = e
        return
      }
    }

    /** 2.生成预选框 */
    if (store.mode === 'Hand' && e.buttons === 1) {
      store.mouseTo = { x: pt.x, y: pt.y, pressure: e.pressure }
      const style = getShapeStyle({
        color: ColorStyle.LightGray, size: SizeStyle.Small, isFilled: true, dash: DashStyle.Solid,
      }, false)
      const path = getContainerBoxPath([store.mouseFrom.x, store.mouseFrom.y], [store.mouseTo.x, store.mouseTo.y])
      previewContainerBoxElement.value = {
        id: generateUuid(),
        type: 'Hand',
        path,
        style: {
          ...style,
          fill: `${style.fill}60`,
        },
        isSelected: false,
        bound: browserComputePathBoundingBox(path),
      }
    }
    /** 3.预选框的范围内如果有要素，设置其 isSelected 属性为 true */
    if (previewContainerBoxElement.value)
      setSelection(previewContainerBoxElement.value.bound)
  }
  function handlePointerUp() {
    previewContainerBoxElement.value = undefined
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
  /**
   * 获取鼠标点击的位置的要素
   * @param x x 坐标
   * @param y y 坐标
   * @returns 鼠标点击的位置的要素
   */
  function getElementAtPosition(x: number, y: number): CurrentElementType | null {
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
  /**
   * 遍历所有的要素，如果其范围在预选框内，就设置其属性 isSelected 为true
   * @param selection 预选框的bound
   */
  function setSelection(selection: BoundType) {
    const selectionX1 = getElementAbsoluteX1(selection)
    const selectionX2 = getElementAbsoluteX2(selection)
    const selectionY1 = getElementAbsoluteY1(selection)
    const selectionY2 = getElementAbsoluteY2(selection)
    elements.value.forEach((element: CurrentElementType) => {
      const elementX1 = getElementAbsoluteX1(element.bound)
      const elementX2 = getElementAbsoluteX2(element.bound)
      const elementY1 = getElementAbsoluteY1(element.bound)
      const elementY2 = getElementAbsoluteY2(element.bound)
      element.isSelected
        = element.type !== 'Hand'
        && selectionX1 <= elementX1
        && selectionY1 <= elementY1
        && selectionX2 >= elementX2
        && selectionY2 >= elementY2
    })
  }
  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
  /**
   * 两点确定一个矩形，用于渲染预选框
   * @param mouseFromPoint 起始点
   * @param mouseToPoint 终止点
   * @returns 矩形路径
   */
  function getContainerBoxPath(mouseFromPoint: number[], mouseToPoint: number[]) {
    const path = `M ${mouseFromPoint[0]} ${mouseFromPoint[1]}
      L ${mouseToPoint[0]} ${mouseFromPoint[1]}
      L ${mouseToPoint[0]} ${mouseToPoint[1]}
      L ${mouseFromPoint[0]} ${mouseToPoint[1]}
      L ${mouseFromPoint[0]} ${mouseFromPoint[1]} z`
    return path
  }

  function someElementIsSelected() {
    return elements.value.some(element => element.isSelected)
  }
}
