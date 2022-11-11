import { fabric } from 'fabric'
import type { IEvent } from 'fabric/fabric-impl'
import { renderArrowPreview, renderCirclePreview, renderDrawPreview, renderLinePreview, renderRectPreview } from '../control/useDraw'
import useCanvas from '../control/useCanvas'
import useKeyStoke from './useKeyStoke'

import { useFabricStore } from '~/store/modules/fabric'

const [isPressedCtrl] = useKeyStoke()

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 移动]
 */
let previousEvent: null | IEvent<MouseEvent> = null

export const useMouseMove = (evt: IEvent<MouseEvent>) => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()

  // 1.拖拽移动画布
  if (isPressedCtrl.value && fabricStore.isCanvasDragging) {
    let { movementX, movementY } = evt.e
    if (
      (movementX === undefined || movementY === undefined)
        && previousEvent
    ) {
      movementX = evt.e.screenX - previousEvent?.e.screenX
      movementY = evt.e.screenY - previousEvent?.e.screenY
    }
    const delta = new fabric.Point(movementX, movementY)
    canvas.relativePan(delta)
    previousEvent = evt

    // 将选中的取消。只有在移动的时候才取消选中。
    canvas.discardActiveObject()
  }

  // 2. 绘制箭头
  if (fabricStore.isDrawing && (fabricStore.mode === 'Arrow')) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      renderArrowPreview()
    }
  }

  // 3. 绘制矩形
  if (fabricStore.isDrawing && (fabricStore.mode === 'Rect')) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      renderRectPreview()
    }
  }

  // 4. 绘制圆
  if (fabricStore.isDrawing && (fabricStore.mode === 'Ellipse')) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      renderCirclePreview()
    }
  }

  // 5. 绘制直线
  if (fabricStore.isDrawing && (fabricStore.mode === 'Line')) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      renderLinePreview()
    }
  }

  // 6. 自由绘制
  if (fabricStore.isDrawing && (fabricStore.mode === 'FreeDraw' && evt.button === 1)) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      fabricStore.setFreeDrawPoints({ x, y })
      renderDrawPreview()
    }
  }
}
