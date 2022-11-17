import type { Ref } from 'vue'

interface cfgType {
  viewPortX: number
  viewPortY: number
  viewPortWidth: number
  viewPortHeight: number
}
/**
 * 监听Dom缩放，并且设置viewPort。 这里cfgRef和viewPortZoomRef需要保持响应式，所以传进来的都是Ref
 * @param cfgRef 需要改变的缩放值
 * @param canvasRef 缩放画板DOM
 * @param viewPortZoomRef 缩放层级
 */
export function useZoomEvents(
  cfgRef: Ref<cfgType>,
  canvasRef: Ref<HTMLDivElement | null>,
  viewPortZoomRef: Ref<number>,
) {
  // 监听鼠标滚轮事件
  useEventListener(canvasRef, 'wheel', (e: WheelEvent) => {
    e.preventDefault()
    const scale = 1.005 ** e.deltaY
    const pt = eventToLocation(e)
    zoomViewPort(scale, pt)
  })
  // 将鼠标的绝对位置转换成在画布中的位置
  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(canvasRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfgRef.value.viewPortX + (touch.clientX - left.value) * viewPortZoomRef.value
    const y = cfgRef.value.viewPortY + (touch.clientY - top.value) * viewPortZoomRef.value
    return { x, y }
  }
  // 计算viewBox（画布尺寸）
  function zoomViewPort(scale: number, pt?: { x: number; y: number }) {
    if (!pt)
      pt = { x: cfgRef.value.viewPortX + 0.5 * cfgRef.value.viewPortWidth, y: cfgRef.value.viewPortY + 0.5 * cfgRef.value.viewPortHeight }
    const x = cfgRef.value.viewPortX + ((pt.x - cfgRef.value.viewPortX) - scale * (pt.x - cfgRef.value.viewPortX))
    const y = cfgRef.value.viewPortY + ((pt.y - cfgRef.value.viewPortY) - scale * (pt.y - cfgRef.value.viewPortY))
    const w = scale * cfgRef.value.viewPortWidth
    const h = scale * cfgRef.value.viewPortHeight
    updateViewPort(x, y, w, h)
  }
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
}
