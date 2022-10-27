import type { IEvent, IPoint } from 'fabric/fabric-impl'
import useCanvas from '../control/useCanvas'
import useKeyStoke from './useKeyStoke'

import { useFabricStore } from '~/store/modules/fabric'
const [isPressedCtrl] = useKeyStoke()

// 最大最小缩放的值
const zoomLimit = { min: 0.5, max: 2 }
export const useMouseWheel = ({ e, pointer }: IEvent<WheelEvent>) => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()
  e.preventDefault()
  e.stopPropagation()
  if (isPressedCtrl.value) {
    // 获取滚动值 向上滚一下是 -100，向下滚一下是 100
    const delta = e.deltaY
    // 当前zoom缩放值
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > zoomLimit.max)
      zoom = zoomLimit.max
    else if (zoom < zoomLimit.min)
      zoom = zoomLimit.min
    fabricStore.zoom = zoom
    // 鼠标移动滚动的点位
    canvas.zoomToPoint(pointer as IPoint, zoom)
    canvas.renderAll()
  }
}
