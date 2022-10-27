import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键松开的时候也是有几种可能，
 * 1. 拖拽停止
 */

export const useMouseUp = () => {
  const fabricStore = useFabricStore()
  useEventListener(fabricStore.wrapperRef, 'mouseup', (evt: MouseEvent) => {
    evt.preventDefault()

    fabricStore.isCanvasDragging = false

    // 绘制停止，要将缓存清除，还有(mouseFrom、mouseTo)可选。这里建议将方法放到store中
    fabricStore.handleChangeIsDrawing(false)
  })
}
