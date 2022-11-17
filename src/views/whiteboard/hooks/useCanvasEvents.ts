import type { Ref } from 'vue'
import { isPressedCtrl } from './useKeyEvents'

interface cfgType {
  viewPortX: number
  viewPortY: number
  viewPortWidth: number
  viewPortHeight: number
}

let draggedEvt: MouseEvent | TouchEvent | null = null
/**
   * 监听画布上的事件 （ onPointerDown|onPointerMove|onPointerUp ）
   * @param cfgRef 需要改变的缩放值
   * @param canvasRef 缩放画板DOM
   * @param viewPortZoomRef 缩放层级
   */
export function useCanvasEvents(
  cfgRef: Ref<cfgType>,
  canvasRef: Ref<HTMLDivElement | null>,
  viewPortZoomRef: Ref<number>,
  freeDrawPointsRef: Ref<(number[] | {
    x: number
    y: number
    pressure?: number
  })[]>,
) {
  // 更新设置viewBox的值（响应式，由参数传进来）
  function updateViewPort(x: number, y: number, w: number | null, h: number | null) {
    if (!canvasRef.value)
      return
    if (w === null && h !== null)
      w = canvasRef.value.offsetWidth * h / canvasRef.value.offsetHeight

    if (h === null && w !== null)
      h = canvasRef.value.offsetHeight * w / canvasRef.value.offsetWidth

    if (!w || !h)
      return
    cfgRef.value.viewPortX = parseFloat((1 * x).toPrecision(6))
    cfgRef.value.viewPortY = parseFloat((1 * y).toPrecision(6))
    cfgRef.value.viewPortWidth = parseFloat((1 * w).toPrecision(4))
    cfgRef.value.viewPortHeight = parseFloat((1 * h).toPrecision(4))
    viewPortZoomRef.value = cfgRef.value.viewPortWidth / canvasRef.value.offsetWidth
  }
  // 将鼠标的绝对位置转换成在画布中的位置
  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(canvasRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfgRef.value.viewPortX + (touch.clientX - left.value) * viewPortZoomRef.value
    const y = cfgRef.value.viewPortY + (touch.clientY - top.value) * viewPortZoomRef.value
    return { x, y }
  }
  // 拖拽画布
  function dragCanvas(event: MouseEvent | TouchEvent) {
    const pt = eventToLocation(event)
    if (draggedEvt) {
      const oriPt = eventToLocation(draggedEvt)
      const x = cfgRef.value.viewPortX + (oriPt.x - pt.x)
      const y = cfgRef.value.viewPortY + (oriPt.y - pt.y)
      const w = cfgRef.value.viewPortWidth
      const h = cfgRef.value.viewPortHeight

      updateViewPort(x, y, w, h)
    }
    draggedEvt = event
  }

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)
    freeDrawPointsRef.value = [[pt.x, pt.y, e.pressure]]
  }
  function handlePointerMove(e: PointerEvent) {
    if (isPressedCtrl.value) {
      // 移动画布
      dragCanvas(e)
    }
    else {
      if (e.buttons !== 1)
        return
      const pt = eventToLocation(e)
      freeDrawPointsRef.value = [...freeDrawPointsRef.value, [pt.x, pt.y, e.pressure]]
    }
  }
  function handlePointerUp() {
    draggedEvt = null
  }

  // 初始化画布
  function setViewPort() {
    if (!canvasRef.value)
      return
    cfgRef.value.viewPortWidth = canvasRef.value.offsetWidth
    cfgRef.value.viewPortHeight = canvasRef.value.offsetHeight
  }
  onMounted(() => {
    setViewPort()
  })

  // 监听鼠标滚轮事件
  useEventListener(canvasRef, 'pointerdown', handlePointerDown)
  useEventListener(canvasRef, 'pointermove', handlePointerMove)
  useEventListener(canvasRef, 'pointerup', handlePointerUp)
}

