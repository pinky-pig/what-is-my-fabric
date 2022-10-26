import type { IObjectOptions, Object as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export type insertType = 'D' | 'M' | 'L' | 'V' | 'H' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
export interface svgPathType { type: insertType; points: { x: number; y: number } }
export type FabricObject = TObject

/**
 * 这里是箭头， todo 扩展成为曲线箭头 Curve Arrow
 * <path d="M 0 0 L 10 10 z"> + 箭头
 *
 * 目前只有两个点，起点和终点。 todo 三个点， 起点，curve点 ，和终点
 */

export class Line {
  svgPath: svgPathType[]
  canvas = useCanvas()[0]
  fabricStore = useFabricStore()
  fabricObject: FabricObject | null = null
  id: number = Date.now()
  private _config: IObjectOptions = {
    name: String(this.id),
    strokeWidth: 1,
    strokeUniform: true,
    fill: '#00bfff',
    hoverCursor: 'default',
    hasBorders: true,
    stroke: '#00bfff',
    borderColor: '#00bfff',
    selectable: true,
    hasControls: true,
    flipX: false,
    flipY: false,
    evented: true,
  }

  constructor(svgPath: svgPathType[]) {
    this.svgPath = svgPath
  }

  set config(newConfig: IObjectOptions) {
    Object.assign(this._config, newConfig)
  }

  get config(): IObjectOptions {
    return this._config
  }

  // 将 svg 路径转为 string
  svgPath2Text(svgPath: svgPathType[]) {
    return svgPath
      .map(path => `${path.type} ${path.points.x} ${path.points.y}`)
      .join(' ')
  }

  get svgPathText() {
    return `${this.svgPath2Text(this.svgPath)}`
  }

  getFabricObject(): FabricObject {
    const path1 = new fabric.Path(this.svgPathText)
    path1.set({ left: 120, top: 120, fill: 'red' })

    const path = new fabric.Path('M 0 0 L 200 100 L 170 200 z')
    path.set({ left: 120, top: 120, fill: 'red' })
    return path1
  }

  render() {
    // this.fabricObject = this.getFabricObject()
    // this.canvas.add(this.fabricObject)

    const x1 = this.fabricStore.mouseFrom.x
    const x2 = this.fabricStore.mouseTo.x
    const y1 = this.fabricStore.mouseFrom.y
    const y2 = this.fabricStore.mouseTo.y
    const w = x2 - x1
    const h = y2 - y1
    const sh = Math.cos(Math.PI / 4) * 16
    const sin = h / Math.sqrt(w ** 2 + h ** 2)
    const cos = w / Math.sqrt(w ** 2 + h ** 2)
    const w1 = (16 * sin) / 4
    const h1 = (16 * cos) / 4
    const centerx = sh * cos
    const centery = sh * sin

    let path = ` M ${x1} ${y1}`
    path += ` L ${x2 - centerx + w1} ${y2 - centery - h1}`
    path += ` L ${x2 - centerx + w1 * 2} ${y2 - centery - h1 * 2}`
    path += ` L ${x2} ${y2}`
    path += ` L ${x2 - centerx - w1 * 2} ${y2 - centery + h1 * 2}`
    path += ` L ${x2 - centerx - w1} ${y2 - centery + h1}`
    path += ' Z'
    const canvasObject = new fabric.Path(path, this.config)
    this.canvas.add(canvasObject)
  }
}
