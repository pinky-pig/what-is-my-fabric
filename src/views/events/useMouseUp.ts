import { useFabricStore } from '~/store/modules/fabric'

/**
 * 鼠标左键松开的时候也是有几种可能，
 * 1. 拖拽停止
 */

export const useMouseUp = () => {
  const fabricStore = useFabricStore()

  if (fabricStore.isCanvasDragging)
    fabricStore.handleChangeIsCanvasDragging(false)

  // 绘制停止
  if (fabricStore.isDrawing)
    fabricStore.handleChangeIsDrawing(false)
}
