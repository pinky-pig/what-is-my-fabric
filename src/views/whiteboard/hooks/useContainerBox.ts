import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { generateUuid } from '../utils'
import { getShapeStyle } from '../components/element/shared'
import { ColorStyle, DashStyle, SizeStyle } from '../types'
import type { CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'

export function useContainerBox(containerBoxElement: Ref<CurrentElementType | undefined>) {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom } = storeToRefs(store)

  function handlePointerMove(e: PointerEvent) {
    const pt = eventToLocation(e)
    if (store.mode === 'Hand' && e.buttons === 1) {
      store.mouseTo = { x: pt.x, y: pt.y, pressure: e.pressure }
      const style = getShapeStyle({
        color: ColorStyle.LightGray, size: SizeStyle.Small, isFilled: true, dash: DashStyle.Solid,
      }, false)
      containerBoxElement.value = {
        id: generateUuid(),
        type: 'Hand',
        path: getContainerBoxPath([store.mouseFrom.x, store.mouseFrom.y], [store.mouseTo.x, store.mouseTo.y]),
        style: {
          ...style,
          fill: `${style.fill}60`,
        },
      }
    }
  }
  function handlePointerUp() {
    containerBoxElement.value = undefined
  }

  // 监听鼠标滚轮事件
  useEventListener(svgWrapperRef, 'pointermove', handlePointerMove)
  useEventListener(svgWrapperRef, 'pointerup', handlePointerUp)

  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }

  function getContainerBoxPath(mouseFromPoint: number[], mouseToPoint: number[]) {
    const path = `M ${mouseFromPoint[0]} ${mouseFromPoint[1]}
      L ${mouseToPoint[0]} ${mouseFromPoint[1]}
      L ${mouseToPoint[0]} ${mouseToPoint[1]}
      L ${mouseFromPoint[0]} ${mouseToPoint[1]}
      L ${mouseFromPoint[0]} ${mouseFromPoint[1]} z`
    return path
  }
}

