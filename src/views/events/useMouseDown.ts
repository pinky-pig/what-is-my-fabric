import useCanvas from '../control/useCanvas'
import { isPressedCtrl } from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 移动]
 */

export const useMouseDown = () => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()
  useEventListener(fabricStore.wrapperRef, 'mousedown', (evt: WheelEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    if (isPressedCtrl.value) {
      // 拖拽画布
      fabricStore.isCanvasDragging = true
      canvas.selection = false
    }
    if (canvas)
      canvas.selection = false
  })
}
