import { toggleSelection } from '../control/useCanvas'
import useKeyStoke from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 绘制]
 */

const [isPressedCtrl] = useKeyStoke()
export const useMouseDown = () => {
  const fabricStore = useFabricStore()
  useEventListener(fabricStore.wrapperRef, 'mousedown', (evt: WheelEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    // 按下ctrl和左键，拖拽画布
    if (evt.button === 0 && isPressedCtrl.value) {
      // 拖拽画布
      fabricStore.isCanvasDragging = true
      // 禁止选中
      toggleSelection(false)
    }

    // 按下左键，设置 mouseFrom 的点
    if (fabricStore.mode !== 'Hand') {
      if (evt.button === 0) {
        fabricStore.handleChangeIsDrawing(true)
        const { offsetX, offsetY } = evt
        fabricStore.mouseFrom = { x: offsetX, y: offsetY }
      }
    }

    // 右键
    if (evt.button === 2)
      toggleSelection(true)
  })
}
