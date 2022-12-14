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
import type { BoundType, ControlCursorTypes, CurrentElementType } from '~/store/modules/svg'
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
  groupMatrix: string | undefined // 用于 rotate 因为rotate后，bounds控制点不好控制，所以这个属性加载到 group中
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
  const isResizingElement = ref(false)

  interface ResizingType {
    resizingType: ControlCursorTypes
    currentElement: CurrentElementType | undefined
  }
  const currentResizingElement = ref<ResizingType | null>(null)
  watch(isResizingElement, (nVal) => {
    if (nVal) {
      selectedBounds.value = []
    }
    else {
      const isSelectedElements = findElementIsSelected()
      isSelectedElements.forEach((element) => {
        // 获取选中要更改其尺寸的 svg 要素 （transform - scale | translate | rotate）
        // 这里scale和translate比较容易，重新生成path后，不需要再进一步考虑
        // 但是rotate需要考虑bound，有个角度的问题

        // 1. 如果有rotate，那么将其属性给group，自身的移除掉
        // 2. 如果没有rotate，说明就是scale，重新生成path
        const elementRotateAngle = getAngleOrOriginFromRotate(element.matrix, 'angle') as number
        const groupElementRotateAngle = getAngleOrOriginFromRotate(element.groupMatrix, 'angle') as number
        const groupElementOrigin = getAngleOrOriginFromRotate(element.groupMatrix, 'origin') as number[]
        const elementOrigin = getAngleOrOriginFromRotate(element.matrix, 'origin') as number[]
        const selected = document.getElementById(element.id) as unknown as SVGPathElement

        if (elementRotateAngle) {
          element.groupMatrix = `rotate(${elementRotateAngle + groupElementRotateAngle} ${elementOrigin[0]} ${elementOrigin[1]})`
          element.matrix = ''
        }
        else {
          if (selected instanceof SVGPathElement) {
            // 1.正常改变路径
            const result = recalculateDimensions(selected)
            if (result) {
              element.path = result
              element.bound = browserComputePathBoundingBox(result)
              element.matrix = ''
            }

            // 2.如果group有旋转角度的话，这个时候也应该旋转
            if (groupElementRotateAngle) {
              // 将原来的旋转角度置空
              element.groupMatrix = ''
              // 获取上次的范围
              const { x, y, width, height } = element.bound
              // 计算中心点的位置，就是缩放后的中心点基于缩放前的中心点旋转角度后的中心点位置
              const coords = calculateCoords(groupElementOrigin, [x + width / 2, y + height / 2], groupElementRotateAngle * Math.PI / 180)

              // 计算缩放后的图形的中心点和旋转后的中心点的位置偏差
              const dX = coords[0] - (x + width / 2)
              const dY = coords[1] - (y + height / 2)

              // 将缩放后的图形移动
              element.matrix = `translate(${dX} ${dY}) `

              // 将平移后的要素重新计算坐标，然后再对其进行旋转
              nextTick(() => {
                const result = recalculateDimensions(selected)
                element.path = result
                element.bound = browserComputePathBoundingBox(result)
                const { x, y, width, height } = element.bound
                element.groupMatrix = `rotate(${groupElementRotateAngle} ${x + width / 2} ${y + height / 2})`
              })
            }
          }
        }
      })
    }
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

  watch(() => elements, () => {
    // 如果是正在拖拽要素，下面的新增要素的方法就不走了
    if (isDraggingElement.value)
      return
    // 如果是正在改变要素尺寸大小，下面的新增要素
    if (isResizingElement.value)
      return

    // 1. 监听要素选中，然后给要素添加一个选中框
    selectedBounds.value = []
    elements.value.forEach((element) => {
      if (element.isSelected) {
        selectedBounds.value?.push({
          id: generateUuid(),
          elementId: element.id,
          bounds: element.bound,
          groupMatrix: element.groupMatrix,
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

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)

    // 1.获取点击的是否是控制点
    const clickedElement = document.elementFromPoint(e.clientX, e.clientY) as SVGElement
    if (clickedElement) {
      if (clickedElement.className.baseVal.startsWith('corner-handle')) {
        currentResizingElement.value = {
          resizingType: clickedElement.className.baseVal.replace('corner-handle-', '').split(' ')[0],
          currentElement: findElementByElementId(clickedElement.id.replace('corner-handle-', '')),
        }
      }
      else if (clickedElement.className.baseVal.startsWith('edge-handle')) {
        currentResizingElement.value = {
          resizingType: clickedElement.className.baseVal.replace('edge-handle-', '').split(' ')[0],
          currentElement: findElementByElementId(clickedElement.id.replace('edge-handle-', '')),
        }
      }
      else if (clickedElement.className.baseVal.startsWith('rotate-handle')) {
        currentResizingElement.value = {
          resizingType: clickedElement.className.baseVal.replace('rotate-handle-', '').split(' ')[0],
          currentElement: findElementByElementId(clickedElement.id.replace('rotate-handle-', '')),
        }
      }
      if (currentResizingElement.value) {
        isResizingElement.value = true
        previousEvent = e
        return
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

            // 这里需要修改一下 groupMatrix 的 rotate 的中心点的值
            // 因为只修改角度的时候，其中心点是不变的
            // 但是transltate和resize的时候，element是会改变，其中心点也是会改的，所以要重新计算
            element.matrix = `translate(${disX} ,${disY})`

            // 设置 rotate 的角度
            const groupElementRotateAngle = getAngleOrOriginFromRotate(element.groupMatrix, 'angle') as number
            if (groupElementRotateAngle) {
              const { x, y, width, height } = element.bound
              element.groupMatrix = `rotate(${groupElementRotateAngle} ${disX + x + width / 2} ${disY + y + height / 2})`
            }
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
    if (currentResizingElement.value) {
      // a. 拖拽缩放
      if (
        currentResizingElement.value
        && e.buttons === 1
        && currentResizingElement.value.currentElement
        && (currentResizingElement.value.resizingType.includes('edge') || currentResizingElement.value.resizingType.includes('corner'))
      ) {
        if (currentResizingElement.value.currentElement.matrix) {
          // 鼠标点击开始移动的第一个点
          const prePt = eventToLocation(previousEvent as PointerEvent)
          // 这次事件
          const nowPt = eventToLocation(e)

          const { x, y, width, height } = currentResizingElement.value.currentElement.bound

          let dx = (nowPt.x - prePt.x)
          let dy = (nowPt.y - prePt.y)

          // 如果有旋转角度的话，那么就计算一下偏移的绝对位置
          const groupElementRotateAngle = getAngleOrOriginFromRotate(currentResizingElement.value.currentElement.groupMatrix, 'angle') as number
          if (groupElementRotateAngle) {
            const r = Math.sqrt(dx * dx + dy * dy)
            const theta = Math.atan2(dy, dx) - groupElementRotateAngle * Math.PI / 180.0
            dx = r * Math.cos(theta)
            dy = r * Math.sin(theta)
          }


          let sx = 1
          let sy = 1
          let tx = 0
          let ty = 0

          // 因为svg第一象限在右下，第二象限在左下，第三象限在左上，第四象限在右上
          // 这里拖拽四条边的时候,其origin分别左右,上下相反
          // 鼠标的差，因为是通过比值去计算的，所以这里有一个方向的差值需要取相反数
          // tx 和 ty 是用来设置其 transfrom-origin 的位置的。
          // 如果是上，就以下边为变换原点，所以 y + height
          // 如果是左，以右边为变换原点，所以 x + width
          // 如果是右，以左边为变换原点，所以 x
          // 如果是下，以上边为变换原点，所以 y
          if (currentResizingElement.value.resizingType === 'top_edge') {
            sy = height ? (height - dy) / height : 1
            ty = height
          }

          else if (currentResizingElement.value.resizingType === 'bottom_edge') {
            sy = height ? (height - (-dy)) / height : 1
            ty = 0
          }

          else if (currentResizingElement.value.resizingType === 'left_edge') {
            sx = width ? (width - dx) / width : 1
            tx = width
          }

          else if (currentResizingElement.value.resizingType === 'right_edge') {
            sx = width ? (width - (-dx)) / width : 1
            tx = 0
          }
          /* -------------------------------------------------- */
          /*                     corner                         */
          /* -------------------------------------------------- */
          else if (currentResizingElement.value.resizingType === 'top_left_corner') {
            sx = width ? (width - dx) / width : 1
            sy = height ? (height - dy) / height : 1
            tx = width
            ty = height
          }

          else if (currentResizingElement.value.resizingType === 'top_right_corner') {
            sx = width ? (width - (-dx)) / width : 1
            sy = height ? (height - dy) / height : 1
            tx = 0
            ty = height
          }

          else if (currentResizingElement.value.resizingType === 'bottom_left_corner') {
            sx = width ? (width - dx) / width : 1
            sy = height ? (height - (-dy)) / height : 1
            tx = width
            ty = 0
          }

          else if (currentResizingElement.value.resizingType === 'bottom_right_corner') {
            sx = width ? (width - (-dx)) / width : 1
            sy = height ? (height - (-dy)) / height : 1
            tx = 0
            ty = 0
          }

          currentResizingElement.value.currentElement.matrix = `translate(${x + tx} ${y + ty}) scale(${sx} ${sy}) translate(${-(x + tx)} ${-(y + ty)})`
        }
        else {
          // 之前还没有变形，说明才刚拖拽第一次
          currentResizingElement.value.currentElement.matrix = 'translate(0 0) scale(1 1) translate(0 0)'
        }
      }
      // b. 旋转角度。这里使用的是设置属性 rotate ，不进行重新计算坐标。当多选的时候需要重新计算 bounds
      if (
        currentResizingElement.value
        && e.buttons === 1
        && currentResizingElement.value.currentElement
        && (currentResizingElement.value.resizingType.includes('rotate'))
      ) {
        if (currentResizingElement.value.currentElement.matrix) {
          // 鼠标点击开始移动的第一个点
          // 这次事件
          const { x, y, width, height } = currentResizingElement.value.currentElement.bound

          const nowPt = eventToLocation(e)
          const prePt = previousEvent ? eventToLocation(previousEvent) : { x: x + width / 2, y }
          // mouseDown的点为起点，现在mouseMove的点为终点，计算其与图形中心的角度，单位是弧度制
          // 这里只是path到旋转角度。当松开鼠标才计算，当前path和group的旋转结合计算赋值给group
          const angle = calculateAngelBetweenAB([prePt.x, prePt.y], [nowPt.x, nowPt.y], [x + width / 2, y + height / 2])
          // 转为角度制，旋转
          const elementOrigin = getAngleOrOriginFromRotate(currentResizingElement.value.currentElement.groupMatrix, 'origin')

          if (elementOrigin)
            currentResizingElement.value.currentElement.matrix = `rotate(${angle * 180 / Math.PI} ${elementOrigin[0]} ${elementOrigin[1]})`
          else
            currentResizingElement.value.currentElement.matrix = `rotate(${angle * 180 / Math.PI} ${x + width / 2} ${y + height / 2})`
        }
        else {
          // 之前还没有变形，说明才旋转第一次，设置其为初始状态
          currentResizingElement.value.currentElement.matrix = 'rotate(0)'
        }
      }

      return
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
    // 拖拽框选的预选框
    previewContainerBoxElement.value = undefined
    // 拖拽要素
    isDraggingElement.value = false
    // 设置要改变的要素
    currentResizingElement.value = null
    isResizingElement.value = false
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
  function findElementByElementId(elementId: string): CurrentElementType | undefined {
    return elements.value.find(element => element.id === elementId)
  }
  /**
   * 计算向量夹角，单位是弧度
   * @param {Array.<2>} av
   * @param {Array.<2>} bv
   * @returns {number}
   */
  function calculateAngelBetweenAB(start: [number, number], end: [number, number], center: [number, number]) {
    const calculateAngel = (av, bv) => {
      const distanceX = bv[0] - av[0]
      const distanceY = bv[1] - av[1]
      const baseAngle = Math.atan2(distanceY, distanceX)
      return baseAngle
    }
    const angleStart = calculateAngel(start, center)
    const angleEnd = calculateAngel(end, center)
    return angleEnd - angleStart
  }
  /**
   * 从rotate字符串中截取角度和旋转中心
   * @param str rotate(90 255 170)
   * @param type 'angle' | 'origin'
   * @returns number | number[]
   */
  function getAngleOrOriginFromRotate(str: string | undefined, type: 'angle' | 'origin'): number | number[] {
    if (!str)
      return 0
    const rotateStr = str.match(/(^|\s)rotate\([^\)]*\)/g)
    const angleStr = rotateStr ? rotateStr[0].match(/\(([^\)]*)\)/) : 0
    const arg = angleStr ? angleStr[1].split(' ') : [0, 0, 0]

    return {
      angle: +arg[0],
      origin: [+arg[1], +arg[2]],
    }[type]
  }

  /**
   * 计算旋转后的坐标
   * @param start
   * @param end
   * @param angle
   * @returns
   */
  function calculateCoords(start: number[], end: number[], angle) {
    const x = start[0]
    const y = start[1]
    const x1 = end[0]
    const y1 = end[1]

    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    const x2 = x + (x1 - x) * cos - (y1 - y) * sin
    const y2 = y + (y1 - y) * cos + (x1 - x) * sin
    return [x2, y2]
  }
}
