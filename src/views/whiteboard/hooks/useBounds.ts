import { storeToRefs } from 'pinia'
import { getClosestElementBounds } from '../utils/bounds'
import { useSvgStore } from '~/store/modules/svg'

export function useBoundsBox() {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom, elements } = storeToRefs(store)

  function handlePointerDown(e) {
    if (store.mode === 'Hand' && e.buttons === 1) {
      const pt = eventToLocation(e)
      getClosestElementBounds(elements.value as any, pt)
    }
  }
  function handlePointerMove() {
  }
  function handlePointerUp() {
  }

  // 监听鼠标滚轮事件
  useEventListener(svgWrapperRef, 'pointerdown', handlePointerDown)
  useEventListener(svgWrapperRef, 'pointermove', handlePointerMove)
  useEventListener(svgWrapperRef, 'pointerup', handlePointerUp)

  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
}

