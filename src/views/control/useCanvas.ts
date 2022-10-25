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
 */

const setViewport = (width, height) => {
  if (canvas) {
    canvas.setWidth(width)
    canvas.setHeight(height)
    canvas.renderAll()
  }
}

const initCanvas = () => {
  const fabricStore = useFabricStore()

  canvas = new fabric.Canvas(fabricStore.canvasRef, {
    width: fabricStore.getWidth(),
    height: fabricStore.getHeight(),
    preserveObjectStacking: true,
  })

  // 监听窗口大小变化，更新 canvas 画布
  const { width, height } = useElementBounding(fabricStore.wrapperRef)
  watchEffect(() => {
    setViewport(width.value, height.value)
  })

  // 设置背景图片
  setBackground()
  useMouseWheel()
  useMouseDown()
  useMouseMove()
  useMouseUp()
}

export default (): [ Canvas, typeof initCanvas] => [canvas as Canvas, initCanvas]
