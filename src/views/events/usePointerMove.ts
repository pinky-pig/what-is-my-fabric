import { useFabricStore } from '~/store/modules/fabric'

/**
 * 这里是自由绘制的时候，记录一下pressure的值。
 * 当画布拖拽或者放大时候，其坐标相对于画布的坐标不太准确，这里直接使用fabric.js的absolutePointer
 * 这里监听的是画布父级，所以肯定是先触发这个
 * 这里添加坐标 [x, y, pressure] ，到 fabric.js 的 mousemove 再修改位置
 */

export const usePointerMove = () => {
  const fabricStore = useFabricStore()
  useEventListener(fabricStore.wrapperRef, 'pointermove', (evt: PointerEvent) => {
    if (fabricStore.isDrawing && fabricStore.mode === 'FreeDraw')
      fabricStore.freeDrawPoints.push({ x: evt.x, y: evt.x, pressure: evt.pressure })
  })
}
