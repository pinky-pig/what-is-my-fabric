import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import getStroke from 'perfect-freehand'
import { getSvgPathFromStroke } from '../../utils'
import { useSvgStore } from '~/store/modules/svg'

type freeHandPointsType = (number[] | {
  x: number
  y: number
  pressure?: number
})[]

// 橡皮擦点的集合
const erasePoints: Ref<freeHandPointsType> = ref([])
/**
 * 主要是动态绘制点集，然后通过requestAnimationFrame 去splice头部的点
 * @param erasePath 响应式橡皮擦路径
 */
export function useErase(erasePath: Ref<string | undefined>) {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom } = storeToRefs(store)

  let timestamp = 0
  let interval = 0

  watch(() => erasePoints.value, () => {
    const stroke = getStroke(erasePoints.value, { size: 18, start: { taper: true } })
    erasePath.value = getSvgPathFromStroke(stroke)
  }, {
    deep: true,
  })

  function loop() {
    const now = Date.now()
    const elapsed2 = now - timestamp
    if (elapsed2 > 32) {
      if (erasePoints.value.length > 1) {
        erasePoints.value.splice(0, Math.ceil(erasePoints.value.length * 0.1))
        timestamp = now
      }
    }
    interval = requestAnimationFrame(loop)
  }

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)
    erasePoints.value = [[pt.x, pt.y, e.pressure]]
    loop()
  }
  function handlePointerMove(e: PointerEvent) {
    const pt = eventToLocation(e)
    if (e.buttons !== 1)
      return
    erasePoints.value = [...erasePoints.value, [pt.x, pt.y, e.pressure]]
  }
  function handlePointerUp() {
    cancelAnimationFrame(interval)
    erasePath.value = undefined
  }

  // 监听鼠标事件
  watch(() => store.mode, (nVal) => {
    if (nVal === 'Erase') {
      if (svgWrapperRef.value) {
        svgWrapperRef.value.addEventListener('pointerdown', handlePointerDown, false)
        svgWrapperRef.value.addEventListener('pointermove', handlePointerMove, false)
        svgWrapperRef.value.addEventListener('pointerup', handlePointerUp, false)
      }
    }
    else {
      if (svgWrapperRef.value) {
        svgWrapperRef.value.removeEventListener('pointerdown', handlePointerDown)
        svgWrapperRef.value.removeEventListener('pointermove', handlePointerMove)
        svgWrapperRef.value.removeEventListener('pointerup', handlePointerUp)
      }
    }
  })

  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
}

