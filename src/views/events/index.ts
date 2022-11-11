// 这个文件统一注册监听canvas上的事件
// 这里需要fabric的监听，自带的监听 HtmlElement 监听会有些属性没有 比如 absolutePointer 画布平移或放大的位置

import useCanvas from '../control/useCanvas'
import { useMouseDown } from './useMouseDown'
import { useMouseMove } from './useMouseMove'
import { useMouseUp } from './useMouseUp'
import { useMouseWheel } from './useMouseWheel'
import { usePointerDown } from './usePointerDown'
import { usePointerMove } from './usePointerMove'

export const addFabricCanvasEvent = () => {
  const [canvas] = useCanvas()
  canvas.on('mouse:down', useMouseDown)
  canvas.on('mouse:move', useMouseMove)
  canvas.on('mouse:up', useMouseUp)
  canvas.on('mouse:wheel', useMouseWheel)

  usePointerDown()
  usePointerMove()
}
