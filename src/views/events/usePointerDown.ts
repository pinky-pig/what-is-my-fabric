import { useFabricStore } from '~/store/modules/fabric'

/**
 * 这里是自由绘制的时候，记录一下pressure的值。
 * 当画布拖拽或者放大时候，其坐标相对于画布的坐标不太准确，这里直接使用fabric.js的absolutePointer
 * 因为这里监听的是 fabric.js 画布的父级，所以这里先执行，这里也需要设置绘制状态为true。因为在move的时候，需要判断当前的绘制状态
 */

export const usePointerDown = () => {
  const fabricStore = useFabricStore()
  useEventListener(fabricStore.wrapperRef, 'pointerdown', (evt: PointerEvent) => {
    if (fabricStore.mode !== 'Hand' && evt.button === 0) {
      fabricStore.handleChangeIsDrawing(true)
      fabricStore.setMouseFrom({ pressure: evt.pressure })
    }
  })
}
