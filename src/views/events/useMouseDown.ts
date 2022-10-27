import type { IEvent } from 'fabric/fabric-impl'
import { toggleSelection } from '../control/useCanvas'
import useKeyStoke from './useKeyStoke'
import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键按下有几种可能 [拖拽画布, 框选, 绘制]
 */

const [isPressedCtrl] = useKeyStoke()
export const useMouseDown = (evt: IEvent<MouseEvent>) => {
  const fabricStore = useFabricStore()

  // 按下ctrl和左键，拖拽画布
  if (evt.button === 1 && isPressedCtrl.value) {
    // 拖拽画布
    fabricStore.isCanvasDragging = true
    // 禁止选中
    toggleSelection(false)
  }

  // 按下左键，设置 mouseFrom 的点
  if (fabricStore.mode !== 'Hand') {
    if (evt.button === 1) {
      fabricStore.handleChangeIsDrawing(true)
      if (evt.absolutePointer) {
        const { x, y } = evt.absolutePointer
        fabricStore.mouseFrom = { x, y }
      }
    }
  }

  // 右键
  if (evt.button === 3)
    toggleSelection(true)
}
