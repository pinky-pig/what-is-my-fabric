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

  const rect = new fabric.Rect({
    top: 50, // 距离画布上边的距离
    left: 100, // 距离画布左侧的距离，单位是像素
    width: 100, // 矩形的宽度
    height: 70, // 矩形的高度
    fill: 'red', // 填充的颜色
    stroke: 'orange', // 边框原色
    strokeWidth: 5, // 边框大小
    rx: 8, // 圆角半径
    ry: 4, // 圆角半径
  })

  canvas.add(rect)

  toggleSelection(false)

  // 设置背景图片
  setBackground()
  useMouseWheel()
  useMouseDown()
  useMouseMove()
  useMouseUp()
}

export default (): [ Canvas, typeof initCanvas] => [canvas as Canvas, initCanvas]
