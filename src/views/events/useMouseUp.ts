import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键松开的时候也是有几种可能，
 * 1. 拖拽停止
 */

export const useMouseUp = () => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()
  useEventListener(fabricStore.wrapperRef, 'mouseup', (evt: MouseEvent) => {
    evt.preventDefault()

    fabricStore.isCanvasDragging = false
    if (canvas)
      canvas.selection = true
  })
}
