import '../utils/initFabricPrototype'
import { fabric } from 'fabric'
import type { Canvas } from 'fabric/fabric-impl'
import { useMouseWheel } from '../events/useMouseWheel'
import { useMouseDown } from '../events/useMouseDown'
import { useMouseMove } from '../events/useMouseMove'
import { useMouseUp } from '../events/useMouseUp'
import { setBackground } from './useOperate'
import { useFabricStore } from '~/store/modules/fabric'
let canvas: null | Canvas = null
/**
 * canvas 画布相关
 * 1. 初始化画布
 * 2. 动态监听dom尺寸设置canvas尺寸
 * 3. 画布是否可选择
 */

const setViewport = (width, height) => {
  if (canvas) {
    canvas.setWidth(width)
    canvas.setHeight(height)
    canvas.renderAll()
  }
}

// 切换 Fabric Canvas 可否区域选择
export const toggleSelection = (selection?: boolean) => {
  if (!canvas)
    return
  // 这个禁止选中方法没有生效
  canvas.selection = selection !== undefined ? selection : !canvas.selection
  // 补充使用这个让其画布上的元素禁止选中
  fabric.Object.prototype.selectable = canvas.selection

  // 补充这个方法，禁止选中所有元素
  // canvas.getObjects().forEach(i => i.set('selectable', selection))
}

const initCanvas = () => {
  const fabricStore = useFabricStore()

  canvas = new fabric.Canvas(fabricStore.canvasRef, {
    width: fabricStore.getWidth(),
    height: fabricStore.getHeight(),
  })

  // 监听窗口大小变化，更新 canvas 画布
  const { width, height } = useElementBounding(fabricStore.wrapperRef)
  watchEffect(() => {
    setViewport(width.value, height.value)
  })

  toggleSelection(false)

  // 设置背景图片
  setBackground()
  useMouseWheel()
  useMouseDown()
  useMouseMove()
  useMouseUp()
}

export default (): [ Canvas, typeof initCanvas] => [canvas as Canvas, initCanvas]
