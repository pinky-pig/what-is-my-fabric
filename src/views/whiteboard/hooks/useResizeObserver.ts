import type { Ref } from 'vue'

interface cfgType {
  viewPortX: number
  viewPortY: number
  viewPortWidth: number
  viewPortHeight: number
}
/**
 * 监听窗口尺寸改变
 * @param cfgRef 需要改变的缩放值
 * @param canvasRef 缩放画板DOM
 * @param viewPortZoomRef 缩放层级
 */
export function useResizeObserver(
  cfgRef: Ref<cfgType>,
  canvasRef: Ref<HTMLDivElement | null>,
  viewPortZoomRef: Ref<number>,
) {
  const { width, height } = useElementBounding(canvasRef)
  watch([width, height], (newValue, oldValue) => {
  // 过滤一下第一次。因为监听的是dom的长宽，第一次肯定会触发，长宽从0到设置的值。
  // 这个时候的差值就是dom元素本身，而不是窗口偏移的值，所以这个时候跳出方法
    if (oldValue[0] === 0 && oldValue[1] === 0)
      return

    const distanceX = (newValue[0] - oldValue[0]) * viewPortZoomRef.value
    const distanceY = (newValue[1] - oldValue[1]) * viewPortZoomRef.value
    const x = cfgRef.value.viewPortX
    const y = cfgRef.value.viewPortY
    const w = cfgRef.value.viewPortWidth + distanceX
    const h = cfgRef.value.viewPortHeight + distanceY

    updateViewPort(x, y, w, h)
  })

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
