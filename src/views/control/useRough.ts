import { fabric } from 'fabric'
import rough from 'roughjs'
import useCanvas from './useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export const useRough = () => {
  const fabricStore = useFabricStore()
  const [canvas] = useCanvas()

  const circle = new fabric.Circle({
    top: 100,
    left: 100,
    radius: 100,
    stroke: 'black',
    strokeWidth: 2,
    fill: 'red',
    objectCaching: false,
  })

  let _circle: any = null
  const roughRender = () => {
    if (!fabricStore.canvasRef)
      return
    // 添加rough.js渲染器
    const rc = rough.canvas(fabricStore.canvasRef)
    if (!_circle) {
      _circle = rc.circle(0, 0, 100 * 2, {
        strokeWidth: 2,
        stroke: 'red',
        fill: '#13556890',
        fillWeight: 1,
        fillStyle: 'hachure',
        hachureGap: 10,
        roughness: 2,
      })
    }
    else {
      rc.draw(_circle)
    }
  }

  circle._render = roughRender

  canvas.add(circle).renderAll()
}
