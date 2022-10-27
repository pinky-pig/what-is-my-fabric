import type { IObjectOptions, Object as TObject } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import useCanvas from '../control/useCanvas'
import { useFabricStore } from '~/store/modules/fabric'

export type insertType = 'D' | 'M' | 'L' | 'V' | 'H' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z'
export interface svgPathType { type: insertType; points: { x: number; y: number } }
export type FabricObject = TObject
export interface pointType { x: number; y: number }
/**
 * 这里是箭头， todo 扩展成为曲线箭头 Curve Arrow
 * <path d="M 0 0 L 10 10 z"> + 箭头
 *
 * 目前只有两个点，起点和终点。 todo 三个点， 起点，curve点 ，和终点
 */

export class Arrow {
  svgPath: pointType[]
  canvas = useCanvas()[0]
  fabricStore = useFabricStore()
  fabricObject: FabricObject | null = null
  id: number = Date.now()
  private _config: IObjectOptions = {
    name: String(this.id),
    strokeWidth: 1,
    strokeUniform: true,
    fill: 'red',
    hoverCursor: 'default',
    hasBorders: true,
    stroke: 'red',
    borderColor: '#00bfff',
    selectable: true,
    hasControls: true,
    flipX: false,
    flipY: false,
    evented: true,
  }

  constructor(svgPath: pointType[]) {
    this.svgPath = svgPath
  }

  set config(newConfig: IObjectOptions) {
    Object.assign(this._config, newConfig)
  }

  get config(): IObjectOptions {
    return this._config
  }

  // 生成箭头的svg路径
  svgPath2String(svgPath: pointType[]) {
    const [mouseFrom, mouseTo] = svgPath
    const x1 = mouseFrom.x
    const x2 = mouseTo.x
    const y1 = mouseFrom.y
    const y2 = mouseTo.y
    const w = x2 - x1
    const h = y2 - y1
    const sh = Math.cos(Math.PI / 4) * 16
    const sin = h / Math.sqrt(w ** 2 + h ** 2)
    const cos = w / Math.sqrt(w ** 2 + h ** 2)
    const w1 = (16 * sin) / 4
    const h1 = (16 * cos) / 4
    const centeX = sh * cos
    const centerY = sh * sin

    let path = ` M ${x1} ${y1}`
    path += ` L ${x2 - centeX + w1} ${y2 - centerY - h1}`
    path += ` L ${x2 - centeX + w1 * 2} ${y2 - centerY - h1 * 2}`
    path += ` L ${x2} ${y2}`
    path += ` L ${x2 - centeX - w1 * 2} ${y2 - centerY + h1 * 2}`
    path += ` L ${x2 - centeX - w1} ${y2 - centerY + h1}`
    path += ' Z'

    return path
  }

  get svgPathString() {
    return this.svgPath2String(this.svgPath)
  }

  getFabricObject(): FabricObject {
    return new fabric.Path(this.svgPathString, this.config)
  }

  render() {
    this.fabricObject = this.getFabricObject()
    this.canvas.add(this.fabricObject)
  }

  update() {

  }

  remove() {
    this.canvas.remove(this.fabricObject as FabricObject)
  }
}
