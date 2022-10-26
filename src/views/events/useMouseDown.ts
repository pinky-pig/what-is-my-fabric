import { toggleSelection } from '../control/useCanvas'
import { isPressedCtrl } from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 移动]
 */

export const useMouseDown = () => {
  const fabricStore = useFabricStore()
  useEventListener(fabricStore.wrapperRef, 'mousedown', (evt: WheelEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    if (isPressedCtrl.value) {
      // 左键
      if (evt.button === 0) {
        // 拖拽画布
        fabricStore.isCanvasDragging = true
        // 禁止选中
        toggleSelection(false)
      }
    }

    // 右键
    if (evt.button === 2)
      toggleSelection(true)
  })
}
