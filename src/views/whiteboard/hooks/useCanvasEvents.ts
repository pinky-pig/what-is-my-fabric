/* eslint-disable @typescript-eslint/no-unused-vars */
import getStroke from 'perfect-freehand'
import { storeToRefs } from 'pinia'
import { getSvgPathFromStroke } from '../utils'
import { useSvgStore } from '~/store/modules/svg'

// 上一次的拖拽事件
let draggedEvt: MouseEvent | TouchEvent | null = null
/**
 * 监听画布上的事件 （ onPointerDown|onPointerMove|onPointerUp ）
 * 这里其实主要目的就是将画布上的坐标传给store中
 * onPointerDown -> mouseFrom
 * onPointerMove -> mouseTo
 * onPointerUp -> 设置状态
 * @param store 这里的参数都是在 store 中
 */
export function useCanvasEvents() {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom, freeDrawPoints, elements } = storeToRefs(store)

  function handlePointerDown(e: PointerEvent) {
    // 1. 设置拖拽状态
    if (e.buttons === 1 && e.ctrlKey)
      store.changeCanvasState(true)
    // 2. 设置绘制状态
    if (store.mode !== 'Hand') {
      store.changeIsDrawing(true)
      const pt = eventToLocation(e)
      store.mouseFrom = { x: pt.x, y: pt.y, pressure: e.pressure }
      freeDrawPoints.value = [[pt.x, pt.y, e.pressure]]
    }
  }
  function handlePointerMove(e: PointerEvent) {
    // 1. 拖拽移动画布
    if (e.ctrlKey && store.isCanvasStateChanging)
      dragCanvas(e)

    // 2. 自由绘制
    if (store.mode === 'FreeDraw' && e.buttons === 1) {
      const pt = eventToLocation(e)
      freeDrawPoints.value = [...freeDrawPoints.value, [pt.x, pt.y, e.pressure]]

      const options = {
        size: 10,
        thinning: 0.618,
        smoothing: 0.5,
        streamline: 0.5,
      }
      store.currentDrawingPath = computed(() => {
        return getSvgPathFromStroke(
          getStroke(freeDrawPoints.value, options),
        )
      }).value
    }
  }
  function handlePointerUp() {
    // 将上次的拖拽事件置为初始状态
    draggedEvt = null

    // 拖拽停止
    if (store.isCanvasStateChanging)
      store.changeCanvasState(false)

    // 绘制停止
    if (store.isDrawing)
      store.changeIsDrawing(false)
  }

  // 监听鼠标滚轮事件
  useEventListener(svgWrapperRef, 'pointerdown', handlePointerDown)
  useEventListener(svgWrapperRef, 'pointermove', handlePointerMove)
  useEventListener(svgWrapperRef, 'pointerup', handlePointerUp)

  // 初始化画布
  function setViewPort() {
    if (!svgWrapperRef.value)
      return
    cfg.value.viewPortWidth = svgWrapperRef.value.offsetWidth
    cfg.value.viewPortHeight = svgWrapperRef.value.offsetHeight
  }
  onMounted(() => {
    setViewPort()
  })
  function updateViewPort(x: number, y: number, w: number | null, h: number | null) {
    if (!svgWrapperRef.value)
      return
    if (w === null && h !== null)
      w = svgWrapperRef.value.offsetWidth * h / svgWrapperRef.value.offsetHeight

    if (h === null && w !== null)
      h = svgWrapperRef.value.offsetHeight * w / svgWrapperRef.value.offsetWidth

    if (!w || !h)
      return
    cfg.value.viewPortX = parseFloat((1 * x).toPrecision(6))
    cfg.value.viewPortY = parseFloat((1 * y).toPrecision(6))
    cfg.value.viewPortWidth = parseFloat((1 * w).toPrecision(4))
    cfg.value.viewPortHeight = parseFloat((1 * h).toPrecision(4))
    viewPortZoom.value = cfg.value.viewPortWidth / svgWrapperRef.value.offsetWidth
  }
  function eventToLocation(event: MouseEvent | TouchEvent, idx = 0): { x: number; y: number } {
    const { top, left } = useElementBounding(svgWrapperRef)
    const touch = event instanceof MouseEvent ? event : event.touches[idx]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * viewPortZoom.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * viewPortZoom.value
    return { x, y }
  }
  function dragCanvas(event: MouseEvent | TouchEvent) {
    const pt = eventToLocation(event)
    if (draggedEvt) {
      const oriPt = eventToLocation(draggedEvt)
      const x = cfg.value.viewPortX + (oriPt.x - pt.x)
      const y = cfg.value.viewPortY + (oriPt.y - pt.y)
      const w = cfg.value.viewPortWidth
      const h = cfg.value.viewPortHeight

      updateViewPort(x, y, w, h)
    }
    draggedEvt = event
  }
}

