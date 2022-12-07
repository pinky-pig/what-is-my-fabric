/* eslint-disable no-console */
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
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { generateUuid } from '../../utils'
import { getShapeStyle } from '../../components/element/shared'
import { ColorStyle, DashStyle, SizeStyle } from '../../types'
import { browserComputePathBoundingBox } from '../../utils/bounds'
import { calculateAllObjectBounds, getElementAbsoluteX1, getElementAbsoluteX2, getElementAbsoluteY1, getElementAbsoluteY2, hitTest } from './hitTest'
import { recalculateDimensions } from './transform-parser'
import type { BoundType, CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'

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
export function useBoundsBox(
  selectedBounds: Ref<ElementBound[]>,
  previewContainerBoxElement: Ref<CurrentElementType | undefined>,
  selectedAllBoxElement: Ref<CurrentElementType | undefined>,
) {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, elements, viewPortZoom } = storeToRefs(store)
  let previousEvent: PointerEvent | null = null
  const isDraggingElement = ref(false)
  const isResizeElement = ref(false)
  watch(() => elements, () => {
    // 如果是正在拖拽要素，下面的新增要素的方法就不走了
    if (isDraggingElement.value)
      return

    // 1. 监听要素选中，然后给要素添加一个选中框
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
    // 2. 如果选中了多个，那么就添加一个大选择框
    const isSelectedElements = findElementIsSelected()
    if (isSelectedElements.length > 1) {
      const allElementBound = calculateAllObjectBounds(isSelectedElements)
      const path = getContainerBoxPath([allElementBound.x, allElementBound.y], [allElementBound.x + allElementBound.width, allElementBound.y + allElementBound.height])
      const style = getShapeStyle({
        color: ColorStyle.Indigo, size: SizeStyle.Small, isFilled: true, dash: DashStyle.Solid,
      }, false)
      selectedAllBoxElement.value = {
        id: generateUuid(),
        type: 'Hand',
        path,
        style: {
          ...style,
          fill: `${style.fill}60`,
        },
        isSelected: false,
        bound: allElementBound,
      }
    }
    else {
      selectedAllBoxElement.value = undefined
    }
  }, {
    deep: true,
  })
  watch(isDraggingElement, (nVal) => {
    if (nVal) {
      selectedBounds.value = []
      selectedAllBoxElement.value = undefined
    }
    else {
      const isSelectedElements = findElementIsSelected()
      isSelectedElements.forEach((element) => {
        // 获取选中移动的 svg 要素
        const selected = document.getElementById(element.id) as unknown as SVGPathElement
        if (selected instanceof SVGPathElement) {
          const result = recalculateDimensions(selected)
          if (result) {
            element.path = result
            element.bound = browserComputePathBoundingBox(result)
            element.matrix = ''
          }
        }
      })
    }
  })

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)

    // 1.获取点击的是否是控制点
    const clickedElement = document.elementFromPoint(e.clientX, e.clientY) as SVGElement
    if (clickedElement) {
      switch (true) {
        case clickedElement.className.baseVal.startsWith('corner-handle') :{
          const id = clickedElement.id.replace('corner-handle-', '')
          console.log(id)
          break
        }
        case clickedElement.className.baseVal.startsWith('edge-handle'):{
          const id = clickedElement.id.replace('edge-handle-', '')
          console.log(id)
          break
        }

        default:
          break
      }
    }

    // 2.如果有已经被选中的要素，并且当前鼠标点击的位置是在其范围内，那么设置鼠标为移动
    const isSelectedElements = findElementIsSelected()
    if (someElementIsSelected()
        && getIsInBoxAtPosition(isSelectedElements.length > 1 ? selectedAllBoxElement.value?.bound : isSelectedElements[0].bound, pt)) {
      previousEvent = e
      isDraggingElement.value = true
      return
    }

    // 2.点击选中，只能选择一个
    const ele = getElementAtPosition(pt.x, pt.y)
    if (ele) {
      elements.value.forEach((element) => {
        if (element.id === ele.id)
          element.isSelected = true
        else
          element.isSelected = false
      })
    }
    else {
      elements.value.forEach((element) => {
        element.isSelected = false
      })
    }
  }
  function handlePointerMove(e: PointerEvent) {
    /// ------------------------------------------------------------------------------- ///
    // 这里框选，可以选择多个，，但是多个只是选择效果，其会生成一个更大的范围，用以操作
    const pt = eventToLocation(e)

    /// ------------------------------------------------------------------------------- ///
    /** 1. 选中的要素移动 */
    if (isDraggingElement.value) {
      const selectedElements = elements.value.filter(el => el.isSelected)
      if (selectedElements.length > 0 && e.buttons === 1) {
        selectedElements.forEach((element) => {
          if (element.matrix) {
            // 如果已经有变形，说明正在拖拽中
            // 鼠标点击开始移动的第一个点
            const prePt = eventToLocation(previousEvent as PointerEvent)
            // 这次事件
            const nowPt = eventToLocation(e)
            // 每次重新赋值给 matrix
            const disX = nowPt.x - prePt.x
            const disY = nowPt.y - prePt.y
            element.matrix = `translate(${disX} ,${disY})`
          }
          else {
            // 之前还没有变形，说明才刚拖拽第一次
            element.matrix = 'translate(0, 0)'
          }
        })
      }
      return
    }

    /** 2. 选中的要素重新设置尺寸 */
    if (isResizeElement.value)
      console.log('缩放path')

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
    // 拖拽框选的预选框
    previewContainerBoxElement.value = undefined
    // 拖拽要素
    isDraggingElement.value = false
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
   * 判断点位是否在这个边界内。 只需要判断当前点位大于最小的x|y，小于最大的x|y
   * @param boxBounds 边界
   * @param position 判断的点位
   */
  function getIsInBoxAtPosition(boxBounds: BoundType | undefined, position: { x: number; y: number }) {
    if (!boxBounds)
      return false
    const { x, y } = position
    if (x > boxBounds.x && y > boxBounds.y && x < (boxBounds.x + boxBounds.width) && y < (boxBounds.y + boxBounds.height))
      return true
    else
      return false
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
  function eventToLocation(event: PointerEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof PointerEvent ? event : event.touches[idx]
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
  function findElementIsSelected() {
    return elements.value.filter(element => element.isSelected)
  }
}
