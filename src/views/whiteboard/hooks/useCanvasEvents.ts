import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { generateFreeDrawPath } from '../components/element/DrawUtil'
import { generateUuid } from '../utils'
import { useRenderElement } from './useRenderElement'
import type { CurrentElementType } from '~/store/modules/svg'
import { useSvgStore } from '~/store/modules/svg'

type freeHandPointsType = (number[] | {
  x: number
  y: number
  pressure?: number
})[]

// 上一次的拖拽事件
let draggedEvt: MouseEvent | TouchEvent | null = null
// 自由绘制的点的集合
const freeDrawPoints: Ref<freeHandPointsType> = ref([])
/**
 * 监听画布上的事件 （ onPointerDown|onPointerMove|onPointerUp ）
 * 这里其实主要目的就是将画布上的坐标传给store中
 * onPointerDown -> mouseFrom
 * onPointerMove -> mouseTo
 * onPointerUp -> 设置状态
 * @param store 这里的参数都是在 store 中
 */
export function useCanvasEvents(currentDrawingElement: Ref<CurrentElementType | undefined>) {
  const store = useSvgStore()
  const { cfg, svgWrapperRef, viewPortZoom } = storeToRefs(store)

  function handlePointerDown(e: PointerEvent) {
    const pt = eventToLocation(e)
    store.mouseFrom = { x: pt.x, y: pt.y, pressure: e.pressure }

    // 1. 设置拖拽状态
    if (e.buttons === 1 && e.ctrlKey)
      store.changeCanvasState(true)
    // 2. 设置绘制状态
    if (store.mode !== 'Hand') {
      store.changeIsDrawing(true)
      freeDrawPoints.value = [[pt.x, pt.y, e.pressure]]
    }
  }
  function handlePointerMove(e: PointerEvent) {
    const pt = eventToLocation(e)

    // 1. 拖拽移动画布
    if (e.ctrlKey && store.isCanvasStateChanging)
      dragCanvas(e)

    // 2. 自由画笔绘制
    if (store.mode === 'FreeDraw' && e.buttons === 1) {
      freeDrawPoints.value = [...freeDrawPoints.value, [pt.x, pt.y, e.pressure]]
      currentDrawingElement.value = {
        id: generateUuid(),
        type: 'FreeDraw',
        path: generateFreeDrawPath(freeDrawPoints.value),
        style: { fill: 'black', stroke: 'black', strokeWidth: 2 },
      }
    }

    // 3. 绘制 element 图形
    if (store.mode !== 'FreeDraw' && store.mode !== 'Hand' && e.buttons === 1) {
      store.mouseTo = { x: pt.x, y: pt.y, pressure: e.pressure }
      const element = useRenderElement(store.mouseFrom, store.mouseTo, store.mode)
      currentDrawingElement.value = {
        id: generateUuid(),
        type: store.mode,
        path: element.path,
        style: element.style,
      }
    }
  }
  function handlePointerUp() {
    // 将上次的拖拽事件置为初始状态
    draggedEvt = null
    // 自由绘制的点的集合置为初始状态
    freeDrawPoints.value = []
    // 将当前的绘制对象添加给所有的要素中
    if (currentDrawingElement.value)
      store.elements.push(currentDrawingElement.value)

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

