import { fabric } from 'fabric'
import type { IEvent } from 'fabric/fabric-impl'
import { renderArrowPreview } from '../control/useDraw'
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
  // useEventListener(fabricStore.wrapperRef, 'mousemove', (evt: MouseEvent) => {

  if (isPressedCtrl.value && fabricStore.isCanvasDragging) {
    // 拖拽移动画布
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

  if (fabricStore.isDrawing && (fabricStore.mode === 'Arrow')) {
    if (evt.absolutePointer) {
      const { x, y } = evt.absolutePointer
      fabricStore.mouseTo = { x, y }
      renderArrowPreview()
    }
  }
  // })
}
