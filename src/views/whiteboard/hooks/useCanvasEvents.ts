import { useSvgStore } from '~/store/modules/svg'

/* eslint-disable @typescript-eslint/no-unused-vars */
// export function useCanvasEvents() {
//   let draggedEvt: any = null // 每次的拖拽事件

//   function handlePointerDown(e: PointerEvent) {
//     if (!e.target)
//       return
//     const pt = eventToLocation(e)
//     points.value = [[pt.x, pt.y, e.pressure]]
//   }
//   function handlePointerMove(e: PointerEvent) {

//   }
//   function handlePointerUp(e: PointerEvent) {
//     draggedEvt = null
//   }

//   return { handlePointerDown, handlePointerMove, handlePointerUp }
// }
export function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
  const store = useSvgStore()
  const { top, left } = useElementBounding(store.svgWrapperRef)
  const touch = event instanceof MouseEvent ? event : event.touches[idx]
  const x = store.cfg.viewPortX + (touch.clientX - left.value) * store.viewPortZoom
  const y = store.cfg.viewPortY + (touch.clientY - top.value) * store.viewPortZoom
  return { x, y }
}
