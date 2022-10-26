import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { isPressedCtrl } from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 移动]
 */
let previousEvent: null | MouseEvent = null

export const useMouseMove = () => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()
  useEventListener(fabricStore.wrapperRef, 'mousemove', (evt: MouseEvent) => {
    evt.preventDefault()

    if (isPressedCtrl.value && fabricStore.isCanvasDragging) {
      // 拖拽移动画布
      let { movementX, movementY } = evt
      if (
        (movementX === undefined || movementY === undefined)
        && previousEvent
      ) {
        movementX = evt.screenX - previousEvent?.screenX
        movementY = evt.screenY - previousEvent?.screenY
      }
      const delta = new fabric.Point(movementX, movementY)
      canvas.relativePan(delta)
      previousEvent = evt

      // 将选中的取消。只有在移动的时候才取消选中。
      canvas.discardActiveObject()
    }
  })
}
